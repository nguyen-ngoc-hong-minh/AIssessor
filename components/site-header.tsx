"use client";

import { Show, UserButton } from "@clerk/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Brand } from "./brand";
import { authConfigured } from "./providers";
import { VisualModeToggle } from "./visual-mode-toggle";

function AuthActions() {
  if (!authConfigured) {
    return <><Link href="/sign-in">Sign in</Link><Link className="button button-primary button-small" href="/sign-up">Build My AI Strategy</Link></>;
  }

  return <>
    <Show when="signed-out">
      <Link href="/sign-in">Sign in</Link>
      <Link className="button button-primary button-small" href="/sign-up">Build My AI Strategy</Link>
    </Show>
    <Show when="signed-in">
      <Link href="/dashboard">Dashboard</Link>
      <UserButton />
    </Show>
  </>;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="header-inner"><Brand /><div className="header-controls"><nav className={open ? "open" : ""}><Link href="/how-it-works">How it works</Link><Link href="/pricing">Pricing</Link><AuthActions /></nav><VisualModeToggle /><button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>{open ? <X /> : <Menu />}</button></div></div></header>;
}
