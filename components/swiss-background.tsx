"use client";
import React, { useEffect, useRef, useState } from "react";

export function SwissBackground() {
  const [mouse, setMouse] = useState({ x: -100, y: -100 });
  
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // We render a CSS-based interactive grid that masks over a solid blue background
  return (
    <div className="fixed inset-0 z-[-1] bg-[#103FD5] overflow-hidden pointer-events-none">
      {/* Static blueprint grid */}
      <div 
        className="absolute inset-0 opacity-[0.15]" 
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: "32px 32px"
        }} 
      />
      {/* Interactive cursor mask */}
      <div 
        className="absolute inset-0 opacity-40 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${mouse.x}px ${mouse.y}px, rgba(195, 248, 74, 0.15), transparent 40%)`
        }}
      />
      {/* Geometric pixel stair block */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-20"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.4) 25%, transparent 25%) -32px 0, linear-gradient(225deg, rgba(255,255,255,0.4) 25%, transparent 25%) -32px 0, linear-gradient(315deg, rgba(255,255,255,0.4) 25%, transparent 25%), linear-gradient(45deg, rgba(255,255,255,0.4) 25%, transparent 25%)`,
          backgroundSize: "64px 64px"
        }}
      />
    </div>
  );
}
