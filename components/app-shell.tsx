"use client";

import { SignOutButton } from "@clerk/react";
import { BarChart3, CreditCard, Database, LogOut, Plus, Settings, Users } from "lucide-react";
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

export function AppShell({ children, user, isAdmin = false }: { children: React.ReactNode; user: { name: string; email: string }; isAdmin?: boolean }) {
  const path = usePathname();
  const visibleLinks = isAdmin ? [...links, { href: "/admin/evidence", label: "Evidence", icon: Database }] : links;
  const initial = (user.name || user.email).trim().charAt(0).toUpperCase();
  return <div className="app-frame"><aside className="app-sidebar"><div className="sidebar-brand"><Brand /><small>AI stack advisor</small></div><nav><span className="sidebar-label">Workspace</span>{visibleLinks.map(({ href, label, icon: Icon }) => { const active = path.startsWith(href) || (label === "New strategy" && path.startsWith("/strategy/new")); return <Link className={active ? "active" : ""} href={href} key={href}><Icon /><span>{label}</span></Link>; })}</nav><div className="sidebar-account"><span className="account-avatar">{initial}</span><div><strong>{user.name}</strong><small>{user.email}</small></div><SignOutButton redirectUrl="/"><button className="icon-button" aria-label="Sign out" title="Sign out"><LogOut /></button></SignOutButton></div></aside><main className="app-content">{children}</main></div>;
}
