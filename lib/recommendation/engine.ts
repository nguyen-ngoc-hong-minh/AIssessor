import type { Priority, WorkflowStep } from "@/lib/planner/schema";
import type { CandidateScore, CanonicalModel, EvidenceReference, Exclusion, FitLabel, RecommendationContext, StepRecommendation, StrategyPlan, StrategyVariant } from "./types";
import { BASE_WEIGHTS, QUALITY_MINIMUM, TASK_EVIDENCE_MAP, type TaskCategory } from "./config";

const PRIVACY_RANK = { standard: 1, business: 2, sensitive: 3, restricted: 4 } as const;

export function priorityWeights(priorities: Priority[]) {
  const weights: Record<keyof typeof BASE_WEIGHTS, number> = { ...BASE_WEIGHTS };
  const boosts: Record<Priority, keyof typeof weights> = { lowest_cost: "cost", balanced: "evidence", highest_quality: "performance", fastest: "speed", privacy: "privacy", existing_tools: "existing" };
  priorities.forEach((priority, index) => { weights[boosts[priority]] += Math.max(0, 10 - index * 2); });
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
  return Object.fromEntries(Object.entries(weights).map(([key, value]) => [key, value / total])) as Record<keyof typeof weights, number>;
}

function baseStepCost(step: WorkflowStep, model: CanonicalModel): number | null {
  if (model.capabilities.includes("video_generation")) {
    return model.videoPricePerMinute == null ? null : step.estimatedVideoMinutes * model.videoPricePerMinute;
  }
  if (model.capabilities.includes("image_generation")) {
    return model.imagePricePerThousand == null ? null : (step.estimatedImageCount / 1_000) * model.imagePricePerThousand;
  }
  if (model.inputPricePerMillion === null || model.outputPricePerMillion === null) return null;
  const input = step.estimatedInputTokensExpected * step.estimatedRequestCount;
  const output = step.estimatedOutputTokensExpected * step.estimatedRequestCount;
  return (input / 1_000_000) * model.inputPricePerMillion + (output / 1_000_000) * model.outputPricePerMillion;
}

export function estimateStepCost(step: WorkflowStep, model: CanonicalModel): number | null {
  const cost = baseStepCost(step, model);
  return cost === null ? null : model.existingTool ? 0 : cost;
}

export function taskCategory(step: WorkflowStep): TaskCategory {
  if (step.requiredCapabilities.includes("video_generation")) return "video";
  if (step.requiredCapabilities.includes("image_generation")) return "image";
  if (step.requiredModalities.includes("video")) return "video";
  if (step.requiredModalities.includes("image")) return "multimodal";
  const text = `${step.name} ${step.plainLanguageDescription} ${step.requiredCapabilities.join(" ")}`.toLowerCase();
  if (/repository|software engineer|debug|bug fix|pull request|codebase/.test(text)) return "software_engineering";
  if (/code|coding|program|develop/.test(text)) return "coding";
  if (/contract|legal|law|compliance|case brief/.test(text)) return "legal";
  if (/health|medical|clinical|patient|biology/.test(text)) return "healthcare";
  if (/finance|financial|accounting|investment|economics|forecast/.test(text)) return "finance";
  if (/long document|large document|book|transcript|many pages/.test(text)) return "long_document";
  if (/research|literature review|fact check|evidence synthesis/.test(text)) return "research";
  if (/reason|analysis|analyse|data|math/.test(text)) return "reasoning";
  if (/write|copy|article|script|translate|conversation/.test(text)) return "writing";
  return "general";
}

export function selectTaskEvidence(step: WorkflowStep, model: CanonicalModel): EvidenceReference | null {
  const evidence = (model.evidence ?? []).filter((item) => item.kind === "benchmark" && item.category !== "speed");
  const category = taskCategory(step);
  const accepted = TASK_EVIDENCE_MAP[category] as readonly string[];
  return evidence.filter((item) => accepted.includes(item.category)).sort((a, b) => accepted.indexOf(a.category) - accepted.indexOf(b.category) || b.retrievedAt - a.retrievedAt || (b.normalizedValue ?? 0) - (a.normalizedValue ?? 0))[0] ?? null;
}

