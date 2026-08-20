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
      <div className="dash-user-bottom-left flex items-center gap-3.5 backdrop-blur-xl bg-black/60 border border-white/15 px-4 py-2.5 rounded-full shadow-2xl">
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover shadow-md flex-none" />
        ) : (
          <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 text-white font-bold grid place-items-center text-xs shadow-md flex-none">
            {initial}
          </span>
        )}
        <strong className="text-xs text-white font-medium truncate max-w-[160px] px-0.5">{displayName}</strong>
        <SignOutButton redirectUrl="/">
          <button className="p-1.5 text-tertiary hover:text-white transition-colors flex-none ml-1 rounded-full hover:bg-white/10" aria-label="Sign out" title="Sign out">
            <LogOut className="w-4 h-4" />
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
