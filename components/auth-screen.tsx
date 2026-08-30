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
                    Get Started with <span className="grd">Aissessor</span>.
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
                  fallbackRedirectUrl="/home"
                  appearance={{
                    elements: {
                      rootBox: "w-full max-w-[360px] mx-auto px-4",
                      cardBox: "w-full shadow-none bg-transparent overflow-visible",
                      card: "bg-transparent shadow-none p-0 w-full border-none overflow-visible",
                      headerTitle: "text-ink text-2xl font-bold font-sans text-center mb-1",
                      headerSubtitle: "text-ink-3 text-xs text-center mb-3",
                      socialButtonsBlockButtonContainer: "flex flex-col items-center gap-1.5 w-full my-2 relative",
                      socialButtonsBlockButtonBadge: "relative top-0 left-0 transform-none inline-block mx-auto mb-4 px-3 py-1 text-[11px] font-medium text-ink-2 bg-slate-100 dark:bg-slate-800 border border-indigo-400/30 rounded-full shadow-sm",
                      socialButtonsBlockButton: "rounded-full bg-input-bg border border-input-border text-ink hover:opacity-90 text-xs py-2.5 px-4 font-medium transition-all w-full styled-input relative",
                      socialButtonsBlockButtonText: "text-ink text-xs font-medium",
                      dividerLine: "bg-line",
                      dividerText: "text-ink-3 text-[10px] font-mono uppercase px-2",
                      formFieldLabel: "text-ink text-xs font-medium mb-1 block px-2",
                      formFieldInput: "rounded-full bg-input-bg border border-input-border text-ink text-xs px-4 py-2.5 focus:border-indigo transition-all w-full mb-2.5 styled-input",
                      formButtonPrimary: "rounded-full btn-primary text-xs font-semibold py-3 transition-all w-full mt-2 mb-2 shadow-none",
                      footer: "bg-transparent border-t border-line pt-3 mt-3 text-xs text-ink-3 text-center",
                      footerActionText: "text-ink-3 text-xs",
                      footerActionLink: "text-indigo hover:underline font-medium text-xs ml-1",
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
                  forceRedirectUrl="/home"
                  appearance={{
                    elements: {
                      rootBox: "w-full max-w-[360px] mx-auto px-4",
                      cardBox: "w-full shadow-none bg-transparent overflow-visible",
                      card: "bg-transparent shadow-none p-0 w-full border-none overflow-visible",
                      headerTitle: "text-ink text-2xl font-bold font-sans text-center mb-1",
                      headerSubtitle: "text-ink-3 text-xs text-center mb-3",
                      socialButtonsBlockButtonContainer: "flex flex-col items-center gap-1.5 w-full my-2 relative",
                      socialButtonsBlockButtonBadge: "relative top-0 left-0 transform-none inline-block mx-auto mb-4 px-3 py-1 text-[11px] font-medium text-ink-2 bg-slate-100 dark:bg-slate-800 border border-indigo-400/30 rounded-full shadow-sm",
                      socialButtonsBlockButton: "rounded-full bg-input-bg border border-input-border text-ink hover:opacity-90 text-xs py-2.5 px-4 font-medium transition-all w-full styled-input relative",
                      socialButtonsBlockButtonText: "text-ink text-xs font-medium",
                      dividerLine: "bg-line",
                      dividerText: "text-ink-3 text-[10px] font-mono uppercase px-2",
                      formFieldLabel: "text-ink text-xs font-medium mb-1 block px-2",
                      formFieldInput: "rounded-full bg-input-bg border border-input-border text-ink text-xs px-4 py-2.5 focus:border-indigo transition-all w-full mb-2.5 styled-input",
                      formButtonPrimary: "rounded-full btn-primary text-xs font-semibold py-3 transition-all w-full mt-2 mb-2 shadow-none",
                      footer: "bg-transparent border-t border-line pt-3 mt-3 text-xs text-ink-3 text-center",
                      footerActionText: "text-ink-3 text-xs",
                      footerActionLink: "text-indigo hover:underline font-medium text-xs ml-1",
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="auth-footer">
        Aissessor &bull; AI Stack Procurement Advisor &bull; 2026
      </footer>
    </div>
  );
}
