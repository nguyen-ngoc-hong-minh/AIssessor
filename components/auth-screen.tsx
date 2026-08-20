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
                    Get Started with <span className="grd">AIssessor</span>.
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
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      cardBox: "w-full shadow-none bg-transparent",
                      card: "bg-transparent shadow-none p-0 w-full border-none",
                      headerTitle: "text-white text-2xl font-bold font-sans",
                      headerSubtitle: "text-ink-2 text-xs mb-4",
                      socialButtonsBlockButton: "rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 text-xs py-3 font-medium transition-all",
                      socialButtonsBlockButtonText: "text-white text-xs font-medium",
                      dividerLine: "bg-white/10",
                      dividerText: "text-ink-3 text-[10px] font-mono uppercase px-2",
                      formFieldLabel: "text-white text-xs font-medium mb-1.5",
                      formFieldInput: "rounded-xl bg-white/5 border border-white/10 text-white text-xs px-3.5 py-2.5 focus:border-indigo-500 transition-all",
                      formButtonPrimary: "rounded-xl bg-white hover:bg-indigo-100 text-black text-xs font-semibold py-3 transition-all w-full mt-3 shadow-lg",
                      footer: "bg-transparent border-t border-white/10 pt-4 mt-6 text-xs text-ink-3",
                      footerActionText: "text-ink-2 text-xs",
                      footerActionLink: "text-indigo-400 hover:text-indigo-300 font-medium text-xs ml-1",
                    },
                  }}
                />
              </div>
            ) : (
              <div className="clerk-container">
                <SignUp
                  routing="path"
                  path="/sign-up"
                  signInUrl="/sign-in"
                  forceRedirectUrl="/onboarding"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      cardBox: "w-full shadow-none bg-transparent",
                      card: "bg-transparent shadow-none p-0 w-full border-none",
                      headerTitle: "text-white text-2xl font-bold font-sans",
                      headerSubtitle: "text-ink-2 text-xs mb-4",
                      socialButtonsBlockButton: "rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 text-xs py-3 font-medium transition-all",
                      socialButtonsBlockButtonText: "text-white text-xs font-medium",
                      dividerLine: "bg-white/10",
                      dividerText: "text-ink-3 text-[10px] font-mono uppercase px-2",
                      formFieldLabel: "text-white text-xs font-medium mb-1.5",
                      formFieldInput: "rounded-xl bg-white/5 border border-white/10 text-white text-xs px-3.5 py-2.5 focus:border-indigo-500 transition-all",
                      formButtonPrimary: "rounded-xl bg-white hover:bg-indigo-100 text-black text-xs font-semibold py-3 transition-all w-full mt-3 shadow-lg",
                      footer: "bg-transparent border-t border-white/10 pt-4 mt-6 text-xs text-ink-3",
                      footerActionText: "text-ink-2 text-xs",
                      footerActionLink: "text-indigo-400 hover:text-indigo-300 font-medium text-xs ml-1",
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="auth-footer">
        AIssessor &bull; AI Stack Procurement Advisor &bull; 2026
      </footer>
    </div>
  );
}
