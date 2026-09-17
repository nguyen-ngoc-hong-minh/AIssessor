"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "./brand";
import { VisualModeToggle } from "./visual-mode-toggle";

export function SiteHeader() {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();

  return (
    <header className="trial-header">
      <Brand href="/" />
      <div className="flex items-center gap-3">
        {pathname !== "/tasks" && (
          <Link href="/tasks" className="trial-header-auth-btn">
            AI Tools
          </Link>
        )}
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

