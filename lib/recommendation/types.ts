import type { Priority, WorkflowStep } from "@/lib/planner/schema";

export type EvidenceReference = {
  kind: "benchmark" | "pricing" | "privacy" | "license";
  source: string; sourceUrl: string | null; retrievedAt: number; modelVersion: string | null;
  metricName: string; rawValue: unknown; normalizedValue: number | null; category: string;
  confidence: string; notes: string | null;
};

export type CanonicalModel = {
  id: string; name: string; provider: string; active: boolean; modalities: string[]; capabilities: string[];
  contextWindow: number | null; inputPricePerMillion: number | null; outputPricePerMillion: number | null;
  qualityScore: number | null; outputTokensPerSecond: number | null;
  privacyLevel: "standard" | "business" | "sensitive" | "restricted" | null; commercialUse: boolean | null;
  regions: string[]; source: string; sourceUrl?: string | null; measuredAt: number | null; retrievedAt: number;
  existingTool: boolean; evidence?: EvidenceReference[];
  mappingConfidence?: "exact" | "explicit_alias" | "unmatched";
};

export type Exclusion = { modelId: string; modelName: string; reasons: string[] };
export type FitLabel = "Strong Fit" | "Good Fit" | "Possible Fit" | "Limited Evidence";
export type CandidateScore = {
  model: CanonicalModel; roundedScore: number; label: FitLabel; estimatedCostUsd: number; estimatedSavingsUsd: number;
  explanation: string[]; limitations: string[]; evidence: EvidenceReference[]; evidenceConfidence: "High" | "Moderate" | "Limited";
};
export type StepRecommendation = { stepId: string; selected: CandidateScore | null; alternatives: CandidateScore[]; exclusions: Exclusion[]; dataUpdatedAt: number | null };
export type RecommendationContext = { priorities: Priority[]; budgetUsd: number | null; region: string; now: number; existingTools?: string[] };
export type StrategyVariant = "recommended" | "lowest_cost" | "highest_quality" | "fastest" | "privacy";
export type StrategyPlan = {
  variant: StrategyVariant; steps: StepRecommendation[]; fixedCostUsd: number; apiCostUsd: number; totalCostUsd: number;
  estimatedSavingsUsd: number; existingSubscriptions: { kept: string[]; couldCancel: string[] };
  assumptions: string[]; dataUpdatedAt: number | null;
};
export type RecommendationRequest = { steps: WorkflowStep[]; models: CanonicalModel[]; context: RecommendationContext };
