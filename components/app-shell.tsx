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
      <aside className="editorial-sidebar">
        <div className="sidebar-header">
          <Brand />
        </div>

        <div className="sidebar-action-btn-wrap">
          <Link href="/choose-usage" className="minimal-btn minimal-btn-dark full-width">
            <Plus className="w-4 h-4" />
            <span>New Strategy</span>
          </Link>
        </div>

        <nav className="sidebar-nav-list">
          <span className="nav-section-label">[ WORKSPACE ]</span>
          {visibleLinks.map(({ href, label, icon: Icon }) => {
            const active = path.startsWith(href) || (label === "New strategy" && path.startsWith("/strategy/new"));
            return (
              <Link className={`sidebar-link ${active ? "active-link" : ""}`} href={href} key={href}>
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {active && <ArrowUpRight className="w-3.5 h-3.5 ml-auto text-black" />}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-profile-card">
          <span className="profile-initial">{initial}</span>
          <div className="profile-details">
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </div>
          <SignOutButton redirectUrl="/">
            <button className="signout-icon-btn" aria-label="Sign out" title="Sign out">
              <LogOut className="w-4 h-4 text-black" />
            </button>
          </SignOutButton>
        </div>
      </aside>

      <main className="editorial-app-main">{children}</main>
    </div>
  );
}
