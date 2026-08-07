"use client";

import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { Brand } from "./brand";

export function AuthScreen({ mode }: { mode: "sign-in" | "sign-up" }) {
  const isSignIn = mode === "sign-in";
  return <div className="auth-page"><div className="auth-brand"><Brand /></div><div className="auth-panel"><div className="auth-copy"><span className="kicker">{isSignIn ? "Welcome back" : "Start with one real project"}</span><h1>{isSignIn ? "Continue your AI strategy." : "Find your right AI setup."}</h1><p>Sign in securely with your ChatGPT account. BENCHFLOW never receives or stores your password.</p><Link href="/">← Back to home</Link></div><div className="auth-widget"><HostedSignIn isSignIn={isSignIn} /></div></div></div>;
}

function HostedSignIn({ isSignIn }: { isSignIn: boolean }) {
  const returnTo = isSignIn ? "/dashboard" : "/onboarding";
  return <section className="hosted-auth-card" aria-labelledby="hosted-auth-title"><span className="hosted-auth-icon"><Sparkles /></span><small>SECURE HOSTED ACCESS</small><h2 id="hosted-auth-title">{isSignIn ? "Welcome back to BENCHFLOW" : "Create your BENCHFLOW access"}</h2><p>Continue with the ChatGPT account already available in this browser. No additional password is needed.</p><a className="button button-primary hosted-auth-button" href={`/signin-with-chatgpt?return_to=${encodeURIComponent(returnTo)}`}>Continue with ChatGPT <ArrowRight /></a><div className="hosted-auth-note"><ShieldCheck /><span><strong>Your identity stays protected.</strong> Your account and saved strategies are linked to your verified ChatGPT email.</span></div></section>;
}