export function getExclusionReasons(step: WorkflowStep, model: CanonicalModel, context: RecommendationContext): string[] {
  const reasons: string[] = [];
  if (!model.active) reasons.push("Model is inactive");
  if (!(model.accessOptions ?? []).length) reasons.push("No verified access path is available");
  for (const modality of step.requiredModalities) if (!model.modalities.includes(modality)) reasons.push(`Missing ${modality} support`);
  const hardCapabilities = new Set(["image_generation", "video_generation", "audio_generation", "speech_to_text", "text_to_speech"]);
  for (const capability of step.requiredCapabilities) if (hardCapabilities.has(capability) && !model.capabilities.includes(capability)) reasons.push(`Missing required capability: ${capability}`);
  const expectedContext = step.estimatedInputTokensHigh + step.estimatedOutputTokensHigh;
  const mediaGenerator = model.capabilities.includes("image_generation") || model.capabilities.includes("video_generation");
  if (!mediaGenerator && model.contextWindow === null) reasons.push("Critical context-window evidence is unavailable");
  else if (model.contextWindow !== null && model.contextWindow < expectedContext) reasons.push("Context window is too small");
  if (model.privacyLevel === null && (step.privacyRequirement === "sensitive" || step.privacyRequirement === "restricted")) reasons.push("Critical privacy evidence is unavailable");
  else if (model.privacyLevel !== null && PRIVACY_RANK[model.privacyLevel] < PRIVACY_RANK[step.privacyRequirement]) reasons.push("Privacy controls do not meet the requirement");
  if (step.commercialUseRequired && model.commercialUse === false) reasons.push("Commercial use is not permitted");
  if (model.regions.length > 0 && !model.regions.includes(context.region)) reasons.push("Model is unavailable in the selected region");
  const cost = estimateStepCost(step, model);
  if (cost === null) reasons.push("Critical pricing evidence is unavailable");
  else if (context.budgetUsd !== null && cost > context.budgetUsd) reasons.push("Estimated step cost exceeds the remaining budget");
  const taskEvidence = selectTaskEvidence(step, model);
  if (!taskEvidence) reasons.push(`No ${taskCategory(step)} performance evidence is available`);
  else if ((taskEvidence.normalizedValue ?? taskEvidence.rawValue as number) < QUALITY_MINIMUM[step.minimumQuality]) reasons.push("Measured task quality is below the required level");
  return [...new Set(reasons)];
}

function normalise(value: number | null, ceiling: number): number { return value === null ? 0 : Math.max(0, Math.min(1, value / ceiling)); }
function fitLabel(score: number, evidence: number): FitLabel { if (evidence < 0.75) return "Limited Evidence"; if (score >= 80) return "Strong Fit"; if (score >= 65) return "Good Fit"; return "Possible Fit"; }

function confidenceLabel(model: CanonicalModel, taskEvidence: EvidenceReference | null, evidenceCoverage: number, ageDays: number) {
  const relevantSources = new Set((model.evidence ?? []).filter((item) => item.kind === "benchmark" && item.category === taskEvidence?.category).map((item) => item.source));
  const officialPricing = (model.evidence ?? []).some((item) => item.kind === "pricing" && /official|provider/i.test(item.confidence));
  const officialPrivacy = (model.evidence ?? []).some((item) => item.kind === "privacy" && /official|provider/i.test(item.confidence));
  if (relevantSources.size >= 2 && officialPricing && officialPrivacy && evidenceCoverage >= 0.85 && ageDays <= 30 && model.mappingConfidence !== "unmatched") return "High" as const;
  if (taskEvidence && officialPricing && evidenceCoverage >= 0.55 && ageDays <= 90 && model.mappingConfidence !== "unmatched") return "Moderate" as const;
  return "Limited" as const;
}

