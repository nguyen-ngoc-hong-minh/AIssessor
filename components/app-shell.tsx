"use client";

import { usePathname } from "next/navigation";
import { SignOutButton, useUser } from "@clerk/react";
import { History, LogOut } from "lucide-react";
import Link from "next/link";
import { Brand } from "./brand";
import { DashboardDeckNav } from "./dashboard-deck-nav";
import { PageTransition } from "./page-transition";

export function AppShell({
  children,
  user,
  isAdmin = false,
}: {
  children: React.ReactNode;
  user: { name: string; email: string };
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const isLongPage = pathname.startsWith("/strategy/");
  const { user: clerkUser } = useUser();
  const avatarUrl = clerkUser?.imageUrl;

  const rawName =
    clerkUser?.fullName ||
    (clerkUser?.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim() : "") ||
    user.name;

  const rawEmail = clerkUser?.primaryEmailAddress?.emailAddress || user.email;

  const displayName =
    rawName && !rawName.startsWith("user_")
      ? rawName
      : rawEmail && !rawEmail.startsWith("user_")
      ? rawEmail.split("@")[0]
      : "AIssessor Member";

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="editorial-app-shell min-h-screen relative overflow-x-hidden">
      {/* Background Deck Glow */}
      <div className="deck-bg" />

      {/* Presentation Deck Persistent Top-Left Brand Logo */}
      <Brand />

      {/* Presentation Deck Persistent Top-Right Controls: Deck Nav Toggle */}
      <div className="dash-top-right-chrome">
        <Link className="top-history-button" href="/dashboard#consultation-history" aria-label="View previous consultations">
          <History aria-hidden="true" />
          <span>Previous consultations</span>
        </Link>
        <DashboardDeckNav isAdmin={isAdmin} />
      </div>

      {/* Main Workspace Presentation Area */}
      <main className={`editorial-app-main min-h-screen relative z-10 ${isLongPage ? "is-long-page" : ""}`}>
        <PageTransition>{children}</PageTransition>
      </main>

      {/* Presentation Deck Bottom-Left: User Profile Pill (Matches Top Toggle Glass Style) */}
      <div className="dash-user-pill">
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="user-avatar-img" />
        ) : (
          <span className="user-avatar-fallback">{initial}</span>
        )}
        <strong className="text-xs text-white font-medium truncate max-w-[150px]">{displayName}</strong>
        <SignOutButton redirectUrl="/">
          <button className="sign-out-btn" aria-label="Sign out" title="Sign out">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
