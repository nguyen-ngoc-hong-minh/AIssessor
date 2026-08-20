"use client";

import { SignOutButton } from "@clerk/react";
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
  const initial = (user.name || user.email).trim().charAt(0).toUpperCase();

  return (
    <div className="editorial-app-shell min-h-screen relative overflow-x-hidden">
      {/* Background Deck Glow */}
      <div className="deck-bg" />

      {/* Presentation Deck Persistent Top-Left Brand Logo */}
      <Brand />

      {/* Presentation Deck Persistent Top-Right Controls: Deck Nav & User Profile Avatar */}
      <div className="dash-top-right-chrome">
        <DashboardDeckNav />

        <div className="flex items-center gap-2 pl-3 border-l border-white/15">
          <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 text-white font-bold grid place-items-center text-xs shadow-md flex-none">
            {initial}
          </span>
          <SignOutButton redirectUrl="/">
            <button className="p-2 text-tertiary hover:text-white transition-colors flex-none" aria-label="Sign out" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </SignOutButton>
        </div>
      </div>

      {/* Main Workspace Presentation Area */}
      <main className="editorial-app-main min-h-screen relative z-10">{children}</main>

      {/* Presentation Deck Bottom-Left Tag */}
      <div className="section-tag">
        <span className="dt" />
        AIssessor Workspace
      </div>

      {/* Presentation Deck Bottom-Right Footer */}
      <div className="deck-footer">
        Press <kbd>M</kbd> for menu &bull; <kbd>1</kbd>&ndash;<kbd>4</kbd> jump
      </div>
    </div>
  );
}
