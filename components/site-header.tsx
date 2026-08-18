"use client";

import { Show, UserButton } from "@clerk/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Brand } from "./brand";
import { authConfigured } from "./providers";

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
  return <header className="site-header"><div className="header-inner"><Brand /><button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button><nav className={open ? "open" : ""}><Link href="/how-it-works">How it works</Link><Link href="/pricing">Pricing</Link><AuthActions /></nav></div></header>;
}
