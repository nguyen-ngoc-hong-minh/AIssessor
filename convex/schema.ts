import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(), name: v.optional(v.string()), avatarUrl: v.optional(v.string()),
    accountType: v.optional(v.union(v.literal("individual"), v.literal("team"), v.literal("enterprise"))),
    onboardingComplete: v.boolean(), preferredLanguage: v.string(), createdAt: v.number(), updatedAt: v.number(),
  }).index("by_email", ["email"]),
  profiles: defineTable({
    userId: v.id("users"), answers: v.any(), AIExperience: v.optional(v.string()), monthlyBudget: v.optional(v.string()),
    teamSize: v.optional(v.string()), companySize: v.optional(v.string()), industry: v.optional(v.string()), updatedAt: v.number(),
  }).index("by_user", ["userId"]),
  strategies: defineTable({
    userId: v.id("users"), teamId: v.optional(v.id("teams")), usageType: v.union(v.literal("one_off"), v.literal("monthly")),
    title: v.string(), originalInput: v.string(), expectedResult: v.string(), deadline: v.optional(v.string()), budget: v.optional(v.number()),
    priorities: v.array(v.string()), status: v.union(v.literal("draft"), v.literal("planned"), v.literal("approved"), v.literal("complete")),
    createdAt: v.number(), updatedAt: v.number(),
  }).index("by_user", ["userId", "updatedAt"]).index("by_team", ["teamId", "updatedAt"]),
  workflowSteps: defineTable({
    strategyId: v.id("strategies"), order: v.number(), name: v.string(), description: v.string(), requirements: v.any(), estimates: v.any(),
    approved: v.boolean(), createdAt: v.number(), updatedAt: v.number(),
  }).index("by_strategy", ["strategyId", "order"]),
  strategyPlans: defineTable({
    strategyId: v.id("strategies"), planType: v.string(), recommendations: v.any(), costEstimate: v.any(), timeEstimate: v.any(),
    confidence: v.string(), assumptions: v.array(v.string()), dataSnapshotId: v.id("dataSnapshots"), createdAt: v.number(),
  }).index("by_strategy", ["strategyId", "createdAt"]),
  canonicalModels: defineTable({
    canonicalId: v.string(), name: v.string(), provider: v.string(), modalities: v.array(v.string()), capabilities: v.array(v.string()),
    contextWindow: v.optional(v.number()), active: v.boolean(), commercialUse: v.optional(v.boolean()), privacyLevel: v.optional(v.string()),
    regions: v.array(v.string()), updatedAt: v.number(),
  }).index("by_canonical_id", ["canonicalId"]).index("by_provider", ["provider", "active"]),
  benchmarkObservations: defineTable({
    modelId: v.id("canonicalModels"), metric: v.string(), score: v.number(), source: v.string(), measuredAt: v.number(), retrievedAt: v.number(), confidence: v.string(),
  }).index("by_model_metric", ["modelId", "metric", "retrievedAt"]),
  pricingObservations: defineTable({
    modelId: v.id("canonicalModels"), pricingType: v.string(), amount: v.number(), unit: v.string(), currency: v.string(), source: v.string(), effectiveAt: v.number(), retrievedAt: v.number(),
  }).index("by_model_type", ["modelId", "pricingType", "retrievedAt"]),
  dataSnapshots: defineTable({ source: v.string(), rawPayload: v.any(), payloadHash: v.string(), fetchedAt: v.number(), valid: v.boolean() })
    .index("by_source", ["source", "fetchedAt"]),
  syncRuns: defineTable({
    source: v.string(), status: v.string(), createdCount: v.number(), updatedCount: v.number(), failedCount: v.number(),
    startedAt: v.number(), completedAt: v.optional(v.number()), error: v.optional(v.string()),
  }).index("by_source", ["source", "startedAt"]),
  subscriptions: defineTable({
    userId: v.id("users"), stripeCustomerId: v.string(), stripeSubscriptionId: v.optional(v.string()), stripePriceId: v.optional(v.string()),
    plan: v.union(v.literal("free"), v.literal("plus"), v.literal("team"), v.literal("enterprise")), status: v.string(),
    currentPeriodEnd: v.optional(v.number()), cancelAtPeriodEnd: v.boolean(), updatedAt: v.number(),
  }).index("by_user", ["userId"]).index("by_customer", ["stripeCustomerId"]).index("by_subscription", ["stripeSubscriptionId"]),
  teams: defineTable({ ownerId: v.id("users"), name: v.string(), createdAt: v.number() }).index("by_owner", ["ownerId"]),
  teamMembers: defineTable({ teamId: v.id("teams"), userId: v.id("users"), role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")), createdAt: v.number() })
    .index("by_team", ["teamId"]).index("by_user", ["userId"]).index("by_team_user", ["teamId", "userId"]),
});
