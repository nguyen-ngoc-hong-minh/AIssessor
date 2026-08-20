"use client";

import { ArrowUpRight, Copy, Plus, Layers, Trash2, RefreshCw, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IntegrationNotice } from "./integration-notice";
import { integrationsConfigured } from "./providers";

type Strategy = {
  _id: string;
  title: string;
  usageType: "one_off" | "monthly";
  budget?: number;
  status: string;
  createdAt: number;
  refreshAvailable?: boolean;
  refreshReasons?: string[];
};

export function DashboardView() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [error, setError] = useState("");

  function load() {
    fetch("/api/strategies")
      .then(async (response) => {
        const body = (await response.json()) as Strategy[] | { error?: string };
        if (!response.ok) throw new Error("error" in body ? body.error : "Unable to load strategies");
        return body as Strategy[];
      })
      .then(setStrategies)
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load strategies"));
  }

  useEffect(() => {
    if (integrationsConfigured) load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this strategy?")) return;
    await fetch(`/api/strategies/${id}`, { method: "DELETE" });
    load();
  }

  async function duplicate(id: string) {
    const response = await fetch(`/api/strategies/${id}/duplicate`, { method: "POST" });
    if (!response.ok) {
      setError("Unable to duplicate strategy");
      return;
    }
    load();
  }

  if (!integrationsConfigured) return <IntegrationNotice />;
  const savedPlans = strategies.filter((strategy) => strategy.status === "complete").length;

  return (
    <div className="editorial-dashboard-wrap space-y-8">
      {/* Metric Grid */}
      <div className="dash-metrics-grid grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="metric glass-card p-7 flex flex-col justify-between min-h-[190px]">
          <div>
            <div className="font-mono text-xs text-indigo-soft tracking-wider mb-3 font-medium">ACTIVE PROJECTS</div>
            <div className="metric-num grd text-5xl font-bold tracking-tight mb-3">{strategies.length}</div>
            <p className="metric-lbl text-xs text-ink-2 leading-relaxed">Total project and monthly task evaluations</p>
          </div>
          <div className="metric-spark mt-4">
            <svg viewBox="0 0 100 24" preserveAspectRatio="none">
              <path d="M0,18 L15,16 L30,12 L45,14 L60,8 L75,6 L90,4 L100,3" stroke="#a5b4fc" fill="none" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        <div className="metric glass-card p-7 flex flex-col justify-between min-h-[190px]">
          <div>
            <div className="font-mono text-xs text-pink-soft tracking-wider mb-3 font-medium">OPTIMIZED STACK</div>
            <div className="metric-num grd text-5xl font-bold tracking-tight mb-3">{savedPlans}</div>
            <p className="metric-lbl text-xs text-ink-2 leading-relaxed">Plans ready for deployment &amp; execution</p>
          </div>
          <div className="metric-spark mt-4">
            <svg viewBox="0 0 100 24" preserveAspectRatio="none">
              <path d="M0,4 L15,8 L30,6 L45,12 L60,14 L75,16 L90,18 L100,20" stroke="#f9a8d4" fill="none" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        <div className="metric glass-card p-7 flex flex-col justify-between min-h-[190px]">
          <div>
            <div className="font-mono text-xs text-cyan tracking-wider mb-3 font-medium">NEW BETTER OPTION</div>
            <div className="metric-num text-5xl font-bold tracking-tight mb-3" style={{ background: "linear-gradient(135deg, #22d3ee, #6366f1)", WebkitBackgroundClip: "text", color: "transparent" }}>
              &minus;32%
            </div>
            <p className="metric-lbl text-xs text-ink-2 leading-relaxed">Gemini Flash X benchmark for research workflow</p>
          </div>
          <div className="metric-spark mt-4">
            <svg viewBox="0 0 100 24" preserveAspectRatio="none">
              <path d="M0,12 L15,10 L30,8 L45,7 L60,5 L75,4 L90,3 L100,2" stroke="#22d3ee" fill="none" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Strategy List Section */}
      <div className="dash-content-block glass-card p-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <div className="eyebrow mb-2">
              <span className="dt" />
              RECENT STRATEGIES
            </div>
            <h2 className="h-display text-2xl font-semibold text-white">Active Workload Plans</h2>
          </div>
          <span className="font-mono text-xs text-tertiary px-3 py-1.5 rounded-full border border-white/10">
            {strategies.length} ITEMS
          </span>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {strategies.length === 0 ? (
          <div className="text-center py-14 px-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 grid place-items-center mx-auto mb-5">
              <Layers className="w-7 h-7" />
            </div>
            <h3 className="h-display text-2xl font-semibold text-white mb-3">No Saved Strategies Yet</h3>
            <p className="body-md text-sm text-ink-2 leading-relaxed max-w-lg mx-auto mb-8">
              Describe your project or recurring workflow once. AIssessor will evaluate models and save your actionable plan here.
            </p>
            <Link className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm rounded-full" href="/choose-usage">
              <Plus className="w-4 h-4" />
              <span>Create Your First Strategy</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {strategies.map((strategy, idx) => (
              <div className="problem-card glass-card flex items-center justify-between p-6" key={strategy._id}>
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  <span className="pc-num font-mono text-xs text-indigo-soft">
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-xs text-cyan uppercase tracking-wider">
                        [{strategy.usageType === "one_off" ? "ONE-OFF PROJECT" : "MONTHLY WORKFLOW"}]
                      </span>
                      {strategy.refreshAvailable && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                          <RefreshCw className="w-3 h-3" />
                          <span>UPDATE AVAILABLE</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-sans text-lg font-medium text-white truncate">{strategy.title}</h3>

                    <div className="flex items-center gap-3 text-xs text-tertiary mt-1 font-body">
                      <span>Created: {new Date(strategy.createdAt).toLocaleDateString()}</span>
                      <span>&bull;</span>
                      <span>
                        {strategy.usageType === "one_off"
                          ? strategy.budget === undefined
                            ? "Budget not set"
                            : `Budget: $${strategy.budget} USD`
                          : "Recurring Workload"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-4">
                  <Link
                    className="btn-primary text-xs px-4 py-2"
                    href={`/strategy/${strategy._id}/${strategy.status === "complete" ? "results" : "workflow"}`}
                    title="Open strategy"
                  >
                    <span>View Plan</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </Link>

                  <button
                    className="btn-secondary text-xs p-2.5"
                    onClick={() => duplicate(strategy._id)}
                    title="Duplicate strategy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    className="btn-secondary text-xs p-2.5 hover:text-red-400 hover:border-red-400/40"
                    onClick={() => remove(strategy._id)}
                    title="Delete strategy"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