function costBasis(step: WorkflowStep, model: CanonicalModel) {
  if (model.capabilities.includes("video_generation")) return `${step.estimatedVideoMinutes} video minute${step.estimatedVideoMinutes === 1 ? "" : "s"} × $${(model.videoPricePerMinute ?? 0).toFixed(4)}/minute`;
  if (model.capabilities.includes("image_generation")) return `${step.estimatedImageCount} image${step.estimatedImageCount === 1 ? "" : "s"} × $${(model.imagePricePerThousand ?? 0).toFixed(2)}/1,000 images`;
  const input = step.estimatedInputTokensExpected * step.estimatedRequestCount;
  const output = step.estimatedOutputTokensExpected * step.estimatedRequestCount;
  return `${input.toLocaleString("en-US")} input + ${output.toLocaleString("en-US")} output tokens at $${(model.inputPricePerMillion ?? 0).toFixed(2)}/$${(model.outputPricePerMillion ?? 0).toFixed(2)} per 1M`;
}

export function scoreCandidate(step: WorkflowStep, model: CanonicalModel, context: RecommendationContext): CandidateScore {
  const cost = estimateStepCost(step, model) ?? 0; const fullCost = baseStepCost(step, model) ?? 0;
  const taskEvidence = selectTaskEvidence(step, model); const performance = taskEvidence?.normalizedValue ?? (typeof taskEvidence?.rawValue === "number" ? taskEvidence.rawValue : model.qualityScore) ?? 0;
  const mediaGenerator = model.capabilities.includes("image_generation") || model.capabilities.includes("video_generation");
  const evidenceFields = mediaGenerator
    ? [model.imagePricePerThousand ?? model.videoPricePerMinute, taskEvidence, model.privacyLevel, model.commercialUse]
    : [model.contextWindow, model.inputPricePerMillion, model.outputPricePerMillion, taskEvidence, model.outputTokensPerSecond, model.privacyLevel, model.commercialUse];
  const evidenceCoverage = evidenceFields.filter((value) => value !== null && value !== undefined).length / evidenceFields.length;
  const measuredAt = taskEvidence?.retrievedAt ?? model.measuredAt; const ageDays = measuredAt ? Math.max(0, (context.now - measuredAt) / 86_400_000) : 365;
  const freshness = Math.max(0, 1 - ageDays / 120); const privacy = model.privacyLevel ? PRIVACY_RANK[model.privacyLevel] / 4 : 0;
  const weights = priorityWeights(context.priorities); const components = { performance: normalise(performance, 100), cost: 1 / (1 + cost), speed: normalise(model.outputTokensPerSecond, 250), privacy, commercial: model.commercialUse ? 1 : 0, existing: model.existingTool ? 1 : 0, evidence: evidenceCoverage, freshness };
  const raw = Object.entries(components).reduce((total, [key, value]) => total + value * weights[key as keyof typeof weights], 0) * 100;
  const roundedScore = Math.round(raw / 5) * 5; const limitations: string[] = [];
  if (evidenceCoverage < 1) limitations.push("Some comparison fields are unavailable");
  if (model.privacyLevel === null) limitations.push("Privacy terms were not verified; review the provider agreement before uploading sensitive material");
  if (step.commercialUseRequired && model.commercialUse === null) limitations.push("Commercial-use terms were not verified; review the provider agreement before publishing");
  if (ageDays > 30) limitations.push(`Task evidence is ${Math.round(ageDays)} days old`);
  const explanation = [
    taskEvidence ? `Uses ${taskEvidence.metricName} evidence relevant to ${taskCategory(step)} work` : "Task-specific performance evidence is limited",
    model.existingTool ? "Reuses a subscription you already pay for" : cost < 0.1 ? "Has a low estimated cost for this workload" : "Fits the remaining budget",
    model.privacyLevel ? `Meets the ${step.privacyRequirement} privacy requirement` : "Privacy evidence is unavailable",
  ];
  const evidence = (model.evidence ?? []).filter((item) => item === taskEvidence || item.kind !== "benchmark" || item.category === "speed");
  const evidenceConfidence = confidenceLabel(model, taskEvidence, evidenceCoverage, ageDays);
  if (evidenceConfidence === "Limited") limitations.push("Evidence confidence is limited for this task");
  return { model, roundedScore, label: fitLabel(roundedScore, evidenceCoverage), estimatedCostUsd: Number(cost.toFixed(4)), estimatedSavingsUsd: Number(Math.max(0, fullCost - cost).toFixed(4)), costBasis: costBasis(step, model), explanation, limitations, evidence, evidenceConfidence };
}

