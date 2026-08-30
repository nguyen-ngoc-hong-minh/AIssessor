"use client";
import React, { useEffect, useState } from "react";

export function PixelTransition() {
  const [active, setActive] = useState(true);
  
  useEffect(() => {
    // Increase timeout slightly to guarantee animations finish without unmount popping
    const t = setTimeout(() => setActive(false), 1800);
    return () => clearTimeout(t);
  }, []);

  if (!active) return null;

  // Create 10 vertical bars that slide up to reveal the content
  const bars = Array.from({ length: 12 });

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none flex w-full h-full overflow-hidden">
      {bars.map((_, i) => (
        <div
          key={i}
          className="h-full bg-[#1A24A9] flex-1"
          style={{
            animation: `pixelSlideUp 1s cubic-bezier(0.76, 0, 0.24, 1) forwards`,
            animationDelay: `${Math.random() * 0.4}s`,
            willChange: "transform"
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
