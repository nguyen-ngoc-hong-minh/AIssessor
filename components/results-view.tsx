"use client";

import { ArrowUpRight, DatabaseZap, PencilLine, ShieldCheck } from "lucide-react";
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

function humanize(value: string) { return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function friendlyCost(value: number) {
  if (value === 0) return "No extra cost";
  if (value < 0.01) return "Less than $0.01";
  return `$${value.toFixed(2)}`;
}
function candidateName(candidate: Selected | null) {
  if (!candidate) return "Not available";
  if (candidate.kind === "combination") return `${candidate.tools.length}-tool combination`;
  return candidate.model.name;
}

function StepOptions({ options }: { options: Options }) {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" aria-label="Options for this workflow step">
      {optionEntries.map(([key, label]) => {
        const candidate = options[key];
        return (
          <div key={key} className="feature glass-card !p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-3 shadow-md">
            <div>
              <div className="f-num text-[10px] font-mono font-bold text-indigo-soft tracking-widest uppercase mb-2">
                {label}
              </div>
              <h3 className="text-base font-semibold text-white tracking-tight leading-snug line-clamp-2">
                {candidateName(candidate)}
              </h3>
            </div>
            {candidate && (
              <div className="pt-2 flex items-center justify-between text-xs text-ink-2">
                <span className="font-medium text-white/80">{friendlyCost(candidate.estimatedCostUsd)}</span>
                <a
                  href={candidate.tools[0]?.access.url ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="f-link text-indigo-soft hover:underline font-mono text-[11px] inline-flex items-center gap-1"
                >
                  <span>View</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ToolAccess({ tool }: { tool: Tool }) {
  const productName = tool.access.productName ?? tool.model.provider;
  const planName = tool.access.planName ?? (tool.access.accessMethod === "api" ? "Usage based API" : "Standard access");
  return (
    <div className="!p-6 md:!p-7 rounded-2xl bg-[#131626] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 my-4 shadow-md">
      <div className="tool-role flex-1 flex flex-col gap-[10px]">
        <strong className="text-white text-lg font-semibold block leading-snug">{tool.model.name}</strong>
        <span className="block text-xs text-ink-2 leading-relaxed">{tool.access.aiRole ?? tool.coversCapabilities.map(humanize).join(" • ")}</span>
        <small className="text-[11px] font-mono text-ink-3 block">{tool.access.requiredManualWork ? `Manual work: ${tool.access.requiredManualWork}` : "Manual work: Review and refine output"}</small>
      </div>

      <div className="flex flex-col items-start md:items-end gap-3 flex-none">
        <div className="text-left md:text-right space-y-1">
          <span className="block text-[10px] font-mono text-indigo-soft uppercase tracking-wider">Product / Plan</span>
          <strong className="text-xs text-white/90 font-medium block">{productName} • {planName}</strong>
        </div>

        <a className="btn-primary text-xs px-6 py-3 rounded-full inline-flex items-center gap-2 shadow-lg shadow-indigo-600/30 flex-none" href={tool.access.url} target="_blank" rel="noreferrer">
          <span>{tool.access.label}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

function PartialOptions({ options }: { options: Selected[] }) {
  return (
    <div className="partial-options !p-6 rounded-2xl bg-[#131626] border border-white/10 space-y-4 my-4">
      <h4 className="text-sm font-semibold text-white tracking-tight">{options.length ? "PARTIAL OPTIONS AVAILABLE" : "NO COMPLETE AI MATCH YET"}</h4>
      <p className="text-xs text-ink-2 leading-relaxed">We&apos;re checking whether a combination of AI tools can cover this step.</p>
      <div className="space-y-3 pt-2">
        {options.map((option) => (
          <div key={option.model.canonicalId} className="text-xs !p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <strong className="text-white font-semibold block">{option.model.name}</strong>
            <span className="block text-ink-3 text-[11px]">Covers: {option.coveredCapabilities.map(humanize).join(", ") || "None verified"}</span>
          </div>
        ))}
      </div>
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
    <div className="glass-card text-center !py-12 !p-8 rounded-3xl border border-white/10">
      <DatabaseZap className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
      <h2 className="text-xl font-semibold text-white">STRATEGY TEMPORARILY UNAVAILABLE</h2>
      <p className="text-xs text-ink-2 mt-2">{error}. Your previous strategy is still safe.</p>
    </div>
  );
  if (!result) return (
    <div className="glass-card text-center !py-16 !p-8 rounded-3xl border border-white/10">
      <div className="w-3 h-3 rounded-full bg-indigo-400 animate-ping mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-white">MATCHING OPTIMAL AI STACK</h2>
      <p className="text-xs text-ink-2 mt-2">AIssessor is verifying primary benchmark evidence and calculating subscription costs.</p>
    </div>
  );

  const plan = result.plans.find((item) => item.variant === tab) ?? result.plans[0];
  const stale = loadedAt - result.dataSnapshot.fetchedAt > 7 * 86_400_000;
  const subscriptions = plan.subscriptions ?? [];

  return (
    <div className="w-full max-w-6xl mx-auto my-auto py-6 space-y-8">
      {/* Header with Largest H1: AI Stack Roadmap */}
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="eyebrow justify-center">
          <span className="dt" />
          AI Strategy Results
        </div>
        {/* 10px spacer below eyebrow */}
        <div className="h-[10px] w-full block" />
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight text-center max-w-[700px] mx-auto leading-tight font-sans">
          AI Stack Roadmap
        </h1>
        <p className="text-sm text-ink-2 text-center max-w-xl mx-auto leading-relaxed pt-1">
          Each option is matched to your workload, checked against current primary evidence, and saved to your account.
        </p>
      </div>

      {stale && <span className="font-mono text-xs text-amber-400 bg-amber-400/10 px-4 py-1.5 rounded-full border border-amber-400/20 block w-max mx-auto">DATA LAST UPDATED &gt; 7 DAYS AGO</span>}

      {/* 30px Spacer Div */}
      <div className="h-[30px] w-full block" />

      {/* Workflow Steps Roadmap Cards (20px gap between blocks, 20px padding inside each card) */}
      <div className="flex flex-col gap-[20px]">
        {plan.steps.map((step, index) => (
          <article className="glass-card !p-8 md:!p-10 rounded-3xl border border-white/10 relative shadow-xl overflow-hidden" key={step.stepId}>
            {/* Step Header Row */}
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-xs font-bold text-indigo-soft tracking-widest uppercase">
                STEP {String(index + 1).padStart(2, "0")} / {String(plan.steps.length).padStart(2, "0")} • {humanize(step.taskCategory ?? "WORKFLOW")}
              </span>
              {step.selected && (
                <div className="eyebrow bg-[#131626] border border-indigo-400/50 shadow-md">
                  <span className="dt" />
                  <span>{step.selected.evidenceConfidence ? `${step.selected.evidenceConfidence} Evidence` : step.selected.label}</span>
                </div>
              )}
            </div>

            {/* 30px Spacer Div (Hình 1) */}
            <div className="h-[30px] w-full block" />

            {/* Title & Cost Row */}
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-tight leading-snug font-sans">
                  {step.step.name}
                </h3>

                {/* 16px Spacer Div between Title and Description */}
                <div className="h-[16px] w-full block" />

                <p className="text-sm md:text-base text-ink-2 leading-relaxed">
                  {step.step.plainLanguageDescription}
                </p>
              </div>

              {step.selected && (
                <div className="text-right flex-none pl-4">
                  <span className="font-mono text-[10px] text-ink-3 uppercase block tracking-wider mb-1">ESTIMATED STEP COST</span>
                  <strong className="text-2xl font-bold text-white font-sans">{friendlyCost(step.selected.estimatedCostUsd)}</strong>
                </div>
              )}
            </div>

            {/* 30px Spacer Div (Hình 2) */}
            <div className="h-[30px] w-full block" />

            {/* Selected Tool Details Container */}
            {step.selected ? (
              <div>
                <div className="tool-access-list space-y-4">
                  {step.selected.tools.map((tool) => (
                    <ToolAccess key={`${tool.model.canonicalId}-${tool.access.productId ?? tool.access.modelId}`} tool={tool} />
                  ))}
                </div>

                {/* 30px Spacer Div (Hình 3) */}
                <div className="h-[30px] w-full block" />

                {step.options && (
                  <details className="text-xs text-ink-2 cursor-pointer group">
                    <summary className="list-none flex items-center gap-2 select-none outline-none">
                      <h3 className="text-xl font-semibold text-white font-sans no-underline hover:no-underline hover:text-indigo-300 hover:drop-shadow-[0_0_12px_rgba(165,180,252,0.85)] transition-all flex items-center gap-2">
                        <span>▶ Compare Alternative Tools</span>
                      </h3>
                    </summary>

                    {/* 30px Spacer Div (Hình 4) */}
                    <div className="h-[30px] w-full block" />

                    <StepOptions options={step.options} />
                  </details>
                )}
              </div>
            ) : step.step.noAIEligible ? (
              <div className="!p-6 rounded-2xl bg-[#131626] border border-white/10 space-y-2">
                <strong className="text-base font-semibold text-white block">No AI Needed</strong>
                <p className="text-sm text-ink-2 leading-relaxed">{step.step.noAIAlternative}</p>
              </div>
            ) : (
              <PartialOptions options={step.partialOptions ?? []} />
            )}
          </article>
        ))}
      </div>

      {/* 30px Spacer Div */}
      <div className="h-[30px] w-full block" />

      {/* Consolidated Subscription Stack Section (Outer Box White-Blue Gradient) */}
      <section
        className="glass-card !p-8 md:!p-10 rounded-3xl border border-indigo-200/80 shadow-2xl"
        style={{ background: "linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #dbeafe 100%)" }}
      >
        {/* Header Row */}
        <div className="space-y-2">
          <div className="eyebrow bg-indigo-950/10 border border-indigo-300/80 text-indigo-950 font-semibold">
            <span className="dt bg-indigo-600" />
            Consolidated subscription stack
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight font-sans">
            Your Optimized AI Stack
          </h2>
        </div>

        {/* 30px Spacer Div */}
        <div className="h-[30px] w-full block" />

        {subscriptions.length ? (
          <div>
            <div className="space-y-4">
              {subscriptions.map((sub) => (
                <div
                  key={sub.productId}
                  className="flex items-center justify-between !p-6 rounded-2xl bg-white/90 border border-indigo-100/90 shadow-md gap-6"
                >
                  <div className="space-y-1">
                    <strong className="text-base font-bold text-slate-900 block">{sub.productName}</strong>
                    <span className="block text-xs text-slate-600 font-medium leading-relaxed">
                      {sub.planName} • Used for {sub.stepNames.join(", ")}
                    </span>
                  </div>
                  <div className="text-right flex-none space-y-1">
                    <strong className="text-base font-bold text-slate-900 block">
                      {sub.priceUsd === null ? "Check Price" : `$${sub.priceUsd.toFixed(2)}/mo`}
                    </strong>
                    <a
                      href={sub.accessUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-xs text-indigo-600 hover:underline font-semibold"
                    >
                      View Plan &rarr;
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* 30px Spacer Div */}
            <div className="h-[30px] w-full block" />

            <div className="flex items-center justify-between !p-6 rounded-2xl bg-indigo-950 text-white shadow-lg border border-indigo-900/80 gap-6">
              <span className="font-mono text-xs font-bold text-indigo-300 uppercase tracking-wider">
                {subscriptions.length} SUBSCRIPTIONS • CONSOLIDATED STACK
              </span>
              <strong className="text-2xl font-bold text-white font-sans">
                {friendlyCost(plan.totalCostUsd)} / MONTH
              </strong>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-600 !p-6 rounded-2xl bg-white/90 border border-indigo-100">No paid AI products required for this workflow.</p>
        )}
      </section>

      {/* 20px Spacer Div */}
      <div className="h-[20px] w-full block" />

      {/* Footer Actions Row (NO divider line) */}
      <div className="flex items-center justify-between pt-4 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-none" />
          <span className="text-xs text-ink-2">
            <strong className="text-white font-semibold">Saved to your account</strong> • Access anytime from your command center dashboard.
          </span>
        </div>

        <Link className="btn-secondary text-xs px-6 py-3 rounded-full inline-flex items-center gap-2" href={`/strategy/${strategyId}/workflow`}>
          <PencilLine className="w-3.5 h-3.5" />
          <span>Edit workflow</span>
        </Link>
      </div>
    </div>
  );
}
