import { internalMutationGeneric as internalMutation, queryGeneric as query } from "convex/server";
import { v } from "convex/values";

export const latestValidSnapshot = query({ args: { source: v.string() }, handler: async (ctx, { source }) => {
  const snapshots = await ctx.db.query("dataSnapshots").withIndex("by_source", (q) => q.eq("source", source)).order("desc").take(10);
  return snapshots.find((item) => item.valid) ?? null;
} });

export const startRun = internalMutation({ args: { source: v.string() }, handler: async (ctx, { source }) => ctx.db.insert("syncRuns", { source, status: "running", createdCount: 0, updatedCount: 0, failedCount: 0, startedAt: Date.now() }) });

export const saveSnapshot = internalMutation({ args: { runId: v.id("syncRuns"), source: v.string(), rawPayload: v.any(), payloadHash: v.string(), fetchedAt: v.number() }, handler: async (ctx, args) => {
  const id = await ctx.db.insert("dataSnapshots", { source: args.source, rawPayload: args.rawPayload, payloadHash: args.payloadHash, fetchedAt: args.fetchedAt, valid: true });
  await ctx.db.patch(args.runId, { status: "complete", completedAt: Date.now(), updatedCount: 1 }); return id;
} });

export const failRun = internalMutation({ args: { runId: v.id("syncRuns"), error: v.string() }, handler: async (ctx, { runId, error }) => ctx.db.patch(runId, { status: "failed", completedAt: Date.now(), failedCount: 1, error }) });
