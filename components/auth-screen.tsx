"use client";

import { SignIn, SignUp } from "@clerk/react";
import { KeyRound } from "lucide-react";
import Link from "next/link";
import { Brand } from "./brand";
import { authConfigured } from "./providers";

function AuthConfigurationNotice() {
  return <div className="integration-notice"><span><KeyRound /></span><div><strong>Authentication is not configured yet.</strong><p>Add the Clerk publishable and secret keys to this environment, then restart the development server. Other live data services are not required to display this form.</p></div></div>;
}

export function AuthScreen({ mode }: { mode: "sign-in" | "sign-up" }) {
  const isSignIn = mode === "sign-in";
  return <div className="auth-page"><div className="auth-brand"><Brand /></div><div className="auth-panel"><div className="auth-copy"><span className="kicker">{isSignIn ? "Welcome back" : "Start with one real project"}</span><h1>{isSignIn ? "Continue your AI strategy." : "Find your right AI setup."}</h1><p>Sign in securely with email or Google. Clerk handles verification, recovery, and passwords; BENCHFLOW never stores credentials.</p><Link href="/">Back to home</Link></div><div className="auth-widget">{!authConfigured ? <AuthConfigurationNotice /> : isSignIn ? <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" fallbackRedirectUrl="/dashboard" /> : <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" forceRedirectUrl="/onboarding" />}</div></div></div>;
}
