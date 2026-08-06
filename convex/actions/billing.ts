"use node";

import Stripe from "stripe";
import { actionGeneric as action, anyApi } from "convex/server";
import { v } from "convex/values";

function stripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Stripe is not configured");
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export const createCheckout = action({
  args: { plan: v.union(v.literal("plus"), v.literal("team")) },
  handler: async (ctx, { plan }) => {
    const identity = await ctx.auth.getUserIdentity(); if (!identity) throw new Error("Unauthenticated");
    const user = await ctx.runQuery(anyApi.users.current, {});
    const price = plan === "plus" ? process.env.STRIPE_PLUS_PRICE_ID : process.env.STRIPE_TEAM_PRICE_ID;
    if (!price || !process.env.APP_URL) throw new Error("Billing is not configured");
    const session = await stripeClient().checkout.sessions.create({
      mode: "subscription", line_items: [{ price, quantity: 1 }], customer_email: user.email,
      success_url: `${process.env.APP_URL}/billing?checkout=success`, cancel_url: `${process.env.APP_URL}/pricing?checkout=cancelled`,
      allow_promotion_codes: true, subscription_data: { metadata: { clerkUserId: identity.subject, plan } }, metadata: { clerkUserId: identity.subject, plan },
    });
    if (!session.url) throw new Error("Stripe returned no Checkout URL"); return session.url;
  },
});

export const createPortal = action({ args: {}, handler: async (ctx) => {
  const identity = await ctx.auth.getUserIdentity(); if (!identity) throw new Error("Unauthenticated");
  const entitlement = await ctx.runQuery(anyApi.subscriptions.entitlement, {});
  if (!entitlement || !process.env.APP_URL) throw new Error("No subscription is available to manage");
  const user = await ctx.runQuery(anyApi.users.current, {});
  const subscription = await ctx.runQuery(anyApi.subscriptions.forCurrentUser, {});
  if (!subscription?.stripeCustomerId) throw new Error(`No Stripe customer exists for ${user.email}`);
  return (await stripeClient().billingPortal.sessions.create({ customer: subscription.stripeCustomerId, return_url: `${process.env.APP_URL}/billing` })).url;
} });
