"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

export function DashboardDeckNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const sections = [
    { label: "Strategies Overview", sub: "Command center & active plans", href: "/dashboard" },
    { label: "New Strategy Builder", sub: "Plan project or monthly workflow", href: "/choose-usage" },
    { label: "Billing & Subscriptions", sub: "Consolidated software stack & invoices", href: "/billing" },
    { label: "Account Settings", sub: "Preferences & security", href: "/settings" },
  ];

  // Determine current index based on pathname
  let currentIdx = 0;
  if (pathname.startsWith("/choose-usage") || pathname.startsWith("/strategy/new")) currentIdx = 1;
  else if (pathname.startsWith("/billing")) currentIdx = 2;
  else if (pathname.startsWith("/settings")) currentIdx = 3;

  const totalSections = sections.length;

  const go = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= totalSections) return;
      setMenuOpen(false);
      router.push(sections[idx].href);
    },
    [router, totalSections]
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        return;
      }
      if (menuOpen) return;
      if (e.key === "ArrowRight" && currentIdx < totalSections - 1) go(currentIdx + 1);
      if (e.key === "ArrowLeft" && currentIdx > 0) go(currentIdx - 1);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIdx, menuOpen, go, totalSections]);

  return (
    <>
      {/* Floating Toggle Controls Bar */}
      <div className="nav">
        <button
          onClick={() => go(currentIdx - 1)}
          disabled={currentIdx === 0}
          aria-label="Previous dashboard section"
        >
          &larr;
        </button>
        <button
          className={`menu-btn ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open section menu"
        >
          <span className="icon">
            <i />
            <i />
            <i />
          </span>
        </button>
        <div className="counter">
          <span>{String(currentIdx + 1).padStart(2, "0")}</span> / <span>{String(totalSections).padStart(2, "0")}</span>
        </div>
        <button
          onClick={() => go(currentIdx + 1)}
          disabled={currentIdx === totalSections - 1}
          aria-label="Next dashboard section"
        >
          &rarr;
        </button>
      </div>

      {/* Jump to Section Popup Menu Modal */}
      <div className={`menu-overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />
      <div className={`menu-panel ${menuOpen ? "open" : ""}`} role="dialog" aria-label="Dashboard section navigation">
        <div className="menu-header">
          <h3>Jump to section</h3>
          <div className="menu-meta">
            <span>{String(currentIdx + 1).padStart(2, "0")}</span> / <span>{String(totalSections).padStart(2, "0")}</span>
          </div>
        </div>
        <div className="menu-list">
          {sections.map((sec, i) => (
            <div
              key={sec.label}
              className={`menu-item ${i === currentIdx ? "current" : ""}`}
              onClick={() => go(i)}
            >
              <span className="mi-num">{String(i + 1).padStart(2, "0")}</span>
              <div style={{ flex: 1 }}>
                <div className="mi-label">{sec.label}</div>
                <div className="mi-sub">{sec.sub}</div>
              </div>
              <span className="mi-arr">&rarr;</span>
            </div>
          ))}
        </div>
        <div className="menu-footer">
          <span>Press <kbd>&larr;</kbd> <kbd>&rarr;</kbd> to navigate</span>
        </div>
      </div>
    </>
  );
}
