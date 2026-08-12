import { anyApi } from "convex/server";
import type { AuthenticatedConvexClient } from "./convex";

export async function approveThenGenerate(client: AuthenticatedConvexClient, strategyId: string) {
  await client.mutation(anyApi.strategies.approveWorkflow, { strategyId });
  return client.action(anyApi.actions.recommend.generate, { strategyId, region: "global" });
}
