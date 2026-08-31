"use client";
import React, { useEffect, useState } from "react";

export function PixelTransition() {
  const [active, setActive] = useState(true);
  
  useEffect(() => {
    // 1.8s timeout allows the 1.2s max animation to fully complete and rest before unmounting
    const t = setTimeout(() => setActive(false), 1800);
    return () => clearTimeout(t);
  }, []);

  if (!active) return null;

  // Reverted to 12 big bars as requested, keeping the smooth hardware acceleration
  const bars = Array.from({ length: 12 });

  // Deterministic delay pattern for 12 bars (0.0s to 0.4s) to avoid hydration glitch
  const delays = [
    0.15, 0.38, 0.05, 0.22, 
    0.41, 0.12, 0.32, 0.02, 
    0.28, 0.45, 0.18, 0.09
  ];

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none flex w-full h-full overflow-hidden">
      {bars.map((_, i) => (
        <div
          key={i}
          className="h-full bg-[#0213B0] pixel-transition-bar"
          style={{
            flex: 1,
            animation: `pixelSlideUp 0.85s cubic-bezier(0.85, 0, 0.15, 1) forwards`,
            animationDelay: `${delays[i]}s`,
            willChange: "transform",
            transformOrigin: "bottom"
          }}
        />
      ))}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pixelSlideUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-101%); }
        }
      `}} />
    </div>
  );
}
