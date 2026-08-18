"use client";

import { AlertTriangle, DatabaseZap, ExternalLink, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IntegrationNotice } from "./integration-notice";
import { integrationsConfigured } from "./providers";
import { apiErrorMessage } from "@/lib/client/api-error";

type Evidence = { kind: string; source: string; sourceUrl: string | null; retrievedAt: number; modelVersion: string | null; metricName: string; rawValue: unknown; normalizedValue: number | null; category: string; confidence: string; notes: string | null };
type AccessOption = { label: string; url: string; modelId: string; sourceUrl: string; verifiedAt: number };
type Selected = { model: { canonicalId: string; name: string; provider: string; privacyLevel: string | null; commercialUse: boolean | null; contextWindow: number | null; accessOptions: AccessOption[] }; roundedScore: number; label: string; estimatedCostUsd: number; estimatedSavingsUsd: number; costBasis: string; explanation: string[]; limitations: string[]; evidence: Evidence[]; evidenceConfidence: "High" | "Moderate" | "Limited" };
type Step = { stepId: string; step: { name: string; plainLanguageDescription: string; inputDescription: string; outputDescription: string; humanReviewRecommended: boolean; noAIEligible: boolean; noAIAlternative: string }; selected: Selected | null; alternatives: Selected[]; exclusions: Array<{ modelName: string; reasons: string[] }>; dataUpdatedAt: number | null };
type Plan = { variant: string; steps: Step[]; fixedCostUsd: number; apiCostUsd: number; totalCostUsd: number; estimatedSavingsUsd: number; existingSubscriptions: { kept: string[]; couldCancel: string[] }; assumptions: string[]; dataUpdatedAt: number | null };
type SnapshotSource = { source: string; sourceUrl?: string; attribution?: string; fetchedAt: number; sourceVersion?: string };
type Result = { locked: boolean; usageType: "one_off" | "monthly"; estimatedCompletionTime?: string; plans: Plan[]; dataSnapshot: { fetchedAt: number; sources?: SnapshotSource[] } };

const tabLabels: Record<string, string> = { recommended: "Recommended", lowest_cost: "Budget Alternative", highest_quality: "Premium Alternative", fastest: "Fastest", privacy: "Privacy First" };
function displayRaw(value: unknown) { return typeof value === "object" ? JSON.stringify(value) : String(value); }
function humanize(value: string) { return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }

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
  const uncertainSteps = plan.steps.filter((step) => !step.selected && !step.step.noAIEligible).length;
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
      <div className="step-kicker">Step {index + 1} of {plan.steps.length}</div>
      <header><div><p className="workflow-step-name">{step.step.name}</p><h3>{step.selected?.model.name ?? (step.step.noAIEligible ? "Human review" : "No verified tool yet")}</h3>{step.selected && <small>{step.selected.model.provider} · verified model access</small>}</div>{step.selected && <div className="recommendation-labels"><span className="confidence-label">{step.selected.evidenceConfidence} confidence</span><span className="fit-label">{step.selected.label}</span></div>}</header>
      <p className="step-description">{step.step.plainLanguageDescription}</p>
      {step.selected ? <>
        <div className="action-plan-grid"><div><span>Give it</span><strong>{step.step.inputDescription}</strong></div><div><span>Use it for</span><strong>{step.step.plainLanguageDescription}</strong></div><div><span>Expected output</span><strong>{step.step.outputDescription}</strong></div></div>
        <div className="recommendation-access"><div><span>Exact model ID</span><code>{step.selected.model.accessOptions[0].modelId}</code><small>Availability checked {new Date(step.selected.model.accessOptions[0].verifiedAt).toLocaleDateString()}</small></div><a className="button button-primary" href={step.selected.model.accessOptions[0].url} target="_blank" rel="noreferrer">{step.selected.model.accessOptions[0].label}<ExternalLink /></a></div>
        <div className="recommendation-facts"><span><strong>${step.selected.estimatedCostUsd.toFixed(4)}</strong> estimated step cost</span><span>{step.selected.costBasis}</span><span>{step.step.humanReviewRecommended ? "Human review recommended" : "Can run without routine review"}</span></div>
        <details className="why-this" open><summary>Why BENCHFLOW chose this</summary><p>{step.selected.explanation.join(" ")}</p><div className="source-list"><strong>Benchmark and pricing sources</strong>{Array.from(new Map(step.selected.evidence.filter((item) => item.sourceUrl).map((item) => [item.sourceUrl, item])).values()).map((item) => <a href={item.sourceUrl!} target="_blank" rel="noreferrer" key={item.sourceUrl}>{humanize(item.source)}<ExternalLink /></a>)}</div><small>Recommendation data updated: {new Date(step.dataUpdatedAt ?? result.dataSnapshot.fetchedAt).toLocaleDateString()}</small><details className="raw-evidence"><summary>Inspect raw evidence</summary>{step.selected.evidence.map((item, evidenceIndex) => <div key={`${item.kind}-${item.metricName}-${evidenceIndex}`}><span>{item.kind}</span><strong>{humanize(item.metricName)}</strong><code>{displayRaw(item.rawValue)}</code><small>{humanize(item.confidence)} · retrieved {new Date(item.retrievedAt).toLocaleDateString()}</small>{item.notes && <p>{item.notes}</p>}</div>)}</details></details>
        {step.selected.limitations.length > 0 && <div className="recommendation-cautions"><AlertTriangle /><div><strong>Check before using</strong><ul>{step.selected.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul></div></div>}
      </> : step.step.noAIEligible ? <div className="manual-step"><strong>No AI needed</strong><p>{step.step.noAIAlternative}</p></div> : <div className="uncertain-step"><p>No model passed both the evidence checks and the verified-access check for this step.</p>{step.exclusions.length > 0 && <details><summary>View eligibility reasons</summary>{step.exclusions.slice(0, 8).map((item) => <div key={item.modelName}><strong>{item.modelName}</strong><span>{item.reasons.join(" · ")}</span></div>)}</details>}</div>}
    </article>)}
    {result.locked && <div className="card empty-state" style={{ marginTop: 15 }}><LockKeyhole /><h2>Unlock ranked alternatives and specialized strategy variants.</h2><p>Your complete recommended workflow is included. Plus or Team adds budget, premium, speed, and privacy-first comparisons.</p><Link className="button button-primary" href="/pricing" style={{ marginTop: 18 }}>View plans</Link></div>}
  </>;
}
