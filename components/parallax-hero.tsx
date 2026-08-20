"use client";

import { type ReactNode } from "react";
import { ArrowUpRight, Cpu, Layers, ShieldCheck, Zap, Sparkles } from "lucide-react";

export function ParallaxHero({ children }: { children: ReactNode }) {
  return (
    <section className="editorial-hero section">
      {/* Hero Dominant Statement */}
      {children}

      {/* Section 10 — Hero Architectural Product Preview */}
      <div className="hero-system-flow" aria-label="BENCHFLOW Architecture Preview">
        <div className="system-flow-top">
          <div className="flow-badge">PROJECT EVALUATION FLOW</div>
          <div className="flow-status">
            <span className="dot-active" />
            <span>REAL-TIME BENCHMARKS</span>
          </div>
        </div>

        {/* Workflow Nodes */}
        <div className="system-diagram-grid">
          <div className="diagram-card">
            <span className="card-mono-lbl">STEP 01 / RESEARCH</span>
            <strong>Perplexity Pro</strong>
            <p>Market &amp; Competitor Analysis</p>
          </div>

          <div className="diagram-arrow-connector">
            <span className="line-connector" />
            <ArrowUpRight className="w-4 h-4 text-secondary" />
          </div>

          <div className="diagram-card">
            <span className="card-mono-lbl">STEP 02 / STRATEGY</span>
            <strong>Claude Pro</strong>
            <p>Brand Positioning &amp; Briefs</p>
          </div>

          <div className="diagram-arrow-connector">
            <span className="line-connector" />
            <ArrowUpRight className="w-4 h-4 text-secondary" />
          </div>

          <div className="diagram-card">
            <span className="card-mono-lbl">STEP 03 / VISUALS</span>
            <strong>Midjourney v6</strong>
            <p>Product &amp; Campaign Imagery</p>
          </div>

          <div className="diagram-arrow-connector">
            <span className="line-connector" />
            <ArrowUpRight className="w-4 h-4 text-secondary" />
          </div>

          <div className="diagram-card">
            <span className="card-mono-lbl">STEP 04 / WEBSITE</span>
            <strong>Lovable Pro</strong>
            <p>Web Application Generation</p>
          </div>
        </div>

        {/* Section 10 — Converged Stack Highlight */}
        <div className="hero-stack-highlight-bar">
          <div className="highlight-title">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>OPTIMIZED STACK: <strong>3 Subscriptions &bull; $55 / Month</strong></span>
          </div>

          <div className="highlight-savings">
            <span className="text-secondary text-xs uppercase font-mono tracking-wider">ESTIMATED SAVINGS</span>
            <span className="savings-huge">SAVE $39 / MO</span>
          </div>
        </div>

        {/* Metric Bar */}
        <div className="hero-metrics-bar">
          <div className="hero-metric-item">
            <Cpu className="w-4 h-4 text-blue-400" />
            <div>
              <strong>1,200+</strong>
              <small>Evaluated AI Models</small>
            </div>
          </div>

          <div className="hero-metric-item">
            <Zap className="w-4 h-4 text-blue-400" />
            <div>
              <strong>&lt; 3 Secs</strong>
              <small>Pipeline Synthesis</small>
            </div>
          </div>

          <div className="hero-metric-item">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <div>
              <strong>100%</strong>
              <small>Verified Primary Sources</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
