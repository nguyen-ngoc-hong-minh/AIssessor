import OpenAI from "openai";
import { zodResponseFormat, zodTextFormat } from "openai/helpers/zod";
import { StrategyInputSchema, TaskAnalysisSchema, type StrategyInput, type TaskAnalysis } from "./schema";
import { ApplicationError } from "../application-errors";

const PLANNER_INSTRUCTIONS = `You are BENCHFLOW Planner AI. Convert a non-technical project brief or monthly task list into only the necessary, task-specific workflow steps.
Never name, rank, select, or recommend AI models, providers, APIs, subscriptions, or benchmark values.
Prefer deterministic or manual processing when AI is unnecessary. Add human review where errors could matter.
For one-off work, decompose the requested deliverable from source gathering through final review. Do not repeat the brief as a generic single step.
For monthly work, preserve each user's task and scale request/output estimates using its normalized monthlyUses and quality level.
Use plain language. State assumptions and warnings. Produce realistic workload ranges without claiming certainty.`;

type PlannerEnvironment = {
  GEMINI_API_KEY?: string;
  GEMINI_PLANNER_MODEL?: string;
  OPENAI_API_KEY?: string;
  OPENAI_PLANNER_MODEL?: string;
};
type PlannerClient = Pick<OpenAI, "chat" | "responses">;

function plannerSettings(environment: PlannerEnvironment) {
  const geminiKey = environment.GEMINI_API_KEY?.trim();
  const geminiModel = environment.GEMINI_PLANNER_MODEL?.trim();
  if (geminiKey || geminiModel) {
    return {
      provider: "Google Gemini" as const,
      apiKey: geminiKey || null,
      model: geminiModel || null,
      configured: Boolean(geminiKey && geminiModel),
    };
  }

  const openAIKey = environment.OPENAI_API_KEY?.trim();
  const openAIModel = environment.OPENAI_PLANNER_MODEL?.trim();
  return {
    provider: "OpenAI" as const,
    apiKey: openAIKey || null,
    model: openAIModel || null,
    configured: Boolean(openAIKey && openAIModel),
  };
}

export function getPlannerConfiguration(environment: PlannerEnvironment = process.env as PlannerEnvironment) {
  const { provider, model, configured } = plannerSettings(environment);
  return { provider, model, configured };
}

export async function createTaskAnalysis(input: StrategyInput, options: { environment?: PlannerEnvironment; client?: PlannerClient } = {}): Promise<TaskAnalysis> {
  const validatedInput = StrategyInputSchema.parse(input);
  const environment = options.environment ?? process.env as PlannerEnvironment;
  const configuration = plannerSettings(environment);
  if (!configuration.apiKey || !configuration.model) throw new ApplicationError("PLANNER_NOT_CONFIGURED");

  const client = options.client ?? new OpenAI(configuration.provider === "Google Gemini"
    ? { apiKey: configuration.apiKey, baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/" }
    : { apiKey: configuration.apiKey });

  if (configuration.provider === "Google Gemini") {
    const completion = await client.chat.completions.parse({
      model: configuration.model,
      messages: [
        { role: "system", content: PLANNER_INSTRUCTIONS },
        { role: "user", content: JSON.stringify(validatedInput) },
      ],
      response_format: zodResponseFormat(TaskAnalysisSchema, "task_analysis"),
    });
    const parsed = completion.choices[0]?.message.parsed;
    if (!parsed) throw new ApplicationError("PLANNER_FAILED");
    return TaskAnalysisSchema.parse(parsed);
  }

  const response = await client.responses.parse({
    model: configuration.model,
    input: [
      { role: "system", content: PLANNER_INSTRUCTIONS },
      { role: "user", content: JSON.stringify(validatedInput) },
    ],
    text: { format: zodTextFormat(TaskAnalysisSchema, "task_analysis") },
  });

  if (!response.output_parsed) throw new ApplicationError("PLANNER_FAILED");
  return TaskAnalysisSchema.parse(response.output_parsed);
}
