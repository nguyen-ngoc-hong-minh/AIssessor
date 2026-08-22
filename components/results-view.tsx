"use client";

import { ArrowUpRight, DatabaseZap, PencilLine, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiErrorMessage } from "@/lib/client/api-error";
import { formatCurrency, formatUsdInCurrency, usdExchangeRate, usdToCurrency, type SupportedCurrency } from "@/lib/currency";
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
type Plan = { variant: string; steps: Step[]; fixedCostUsd: number; apiCostUsd: number; totalCostUsd: number; estimatedSavingsUsd: number; existingSubscriptions: { kept: string[]; couldCancel: string[] }; subscriptions: Subscription[]; uniqueProductCount: number; completeStepCount: number; budgetUsd?: number | null; overBudgetUsd?: number; hasUnknownSubscriptionPricing?: boolean; budgetCompatible?: boolean; budgetRemainingUsd?: number | null; inputsUsed?: { projectDescription: string | null; expectedResult: string | null; budgetUsd: number | null; budgetOriginalAmount: number | null; budgetOriginalCurrency: string | null; deadline: string | null; priorityRanking: string[]; existingTools: string[]; informationSensitivity: string; commercialUse: boolean; providersToAvoid: string[]; preferredLanguage: string; expectedOutputs: string | null; region: string }; assumptions: string[]; dataUpdatedAt: number | null };
type SnapshotSource = { source: string; sourceUrl?: string; attribution?: string; fetchedAt: number; sourceVersion?: string };
type Result = { locked: boolean; usageType: "one_off" | "monthly"; estimatedCompletionTime?: string; plans: Plan[]; dataSnapshot: { fetchedAt: number; sources?: SnapshotSource[] } };

const optionEntries: Array<[keyof Options, string]> = [["bestFit", "Best fit"], ["budget", "Budget"], ["premium", "Higher quality"], ["fastest", "Fastest"], ["privacy", "Privacy focused"]];

