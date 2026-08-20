import type { Metadata } from "next";
import { ArrowUpRight, CalendarCheck2, Presentation, RefreshCw, Sparkles, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Switch Mode & New Strategy · BENCHFLOW" };

export default function ChooseUsagePage() {
  return (
    <div className="editorial-page-container max-w-5xl space-y-10">
      {/* Header Block */}
      <div className="editorial-page-header text-center max-w-3xl mx-auto">
        <div className="eyebrow mx-auto mb-3">
          <span className="dt" />
          NAVIGATION PORTAL &bull; MODE SWITCHER
        </div>
        <h1 className="h-display text-4xl md:text-5xl font-semibold text-white">
          Where do you want to <span className="grd">go</span>?
        </h1>
        <p className="body-lg mt-3 text-ink-2">
          Switch between the interactive 9-slide Presentation Deck and the Command Center Dashboard planning workflows.
        </p>
      </div>

      {/* Mode Switcher Pill Banner */}
      <div className="p-4 rounded-2xl glass-card flex items-center justify-between gap-4 max-w-2xl mx-auto border border-white/10">
        <Link href="/" className="btn-secondary text-xs px-5 py-2.5 flex-1 justify-center">
          <Presentation className="w-4 h-4 text-indigo-400 mr-1" />
          <span>Presentation Deck (Slideshow)</span>
        </Link>
        
        <Link href="/dashboard" className="btn-primary text-xs px-5 py-2.5 flex-1 justify-center">
          <LayoutDashboard className="w-4 h-4 text-black mr-1" />
          <span>Dashboard Command Center</span>
        </Link>
      </div>

      {/* 3-Column Choice Cards - Lustro Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Card 1: Presentation Slideshow */}
        <Link href="/" className="problem-card glass-card flex flex-col justify-between p-8 min-h-[300px] group">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-xs text-indigo-soft">01. DECK</span>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 grid place-items-center">
                <Presentation className="w-6 h-6" />
              </div>
            </div>
            
            <h2 className="h-display text-xl font-medium text-white group-hover:text-indigo-300 transition-colors">
              Presentation Slideshow
            </h2>
            <p className="body-md mt-2 text-xs text-ink-2">
              Explore the 9-slide interactive product presentation, architecture flow, and benchmark comparison deck.
            </p>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-6 font-body text-xs font-medium text-indigo-300">
            <span>Open Slideshow</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 2: One-off Project Strategy */}
        <Link href="/strategy/new/one-off" className="problem-card glass-card flex flex-col justify-between p-8 min-h-[300px] group">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-xs text-pink-soft">02. PROJECT</span>
              <div className="w-12 h-12 rounded-2xl bg-pink-500/15 border border-pink-500/30 text-pink-300 grid place-items-center">
                <CalendarCheck2 className="w-6 h-6" />
              </div>
            </div>

            <h2 className="h-display text-xl font-medium text-white group-hover:text-pink-300 transition-colors">
              One-off Project Strategy
            </h2>
            <p className="body-md mt-2 text-xs text-ink-2">
              Plan a specific deliverable with an exact target date, project brief, and budget ceiling.
            </p>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-6 font-body text-xs font-medium text-pink-300">
            <span>Plan One-off Project</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 3: Monthly Workflows Pipeline */}
        <Link href="/strategy/new/monthly" className="problem-card glass-card flex flex-col justify-between p-8 min-h-[300px] group">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-xs text-cyan">03. WORKFLOW</span>
              <div className="w-12 h-12 rounded-2xl bg-cyan/15 border border-cyan/30 text-cyan grid place-items-center">
                <RefreshCw className="w-6 h-6" />
              </div>
            </div>

            <h2 className="h-display text-xl font-medium text-white group-hover:text-cyan transition-colors">
              Monthly Workload Pipeline
            </h2>
            <p className="body-md mt-2 text-xs text-ink-2">
              Build recurring workload pipelines with automated model evaluations and subscription savings.
            </p>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-6 font-body text-xs font-medium text-cyan">
            <span>Build Monthly Pipeline</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
}
