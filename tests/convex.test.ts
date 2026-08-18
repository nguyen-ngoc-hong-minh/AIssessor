/// <reference types="vite/client" />
import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import { anyApi } from "convex/server";
import schema from "@/convex/schema";

const modules = import.meta.glob("../convex/**/*.ts");

describe("Convex identity and authorization", () => {
  it("creates a Clerk-backed user and stores stakeholder onboarding without passwords", async () => {
    const t = convexTest({ schema, modules });
    const alice = t.withIdentity({ subject: "user_alice", email: "alice@example.com", name: "Alice" });
    await alice.mutation(anyApi.users.ensureCurrent, {});
    await alice.mutation(anyApi.profiles.completeOnboarding, { accountType: "individual", profession: "Research", industry: "Technology", country: "Vietnam", preferredLanguage: "English" });
    const users = await t.run((ctx) => ctx.db.query("users").collect());
    expect(users).toHaveLength(1); expect(users[0]).toMatchObject({ clerkUserId: "user_alice", email: "alice@example.com", onboardingComplete: true }); expect(users[0]).not.toHaveProperty("password");
  });
  it("prevents one Clerk user from reading another user's strategy", async () => {
    const t = convexTest({ schema, modules }); const alice = t.withIdentity({ subject: "user_alice", email: "alice@example.com" }); const bob = t.withIdentity({ subject: "user_bob", email: "bob@example.com" });
    await alice.mutation(anyApi.users.ensureCurrent, {}); await bob.mutation(anyApi.users.ensureCurrent, {});
    const strategyId = await alice.mutation(anyApi.strategies.create, { usageType: "one_off", title: "Private", originalInput: "Private project details", expectedResult: "A report", priorities: ["balanced"] });
    await expect(bob.query(anyApi.strategies.getOwned, { strategyId })).rejects.toThrow("Not found");
  });
  it("stores planner output as an unapproved workflow draft", async () => {
    const t = convexTest({ schema, modules });
    const user = t.withIdentity({ subject: "planner_user", email: "planner@example.com" });
    await user.mutation(anyApi.users.ensureCurrent, {});
    const strategyId = await user.mutation(anyApi.strategies.create, { usageType: "one_off", title: "Draft", originalInput: "Create a researched report", expectedResult: "Report", priorities: ["balanced"] });
    await user.mutation(anyApi.strategies.replaceWorkflow, { strategyId, steps: [{ order: 0, name: "Research", description: "Gather current sources", requirements: { requiredModalities: ["text"] }, estimates: { requests: 3 } }] });
    const owned = await user.query(anyApi.strategies.getOwned, { strategyId });
    expect(owned.strategy.status).toBe("planned");
    expect(owned.steps).toHaveLength(1);
    expect(owned.steps[0].approved).toBe(false);
  });
  it("blocks recommendation generation before workflow approval", async () => {
    const t = convexTest({ schema, modules });
    const user = t.withIdentity({ subject: "recommend_user", email: "recommend@example.com" });
    await user.mutation(anyApi.users.ensureCurrent, {});
    const strategyId = await user.mutation(anyApi.strategies.create, { usageType: "one_off", title: "Draft", originalInput: "Create a researched report", expectedResult: "Report", priorities: ["balanced"] });
    await expect(user.action(anyApi.actions.recommend.generate, { strategyId, region: "global" })).rejects.toMatchObject({ data: { code: "WORKFLOW_NOT_APPROVED" } });
  });
  it("processes Clerk webhooks idempotently and revokes access after deletion", async () => {
    process.env.CLERK_WEBHOOK_SYNC_KEY = "sync-test"; const t = convexTest({ schema, modules });
    const created = { syncKey: "sync-test", eventId: "evt-1", eventType: "user.created", clerkUserId: "user_webhook", email: "webhook@example.com", displayName: "Webhook User" } as const;
    expect(await t.mutation(anyApi.users.syncFromClerkWebhook, created)).toEqual({ duplicate: false });
    expect(await t.mutation(anyApi.users.syncFromClerkWebhook, created)).toEqual({ duplicate: true });
    await t.mutation(anyApi.users.syncFromClerkWebhook, { syncKey: "sync-test", eventId: "evt-2", eventType: "user.deleted", clerkUserId: "user_webhook" });
    const deleted = t.withIdentity({ subject: "user_webhook", email: "webhook@example.com" });
    await expect(deleted.query(anyApi.users.current, {})).rejects.toThrow("not synchronized");
  });
  it("stores only valid dated source snapshots", async () => {
    const t = convexTest({ schema, modules });
    const runId = await t.run((ctx) => ctx.db.insert("syncRuns", { source: "openrouter", status: "running", createdCount: 0, updatedCount: 0, failedCount: 0, startedAt: 100 }));
    await t.mutation(anyApi.modelSync.saveSnapshot, { runId, source: "openrouter", sourceUrl: "https://openrouter.ai/api/v1/models", rawPayload: { data: [] }, payloadHash: "hash", fetchedAt: 100 });
    const snapshots = await t.run((ctx) => ctx.db.query("dataSnapshots").collect());
    expect(snapshots[0]).toMatchObject({ source: "openrouter", valid: true, fetchedAt: 100 });
  });
  it("records an unchanged run as a fresh immutable revalidation snapshot", async () => {
    const t = convexTest({ schema, modules });
    const firstRun = await t.run((ctx) => ctx.db.insert("syncRuns", { source: "openrouter", status: "running", createdCount: 0, updatedCount: 0, failedCount: 0, startedAt: 100 }));
    const snapshotId = await t.mutation(anyApi.modelSync.saveSnapshot, { runId: firstRun, source: "openrouter", rawPayload: { data: [] }, payloadHash: "same", fetchedAt: 100 });
    const secondRun = await t.run((ctx) => ctx.db.insert("syncRuns", { source: "openrouter", status: "running", createdCount: 0, updatedCount: 0, failedCount: 0, startedAt: 200 }));
    await t.mutation(anyApi.modelSync.completeUnchanged, { runId: secondRun, snapshotId });
    const [snapshots, run] = await Promise.all([t.run((ctx) => ctx.db.query("dataSnapshots").collect()), t.run((ctx) => ctx.db.get(secondRun))]);
    expect(snapshots).toHaveLength(2);
    expect(run).toMatchObject({ status: "complete", unchanged: true });
    expect(run?.snapshotId).not.toBe(snapshotId);
    expect(snapshots.find((item) => item._id === run?.snapshotId)?.fetchedAt).toBeGreaterThan(100);
  });
  it("merges independent source facts before making a canonical model eligible", async () => {
    const t = convexTest({ schema, modules });
    const user = t.withIdentity({ subject: "evidence_user", email: "evidence@example.com" });
    await user.mutation(anyApi.users.ensureCurrent, {});
    const base = {
      canonicalId: "openai/gpt-4o", name: "GPT-4o", provider: "OpenAI", aliases: ["openai/gpt-4o", "gpt-4o"],
      active: true, status: "pending_evidence" as const, mappingConfidence: "exact" as const, manualReviewRequired: false, regions: [], licenses: [],
      accessOptions: [{ label: "View on OpenRouter", url: "https://openrouter.ai/openai/gpt-4o", modelId: "openai/gpt-4o", sourceUrl: "https://openrouter.ai/api/v1/models", verifiedAt: 100 }],
    };
    await t.mutation(anyApi.models.ingest, { source: "openrouter", retrievedAt: 100, models: [{ ...base, modalities: ["text", "image"], capabilities: ["structured_outputs"], contextWindow: 128000, benchmarks: [], privacy: [], prices: [{ pricingType: "input_tokens", amount: 2.5, unit: "1m_tokens", currency: "USD", effectiveAt: 100 }, { pricingType: "output_tokens", amount: 10, unit: "1m_tokens", currency: "USD", effectiveAt: 100 }] }] });
    expect(await user.query(anyApi.models.catalog, {})).toHaveLength(0);
    await t.mutation(anyApi.models.ingest, { source: "mmlu_pro", retrievedAt: 200, models: [{ ...base, modalities: [], capabilities: [], benchmarks: [{ metric: "mmlu_pro_overall", score: .72, normalizedValue: 72, category: "general", measuredAt: 200, confidence: "official_dataset" }], prices: [], privacy: [] }] });
    await t.mutation(anyApi.models.ingest, { source: "openai_official", retrievedAt: 300, models: [{ ...base, modalities: ["text", "image"], capabilities: ["structured_outputs"], contextWindow: 128000, benchmarks: [], prices: [], privacy: [{ level: "standard", sourceUrl: "https://developers.openai.com/api/docs/guides/your-data", confidence: "official_provider_docs" }] }] });
    const catalog = await user.query(anyApi.models.catalog, {});
    expect(catalog).toHaveLength(1);
    expect(catalog[0]).toMatchObject({ canonicalId: "openai/gpt-4o", status: "eligible", contextWindow: 128000 });
    expect(catalog[0].benchmarks[0]).toMatchObject({ source: "mmlu_pro", category: "general" });
    expect(catalog[0].privacy[0]).toMatchObject({ source: "openai_official", level: "standard" });
  });
});
