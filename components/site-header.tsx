"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Brand } from "./brand";
import { VisualModeToggle } from "./visual-mode-toggle";

export function SiteHeader() {
  const { isSignedIn } = useAuth();

  return (
    <header className="trial-header">
      <Brand href="/" />
      <div className="flex items-center gap-3">
        <Link href="/tasks" className="trial-header-auth-btn">
          AI Tasks
        </Link>
        <VisualModeToggle />
        {isSignedIn ? (
          <Link href="/dashboard" className="trial-header-auth-btn">
            History
          </Link>
        ) : (
          <Link href="/sign-in" className="trial-header-auth-btn">
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}

