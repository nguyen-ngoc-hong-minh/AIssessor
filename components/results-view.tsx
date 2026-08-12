"use client";

import { AlertTriangle, DatabaseZap, ExternalLink, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IntegrationNotice } from "./integration-notice";
import { integrationsConfigured } from "./providers";
import { apiErrorMessage } from "@/lib/client/api-error";

type Evidence = { kind: string; source: string; sourceUrl: string | null; retrievedAt: number; modelVersion: string | null; metricName: string; rawValue: unknown; normalizedValue: number | null; category: string; confidence: string; notes: string | null };
type Selected = { model: { name: string; provider: string; privacyLevel: string | null; commercialUse: boolean | null; contextWindow: number | null }; roundedScore: number; label: string; estimatedCostUsd: number; estimatedSavingsUsd: number; explanation: string[]; limitations: string[]; evidence: Evidence[]; evidenceConfidence: "High" | "Moderate" | "Limited" };
type Step = { stepId: string; selected: Selected | null; alternatives: Selected[]; exclusions: Array<{ modelName: string; reasons: string[] }>; dataUpdatedAt: number | null };
type Plan = { variant: string; steps: Step[]; fixedCostUsd: number; apiCostUsd: number; totalCostUsd: number; estimatedSavingsUsd: number; existingSubscriptions: { kept: string[]; couldCancel: string[] }; assumptions: string[]; dataUpdatedAt: number | null };
type SnapshotSource = { source: string; sourceUrl?: string; attribution?: string; fetchedAt: number; sourceVersion?: string };
type Result = { locked: boolean; usageType: "one_off" | "monthly"; estimatedCompletionTime?: string; plans: Plan[]; dataSnapshot: { fetchedAt: number; sources?: SnapshotSource[] } };

const tabLabels: Record<string, string> = { recommended: "Recommended", lowest_cost: "Budget Alternative", highest_quality: "Premium Alternative", fastest: "Fastest", privacy: "Privacy First" };
function displayRaw(value: unknown) { return typeof value === "object" ? JSON.stringify(value) : String(value); }

