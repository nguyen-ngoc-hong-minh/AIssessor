"use client";

import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/react";
import { Brand } from "./brand";
import { PageTransition } from "./page-transition";
import { VisualModeToggle } from "./visual-mode-toggle";

export function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string; email: string };
}) {
  const pathname = usePathname();
  const isWorkspaceStart = pathname === "/home" || pathname === "/dashboard";
  const isLongPage = isWorkspaceStart || pathname.startsWith("/strategy/") || pathname.startsWith("/admin/");
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

      {/* Theme is the only persistent top-level control. */}
      <div className="dash-top-right-chrome">
        <VisualModeToggle />
      </div>

      {/* Main Workspace Presentation Area */}
      <main
        className={`editorial-app-main min-h-screen relative z-10 ${isLongPage ? "is-long-page" : ""} ${isWorkspaceStart ? "is-workspace-page" : ""}`}
      >
        <PageTransition>{children}</PageTransition>
      </main>

      {/* Presentation Deck Bottom-Left: User Profile Pill (Matches Top Toggle Glass Style) */}
      <div className="dash-user-pill">
        <UserButton userProfileMode="modal" />
        <strong className="text-xs text-white font-medium truncate max-w-[150px]">{displayName}</strong>
      </div>
    </div>
  );
}
