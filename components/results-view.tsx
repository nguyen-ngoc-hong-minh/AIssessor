"use client";

import { AlertTriangle, Check, DatabaseZap, ExternalLink, LockKeyhole, PencilLine, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiErrorMessage } from "@/lib/client/api-error";
import { IntegrationNotice } from "./integration-notice";
import { integrationsConfigured } from "./providers";

type Evidence = { kind: string; source: string; sourceUrl: string | null; retrievedAt: number; modelVersion: string | null; metricName: string; rawValue: unknown; normalizedValue: number | null; category: string; confidence: string; notes: string | null };
type AccessOption = { label: string; url: string; modelId: string; sourceUrl: string; verifiedAt: number; productId?: string; productName?: string; planId?: string; planName?: string; accessMethod?: "product" | "api" | "marketplace" | "cloud"; monthlyPriceUsd?: number; aiFirstClass?: "AI_NATIVE" | "AI_CENTRIC" | "AI_ASSISTED" | "TRADITIONAL"; aiRole?: string; aiContributionLevel?: "LOW" | "MEDIUM" | "HIGH"; automationLevel?: "LOW" | "MEDIUM" | "HIGH"; requiredManualWork?: string };
type Tool = { model: Model; access: AccessOption; coversCapabilities: string[]; estimatedCostUsd: number; costBasis: string };
type Model = { canonicalId: string; name: string; provider: string; privacyLevel: string | null; commercialUse: boolean | null; contextWindow: number | null; accessOptions: AccessOption[] };
type Selected = { kind: "single" | "combination" | "partial"; model: Model; roundedScore: number; label: string; estimatedCostUsd: number; estimatedSavingsUsd: number; costBasis: string; explanation: string[]; limitations: string[]; evidence: Evidence[]; evidenceConfidence: "High" | "Moderate" | "Limited"; coveredCapabilities: string[]; missingCapabilities: string[]; tools: Tool[] };
type Options = { bestFit: Selected | null; budget: Selected | null; premium: Selected | null; fastest: Selected | null; privacy: Selected | null };
type Step = { stepId: string; step: { name: string; plainLanguageDescription: string; inputDescription: string; outputDescription: string; humanReviewRecommended: boolean; noAIEligible: boolean; noAIAlternative: string }; taskCategory: string; requiredCapabilities: string[]; selected: Selected | null; options: Options; alternatives: Selected[]; partialOptions: Selected[]; exclusions: Array<{ modelName: string; reasons: string[] }>; dataUpdatedAt: number | null };
type Subscription = { productId: string; productName: string; planName: string; accessMethod?: string; priceUsd: number | null; accessUrl: string; stepIds: string[]; stepNames: string[]; modelNames: string[]; alreadyOwned: boolean; additionalCostUsd: number | null; apiUsageEstimateUsd: number };
type Plan = { variant: string; steps: Step[]; fixedCostUsd: number; apiCostUsd: number; totalCostUsd: number; estimatedSavingsUsd: number; existingSubscriptions: { kept: string[]; couldCancel: string[] }; subscriptions: Subscription[]; uniqueProductCount: number; completeStepCount: number; budgetUsd?: number | null; overBudgetUsd?: number; hasUnknownSubscriptionPricing?: boolean; assumptions: string[]; dataUpdatedAt: number | null };
type SnapshotSource = { source: string; sourceUrl?: string; attribution?: string; fetchedAt: number; sourceVersion?: string };
type Result = { locked: boolean; usageType: "one_off" | "monthly"; estimatedCompletionTime?: string; plans: Plan[]; dataSnapshot: { fetchedAt: number; sources?: SnapshotSource[] } };

const tabLabels: Record<string, string> = { recommended: "Best fit", lowest_cost: "Budget", highest_quality: "Higher quality", fastest: "Fastest", privacy: "Privacy focused" };
const optionEntries: Array<[keyof Options, string]> = [["bestFit", "Best fit"], ["budget", "Budget"], ["premium", "Higher quality"], ["fastest", "Fastest"], ["privacy", "Privacy focused"]];

