"use client";

import { ArrowUpRight, Copy, FilePlus2, Layers3, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IntegrationNotice } from "./integration-notice";
import { integrationsConfigured } from "./providers";

type Strategy = { _id: string; title: string; usageType: "one_off" | "monthly"; budget?: number; status: string; createdAt: number; refreshAvailable?: boolean; refreshReasons?: string[] };

export function DashboardView() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [error, setError] = useState("");
  function load() { fetch("/api/strategies").then(async (response) => { const body = await response.json() as Strategy[] | { error?: string }; if (!response.ok) throw new Error("error" in body ? body.error : "Unable to load strategies"); return body as Strategy[]; }).then(setStrategies).catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load strategies")); }
  useEffect(() => { if (integrationsConfigured) load(); }, []);
  async function remove(id: string) { if (!confirm("Delete this strategy?")) return; await fetch(`/api/strategies/${id}`, { method: "DELETE" }); load(); }
  async function duplicate(id: string) { const response = await fetch(`/api/strategies/${id}/duplicate`, { method: "POST" }); if (!response.ok) { setError("Unable to duplicate strategy"); return; } load(); }

  if (!integrationsConfigured) return <IntegrationNotice />;
  const savedPlans = strategies.filter((strategy) => strategy.status === "complete").length;
  return <div className="dashboard-grid"><section className="card dashboard-main"><header><div><span className="section-label">Strategy library</span><h2>Recent strategies</h2></div><Link className="button button-primary button-small" href="/choose-usage"><FilePlus2 />New strategy</Link></header>{error && <p className="error-message">{error}</p>}{strategies.length === 0 ? <div className="empty-state"><Sparkles /><h2>No saved strategies yet</h2><p>Describe the work once. BENCHFLOW will keep the resulting plan ready here.</p><Link className="button button-primary" href="/choose-usage">Create your first strategy</Link></div> : <div className="strategy-list">{strategies.map((strategy) => <div className="strategy-row" key={strategy._id}><div className="strategy-icon"><Layers3 /></div><div><strong>{strategy.title}</strong><small>{new Date(strategy.createdAt).toLocaleDateString()} · {strategy.usageType === "one_off" ? strategy.budget === undefined ? "Budget not set" : `Budget $${strategy.budget} USD` : "Recurring workload"}</small>{strategy.refreshAvailable && <span className="refresh-available" title={strategy.refreshReasons?.join("; ")}>Better plan available</span>}</div><span>{strategy.usageType === "one_off" ? "One-off" : "Monthly"}</span><div className="strategy-actions"><Link className="icon-button" href={`/strategy/${strategy._id}/${strategy.status === "complete" ? "results" : "workflow"}`} aria-label={`Open ${strategy.title}`} title="Open strategy"><ArrowUpRight /></Link><button className="icon-button" onClick={() => duplicate(strategy._id)} aria-label={`Duplicate ${strategy.title}`} title="Duplicate strategy"><Copy /></button><button className="icon-button danger" onClick={() => remove(strategy._id)} aria-label={`Delete ${strategy.title}`} title="Delete strategy"><Trash2 /></button></div></div>)}</div>}</section><aside className="card dashboard-side"><span className="section-label">Workspace</span><h2>At a glance</h2><div className="workspace-metric"><strong>{strategies.length}</strong><span>Strategies created</span></div><div className="workspace-metric"><strong>{savedPlans}</strong><span>Plans ready to reopen</span></div><div className="workspace-note"><Sparkles /><p>Recommendation evidence refreshes automatically. Saved plans stay unchanged until you choose to regenerate them.</p></div></aside></div>;
}
