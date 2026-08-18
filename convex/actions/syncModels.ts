"use node";

import { actionGeneric as action, internalActionGeneric as internalAction, anyApi } from "convex/server";
import { v } from "convex/values";
import { ArtificialAnalysisAdapter, MmluProAdapter, OpenAiOfficialAdapter, OpenRouterAdapter, type ModelSourceAdapter } from "../../lib/model-data/adapters";
import { NORMALIZER_VERSIONS, normalizeArtificialAnalysis, normalizeMmluPro, normalizeOpenAiOfficial, normalizeOpenRouter } from "../../lib/model-data/normalizers";
import type { SourceId } from "../../lib/model-data/source-registry";
import { requireIdentity } from "../lib/auth";

const sourceValidator = v.union(v.literal("artificial_analysis"), v.literal("openrouter"), v.literal("mmlu_pro"), v.literal("openai_official"));

function adapterFor(source: SourceId): ModelSourceAdapter {
  if (source === "artificial_analysis") return new ArtificialAnalysisAdapter(process.env.ARTIFICIAL_ANALYSIS_API_KEY ?? "", "https://artificialanalysis.ai/api/v2", process.env.GEMINI_API_KEY ?? "");
  if (source === "openrouter") return new OpenRouterAdapter(process.env.OPENROUTER_API_KEY ?? "");
  if (source === "mmlu_pro") return new MmluProAdapter();
  return new OpenAiOfficialAdapter();
}

// Convex does not expose a shared typed action context for generic server functions.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function runSync(ctx: any, source: SourceId) {
  const runId = await ctx.runMutation(anyApi.modelSync.startRun, { source });
  try {
    const result = await adapterFor(source).fetchSnapshot();
    const previous = await ctx.runQuery(anyApi.modelSync.latestValidSnapshot, { source });
    const normalizerVersion = NORMALIZER_VERSIONS[source];
    if (previous?.payloadHash === result.payloadHash && previous.metadata?.normalizerVersion === normalizerVersion) return await ctx.runMutation(anyApi.modelSync.completeUnchanged, { runId, snapshotId: previous._id });
    const models = source === "artificial_analysis"
      ? normalizeArtificialAnalysis(result.payload, result.fetchedAt, result.sourceVersion)
      : source === "openrouter"
        ? normalizeOpenRouter(result.payload, result.fetchedAt, result.sourceVersion)
        : source === "mmlu_pro"
          ? normalizeMmluPro(result.payload, result.fetchedAt, result.sourceVersion)
          : normalizeOpenAiOfficial(result.payload, result.fetchedAt, result.sourceVersion);
    const counts = await ctx.runMutation(anyApi.models.ingest, { source, retrievedAt: result.fetchedAt, models });
    return await ctx.runMutation(anyApi.modelSync.saveSnapshot, {
      runId, source, sourceUrl: result.sourceUrl, attribution: result.attribution, rawPayload: result.payload, payloadHash: result.payloadHash,
      fetchedAt: result.fetchedAt, sourceVersion: result.sourceVersion, metadata: { ...result.metadata, normalizerVersion }, ...counts,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown sync failure";
    await ctx.runMutation(anyApi.modelSync.failRun, { runId, error: message });
    throw new Error(message);
  }
}

export const syncSource = internalAction({ args: { source: sourceValidator }, handler: async (ctx, { source }) => runSync(ctx, source) });

export const syncNow = action({ args: { source: sourceValidator }, handler: async (ctx, { source }) => {
  await requireIdentity(ctx);
  await ctx.runQuery(anyApi.modelSync.assertAdmin, {});
  return runSync(ctx, source);
} });
