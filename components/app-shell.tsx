"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/react";
import { History } from "lucide-react";
import { Brand } from "./brand";
import { PageTransition } from "./page-transition";

export function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string; email: string };
}) {
  const pathname = usePathname();
  const isLongPage = pathname.startsWith("/strategy/") || pathname.startsWith("/admin/");
  const { user: clerkUser } = useUser();
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
      : "Aissessor Member";

  return (
    <div className="editorial-app-shell min-h-screen relative overflow-x-hidden">
      {/* Background Deck Glow */}
      <div className="deck-bg" />

      {/* Presentation Deck Persistent Top-Left Brand Logo */}
      <Brand />

      {/* Persistent history shortcut. Dashboard content is intentionally one page. */}
      <div className="dash-top-right-chrome">
        <Link className="top-history-button" href="/dashboard#consultation-history" aria-label="View previous consultations">
          <History aria-hidden="true" />
          <span>Previous consultations</span>
        </Link>
      </div>

      {/* Main Workspace Presentation Area */}
      <main className={`editorial-app-main min-h-screen relative z-10 ${isLongPage ? "is-long-page" : ""}`}>
        <PageTransition>{children}</PageTransition>
      </main>

      {/* Clerk's profile menu handles avatar changes, account settings, and sign out. */}
      <div className="dash-user-pill">
        <UserButton userProfileMode="modal" />
        <strong className="text-xs text-white font-medium truncate max-w-[150px]">{displayName}</strong>
      </div>
    </div>
  );
}
