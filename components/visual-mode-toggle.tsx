"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function VisualModeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const activeTheme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : systemTheme;

    const frame = window.requestAnimationFrame(() => {
      setTheme(activeTheme);
      document.documentElement.setAttribute("data-theme", activeTheme);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  return (
    <button
      type="button"
      className="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="w-[18px] h-[18px] text-amber-400" />
      ) : (
        <Moon className="w-[18px] h-[18px] text-indigo-600" />
      )}
    </button>
  );
}
