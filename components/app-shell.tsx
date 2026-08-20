"use client";

import { SignOutButton } from "@clerk/react";
import { BarChart3, CreditCard, Database, LogOut, Plus, Settings, Presentation } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "./brand";

const mainNavLinks = [
  { href: "/dashboard", label: "Strategies", icon: BarChart3 },
  { href: "/choose-usage", label: "New strategy", icon: Plus },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

const presentationLink = { href: "/", label: "Presentation Deck", icon: Presentation };

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
  const visibleLinks = isAdmin
    ? [...mainNavLinks, { href: "/admin/evidence", label: "Evidence", icon: Database }, presentationLink]
    : [...mainNavLinks, presentationLink];
  const initial = (user.name || user.email).trim().charAt(0).toUpperCase();

  return (
    <div className="editorial-app-shell flex min-h-screen">
      {/* Background Deck Glow */}
      <div className="deck-bg" />

      <aside className="editorial-sidebar w-64 flex-none border-r border-white/10 p-6 flex flex-col justify-between bg-black/40 backdrop-blur-xl relative z-20 min-h-screen">
        <div>
          {/* Sidebar Brand Header */}
          <div className="mb-8">
            <Brand />
          </div>

          {/* Action Button: New Strategy */}
          <div className="mb-8">
            <Link href="/choose-usage" className="btn-primary full-width justify-center text-xs py-3 w-full flex items-center gap-2">
              <Plus className="w-4 h-4 text-black flex-none" />
              <span>New Strategy</span>
            </Link>
          </div>

          {/* Navigation Links List */}
          <nav className="space-y-1">
            <span className="font-mono text-[10px] text-tertiary uppercase tracking-widest block px-3 mb-3">
              WORKSPACE
            </span>

            {/* Main Navigation Links */}
            {mainNavLinks.map(({ href, label, icon: Icon }) => {
              const active = path.startsWith(href) || (label === "New strategy" && path.startsWith("/strategy/new"));
              return (
                <Link
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
                    active
                      ? "bg-indigo-500/15 text-indigo-300 font-medium border border-indigo-500/30"
                      : "text-secondary hover:text-white hover:bg-white/5"
                  }`}
                  href={href}
                  key={href}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-indigo-400" : ""}`} />
                  <span className="text-xs">{label}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 ml-auto shadow-[0_0_8px_#6366f1]" />}
                </Link>
              );
            })}

            {/* Separator before Presentation Deck */}
            <div className="pt-4 mt-4 border-t border-white/10">
              <span className="font-mono text-[10px] text-tertiary uppercase tracking-widest block px-3 mb-3">
                PRESENTATION DECK
              </span>
              <Link
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
                  path === "/"
                    ? "bg-indigo-500/15 text-indigo-300 font-medium border border-indigo-500/30"
                    : "text-secondary hover:text-white hover:bg-white/5"
                }`}
                href={presentationLink.href}
              >
                <Presentation className={`w-4 h-4 ${path === "/" ? "text-indigo-400" : "text-indigo-400/70"}`} />
                <span className="text-xs">{presentationLink.label}</span>
                {path === "/" && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 ml-auto shadow-[0_0_8px_#6366f1]" />}
              </Link>
            </div>
          </nav>
        </div>

        {/* Sidebar User Profile Footer */}
        <div className="flex items-center gap-3 pt-6 border-t border-white/10 mt-8">
          <span className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 text-white font-bold grid place-items-center text-xs shadow-md flex-none">
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            <strong className="block text-xs text-white truncate font-medium">{user.name}</strong>
            <small className="block text-[11px] text-tertiary truncate">{user.email}</small>
          </div>
          <SignOutButton redirectUrl="/">
            <button className="p-2 text-tertiary hover:text-white transition-colors flex-none" aria-label="Sign out" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </SignOutButton>
        </div>
      </aside>

      <main className="editorial-app-main flex-1 p-8 md:p-12 relative z-10 min-w-0 overflow-y-auto">{children}</main>
    </div>
  );
}
