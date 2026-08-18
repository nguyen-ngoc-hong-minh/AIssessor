"use node";

import { actionGeneric as action, anyApi } from "convex/server";
import { ConvexError, v } from "convex/values";
import { applicationErrorData } from "../../lib/application-errors";
import { validatePriorityRanking, WorkflowStepSchema, type WorkflowStep } from "../../lib/planner/schema";
import { generateStrategyPlan } from "../../lib/recommendation/engine";
import type { CanonicalModel, StrategyVariant } from "../../lib/recommendation/types";
import { requireIdentity } from "../lib/auth";

type StoredModel = {
  _id: string; name: string; provider: string; active: boolean; modalities: string[]; capabilities: string[]; contextWindow?: number;
  commercialUse?: boolean; privacyLevel?: string; regions: string[]; updatedAt: number; mappingConfidence?: "exact" | "explicit_alias" | "unmatched";
  benchmarks: Array<{ metric: string; score: number; rawValue?: unknown; normalizedValue?: number; category?: string; sourceUrl?: string; modelVersion?: string; measuredAt: number; retrievedAt: number; source: string; confidence: string; notes?: string }>;
  prices: Array<{ pricingType: string; amount: number; sourceUrl?: string; modelVersion?: string; retrievedAt: number; source: string; confidence?: string; notes?: string }>;
  privacy: Array<{ level: string; source: string; sourceUrl: string; retrievedAt: number; confidence: string; notes?: string }>;
  licenses: Array<{ commercialUse: boolean; source: string; sourceUrl: string; retrievedAt: number; confidence: string; notes?: string }>;
};

function latest<T extends { retrievedAt: number }>(items: T[], predicate: (item: T) => boolean) { return items.filter(predicate).sort((a,b)=>b.retrievedAt-a.retrievedAt)[0]; }
function toModel(model: StoredModel): CanonicalModel {
  const quality = latest(model.benchmarks, (item) => item.metric === "artificial_analysis_intelligence_index");
  const speed = latest(model.benchmarks, (item) => item.metric === "output_tokens_per_second");
  const input = latest(model.prices, (item) => item.pricingType === "input_tokens");
  const output = latest(model.prices, (item) => item.pricingType === "output_tokens");
  const image = latest(model.prices, (item) => item.pricingType === "image_generation");
  const video = latest(model.prices, (item) => item.pricingType === "video_generation");
  const privacy = model.privacy[0]; const license = model.licenses[0];
  const evidence = [
    ...model.benchmarks.map((item) => ({ kind: "benchmark" as const, source: item.source, sourceUrl: item.sourceUrl ?? null, retrievedAt: item.retrievedAt, modelVersion: item.modelVersion ?? null, metricName: item.metric, rawValue: item.rawValue ?? item.score, normalizedValue: item.normalizedValue ?? null, category: item.category ?? "general", confidence: item.confidence, notes: item.notes ?? null })),
    ...model.prices.map((item) => ({ kind: "pricing" as const, source: item.source, sourceUrl: item.sourceUrl ?? null, retrievedAt: item.retrievedAt, modelVersion: item.modelVersion ?? null, metricName: item.pricingType, rawValue: item.amount, normalizedValue: null, category: "cost", confidence: item.confidence ?? "source_reported", notes: item.notes ?? null })),
    ...model.privacy.map((item) => ({ kind: "privacy" as const, source: item.source, sourceUrl: item.sourceUrl, retrievedAt: item.retrievedAt, modelVersion: null, metricName: "privacy_level", rawValue: item.level, normalizedValue: null, category: "privacy", confidence: item.confidence, notes: item.notes ?? null })),
    ...model.licenses.map((item) => ({ kind: "license" as const, source: item.source, sourceUrl: item.sourceUrl, retrievedAt: item.retrievedAt, modelVersion: null, metricName: "commercial_use", rawValue: item.commercialUse, normalizedValue: null, category: "license", confidence: item.confidence, notes: item.notes ?? null })),
  ];
  return { id: model._id, name: model.name, provider: model.provider, active: model.active, modalities: model.modalities, capabilities: model.capabilities, contextWindow: model.contextWindow ?? null, inputPricePerMillion: input?.amount ?? null, outputPricePerMillion: output?.amount ?? null, imagePricePerThousand: image?.amount ?? null, videoPricePerMinute: video?.amount ?? null, qualityScore: quality?.score ?? null, outputTokensPerSecond: speed?.score ?? null, privacyLevel: (privacy?.level as CanonicalModel["privacyLevel"]) ?? (model.privacyLevel as CanonicalModel["privacyLevel"]) ?? null, commercialUse: license?.commercialUse ?? model.commercialUse ?? null, regions: model.regions, source: quality?.source ?? input?.source ?? image?.source ?? video?.source ?? "stored snapshot", sourceUrl: quality?.sourceUrl ?? input?.sourceUrl ?? image?.sourceUrl ?? video?.sourceUrl ?? null, measuredAt: quality?.measuredAt ?? null, retrievedAt: Math.max(quality?.retrievedAt ?? 0,input?.retrievedAt ?? 0,output?.retrievedAt ?? 0,image?.retrievedAt ?? 0,video?.retrievedAt ?? 0,privacy?.retrievedAt ?? 0,license?.retrievedAt ?? 0,model.updatedAt), existingTool: false, evidence, mappingConfidence: model.mappingConfidence };
}

