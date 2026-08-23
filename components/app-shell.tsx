"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { SignOutButton, useUser } from "@clerk/react";
import {
  LayoutDashboard,
  PlusCircle,
  CreditCard,
  Settings,
  Users,
  BarChart2,
  Activity,
  LogOut,
  Sparkles,
  History,
} from "lucide-react";
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

  const mainNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "New Strategy", href: "/choose-usage", icon: PlusCircle },
    { label: "Billing & Stack", href: "/billing", icon: CreditCard },
    { label: "Settings", href: "/settings", icon: Settings },
    { label: "Team", href: "/team", icon: Users },
  ];

  const adminNavItems = [
    { label: "Analytics", href: "/admin/analytics", icon: BarChart2 },
    { label: "Evidence", href: "/admin/evidence", icon: Activity },
  ];

  return (
    <div className="editorial-app-shell min-h-screen relative overflow-x-hidden">
      {/* Background Deck Glow */}
      <div className="deck-bg" />

      {/* ================= DESKTOP LEFT SIDEBAR (Standard Dashboard Sidebar) ================= */}
      <aside className="dash-sidebar hidden md:flex flex-col fixed top-0 left-0 bottom-0 z-40 p-5 justify-between">
        <div className="space-y-6">
          {/* Top Brand Logo */}
          <div className="flex items-center justify-between pt-1 px-2">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg tracking-tight hover:opacity-90 transition">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(165,180,252,0.8)] animate-pulse" />
              <span>AIssessor</span>
            </Link>
            <span className="font-mono text-[10px] uppercase tracking-wider text-indigo-soft bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
              v4.0
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-2">
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-3 px-3 mb-2 font-medium">
              Navigation
            </div>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href === "/choose-usage" && pathname.startsWith("/strategy/new"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`dash-sidebar-nav-item ${isActive ? "active" : ""}`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-indigo-300" : "text-ink-2"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {isAdmin && (
              <div className="pt-4 space-y-1">
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-3 px-3 mb-2 font-medium">
                  Admin Tools
                </div>
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`dash-sidebar-nav-item ${isActive ? "active" : ""}`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-indigo-300" : "text-ink-2"}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </nav>
        </div>

        {/* User Profile Pill at Bottom of Sidebar */}
        <div className="dash-sidebar-user border-t border-white/10 pt-4 flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full border border-white/20 object-cover flex-none" />
            ) : (
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-xs grid place-items-center flex-none">
                {initial}
              </span>
            )}
            <div className="min-w-0">
              <div className="text-xs text-white font-medium truncate">{displayName}</div>
              <div className="text-[10px] text-ink-3 truncate font-mono">Pro Member</div>
            </div>
          </div>
          <SignOutButton redirectUrl="/">
            <button className="p-1.5 rounded-lg text-ink-2 hover:text-white hover:bg-white/10 transition" aria-label="Sign out" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </SignOutButton>
        </div>
      </aside>

      {/* Top Brand Logo for Mobile (when sidebar is hidden) */}
      <div className="md:hidden">
        <Brand />
      </div>

      {/* Presentation Deck Persistent Top-Right Controls: Deck Nav Toggle */}
      <div className="dash-top-right-chrome">
        <Link className="top-history-button" href="/dashboard#consultation-history" aria-label="View previous consultations">
          <History aria-hidden="true" />
          <span>Previous consultations</span>
        </Link>
        <DashboardDeckNav isAdmin={isAdmin} />
      </div>

      {/* Main Workspace Presentation Area */}
      <main className={`editorial-app-main min-h-screen relative z-10 md:pl-64 pb-20 md:pb-0 ${isLongPage ? "is-long-page" : ""}`}>
        <PageTransition>{children}</PageTransition>
      </main>

      {/* ================= MOBILE & TABLET BOTTOM MENU BAR (Figma/Mobile Style) ================= */}
      <nav className="dash-bottom-nav flex md:hidden fixed bottom-0 left-0 right-0 z-50 px-2 py-2 items-center justify-around">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === "/choose-usage" && pathname.startsWith("/strategy/new"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`dash-bottom-tab ${isActive ? "active" : ""}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-indigo-300" : "text-ink-2"}`} />
              <span>{item.label === "Billing & Stack" ? "Billing" : item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
