"use client";
import React, { useEffect, useState } from "react";

export function PixelTransition() {
  const [active, setActive] = useState(true);
  
  useEffect(() => {
    // Keep it active for 1.2s to cover the reveal animation
    const t = setTimeout(() => setActive(false), 1200);
    return () => clearTimeout(t);
  }, []);

  if (!active) return null;

  // Create 10 vertical bars that slide up to reveal the content
  const bars = Array.from({ length: 12 });

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none flex w-full h-full">
      {bars.map((_, i) => (
        <div
          key={i}
          className="h-full bg-[#103FD5] flex-1"
          style={{
            animation: `pixelSlideUp 0.8s cubic-bezier(0.7, 0, 0.3, 1) forwards`,
            animationDelay: `${Math.random() * 0.4}s`, // Randomize the delay for the "mixed up" feel
            transformOrigin: "top"
          }}
        />
      ))}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pixelSlideUp {
          0% { transform: scaleY(1); }
          100% { transform: scaleY(0); }
        }
      `}} />
    </div>
  );
}
