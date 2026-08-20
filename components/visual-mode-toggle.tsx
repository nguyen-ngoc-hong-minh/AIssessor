"use client";

import { Moon, Sparkles, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const themeKey = "benchflow-theme-mode";
const surfaceKey = "benchflow-surface-mode";

export function VisualModeToggle() {
  const [theme, setTheme] = useState<"bloom" | "thala">("bloom");
  const [glass, setGlass] = useState(true);

  useEffect(() => {
    const savedTheme = (window.localStorage.getItem(themeKey) as "bloom" | "thala") || "bloom";
    const savedSurface = window.localStorage.getItem(surfaceKey) !== "solid";
    
    setTheme(savedTheme);
    setGlass(savedSurface);
    
    document.documentElement.dataset.theme = savedTheme;
    document.documentElement.dataset.surface = savedSurface ? "glass" : "solid";
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "bloom" ? "thala" : "bloom";
    setTheme(nextTheme);
    window.localStorage.setItem(themeKey, nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  };

  const toggleGlass = () => {
    const nextGlass = !glass;
    setGlass(nextGlass);
    window.localStorage.setItem(surfaceKey, nextGlass ? "glass" : "solid");
    document.documentElement.dataset.surface = nextGlass ? "glass" : "solid";
  };

  return (
    <div className="theme-toggle-group" aria-label="Appearance controls">
      <button
        type="button"
        className={`theme-toggle-pill ${theme === "thala" ? "is-thala" : "is-bloom"}`}
        onClick={toggleTheme}
        title={theme === "bloom" ? "Chuyển sang Thala Dark Mode (🌌)" : "Chuyển sang BloomFi Light Mode (🌸)"}
      >
        <span className="pill-icon">{theme === "bloom" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}</span>
        <span className="pill-text">{theme === "bloom" ? "BloomFi Light" : "Thala Dark"}</span>
      </button>

      <button
        type="button"
        className={`glass-toggle-pill ${glass ? "active" : ""}`}
        onClick={toggleGlass}
        title={glass ? "Glassmorphism đang bật" : "Bật hiệu ứng Glassmorphism"}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Glass</span>
      </button>
    </div>
  );
}
