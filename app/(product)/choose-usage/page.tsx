import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Planning Modes · Aissessor" };

export default function ChooseUsagePage() {
  return (
    <div className="slide-inner s-features w-full max-w-full">
      <div className="s-features-head">
        <div className="sf-l">
          <div className="eyebrow mb-2">
            <span className="dt" />
            Choose your planning mode
          </div>
          <h2 className="h-display text-4xl md:text-5xl lg:text-6xl font-semibold">
            Tailored for <span className="grd">one-off projects</span> or <span className="grd">monthly workloads</span>.
          </h2>
        </div>
        <p className="sf-r body-lg">
          Select how you want to structure your AI recommendations based on your team&apos;s workflow style and delivery cadence.
        </p>
      </div>
      <div className="feature-grid grid grid-cols-1 md:grid-cols-2 gap-8" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        <div className="feature glass-card deck-mode-card">
          <div>
            <div className="f-num">01</div>
            <h3>One-off Project Strategy</h3>
            <p>A specific deliverable with an exact target completion date, project brief, and budget ceiling limit.</p>
          </div>
          <Link href="/strategy/new/one-off" className="f-link">
            <span>Plan One-off Project</span> <span>&rarr;</span>
          </Link>
        </div>

        <div className="feature glass-card deck-mode-card">
          <div>
            <div className="f-num">02</div>
            <h3>Monthly Workload Pipeline</h3>
            <p>Multiple recurring tasks, each with its own execution frequency, model tier, and quality requirements.</p>
          </div>
          <Link href="/strategy/new/monthly" className="f-link">
            <span>Build Monthly Pipeline</span> <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
