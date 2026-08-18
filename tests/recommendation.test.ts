import { describe, expect, it } from "vitest";
import { estimateStepCost, generateStrategyPlan, getExclusionReasons, isMateriallyBetter, priorityWeights, scoreCandidate, selectTaskEvidence, taskCategory } from "@/lib/recommendation/engine";
import { MONTHLY_FREQUENCY_MULTIPLIERS } from "@/lib/recommendation/config";
import type { WorkflowStep, Priority } from "@/lib/planner/schema";
import type { CanonicalModel, EvidenceReference } from "@/lib/recommendation/types";

const now = 2_000_000_000_000;
const step: WorkflowStep = { id: "s1", order: 0, name: "Write", plainLanguageDescription: "Write copy", inputDescription: "Brief", outputDescription: "Copy", dependencies: [], canRunInParallel: false, estimatedInputTokensLow: 500, estimatedInputTokensExpected: 1000, estimatedInputTokensHigh: 1500, estimatedOutputTokensLow: 300, estimatedOutputTokensExpected: 500, estimatedOutputTokensHigh: 800, estimatedRequestCount: 10, estimatedImageCount: 0, estimatedAudioMinutes: 0, estimatedVideoMinutes: 0, requiredModalities: ["text"], requiredCapabilities: ["structured_outputs"], requiresCurrentInformation: false, privacyRequirement: "business", commercialUseRequired: true, minimumQuality: "professional", importance: "high", noAIEligible: false, noAIAlternative: "Write manually", humanReviewRecommended: true, assumptions: [] };
const preferenceEvidence: EvidenceReference = { kind: "benchmark", source: "LMArena", sourceUrl: "https://lmarena.ai/leaderboard", retrievedAt: now, modelVersion: "measured-v1", metricName: "arena_preference", rawValue: 75, normalizedValue: 75, category: "preference", confidence: "official_dataset", notes: null };
const pricingEvidence: EvidenceReference = { kind: "pricing", source: "Provider pricing", sourceUrl: "https://provider.example/pricing", retrievedAt: now, modelVersion: "measured-v1", metricName: "input_tokens", rawValue: 1, normalizedValue: null, category: "cost", confidence: "official_api", notes: null };
const model: CanonicalModel = { id: "m1", name: "Measured model", provider: "Provider", active: true, modalities: ["text"], capabilities: ["structured_outputs"], contextWindow: 100000, inputPricePerMillion: 1, outputPricePerMillion: 4, qualityScore: 75, outputTokensPerSecond: 100, privacyLevel: "business", commercialUse: true, regions: ["global"], source: "LMArena", measuredAt: now, retrievedAt: now, existingTool: false, evidence: [preferenceEvidence, pricingEvidence] };
const priorities: Priority[] = ["balanced", "lowest_cost", "highest_quality", "fastest", "privacy", "existing_tools"];
const context = { priorities, budgetUsd: 10, region: "global", now, existingTools: [] };

describe("deterministic recommendation engine", () => {
  it("converts priority ranking into normalized weights", () => expect(Object.values(priorityWeights(priorities)).reduce((a, b) => a + b, 0)).toBeCloseTo(1));
  it("estimates cost from expected workload", () => expect(estimateStepCost(step, model)).toBeCloseTo(.03));
  it("hard-excludes a wrong modality", () => expect(getExclusionReasons({ ...step, requiredModalities: ["image"] }, model, context)).toContain("Missing image support"));
  it("hard-excludes missing task evidence while keeping unknown business privacy visible as a limitation", () => { const reasons = getExclusionReasons(step, { ...model, evidence: [], privacyLevel: null }, context); expect(reasons).not.toContain("Critical privacy evidence is unavailable"); expect(reasons).toContain("No writing performance evidence is available"); });
  it("still fails closed when sensitive work has no verified privacy evidence", () => expect(getExclusionReasons({ ...step, privacyRequirement: "sensitive" }, { ...model, privacyLevel: null }, context)).toContain("Critical privacy evidence is unavailable"));
  it("uses an exact custom budget as a hard eligibility limit", () => expect(getExclusionReasons(step, model, { ...context, budgetUsd: 0.01 })).toContain("Estimated step cost exceeds the remaining budget"));
  it("prefers task-specific evidence without averaging unrelated metrics", () => { const coding = { ...preferenceEvidence, metricName: "SWE-bench Verified", category: "coding", normalizedValue: 88 }; const codingStep = { ...step, name: "Debug software", plainLanguageDescription: "Fix code" }; expect(selectTaskEvidence(codingStep, { ...model, evidence: [preferenceEvidence, coding] })?.metricName).toBe("SWE-bench Verified"); });
  it("attributes sources in the scored recommendation", () => { const scored = scoreCandidate(step, model, context); expect(scored.evidence.map((item) => item.sourceUrl)).toContain("https://lmarena.ai/leaderboard"); expect(scored.roundedScore % 5).toBe(0); });
  it("uses an existing subscription at zero marginal cost", () => expect(estimateStepCost(step, { ...model, existingTool: true })).toBe(0));
  it("estimates image and video generation from published media units", () => {
    expect(estimateStepCost({ ...step, estimatedImageCount: 10, requiredCapabilities: ["image_generation"] }, { ...model, capabilities: ["image_generation"], imagePricePerThousand: 40 })).toBeCloseTo(.4);
    expect(estimateStepCost({ ...step, estimatedVideoMinutes: 1.5, requiredCapabilities: ["video_generation"] }, { ...model, capabilities: ["video_generation"], videoPricePerMinute: 6 })).toBeCloseTo(9);
  });
  it("keeps matching subscriptions and identifies cancellable ones", () => { const plan = generateStrategyPlan([step], [{ ...model, existingTool: true }], { ...context, existingTools: ["Provider", "Unused tool"] }, "recommended"); expect(plan.existingSubscriptions.kept).toContain("Provider"); expect(plan.existingSubscriptions.couldCancel).toContain("Unused tool"); });
  it("detects a genuinely better replacement", () => { const current = scoreCandidate(step, model, context); const candidate = { ...current, roundedScore: current.roundedScore + 10 }; expect(isMateriallyBetter(current, candidate)).toBe(true); });
  it("classifies regulated and specialist tasks deterministically", () => { expect(taskCategory({ ...step, name: "Review a commercial contract", plainLanguageDescription: "Legal compliance" })).toBe("legal"); expect(taskCategory({ ...step, name: "Analyse patient notes", plainLanguageDescription: "Clinical health summary" })).toBe("healthcare"); });
  it("does not substitute general reasoning for long-document evidence", () => { const longStep = { ...step, name: "Summarise a long document", plainLanguageDescription: "Read a book with many pages" }; expect(selectTaskEvidence(longStep, model)).toBeNull(); });
  it("keeps auditable monthly workload multipliers in configuration", () => expect(MONTHLY_FREQUENCY_MULTIPLIERS.daily).toBe(22));
  it("labels thin evidence without fabricated percentages", () => expect(scoreCandidate(step, { ...model, inputPricePerMillion: null, outputPricePerMillion: null, privacyLevel: null, commercialUse: null, outputTokensPerSecond: null, mappingConfidence: "exact" }, context).evidenceConfidence).toBe("Limited"));
});