function toStep(record: { _id: string; order: number; name: string; description: string; requirements: unknown; estimates: unknown }): WorkflowStep {
  const requirements = record.requirements as Record<string, unknown>; const estimates = record.estimates as Record<string, unknown>;
  return WorkflowStepSchema.parse({ id: record._id, order: record.order, name: record.name, plainLanguageDescription: record.description, inputDescription: requirements.inputDescription ?? "User-provided material", outputDescription: requirements.outputDescription ?? "Completed step", dependencies: requirements.dependencies ?? [], canRunInParallel: requirements.canRunInParallel ?? false, estimatedInputTokensLow: estimates.inputLow ?? 0, estimatedInputTokensExpected: estimates.inputExpected ?? 0, estimatedInputTokensHigh: estimates.inputHigh ?? 0, estimatedOutputTokensLow: estimates.outputLow ?? 0, estimatedOutputTokensExpected: estimates.outputExpected ?? 0, estimatedOutputTokensHigh: estimates.outputHigh ?? 0, estimatedRequestCount: estimates.requests ?? 0, estimatedImageCount: estimates.images ?? 0, estimatedAudioMinutes: estimates.audioMinutes ?? 0, estimatedVideoMinutes: estimates.videoMinutes ?? 0, requiredModalities: requirements.requiredModalities ?? [], requiredCapabilities: requirements.requiredCapabilities ?? [], requiresCurrentInformation: requirements.requiresCurrentInformation ?? false, privacyRequirement: requirements.privacyRequirement ?? "standard", commercialUseRequired: requirements.commercialUseRequired ?? false, minimumQuality: requirements.minimumQuality ?? "good", importance: requirements.importance ?? "medium", noAIEligible: requirements.noAIEligible ?? false, noAIAlternative: requirements.noAIAlternative ?? "Complete manually", humanReviewRecommended: requirements.humanReviewRecommended ?? true, assumptions: requirements.assumptions ?? [] });
}

export const generate = action({ args: { strategyId: v.id("strategies"), region: v.string() }, handler: async (ctx, args) => {
  await requireIdentity(ctx); const { strategyId, region } = args;
  const owned = await ctx.runQuery(anyApi.strategies.getOwned, { strategyId });
  if (owned.strategy.status !== "approved" && owned.strategy.status !== "complete") throw new ConvexError(applicationErrorData("WORKFLOW_NOT_APPROVED"));
  const snapshots = await ctx.runQuery(anyApi.modelSync.latestValidSnapshots, {});
  if (!snapshots.length) throw new ConvexError(applicationErrorData("INSUFFICIENT_EVIDENCE"));
  const snapshot = [...snapshots].sort((a, b) => b.fetchedAt - a.fetchedAt)[0];
  const snapshotSummary = [...snapshots].sort((a, b) => a.fetchedAt - b.fetchedAt).map((item) => ({ id: item._id, fetchedAt: item.fetchedAt, source: item.source, sourceUrl: item.sourceUrl, attribution: item.attribution, sourceVersion: item.sourceVersion }));
  const oldestEvidenceAt = Math.min(...snapshotSummary.map((item) => item.fetchedAt));
  const storedModels = await ctx.runQuery(anyApi.models.catalog, {}) as StoredModel[];
  const priorities = validatePriorityRanking(owned.strategy.priorities);
  const existingTools = owned.strategy.existingTools ?? [];
  const context = { priorities, budgetUsd: owned.strategy.budget ?? null, region, now: Date.now(), existingTools };
  const variants: StrategyVariant[] = ["recommended", "lowest_cost", "highest_quality", "fastest", "privacy"];
  const models = storedModels.map(toModel).map((model) => ({ ...model, existingTool: existingTools.some((tool: string) => `${model.provider} ${model.name}`.toLowerCase().includes(tool.toLowerCase())) }));
  const plans = variants.map((variant) => generateStrategyPlan(owned.steps.map(toStep), models, context, variant));
  const entitlement = await ctx.runQuery(anyApi.subscriptions.entitlement, {});
  if (!entitlement.canViewFullResults) return { locked: true, usageType: owned.strategy.usageType, estimatedCompletionTime: owned.strategy.estimatedCompletionTime, plans: [{ ...plans[0], steps: plans[0].steps.map((step) => ({ ...step, alternatives: [] })) }], dataSnapshot: { id: snapshot._id, fetchedAt: oldestEvidenceAt, sources: snapshotSummary } };
  await ctx.runMutation(anyApi.strategies.saveGeneratedPlans, { strategyId, dataSnapshotId: snapshot._id, plans });
  return { locked: false, usageType: owned.strategy.usageType, estimatedCompletionTime: owned.strategy.estimatedCompletionTime, plans, dataSnapshot: { id: snapshot._id, fetchedAt: oldestEvidenceAt, sources: snapshotSummary } };
} });
