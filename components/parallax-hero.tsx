"use client";

import { type ReactNode } from "react";
import { ArrowUpRight, Cpu, Layers, ShieldCheck, Zap } from "lucide-react";

export function ParallaxHero({ children }: { children: ReactNode }) {
  return (
    <section className="editorial-hero section">
      {/* Hero Content */}
      {children}

      {/* Editorial System Flow Box (Inspired by Reference 3 & 4) */}
      <div className="hero-system-flow" aria-label="System Architecture Flow">
        <div className="system-flow-top">
          <div className="flow-badge">[ ARCHITECTURE ]</div>
          <div className="flow-status">
            <span className="dot-active" />
            <span>REAL-TIME BENCHMARKS</span>
          </div>
        </div>

        <div className="system-diagram-grid">
          <div className="diagram-card input-card">
            <span className="card-mono-lbl">[ 01. INPUT ]</span>
            <strong>Task Definition</strong>
            <p>Project goals &amp; requirements</p>
          </div>

          <div className="diagram-arrow-connector">
            <span className="line-connector" />
            <ArrowUpRight className="w-4 h-4 text-black" />
          </div>

          <div className="diagram-card engine-card">
            <div className="engine-icon-wrap">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <strong>BENCHFLOW ENGINE</strong>
            <p>Evaluation &amp; Cost Optimization</p>
          </div>

          <div className="diagram-arrow-connector">
            <span className="line-connector" />
            <ArrowUpRight className="w-4 h-4 text-black" />
          </div>

          <div className="diagram-card output-card">
            <span className="card-mono-lbl">[ 02. OUTPUT ]</span>
            <strong>Optimal Stack</strong>
            <p>Products, Plans &amp; Subscriptions</p>
          </div>
        </div>

        {/* Metric Bar */}
        <div className="hero-metrics-bar">
          <div className="hero-metric-item">
            <Cpu className="w-4 h-4 text-black" />
            <div>
              <strong>1,200+</strong>
              <small>Evaluated AI Models</small>
            </div>
          </div>

          <div className="hero-metric-item">
            <Zap className="w-4 h-4 text-black" />
            <div>
              <strong>&lt; 3 Secs</strong>
              <small>Plan Generation</small>
            </div>
          </div>

          <div className="hero-metric-item">
            <ShieldCheck className="w-4 h-4 text-black" />
            <div>
              <strong>100%</strong>
              <small>Verified Privacy &amp; Data</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
