import type { Priority, WorkflowStep } from "@/lib/planner/schema";
import type { CandidateScore, CanonicalModel, Exclusion, FitLabel, RecommendationContext, StepRecommendation, StrategyPlan, StrategyVariant } from "./types";

const PRIVACY_RANK = { standard: 1, business: 2, sensitive: 3, restricted: 4 } as const;
const BASE_WEIGHTS = { performance: 22, cost: 18, speed: 13, privacy: 14, commercial: 10, existing: 8, evidence: 9, freshness: 6 };

export function priorityWeights(priorities: Priority[]) {
  const weights = { ...BASE_WEIGHTS };
  const boosts: Record<Priority, keyof typeof weights> = {
    lowest_cost: "cost",
    balanced: "evidence",
    highest_quality: "performance",
    fastest: "speed",
    privacy: "privacy",
    existing_tools: "existing",
  };
  priorities.forEach((priority, index) => { weights[boosts[priority]] += Math.max(0, 10 - index * 2); });
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
  return Object.fromEntries(Object.entries(weights).map(([key, value]) => [key, value / total])) as Record<keyof typeof weights, number>;
}

export function estimateStepCost(step: WorkflowStep, model: CanonicalModel): number | null {
  if (model.inputPricePerMillion === null || model.outputPricePerMillion === null) return null;
  const input = step.estimatedInputTokensExpected * step.estimatedRequestCount;
  const output = step.estimatedOutputTokensExpected * step.estimatedRequestCount;
  return (input / 1_000_000) * model.inputPricePerMillion + (output / 1_000_000) * model.outputPricePerMillion;
}

export function getExclusionReasons(step: WorkflowStep, model: CanonicalModel, context: RecommendationContext): string[] {
  const reasons: string[] = [];
  if (!model.active) reasons.push("Model is inactive");
  for (const modality of step.requiredModalities) if (!model.modalities.includes(modality)) reasons.push(`Missing ${modality} support`);
  for (const capability of step.requiredCapabilities) if (!model.capabilities.includes(capability)) reasons.push(`Missing required capability: ${capability}`);
  const expectedContext = step.estimatedInputTokensHigh + step.estimatedOutputTokensHigh;
  if (model.contextWindow === null) reasons.push("Critical context-window evidence is unavailable");
  else if (model.contextWindow < expectedContext) reasons.push("Context window is too small");
  if (model.privacyLevel === null) reasons.push("Critical privacy evidence is unavailable");
  else if (PRIVACY_RANK[model.privacyLevel] < PRIVACY_RANK[step.privacyRequirement]) reasons.push("Privacy controls do not meet the requirement");
  if (step.commercialUseRequired && model.commercialUse !== true) reasons.push("Commercial-use compatibility is not confirmed");
  if (model.regions.length > 0 && !model.regions.includes(context.region)) reasons.push("Model is unavailable in the selected region");
  const cost = estimateStepCost(step, model);
  if (cost === null) reasons.push("Critical pricing evidence is unavailable");
  else if (context.budgetUsd !== null && cost > context.budgetUsd) reasons.push("Estimated step cost exceeds the hard budget");
  return [...new Set(reasons)];
}

function normalise(value: number | null, ceiling: number): number { return value === null ? 0 : Math.max(0, Math.min(1, value / ceiling)); }
function fitLabel(score: number, evidence: number): FitLabel {
  if (evidence < 0.7) return "Limited Evidence";
  if (score >= 80) return "Strong Fit";
  if (score >= 65) return "Good Fit";
  return "Possible Fit";
}

