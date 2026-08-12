"use client";

import { UserProfile } from "@clerk/react";
import { OnboardingForm, type OnboardingInitial } from "./onboarding-form";

export function SettingsView({ profile }: { profile: OnboardingInitial }) {
  return <div className="settings-sections"><section><h2>Planning profile</h2><p>Update the context BENCHFLOW uses when shaping workflows and recommendations.</p><OnboardingForm initial={profile} mode="settings" /></section><section><h2>Sign-in and security</h2><p>Manage email addresses, connected Google or Apple accounts, password recovery, active sessions, and account deletion through Clerk.</p><div className="clerk-profile-shell"><UserProfile routing="hash" /></div></section></div>;
}
