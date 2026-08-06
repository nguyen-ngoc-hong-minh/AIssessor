import { internalMutationGeneric as internalMutation, mutationGeneric as mutation, queryGeneric as query } from "convex/server";
import { v } from "convex/values";
import { canAccessStrategy, requireUser } from "./lib/auth";

export const listMine = query({ args: {}, handler: async (ctx) => { const user = await requireUser(ctx); return ctx.db.query("strategies").withIndex("by_user", (q) => q.eq("userId", user._id)).order("desc").take(20); } });

export const getOwned = query({ args: { strategyId: v.id("strategies") }, handler: async (ctx, { strategyId }) => {
  const user = await requireUser(ctx); const strategy = await ctx.db.get(strategyId);
  if (!strategy || !(await canAccessStrategy(ctx.db, String(user._id), strategy))) throw new Error("Not found");
  const steps = await ctx.db.query("workflowSteps").withIndex("by_strategy", (q) => q.eq("strategyId", strategyId)).collect();
  return { strategy, steps };
} });

export const create = mutation({
  args: { usageType: v.union(v.literal("one_off"), v.literal("monthly")), title: v.string(), originalInput: v.string(), expectedResult: v.string(), deadline: v.optional(v.string()), budget: v.optional(v.number()), priorities: v.array(v.string()) },
  handler: async (ctx, args) => { const user = await requireUser(ctx); const now = Date.now(); return ctx.db.insert("strategies", { ...args, userId: user._id, status: "draft", createdAt: now, updatedAt: now }); },
});

export const duplicate = mutation({ args: { strategyId: v.id("strategies") }, handler: async (ctx, { strategyId }) => {
  const user = await requireUser(ctx); const strategy = await ctx.db.get(strategyId);
  if (!strategy || String(strategy.userId) !== String(user._id)) throw new Error("Forbidden");
  const now = Date.now();
  const copyId = await ctx.db.insert("strategies", {
    userId: user._id, usageType: strategy.usageType, title: `${strategy.title} (copy)`,
    originalInput: strategy.originalInput, expectedResult: strategy.expectedResult,
    deadline: strategy.deadline, budget: strategy.budget, priorities: strategy.priorities,
    status: "planned", createdAt: now, updatedAt: now,
  });
  const steps = await ctx.db.query("workflowSteps").withIndex("by_strategy", (q) => q.eq("strategyId", strategyId)).collect();
  for (const step of steps) await ctx.db.insert("workflowSteps", {
    strategyId: copyId, order: step.order, name: step.name, description: step.description,
    requirements: step.requirements, estimates: step.estimates, approved: false, createdAt: now, updatedAt: now,
  });
  return copyId;
} });

export const replaceWorkflow = mutation({
  args: { strategyId: v.id("strategies"), steps: v.array(v.object({ order: v.number(), name: v.string(), description: v.string(), requirements: v.any(), estimates: v.any() })) },
  handler: async (ctx, { strategyId, steps }) => {
    const user = await requireUser(ctx); const strategy = await ctx.db.get(strategyId);
    if (!strategy || String(strategy.userId) !== String(user._id)) throw new Error("Forbidden");
    const existing = await ctx.db.query("workflowSteps").withIndex("by_strategy", (q) => q.eq("strategyId", strategyId)).collect();
    await Promise.all(existing.map((step) => ctx.db.delete(step._id))); const now = Date.now();
    for (const step of steps) await ctx.db.insert("workflowSteps", { strategyId, ...step, approved: false, createdAt: now, updatedAt: now });
    await ctx.db.patch(strategyId, { status: "planned", updatedAt: now });
  },
});

export const approveWorkflow = mutation({ args: { strategyId: v.id("strategies") }, handler: async (ctx, { strategyId }) => {
  const user = await requireUser(ctx); const strategy = await ctx.db.get(strategyId);
  if (!strategy || String(strategy.userId) !== String(user._id)) throw new Error("Forbidden");
  const steps = await ctx.db.query("workflowSteps").withIndex("by_strategy", (q) => q.eq("strategyId", strategyId)).collect();
  for (const step of steps) await ctx.db.patch(step._id, { approved: true, updatedAt: Date.now() });
  await ctx.db.patch(strategyId, { status: "approved", updatedAt: Date.now() });
} });

export const remove = mutation({ args: { strategyId: v.id("strategies") }, handler: async (ctx, { strategyId }) => {
  const user = await requireUser(ctx); const strategy = await ctx.db.get(strategyId);
  if (!strategy || String(strategy.userId) !== String(user._id)) throw new Error("Forbidden");
  const steps = await ctx.db.query("workflowSteps").withIndex("by_strategy", (q) => q.eq("strategyId", strategyId)).collect();
  for (const step of steps) await ctx.db.delete(step._id); await ctx.db.delete(strategyId);
} });

export const saveGeneratedPlans = internalMutation({ args: { strategyId: v.id("strategies"), dataSnapshotId: v.id("dataSnapshots"), plans: v.array(v.any()) }, handler: async (ctx, { strategyId, dataSnapshotId, plans }) => {
  const existing = await ctx.db.query("strategyPlans").withIndex("by_strategy", (q) => q.eq("strategyId", strategyId)).collect();
  for (const plan of existing) await ctx.db.delete(plan._id);
  for (const plan of plans) await ctx.db.insert("strategyPlans", { strategyId, planType: String(plan.variant), recommendations: plan.steps, costEstimate: { fixed: plan.fixedCostUsd, api: plan.apiCostUsd, total: plan.totalCostUsd }, timeEstimate: {}, confidence: plan.steps.some((step: { selected?: { label?: string } | null }) => step.selected?.label === "Limited Evidence") ? "Limited Evidence" : "Good Fit", assumptions: plan.assumptions, dataSnapshotId, createdAt: Date.now() });
  await ctx.db.patch(strategyId, { status: "complete", updatedAt: Date.now() });
} });
