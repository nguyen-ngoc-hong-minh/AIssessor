import type { Metadata } from "next";
import { anyApi } from "convex/server";
import { SettingsView } from "@/components/settings-view";
import { authenticatedConvex } from "@/lib/server/convex";

export const metadata: Metadata = { title: "Settings" };
export default async function SettingsPage() {
  const client = await authenticatedConvex();
  const current = await client.query(anyApi.users.current, {}) as {
    user: { accountType?: "individual" | "team" | "enterprise"; preferredLanguage: string };
    profile: { profession?: string; industry?: string; teamSize?: string; companySize?: string; departments?: string[]; country?: string; preferredLanguage?: string } | null;
  };
  return <div className="page-wrap"><div className="page-title"><div><span className="kicker">Settings</span><h1>Profile and security</h1><p>Edit planning context and manage the Clerk account linked to BENCHFLOW.</p></div></div><SettingsView profile={{ accountType: current.user.accountType, preferredLanguage: current.profile?.preferredLanguage ?? current.user.preferredLanguage, ...current.profile }} /></div>;
}