export function recommendStep(step: WorkflowStep, models: CanonicalModel[], context: RecommendationContext): StepRecommendation {
  const stepSummary = { name: step.name, plainLanguageDescription: step.plainLanguageDescription, inputDescription: step.inputDescription, outputDescription: step.outputDescription, humanReviewRecommended: step.humanReviewRecommended, noAIEligible: step.noAIEligible, noAIAlternative: step.noAIAlternative };
  if (step.noAIEligible) return { stepId: step.id, step: stepSummary, selected: null, alternatives: [], exclusions: [], dataUpdatedAt: null };
  const exclusions: Exclusion[] = []; const eligible: CandidateScore[] = [];
  for (const model of models) { const reasons = getExclusionReasons(step, model, context); if (reasons.length) exclusions.push({ modelId: model.id, modelName: model.name, reasons }); else eligible.push(scoreCandidate(step, model, context)); }
  eligible.sort((a, b) => b.roundedScore - a.roundedScore || a.estimatedCostUsd - b.estimatedCostUsd || a.model.name.localeCompare(b.model.name));
  return { stepId: step.id, step: stepSummary, selected: eligible[0] ?? null, alternatives: eligible.slice(1, 4), exclusions, dataUpdatedAt: eligible.length ? Math.min(...eligible.map((item) => item.model.retrievedAt)) : null };
}

function prioritiesForVariant(original: Priority[], variant: StrategyVariant): Priority[] {
  const lead: Record<StrategyVariant, Priority> = { recommended: original[0], lowest_cost: "lowest_cost", highest_quality: "highest_quality", fastest: "fastest", privacy: "privacy" };
  return [lead[variant], ...original.filter((priority) => priority !== lead[variant])];
}

export function generateStrategyPlan(steps: WorkflowStep[], models: CanonicalModel[], context: RecommendationContext, variant: StrategyVariant): StrategyPlan {
  const priorities = prioritiesForVariant(context.priorities, variant); let remainingBudget = context.budgetUsd;
  const recommendations = steps.map((step) => {
    const item = recommendStep(step, models, { ...context, priorities, budgetUsd: remainingBudget });
    if (remainingBudget !== null && item.selected) remainingBudget = Math.max(0, remainingBudget - item.selected.estimatedCostUsd);
    return item;
  });
  const apiCostUsd = recommendations.reduce((sum, item) => sum + (item.selected?.estimatedCostUsd ?? 0), 0);
  const estimatedSavingsUsd = recommendations.reduce((sum, item) => sum + (item.selected?.estimatedSavingsUsd ?? 0), 0);
  const dates = recommendations.map((item) => item.dataUpdatedAt).filter((value): value is number => value !== null);
  const selectedNames = recommendations.flatMap((item) => item.selected ? [`${item.selected.model.provider} ${item.selected.model.name}`.toLowerCase()] : []);
  const existingTools = context.existingTools ?? []; const kept = existingTools.filter((tool) => selectedNames.some((name) => name.includes(tool.toLowerCase())));
  return { variant, steps: recommendations, fixedCostUsd: 0, apiCostUsd: Number(apiCostUsd.toFixed(2)), totalCostUsd: Number(apiCostUsd.toFixed(2)), estimatedSavingsUsd: Number(estimatedSavingsUsd.toFixed(2)), existingSubscriptions: { kept, couldCancel: existingTools.filter((tool) => !kept.includes(tool)) }, assumptions: ["Usage estimates come from the approved workflow.", "Existing subscriptions are treated as zero marginal cost where the named tool matches.", "Provider prices exclude taxes and third-party platform fees."], dataUpdatedAt: dates.length ? Math.min(...dates) : null };
}

export function isMateriallyBetter(current: CandidateScore, candidate: CandidateScore) {
  const costReduction = current.estimatedCostUsd > 0 ? (current.estimatedCostUsd - candidate.estimatedCostUsd) / current.estimatedCostUsd : 0;
  return candidate.roundedScore >= current.roundedScore + 10 || (candidate.roundedScore >= current.roundedScore && costReduction >= 0.15);
}
