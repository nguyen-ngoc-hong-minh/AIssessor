"use client";

import { ArrowUpRight, Copy, Plus, Layers, Sparkles, Trash2, FileText, CheckCircle2 } from "lucide-react";
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
    <div className="minimal-dashboard">
      {/* Dashboard Top Header */}
      <div className="dashboard-header-bar">
        <div>
          <span className="mono-badge">[ DASHBOARD ]</span>
          <h1>AI Strategy Library</h1>
          <p>Quản lý các bộ công cụ AI và lộ trình thực thi đã được lưu.</p>
        </div>
        <Link className="minimal-btn minimal-btn-dark" href="/choose-usage">
          <Plus className="w-4 h-4" />
          <span>New Strategy</span>
        </Link>
      </div>

      {/* Metric Tiles Row */}
      <div className="dashboard-metrics-grid">
        <div className="metric-card">
          <span className="metric-code">[ 01 ]</span>
          <div className="metric-val">{strategies.length}</div>
          <span className="metric-lbl">Strategies Created</span>
        </div>

        <div className="metric-card">
          <span className="metric-code">[ 02 ]</span>
          <div className="metric-val">{savedPlans}</div>
          <span className="metric-lbl">Plans Completed</span>
        </div>

        <div className="metric-card">
          <span className="metric-code">[ 03 ]</span>
          <div className="metric-val">100%</div>
          <span className="metric-lbl">Evidence Verified</span>
        </div>
      </div>

      {/* Main List Section */}
      <div className="dashboard-main-content">
        <div className="content-header">
          <h2>Recent Strategies</h2>
          <span className="count-tag">{strategies.length} items</span>
        </div>

        {error && <p className="error-message">{error}</p>}

        {strategies.length === 0 ? (
          <div className="minimal-empty-state">
            <Layers className="w-8 h-8 text-black mb-3" />
            <h3>Chưa có chiến lược nào được lưu</h3>
            <p>Hãy tạo chiến lược đầu tiên bằng cách nhập nhiệm vụ công việc của bạn.</p>
            <Link className="minimal-btn minimal-btn-dark" href="/choose-usage">
              <Plus className="w-4 h-4" />
              <span>Tạo chiến lược mới</span>
            </Link>
          </div>
        ) : (
          <div className="strategy-minimal-list">
            {strategies.map((strategy) => (
              <div className="strategy-item-row" key={strategy._id}>
                <div className="item-type-icon">
                  <FileText className="w-4 h-4 text-black" />
                </div>
                
                <div className="item-details">
                  <strong>{strategy.title}</strong>
                  <div className="item-sub">
                    <span>{new Date(strategy.createdAt).toLocaleDateString()}</span>
                    <span className="sep">•</span>
                    <span>{strategy.usageType === "one_off" ? (strategy.budget === undefined ? "Budget not set" : `Budget $${strategy.budget} USD`) : "Recurring workflow"}</span>
                    {strategy.refreshAvailable && (
                      <span className="update-badge" title={strategy.refreshReasons?.join("; ")}>
                        Update Available
                      </span>
                    )}
                  </div>
                </div>

                <span className="badge-tag">
                  {strategy.usageType === "one_off" ? "One-off" : "Monthly"}
                </span>

                <div className="item-actions">
                  <Link
                    className="action-icon-btn"
                    href={`/strategy/${strategy._id}/${strategy.status === "complete" ? "results" : "workflow"}`}
                    title="Open strategy"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <button
                    className="action-icon-btn"
                    onClick={() => duplicate(strategy._id)}
                    title="Duplicate strategy"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    className="action-icon-btn danger"
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