function humanize(value: string) { return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function preferredCurrency(inputs: Plan["inputsUsed"]): SupportedCurrency {
  return inputs?.budgetOriginalCurrency === "VND" || inputs?.budgetOriginalCurrency === "AUD" ? inputs.budgetOriginalCurrency : "USD";
}
function friendlyCost(value: number, inputs?: Plan["inputsUsed"]) {
  if (value === 0) return "No extra cost";
  const currency = preferredCurrency(inputs);
  if (currency === "USD" && value < 0.01) return "Less than $0.01";
  return formatUsdInCurrency(value, currency);
}
function candidateName(candidate: Selected | null) {
  if (!candidate) return "Not available";
  if (candidate.kind === "combination") return `${candidate.tools.length}-tool combination`;
  return candidate.model.name;
}

function originalBudgetLabel(inputs: Plan["inputsUsed"]) {
  if (inputs?.budgetOriginalAmount === null || inputs?.budgetOriginalAmount === undefined || !inputs.budgetOriginalCurrency) return null;
  const currency = preferredCurrency(inputs);
  return formatCurrency(inputs.budgetOriginalAmount, currency);
}

function budgetRemainingLabel(plan: Plan) {
  const inputs = plan.inputsUsed;
  if (inputs?.budgetOriginalAmount !== null && inputs?.budgetOriginalAmount !== undefined && inputs.budgetOriginalCurrency) {
    return formatCurrency(Math.max(0, inputs.budgetOriginalAmount - usdToCurrency(plan.totalCostUsd, preferredCurrency(inputs))), preferredCurrency(inputs));
  }
  return plan.budgetRemainingUsd !== null && plan.budgetRemainingUsd !== undefined ? friendlyCost(plan.budgetRemainingUsd, inputs) : "Not applicable";
}

function exchangeRateLabel(inputs: Plan["inputsUsed"]) {
  const currency = preferredCurrency(inputs);
  if (currency === "USD") return null;
  return `Provider prices are normalized in USD, then displayed in ${currency} at 1 USD ≈ ${formatCurrency(usdExchangeRate(currency), currency)}.`;
}

function hasBudgetExclusion(step: Step) {
  return step.exclusions.some((exclusion) => exclusion.reasons.some((reason) => /budget|price|subscription cost|afford/i.test(reason)));
}

function StepOptions({ options, inputs }: { options: Options; inputs?: Plan["inputsUsed"] }) {
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
                <span className="font-medium text-white/80">{friendlyCost(candidate.estimatedCostUsd, inputs)}</span>
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

function ToolAccess({ tool, inputs }: { tool: Tool; inputs?: Plan["inputsUsed"] }) {
  const productName = tool.access.productName ?? tool.model.provider;
  const planName = tool.access.planName ?? (tool.access.accessMethod === "api" ? "Usage based API" : "Standard access");
  const accessCost = tool.access.accessMethod === "product"
    ? tool.access.monthlyPriceUsd === undefined ? "Current plan price not verified" : `${friendlyCost(tool.access.monthlyPriceUsd, inputs)} / month`
    : `${friendlyCost(tool.estimatedCostUsd, inputs)} estimated usage`;

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
          <small className="block text-[11px] font-mono text-ink-3 pt-0.5">{accessCost}</small>
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
    <div className="partial-options !p-6 md:!p-7 rounded-2xl bg-[#131626] border border-white/10 my-4 w-full flex flex-col gap-[30px]">
      <div className="flex flex-col gap-[10px]">
        <h3 className="text-xl font-semibold text-white font-sans tracking-tight">
          {options.length ? "Partial Options Available" : "No Complete AI Match Yet"}
        </h3>
        <p className="text-xs text-ink-2 leading-relaxed">
          We&apos;re checking whether a combination of AI tools can cover this step.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {options.map((option, index) => (
          <div
            key={option.model.canonicalId}
            className="feature glass-card !p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-3 shadow-md w-full"
          >
            <div>
              <div className="f-num text-[10px] font-mono font-bold text-indigo-soft tracking-widest uppercase mb-2">
                PARTIAL {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="text-base font-semibold text-white tracking-tight leading-snug line-clamp-2">
                {option.model.name}
              </h3>
            </div>
            <div className="pt-2 flex flex-col gap-2 text-xs text-ink-2">
              <span className="font-mono text-[10px] text-ink-3 leading-relaxed whitespace-normal break-words">
                Covers: {option.coveredCapabilities.map(humanize).join(", ") || "Partial"}
              </span>
              <a
                href={option.tools[0]?.access.url ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="f-link text-indigo-soft hover:underline font-mono text-[11px] inline-flex items-center gap-1 self-start"
              >
                <span>View</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ResultsView({ strategyId }: { strategyId: string }) {
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [tab] = useState("recommended");
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
  const inputs = plan.inputsUsed;
  const budgetConfigured = plan.budgetUsd !== null && plan.budgetUsd !== undefined;
  const originalBudget = originalBudgetLabel(inputs);
  const rateNote = exchangeRateLabel(inputs);
  const costPeriod = result.usageType === "monthly" ? "Estimated monthly total" : "First-month project total";
  const completeCoverage = plan.steps.length > 0 && plan.completeStepCount === plan.steps.length;
  const withinKnownBudget = !budgetConfigured || (!plan.hasUnknownSubscriptionPricing && plan.totalCostUsd <= plan.budgetUsd! + 0.0001);
  const budgetStatus = !budgetConfigured
    ? "NO BUDGET CAP"
    : !withinKnownBudget
      ? "BUDGET NOT MET"
      : completeCoverage
        ? "COMPLETE · WITHIN BUDGET"
        : "PARTIAL · WITHIN BUDGET";

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

      {/* Budget & Input Check Glass Card */}
      <section className="glass-card !p-8 md:!p-10 rounded-3xl border border-white/10 relative shadow-xl overflow-hidden" aria-label="Requirements used for this recommendation">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="eyebrow">
            <span className="dt" />
            YOUR REQUIREMENTS WERE APPLIED
          </div>
          <div className="eyebrow bg-[#131626] border border-indigo-400/50 shadow-md">
            <span className="dt" />
            <span>{budgetStatus}</span>
          </div>
        </div>

        {/* 20px Spacer Div */}
        <div className="h-[20px] w-full block" />

        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight leading-snug font-sans">Budget and input check</h2>
          <p className="text-sm md:text-base text-ink-2 leading-relaxed max-w-3xl">The budget is a hard cap across the complete stack. Smaller budgets favor value; larger budgets give stronger verified models more weight when the quality gain is worthwhile.</p>
        </div>

        {/* 30px Spacer Div */}
        <div className="h-[30px] w-full block" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <div className="feature glass-card !p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-2 shadow-md">
            <span className="font-mono text-[10px] font-bold text-indigo-soft uppercase tracking-wider block">Your budget cap</span>
            <strong className="text-xl md:text-2xl font-bold text-white font-sans block">{originalBudget ?? (budgetConfigured ? friendlyCost(plan.budgetUsd!, inputs) : "Not set")}</strong>
          </div>
          <div className="feature glass-card !p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-2 shadow-md">
            <span className="font-mono text-[10px] font-bold text-indigo-soft uppercase tracking-wider block">Projected total</span>
            <strong className="text-xl md:text-2xl font-bold text-white font-sans block">{friendlyCost(plan.totalCostUsd, inputs)}</strong>
          </div>
          <div className="feature glass-card !p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-2 shadow-md">
            <span className="font-mono text-[10px] font-bold text-indigo-soft uppercase tracking-wider block">Budget remaining</span>
            <strong className="text-xl md:text-2xl font-bold text-white font-sans block">{budgetConfigured ? budgetRemainingLabel(plan) : "Not applicable"}</strong>
          </div>
          <div className="feature glass-card !p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-2 shadow-md">
            <span className="font-mono text-[10px] font-bold text-indigo-soft uppercase tracking-wider block">Workflow coverage</span>
            <strong className="text-xl md:text-2xl font-bold text-white font-sans block">{plan.completeStepCount}/{plan.steps.length} steps</strong>
          </div>
        </div>

        {rateNote && <p className="text-xs text-ink-3 leading-relaxed pt-3">{rateNote} The remaining balance is calculated in your selected currency, so the displayed subtraction stays consistent.</p>}

        {inputs && (
          <div className="pt-4">
            {/* 30px Spacer Div */}
            <div className="h-[30px] w-full block" />

            <details className="text-xs text-ink-2 cursor-pointer group">
              <summary className="list-none flex items-center gap-2 select-none outline-none">
                <h3 className="text-xl font-semibold text-white font-sans no-underline hover:no-underline hover:text-indigo-300 hover:drop-shadow-[0_0_12px_rgba(165,180,252,0.85)] transition-all flex items-center gap-2">
                  <span>▶ View every input used</span>
                </h3>
              </summary>

              {/* 20px Spacer Div */}
              <div className="h-[20px] w-full block" />

              <div className="mt-2 !p-6 rounded-2xl bg-[#0e111d] border border-white/10 shadow-inner grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                <p><strong className="text-white font-semibold">Project:</strong> {inputs.projectDescription ?? "Saved project brief"}</p>
                <p><strong className="text-white font-semibold">Expected result:</strong> {inputs.expectedResult ?? "Defined by the approved workflow"}</p>
                <p><strong className="text-white font-semibold">Priority order:</strong> {inputs.priorityRanking.map(humanize).join(" → ")}</p>
                <p><strong className="text-white font-semibold">Deadline:</strong> {inputs.deadline ?? "No deadline"}</p>
                <p><strong className="text-white font-semibold">Language:</strong> {inputs.preferredLanguage}</p>
                <p><strong className="text-white font-semibold">Information sensitivity:</strong> {humanize(inputs.informationSensitivity)}</p>
                <p><strong className="text-white font-semibold">Commercial use:</strong> {inputs.commercialUse ? "Required" : "Not required"}</p>
                <p><strong className="text-white font-semibold">Existing tools:</strong> {inputs.existingTools.join(", ") || "None provided"}</p>
                <p><strong className="text-white font-semibold">Providers avoided:</strong> {inputs.providersToAvoid.join(", ") || "None"}</p>
                <p><strong className="text-white font-semibold">Region:</strong> {inputs.region}</p>
                <p className="md:col-span-2"><strong className="text-white font-semibold">Expected outputs:</strong> {inputs.expectedOutputs ?? "Defined by the approved workflow"}</p>
              </div>
            </details>
          </div>
        )}
      </section>

      {/* 30px Spacer Div */}
      <div className="h-[30px] w-full block" />

      {/* Workflow Steps Roadmap Cards (20px gap between blocks, 32px padding inside each card) */}
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
                  <strong className="text-2xl font-bold text-white font-sans">{friendlyCost(step.selected.estimatedCostUsd, inputs)}</strong>
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
                    <ToolAccess key={`${tool.model.canonicalId}-${tool.access.productId ?? tool.access.modelId}`} tool={tool} inputs={inputs} />
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

                    <StepOptions options={step.options} inputs={inputs} />
                  </details>
                )}
              </div>
            ) : step.step.noAIEligible ? (
              <div className="!p-6 rounded-2xl bg-[#131626] border border-white/10 space-y-2">
                <strong className="text-base font-semibold text-white block">No AI Needed</strong>
                <p className="text-sm text-ink-2 leading-relaxed">{step.step.noAIAlternative}</p>
              </div>
            ) : (
              <div>
                <PartialOptions options={step.partialOptions ?? []} />
                <p className="text-xs text-amber-300 mt-4">
                  {budgetConfigured && hasBudgetExclusion(step)
                    ? `No verified complete option for this step fits the total ${originalBudget ?? friendlyCost(plan.budgetUsd!, inputs)} budget with the other workflow steps.`
                    : "No verified complete option currently satisfies every capability and evidence requirement for this step."}
                </p>
              </div>
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
        <div>
          <div className="eyebrow bg-indigo-900/25 border border-indigo-900/40 text-[#1e1b4b] font-bold shadow-sm">
            <span className="dt bg-indigo-900" />
            Consolidated subscription stack
          </div>

          {/* 30px Spacer Div right below eyebrow */}
          <div className="h-[30px] w-full block" />

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
                      {sub.accessMethod === "product"
                        ? sub.priceUsd === null ? "Price not verified" : `${friendlyCost(sub.priceUsd, inputs)}/mo`
                        : `${friendlyCost(sub.apiUsageEstimateUsd, inputs)} usage`}
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
                {friendlyCost(plan.totalCostUsd, inputs)} / MONTH
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
