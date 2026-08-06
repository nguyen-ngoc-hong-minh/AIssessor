"use node";

import { actionGeneric as action, anyApi } from "convex/server";
import { v } from "convex/values";
import { ArtificialAnalysisAdapter, OpenRouterAdapter } from "../../lib/model-data/adapters";
import { normalizeArtificialAnalysis, normalizeOpenRouter } from "../../lib/model-data/normalizers";

export const syncSource = action({
  args: { source: v.union(v.literal("artificial_analysis"), v.literal("openrouter")) },
  handler: async (ctx, { source }) => {
    const runId = await ctx.runMutation(anyApi.modelSync.startRun, { source });
    try {
      const adapter = source === "artificial_analysis"
        ? new ArtificialAnalysisAdapter(process.env.ARTIFICIAL_ANALYSIS_API_KEY ?? "")
        : new OpenRouterAdapter(process.env.OPENROUTER_API_KEY ?? "");
      if ((source === "artificial_analysis" && !process.env.ARTIFICIAL_ANALYSIS_API_KEY) || (source === "openrouter" && !process.env.OPENROUTER_API_KEY)) throw new Error(`${source} is not configured`);
      const result = await adapter.fetchSnapshot();
      const models = source === "artificial_analysis" ? normalizeArtificialAnalysis(result.payload, result.fetchedAt) : normalizeOpenRouter(result.payload, result.fetchedAt);
      await ctx.runMutation(anyApi.models.ingest, { source, retrievedAt: result.fetchedAt, models });
      return await ctx.runMutation(anyApi.modelSync.saveSnapshot, { runId, source, rawPayload: result.payload, payloadHash: result.payloadHash, fetchedAt: result.fetchedAt });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown sync failure";
      await ctx.runMutation(anyApi.modelSync.failRun, { runId, error: message });
      throw new Error(message);
    }
  },
});
