"use client";

import { UserProfile } from "@clerk/react";
import { OnboardingForm, type OnboardingInitial } from "./onboarding-form";

export function SettingsView({ profile }: { profile: OnboardingInitial }) {
  return (
    <div className="settings-editorial-wrap">
      {/* Header */}
      <div className="editorial-page-header">
        <span className="mono-badge">[ WORKSPACE / SETTINGS ]</span>
        <h1>Account &amp; Planning Profile</h1>
        <p>Edit your default planning context, team role parameters, and security credentials.</p>
      </div>

      <div className="settings-cards-stack">
        {/* Planning Profile Card */}
        <section className="editorial-card-block">
          <div className="card-block-top">
            <div>
              <span className="mono-badge">[ SECTION 01 ]</span>
              <h2>Planning Profile</h2>
              <p>Update the default parameters BENCHFLOW uses when evaluating model capabilities and budget constraints.</p>
            </div>
          </div>

          <div className="settings-form-wrapper">
            <OnboardingForm initial={profile} mode="settings" />
          </div>
        </section>

        {/* Security & Clerk Profile Card */}
        <section className="editorial-card-block mt-8">
          <div className="card-block-top">
            <div>
              <span className="mono-badge">[ SECTION 02 ]</span>
              <h2>Sign-in &amp; Security</h2>
              <p>Manage connected Google/Apple accounts, email addresses, active sessions, and password recovery.</p>
            </div>
          </div>

          <div className="clerk-profile-shell mt-4">
            <UserProfile routing="hash" />
          </div>
        </section>
      </div>
    </div>
  );
}
