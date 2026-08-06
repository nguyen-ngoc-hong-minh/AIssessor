import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

const protectedPrefixes = [
  "/onboarding", "/choose-usage", "/strategy", "/dashboard", "/billing",
  "/settings", "/team", "/api/onboarding", "/api/strategies", "/api/billing", "/api/teams",
];

const configuredMiddleware = clerkMiddleware(async (auth, request) => {
  if (protectedPrefixes.some((prefix) => request.nextUrl.pathname === prefix || request.nextUrl.pathname.startsWith(`${prefix}/`))) {
    await auth.protect();
  }
});

export default process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  ? configuredMiddleware
  : function unconfiguredProxy(_request: NextRequest) { void _request; return NextResponse.next(); };

export const config = { matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"] };
