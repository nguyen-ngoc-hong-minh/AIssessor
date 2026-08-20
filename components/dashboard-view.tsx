"use client";

import { ArrowUpRight, Copy, Plus, Layers, Trash2, FileText, Sparkles, CheckCircle2, RefreshCw } from "lucide-react";
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
    <div className="editorial-dashboard-wrap">
      {/* 1. TOP EXECUTIVE DARK CARD (Strong Contrast Hero Banner inspired by Reference Image) */}
      <div className="dash-hero-banner">
        <div className="dash-banner-header">
          <span className="banner-pill-badge">[ WORKSPACE SUMMARY ]</span>
          <span className="banner-large-num">01</span>
        </div>
        
        <div className="dash-banner-body">
          <h1>
            AI Strategy Library <span className="banner-sub-text">and Execution Plans.</span>
          </h1>
          <p>
            Manage, evaluate, and deploy your saved AI tool pipelines. All recommendations use live, verifiable benchmark evidence.
          </p>
        </div>

        <div className="dash-banner-footer">
          <Link className="minimal-btn minimal-btn-outline dark-theme-btn" href="/choose-usage">
            <Plus className="w-4 h-4" />
            <span>Create New Strategy</span>
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* 2. HIGH-IMPACT METRICS GRID (Inspired by Reference 2025 in numbers) */}
      <div className="dash-metrics-grid">
        <div className="dash-metric-card metric-dark">
          <span className="metric-tag">[ 01. TOTAL ]</span>
          <div className="metric-huge-val">{strategies.length}</div>
          <div className="metric-title">Strategies Created</div>
          <p className="metric-desc">Total project and monthly task evaluations.</p>
        </div>

        <div className="dash-metric-card metric-grey">
          <span className="metric-tag">[ 02. READY ]</span>
          <div className="metric-huge-val">{savedPlans}</div>
          <div className="metric-title">Plans Completed</div>
          <p className="metric-desc">Ready for deployment and execution.</p>
        </div>

        <div className="dash-metric-card metric-white">
          <span className="metric-tag">[ 03. EVIDENCE ]</span>
          <div className="metric-huge-val">100%</div>
          <div className="metric-title">Verified Benchmarks</div>
          <p className="metric-desc">Source-linked evidence &amp; price sheets.</p>
        </div>
      </div>

      {/* 3. STRATEGY LIST SECTION (Strong Hierarchy Cards & Rows) */}
      <div className="dash-content-block">
        <div className="block-header-row">
          <div>
            <span className="mono-badge">[ RECENT ACTIVITY ]</span>
            <h2>Saved Strategies</h2>
          </div>
          <span className="count-pill-tag">{strategies.length} ITEMS</span>
        </div>

        {error && <p className="error-message">{error}</p>}

        {strategies.length === 0 ? (
          <div className="editorial-empty-card">
            <div className="empty-icon-wrap">
              <Layers className="w-8 h-8 text-black" />
            </div>
            <h3>No Saved Strategies Yet</h3>
            <p>Describe your project or recurring workflow once. BENCHFLOW will evaluate models and save your actionable plan here.</p>
            <Link className="minimal-btn minimal-btn-dark" href="/choose-usage">
              <Plus className="w-4 h-4" />
              <span>Create Your First Strategy</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="strategy-cards-list">
            {strategies.map((strategy, idx) => (
              <div className="strategy-card-row" key={strategy._id}>
                <div className="row-index">{String(idx + 1).padStart(2, "0")}.</div>

                <div className="row-main-info">
                  <div className="row-top-tags">
                    <span className="type-badge">
                      [{strategy.usageType === "one_off" ? "ONE-OFF PROJECT" : "MONTHLY WORKFLOW"}]
                    </span>
                    {strategy.refreshAvailable && (
                      <span className="update-badge" title={strategy.refreshReasons?.join("; ")}>
                        <RefreshCw className="w-3 h-3 flex-none" />
                        <span>UPDATE AVAILABLE</span>
                      </span>
                    )}
                  </div>
                  
                  <h3>{strategy.title}</h3>

                  <div className="row-meta-info">
                    <span>Created: {new Date(strategy.createdAt).toLocaleDateString()}</span>
                    <span className="dot-sep">•</span>
                    <span>
                      {strategy.usageType === "one_off"
                        ? strategy.budget === undefined
                          ? "Budget not set"
                          : `Budget: $${strategy.budget} USD`
                        : "Recurring Workload"}
                    </span>
                  </div>
                </div>

                <div className="row-actions-group">
                  <Link
                    className="action-btn action-btn-primary"
                    href={`/strategy/${strategy._id}/${strategy.status === "complete" ? "results" : "workflow"}`}
                    title="Open strategy"
                  >
                    <span>View Plan</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>

                  <button
                    className="action-btn action-btn-subtle"
                    onClick={() => duplicate(strategy._id)}
                    title="Duplicate strategy"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    className="action-btn action-btn-danger"
                    onClick={() => remove(strategy._id)}
                    title="Delete strategy"
                  >
                    <Trash2 className="w-4 h-4" />
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
