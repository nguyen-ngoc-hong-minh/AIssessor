import { cronJobs, anyApi } from "convex/server";

const crons = cronJobs();
crons.interval("sync Artificial Analysis", { hours: 12 }, anyApi.actions.syncModels.syncSource, { source: "artificial_analysis" });
crons.interval("sync OpenRouter", { hours: 12 }, anyApi.actions.syncModels.syncSource, { source: "openrouter" });
export default crons;
