"use client";

import React, { useEffect, useState } from "react";

const WORDS = ["Analyse.", "Benchmark.", "Standardise.", "Aissessor."];
const LETTERS = ["A", "i", "s", "s", "e", "s", "s", "o", "r"];

interface IntroSplashProps {
  onComplete?: () => void;
}

export function IntroSplash({ onComplete }: IntroSplashProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [stage, setStage] = useState<"animating" | "swiping" | "done">("animating");

  useEffect(() => {
    // Cycle through rotating words
    const t1 = setTimeout(() => setWordIndex(1), 900);
    const t2 = setTimeout(() => setWordIndex(2), 1800);
    const t3 = setTimeout(() => setWordIndex(3), 2700);

    // Swipe up after final word (Aissessor) has rotated in
    const swipeTimer = setTimeout(() => {
      setStage("swiping");
    }, 4200);

    const doneTimer = setTimeout(() => {
      setStage("done");
      if (onComplete) onComplete();
    }, 4900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(swipeTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setStage("swiping");
    setTimeout(() => {
      setStage("done");
      if (onComplete) onComplete();
    }, 600);
  };

  if (stage === "done") return null;

  return (
    <aside
      className={"fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#071A57] text-white select-none overflow-hidden transition-all duration-[750ms] ease-[cubic-bezier(0.77,0,0.175,1)] cursor-pointer " + (
        stage === "swiping" ? "-translate-y-full opacity-90 pointer-events-none" : "translate-y-0 opacity-100"
      )}
      onClick={handleSkip}
    >
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(16, 63, 213, 0.4) 0%, rgba(103, 186, 228, 0.1) 40%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Main Rotating Words Display */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 perspective-[1000px]">
        <div className="h-28 sm:h-36 flex items-center justify-center">
          {wordIndex < 3 ? (
            <div
              key={wordIndex}
              className="text-4xl sm:text-7xl font-bold font-sans tracking-tight text-white/90 animate-flip-word"
            >
              <span className="text-[#67BAE4]">{WORDS[wordIndex]}</span>
            </div>
          ) : (
            /* Final Logo: Letter-by-letter 3D Rotation */
            <div className="flex items-center gap-1 sm:gap-2">
              {LETTERS.map((letter, i) => (
                <span
                  key={i}
                  className="inline-block text-5xl sm:text-8xl font-extrabold font-sans tracking-tight text-white animate-letter-rotate"
                  style={{
                    animationDelay: (i * 0.07) + "s",
                    color: i === 0 ? "#67BAE4" : "#FFFFFF",
                  }}
                >
                  {letter}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Minimal Subtitle */}
        <p className="text-xs sm:text-sm font-mono tracking-[0.25em] text-[#67BAE4]/80 uppercase font-semibold mt-4 transition-opacity duration-500">
          YOUR AI STACK ADVISOR
        </p>

        {/* Tap to skip hint */}
        <span className="font-mono text-[11px] text-white/40 mt-8 tracking-wider">
          Click anywhere to skip →
        </span>
      </div>
    </aside>
  );
}
