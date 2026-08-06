import Stripe from "stripe";
import { Webhook } from "svix";
import { anyApi, httpActionGeneric as httpAction, httpRouter } from "convex/server";

const http = httpRouter();

type ClerkEmail = { id: string; email_address: string };
type ClerkUserPayload = { id: string; first_name?: string; last_name?: string; image_url?: string; primary_email_address_id?: string; email_addresses?: ClerkEmail[] };
type ClerkEvent = { type: "user.created" | "user.updated" | "user.deleted"; data: ClerkUserPayload };

http.route({ path: "/clerk-webhook", method: "POST", handler: httpAction(async (ctx, request) => {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) return new Response("Webhook not configured", { status: 503 });
  const body = await request.text();
  let event: ClerkEvent;
  try {
    event = new Webhook(secret).verify(body, {
      "svix-id": request.headers.get("svix-id") ?? "",
      "svix-timestamp": request.headers.get("svix-timestamp") ?? "",
      "svix-signature": request.headers.get("svix-signature") ?? "",
    }) as ClerkEvent;
  } catch { return new Response("Invalid signature", { status: 400 }); }

  if (event.type === "user.deleted") {
    await ctx.runMutation(anyApi.users.removeFromClerk, { clerkUserId: event.data.id });
    return new Response("ok");
  }
  const primary = event.data.email_addresses?.find((email) => email.id === event.data.primary_email_address_id) ?? event.data.email_addresses?.[0];
  if (!primary) return new Response("No email", { status: 400 });
  await ctx.runMutation(anyApi.users.upsertFromClerk, {
    clerkUserId: event.data.id, email: primary.email_address,
    name: [event.data.first_name, event.data.last_name].filter(Boolean).join(" ") || undefined,
    avatarUrl: event.data.image_url,
  });
  return new Response("ok");
}) });

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
