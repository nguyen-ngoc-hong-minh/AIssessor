import Stripe from "stripe";
import { anyApi, httpActionGeneric as httpAction, httpRouter } from "convex/server";

const http = httpRouter();

http.route({ path: "/stripe-webhook", method: "POST", handler: httpAction(async (ctx, request) => {
  const secretKey = process.env.STRIPE_SECRET_KEY; const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) return new Response("Webhook not configured", { status: 503 });
  const signature = request.headers.get("stripe-signature"); if (!signature) return new Response("Missing signature", { status: 400 });
  const body = await request.text(); let event: Stripe.Event;
  try { event = await new Stripe(secretKey).webhooks.constructEventAsync(body, signature, webhookSecret); }
  catch { return new Response("Invalid signature", { status: 400 }); }

  if (["customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"].includes(event.type)) {
    const subscription = event.data.object as Stripe.Subscription;
    const clerkUserId = subscription.metadata.clerkUserId; const plan = subscription.metadata.plan;
    if (clerkUserId && ["plus", "team"].includes(plan)) {
      const item = subscription.items.data[0];
      const periodEnd = item?.current_period_end ? item.current_period_end * 1000 : undefined;
      await ctx.runMutation(anyApi.subscriptions.upsertVerified, {
        clerkUserId, stripeCustomerId: String(subscription.customer), stripeSubscriptionId: subscription.id,
        stripePriceId: item?.price.id, plan, status: subscription.status, currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      });
    }
  }
  return new Response("ok");
}) });

export default http;
