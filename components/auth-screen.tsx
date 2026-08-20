"use client";

import { SignIn, SignUp } from "@clerk/react";
import { KeyRound, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Brand } from "./brand";
import { authConfigured } from "./providers";

function AuthConfigurationNotice() {
  return (
    <div className="minimal-notice">
      <KeyRound className="w-5 h-5 text-black flex-none" />
      <div>
        <strong>Authentication Key Required</strong>
        <p>Add Clerk environment keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`) to enable live user authentication.</p>
      </div>
    </div>
  );
}

export function AuthScreen({ mode }: { mode: "sign-in" | "sign-up" }) {
  const isSignIn = mode === "sign-in";
  return (
    <div className="auth-page-container">
      <header className="auth-header">
        <Brand />
        <Link href="/" className="auth-back-link">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to home</span>
        </Link>
      </header>

      <main className="auth-main-wrap">
        <div className="auth-editorial-card">
          <div className="auth-editorial-left">
            <span className="mono-badge">[ AUTHENTICATION ]</span>
            <h1>{isSignIn ? "Welcome Back." : "Get Started with BENCHFLOW."}</h1>
            <p>
              {isSignIn
                ? "Sign in securely with email or Google to access your saved AI strategy plans, evidence evaluations, and team workspace."
                : "Sign in securely with email or Google to build your first optimal AI stack with verified benchmarks, clear costs, and actionable workflows."}
            </p>
            <div className="auth-editorial-features">
              <div className="feature-pill">
                <span>01</span>
                <strong>Zero Credentials Stored</strong>
              </div>
              <div className="feature-pill">
                <span>02</span>
                <strong>Verified Privacy &amp; Access</strong>
              </div>
            </div>
          </div>

          <div className="auth-widget-box">
            {!authConfigured ? (
              <AuthConfigurationNotice />
            ) : isSignIn ? (
              <SignIn
                routing="path"
                path="/sign-in"
                signUpUrl="/sign-up"
                fallbackRedirectUrl="/dashboard"
              />
            ) : (
              <SignUp
                routing="path"
                path="/sign-up"
                signInUrl="/sign-in"
                forceRedirectUrl="/onboarding"
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
