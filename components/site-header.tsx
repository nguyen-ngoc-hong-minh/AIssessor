"use client";

import { Show, UserButton } from "@clerk/react";
import { Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Brand } from "./brand";
import { authConfigured } from "./providers";

function AuthActions() {
  if (!authConfigured) {
    return (
      <>
        <Link href="/sign-in" className="nav-link-subtle">Log In</Link>
        <Link className="minimal-btn minimal-btn-dark" href="/sign-up">
          <span>Request Access</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </>
    );
  }

  return (
    <>
      <Show when="signed-out">
        <Link href="/sign-in" className="nav-link-subtle">Log In</Link>
        <Link className="minimal-btn minimal-btn-dark" href="/sign-up">
          <span>Request Access</span>
          <ArrowRight className="w-3.5 h-3.5" />
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
          <Link href="#how-it-works">Process</Link>
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
