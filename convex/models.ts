import { internalMutationGeneric as internalMutation, queryGeneric as query } from "convex/server";
import { v } from "convex/values";
import { requireUser } from "./lib/auth";

const benchmarkValidator = v.object({
  metric: v.string(), score: v.number(), rawValue: v.optional(v.any()), normalizedValue: v.optional(v.number()), category: v.optional(v.string()),
  sourceUrl: v.optional(v.string()), modelVersion: v.optional(v.string()), sourceVersion: v.optional(v.string()), measuredAt: v.number(), confidence: v.string(), notes: v.optional(v.string()),
});
const priceValidator = v.object({
  pricingType: v.string(), amount: v.number(), unit: v.string(), currency: v.string(), sourceUrl: v.optional(v.string()), modelVersion: v.optional(v.string()),
  sourceVersion: v.optional(v.string()), confidence: v.optional(v.string()), notes: v.optional(v.string()), effectiveAt: v.number(),
});
const modelValidator = v.object({
  canonicalId: v.string(), name: v.string(), provider: v.string(), aliases: v.array(v.string()), modalities: v.array(v.string()), capabilities: v.array(v.string()),
  contextWindow: v.optional(v.number()), releaseDate: v.optional(v.string()), active: v.boolean(),
  status: v.union(v.literal("pending_evidence"), v.literal("eligible"), v.literal("manual_review"), v.literal("inactive")),
  mappingConfidence: v.union(v.literal("exact"), v.literal("explicit_alias"), v.literal("unmatched")), manualReviewRequired: v.boolean(), regions: v.array(v.string()),
  benchmarks: v.array(benchmarkValidator), prices: v.array(priceValidator),
  privacy: v.array(v.object({ level: v.string(), sourceUrl: v.string(), confidence: v.string(), notes: v.optional(v.string()) })),
  licenses: v.array(v.object({ commercialUse: v.boolean(), sourceUrl: v.string(), confidence: v.string(), notes: v.optional(v.string()) })),
});

function union(left: string[] | undefined, right: string[]) { return [...new Set([...(left ?? []), ...right])]; }

export const ingest = internalMutation({
  args: { source: v.string(), retrievedAt: v.number(), models: v.array(modelValidator) },
  handler: async (ctx, args) => {
    let createdCount = 0;
    let updatedCount = 0;
    let recordsImported = 0;
    for (const model of args.models) {
      const existing = await ctx.db.query("canonicalModels").withIndex("by_canonical_id", (q) => q.eq("canonicalId", model.canonicalId)).unique();
      const values = {
        canonicalId: model.canonicalId,
        name: existing?.name ?? model.name,
        provider: existing?.provider ?? model.provider,
        aliases: union(existing?.aliases, model.aliases),
        modalities: union(existing?.modalities, model.modalities),
        capabilities: union(existing?.capabilities, model.capabilities),
        contextWindow: model.contextWindow ?? existing?.contextWindow,
        releaseDate: model.releaseDate ?? existing?.releaseDate,
        active: model.active && (existing?.active ?? true),
        status: model.manualReviewRequired ? "manual_review" as const : existing?.status ?? "pending_evidence" as const,
        mappingConfidence: existing?.mappingConfidence === "exact" || model.mappingConfidence === "exact" ? "exact" as const : model.mappingConfidence,
        manualReviewRequired: Boolean(existing?.manualReviewRequired || model.manualReviewRequired),
        regions: union(existing?.regions, model.regions),
        updatedAt: args.retrievedAt,
      };
      const modelId = existing ? existing._id : await ctx.db.insert("canonicalModels", values);
      if (existing) { await ctx.db.patch(existing._id, values); updatedCount += 1; } else createdCount += 1;

      for (const observation of model.benchmarks) {
        await ctx.db.insert("benchmarkObservations", { modelId, ...observation, source: args.source, retrievedAt: args.retrievedAt });
        recordsImported += 1;
      }
      for (const observation of model.prices) {
        await ctx.db.insert("pricingObservations", { modelId, ...observation, source: args.source, retrievedAt: args.retrievedAt });
        recordsImported += 1;
      }
      for (const observation of model.privacy) {
        await ctx.db.insert("privacyObservations", { modelId, ...observation, source: args.source, retrievedAt: args.retrievedAt });
        recordsImported += 1;
      }
      for (const observation of model.licenses) {
        await ctx.db.insert("licenseObservations", { modelId, ...observation, source: args.source, retrievedAt: args.retrievedAt });
        recordsImported += 1;
      }

      const [benchmarks, prices] = await Promise.all([
        ctx.db.query("benchmarkObservations").withIndex("by_model_metric", (q) => q.eq("modelId", modelId)).take(1),
        ctx.db.query("pricingObservations").withIndex("by_model_type", (q) => q.eq("modelId", modelId)).collect(),
      ]);
      const current = await ctx.db.get(modelId);
      const hasInput = prices.some((item) => item.pricingType === "input_tokens");
      const hasOutput = prices.some((item) => item.pricingType === "output_tokens");
      const eligible = Boolean(current && !current.manualReviewRequired && current.active && current.modalities.length && current.contextWindow && benchmarks.length && hasInput && hasOutput);
      await ctx.db.patch(modelId, { status: current?.active === false ? "inactive" : eligible ? "eligible" : current?.manualReviewRequired ? "manual_review" : "pending_evidence" });
    }
    return { createdCount, updatedCount, recordsImported };
  },
});

function latestBy<T extends { source: string; retrievedAt: number }>(items: T[], key: (item: T) => string) {
  const result = new Map<string, T>();
  for (const item of items.sort((a, b) => b.retrievedAt - a.retrievedAt)) {
    const identity = `${item.source}:${key(item)}`;
    if (!result.has(identity)) result.set(identity, item);
  }
  return [...result.values()];
}

export const catalog = query({ args: {}, handler: async (ctx) => {
  await requireUser(ctx);
  const models = await ctx.db.query("canonicalModels").collect();
  return Promise.all(models.filter((model) => model.active && model.status === "eligible").map(async (model) => {
    const [benchmarks, prices, privacy, licenses] = await Promise.all([
      ctx.db.query("benchmarkObservations").withIndex("by_model_metric", (q) => q.eq("modelId", model._id)).order("desc").collect(),
      ctx.db.query("pricingObservations").withIndex("by_model_type", (q) => q.eq("modelId", model._id)).order("desc").collect(),
      ctx.db.query("privacyObservations").withIndex("by_model", (q) => q.eq("modelId", model._id)).order("desc").collect(),
      ctx.db.query("licenseObservations").withIndex("by_model", (q) => q.eq("modelId", model._id)).order("desc").collect(),
    ]);
    return {
      ...model,
      benchmarks: latestBy(benchmarks, (item) => `${item.metric}:${item.modelVersion ?? ""}`),
      prices: latestBy(prices, (item) => `${item.pricingType}:${item.modelVersion ?? ""}`),
      privacy: latestBy(privacy, (item) => item.level),
      licenses: latestBy(licenses, (item) => String(item.commercialUse)),
    };
  }));
} });