function displayRaw(value: unknown) { return typeof value === "object" ? JSON.stringify(value) : String(value); }
function humanize(value: string) { return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function friendlyCost(value: number) {
  if (value === 0) return "No extra cost";
  if (value < 0.01) return "Less than 1 cent";
  if (value < 1) return `About ${Math.round(value * 100)} cents`;
  return `About $${value.toFixed(2)}`;
}
function candidateName(candidate: Selected | null) {
  if (!candidate) return "Not available";
  if (candidate.kind === "combination") return `${candidate.tools.length}-tool combination`;
  return candidate.model.name;
}

function StepOptions({ options }: { options: Options }) {
  return <div className="step-options" aria-label="Options for this workflow step">
    {optionEntries.map(([key, label]) => <div key={key}><span>{label}</span><strong>{candidateName(options[key])}</strong>{options[key] && <><small>{options[key]!.tools.length} {options[key]!.tools.length === 1 ? "tool" : "tools"} · {friendlyCost(options[key]!.estimatedCostUsd)}</small><a href={options[key]!.tools[0].access.url} target="_blank" rel="noreferrer">View product <ExternalLink /></a></>}</div>)}
  </div>;
}

function ToolAccess({ tool }: { tool: Tool }) {
  const productName = tool.access.productName ?? tool.model.provider;
  const planName = tool.access.planName ?? (tool.access.accessMethod === "api" ? "Usage based API" : "Standard access");
  return <div className="tool-access-row">
    <div className="tool-role"><strong>{tool.model.name}</strong><span>{tool.access.aiRole ?? tool.coversCapabilities.map(humanize).join(" · ")}</span><small>Manual work: {tool.access.requiredManualWork ?? "Review and refine the AI output"}</small></div>
    <div><span>Product / plan</span><strong>{productName} · {planName}</strong><small>{humanize(tool.access.aiFirstClass ?? "AI_CENTRIC")} · {humanize(tool.access.accessMethod ?? "api")} · {tool.access.modelId}</small></div>
    <a className="button button-primary" href={tool.access.url} target="_blank" rel="noreferrer">{tool.access.label}<ExternalLink /></a>
  </div>;
}

function PartialOptions({ options }: { options: Selected[] }) {
  return <div className="partial-options"><h4>{options.length ? "Partial options available" : "No AI-first solution verified"}</h4><p>No sufficiently capable AI-first solution was verified for this step.</p>{options.map((option) => <div key={option.model.canonicalId}><strong>{option.model.name}</strong><span><b>Covers:</b> {option.coveredCapabilities.map(humanize).join(", ") || "None verified"}</span><span><b>Missing:</b> {option.missingCapabilities.map(humanize).join(", ")}</span></div>)}</div>;
}

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
    } else request = fetchResult();
    request.then(setResult).catch((reason) => setError(reason instanceof Error ? reason.message : "Results unavailable"));
    function fetchResult() { return fetch(`/api/strategies/${strategyId}/results`).then(async (response) => {
      const body = await response.json() as Result | { code?: string; userMessage?: string; error?: string };
      if (!response.ok) throw new Error(apiErrorMessage(body, "We couldn't load recommendations right now."));
      return body as Result;
    }); }
  }, [strategyId]);

  if (!integrationsConfigured) return <IntegrationNotice />;
  if (error) return <div className="card empty-state"><DatabaseZap /><h2>We do not have enough current evidence to make a reliable recommendation yet.</h2><p>{error}. BENCHFLOW will not substitute invented scores, prices, privacy terms, or capabilities.</p></div>;
  if (!result) return <div className="card empty-state"><h2>Comparing compatible options...</h2><p>The server is applying hard eligibility rules, task-aware evidence selection, cost calculations, and deterministic scoring.</p></div>;

  const plan = result.plans.find((item) => item.variant === tab) ?? result.plans[0];
  const stale = loadedAt - result.dataSnapshot.fetchedAt > 7 * 86_400_000;
  const completeSteps = plan.completeStepCount ?? plan.steps.filter((step) => step.step.noAIEligible || Boolean(step.selected)).length;
  const subscriptions = plan.subscriptions ?? [];
  return <>
    <div className="card result-summary">
      <div><span>{result.usageType === "monthly" ? "Estimated monthly cost" : "Estimated project cost"}</span><strong>{friendlyCost(plan.totalCostUsd)}</strong><small>{result.usageType === "monthly" ? "For one typical month" : "For the complete workflow"}</small></div>
      <div><span>{result.usageType === "monthly" ? "Estimated savings" : "Estimated completion time"}</span><strong>{result.usageType === "monthly" ? `$${plan.estimatedSavingsUsd.toFixed(2)}` : result.estimatedCompletionTime ?? "Not enough information"}</strong><small>{result.usageType === "monthly" ? "From reused subscriptions" : "From the approved workflow"}</small></div>
      <div><span>Minimum stack</span><strong>{plan.uniqueProductCount ?? subscriptions.length} products</strong><small>Subscriptions counted once across steps</small></div>
      <div><span>Coverage</span><strong>{completeSteps === plan.steps.length ? "All steps" : `${completeSteps}/${plan.steps.length} steps`}</strong><small>{completeSteps === plan.steps.length ? "Hard requirements met" : "Partial options shown below"}</small></div>
    </div>
    {stale && <span className="stale-badge">Some data was last updated more than 7 days ago.</span>}
    {result.dataSnapshot.sources && <details className="snapshot-sources"><summary>Evidence source snapshots</summary>{result.dataSnapshot.sources.map((source) => <div key={source.source}><span>{source.attribution ?? source.source}</span><small>{new Date(source.fetchedAt).toLocaleString()}{source.sourceVersion ? ` · ${source.sourceVersion}` : ""}</small>{source.sourceUrl && <a href={source.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Open ${source.source}`}><ExternalLink /></a>}</div>)}</details>}
    <div className="result-tabs" aria-label="Complete roadmap plans">{result.plans.map((item) => <button className={tab === item.variant ? "active" : ""} onClick={() => setTab(item.variant)} key={item.variant}>{tabLabels[item.variant] ?? humanize(item.variant)}</button>)}</div>
    {plan.steps.map((step, index) => <article className="card recommend-card" key={step.stepId}>
      <div className="step-kicker">Step {index + 1} of {plan.steps.length} · {humanize(step.taskCategory ?? "workflow")}</div>
      <header><div><p className="workflow-step-name">{step.step.name}</p><h3>{step.selected ? (step.selected.kind === "combination" ? "Best combination" : step.selected.model.name) : (step.step.noAIEligible ? "Human review" : "No complete verified option yet")}</h3>{step.selected && <small>{step.selected.kind === "combination" ? `${step.selected.tools.length} products cover the complete requirement` : `${step.selected.model.provider} · verified access`}</small>}</div>{step.selected && <div className="recommendation-labels"><span className="confidence-label">{step.selected.evidenceConfidence} confidence</span><span className="fit-label">{step.selected.label}</span></div>}</header>
      <p className="step-description">{step.step.plainLanguageDescription}</p>
      {step.options && <StepOptions options={step.options} />}
      {step.selected ? <>
        <div className="action-plan-grid"><div><span>Give it</span><strong>{step.step.inputDescription}</strong></div><div><span>Use it for</span><strong>{step.step.plainLanguageDescription}</strong></div><div><span>Expected output</span><strong>{step.step.outputDescription}</strong></div></div>
        <div className="tool-access-list">{step.selected.tools.map((tool) => <ToolAccess key={`${tool.model.canonicalId}-${tool.access.productId ?? tool.access.modelId}`} tool={tool} />)}</div>
        <div className="simple-cost"><div><span>Estimated cost for this step</span><strong>{friendlyCost(step.selected.estimatedCostUsd)}</strong><small>{step.selected.tools.length > 1 ? "Combined usage across the selected tools" : "Using the amount of work in your plan"}</small></div><details><summary>See the detailed calculation</summary><p>${step.selected.estimatedCostUsd.toFixed(4)} estimated from {step.selected.costBasis.toLowerCase()}.</p></details></div>
        <div className="recommendation-facts"><span>{step.step.humanReviewRecommended ? "Human review recommended" : "Can run without routine review"}</span><span>{step.selected.kind === "combination" ? `${step.selected.tools.length - 1} workflow handoff${step.selected.tools.length === 2 ? "" : "s"}` : "Single-tool workflow"}</span><span>Price may vary with actual usage</span></div>
        <details className="why-this"><summary>Why BENCHFLOW chose this</summary><p>{step.selected.explanation.join(" ")}</p><div className="source-list"><strong>Task-specific evidence</strong>{Array.from(new Map(step.selected.evidence.filter((item) => item.sourceUrl).map((item) => [item.sourceUrl, item])).values()).map((item) => <a href={item.sourceUrl!} target="_blank" rel="noreferrer" key={item.sourceUrl}>{humanize(item.source)}<ExternalLink /></a>)}</div><small>Recommendation data updated: {new Date(step.dataUpdatedAt ?? result.dataSnapshot.fetchedAt).toLocaleDateString()}</small><details className="raw-evidence"><summary>Inspect raw evidence</summary>{step.selected.evidence.map((item, evidenceIndex) => <div key={`${item.kind}-${item.metricName}-${evidenceIndex}`}><span>{item.kind}</span><strong>{humanize(item.metricName)}</strong><code>{displayRaw(item.rawValue)}</code><small>{humanize(item.confidence)} · retrieved {new Date(item.retrievedAt).toLocaleDateString()}</small>{item.notes && <p>{item.notes}</p>}</div>)}</details></details>
        {step.selected.limitations.length > 0 && <div className="recommendation-cautions"><AlertTriangle /><div><strong>A few details still need checking</strong><p>This recommendation meets the hard requirements, but some evidence or provider terms remain limited.</p><details><summary>See what to check</summary><ul>{step.selected.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul></details></div></div>}
      </> : step.step.noAIEligible ? <div className="manual-step"><strong>No AI needed</strong><p>{step.step.noAIAlternative}</p></div> : <><PartialOptions options={step.partialOptions ?? []} />{step.exclusions.length > 0 && <details className="uncertain-step"><summary>View eligibility reasons</summary>{step.exclusions.slice(0, 8).map((item) => <div key={item.modelName}><strong>{item.modelName}</strong><span>{item.reasons.join(" · ")}</span></div>)}</details>}</>}
    </article>)}
    <section className="card stack-summary"><header><div><span className="kicker">Optimized AI stack</span><h2>AI products and plans for this roadmap</h2></div><strong>{plan.hasUnknownSubscriptionPricing ? `${friendlyCost(plan.totalCostUsd)} known` : friendlyCost(plan.totalCostUsd)}</strong></header>{(plan.overBudgetUsd ?? 0) > 0 && <div className="recommendation-cautions"><AlertTriangle /><div><strong>This complete stack is over the current budget</strong><p>The closest verified option is about ${plan.overBudgetUsd!.toFixed(2)} above budget. Use the Budget tab or adjust the project budget.</p></div></div>}{plan.hasUnknownSubscriptionPricing && <div className="recommendation-cautions"><AlertTriangle /><div><strong>Some current plan prices need checking</strong><p>The total above includes only verified prices. Open each provider plan below before purchasing.</p></div></div>}{subscriptions.length ? <div className="subscription-table">{subscriptions.map((subscription) => <article key={subscription.productId}><div><strong>{subscription.productName}</strong><span>{subscription.planName} · {humanize(subscription.accessMethod ?? "api")}</span><a href={subscription.accessUrl} target="_blank" rel="noreferrer">View plan <ExternalLink /></a></div><div><span>Price</span><strong>{subscription.priceUsd === null ? "Check current price" : subscription.accessMethod === "api" || subscription.accessMethod === "marketplace" ? "Usage based" : `$${subscription.priceUsd.toFixed(2)}/month`}</strong></div><div><span>Used for</span><strong>{subscription.stepNames.join(", ")}</strong></div><div><span>Already owned</span><strong>{subscription.alreadyOwned ? <><Check /> Yes</> : "No"}</strong></div><div><span>Additional cost</span><strong>{subscription.additionalCostUsd === null ? "Not in subtotal" : friendlyCost(subscription.additionalCostUsd)}</strong><small>API estimate: {friendlyCost(subscription.apiUsageEstimateUsd)}</small></div></article>)}</div> : <p className="stack-empty">No paid AI product is required for the selected roadmap.</p>}</section>
    {result.usageType === "monthly" && (plan.existingSubscriptions.kept.length > 0 || plan.existingSubscriptions.couldCancel.length > 0) && <div className="card subscription-impact"><div><span>Keep</span><strong>{plan.existingSubscriptions.kept.join(", ") || "None identified"}</strong></div><div><span>Could cancel</span><strong>{plan.existingSubscriptions.couldCancel.join(", ") || "None identified"}</strong></div></div>}
    {result.locked && <div className="card empty-state" style={{ marginTop: 15 }}><LockKeyhole /><h2>Unlock ranked alternatives and specialized strategy variants.</h2><p>Your complete recommended workflow is included. Plus or Team adds budget, higher-quality, speed, and privacy-focused comparisons.</p><Link className="button button-primary" href="/pricing" style={{ marginTop: 18 }}>View plans</Link></div>}
    <footer className="result-footer-actions"><div><ShieldCheck /><span><strong>Saved to your account</strong><small>This plan will be ready the next time you open this strategy.</small></span></div><Link className="button button-secondary" href={`/strategy/${strategyId}/workflow`}><PencilLine /> Edit workflow</Link></footer>
  </>;
}
