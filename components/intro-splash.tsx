"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";

interface IntroSplashProps {
  onComplete?: () => void;
}

export function IntroSplash({ onComplete }: IntroSplashProps) {
  const [stage, setStage] = useState<"animating" | "swiping" | "done">("animating");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 1. Progress increment over 4.4 seconds
    const interval = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(100, prev + 2.5);
      });
    }, 100);

    // 2. Trigger swipe-up at 4.6 seconds
    const swipeTimer = window.setTimeout(() => {
      setStage("swiping");
    }, 4600);

    // 3. Mark as done and unmount after swipe completes (5.3s)
    const finishTimer = window.setTimeout(() => {
      setStage("done");
      if (onComplete) onComplete();
    }, 5400);

    return () => {
      clearInterval(interval);
      clearTimeout(swipeTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setStage("swiping");
    window.setTimeout(() => {
      setStage("done");
      if (onComplete) onComplete();
    }, 750);
  };

  if (stage === "done") return null;

  return (
    <aside
      className={"fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#071A57] text-white select-none overflow-hidden transition-all duration-[850ms] ease-[cubic-bezier(0.77,0,0.175,1)] " + (
        stage === "swiping" ? "-translate-y-full opacity-90 pointer-events-none" : "translate-y-0 opacity-100"
      )}
      onClick={handleSkip}
    >
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(16, 63, 213, 0.45) 0%, rgba(103, 186, 228, 0.15) 35%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(103,186,228,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(103,186,228,0.06)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      {/* Main Animated Logo Assembly */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Animated AI Beacon Icon */}
        <div className="relative mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#103FD5] to-[#67BAE4] p-[2px] shadow-[0_0_50px_rgba(16,63,213,0.8)] animate-pulse">
            <div className="w-full h-full bg-[#071A57] rounded-[14px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(103,186,228,0.35)_0%,transparent_70%)] animate-spin-slow" />
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-[#67BAE4] relative z-10 animate-bounce-subtle" />
            </div>
          </div>

          {/* Glowing Ripple Rings */}
          <div className="absolute -inset-3 rounded-3xl border border-[#67BAE4]/30 animate-ping opacity-40 pointer-events-none" />
          <div className="absolute -inset-6 rounded-full border border-[#103FD5]/20 animate-pulse pointer-events-none" />
        </div>

        {/* Brand Name Kinetic Typing / Shimmer */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-sans tracking-tight text-white flex items-center gap-1 mb-3">
          <span className="bg-gradient-to-r from-white via-[#67BAE4] to-white bg-clip-text text-transparent animate-shimmer">
            Aissessor
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm font-mono tracking-[0.25em] text-[#67BAE4] uppercase font-semibold flex items-center gap-2 mb-8 opacity-90">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C3F84A] animate-ping" />
          YOUR AI STACK ADVISOR
        </p>

        {/* Minimal Progress Bar */}
        <div className="w-48 sm:w-64 h-[3px] bg-white/10 rounded-full overflow-hidden relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#103FD5] via-[#67BAE4] to-[#C3F84A] transition-all duration-150 ease-out rounded-full"
            style={{ width: progress + "%" }}
          />
        </div>
        <span className="font-mono text-[10px] text-white/50 mt-2 tracking-widest">
          INITIALISING AI INTELLIGENCE {Math.round(progress)}%
        </span>
      </div>

      {/* Skip Button */}
      <button
        type="button"
        className="absolute bottom-8 right-8 z-20 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          handleSkip();
        }}
      >
        <span>Skip intro</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
}
