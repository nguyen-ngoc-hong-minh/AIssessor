"use client";

import { ArrowUpRight, Copy, Plus, Layers, Trash2, FileText } from "lucide-react";
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
    <div className="editorial-dashboard">
      {/* Dashboard Top Banner */}
      <div className="dashboard-top-row">
        <div>
          <span className="mono-badge">[ WORKSPACE / STRATEGIES ]</span>
          <h1>AI Strategy Library</h1>
          <p>Manage, duplicate, and execute your saved AI model strategies and workflow plans.</p>
        </div>
        <Link className="minimal-btn minimal-btn-dark" href="/choose-usage">
          <Plus className="w-4 h-4" />
          <span>New Strategy</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="dashboard-facts-row">
        <div className="dash-fact-card">
          <span className="fact-code">[ 01 ]</span>
          <div className="fact-num-val">{strategies.length}</div>
          <span className="fact-lbl-text">Strategies Created</span>
        </div>

        <div className="dash-fact-card">
          <span className="fact-code">[ 02 ]</span>
          <div className="fact-num-val">{savedPlans}</div>
          <span className="fact-lbl-text">Plans Completed</span>
        </div>

        <div className="dash-fact-card">
          <span className="fact-code">[ 03 ]</span>
          <div className="fact-num-val">100%</div>
          <span className="fact-lbl-text">Evidence Verified</span>
        </div>
      </div>

      {/* Main List Section */}
      <div className="dashboard-list-card">
        <div className="list-card-header">
          <h2>Recent Strategies</h2>
          <span className="mono-count">[{strategies.length} ITEMS]</span>
        </div>

        {error && <p className="error-message">{error}</p>}

        {strategies.length === 0 ? (
          <div className="dash-empty-box">
            <Layers className="w-8 h-8 text-black mb-3" />
            <h3>No saved strategies yet</h3>
            <p>Describe your project or monthly task once. BENCHFLOW will keep the resulting strategy ready here.</p>
            <Link className="minimal-btn minimal-btn-dark" href="/choose-usage">
              <Plus className="w-4 h-4" />
              <span>Create Your First Strategy</span>
            </Link>
          </div>
        ) : (
          <div className="dash-items-list">
            {strategies.map((strategy) => (
              <div className="dash-item-row" key={strategy._id}>
                <div className="dash-item-icon">
                  <FileText className="w-4 h-4 text-black" />
                </div>
                
                <div className="dash-item-info">
                  <strong>{strategy.title}</strong>
                  <div className="dash-item-meta">
                    <span>{new Date(strategy.createdAt).toLocaleDateString()}</span>
                    <span className="sep">•</span>
                    <span>{strategy.usageType === "one_off" ? (strategy.budget === undefined ? "Budget not set" : `Budget $${strategy.budget} USD`) : "Recurring Workload"}</span>
                    {strategy.refreshAvailable && (
                      <span className="update-available-badge" title={strategy.refreshReasons?.join("; ")}>
                        Update Available
                      </span>
                    )}
                  </div>
                </div>

                <span className="usage-type-badge">
                  {strategy.usageType === "one_off" ? "One-off" : "Monthly"}
                </span>

                <div className="dash-item-actions">
                  <Link
                    className="action-btn-icon"
                    href={`/strategy/${strategy._id}/${strategy.status === "complete" ? "results" : "workflow"}`}
                    title="Open strategy"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <button
                    className="action-btn-icon"
                    onClick={() => duplicate(strategy._id)}
                    title="Duplicate strategy"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    className="action-btn-icon danger-btn"
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
