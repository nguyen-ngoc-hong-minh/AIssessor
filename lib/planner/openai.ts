import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { StrategyInputSchema, TaskAnalysisSchema, type StrategyInput, type TaskAnalysis } from "./schema";
import { ApplicationError } from "../application-errors";

const PLANNER_INSTRUCTIONS = `You are BENCHFLOW Planner AI. Convert a non-technical project brief or monthly task list into only the necessary, task-specific workflow steps.
Never name, rank, select, or recommend AI models, providers, APIs, subscriptions, or benchmark values.
Prefer deterministic or manual processing when AI is unnecessary. Add human review where errors could matter.
For one-off work, decompose the requested deliverable from source gathering through final review. Do not repeat the brief as a generic single step.
For monthly work, preserve each user's task and scale request/output estimates using its normalized monthlyUses and quality level.
Use plain language. State assumptions and warnings. Produce realistic workload ranges without claiming certainty.`;

type PlannerEnvironment = { OPENAI_API_KEY?: string; OPENAI_PLANNER_MODEL?: string };
type PlannerClient = Pick<OpenAI, "responses">;

export function getPlannerConfiguration(environment: PlannerEnvironment = process.env as PlannerEnvironment) {
  return {
    provider: "OpenAI" as const,
    model: environment.OPENAI_PLANNER_MODEL?.trim() || null,
    configured: Boolean(environment.OPENAI_API_KEY?.trim() && environment.OPENAI_PLANNER_MODEL?.trim()),
  };
}

export async function createTaskAnalysis(input: StrategyInput, options: { environment?: PlannerEnvironment; client?: PlannerClient } = {}): Promise<TaskAnalysis> {
  const validatedInput = StrategyInputSchema.parse(input);
  const environment = options.environment ?? process.env as PlannerEnvironment;
  const apiKey = environment.OPENAI_API_KEY?.trim();
  const model = environment.OPENAI_PLANNER_MODEL?.trim();
  if (!apiKey || !model) throw new ApplicationError("PLANNER_NOT_CONFIGURED");

  const client = options.client ?? new OpenAI({ apiKey });
  const response = await client.responses.parse({
    model,
    input: [
      { role: "system", content: PLANNER_INSTRUCTIONS },
      { role: "user", content: JSON.stringify(validatedInput) },
    ],
    text: { format: zodTextFormat(TaskAnalysisSchema, "task_analysis") },
  });

  if (!response.output_parsed) throw new ApplicationError("PLANNER_FAILED");
  return TaskAnalysisSchema.parse(response.output_parsed);
}
