"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useMemo } from "react";

export const integrationsConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.NEXT_PUBLIC_CONVEX_URL);

export function Providers({ children }: { children: React.ReactNode }) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!clerkKey || !convexUrl) return children;
  return <ConfiguredProviders clerkKey={clerkKey} convexUrl={convexUrl}>{children}</ConfiguredProviders>;
}

function ConfiguredProviders({ children, clerkKey, convexUrl }: { children: React.ReactNode; clerkKey: string; convexUrl: string }) {
  const client = useMemo(() => new ConvexReactClient(convexUrl), [convexUrl]);
  return <ClerkProvider publishableKey={clerkKey}><ConvexProviderWithClerk client={client} useAuth={useAuth}>{children}</ConvexProviderWithClerk></ClerkProvider>;
}
