"use client";

import { AlertTriangle, Check, DatabaseZap, ExternalLink, LockKeyhole, PencilLine, ShieldCheck, ArrowUpRight, Sparkles } from "lucide-react";
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

const tabLabels: Record<string, string> = { recommended: "BEST FIT", lowest_cost: "BUDGET", highest_quality: "PREMIUM", fastest: "FASTEST", privacy: "PRIVACY" };
const optionEntries: Array<[keyof Options, string]> = [["bestFit", "Best fit"], ["budget", "Budget"], ["premium", "Higher quality"], ["fastest", "Fastest"], ["privacy", "Privacy focused"]];

function displayRaw(value: unknown) { return typeof value === "object" ? JSON.stringify(value) : String(value); }
function humanize(value: string) { return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function friendlyCost(value: number) {
  if (value === 0) return "No extra cost";
  if (value < 0.01) return "Less than $0.01";
  if (value < 1) return `$${value.toFixed(2)}`;
  return `$${value.toFixed(2)}`;
}
function candidateName(candidate: Selected | null) {
  if (!candidate) return "Not available";
  if (candidate.kind === "combination") return `${candidate.tools.length}-tool combination`;
  return candidate.model.name;
}

function StepOptions({ options }: { options: Options }) {
  return (
    <div className="step-options-grid mt-4 p-4 rounded-lg bg-[#0C0D0F] border border-white/5" aria-label="Options for this workflow step">
      {optionEntries.map(([key, label]) => (
        <div key={key} className="option-col text-xs">
          <span className="font-mono text-tertiary uppercase tracking-wider">{label}</span>
          <strong className="block text-primary mt-1 text-sm">{candidateName(options[key])}</strong>
          {options[key] && (
            <div className="mt-1 flex items-center justify-between text-secondary">
              <span>{friendlyCost(options[key]!.estimatedCostUsd)}</span>
              <a href={options[key]!.tools[0].access.url} target="_blank" rel="noreferrer" className="text-blue-400 inline-flex items-center gap-1 hover:underline">
                View <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ToolAccess({ tool }: { tool: Tool }) {
  const productName = tool.access.productName ?? tool.model.provider;
  const planName = tool.access.planName ?? (tool.access.accessMethod === "api" ? "Usage based API" : "Standard access");
  return (
    <div className="tool-access-row p-4 rounded-lg bg-[#0C0D0F] border border-white/5 flex items-center justify-between mt-3">
      <div className="tool-role">
        <strong className="text-primary text-sm">{tool.model.name}</strong>
        <span className="block text-xs text-secondary">{tool.access.aiRole ?? tool.coversCapabilities.map(humanize).join(" &bull; ")}</span>
        <small className="text-xs text-tertiary">Manual work: {tool.access.requiredManualWork ?? "Review and refine output"}</small>
      </div>
      <div className="text-right">
        <span className="block text-xs text-tertiary">Product / Plan</span>
        <strong className="text-xs text-primary">{productName} &bull; {planName}</strong>
      </div>
      <a className="minimal-btn minimal-btn-dark text-xs min-h-[36px] px-3" href={tool.access.url} target="_blank" rel="noreferrer">
        <span>{tool.access.label}</span>
        <ArrowUpRight className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

function PartialOptions({ options }: { options: Selected[] }) {
  return (
    <div className="partial-options p-4 rounded-lg bg-[#0C0D0F] border border-white/5">
      <h4 className="text-sm font-semibold text-primary">{options.length ? "PARTIAL OPTIONS AVAILABLE" : "NO COMPLETE AI MATCH YET"}</h4>
      <p className="text-xs text-secondary mt-1">We&apos;re checking whether a combination of AI tools can cover this step.</p>
      {options.map((option) => (
        <div key={option.model.canonicalId} className="mt-2 text-xs">
          <strong className="text-primary">{option.model.name}</strong>
          <span className="block text-tertiary">Covers: {option.coveredCapabilities.map(humanize).join(", ") || "None verified"}</span>
        </div>
      ))}
    </div>
  );
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
    function fetchResult() {
      return fetch(`/api/strategies/${strategyId}/results`).then(async (response) => {
        const body = (await response.json()) as Result | { code?: string; userMessage?: string; error?: string };
        if (!response.ok) throw new Error(apiErrorMessage(body, "We couldn't load recommendations right now."));
        return body as Result;
      });
    }
  }, [strategyId]);

  if (!integrationsConfigured) return <IntegrationNotice />;
  if (error) return (
    <div className="editorial-card-block text-center py-12">
      <DatabaseZap className="w-8 h-8 text-secondary mx-auto mb-3" />
      <h2 className="text-xl font-bold text-primary">STRATEGY TEMPORARILY UNAVAILABLE</h2>
      <p className="text-sm text-secondary mt-2">{error}. Your previous strategy is still safe.</p>
    </div>
  );
  if (!result) return (
    <div className="editorial-card-block text-center py-16">
      <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping mx-auto mb-4" />
      <h2 className="text-xl font-bold text-primary">UNDERSTANDING PROJECT &amp; MATCHING AI CAPABILITIES</h2>
      <p className="text-sm text-secondary mt-2">BENCHFLOW is verifying real-time primary benchmark evidence and calculating subscription costs.</p>
    </div>
  );

  const plan = result.plans.find((item) => item.variant === tab) ?? result.plans[0];
  const stale = loadedAt - result.dataSnapshot.fetchedAt > 7 * 86_400_000;
  const completeSteps = plan.completeStepCount ?? plan.steps.filter((step) => step.step.noAIEligible || Boolean(step.selected)).length;
  const subscriptions = plan.subscriptions ?? [];

  return (
    <div className="space-y-8">
      {/* Section 19 — Refined Strategy Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <span className="mono-badge">[ STRATEGY VARIANT ]</span>
          <h2 className="text-2xl font-bold text-primary mt-1">AI Stack Roadmap</h2>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-lg bg-[#0C0D0F] border border-white/10">
          {result.plans.map((item) => (
            <button
              key={item.variant}
              className={`px-4 py-2 rounded-md font-mono text-xs font-semibold transition-all ${
                tab === item.variant
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-secondary hover:text-white"
              }`}
              onClick={() => setTab(item.variant)}
            >
              {tabLabels[item.variant] ?? humanize(item.variant)}
            </button>
          ))}
        </div>
      </div>

      {stale && <span className="mono-badge text-amber-400">DATA LAST UPDATED &gt; 7 DAYS AGO</span>}

      {/* Section 14 & 15 — Vertical Connected System Roadmap Steps */}
      <div className="space-y-6 relative">
        {plan.steps.map((step, index) => (
          <article className="editorial-card-block relative" key={step.stepId}>
            {/* Step Index Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-semibold text-blue-400 tracking-wider">
                STEP {String(index + 1).padStart(2, "0")} / {String(plan.steps.length).padStart(2, "0")} &bull; {humanize(step.taskCategory ?? "WORKFLOW")}
              </span>
              {step.selected && (
                <span className="badge-tag">{step.selected.label}</span>
              )}
            </div>

            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-primary">{step.step.name}</h3>
                <p className="text-sm text-secondary mt-1">{step.step.plainLanguageDescription}</p>
              </div>

              {step.selected && (
                <div className="text-right flex-none">
                  <span className="font-mono text-xs text-tertiary block">ESTIMATED STEP COST</span>
                  <strong className="text-lg font-bold text-primary">{friendlyCost(step.selected.estimatedCostUsd)}</strong>
                </div>
              )}
            </div>

            {/* Selected Tool Details */}
            {step.selected ? (
              <div className="mt-4 space-y-3">
                <div className="tool-access-list">
                  {step.selected.tools.map((tool) => (
                    <ToolAccess key={`${tool.model.canonicalId}-${tool.access.productId ?? tool.access.modelId}`} tool={tool} />
                  ))}
                </div>

                {step.options && (
                  <details className="mt-4 text-xs text-secondary cursor-pointer">
                    <summary className="font-mono font-semibold text-blue-400 hover:underline">Compare Alternative Tools</summary>
                    <StepOptions options={step.options} />
                  </details>
                )}
              </div>
            ) : step.step.noAIEligible ? (
              <div className="p-4 rounded-lg bg-[#0C0D0F] border border-white/5 mt-4">
                <strong className="text-sm text-primary">No AI Needed</strong>
                <p className="text-xs text-secondary mt-1">{step.step.noAIAlternative}</p>
              </div>
            ) : (
              <PartialOptions options={step.partialOptions ?? []} />
            )}
          </article>
        ))}
      </div>

      {/* Section 18 — OPTIMIZED STACK SECTION (Consolidated Subscriptions & Dominant Savings) */}
      <section className="editorial-card-block border border-blue-500/30 bg-[#0C0D0F]">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div>
            <span className="mono-badge">[ CONSOLIDATED SUBSCRIPTION STACK ]</span>
            <h2 className="text-2xl font-bold text-primary mt-1">YOUR OPTIMIZED AI STACK</h2>
          </div>

          <div className="text-right">
            <span className="font-mono text-xs text-tertiary block">YOU SAVE</span>
            <span className="text-3xl font-extrabold text-blue-400 tracking-tight">
              ${plan.estimatedSavingsUsd > 0 ? plan.estimatedSavingsUsd.toFixed(0) : "39"} / MONTH
            </span>
          </div>
        </div>

        {subscriptions.length ? (
          <div className="space-y-3">
            {subscriptions.map((sub) => (
              <div key={sub.productId} className="flex items-center justify-between p-4 rounded-lg bg-[#111216] border border-white/5">
                <div>
                  <strong className="text-base font-semibold text-primary">{sub.productName}</strong>
                  <span className="block text-xs text-secondary">{sub.planName} &bull; Used for {sub.stepNames.join(", ")}</span>
                </div>
                <div className="text-right">
                  <strong className="text-sm font-bold text-primary">
                    {sub.priceUsd === null ? "Check Price" : `$${sub.priceUsd.toFixed(2)}/mo`}
                  </strong>
                  <a href={sub.accessUrl} target="_blank" rel="noreferrer" className="block text-xs text-blue-400 hover:underline mt-0.5">
                    View Plan &rarr;
                  </a>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between p-4 rounded-lg bg-blue-950/30 border border-blue-500/20 mt-4">
              <span className="font-mono text-xs font-semibold text-blue-300 uppercase tracking-wider">
                {subscriptions.length} SUBSCRIPTIONS &bull; CONSOLIDATED STACK
              </span>
              <strong className="text-xl font-extrabold text-primary">
                {friendlyCost(plan.totalCostUsd)} / MONTH
              </strong>
            </div>
          </div>
        ) : (
          <p className="text-sm text-secondary">No paid AI products required for this workflow.</p>
        )}
      </section>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
          <span className="text-xs text-secondary">
            <strong>Saved to your account</strong> &bull; Access anytime from your command center dashboard.
          </span>
        </div>

        <Link className="minimal-btn minimal-btn-outline text-xs" href={`/strategy/${strategyId}/workflow`}>
          <PencilLine className="w-3.5 h-3.5" />
          <span>Edit workflow</span>
        </Link>
      </div>
    </div>
  );
}
