"use client";

import { SignIn, SignUp } from "@clerk/react";
import { KeyRound, ArrowLeft, ShieldCheck, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { Brand } from "./brand";
import { authConfigured } from "./providers";

function AuthConfigurationNotice() {
  return (
    <div className="minimal-notice">
      <KeyRound className="w-6 h-6 text-indigo-400 flex-none" />
      <div>
        <strong className="notice-title">Authentication Key Required</strong>
        <p className="notice-desc">
          Add Clerk environment keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`) to enable live user authentication.
        </p>
      </div>
    </div>
  );
}

export function AuthScreen({ mode }: { mode: "sign-in" | "sign-up" }) {
  const isSignIn = mode === "sign-in";
  return (
    <div className="auth-page-container">
      {/* Lustro Ambient Radial Background */}
      <div className="deck-bg" />

      {/* Top Header */}
      <header className="auth-header">
        <Brand />
        <Link href="/" className="auth-back-link">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to home</span>
        </Link>
      </header>

      {/* Main Glass Card Auth Portal */}
      <main className="auth-main-wrap">
        <div className="auth-editorial-card glass-card">
          {/* Left Hero Panel */}
          <div className="auth-editorial-left">
            <div>
              <div className="eyebrow mb-4">
                <span className="dt" />
                AUTHENTICATION
              </div>
              <h1 className="h-display auth-title">
                {isSignIn ? (
                  <>
                    Welcome <span className="grd">Back</span>.
                  </>
                ) : (
                  <>
                    Get Started with <span className="grd">BENCHFLOW</span>.
                  </>
                )}
              </h1>
              <p className="body-md auth-desc">
                {isSignIn
                  ? "Sign in securely with email or Google to access your saved AI strategies, real-time benchmark evaluations, and consolidated subscription dashboard."
                  : "Sign up securely with email or Google to build your first optimal AI stack with verified evidence, transparent costs, and automated workflows."}
              </p>
            </div>

            {/* Feature List */}
            <div className="auth-editorial-features">
              <div className="feature-pill">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <div>
                  <strong>Zero Credentials Stored</strong>
                  <small>Enterprise-grade encrypted auth</small>
                </div>
              </div>

              <div className="feature-pill">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <div>
                  <strong>1,200+ Verified AI Models</strong>
                  <small>Real-time cost &amp; benchmark engine</small>
                </div>
              </div>

              <div className="feature-pill">
                <Zap className="w-4 h-4 text-cyan" />
                <div>
                  <strong>Consolidated Subscriptions</strong>
                  <small>Eliminate software waste instantly</small>
                </div>
              </div>
            </div>
          </div>

          {/* Right Clerk Form Area */}
          <div className="auth-widget-box">
            {!authConfigured ? (
              <AuthConfigurationNotice />
            ) : isSignIn ? (
              <div className="clerk-container">
                <SignIn
                  routing="path"
                  path="/sign-in"
                  signUpUrl="/sign-up"
                  fallbackRedirectUrl="/dashboard"
                />
              </div>
            ) : (
              <div className="clerk-container">
                <SignUp
                  routing="path"
                  path="/sign-up"
                  signInUrl="/sign-in"
                  forceRedirectUrl="/onboarding"
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="auth-footer">
        BENCHFLOW &bull; AI Stack Procurement Advisor &bull; 2026
      </footer>
    </div>
  );
}
