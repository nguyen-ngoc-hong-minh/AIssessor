import type { GenericDatabaseReader, GenericMutationCtx, GenericQueryCtx } from "convex/server";
import { v } from "convex/values";

// Generic helpers are used before Convex code generation creates the project DataModel.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AuthContext = GenericQueryCtx<any> | GenericMutationCtx<any>;

export const hostedAuthArgs = { authKey: v.string(), userEmail: v.string(), userName: v.optional(v.string()) };
export type HostedAuth = { authKey: string; userEmail: string; userName?: string };

export function requireServerAuth(authKey: string) {
  const expected = process.env.BENCHFLOW_SERVER_KEY;
  if (!expected || authKey !== expected) throw new Error("Unauthenticated");
}

export async function requireUser(ctx: AuthContext, auth: HostedAuth) {
  requireServerAuth(auth.authKey);
  const user = await ctx.db.query("users").withIndex("by_email", (q) => q.eq("email", auth.userEmail.toLowerCase())).unique();
  if (!user) throw new Error("User profile is not synchronized");
  return user;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function canAccessStrategy(db: GenericDatabaseReader<any>, userId: string, strategy: { userId: unknown; teamId?: unknown }) {
  if (String(strategy.userId) === userId) return true;
  if (!strategy.teamId) return false;
  type IndexRange = { eq(field: string, value: unknown): IndexRange };
  const untypedDb = db as unknown as { query(table: string): { withIndex(index: string, builder: (range: IndexRange) => IndexRange): { unique(): Promise<unknown> } } };
  const member = await untypedDb.query("teamMembers").withIndex("by_team_user", (q) => q.eq("teamId", strategy.teamId).eq("userId", userId)).unique();
  return Boolean(member);
}
