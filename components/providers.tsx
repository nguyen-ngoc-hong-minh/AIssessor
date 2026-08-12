"use client";

import { ClerkProvider, useAuth } from "@clerk/react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export const authConfigured = Boolean(clerkKey);
export const integrationsConfigured = Boolean(convex && clerkKey);

export function Providers({ children }: { children: React.ReactNode }) {
  if (!clerkKey) return children;

  if (!convex) {
    return <ClerkProvider publishableKey={clerkKey} signInUrl="/sign-in" signUpUrl="/sign-up" afterSignOutUrl="/">
      {children}
    </ClerkProvider>;
  }

  return <ClerkProvider publishableKey={clerkKey} signInUrl="/sign-in" signUpUrl="/sign-up" afterSignOutUrl="/">
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>{children}</ConvexProviderWithClerk>
  </ClerkProvider>;
}
