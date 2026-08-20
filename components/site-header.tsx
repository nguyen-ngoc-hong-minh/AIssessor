"use client";

import { Show, UserButton } from "@clerk/react";
import { Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Brand } from "./brand";
import { authConfigured } from "./providers";
import { VisualModeToggle } from "./visual-mode-toggle";

function AuthActions() {
  if (!authConfigured) {
    return (
      <>
        <Link href="/sign-in" className="nav-link-sign-in">Đăng nhập</Link>
        <Link className="button button-primary button-pill button-small" href="/sign-up">
          <span>Tạo AI Strategy</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </>
    );
  }

  return (
    <>
      <Show when="signed-out">
        <Link href="/sign-in" className="nav-link-sign-in">Đăng nhập</Link>
        <Link className="button button-primary button-pill button-small" href="/sign-up">
          <span>Tạo AI Strategy</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </Show>
      <Show when="signed-in">
        <Link href="/dashboard" className="nav-link-dashboard">Bảng điều khiển</Link>
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
        
        <div className="header-controls">
          <nav className={open ? "open" : ""}>
            <Link href="#how-it-works">Cách hoạt động</Link>
            <Link href="#use-cases">Ứng dụng</Link>
            <Link href="/pricing">Bảng giá</Link>
            <AuthActions />
          </nav>
          <VisualModeToggle />
          <button
            className="mobile-menu"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
