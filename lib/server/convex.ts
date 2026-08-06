import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";

export async function authenticatedConvex() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url || !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) throw new Error("Live Clerk and Convex services are not configured");
  const session = await auth(); if (!session.userId) throw new Error("Unauthenticated");
  const token = await session.getToken({ template: "convex" }); if (!token) throw new Error("Convex token is unavailable");
  const client = new ConvexHttpClient(url); client.setAuth(token); return client;
}

export function apiError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected request failure";
  const status = message === "Unauthenticated" ? 401 : message.includes("not configured") ? 503 : 400;
  return Response.json({ error: message }, { status });
}
