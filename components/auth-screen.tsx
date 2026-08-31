"use client";

import { SignIn, SignUp } from "@clerk/react";
import { KeyRound } from "lucide-react";
import Link from "next/link";
import { Brand } from "./brand";
import { authConfigured } from "./providers";
import { VisualModeToggle } from "./visual-mode-toggle";

function AuthConfigurationNotice() {
  return (
    <div className="minimal-notice">
      <KeyRound className="w-6 h-6 text-[#0213B0] flex-none" />
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
    <div className="auth-page-clean">
      {/* Top Fixed Header with Brand, Theme Toggle and Back to Home */}
      <header className="trial-header">
        <Brand />
        <div className="flex items-center gap-3">
          <VisualModeToggle />
          <Link href="/" className="trial-header-auth-btn">
            Back to home
          </Link>
        </div>
      </header>

      {/* Main Clean Centered Auth Container */}
      <main className="auth-clean-container">
        <div className="auth-clean-card">
          <div className="auth-clean-header">
            <h1 className="auth-clean-title">{isSignIn ? "Sign in" : "Sign up"}</h1>
            <p className="auth-clean-subtitle">
              {isSignIn ? "Sign in to access your saved AI strategy and dashboard" : "Create your account to get started"}
            </p>
          </div>

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
                    rootBox: "w-full",
                    cardBox: "w-full shadow-none bg-transparent overflow-visible",
                    card: "bg-transparent shadow-none p-0 w-full border-none overflow-visible",
                    header: "hidden",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButtonContainer: "flex flex-col gap-2.5 w-full mb-4",
                    socialButtonsBlockButton: "rounded bg-[#F4F7F5] dark:bg-[#0213B0]/20 border border-[#0213B0] dark:border-[#FFFFF1] text-[#0213B0] dark:text-[#FFFFF1] hover:opacity-80 text-xs py-3 px-4 font-bold uppercase transition-all w-full flex items-center justify-center gap-2",
                    socialButtonsBlockButtonText: "text-[#0213B0] dark:text-[#FFFFF1] text-xs font-bold font-mono tracking-wider",
                    dividerLine: "bg-[#0213B0]/20 dark:bg-[#FFFFF1]/20",
                    dividerText: "text-[#0213B0] dark:text-[#FFFFF1] text-[11px] font-mono uppercase px-2",
                    formFieldLabel: "text-[#0213B0] dark:text-[#FFFFF1] text-xs font-mono font-bold uppercase mb-1.5 block",
                    formFieldInput: "bg-[#F4F7F5] dark:bg-[#0213B0]/10 border-b-2 border-[#0213B0] dark:border-[#FFFFF1] text-[#0213B0] dark:text-[#FFFFF1] text-sm px-3.5 py-3 outline-none transition-all w-full mb-4 rounded-none",
                    formButtonPrimary: "bg-[#0213B0] text-[#FFFFF1] dark:bg-[#FFFFF1] dark:text-[#0213B0] hover:opacity-90 text-xs font-bold uppercase tracking-wider py-3.5 transition-all w-full mt-2 mb-4 rounded shadow-none border border-[#0213B0] dark:border-[#FFFFF1]",
                    footer: "bg-transparent border-t border-[#0213B0]/15 dark:border-[#FFFFF1]/15 pt-4 mt-2 text-xs text-[#0213B0] dark:text-[#FFFFF1] text-center",
                    footerActionText: "text-[#0213B0] dark:text-[#FFFFF1] text-xs opacity-80",
                    footerActionLink: "text-[#0213B0] dark:text-[#FFFFF1] hover:underline font-bold text-xs ml-1 underline",
                    identityPreviewText: "text-[#0213B0] dark:text-[#FFFFF1] font-mono text-xs",
                    identityPreviewEditButton: "text-[#0213B0] dark:text-[#FFFFF1] font-bold text-xs underline ml-2",
                    formResendCodeLink: "text-[#0213B0] dark:text-[#FFFFF1] underline text-xs font-bold",
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
                    rootBox: "w-full",
                    cardBox: "w-full shadow-none bg-transparent overflow-visible",
                    card: "bg-transparent shadow-none p-0 w-full border-none overflow-visible",
                    header: "hidden",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButtonContainer: "flex flex-col gap-2.5 w-full mb-4",
                    socialButtonsBlockButton: "rounded bg-[#F4F7F5] dark:bg-[#0213B0]/20 border border-[#0213B0] dark:border-[#FFFFF1] text-[#0213B0] dark:text-[#FFFFF1] hover:opacity-80 text-xs py-3 px-4 font-bold uppercase transition-all w-full flex items-center justify-center gap-2",
                    socialButtonsBlockButtonText: "text-[#0213B0] dark:text-[#FFFFF1] text-xs font-bold font-mono tracking-wider",
                    dividerLine: "bg-[#0213B0]/20 dark:bg-[#FFFFF1]/20",
                    dividerText: "text-[#0213B0] dark:text-[#FFFFF1] text-[11px] font-mono uppercase px-2",
                    formFieldLabel: "text-[#0213B0] dark:text-[#FFFFF1] text-xs font-mono font-bold uppercase mb-1.5 block",
                    formFieldInput: "bg-[#F4F7F5] dark:bg-[#0213B0]/10 border-b-2 border-[#0213B0] dark:border-[#FFFFF1] text-[#0213B0] dark:text-[#FFFFF1] text-sm px-3.5 py-3 outline-none transition-all w-full mb-4 rounded-none",
                    formButtonPrimary: "bg-[#0213B0] text-[#FFFFF1] dark:bg-[#FFFFF1] dark:text-[#0213B0] hover:opacity-90 text-xs font-bold uppercase tracking-wider py-3.5 transition-all w-full mt-2 mb-4 rounded shadow-none border border-[#0213B0] dark:border-[#FFFFF1]",
                    footer: "bg-transparent border-t border-[#0213B0]/15 dark:border-[#FFFFF1]/15 pt-4 mt-2 text-xs text-[#0213B0] dark:text-[#FFFFF1] text-center",
                    footerActionText: "text-[#0213B0] dark:text-[#FFFFF1] text-xs opacity-80",
                    footerActionLink: "text-[#0213B0] dark:text-[#FFFFF1] hover:underline font-bold text-xs ml-1 underline",
                    identityPreviewText: "text-[#0213B0] dark:text-[#FFFFF1] font-mono text-xs",
                    identityPreviewEditButton: "text-[#0213B0] dark:text-[#FFFFF1] font-bold text-xs underline ml-2",
                    formResendCodeLink: "text-[#0213B0] dark:text-[#FFFFF1] underline text-xs font-bold",
                  },
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
