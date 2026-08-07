/// <reference types="vite/client" />
import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import { anyApi } from "convex/server";
import schema from "@/convex/schema";

const modules = import.meta.glob("../convex/**/*.ts");

describe("Convex persistence contracts", () => {
  it("synchronizes a hosted ChatGPT user without storing a password", async () => {
    process.env.BENCHFLOW_SERVER_KEY = "test-server-key";
    const t = convexTest({ schema, modules });
    await t.mutation(anyApi.users.ensureFromHostedIdentity, { authKey: "test-server-key", userEmail: "test@example.com", userName: "Test User" });
    const users = await t.run((ctx) => ctx.db.query("users").collect());
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe("test@example.com");
    expect(users[0]).not.toHaveProperty("password");

    await t.mutation(anyApi.profiles.completeOnboarding, {
      authKey: "test-server-key", userEmail: "test@example.com", userName: "Test User",
      accountType: "individual", answers: { q1: "Research and analysis", q2: "Weekly", q3: "USD 10–30" },
      AIExperience: "Weekly", monthlyBudget: "USD 10–30",
    });
    const profiles = await t.run((ctx) => ctx.db.query("profiles").collect());
    expect(profiles).toHaveLength(1);
    expect(profiles[0].monthlyBudget).toBe("USD 10–30");
  });

  it("stores only valid dated source snapshots", async () => {
    const t = convexTest({ schema, modules });
    const runId = await t.run((ctx) => ctx.db.insert("syncRuns", { source: "openrouter", status: "running", createdCount: 0, updatedCount: 0, failedCount: 0, startedAt: 100 }));
    await t.mutation(anyApi.modelSync.saveSnapshot, { runId, source: "openrouter", rawPayload: { data: [] }, payloadHash: "hash", fetchedAt: 100 });
    const snapshots = await t.run((ctx) => ctx.db.query("dataSnapshots").collect());
    expect(snapshots[0]).toMatchObject({ source: "openrouter", valid: true, fetchedAt: 100 });
  });
});
