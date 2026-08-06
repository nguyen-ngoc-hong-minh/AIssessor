import { z } from "zod";

export const UsageTypeSchema = z.enum(["one_off", "monthly"]);
export type UsageType = z.infer<typeof UsageTypeSchema>;

export const PrivacyRequirementSchema = z.enum(["standard", "business", "sensitive", "restricted"]);
export const MinimumQualitySchema = z.enum(["draft", "good", "professional", "critical"]);
export const ImportanceSchema = z.enum(["low", "medium", "high", "critical"]);

export const WorkflowStepSchema = z.object({
  id: z.string(),
  order: z.number().int().nonnegative(),
  name: z.string(),
  plainLanguageDescription: z.string(),
  inputDescription: z.string(),
  outputDescription: z.string(),
  dependencies: z.array(z.string()),
  canRunInParallel: z.boolean(),
  estimatedInputTokensLow: z.number().nonnegative(),
  estimatedInputTokensExpected: z.number().nonnegative(),
  estimatedInputTokensHigh: z.number().nonnegative(),
  estimatedOutputTokensLow: z.number().nonnegative(),
  estimatedOutputTokensExpected: z.number().nonnegative(),
  estimatedOutputTokensHigh: z.number().nonnegative(),
  estimatedRequestCount: z.number().int().nonnegative(),
  estimatedImageCount: z.number().int().nonnegative(),
  estimatedAudioMinutes: z.number().nonnegative(),
  estimatedVideoMinutes: z.number().nonnegative(),
  requiredModalities: z.array(z.enum(["text", "image", "audio", "video"])),
  requiredCapabilities: z.array(z.string()),
  requiresCurrentInformation: z.boolean(),
  privacyRequirement: PrivacyRequirementSchema,
  commercialUseRequired: z.boolean(),
  minimumQuality: MinimumQualitySchema,
  importance: ImportanceSchema,
  noAIEligible: z.boolean(),
  noAIAlternative: z.string(),
  humanReviewRecommended: z.boolean(),
  assumptions: z.array(z.string()),
});

export const TaskAnalysisSchema = z.object({
  title: z.string(),
  usageType: UsageTypeSchema,
  summary: z.string(),
  interpretedGoal: z.string(),
  expectedResult: z.string(),
  assumptions: z.array(z.string()),
  warnings: z.array(z.string()),
  workflowSteps: z.array(WorkflowStepSchema),
  estimatedTotalWorkload: z.string(),
});

export type WorkflowStep = z.infer<typeof WorkflowStepSchema>;
export type TaskAnalysis = z.infer<typeof TaskAnalysisSchema>;

export const PrioritySchema = z.enum([
  "lowest_cost",
  "balanced",
  "highest_quality",
  "fastest",
  "privacy",
  "existing_tools",
]);
export type Priority = z.infer<typeof PrioritySchema>;

export const StrategyInputSchema = z.object({
  usageType: UsageTypeSchema,
  description: z.string().min(20).max(5000),
  expectedResult: z.string().min(5).max(3000),
  deadline: z.string(),
  budgetUsd: z.number().nonnegative().nullable(),
  priorities: z.array(PrioritySchema).length(6),
  optionalContext: z.object({
    informationSensitivity: z.string(),
    commercialUse: z.boolean(),
    existingTools: z.array(z.string()),
    providersToAvoid: z.array(z.string()),
    preferredLanguage: z.string(),
    expectedOutputs: z.string(),
  }),
});
export type StrategyInput = z.infer<typeof StrategyInputSchema>;

export function validatePriorityRanking(priorities: readonly string[]): Priority[] {
  const parsed = z.array(PrioritySchema).length(6).parse(priorities);
  if (new Set(parsed).size !== 6) throw new Error("Each priority must appear exactly once.");
  return parsed;
}
