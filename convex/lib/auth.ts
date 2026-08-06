import type { GenericDatabaseReader, GenericMutationCtx, GenericQueryCtx } from "convex/server";

// Generic helpers are used before Convex code generation creates the project DataModel.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AuthContext = GenericQueryCtx<any> | GenericMutationCtx<any>;

export async function requireIdentity(ctx: AuthContext) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");
  return identity;
}

export async function requireUser(ctx: AuthContext) {
  const identity = await requireIdentity(ctx);
  const user = await ctx.db.query("users").withIndex("by_clerk_user", (q) => q.eq("clerkUserId", identity.subject)).unique();
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
