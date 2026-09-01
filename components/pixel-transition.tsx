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

  // 6 transition bars on desktop, reduced to 3 or 4 wide bars on mobile
  const delays = [0.08, 0.32, 0.04, 0.24, 0.14, 0.38];
  const durations = [0.75, 1.20, 0.85, 1.25, 0.70, 1.05];

  return (
    <div 
      className="fixed inset-0 z-[999] pointer-events-none flex w-full h-full overflow-hidden"
      style={{ borderRadius: 0, border: "none" }}
    >
      {delays.map((delay, i) => (
        <div
          key={i}
          className={`h-full pixel-transition-bar ${i >= 3 ? "hidden sm:block" : ""}`}
          style={{
            flex: 1,
            borderRadius: 0,
            border: "none",
            '--delay': `${delay}s`,
            '--duration': `${durations[i]}s`,
            willChange: "transform",
            transformOrigin: "bottom"
          } as React.CSSProperties}
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
