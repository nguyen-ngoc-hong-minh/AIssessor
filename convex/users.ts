import { mutationGeneric as mutation, queryGeneric as query } from "convex/server";
import { hostedAuthArgs, requireServerAuth, requireUser } from "./lib/auth";

export const current = query({ args: hostedAuthArgs, handler: async (ctx, args) => requireUser(ctx, args) });

export const ensureFromHostedIdentity = mutation({
  args: hostedAuthArgs,
  handler: async (ctx, args) => {
    requireServerAuth(args.authKey);
    const email = args.userEmail.toLowerCase(); const now = Date.now();
    const existing = await ctx.db.query("users").withIndex("by_email", (q) => q.eq("email", email)).unique();
    if (existing) { await ctx.db.patch(existing._id, { name: args.userName ?? existing.name, updatedAt: now }); return existing._id; }
    return ctx.db.insert("users", { email, name: args.userName, onboardingComplete: false, preferredLanguage: "English", createdAt: now, updatedAt: now });
  },
});
