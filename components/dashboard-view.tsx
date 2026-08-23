"use client";

import { ArrowUpRight, Copy, History, Plus, Trash2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IntegrationNotice } from "./integration-notice";
import { integrationsConfigured } from "./providers";
import { formatCurrency, type SupportedCurrency } from "@/lib/currency";

type Strategy = {
  _id: string;
  title: string;
  usageType: "one_off" | "monthly";
  budget?: number;
  budgetAmount?: number;
  budgetCurrency?: SupportedCurrency;
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
    <div className="editorial-dashboard-wrap space-y-4 pt-3">
      {/* Metric Grid */}
      <div className="dash-metrics-grid grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="metric glass-card p-6 pb-4 flex flex-col justify-between">
          <div>
            <div className="font-mono text-xs text-indigo-soft tracking-wider mb-2 font-medium">Active projects</div>
            <div className="metric-num grd text-5xl font-bold tracking-tight my-4">{strategies.length}</div>
            <p className="metric-lbl text-xs text-ink-2 leading-relaxed mt-2">Total project and monthly task evaluations</p>
          </div>
        </div>

        <div className="metric glass-card p-6 pb-4 flex flex-col justify-between">
          <div>
            <div className="font-mono text-xs text-pink-soft tracking-wider mb-2 font-medium">Optimized stack</div>
            <div className="metric-num grd text-5xl font-bold tracking-tight my-4">{savedPlans}</div>
            <p className="metric-lbl text-xs text-ink-2 leading-relaxed mt-2">Plans ready for deployment &amp; execution</p>
          </div>
        </div>

        <div className="metric glass-card p-6 pb-4 flex flex-col justify-between">
          <div>
            <div className="font-mono text-xs text-cyan tracking-wider mb-2 font-medium">New better option</div>
            <div className="metric-num text-5xl font-bold tracking-tight my-4" style={{ background: "linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #38bdf8 100%)", WebkitBackgroundClip: "text", color: "transparent" }}>
              &minus;32%
            </div>
            <p className="metric-lbl text-xs text-ink-2 leading-relaxed mt-2">Gemini Flash X benchmark for research workflow</p>
          </div>
        </div>
      </div>

      {/* Main Strategy List Section */}
      <div id="consultation-history" className="dash-content-block glass-card p-8 md:p-10 min-h-[485px] flex flex-col justify-between scroll-mt-24">
        <div>
          <div className="eyebrow mb-6">
            <span className="dt" />
            Consultation history
          </div>

          <div className="flex items-end justify-between gap-4 pb-6 mb-6 border-b border-white/10">
            <h2 className="h-display text-3xl md:text-4xl font-semibold text-white">
              Previous Consultations
            </h2>
            <div className="flex items-center gap-2 text-tertiary mb-1">
              <History className="w-4 h-4" aria-hidden="true" />
              <span className="font-mono text-xs">{strategies.length} saved</span>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm mb-6">{error}</p>}
        </div>

        {strategies.length === 0 ? (
          <div className="flex-1 flex flex-col justify-between py-6">
            <div className="flex-1 flex items-center justify-center my-auto py-10">
              <p className="body-md text-sm md:text-base text-ink-2 text-center">
                No Saved Strategies Yet
              </p>
            </div>
            <div className="flex justify-center w-full pt-4">
              <Link className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-sm rounded-full shadow-lg hover:scale-105 transition-transform" href="/choose-usage">
                <Plus className="w-4 h-4" />
                <span>Create Your First Strategy</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
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
                          ? strategy.budgetAmount === undefined && strategy.budget === undefined
                            ? "Budget not set"
                            : `Budget: ${strategy.budgetAmount !== undefined && strategy.budgetCurrency ? formatCurrency(strategy.budgetAmount, strategy.budgetCurrency) : formatCurrency(strategy.budget ?? 0, "USD")}`
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
