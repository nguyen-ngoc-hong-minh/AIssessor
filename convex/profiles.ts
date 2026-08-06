import { mutationGeneric as mutation } from "convex/server";
import { v } from "convex/values";
import { requireUser } from "./lib/auth";

export const completeOnboarding = mutation({
  args: {
    accountType: v.union(v.literal("individual"), v.literal("team"), v.literal("enterprise")), answers: v.any(),
    AIExperience: v.optional(v.string()), monthlyBudget: v.optional(v.string()), teamSize: v.optional(v.string()), companySize: v.optional(v.string()), industry: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx); const now = Date.now();
    const profile = await ctx.db.query("profiles").withIndex("by_user", (q) => q.eq("userId", user._id)).unique();
    const values = { userId: user._id, answers: args.answers, AIExperience: args.AIExperience, monthlyBudget: args.monthlyBudget, teamSize: args.teamSize, companySize: args.companySize, industry: args.industry, updatedAt: now };
    if (profile) await ctx.db.patch(profile._id, values); else await ctx.db.insert("profiles", values);
    await ctx.db.patch(user._id, { accountType: args.accountType, onboardingComplete: true, updatedAt: now });
  },
});
