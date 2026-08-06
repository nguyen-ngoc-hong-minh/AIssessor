import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { StrategyInputSchema, TaskAnalysisSchema, type StrategyInput, type TaskAnalysis } from "./schema";

const PLANNER_INSTRUCTIONS = `You are BENCHFLOW Planner AI. Convert a non-technical work description into only the necessary workflow steps.
Never name, rank, select, or recommend AI models, providers, APIs, subscriptions, or benchmark values.
Prefer deterministic or manual processing when AI is unnecessary. Add human review where errors could matter.
Use plain language. State assumptions and warnings. Produce realistic workload ranges without claiming certainty.`;

export async function createTaskAnalysis(input: StrategyInput): Promise<TaskAnalysis> {
  const validatedInput = StrategyInputSchema.parse(input);
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_PLANNER_MODEL;
  if (!apiKey || !model) throw new Error("Planner AI is not configured.");

  const client = new OpenAI({ apiKey });
  const response = await client.responses.parse({
    model,
    input: [
      { role: "system", content: PLANNER_INSTRUCTIONS },
      { role: "user", content: JSON.stringify(validatedInput) },
    ],
    text: { format: zodTextFormat(TaskAnalysisSchema, "task_analysis") },
  });

  if (!response.output_parsed) throw new Error("Planner returned no validated workflow.");
  return TaskAnalysisSchema.parse(response.output_parsed);
}
