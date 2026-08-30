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

  // 24 thinner bars look more detailed and cinematic
  const bars = Array.from({ length: 24 });

  // A visually appealing, hardcoded pseudo-random delay pattern (avoids SSR hydration glitch)
  // These values range from 0.0 to 0.5 seconds
  const delays = [
    0.12, 0.45, 0.03, 0.38, 0.22, 0.15, 0.49, 0.08, 
    0.31, 0.19, 0.42, 0.05, 0.27, 0.35, 0.11, 0.48, 
    0.24, 0.02, 0.39, 0.17, 0.44, 0.09, 0.29, 0.36
  ];

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none flex w-full h-full overflow-hidden">
      {bars.map((_, i) => (
        <div
          key={i}
          className="h-full bg-[#1A24A9]"
          style={{
            flex: 1,
            // 0.8s duration, extremely smooth ease-in-out bezier
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
