import { anyApi } from "convex/server";
import { ConvexHttpClient } from "convex/browser";
import { getChatGPTUser } from "@/app/chatgpt-auth";

type QueryReference = Parameters<ConvexHttpClient["query"]>[0];
type MutationReference = Parameters<ConvexHttpClient["mutation"]>[0];
type ActionReference = Parameters<ConvexHttpClient["action"]>[0];
type Args = Record<string, unknown>;

export async function authenticatedConvex() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  const authKey = process.env.BENCHFLOW_SERVER_KEY;
  if (!url || !authKey) throw new Error("Live Convex service is not configured");
  const user = await getChatGPTUser();
  if (!user) throw new Error("Unauthenticated");

  const client = new ConvexHttpClient(url);
  const auth = { authKey, userEmail: user.email.toLowerCase(), userName: user.fullName ?? undefined };
  await client.mutation(anyApi.users.ensureFromHostedIdentity, auth);

  return {
    query: (reference: QueryReference, args: Args) => client.query(reference, { ...args, ...auth }),
    mutation: (reference: MutationReference, args: Args) => client.mutation(reference, { ...args, ...auth }),
    action: (reference: ActionReference, args: Args) => client.action(reference, { ...args, ...auth }),
  };
}

export function apiError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected request failure";
  const status = message === "Unauthenticated" ? 401 : message.includes("not configured") ? 503 : 400;
  return Response.json({ error: message }, { status });
}
