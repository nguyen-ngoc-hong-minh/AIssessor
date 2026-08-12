import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs/webhooks", () => ({ verifyWebhook: vi.fn().mockRejectedValue(new Error("bad signature")) }));

import { POST } from "@/app/api/webhooks/clerk/route";

describe("Clerk webhook endpoint", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_CONVEX_URL = "https://example.convex.cloud";
    process.env.CLERK_WEBHOOK_SYNC_KEY = "test-sync-key";
  });

  it("rejects an event when Clerk signature verification fails", async () => {
    const request = new NextRequest("http://localhost/api/webhooks/clerk", { method: "POST", body: "{}", headers: { "content-type": "application/json", "svix-id": "evt-invalid" } });
    const response = await POST(request);
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Invalid webhook signature");
  });
});
