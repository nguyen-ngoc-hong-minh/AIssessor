"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { Sparkles, ShieldCheck, Cpu, Zap, ArrowUpRight, Activity } from "lucide-react";

export function ParallaxHero({ children }: { children: ReactNode }) {
  const heroRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = (x: number, y: number) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        hero.style.setProperty("--parallax-x", `${x}px`);
        hero.style.setProperty("--parallax-y", `${y}px`);
        hero.style.setProperty("--mouse-x", `${x / 20}`);
        hero.style.setProperty("--mouse-y", `${y / 20}`);
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = hero.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 30;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 20;
      setMousePos({ x, y });
      update(x, y);
    };

    const onPointerLeave = () => {
      setMousePos({ x: 0, y: 0 });
      update(0, 0);
    };

    const onScroll = () => {
      const bounds = hero.getBoundingClientRect();
      if (bounds.bottom > 0 && bounds.top < window.innerHeight) {
        update(mousePos.x, Math.max(-16, Math.min(16, bounds.top * -0.03)));
      }
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
  }, [mousePos.x]);

  return (
    <section className="spatial-hero section" ref={heroRef}>
      {/* Dynamic Animated Ambient Glow Background Spheres */}
      <div className="hero-ambient-canvas" aria-hidden="true">
        <div className="glow-sphere sphere-1" />
        <div className="glow-sphere sphere-2" />
        <div className="glow-sphere sphere-3" />
        <div className="gradient-mesh-overlay" />
      </div>

      {/* Hero Left Copy */}
      {children}

      {/* Hero Right Pure CSS Glassmorphism 3D Stage (No images used) */}
      <div className="spatial-hero-stage" aria-hidden="true">
        <div 
          className="stage-perspective-box"
          style={{
            transform: `perspective(1200px) rotateY(${mousePos.x * 0.4}deg) rotateX(${-mousePos.y * 0.4}deg)`
          }}
        >
          {/* Main Glass Center Card */}
          <div className="glass-hero-card main-card">
            <div className="card-top-bar">
              <span className="live-dot" />
              <span className="card-tag">BENCHFLOW AI STACK</span>
              <span className="card-status"><Activity className="w-3 h-3" /> Real-time Evaluated</span>
            </div>

            <div className="card-hero-content">
              <div className="stack-badge-icon">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <div className="stack-title">
                <h3>Optimal Stack Selected</h3>
                <p>Nhiệm vụ: Phát triển sản phẩm & Marketing Tự Động</p>
              </div>
            </div>

            <div className="stack-items-preview">
              <div className="stack-item-row">
                <span className="item-icon icon-ai"><Cpu className="w-3.5 h-3.5" /></span>
                <div className="item-info">
                  <strong>LLM Logic: Claude 3.5 Sonnet</strong>
                  <small>Độ phù hợp 98% · Viết code & phân tích dữ liệu chuyên sâu</small>
                </div>
                <span className="item-price">$20/tháng</span>
              </div>

              <div className="stack-item-row">
                <span className="item-icon icon-zap"><Zap className="w-3.5 h-3.5" /></span>
                <div className="item-info">
                  <strong>Tốc độ: DeepSeek R1 / Groq</strong>
                  <small>Độ trễ &lt;100ms · Xử lý tác vụ tức thì</small>
                </div>
                <span className="item-price">Tích hợp sẵn</span>
              </div>

              <div className="stack-item-row">
                <span className="item-icon icon-shield"><ShieldCheck className="w-3.5 h-3.5" /></span>
                <div className="item-info">
                  <strong>Bảo mật: Verified Privacy Gate</strong>
                  <small>Không dùng data người dùng để huấn luyện mô hình</small>
                </div>
                <span className="item-badge">Bảo đảm</span>
              </div>
            </div>

            <div className="card-bottom-summary">
              <div>
                <span>Tổng chi phí ước tính</span>
                <strong>$20<small>/tháng (Tiết kiệm 65% so với mua lẻ)</small></strong>
              </div>
              <div className="button-mini-action">
                <span>Chi tiết Stack</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Floating Orbiting Glass Badges */}
          <div className="floating-orbit-badge badge-top-right">
            <span className="glow-dot cyan" />
            <span>100% Khách quan</span>
          </div>

          <div className="floating-orbit-badge badge-bottom-left">
            <span className="glow-dot gold" />
            <span>Chi phí minh bạch</span>
          </div>
        </div>
      </div>
    </section>
  );
}
