"use node";

import { actionGeneric as action, anyApi } from "convex/server";
import { v } from "convex/values";
import { validatePriorityRanking, WorkflowStepSchema, type WorkflowStep } from "../../lib/planner/schema";
import { generateStrategyPlan } from "../../lib/recommendation/engine";
import type { CanonicalModel, StrategyVariant } from "../../lib/recommendation/types";

type StoredModel = {
  _id: string; name: string; provider: string; active: boolean; modalities: string[]; capabilities: string[]; contextWindow?: number;
  commercialUse?: boolean; privacyLevel?: string; regions: string[]; updatedAt: number;
  benchmarks: Array<{ metric: string; score: number; measuredAt: number; retrievedAt: number; source: string }>;
  prices: Array<{ pricingType: string; amount: number; retrievedAt: number; source: string }>;
};

function latest<T extends { retrievedAt: number }>(items: T[], predicate: (item: T) => boolean) { return items.filter(predicate).sort((a,b)=>b.retrievedAt-a.retrievedAt)[0]; }
function toModel(model: StoredModel): CanonicalModel {
  const quality = latest(model.benchmarks, (item) => item.metric === "artificial_analysis_intelligence_index");
  const speed = latest(model.benchmarks, (item) => item.metric === "output_tokens_per_second");
  const input = latest(model.prices, (item) => item.pricingType === "input_tokens");
  const output = latest(model.prices, (item) => item.pricingType === "output_tokens");
  return { id: model._id, name: model.name, provider: model.provider, active: model.active, modalities: model.modalities, capabilities: model.capabilities, contextWindow: model.contextWindow ?? null, inputPricePerMillion: input?.amount ?? null, outputPricePerMillion: output?.amount ?? null, qualityScore: quality?.score ?? null, outputTokensPerSecond: speed?.score ?? null, privacyLevel: (model.privacyLevel as CanonicalModel["privacyLevel"]) ?? null, commercialUse: model.commercialUse ?? null, regions: model.regions, source: quality?.source ?? input?.source ?? "stored snapshot", measuredAt: quality?.measuredAt ?? null, retrievedAt: Math.max(quality?.retrievedAt ?? 0,input?.retrievedAt ?? 0,output?.retrievedAt ?? 0,model.updatedAt), existingTool: false };
}

function toStep(record: { _id: string; order: number; name: string; description: string; requirements: unknown; estimates: unknown }): WorkflowStep {
  const requirements = record.requirements as Record<string, unknown>; const estimates = record.estimates as Record<string, unknown>;
  return WorkflowStepSchema.parse({ id: record._id, order: record.order, name: record.name, plainLanguageDescription: record.description, inputDescription: requirements.inputDescription ?? "User-provided material", outputDescription: requirements.outputDescription ?? "Completed step", dependencies: requirements.dependencies ?? [], canRunInParallel: requirements.canRunInParallel ?? false, estimatedInputTokensLow: estimates.inputLow ?? 0, estimatedInputTokensExpected: estimates.inputExpected ?? 0, estimatedInputTokensHigh: estimates.inputHigh ?? 0, estimatedOutputTokensLow: estimates.outputLow ?? 0, estimatedOutputTokensExpected: estimates.outputExpected ?? 0, estimatedOutputTokensHigh: estimates.outputHigh ?? 0, estimatedRequestCount: estimates.requests ?? 0, estimatedImageCount: estimates.images ?? 0, estimatedAudioMinutes: estimates.audioMinutes ?? 0, estimatedVideoMinutes: estimates.videoMinutes ?? 0, requiredModalities: requirements.requiredModalities ?? [], requiredCapabilities: requirements.requiredCapabilities ?? [], requiresCurrentInformation: requirements.requiresCurrentInformation ?? false, privacyRequirement: requirements.privacyRequirement ?? "standard", commercialUseRequired: requirements.commercialUseRequired ?? false, minimumQuality: requirements.minimumQuality ?? "good", importance: requirements.importance ?? "medium", noAIEligible: requirements.noAIEligible ?? false, noAIAlternative: requirements.noAIAlternative ?? "Complete manually", humanReviewRecommended: requirements.humanReviewRecommended ?? true, assumptions: requirements.assumptions ?? [] });
}

export const generate = action({ args: { strategyId: v.id("strategies"), region: v.string() }, handler: async (ctx, { strategyId, region }) => {
  if (!(await ctx.auth.getUserIdentity())) throw new Error("Unauthenticated");
  const owned = await ctx.runQuery(anyApi.strategies.getOwned, { strategyId });
  if (owned.strategy.status !== "approved" && owned.strategy.status !== "complete") throw new Error("Approve the workflow before requesting recommendations");
  const snapshot = await ctx.runQuery(anyApi.modelSync.latestValidSnapshot, { source: "artificial_analysis" });
  if (!snapshot) throw new Error("No valid model-data snapshot is available");
  const storedModels = await ctx.runQuery(anyApi.models.catalog, {}) as StoredModel[];
  const priorities = validatePriorityRanking(owned.strategy.priorities);
  const context = { priorities, budgetUsd: owned.strategy.budget ?? null, region, now: Date.now() };
  const variants: StrategyVariant[] = ["recommended", "lowest_cost", "highest_quality", "fastest", "privacy"];
  const plans = variants.map((variant) => generateStrategyPlan(owned.steps.map(toStep), storedModels.map(toModel), context, variant));
  const entitlement = await ctx.runQuery(anyApi.subscriptions.entitlement, {});
  if (!entitlement.canViewFullResults) return { locked: true, plans: [{ ...plans[0], steps: plans[0].steps.slice(0, 1).map((step) => ({ ...step, alternatives: [] })) }], dataSnapshot: { id: snapshot._id, fetchedAt: snapshot.fetchedAt } };
  await ctx.runMutation(anyApi.strategies.saveGeneratedPlans, { strategyId, dataSnapshotId: snapshot._id, plans });
  return { locked: false, plans, dataSnapshot: { id: snapshot._id, fetchedAt: snapshot.fetchedAt } };
} });
