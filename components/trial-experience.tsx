"use client";

import { SignInButton, useAuth } from "@clerk/nextjs";
import { ArrowDown, ArrowLeft, ArrowRight, Check, ChevronDown, LoaderCircle, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { apiErrorMessage } from "@/lib/client/api-error";
import { frequencyToMonthlyUses, type Priority, type TaskAnalysis, type WorkflowStep } from "@/lib/planner/schema";
import type { StrategyPlan } from "@/lib/recommendation/types";
import { Brand } from "./brand";
import { BriefSuggestions } from "./brief-suggestions";
import { InfoTip } from "./info-tip";
import { TrialResults } from "./trial-results";
import { VisualModeToggle } from "./visual-mode-toggle";

type Frequency = "once" | "occasionally" | "monthly" | "ongoing";
type Currency = "USD" | "AUD" | "VND";
type Phase = "intro" | "parameters" | "workflow" | "processing" | "results";
type Result = { locked: boolean; usageType: "one_off" | "monthly"; plans: StrategyPlan[]; dataSnapshot: { fetchedAt: number } };

const defaultPriorities: Priority[] = ["balanced", "lowest_cost", "highest_quality", "existing_tools", "fastest", "privacy"];

const popularTools = ["ChatGPT", "Claude", "Gemini", "Perplexity", "Midjourney", "Cursor", "Canva", "Copilot"];
const loadingMessages = ["Looking at your workflow…", "Comparing AI tools…", "Checking for overlaps…", "Trimming the extras…", "Building your stack…"];

function suggestedBudgets(currency: Currency) {
  if (currency === "VND") return [25_000, 75_000, 125_000, 250_000];
  return [1, 3, 5, 10];
}

function budgetLabel(amount: number, currency: Currency) {
  if (currency === "VND") return `${amount.toLocaleString("vi-VN")} ₫`;
  return `${currency === "AUD" ? "A$" : "$"}${amount}`;
}

export function TrialExperience() {
  const { isSignedIn } = useAuth();
  const parameterRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<Phase>("intro");
  const [brief, setBrief] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("once");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [budgetChoice, setBudgetChoice] = useState("5");
  const [customBudget, setCustomBudget] = useState("");
  const [deadline, setDeadline] = useState(() => new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10));
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [otherTool, setOtherTool] = useState("");
  const [informationSensitivity, setInformationSensitivity] = useState("standard");
  const [preferredLanguage, setPreferredLanguage] = useState("English");
  const [expectedOutputs, setExpectedOutputs] = useState("");
  const [commercialUse, setCommercialUse] = useState(true);
  const [trialId, setTrialId] = useState("");
  const [trialToken, setTrialToken] = useState("");
  const [analysis, setAnalysis] = useState<TaskAnalysis | null>(null);
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pendingSave, setPendingSave] = useState(false);
  const [savedStrategyId, setSavedStrategyId] = useState("");

  const recurring = frequency === "monthly" || frequency === "ongoing";
  const budgets = useMemo(() => suggestedBudgets(currency), [currency]);

  useEffect(() => {
    const cached = sessionStorage.getItem("aissessor:trial");
    if (!cached) return;
    let frame = 0;
    try {
      const saved = JSON.parse(cached) as { trialId: string; token: string; analysis: TaskAnalysis; steps: WorkflowStep[]; result?: Result };
      if (!saved.trialId || !saved.token || !saved.analysis) return;
      frame = window.requestAnimationFrame(() => {
        setTrialId(saved.trialId); setTrialToken(saved.token); setAnalysis(saved.analysis); setSteps(saved.steps);
        if (saved.result) { setResult(saved.result); setPhase("results"); }
      });
    } catch { sessionStorage.removeItem("aissessor:trial"); }
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (phase !== "processing") return;
    const timer = window.setInterval(() => setLoadingIndex((index) => (index + 1) % loadingMessages.length), 950);
    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (!isSignedIn || !pendingSave || !result || !trialId || !trialToken || busy) return;
    void saveTrial();
    // saveTrial deliberately runs only when authentication changes after the modal closes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, pendingSave]);

  function begin() {
    setPhase("parameters");
    window.requestAnimationFrame(() => parameterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function toggleTool(tool: string) {
    setSelectedTools((current) => current.includes(tool) ? current.filter((item) => item !== tool) : [...current, tool]);
  }

  function payload() {
    const amount = Number(budgetChoice === "custom" ? customBudget : budgetChoice);
    const existingTools = [...selectedTools, otherTool.trim()].filter(Boolean);
    const optionalContext = { informationSensitivity, commercialUse, providersToAvoid: [], preferredLanguage, expectedOutputs };
    if (recurring) {
      const normalizedFrequency = frequency === "ongoing" ? "several_week" as const : "weekly" as const;
      return {
        usageType: "monthly" as const, monthlyTasks: [{ id: crypto.randomUUID(), task: brief.trim(), frequency: normalizedFrequency, monthlyUses: frequencyToMonthlyUses(normalizedFrequency), quality: "good" as const }],
        priorities: defaultPriorities, budgetAmount: amount, budgetCurrency: currency, existingTools, optionalContext,
      };
    }
    return { usageType: "one_off" as const, projectBrief: brief.trim(), deadline, budgetAmount: amount, budgetCurrency: currency, priorities: defaultPriorities, existingTools, optionalContext };
  }

  async function analyse(event: React.FormEvent) {
    event.preventDefault(); setError("");
    const amount = Number(budgetChoice === "custom" ? customBudget : budgetChoice);
    if (brief.trim().length < 20) return setError("Tell us a little more about what you want to finish.");
    if (!Number.isFinite(amount) || amount < 0) return setError("Enter a valid AI-only budget.");
    setBusy(true);
    try {
      const response = await fetch("/api/trial", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload()) });
      const body = await response.json() as { trialId?: string; token?: string; analysis?: TaskAnalysis; code?: string; userMessage?: string; error?: string };
      if (!response.ok || !body.trialId || !body.token || !body.analysis) throw new Error(apiErrorMessage(body, "We couldn't understand this project right now."));
      setTrialId(body.trialId); setTrialToken(body.token); setAnalysis(body.analysis); setSteps(body.analysis.workflowSteps); setPhase("workflow");
      sessionStorage.setItem("aissessor:trial", JSON.stringify({ trialId: body.trialId, token: body.token, analysis: body.analysis, steps: body.analysis.workflowSteps }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (reason) { setError(reason instanceof Error ? reason.message : "We couldn't understand this project right now."); }
    finally { setBusy(false); }
  }

  function changeStep(index: number, patch: Partial<WorkflowStep>) {
    setSteps((current) => current.map((step, stepIndex) => stepIndex === index ? { ...step, ...patch } : step));
  }

  function moveStep(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= steps.length) return;
    const next = [...steps]; [next[index], next[target]] = [next[target], next[index]];
    setSteps(next.map((step, order) => ({ ...step, order })));
  }

  function removeStep(index: number) { setSteps((current) => current.filter((_, stepIndex) => stepIndex !== index).map((step, order) => ({ ...step, order }))); }

  async function recommend() {
    setError(""); setBusy(true); setLoadingIndex(0); setPhase("processing"); window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      const response = await fetch(`/api/trial/${trialId}/recommend`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token: trialToken, workflowSteps: steps }) });
      const body = await response.json() as Result | { code?: string; userMessage?: string; error?: string };
      if (!response.ok || !("plans" in body)) throw new Error(apiErrorMessage(body, "We couldn't build your AI stack right now."));
      setResult(body); setPhase("results"); setPendingSave(false);
      sessionStorage.setItem("aissessor:trial", JSON.stringify({ trialId, token: trialToken, analysis, steps, result: body }));
    } catch (reason) { setError(reason instanceof Error ? reason.message : "We couldn't build your AI stack right now."); setPhase("workflow"); }
    finally { setBusy(false); }
  }

  async function saveTrial() {
    if (!isSignedIn) { setPendingSave(true); return; }
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/trial/${trialId}/save`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token: trialToken }) });
      const body = await response.json() as { strategyId?: string; code?: string; userMessage?: string; error?: string };
      if (!response.ok || !body.strategyId) throw new Error(apiErrorMessage(body, "We couldn't save your AI stack."));
      setSavedStrategyId(body.strategyId); setPendingSave(false); sessionStorage.removeItem("aissessor:trial");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "We couldn't save your AI stack."); }
    finally { setBusy(false); }
  }

  const saveControl = isSignedIn ? (
    <button type="button" className="trial-primary-button" onClick={() => void saveTrial()} disabled={busy}>{busy ? "Saving…" : "Save my AI stack"}</button>
  ) : (
    <SignInButton mode="modal"><button type="button" className="trial-primary-button" onClick={() => setPendingSave(true)}>Save my AI stack</button></SignInButton>
  );

  return (
    <main className="trial-page">
      <div className="trial-grid" aria-hidden="true" />
      <header className="trial-header"><Brand /><div className="flex items-center gap-4"><VisualModeToggle /><nav>{isSignedIn ? <Link href="/dashboard">Consultation history</Link> : <Link href="/sign-in">Sign in</Link>}</nav></div></header>

      {phase === "intro" && <section className="trial-intro"><div className="trial-intro-copy"><p className="trial-kicker"><span /> YOUR AI STACK ADVISOR</p><h1 className="trial-animated-title"><span>Find your</span><em>suitable AI.</em></h1><p className="trial-intro-body">Describe the work. Get the specific AI model for each job, the way to access it, and the real estimated cost.</p><button className="trial-primary-button trial-intro-cta" onClick={begin}>Try it for free <ArrowRight /></button><small className="trial-intro-note">No sign-up required.</small></div></section>}

      {phase === "parameters" && <section className="trial-parameters trial-enter" ref={parameterRef}><div className="trial-progress"><span className="active">1</span><i /><span>2</span><i /><span>3</span><small>Tell us → Review → Your AI stack</small></div><div className="trial-section-heading"><p>FREE AI MATCH</p><h2>Tell us what you need.</h2><span>We&apos;ll match a specific AI model to every job.</span></div>
          <form onSubmit={analyse} className="trial-form">
            <fieldset className="trial-field-wide"><legend>What are you working on? <InfoTip label="What are you working on?">Tell us about the work you want AI to help with. The more specific you are, the better we can match tools to your needs.</InfoTip></legend><textarea value={brief} onChange={(event) => setBrief(event.target.value)} placeholder="e.g. Create a brand identity, write campaign copy and generate presentation visuals for a client." minLength={20} required /><BriefSuggestions brief={brief} onApply={(text) => setBrief((current) => `${current.trim()}\n\n${text}`.trim())} /></fieldset>

            <fieldset className="trial-field-half"><legend>How often? <InfoTip label="Frequency">This helps us decide whether one-off usage, credits, or a recurring subscription gives you better value.</InfoTip></legend><div className="trial-choice-grid four">{([['once','Once'],['occasionally','Sometimes'],['monthly','Monthly'],['ongoing','Ongoing']] as Array<[Frequency,string]>).map(([id,label]) => <button type="button" aria-pressed={frequency === id} onClick={() => setFrequency(id)} key={id}>{label}</button>)}</div></fieldset>

            <fieldset className="trial-field-half"><legend>{recurring ? "Monthly AI budget" : "AI budget"} <InfoTip label="AI-only budget">{recurring ? "The maximum amount you're comfortable spending each month on AI subscriptions and expected usage." : "This is your AI-only budget for this project. It can include usage credits or temporary paid access. It is not your full client or project budget."}</InfoTip></legend><div className="trial-budget-row"><select aria-label="Currency" value={currency} onChange={(event) => { const next = event.target.value as Currency; setCurrency(next); setBudgetChoice(String(suggestedBudgets(next)[2])); }}><option value="USD">USD $</option><option value="AUD">AUD A$</option><option value="VND">VND ₫</option></select>{budgets.map((amount) => <button type="button" aria-pressed={budgetChoice === String(amount)} onClick={() => setBudgetChoice(String(amount))} key={amount}>{budgetLabel(amount, currency)}</button>)}<button type="button" aria-pressed={budgetChoice === "custom"} onClick={() => setBudgetChoice("custom")}>Custom</button></div>{budgetChoice === "custom" && <label className="trial-custom-budget"><span>{currency === "VND" ? "₫" : currency === "AUD" ? "A$" : "$"}</span><input aria-label="Exact AI budget" type="number" min="0" step="any" inputMode="decimal" value={customBudget} onChange={(event) => setCustomBudget(event.target.value)} placeholder="7.50" required /></label>}</fieldset>

            {!recurring && <fieldset className="trial-field-half"><legend>Deadline <InfoTip label="Deadline">Your deadline helps us favour a workflow and tools that can realistically finish the work on time.</InfoTip></legend><input className="trial-date" type="date" min={new Date().toISOString().slice(0, 10)} value={deadline} onChange={(event) => setDeadline(event.target.value)} required /></fieldset>}

            <fieldset className="trial-field-wide"><legend>AI products you already use <InfoTip label="Current AI tools">Add paid AI products you already use. We&apos;ll check whether they are worth keeping or overlap with something else. API marketplaces such as OpenRouter are treated only as access routes, not owned subscriptions.</InfoTip></legend><div className="trial-tool-picker">{popularTools.map((tool) => <button type="button" aria-pressed={selectedTools.includes(tool)} onClick={() => toggleTool(tool)} key={tool}>{selectedTools.includes(tool) && <Check />} {tool}</button>)}</div><div className="trial-other-tool"><input value={otherTool} onChange={(event) => setOtherTool(event.target.value)} placeholder="Other paid AI product (optional)" /></div></fieldset>

            <details className="trial-advanced"><summary>Optional details <ChevronDown /></summary><div className="trial-advanced-grid"><label><span>How sensitive is the information? <InfoTip label="Information sensitivity">This helps us avoid tools whose data handling may not suit your work.</InfoTip></span><select value={informationSensitivity} onChange={(event) => setInformationSensitivity(event.target.value)}><option value="standard">Standard work</option><option value="business">Confidential business</option><option value="sensitive">Sensitive information</option><option value="restricted">Restricted or regulated</option></select></label><label><span>Preferred output language <InfoTip label="Preferred language">We check whether tools can work well in the language your final output needs.</InfoTip></span><input value={preferredLanguage} onChange={(event) => setPreferredLanguage(event.target.value)} /></label><label className="wide"><span>What should the finished output include? <InfoTip label="Expected output">File types, quantities, dimensions, or delivery details change which tools can actually complete the job.</InfoTip></span><input value={expectedOutputs} onChange={(event) => setExpectedOutputs(event.target.value)} placeholder="e.g. 10 slides, 3 square images and a PDF summary" /></label><label className="trial-check wide"><input type="checkbox" checked={commercialUse} onChange={(event) => setCommercialUse(event.target.checked)} /><span>This work will be used commercially</span></label></div></details>

            {error && <p className="trial-error trial-field-wide" role="alert">{error}</p>}<div className="trial-form-footer trial-field-wide"><button className="trial-primary-button" disabled={busy}>{busy ? <><LoaderCircle className="spin" /> Understanding your work…</> : <>Show me the workflow <ArrowRight /></>}</button><small>You can review the steps before we recommend anything.</small></div>
          </form>
        </section>}

      {phase === "workflow" && <section className="trial-workflow"><div className="trial-progress"><span className="done"><Check /></span><i className="done" /><span className="active">2</span><i /><span>3</span><small>Tell us → Review workflow → See your stack</small></div><div className="trial-section-heading"><p>YOUR WORKFLOW</p><h1>Here&apos;s how we understood<br />your work.</h1><span>Check the steps below. They describe your project—not AI architecture.</span></div><div className="trial-workflow-list">{steps.map((step, index) => <article key={step.id}><div className="trial-step-number">{String(index + 1).padStart(2,"0")}</div><div><input aria-label={`Step ${index + 1} name`} value={step.name} onChange={(event) => changeStep(index,{name:event.target.value})} /><textarea aria-label={`Step ${index + 1} description`} value={step.plainLanguageDescription} onChange={(event) => changeStep(index,{plainLanguageDescription:event.target.value})} /></div><div className="trial-step-actions"><button type="button" onClick={() => moveStep(index,-1)} disabled={index===0} aria-label="Move step earlier"><ArrowLeft /></button><button type="button" onClick={() => moveStep(index,1)} disabled={index===steps.length-1} aria-label="Move step later"><ArrowRight /></button><button type="button" onClick={() => removeStep(index)} disabled={steps.length===1} aria-label="Remove step"><Trash2 /></button></div>{index < steps.length-1 && <ArrowDown className="trial-step-arrow" />}</article>)}</div>{error && <p className="trial-error" role="alert">{error}</p>}<div className="trial-workflow-actions"><button type="button" className="trial-secondary-button" onClick={() => { setPhase("parameters"); window.scrollTo({top:0,behavior:"smooth"}); }}><ArrowLeft /> Change answers</button><button type="button" className="trial-primary-button" onClick={() => void recommend()} disabled={busy || !steps.length}>Looks right — build my stack <Sparkles /></button></div></section>}

      {phase === "processing" && <section className="trial-processing" aria-live="polite"><div className="trial-processing-orbit"><Sparkles /><i /><i /></div><p>ANALYSING YOUR WORK</p><h1>{loadingMessages[loadingIndex]}</h1><div className="trial-loading-bar"><span key={loadingIndex} /></div><small>Using current tool, pricing, and evidence data. No artificial wait.</small></section>}

      {phase === "results" && result && <><div className="trial-progress result"><span className="done"><Check /></span><i className="done" /><span className="done"><Check /></span><i className="done" /><span className="active">3</span><small>Tell us → Review workflow → See your stack</small></div><TrialResults result={result} saveControl={saveControl} savedStrategyId={savedStrategyId} />{error && <p className="trial-error floating" role="alert">{error}</p>}</>}
    </main>
  );
}
