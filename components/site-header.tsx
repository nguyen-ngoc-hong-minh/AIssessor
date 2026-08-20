"use client";

import { Show, UserButton } from "@clerk/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Brand } from "./brand";
import { authConfigured } from "./providers";

function AuthActions() {
  if (!authConfigured) {
    return (
      <>
        <Link href="/sign-in" className="nav-link-subtle">Log in</Link>
        <Link className="minimal-btn minimal-btn-dark" href="/sign-up">
          <span>Get Started</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </>
    );
  }

  return (
    <>
      <Show when="signed-out">
        <Link href="/sign-in" className="nav-link-subtle">Log in</Link>
        <Link className="minimal-btn minimal-btn-dark" href="/sign-up">
          <span>Get Started</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </Show>
      <Show when="signed-in">
        <Link href="/dashboard" className="nav-link-subtle">Dashboard</Link>
        <UserButton userProfileMode="navigation" userProfileUrl="/settings" />
      </Show>
    </>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        
        <nav className={`header-nav ${open ? "open" : ""}`}>
          <Link href="#overview">Overview</Link>
          <Link href="#process">Process</Link>
          <Link href="#criteria">Criteria</Link>
          <Link href="#pricing">Pricing</Link>
          <AuthActions />
        </nav>

        <button
          className="mobile-menu-btn"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
