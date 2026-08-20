import type { Metadata } from "next";
import { ArrowUpRight, CalendarCheck2, RefreshCw } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "New Strategy · BENCHFLOW" };

export default function ChooseUsagePage() {
  return (
    <div className="editorial-page-container max-w-4xl space-y-8">
      {/* Header Block */}
      <div className="editorial-page-header">
        <div className="eyebrow mb-3">
          <span className="dt" />
          NEW STRATEGY &bull; STEP 01
        </div>
        <h1 className="h-display text-4xl font-semibold">What do you want to plan?</h1>
        <p className="body-lg mt-2">Choose between a defined single deliverable project or a recurring monthly workload pipeline.</p>
      </div>

      {/* 2-Column Choice Cards - Lustro Glass Cards */}
      <div className="editorial-choice-grid grid grid-cols-2 gap-6">
        <Link href="/strategy/new/one-off" className="problem-card glass-card flex flex-col justify-between p-8 min-h-[260px] group">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-sm text-indigo-soft">01.</span>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 grid place-items-center">
                <CalendarCheck2 className="w-6 h-6" />
              </div>
            </div>
            
            <h2 className="h-display text-2xl font-medium text-white group-hover:text-indigo-300 transition-colors">One-off Project</h2>
            <p className="body-md mt-2">A specific deliverable with an exact target date, project brief, and budget ceiling.</p>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-6 font-body text-sm font-medium text-indigo-300">
            <span>Plan a Project</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link href="/strategy/new/monthly" className="problem-card glass-card flex flex-col justify-between p-8 min-h-[260px] group">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-sm text-pink-soft">02.</span>
              <div className="w-12 h-12 rounded-2xl bg-pink-500/15 border border-pink-500/30 text-pink-300 grid place-items-center">
                <RefreshCw className="w-6 h-6" />
              </div>
            </div>

            <h2 className="h-display text-2xl font-medium text-white group-hover:text-pink-300 transition-colors">Monthly Workflows</h2>
            <p className="body-md mt-2">Multiple recurring tasks, each with its own frequency, model tier, and quality level.</p>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-6 font-body text-sm font-medium text-pink-300">
            <span>Build Monthly Workload</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
}
