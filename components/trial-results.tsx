"use client";

import { ArrowDown, ArrowUpRight, Check, ChevronDown, CircleDollarSign, Sparkles } from "lucide-react";
import Link from "next/link";
import { formatUsdInCurrency, type SupportedCurrency } from "@/lib/currency";
import type { StrategyPlan, SubscriptionSummary } from "@/lib/recommendation/types";

type TrialResult = { usageType: "one_off" | "monthly"; plans: StrategyPlan[] };

function currency(plan: StrategyPlan): SupportedCurrency {
  return plan.inputsUsed.budgetOriginalCurrency === "VND" || plan.inputsUsed.budgetOriginalCurrency === "AUD" ? plan.inputsUsed.budgetOriginalCurrency : "USD";
}

function money(value: number, plan: StrategyPlan) {
  return formatUsdInCurrency(value, currency(plan));
}

function roleFor(subscription: SubscriptionSummary, plan: StrategyPlan) {
  const categories = plan.steps.filter((step) => subscription.stepIds.includes(step.stepId)).map((step) => step.taskCategory);
  if (categories.some((value) => value.includes("image") || value.includes("video") || value.includes("design"))) return "THE VISUAL SPECIALIST";
  if (categories.some((value) => value.includes("coding") || value.includes("development"))) return "THE CODING PARTNER";
  if (categories.some((value) => value.includes("research") || value.includes("analysis"))) return "THE RESEARCHER";
  if (categories.some((value) => value.includes("writing") || value.includes("text"))) return "THE WRITING PARTNER";
  return subscription.stepIds.length > 1 ? "THE ALL-ROUNDER" : "THE SPECIALIST";
}

function ResultHero({ plan, monthly }: { plan: StrategyPlan; monthly: boolean }) {
  const savings = plan.estimatedSavingsUsd;
  const complete = plan.completeStepCount === plan.steps.length;
  const allOwned = plan.subscriptions.length > 0 && plan.subscriptions.every((item) => item.alreadyOwned);
  const alreadyLean = plan.existingSubscriptions.couldCancel.length === 0 && allOwned;
  if (!complete) return (
    <section className="trial-result-hero" aria-labelledby="result-title">
      <p>WE FOUND A PARTIAL MATCH</p><h1 id="result-title">{plan.completeStepCount} of {plan.steps.length} steps<br /><em>covered confidently.</em></h1>
      <p className="trial-result-subcopy">We&apos;ll show what fits now—and clearly flag what still needs another option or human review.</p><a href="#ai-team">See the matched tools <ArrowDown /></a>
    </section>
  );
  if (savings > 0) return (
    <section className="trial-result-hero" aria-labelledby="result-title">
      <p>YOUR AI STACK IS READY</p><h1 id="result-title">You could save<br /><em>{money(savings, plan)}{monthly ? " / month" : ""}</em></h1>
      <div className="trial-cost-shift"><span>{money(plan.totalCostUsd + savings, plan)}</span><ArrowDown /><strong>{money(plan.totalCostUsd, plan)}</strong></div>
      <p className="trial-result-subcopy">Same work. Fewer unnecessary costs.</p><a href="#ai-team">Meet your AI stack <ArrowDown /></a>
    </section>
  );
  if (alreadyLean) return (
    <section className="trial-result-hero" aria-labelledby="result-title">
      <p>YOU&apos;RE ALREADY LEAN</p><h1 id="result-title">Your current setup<br /><em>fits your work.</em></h1>
      <p className="trial-result-subcopy">No unnecessary subscriptions were found in the tools you listed.</p><a href="#ai-team">Meet your AI stack <ArrowDown /></a>
    </section>
  );
  return (
    <section className="trial-result-hero" aria-labelledby="result-title">
      <p>{plan.totalCostUsd > 0 ? "A SMALL UPGRADE COULD GO A LONG WAY" : "YOUR AI STACK IS READY"}</p>
      <h1 id="result-title">{plan.totalCostUsd > 0 ? <>A better-fit stack for<br /><em>{money(plan.totalCostUsd, plan)}{monthly ? " / month" : ""}</em></> : <>The right tools.<br /><em>No extra cost.</em></>}</h1>
      <p className="trial-result-subcopy">Built around the work you described—not a generic model ranking.</p><a href="#ai-team">Meet your AI stack <ArrowDown /></a>
    </section>
  );
}

function ToolCard({ subscription, plan }: { subscription: SubscriptionSummary; plan: StrategyPlan }) {
  const action = subscription.alreadyOwned ? "KEEP" : "ADD";
  const relatedSteps = plan.steps.filter((step) => subscription.stepIds.includes(step.stepId));
  const reasons = relatedSteps.flatMap((step) => step.selected?.explanation ?? []).slice(0, 3);
  const cost = subscription.alreadyOwned ? "Already in your setup" : subscription.accessMethod === "product"
    ? subscription.priceUsd === null ? "Price needs checking" : `${money(subscription.priceUsd, plan)} / month`
    : `${money(subscription.apiUsageEstimateUsd, plan)} estimated usage`;
  return (
    <article className="trial-tool-card">
      <div className="trial-tool-card-top"><span>{roleFor(subscription, plan)}</span><b data-action={action}>{action}</b></div>
      <h3>{subscription.productName}</h3><p className="trial-tool-plan">{subscription.planName}</p>
      <div className="trial-job-chips">{subscription.stepNames.slice(0, 4).map((name) => <span key={name}>{name}</span>)}</div>
      <p className="trial-tool-reason">{subscription.alreadyOwned ? "This tool already covers an important part of your workflow, so it earns its place." : "Your current tools do not fully cover this job, so this is the smallest useful addition."}</p>
      <strong className="trial-tool-cost">{cost}</strong>
      <details className="trial-why"><summary>Why this? <ChevronDown /></summary><div><p>{reasons.join(" ") || `This option covers ${subscription.stepNames.join(", ")} within the requirements you gave us.`}</p><details><summary>See technical details</summary><ul><li>Models: {subscription.modelNames.join(", ")}</li><li>Access: {subscription.accessMethod}</li><li>Estimated AI usage: {money(subscription.apiUsageEstimateUsd, plan)}</li></ul></details></div></details>
      <a className="trial-provider-link" href={subscription.accessUrl} target="_blank" rel="noreferrer">View provider <ArrowUpRight /></a>
    </article>
  );
}

