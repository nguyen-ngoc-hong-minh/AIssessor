"use client";

import { SignOutButton } from "@clerk/react";
import { BarChart3, CreditCard, Database, LogOut, Plus, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "./brand";

const links = [
  { href: "/dashboard", label: "Strategies", icon: BarChart3 },
  { href: "/strategy/new/one-off", label: "New strategy", icon: Plus },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/team", label: "Team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children, user, isAdmin = false }: { children: React.ReactNode; user: { name: string; email: string }; isAdmin?: boolean }) {
  const path = usePathname();
  const visibleLinks = isAdmin ? [...links, { href: "/admin/evidence", label: "Evidence", icon: Database }] : links;
  return <div className="app-frame"><aside className="app-sidebar"><Brand /><nav>{visibleLinks.map(({ href, label, icon: Icon }) => <Link className={path.startsWith(href) ? "active" : ""} href={href} key={href}><Icon />{label}</Link>)}</nav><div className="sidebar-account"><span className="account-dot" /><div><strong>{user.name}</strong><small>{user.email}</small></div><SignOutButton redirectUrl="/"><button className="icon-button" aria-label="Sign out" title="Sign out"><LogOut /></button></SignOutButton></div></aside><main className="app-content">{children}</main></div>;
}
