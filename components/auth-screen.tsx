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
                    dividerLine: "bg-[#0213B0]/20",
                    dividerText: "text-[#0213B0] text-[11px] font-mono uppercase px-2",
                    formFieldLabel: "text-[#0213B0] text-sm font-bold mb-2 block",
                    formFieldInput: "bg-[#F4F7F5] border-none border-b-[1.5px] border-[#0213B0] text-[#0213B0] text-sm px-4 py-3.5 outline-none transition-none w-full mb-4 rounded-none placeholder:text-[#0213B0]/60",
                    formButtonPrimary: "bg-[#0213B0] text-[#FFFFF1] hover:bg-[#0213B0] active:bg-[#0213B0] text-xs font-bold uppercase tracking-wider py-3.5 w-full mt-2 mb-4 rounded border border-[#0213B0] transition-none shadow-none",
                    footer: "bg-transparent border-t border-[#0213B0]/15 pt-4 mt-2 text-xs text-[#0213B0] text-center",
                    footerActionText: "text-[#0213B0] text-xs opacity-80",
                    footerActionLink: "text-[#0213B0] hover:underline font-bold text-xs ml-1 underline",
                    identityPreviewText: "text-[#0213B0] font-mono text-xs",
                    identityPreviewEditButton: "text-[#0213B0] font-bold text-xs underline ml-2",
                    formResendCodeLink: "text-[#0213B0] underline text-xs font-bold",
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
                    dividerLine: "bg-[#0213B0]/20",
                    dividerText: "text-[#0213B0] text-[11px] font-mono uppercase px-2",
                    formFieldLabel: "text-[#0213B0] text-sm font-bold mb-2 block",
                    formFieldInput: "bg-[#F4F7F5] border-none border-b-[1.5px] border-[#0213B0] text-[#0213B0] text-sm px-4 py-3.5 outline-none transition-none w-full mb-4 rounded-none placeholder:text-[#0213B0]/60",
                    formButtonPrimary: "bg-[#0213B0] text-[#FFFFF1] hover:bg-[#0213B0] active:bg-[#0213B0] text-xs font-bold uppercase tracking-wider py-3.5 w-full mt-2 mb-4 rounded border border-[#0213B0] transition-none shadow-none",
                    footer: "bg-transparent border-t border-[#0213B0]/15 pt-4 mt-2 text-xs text-[#0213B0] text-center",
                    footerActionText: "text-[#0213B0] text-xs opacity-80",
                    footerActionLink: "text-[#0213B0] hover:underline font-bold text-xs ml-1 underline",
                    identityPreviewText: "text-[#0213B0] font-mono text-xs",
                    identityPreviewEditButton: "text-[#0213B0] font-bold text-xs underline ml-2",
                    formResendCodeLink: "text-[#0213B0] underline text-xs font-bold",
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
