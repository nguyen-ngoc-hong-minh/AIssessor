"use client";

import { SignOutButton, useUser } from "@clerk/react";
import { LogOut } from "lucide-react";
import { Brand } from "./brand";
import { DashboardDeckNav } from "./dashboard-deck-nav";

export function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string; email: string };
  isAdmin?: boolean;
}) {
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

  const displayEmail =
    rawEmail && !rawEmail.startsWith("user_") && !rawEmail.includes("@clerk.invalid")
      ? rawEmail
      : "";

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="editorial-app-shell min-h-screen relative overflow-x-hidden">
      {/* Background Deck Glow */}
      <div className="deck-bg" />

      {/* Presentation Deck Persistent Top-Left Brand Logo */}
      <Brand />

      {/* Presentation Deck Persistent Top-Right Controls: Deck Nav Toggle */}
      <div className="dash-top-right-chrome">
        <DashboardDeckNav />
      </div>

      {/* Main Workspace Presentation Area */}
      <main className="editorial-app-main min-h-screen relative z-10">{children}</main>

      {/* Presentation Deck Bottom-Left: User Profile Badge & Avatar */}
      <div className="dash-user-bottom-left flex items-center gap-3 backdrop-blur-xl bg-black/50 border border-white/10 px-3.5 py-2 rounded-full shadow-2xl">
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="w-7 h-7 rounded-full object-cover shadow-md flex-none" />
        ) : (
          <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 text-white font-bold grid place-items-center text-xs shadow-md flex-none">
            {initial}
          </span>
        )}
        <div className="min-w-0 pr-1">
          <strong className="block text-xs text-white font-medium truncate max-w-[150px]">{displayName}</strong>
          {displayEmail && <small className="block text-[10px] text-tertiary truncate max-w-[150px]">{displayEmail}</small>}
        </div>
        <SignOutButton redirectUrl="/">
          <button className="p-1 text-tertiary hover:text-white transition-colors flex-none ml-1" aria-label="Sign out" title="Sign out">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </SignOutButton>
      </div>

      {/* Presentation Deck Bottom-Right Footer */}
      <div className="deck-footer">
        Press <kbd>M</kbd> for menu &bull; <kbd>1</kbd>&ndash;<kbd>4</kbd> jump
      </div>
    </div>
  );
}
