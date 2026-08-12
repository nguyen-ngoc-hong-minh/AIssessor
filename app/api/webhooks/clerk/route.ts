import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { ConvexHttpClient } from "convex/browser";
import { anyApi } from "convex/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  const syncKey = process.env.CLERK_WEBHOOK_SYNC_KEY;
  if (!url || !syncKey) return new Response("Clerk synchronization is not configured", { status: 503 });
  let event;
  try {
    event = await verifyWebhook(request);
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }
  if (!["user.created", "user.updated", "user.deleted"].includes(event.type)) return new Response("Ignored", { status: 200 });
  const eventId = request.headers.get("svix-id");
  if (!eventId) return new Response("Missing webhook event id", { status: 400 });
  const data = event.data;
  if (!data.id) return new Response("Missing Clerk user id", { status: 400 });
  const email = "email_addresses" in data
    ? data.email_addresses.find((item) => item.id === data.primary_email_address_id)?.email_address ?? data.email_addresses[0]?.email_address
    : undefined;
  const displayName = "first_name" in data ? [data.first_name, data.last_name].filter(Boolean).join(" ") || data.username || undefined : undefined;
  const avatarUrl = "image_url" in data ? data.image_url : undefined;
  const client = new ConvexHttpClient(url);
  await client.mutation(anyApi.users.syncFromClerkWebhook, {
    syncKey, eventId, eventType: event.type, clerkUserId: data.id, email, displayName, avatarUrl,
  });
  return new Response("Webhook processed", { status: 200 });
}
