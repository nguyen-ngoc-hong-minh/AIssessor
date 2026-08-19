export const BASE_WEIGHTS = {
  performance: 22,
  cost: 18,
  speed: 13,
  privacy: 14,
  commercial: 10,
  existing: 8,
  evidence: 9,
  freshness: 6,
} as const;

export const QUALITY_MINIMUM = { draft: 0, good: 45, professional: 65, critical: 80 } as const;

export const MONTHLY_FREQUENCY_MULTIPLIERS = {
  rarely: 1,
  occasionally: 2,
  weekly: 4,
  several_week: 12,
  daily: 22,
} as const;

export const TASK_EVIDENCE_MAP = {
  coding: ["coding", "coding_knowledge"],
  software_engineering: ["software_engineering", "coding"],
  finance: ["finance", "reasoning"],
  legal: ["legal", "reasoning"],
  healthcare: ["healthcare", "reasoning"],
  research: ["research", "reasoning", "general"],
  long_document: ["long_document"],
  multimodal: ["multimodal"],
  writing: ["writing", "preference", "general", "reasoning"],
  reasoning: ["reasoning", "general"],
  general: ["general", "reasoning"],
  image: ["multimodal", "image"],
  video: ["video", "multimodal"],
} as const;

export type TaskCategory = keyof typeof TASK_EVIDENCE_MAP;
