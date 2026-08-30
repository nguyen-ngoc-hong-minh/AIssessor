"use client";

import React, { useEffect, useState } from "react";

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPos({ x: targetX, y: targetY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.closest("button") ||
          target.closest("a") ||
          target.classList.contains("interactive-hover"))
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Smooth trailing lerp
    const loop = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      setTrailingPos({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* 1. Large Color-Changing Clipping Lens (Mix-Blend-Mode Inversion & Glow) */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-40 rounded-full transition-transform duration-150 ease-out hidden md:block"
        style={{
          width: isHovering ? "90px" : "54px",
          height: isHovering ? "90px" : "54px",
          transform: "translate3d(" + (trailingPos.x - (isHovering ? 45 : 27)) + "px, " + (trailingPos.y - (isHovering ? 45 : 27)) + "px, 0)",
          background: "radial-gradient(circle, rgba(195, 248, 74, 0.95) 0%, rgba(103, 186, 228, 0.8) 45%, rgba(16, 63, 213, 0.4) 80%, transparent 100%)",
          mixBlendMode: "difference",
          filter: "blur(1px)",
        }}
        aria-hidden="true"
      />

      {/* 2. Precision Center Dot */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-50 rounded-full transition-transform duration-75 ease-out hidden md:block"
        style={{
          width: isHovering ? "10px" : "6px",
          height: isHovering ? "10px" : "6px",
          transform: "translate3d(" + (pos.x - (isHovering ? 5 : 3)) + "px, " + (pos.y - (isHovering ? 5 : 3)) + "px, 0)",
          backgroundColor: "#C3F84A",
          boxShadow: "0 0 12px #C3F84A, 0 0 20px #67BAE4",
        }}
        aria-hidden="true"
      />
    </>
  );
}
