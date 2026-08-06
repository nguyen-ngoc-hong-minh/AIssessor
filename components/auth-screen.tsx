"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Brand } from "./brand";
import { IntegrationNotice } from "./integration-notice";
import { integrationsConfigured } from "./providers";

export function AuthScreen({ mode }: { mode: "sign-in" | "sign-up" }) {
  return <div className="auth-page"><div className="auth-brand"><Brand /></div><div className="auth-panel"><div className="auth-copy"><span className="kicker">{mode === "sign-in" ? "Welcome back" : "Start with one real project"}</span><h1>{mode === "sign-in" ? "Continue your AI strategy." : "Find your right AI setup."}</h1><p>Email verification, Google, and Apple sign-in are handled securely by Clerk. BENCHFLOW never stores your password.</p><Link href="/">← Back to home</Link></div><div className="auth-widget">{integrationsConfigured ? mode === "sign-in" ? <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" forceRedirectUrl="/dashboard" /> : <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" forceRedirectUrl="/onboarding" /> : <IntegrationNotice />}</div></div></div>;
}
