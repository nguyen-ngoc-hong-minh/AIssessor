"use client";

import { SignIn, SignUp } from "@clerk/react";
import { KeyRound, ArrowLeft, ShieldCheck, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { Brand } from "./brand";
import { authConfigured } from "./providers";

function AuthConfigurationNotice() {
  return (
    <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-white flex items-start gap-4">
      <KeyRound className="w-6 h-6 text-indigo-400 flex-none mt-0.5" />
      <div>
        <strong className="text-base font-semibold block text-white">Authentication Key Required</strong>
        <p className="text-xs text-ink-2 mt-1 leading-relaxed">
          Add Clerk environment keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`) to enable live user authentication.
        </p>
      </div>
    </div>
  );
}

export function AuthScreen({ mode }: { mode: "sign-in" | "sign-up" }) {
  const isSignIn = mode === "sign-in";
  return (
    <div className="auth-page-container min-h-screen relative flex flex-col justify-between overflow-hidden bg-[#0a0e1a]">
      {/* Lustro Ambient Radial Glow Background */}
      <div className="deck-bg" />

      {/* Auth Header */}
      <header className="site-header relative z-20 my-6">
        <div className="header-inner">
          <Brand />
          <Link href="/" className="btn-secondary text-xs px-4 py-2">
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back to home</span>
          </Link>
        </div>
      </header>

      {/* Main Auth Portal */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10 my-8">
        <div className="w-full max-w-4xl glass-card rounded-3xl overflow-hidden border border-white/10 grid grid-cols-1 md:grid-cols-2 shadow-2xl">
          {/* Left Hero Panel */}
          <div className="p-10 md:p-12 bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-black/60 border-r border-white/10 flex flex-col justify-between space-y-8">
            <div>
              <div className="eyebrow mb-4">
                <span className="dt" />
                AUTHENTICATION
              </div>
              <h1 className="h-display text-3xl md:text-4xl font-semibold text-white leading-tight">
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
              <p className="body-md text-ink-2 mt-4 leading-relaxed">
                {isSignIn
                  ? "Sign in securely with email or Google to access your saved AI strategies, real-time benchmark evaluations, and consolidated subscription dashboard."
                  : "Sign up securely with email or Google to build your first optimal AI stack with verified evidence, transparent costs, and automated workflows."}
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 grid place-items-center flex-none">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="text-white font-medium block">Zero Credentials Stored</strong>
                  <span className="text-ink-3">Enterprise-grade encrypted auth</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-400 grid place-items-center flex-none">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="text-white font-medium block">1,200+ Verified AI Models</strong>
                  <span className="text-ink-3">Real-time cost &amp; benchmark engine</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-cyan/20 text-cyan grid place-items-center flex-none">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="text-white font-medium block">Consolidated Subscriptions</strong>
                  <span className="text-ink-3">Eliminate software waste instantly</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Clerk Widget Area */}
          <div className="p-8 md:p-12 flex items-center justify-center bg-black/30">
            {!authConfigured ? (
              <AuthConfigurationNotice />
            ) : isSignIn ? (
              <div className="w-full">
                <SignIn
                  routing="path"
                  path="/sign-in"
                  signUpUrl="/sign-up"
                  fallbackRedirectUrl="/dashboard"
                />
              </div>
            ) : (
              <div className="w-full">
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

      {/* Footer Copyright */}
      <footer className="text-center py-6 text-xs font-mono text-ink-3 relative z-10 border-t border-white/5">
        BENCHFLOW &bull; AI Stack Procurement Advisor &bull; 2026
      </footer>
    </div>
  );
}
