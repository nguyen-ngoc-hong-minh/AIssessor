"use client";

import { type ReactNode, useEffect, useRef } from "react";

export function ParallaxHero({ children }: { children: ReactNode }) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = (x: number, y: number) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        hero.style.setProperty("--parallax-x", `${x}px`);
        hero.style.setProperty("--parallax-y", `${y}px`);
      });
    };
    const onPointerMove = (event: PointerEvent) => {
      const bounds = hero.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * -14;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -10;
      update(x, y);
    };
    const onPointerLeave = () => update(0, 0);
    const onScroll = () => {
      const bounds = hero.getBoundingClientRect();
      if (bounds.bottom > 0 && bounds.top < window.innerHeight) update(0, Math.max(-12, Math.min(12, bounds.top * -0.025)));
    };

    hero.addEventListener("pointermove", onPointerMove);
    hero.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <section className="spatial-hero section" ref={heroRef}>
    <div className="spatial-hero-art" aria-hidden="true">
      {/* Static public asset avoids runtime image-proxy failures in the deployed worker. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/benchflow-hero-3d.png" alt="" fetchPriority="high" />
    </div>
    {children}
  </section>;
}