function CancelCard({ tool }: { tool: string }) {
  return (
    <article className="trial-tool-card trial-tool-card-cancel">
      <div className="trial-tool-card-top"><span>YOU MAY NOT NEED THIS</span><b data-action="CANCEL">CANCEL</b></div>
      <h3>{tool}</h3><p className="trial-tool-reason">This tool is not needed by the recommended workflow. Check whether you use it for anything else before cancelling.</p>
      <strong className="trial-tool-cost">Potential saving depends on your current plan</strong>
      <details className="trial-why"><summary>Why this? <ChevronDown /></summary><div><p>None of the workflow steps selected this product after fit, overlap, and cost were considered.</p></div></details>
    </article>
  );
}

export function TrialResults({ result, saveControl, savedStrategyId }: { result: TrialResult; saveControl: React.ReactNode; savedStrategyId?: string }) {
  const plan = result.plans[0];
  const monthly = result.usageType === "monthly";
  const savings = plan.estimatedSavingsUsd;
  const current = plan.totalCostUsd + savings;
  const annual = monthly ? savings * 12 : savings;
  const complete = plan.completeStepCount === plan.steps.length;
  return (
    <div className="trial-results">
      <ResultHero plan={plan} monthly={monthly} />
      <section id="ai-team" className="trial-results-section"><div className="trial-section-heading"><p>MEET YOUR AI TEAM</p><h2>Every tool has a job.<br />Here&apos;s who made the cut.</h2></div>
        <div className="trial-tools-grid">
          {plan.subscriptions.map((subscription) => <ToolCard key={subscription.productId} subscription={subscription} plan={plan} />)}
          {complete && plan.existingSubscriptions.couldCancel.map((tool) => <CancelCard key={tool} tool={tool} />)}
          {!plan.subscriptions.length && !plan.existingSubscriptions.couldCancel.length && <div className="trial-empty-result"><Check /><h3>No paid AI tool is required</h3><p>Your workflow can be completed without adding a paid subscription based on the evidence available.</p></div>}
        </div>
        {!complete && <div className="trial-partial-note"><strong>No cancellation advice yet.</strong><span>Because {plan.steps.length - plan.completeStepCount} workflow {plan.steps.length - plan.completeStepCount === 1 ? "step is" : "steps are"} not fully covered, we won&apos;t tell you to cancel an existing tool prematurely.</span></div>}
      </section>

      <section className="trial-bottom-line"><p>HERE&apos;S THE BOTTOM LINE</p><h2>Clear costs. No token maths required.</h2><div className="trial-money-grid">
        <div><span>Current setup</span><strong>{savings > 0 ? money(current, plan) : "Not provided"}{monthly && savings > 0 ? " / month" : ""}</strong></div>
        <div><span>{complete ? "Recommended setup" : "Known matched cost"}</span><strong>{money(plan.totalCostUsd, plan)}{monthly ? " / month" : ""}</strong></div>
        <div className="highlight"><span>{savings > 0 ? "You keep" : "Budget remaining"}</span><strong>{savings > 0 ? money(savings, plan) : plan.budgetRemainingUsd === null ? "No cap" : money(plan.budgetRemainingUsd, plan)}{monthly && savings > 0 ? " / month" : ""}</strong></div>
        {savings > 0 && <div><span>{monthly ? "That's" : "Estimated project saving"}</span><strong>{money(annual, plan)}{monthly ? " / year" : ""}</strong></div>}
      </div><p className="trial-cost-note"><CircleDollarSign /> Costs use the currency and AI-only budget you selected. Unverified prices are never treated as free.</p></section>

      <section className="trial-save-panel"><Sparkles /><div><p>SAVE YOUR RESULT</p><h2>Keep this AI stack for later.</h2><span>Your free result stays visible. Sign in is only needed to add it to consultation history.</span></div>{savedStrategyId ? <Link className="trial-primary-button" href={`/strategy/${savedStrategyId}/results`}>View saved strategy</Link> : saveControl}</section>

      <section className="trial-optimise-tease"><div><p>YOUR STACK WON&apos;T STAY OPTIMAL FOREVER</p><h2>AI tools and prices change quickly.</h2><span>Optimise adds monthly stack checks, overlap alerts, new-tool recommendations, and saved recurring workflows.</span></div><Link href="/pricing">See Optimise <ArrowUpRight /></Link></section>

      <details className="trial-technical"><summary>Optional recommendation details <ChevronDown /></summary><div><p>Workflow coverage: {plan.completeStepCount}/{plan.steps.length} steps</p><p>Evidence last updated: {plan.dataUpdatedAt ? new Date(plan.dataUpdatedAt).toLocaleDateString() : "Mixed source dates"}</p><p>Assumptions: {plan.assumptions.join(" ") || "No additional assumptions."}</p></div></details>
    </div>
  );
}
