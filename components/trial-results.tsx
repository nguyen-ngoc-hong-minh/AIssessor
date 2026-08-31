"use client";

import { AlertTriangle, ArrowUpRight, ChevronDown, CircleDollarSign, Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { formatCurrency, formatUsdInCurrency, type SupportedCurrency } from "@/lib/currency";
import type { CandidateScore, StepRecommendation, StrategyPlan, SubscriptionSummary } from "@/lib/recommendation/types";

type TrialResult = { usageType: "one_off" | "monthly"; plans: StrategyPlan[] };
type SelectedTool = CandidateScore["tools"][number];
type TrialResultsProps = {
  result: TrialResult;
  saveControl?: ReactNode;
  savedStrategyId?: string;
  mode?: "trial" | "saved";
  beforeFooter?: ReactNode;
};

function currency(plan: StrategyPlan): SupportedCurrency {
  return plan.inputsUsed?.budgetOriginalCurrency === "VND" || plan.inputsUsed?.budgetOriginalCurrency === "AUD" ? plan.inputsUsed.budgetOriginalCurrency : "USD";
}

function money(value: number, plan: StrategyPlan) {
  return formatUsdInCurrency(value, currency(plan));
}

function budgetCap(plan: StrategyPlan) {
  if (plan.inputsUsed?.budgetOriginalAmount !== null && plan.inputsUsed?.budgetOriginalAmount !== undefined) {
    return formatCurrency(plan.inputsUsed.budgetOriginalAmount, currency(plan));
  }
  return plan.budgetUsd === null || plan.budgetUsd === undefined ? "No cap" : money(plan.budgetUsd, plan);
}

function roleFor(category: string) {
  if (category.includes("image") || category.includes("video") || category.includes("design")) return "VISUAL AI";
  if (category.includes("coding") || category.includes("development")) return "CODING AI";
  if (category.includes("research") || category.includes("analysis")) return "RESEARCH AI";
  if (category.includes("writing") || category.includes("text")) return "WRITING AI";
  if (category.includes("audio") || category.includes("speech")) return "AUDIO AI";
  return "SPECIALIST AI";
}

function subscriptionFor(tool: SelectedTool, plan: StrategyPlan): SubscriptionSummary | undefined {
  return plan.subscriptions.find((item) => item.modelNames.includes(tool.model.name));
}

function accessName(tool: SelectedTool) {
  return tool.access.productName ?? tool.model.provider;
}

function actionFor(tool: SelectedTool, plan: StrategyPlan) {
  const subscription = subscriptionFor(tool, plan);
  if (subscription?.alreadyOwned) return "KEEP";
  return tool.access.accessMethod === "product" ? "ADD" : "USE";
}

function costFor(tool: SelectedTool, plan: StrategyPlan) {
  const subscription = subscriptionFor(tool, plan);
  if (subscription?.alreadyOwned) return "Already in your setup";
  if (tool.access.accessMethod === "product") {
    return subscription?.priceUsd == null ? "Check current plan price" : `${money(subscription.priceUsd, plan)} / month`;
  }
  return `${money(tool.estimatedCostUsd, plan)} estimated usage`;
}

function ResultSummary({ plan, monthly }: { plan: StrategyPlan; monthly: boolean }) {
  const complete = plan.completeStepCount === plan.steps.length;
  const savings = plan.estimatedSavingsUsd;
  return (
    <section className="trial-result-hero" aria-labelledby="result-title">
      <div><h1 id="result-title">{complete ? "Specific AI. Specific jobs." : `${plan.completeStepCount} of ${plan.steps.length} jobs matched.`}</h1></div>
      <div className="trial-result-summary-cost"><small>KNOWN AI COST</small><strong>{money(plan.totalCostUsd, plan)}{monthly ? " / month" : ""}</strong>{savings > 0 && <span>{money(savings, plan)} potential saving</span>}</div>
    </section>
  );
}

function StepToolCard({ step, tool, plan }: { step: StepRecommendation; tool: SelectedTool; plan: StrategyPlan }) {
  const action = actionFor(tool, plan);
  const route = accessName(tool);
  const explanation = step.selected?.explanation.find((item) => item.trim()) ?? `Selected to complete ${step.step.name}.`;
  return (
    <article className="trial-tool-card">
      <div className="trial-tool-card-top"><span>{roleFor(step.taskCategory)}</span><b data-action={action}>{action}</b></div>
      <div className="trial-model-identity"><h3>{tool.model.name}</h3><p>by {tool.model.provider}{route.toLowerCase() !== tool.model.provider.toLowerCase() ? <> · access via <strong>{route}</strong></> : null}</p></div>
      <div className="trial-job-label"><small>USE THIS AI FOR</small><strong>{step.step.name}</strong><span>{step.step.plainLanguageDescription}</span></div>
      <p className="trial-tool-reason">{explanation}</p>
      <div className="trial-tool-meta"><strong>{costFor(tool, plan)}</strong><a href={tool.access.url} target="_blank" rel="noreferrer">Open {route} <ArrowUpRight /></a></div>
      <details className="trial-why"><summary>Why this model? <ChevronDown /></summary><div><p>{step.selected?.explanation.join(" ")}</p><ul><li>Specific model: {tool.model.name}</li><li>Access route: {route}</li><li>Covers: {tool.coversCapabilities.join(", ") || step.taskCategory.replaceAll("_", " ")}</li><li>Estimated usage: {money(tool.estimatedCostUsd, plan)}</li></ul></div></details>
    </article>
  );
}

function UnmatchedStepCard({ step, plan }: { step: StepRecommendation; plan: StrategyPlan }) {
  const partial = step.partialOptions[0];
  const tool = partial?.tools[0];
  const route = tool ? accessName(tool) : null;
  return (
    <article className="trial-tool-card trial-tool-card-unmatched">
      <div className="trial-tool-card-top"><span>{roleFor(step.taskCategory)}</span><b data-action={tool ? "PARTIAL" : "CHECK"}>{tool ? "PARTIAL" : "CHECK"}</b></div>
      <div className="trial-model-identity"><h3>{tool?.model.name ?? "No complete model match yet"}</h3>{tool && <p>by {tool.model.provider}{route && route.toLowerCase() !== tool.model.provider.toLowerCase() ? <> · access via <strong>{route}</strong></> : null}</p>}</div>
      <div className="trial-job-label"><small>JOB STILL TO COVER</small><strong>{step.step.name}</strong><span>{step.step.plainLanguageDescription}</span></div>
      <p className="trial-tool-reason">{partial ? `Partial candidate only: ${partial.model.name} covers ${partial.coveredCapabilities.join(", ") || "part of the requirement"}, but cannot yet be presented as a complete answer.` : "No current model passed every evidence and access check."}</p>
      {tool && <div className="trial-tool-meta"><strong>{money(tool.estimatedCostUsd, plan)} estimated usage</strong><a href={tool.access.url} target="_blank" rel="noreferrer">Open {route} <ArrowUpRight /></a></div>}
      <details className="trial-why"><summary>See what is missing <ChevronDown /></summary><div><p>{partial?.missingCapabilities.length ? partial.missingCapabilities.join(", ") : "A fully verified capability, price, privacy, or access path."}</p></div></details>
    </article>
  );
}

function NoAiStepCard({ step }: { step: StepRecommendation }) {
  return <article className="trial-tool-card trial-tool-card-no-ai"><div className="trial-tool-card-top"><span>NO AI REQUIRED</span><b data-action="KEEP">MANUAL</b></div><h3>{step.step.name}</h3><p className="trial-tool-reason">{step.step.noAIAlternative || "This step is better completed without adding another AI model."}</p></article>;
}

export function TrialResults({ result, saveControl, savedStrategyId, mode = "trial", beforeFooter }: TrialResultsProps) {
  const plan = result.plans[0];
  const monthly = result.usageType === "monthly";
  const complete = plan.completeStepCount === plan.steps.length;
  return (
    <div className="trial-results">
      <ResultSummary plan={plan} monthly={monthly} />

      <section id="ai-team" className="trial-results-section"><div className="trial-section-heading"><p>WHICH AI FOR WHAT</p><h2>Your workflow, model by model.</h2><span>Model name first. Its exact job second. Access provider stays secondary.</span></div>
        <div className="trial-tools-grid">
          {plan.steps.flatMap((step) => step.selected?.tools.map((tool) => <StepToolCard key={`${step.stepId}:${tool.model.id}`} step={step} tool={tool} plan={plan} />) ?? (step.step.noAIEligible ? [<NoAiStepCard key={step.stepId} step={step} />] : [<UnmatchedStepCard key={step.stepId} step={step} plan={plan} />]))}
        </div>
        {!complete && <div className="trial-partial-note"><AlertTriangle /><strong>No cancellation advice yet.</strong><span>{plan.steps.length - plan.completeStepCount} {plan.steps.length - plan.completeStepCount === 1 ? "job is" : "jobs are"} not fully covered, so we won&apos;t tell you to cancel anything prematurely.</span></div>}
        {complete && plan.existingSubscriptions.couldCancel.length > 0 && <div className="trial-cancel-list"><span>REVIEW POSSIBLE OVERLAP</span>{plan.existingSubscriptions.couldCancel.map((tool) => <strong key={tool}>{tool} <small>Check usage before cancelling</small></strong>)}</div>}
      </section>

      <section className="trial-bottom-line"><div><h2>{complete ? "A clear stack with clear costs." : "Known costs for the matched jobs."}</h2></div><div className="trial-money-grid">
        <div><span>Your budget cap</span><strong>{budgetCap(plan)}</strong></div>
        <div><span>{complete ? "Recommended AI cost" : "Matched AI cost"}</span><strong>{money(plan.totalCostUsd, plan)}{monthly ? " / month" : ""}</strong></div>
        <div className="highlight"><span>Budget remaining</span><strong>{plan.budgetRemainingUsd === null ? "No cap" : money(plan.budgetRemainingUsd, plan)}</strong></div>
      </div><p className="trial-cost-note"><CircleDollarSign /> Shown in {currency(plan)}, your selected currency. OpenRouter and other API marketplaces remain access routes—not owned subscriptions.</p></section>

      {beforeFooter}

      <section className="trial-save-panel"><Sparkles /><div><h2>{mode === "saved" ? "This model-by-model plan is in your history." : "Keep this model-by-model plan."}</h2></div>{mode === "saved" ? saveControl : savedStrategyId ? <Link className="trial-primary-button" href={`/strategy/${savedStrategyId}/results`}>View saved strategy</Link> : saveControl}</section>

      <section className="trial-optimise-tease"><div><h2>Check this stack again when models or prices change.</h2></div><Link href="/pricing">See Optimise <ArrowUpRight /></Link></section>

      <details className="trial-technical"><summary>Technical recommendation details <ChevronDown /></summary><div><p>Workflow coverage: {plan.completeStepCount}/{plan.steps.length} jobs</p><p>Evidence last updated: {plan.dataUpdatedAt ? new Date(plan.dataUpdatedAt).toLocaleDateString() : "Mixed source dates"}</p><p>Assumptions: {plan.assumptions.join(" ") || "No additional assumptions."}</p></div></details>
    </div>
  );
}
