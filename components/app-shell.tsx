"use client";

import { BarChart3, CreditCard, LogOut, Plus, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "./brand";
import { integrationsConfigured } from "./providers";

const links = [
  { href: "/dashboard", label: "Strategies", icon: BarChart3 },
  { href: "/strategy/new/one-off", label: "New strategy", icon: Plus },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/team", label: "Team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return <div className="app-frame"><aside className="app-sidebar"><Brand /><nav>{links.map(({ href, label, icon: Icon }) => <Link className={path.startsWith(href) ? "active" : ""} href={href} key={href}><Icon />{label}</Link>)}</nav><div className="sidebar-account"><span className="account-dot" /><div><strong>{integrationsConfigured ? "Signed-in account" : "Setup required"}</strong><small>{integrationsConfigured ? "Managed by Clerk" : "No mock identity"}</small></div>{integrationsConfigured && <Link href="/signout"><LogOut /></Link>}</div></aside><main className="app-content">{children}</main></div>;
}
