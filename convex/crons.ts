import { cronJobs, anyApi } from "convex/server";

const crons = cronJobs();
crons.interval("sync Artificial Analysis", { hours: 12 }, anyApi.actions.syncModels.syncSource, { source: "artificial_analysis" });
crons.interval("sync OpenRouter", { hours: 6 }, anyApi.actions.syncModels.syncSource, { source: "openrouter" });
crons.interval("sync MMLU-Pro", { hours: 24 }, anyApi.actions.syncModels.syncSource, { source: "mmlu_pro" });
crons.interval("sync OpenAI official docs", { hours: 12 }, anyApi.actions.syncModels.syncSource, { source: "openai_official" });
export default crons;
