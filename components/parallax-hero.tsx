"use client";

import { type ReactNode } from "react";
import { ArrowRight, Cpu, Layers, ShieldCheck, Zap } from "lucide-react";

export function ParallaxHero({ children }: { children: ReactNode }) {
  return (
    <section className="minimal-hero section">
      {/* Hero Text Content */}
      {children}

      {/* Ultra-minimal vector workflow node diagram (Inspired by Reference 1 PlayerZero) */}
      <div className="hero-diagram-container" aria-label="System Architecture Flow">
        <div className="diagram-grid-bg" />
        
        <div className="diagram-node-flow">
          <div className="diagram-node">
            <span className="node-tag">[ Input ]</span>
            <strong>Task Prompt</strong>
            <small>Mô tả công việc</small>
          </div>

          <div className="diagram-connector-line">
            <span className="connector-dot" />
            <span className="line-path" />
          </div>

          <div className="diagram-center-card">
            <div className="center-icon-badge">
              <Layers className="w-6 h-6 text-black" />
            </div>
            <strong>BENCHFLOW ENGINE</strong>
            <span className="bracket-label">[ Automated Evaluation ]</span>
          </div>

          <div className="diagram-connector-line">
            <span className="line-path" />
            <span className="connector-dot" />
          </div>

          <div className="diagram-node">
            <span className="node-tag">[ Output ]</span>
            <strong>AI Stack Plan</strong>
            <small>Công cụ &amp; Chi phí</small>
          </div>
        </div>

        {/* Minimal Metric Tiles below diagram */}
        <div className="hero-stats-row">
          <div className="stat-tile">
            <Cpu className="w-4 h-4 text-black" />
            <div>
              <strong>1,200+</strong>
              <small>Mô hình AI kiểm định</small>
            </div>
          </div>

          <div className="stat-tile">
            <Zap className="w-4 h-4 text-black" />
            <div>
              <strong>&lt; 3 giây</strong>
              <small>Thời gian tổng hợp stack</small>
            </div>
          </div>

          <div className="stat-tile">
            <ShieldCheck className="w-4 h-4 text-black" />
            <div>
              <strong>100%</strong>
              <small>Minh bạch nguồn &amp; chi phí</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
