/// <reference types="vite/client" />
import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import { anyApi } from "convex/server";
import schema from "@/convex/schema";

const modules = import.meta.glob("../convex/**/*.ts");

describe("Convex persistence contracts", () => {
  it("synchronizes a Clerk user without storing a password", async () => {
    const t = convexTest({ schema, modules });
    await t.mutation(anyApi.users.upsertFromClerk, { clerkUserId: "user_123", email: "test@example.com", name: "Test User" });
    const users = await t.run((ctx) => ctx.db.query("users").collect());
    expect(users).toHaveLength(1);
    expect(users[0].clerkUserId).toBe("user_123");
    expect(users[0]).not.toHaveProperty("password");
  });

  it("stores only valid dated source snapshots", async () => {
    const t = convexTest({ schema, modules });
    const runId = await t.run((ctx) => ctx.db.insert("syncRuns", { source: "openrouter", status: "running", createdCount: 0, updatedCount: 0, failedCount: 0, startedAt: 100 }));
    await t.mutation(anyApi.modelSync.saveSnapshot, { runId, source: "openrouter", rawPayload: { data: [] }, payloadHash: "hash", fetchedAt: 100 });
    const snapshots = await t.run((ctx) => ctx.db.query("dataSnapshots").collect());
    expect(snapshots[0]).toMatchObject({ source: "openrouter", valid: true, fetchedAt: 100 });
  });
});
