"use client";

import { SignOutButton } from "@clerk/react";
import { BarChart3, CreditCard, Database, LogOut, Plus, Settings, Users, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "./brand";

const links = [
  { href: "/dashboard", label: "Strategies", icon: BarChart3 },
  { href: "/choose-usage", label: "New strategy", icon: Plus },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/team", label: "Team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({
  children,
  user,
  isAdmin = false,
}: {
  children: React.ReactNode;
  user: { name: string; email: string };
  isAdmin?: boolean;
}) {
  const path = usePathname();
  const visibleLinks = isAdmin ? [...links, { href: "/admin/evidence", label: "Evidence", icon: Database }] : links;
  const initial = (user.name || user.email).trim().charAt(0).toUpperCase();

  return (
    <div className="editorial-app-shell">
      {/* Background Deck Glow */}
      <div className="deck-bg" />

      <aside className="editorial-sidebar">
        <div className="sidebar-header mb-6">
          <Brand />
        </div>

        <div className="sidebar-action-btn-wrap mb-6">
          <Link href="/choose-usage" className="btn-primary full-width justify-center">
            <Plus className="w-4 h-4" />
            <span>New Strategy</span>
          </Link>
        </div>

        <nav className="sidebar-nav-list space-y-1">
          <span className="font-mono text-[10px] text-tertiary uppercase tracking-widest block px-3 mb-2">
            WORKSPACE
          </span>
          {visibleLinks.map(({ href, label, icon: Icon }) => {
            const active = path.startsWith(href) || (label === "New strategy" && path.startsWith("/strategy/new"));
            return (
              <Link
                className={`sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  active
                    ? "bg-indigo-500/15 text-indigo-300 font-medium border border-indigo-500/30"
                    : "text-secondary hover:text-white hover:bg-white/5"
                }`}
                href={href}
                key={href}
              >
                <Icon className={`w-4 h-4 ${active ? "text-indigo-400" : ""}`} />
                <span>{label}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 ml-auto shadow-[0_0_8px_#6366f1]" />}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-profile-card flex items-center gap-3 pt-4 border-t border-white/10 mt-auto">
          <span className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 text-white font-bold grid place-items-center text-xs shadow-md">
            {initial}
          </span>
          <div className="profile-details min-w-0 flex-1">
            <strong className="block text-xs text-white truncate font-medium">{user.name}</strong>
            <small className="block text-[11px] text-tertiary truncate">{user.email}</small>
          </div>
          <SignOutButton redirectUrl="/">
            <button className="p-2 text-tertiary hover:text-white transition-colors" aria-label="Sign out" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </SignOutButton>
        </div>
      </aside>

      <main className="editorial-app-main relative z-10">{children}</main>
    </div>
  );
}
