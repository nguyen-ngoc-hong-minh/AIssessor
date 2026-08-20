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

      {/* Top Persistent Chrome: Brand & Toggle Controls Bar (Replaces Sidebar) */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-black/40 border-b border-white/10">
        {/* Brand Header */}
        <Brand />

        {/* Right Controls: Deck Toggle Nav & User Avatar */}
        <div className="flex items-center gap-4">
          <DashboardDeckNav />

          <div className="flex items-center gap-3 pl-4 border-l border-white/10">
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
      </header>

      {/* Main Workspace Area (Full Width) */}
      <main className="editorial-app-main min-h-screen pt-24 pb-16 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        {children}
      </main>
    </div>
  );
}
