import { internalMutationGeneric as internalMutation, queryGeneric as query } from "convex/server";
import { v } from "convex/values";
import { requireUser } from "./lib/auth";

export const current = query({ args: {}, handler: async (ctx) => requireUser(ctx) });

export const upsertFromClerk = internalMutation({
  args: { clerkUserId: v.string(), email: v.string(), name: v.optional(v.string()), avatarUrl: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db.query("users").withIndex("by_clerk_user", (q) => q.eq("clerkUserId", args.clerkUserId)).unique();
    if (existing) { await ctx.db.patch(existing._id, { email: args.email, name: args.name, avatarUrl: args.avatarUrl, updatedAt: now }); return existing._id; }
    return ctx.db.insert("users", { ...args, onboardingComplete: false, preferredLanguage: "English", createdAt: now, updatedAt: now });
  },
});

export const removeFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  handler: async (ctx, { clerkUserId }) => {
    const existing = await ctx.db.query("users").withIndex("by_clerk_user", (q) => q.eq("clerkUserId", clerkUserId)).unique();
    if (existing) await ctx.db.delete(existing._id);
  },
});
