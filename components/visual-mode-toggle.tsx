"use client";

import { Layers3 } from "lucide-react";
import { useEffect, useState } from "react";

const storageKey = "benchflow-surface-mode";

export function VisualModeToggle() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey) === "solid";
    document.documentElement.dataset.surface = stored ? "solid" : "glass";
    const frame = window.requestAnimationFrame(() => setSolid(stored));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggle = () => {
    const next = !solid;
    setSolid(next);
    window.localStorage.setItem(storageKey, next ? "solid" : "glass");
    document.documentElement.dataset.surface = next ? "solid" : "glass";
  };

  return <button
    type="button"
    className="visual-mode-toggle"
    aria-label={solid ? "Use glass surfaces" : "Use solid surfaces"}
    aria-pressed={!solid}
    title={solid ? "Use glass surfaces" : "Use solid surfaces"}
    onClick={toggle}
  >
    <Layers3 />
    <span aria-hidden="true" />
  </button>;
}