export function scoreCandidate(step: WorkflowStep, model: CanonicalModel, context: RecommendationContext): CandidateScore {
  const cost = estimateStepCost(step, model) ?? 0;
  const evidenceFields = [model.contextWindow, model.inputPricePerMillion, model.outputPricePerMillion, model.qualityScore, model.outputTokensPerSecond, model.privacyLevel, model.commercialUse];
  const evidence = evidenceFields.filter((value) => value !== null).length / evidenceFields.length;
  const ageDays = model.measuredAt ? Math.max(0, (context.now - model.measuredAt) / 86_400_000) : 365;
  const freshness = Math.max(0, 1 - ageDays / 120);
  const privacy = model.privacyLevel ? PRIVACY_RANK[model.privacyLevel] / 4 : 0;
  const weights = priorityWeights(context.priorities);
  const costEfficiency = 1 / (1 + cost);
  const components = {
    performance: normalise(model.qualityScore, 100), cost: costEfficiency,
    speed: normalise(model.outputTokensPerSecond, 250), privacy,
    commercial: model.commercialUse ? 1 : 0, existing: model.existingTool ? 1 : 0,
    evidence, freshness,
  };
  const raw = Object.entries(components).reduce((total, [key, value]) => total + value * weights[key as keyof typeof weights], 0) * 100;
  const roundedScore = Math.round(raw / 5) * 5;
  const limitations: string[] = [];
  if (evidence < 1) limitations.push("Some comparison fields are missing");
  if (ageDays > 30) limitations.push(`Performance evidence is ${Math.round(ageDays)} days old`);
  const explanation = [
    model.qualityScore !== null ? "Has measured performance evidence" : "Performance evidence is limited",
    cost < 0.1 ? "Low estimated cost for this workload" : "Cost fits the selected budget",
    model.existingTool ? "Uses a tool already available to you" : "Requires a new provider or subscription",
  ];
  return { model, roundedScore, label: fitLabel(roundedScore, evidence), estimatedCostUsd: Number(cost.toFixed(4)), explanation, limitations };
}

export function recommendStep(step: WorkflowStep, models: CanonicalModel[], context: RecommendationContext): StepRecommendation {
  if (step.noAIEligible && step.importance !== "critical") {
    return { stepId: step.id, selected: null, alternatives: [], exclusions: [], dataUpdatedAt: null };
  }
  const exclusions: Exclusion[] = [];
  const eligible: CandidateScore[] = [];
  for (const model of models) {
    const reasons = getExclusionReasons(step, model, context);
    if (reasons.length) exclusions.push({ modelId: model.id, modelName: model.name, reasons });
    else eligible.push(scoreCandidate(step, model, context));
  }
  eligible.sort((a, b) => b.roundedScore - a.roundedScore || a.estimatedCostUsd - b.estimatedCostUsd || a.model.name.localeCompare(b.model.name));
  return { stepId: step.id, selected: eligible[0] ?? null, alternatives: eligible.slice(1, 4), exclusions, dataUpdatedAt: eligible.length ? Math.min(...eligible.map((item) => item.model.retrievedAt)) : null };
}

function prioritiesForVariant(original: Priority[], variant: StrategyVariant): Priority[] {
  const lead: Record<StrategyVariant, Priority> = { recommended: original[0], lowest_cost: "lowest_cost", highest_quality: "highest_quality", fastest: "fastest", privacy: "privacy" };
  return [lead[variant], ...original.filter((priority) => priority !== lead[variant])];
}

export function generateStrategyPlan(steps: WorkflowStep[], models: CanonicalModel[], context: RecommendationContext, variant: StrategyVariant): StrategyPlan {
  const variantContext = { ...context, priorities: prioritiesForVariant(context.priorities, variant) };
  const recommendations = steps.map((step) => recommendStep(step, models, variantContext));
  const apiCostUsd = recommendations.reduce((sum, item) => sum + (item.selected?.estimatedCostUsd ?? 0), 0);
  const dates = recommendations.map((item) => item.dataUpdatedAt).filter((value): value is number => value !== null);
  return {
    variant, steps: recommendations, fixedCostUsd: 0, apiCostUsd: Number(apiCostUsd.toFixed(2)), totalCostUsd: Number(apiCostUsd.toFixed(2)),
    assumptions: ["Token and request counts come from the approved workflow.", "Provider prices exclude taxes and third-party platform fees."],
    dataUpdatedAt: dates.length ? Math.min(...dates) : null,
  };
}
