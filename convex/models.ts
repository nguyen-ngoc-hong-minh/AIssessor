import { internalMutationGeneric as internalMutation, queryGeneric as query } from "convex/server";
import { v } from "convex/values";
import { requireUser } from "./lib/auth";

const modelValidator = v.object({
  canonicalId: v.string(), name: v.string(), provider: v.string(), modalities: v.array(v.string()), capabilities: v.array(v.string()),
  contextWindow: v.optional(v.number()), active: v.boolean(), commercialUse: v.optional(v.boolean()), privacyLevel: v.optional(v.string()), regions: v.array(v.string()),
  benchmarks: v.array(v.object({ metric: v.string(), score: v.number(), measuredAt: v.number(), confidence: v.string() })),
  prices: v.array(v.object({ pricingType: v.string(), amount: v.number(), unit: v.string(), currency: v.string(), effectiveAt: v.number() })),
});

export const ingest = internalMutation({ args: { source: v.string(), retrievedAt: v.number(), models: v.array(modelValidator) }, handler: async (ctx, args) => {
  let createdCount = 0; let updatedCount = 0;
  for (const model of args.models) {
    const existing = await ctx.db.query("canonicalModels").withIndex("by_canonical_id", (q) => q.eq("canonicalId", model.canonicalId)).unique();
    const values = { canonicalId: model.canonicalId, name: model.name, provider: model.provider, modalities: model.modalities, capabilities: model.capabilities, contextWindow: model.contextWindow, active: model.active, commercialUse: model.commercialUse, privacyLevel: model.privacyLevel, regions: model.regions, updatedAt: args.retrievedAt };
    const modelId = existing ? existing._id : await ctx.db.insert("canonicalModels", values);
    if (existing) { await ctx.db.patch(existing._id, values); updatedCount += 1; } else createdCount += 1;
    for (const observation of model.benchmarks) await ctx.db.insert("benchmarkObservations", { modelId, ...observation, source: args.source, retrievedAt: args.retrievedAt });
    for (const observation of model.prices) await ctx.db.insert("pricingObservations", { modelId, ...observation, source: args.source, retrievedAt: args.retrievedAt });
  }
  return { createdCount, updatedCount };
} });

export const catalog = query({ args: {}, handler: async (ctx) => {
  await requireUser(ctx); const models = await ctx.db.query("canonicalModels").collect();
  return Promise.all(models.filter((model) => model.active).map(async (model) => {
    const benchmarks = await ctx.db.query("benchmarkObservations").withIndex("by_model_metric", (q) => q.eq("modelId", model._id)).order("desc").collect();
    const prices = await ctx.db.query("pricingObservations").withIndex("by_model_type", (q) => q.eq("modelId", model._id)).order("desc").collect();
    return { ...model, benchmarks, prices };
  }));
} });
