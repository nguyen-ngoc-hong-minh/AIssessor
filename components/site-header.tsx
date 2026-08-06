"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Brand } from "./brand";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="header-inner"><Brand /><button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button><nav className={open ? "open" : ""}><Link href="/how-it-works">How it works</Link><Link href="/pricing">Pricing</Link><Link href="/sign-in">Sign in</Link><Link className="button button-primary button-small" href="/sign-up">Build My AI Strategy</Link></nav></div></header>;
}
