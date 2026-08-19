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
  accessOptions: v.optional(v.array(v.object({ label: v.string(), url: v.string(), modelId: v.string(), sourceUrl: v.string(), verifiedAt: v.number() }))),
  benchmarks: v.array(benchmarkValidator), prices: v.array(priceValidator),
  privacy: v.array(v.object({ level: v.string(), sourceUrl: v.string(), confidence: v.string(), notes: v.optional(v.string()) })),
  licenses: v.array(v.object({ commercialUse: v.boolean(), sourceUrl: v.string(), confidence: v.string(), notes: v.optional(v.string()) })),
});

function union(left: string[] | undefined, right: string[]) { return [...new Set([...(left ?? []), ...right])]; }
function mergeAccessOptions(left: Array<{ label: string; url: string; modelId: string; sourceUrl: string; verifiedAt: number }> | undefined, right: Array<{ label: string; url: string; modelId: string; sourceUrl: string; verifiedAt: number }>) {
  const options = new Map<string, { label: string; url: string; modelId: string; sourceUrl: string; verifiedAt: number }>();
  for (const option of [...(left ?? []), ...right].sort((a, b) => a.verifiedAt - b.verifiedAt)) options.set(`${option.modelId}:${option.url}`, option);
  return [...options.values()];
}
function mediaFamilyKey(name: string) {
  return name.toLowerCase()
    .replace(/^[^:]{1,40}:\s*/, "")
    .replace(/\((?:high|medium|low|standard|quality)\)\s*$/i, "")
    .replace(/\[(?:max|high|medium|low)\]/gi, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export const ingest = internalMutation({
  args: { source: v.string(), retrievedAt: v.number(), models: v.array(modelValidator) },
  handler: async (ctx, args) => {
    let createdCount = 0;
    let updatedCount = 0;
    let recordsImported = 0;
    const currentModels = await ctx.db.query("canonicalModels").collect();
    const mediaFamilies = new Map<string, typeof currentModels>();
    for (const current of currentModels.filter((item) => !item.canonicalId.startsWith("artificial-analysis/") && (item.capabilities.includes("image_generation") || item.capabilities.includes("video_generation")))) {
      const key = mediaFamilyKey(current.name);
      mediaFamilies.set(key, [...(mediaFamilies.get(key) ?? []), current]);
    }
    for (const model of args.models) {
      const mediaMatch = model.canonicalId.startsWith("artificial-analysis/") ? mediaFamilies.get(mediaFamilyKey(model.name)) : undefined;
      const canonicalId = mediaMatch?.length === 1 ? mediaMatch[0].canonicalId : model.canonicalId;
      const existing = await ctx.db.query("canonicalModels").withIndex("by_canonical_id", (q) => q.eq("canonicalId", canonicalId)).unique();
      const values = {
        canonicalId,
        name: model.mappingConfidence === "unmatched" ? existing?.name ?? model.name : model.name,
        provider: model.mappingConfidence === "unmatched" ? existing?.provider ?? model.provider : model.provider,
        aliases: union(existing?.aliases, [...model.aliases, model.canonicalId]),
        modalities: union(existing?.modalities, model.modalities),
        capabilities: union(existing?.capabilities, model.capabilities),
        contextWindow: model.contextWindow ?? existing?.contextWindow,
        releaseDate: model.releaseDate ?? existing?.releaseDate,
        active: model.active && (existing?.active ?? true),
        status: model.manualReviewRequired ? "manual_review" as const : existing?.status ?? "pending_evidence" as const,
        mappingConfidence: existing?.mappingConfidence === "exact" || model.mappingConfidence === "exact" ? "exact" as const : model.mappingConfidence,
        manualReviewRequired: Boolean(existing?.manualReviewRequired || model.manualReviewRequired),
        regions: union(existing?.regions, model.regions),
        accessOptions: mergeAccessOptions(existing?.accessOptions, model.accessOptions ?? []),
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

      const pricesFor = (pricingType: string) => ctx.db.query("pricingObservations").withIndex(
        "by_model_type",
        // Generic Convex server types do not expose chained equality fields, but the declared index does.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (q: any) => q.eq("modelId", modelId).eq("pricingType", pricingType),
      ).take(1);
      const [benchmarks, inputPrices, outputPrices, imagePrices, videoPrices] = await Promise.all([
        ctx.db.query("benchmarkObservations").withIndex("by_model_metric", (q) => q.eq("modelId", modelId)).take(1),
        pricesFor("input_tokens"),
        pricesFor("output_tokens"),
        pricesFor("image_generation"),
        pricesFor("video_generation"),
      ]);
      const current = await ctx.db.get(modelId);
      const hasInput = inputPrices.length > 0;
      const hasOutput = outputPrices.length > 0;
      const isImageGenerator = current?.capabilities.includes("image_generation") ?? false;
      const isVideoGenerator = current?.capabilities.includes("video_generation") ?? false;
      const hasMediaPricing = isImageGenerator ? imagePrices.length > 0 : isVideoGenerator ? videoPrices.length > 0 : false;
      const hasRequiredContext = isImageGenerator || isVideoGenerator || Boolean(current?.contextWindow);
      const hasRequiredPricing = isImageGenerator || isVideoGenerator ? hasMediaPricing : hasInput && hasOutput;
      const eligible = Boolean(current && !current.manualReviewRequired && current.active && current.modalities.length && hasRequiredContext && benchmarks.length && hasRequiredPricing);
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