export function ResultsView({ strategyId }: { strategyId: string }) {
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("recommended");
  const [loadedAt] = useState(() => Date.now());
  useEffect(() => {
    if (!integrationsConfigured) return;
    const cached = sessionStorage.getItem(`benchflow:result:${strategyId}`);
    let request: Promise<Result>;
    if (cached) {
      sessionStorage.removeItem(`benchflow:result:${strategyId}`);
      try { request = Promise.resolve(JSON.parse(cached) as Result); }
      catch { request = fetchResult(); }
    } else {
      request = fetchResult();
    }
    request.then(setResult).catch((reason) => setError(reason instanceof Error ? reason.message : "Results unavailable"));
    function fetchResult() { return fetch(`/api/strategies/${strategyId}/results`).then(async (response) => {
      const body = await response.json() as Result | { code?: string; userMessage?: string; error?: string };
      if (!response.ok) throw new Error(apiErrorMessage(body, "We couldn't load recommendations right now."));
      return body as Result;
    }); }
  }, [strategyId]);

  if (!integrationsConfigured) return <IntegrationNotice />;
  if (error) return <div className="card empty-state"><DatabaseZap /><h2>We don’t have enough current evidence to make a reliable recommendation yet.</h2><p>{error}. BENCHFLOW will not substitute invented scores, prices, privacy terms, or capabilities.</p></div>;
  if (!result) return <div className="card empty-state"><h2>Comparing compatible options...</h2><p>The server is applying hard eligibility rules, task-aware evidence selection, cost calculations, and deterministic scoring.</p></div>;

  const plan = result.plans.find((item) => item.variant === tab) ?? result.plans[0];
  const stale = loadedAt - result.dataSnapshot.fetchedAt > 7 * 86_400_000;
  const uncertainSteps = plan.steps.filter((step) => !step.selected).length;
  return <>
    <div className="card result-summary">
      <div><span>{result.usageType === "monthly" ? "Estimated monthly cost" : "Estimated project cost"}</span><strong>${plan.totalCostUsd.toFixed(2)}</strong><small>Usage-based estimate</small></div>
      <div><span>{result.usageType === "monthly" ? "Estimated savings" : "Estimated completion time"}</span><strong>{result.usageType === "monthly" ? `$${plan.estimatedSavingsUsd.toFixed(2)}` : result.estimatedCompletionTime ?? "Not enough information"}</strong><small>{result.usageType === "monthly" ? "From reused subscriptions" : "From the approved workflow"}</small></div>
      <div><span>Oldest source update</span><strong>{new Date(result.dataSnapshot.fetchedAt).toLocaleDateString()}</strong><small>{stale ? "Some evidence is stale" : "All stored sources are current"}</small></div>
      <div><span>Coverage</span><strong>{uncertainSteps ? `${plan.steps.length - uncertainSteps}/${plan.steps.length} steps` : "All steps"}</strong><small>{uncertainSteps ? "Some steps remain uncertain" : "Evidence requirements met"}</small></div>
    </div>
    {stale && <span className="stale-badge">Some data was last updated more than 7 days ago.</span>}
    {result.dataSnapshot.sources && <details className="snapshot-sources"><summary>Evidence source snapshots</summary>{result.dataSnapshot.sources.map((source) => <div key={source.source}><span>{source.attribution ?? source.source}</span><small>{new Date(source.fetchedAt).toLocaleString()}{source.sourceVersion ? ` · ${source.sourceVersion}` : ""}</small>{source.sourceUrl && <a href={source.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Open ${source.source}`}><ExternalLink /></a>}</div>)}</details>}
    {result.usageType === "monthly" && (plan.existingSubscriptions.kept.length > 0 || plan.existingSubscriptions.couldCancel.length > 0) && <div className="card subscription-impact"><div><span>Keep</span><strong>{plan.existingSubscriptions.kept.join(", ") || "None identified"}</strong></div><div><span>Could cancel</span><strong>{plan.existingSubscriptions.couldCancel.join(", ") || "None identified"}</strong></div></div>}
    <div className="result-tabs">{result.plans.map((item) => <button className={tab === item.variant ? "active" : ""} onClick={() => setTab(item.variant)} key={item.variant}>{tabLabels[item.variant]}</button>)}</div>
    {plan.steps.map((step, index) => <article className="card recommend-card" key={step.stepId}>
      <header><div><p>Workflow step {index + 1}</p><h3>{step.selected?.model.name ?? "No reliable recommendation yet"}</h3>{step.selected && <small>{step.selected.model.provider}</small>}</div>{step.selected && <div className="recommendation-labels"><span className="confidence-label">{step.selected.evidenceConfidence} confidence</span><span className="fit-label">{step.selected.label}</span></div>}</header>
      {step.selected ? <>
        <div className="recommendation-facts"><span>${step.selected.estimatedCostUsd.toFixed(4)} estimated cost</span><span>{step.selected.model.contextWindow && step.selected.model.contextWindow >= 100_000 ? "Suitable for large documents" : "Suitable for focused inputs"}</span><span>{step.selected.model.privacyLevel ? `${step.selected.model.privacyLevel} privacy evidence` : "Privacy not evidenced"}</span></div>
        <details className="why-this"><summary>Why this?</summary><p>{step.selected.explanation.join(" ")}</p><div className="source-list"><strong>Sources</strong>{Array.from(new Map(step.selected.evidence.filter((item) => item.sourceUrl).map((item) => [item.sourceUrl, item])).values()).map((item) => <a href={item.sourceUrl!} target="_blank" rel="noreferrer" key={item.sourceUrl}>{item.source}<ExternalLink /></a>)}</div><small>Data updated: {new Date(step.dataUpdatedAt ?? result.dataSnapshot.fetchedAt).toLocaleDateString()}</small><details className="raw-evidence"><summary>View evidence</summary>{step.selected.evidence.map((item, evidenceIndex) => <div key={`${item.kind}-${item.metricName}-${evidenceIndex}`}><span>{item.kind}</span><strong>{item.metricName}</strong><code>{displayRaw(item.rawValue)}</code><small>{item.confidence} · retrieved {new Date(item.retrievedAt).toLocaleDateString()}</small>{item.notes && <p>{item.notes}</p>}</div>)}</details></details>
        {step.selected.limitations.length > 0 && <p className="error-message"><AlertTriangle /> {step.selected.limitations.join(" · ")}</p>}
      </> : <div className="uncertain-step"><p>We don’t have enough current evidence to make a reliable recommendation for this step.</p>{step.exclusions.length > 0 && <details><summary>View eligibility reasons</summary>{step.exclusions.slice(0, 8).map((item) => <div key={item.modelName}><strong>{item.modelName}</strong><span>{item.reasons.join(" · ")}</span></div>)}</details>}</div>}
    </article>)}
    {result.locked && <div className="card empty-state" style={{ marginTop: 15 }}><LockKeyhole /><h2>Unlock the complete strategy and alternatives.</h2><p>A verified Stripe webhook activates Plus or Team access in Convex.</p><Link className="button button-primary" href="/pricing" style={{ marginTop: 18 }}>View plans</Link></div>}
  </>;
}
