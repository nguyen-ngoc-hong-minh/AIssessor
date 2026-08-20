import type { Metadata } from "next";
import { ArrowUpRight, CalendarCheck2, RefreshCw } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "New Strategy · BENCHFLOW" };

export default function ChooseUsagePage() {
  return (
    <div className="editorial-page-container max-w-4xl">
      {/* Header Block */}
      <div className="editorial-page-header">
        <span className="mono-badge">[ NEW STRATEGY / STEP 01 ]</span>
        <h1>What do you want to plan?</h1>
        <p>Choose between a defined single deliverable project or a recurring monthly workload pipeline.</p>
      </div>

      {/* 2-Column Choice Cards - Uniform Peer Cards */}
      <div className="editorial-choice-grid">
        <Link href="/strategy/new/one-off" className="choice-card choice-card-unified">
          <div className="choice-card-header">
            <span className="choice-num font-mono">01.</span>
            <div className="choice-icon-wrap choice-icon-light">
              <CalendarCheck2 className="w-6 h-6 text-black" />
            </div>
          </div>
          
          <h2>One-off Project</h2>
          <p>A specific deliverable with an exact target date, project brief, and budget ceiling.</p>
          
          <div className="choice-card-footer footer-light">
            <span>Plan a Project</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </Link>

        <Link href="/strategy/new/monthly" className="choice-card choice-card-unified">
          <div className="choice-card-header">
            <span className="choice-num font-mono">02.</span>
            <div className="choice-icon-wrap choice-icon-light">
              <RefreshCw className="w-6 h-6 text-black" />
            </div>
          </div>

          <h2>Monthly Workflows</h2>
          <p>Multiple recurring tasks, each with its own frequency, model tier, and quality level.</p>

          <div className="choice-card-footer footer-light">
            <span>Build Monthly Workload</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </div>
  );
}
