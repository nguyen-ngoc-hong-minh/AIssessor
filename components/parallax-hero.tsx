"use client";

import { type ReactNode } from "react";
import { ArrowUpRight, Cpu, Layers, ShieldCheck, Zap } from "lucide-react";

export function ParallaxHero({ children }: { children: ReactNode }) {
  return (
    <section className="editorial-hero section">
      {/* Hero Content */}
      {children}

      {/* Wallety System Flow Stage */}
      <div className="hero-system-flow" aria-label="System Architecture Flow">
        <div className="system-flow-top">
          <div className="flow-badge">✦ ARCHITECTURE</div>
          <div className="flow-status">
            <span className="dot-active" />
            <span>REAL-TIME BENCHMARKS</span>
          </div>
        </div>

        <div className="system-diagram-grid">
          <div className="diagram-card">
            <span className="card-mono-lbl">[ 01. INPUT ]</span>
            <strong>Task Definition</strong>
            <p>Project goals &amp; requirements</p>
          </div>

          <div className="diagram-arrow-connector">
            <span className="line-connector" />
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="diagram-card border-emerald-500/40 bg-emerald-950/20">
            <span className="card-mono-lbl text-emerald-400">[ 02. ENGINE ]</span>
            <strong className="text-emerald-300">BENCHFLOW ENGINE</strong>
            <p>Evaluation &amp; Cost Optimization</p>
          </div>

          <div className="diagram-arrow-connector">
            <span className="line-connector" />
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="diagram-card">
            <span className="card-mono-lbl">[ 03. OUTPUT ]</span>
            <strong>Optimal Stack</strong>
            <p>Products, Plans &amp; Subscriptions</p>
          </div>
        </div>

        {/* Metric Bar */}
        <div className="hero-metrics-bar">
          <div className="hero-metric-item">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <div>
              <strong>1,200+</strong>
              <small>Evaluated AI Models</small>
            </div>
          </div>

          <div className="hero-metric-item">
            <Zap className="w-5 h-5 text-cyan-400" />
            <div>
              <strong>&lt; 3 Secs</strong>
              <small>Plan Generation</small>
            </div>
          </div>

          <div className="hero-metric-item">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
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
