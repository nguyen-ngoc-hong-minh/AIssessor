import type { Metadata } from "next";
import { anyApi } from "convex/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { IntegrationNotice } from "@/components/integration-notice";
import { OnboardingForm } from "@/components/onboarding-form";
import { integrationsConfigured } from "@/components/providers";
import { authenticatedConvex } from "@/lib/server/convex";

export const metadata: Metadata = { title: "Onboarding" };
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  if (!integrationsConfigured) return <div className="page-wrap"><IntegrationNotice /></div>;
  const client = await authenticatedConvex();
  const current = await client.query(anyApi.users.current, {}) as { user: { name?: string; email: string; onboardingComplete: boolean } };
  if (current.user.onboardingComplete) redirect("/dashboard");
  return <AppShell user={{ name: current.user.name ?? current.user.email, email: current.user.email }}><div className="page-wrap"><div className="page-title"><div><span className="kicker">Set up your profile</span><h1>Who are we optimizing AI for?</h1><p>We’ll tailor the questions to an individual, team, or enterprise.</p></div></div><OnboardingForm /></div></AppShell>;
}
