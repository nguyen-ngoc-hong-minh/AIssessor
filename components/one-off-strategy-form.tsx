"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Priority } from "@/lib/planner/schema";
import { IntegrationNotice } from "./integration-notice";
import { PriorityRanking } from "./priority-picker";
import { integrationsConfigured } from "./providers";
import { apiErrorMessage } from "@/lib/client/api-error";

const initialPriorities: Priority[] = ["balanced", "lowest_cost", "highest_quality", "fastest", "privacy", "existing_tools"];
export function OneOffStrategyForm() {
  const router = useRouter();
  const [baseTime] = useState(() => Date.now()); const [todayValue] = useState(() => new Date().toISOString().slice(0, 10));
  const [brief, setBrief] = useState(""); const [deadline, setDeadline] = useState("");
  const [budgetChoice, setBudgetChoice] = useState("100"); const [customBudget, setCustomBudget] = useState(""); const [currency, setCurrency] = useState<"USD" | "AUD" | "VND">("USD");
  const [priorities, setPriorities] = useState(initialPriorities); const [existingTools, setExistingTools] = useState("");
  const [sensitivity, setSensitivity] = useState("standard"); const [commercialUse, setCommercialUse] = useState(true);
  const [preferredLanguage, setPreferredLanguage] = useState("English"); const [providersToAvoid, setProvidersToAvoid] = useState("");
  const [expectedOutputs, setExpectedOutputs] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const deadlineSummary = useMemo(() => {
    if (!deadline) return "Choose a target date";
    const days = Math.ceil((new Date(`${deadline}T23:59:59`).getTime() - baseTime) / 86_400_000);
    if (days < 0) return "Choose today or a future date";
    if (days === 0) return "Today";
    return `${days} day${days === 1 ? "" : "s"} from today`;
  }, [baseTime, deadline]);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError("");
    const amount = Number(budgetChoice === "custom" ? customBudget : budgetChoice);
    if (brief.trim().length < 20) return setError("Tell us a little more about the result you need.");
    if (!deadline || deadline < todayValue) return setError("Choose today or a future completion date.");
    if (!Number.isFinite(amount) || amount < 0) return setError("Enter a valid budget amount.");
    setBusy(true);
    try {
      const payload = { usageType: "one_off", projectBrief: brief.trim(), deadline, budgetAmount: amount, budgetCurrency: currency, priorities, existingTools: existingTools.split(",").map((item) => item.trim()).filter(Boolean), optionalContext: { informationSensitivity: sensitivity, commercialUse, providersToAvoid: providersToAvoid.split(",").map((item) => item.trim()).filter(Boolean), preferredLanguage, expectedOutputs } };
      const response = await fetch("/api/strategies", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const body = await response.json() as { strategyId?: string; code?: string; userMessage?: string; error?: string };
      if (!response.ok || !body.strategyId) throw new Error(apiErrorMessage(body, "We couldn't analyze your project right now. Please try again later."));
      router.push(`/strategy/${body.strategyId}/workflow`);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Planning failed"); } finally { setBusy(false); }
  }
  if (!integrationsConfigured) return <IntegrationNotice />;
  return <form className="card form-card strategy-form" onSubmit={submit}><div className="form-grid"><div className="field full"><label htmlFor="project-brief">Tell us what you’re working on</label><textarea id="project-brief" value={brief} onChange={(event) => setBrief(event.target.value)} placeholder="Create a 60-second financial report video for Vinamilk using its latest annual report. The video should include data visualizations, Vietnamese voice-over, and a professional corporate style." /><small>Describe the final result you need. You can write naturally — we’ll break it into the required AI workflow.</small></div><div className="field"><label htmlFor="deadline">Deadline</label><input id="deadline" type="date" min={todayValue} value={deadline} onChange={(event) => setDeadline(event.target.value)} /><small className="date-summary">{deadlineSummary}</small></div><div className="field"><label htmlFor="currency">Currency</label><select id="currency" value={currency} onChange={(event) => setCurrency(event.target.value as typeof currency)}><option>USD</option><option>AUD</option><option>VND</option></select></div><div className="field full"><span>Budget</span><div className="budget-options">{[50, 100, 500].map((amount) => <button type="button" className={budgetChoice === String(amount) ? "selected" : ""} onClick={() => setBudgetChoice(String(amount))} key={amount}>{currency === "VND" ? amount.toLocaleString() : `${currency === "USD" ? "$" : "A$"}${amount}`}</button>)}<button type="button" className={budgetChoice === "custom" ? "selected" : ""} onClick={() => setBudgetChoice("custom")}>Enter exact budget</button></div>{budgetChoice === "custom" && <input aria-label="Exact budget" type="number" min="0" step="any" value={customBudget} onChange={(event) => setCustomBudget(event.target.value)} placeholder="Enter amount" />}</div><div className="field full"><span>Rank your priorities</span><PriorityRanking priorities={priorities} onChange={setPriorities} /></div></div><details className="optional-section"><summary>Optional details</summary><div className="optional-fields form-grid"><div className="field"><label>Information sensitivity</label><select value={sensitivity} onChange={(event) => setSensitivity(event.target.value)}><option value="standard">Standard work</option><option value="business">Confidential business</option><option value="sensitive">Sensitive information</option><option value="restricted">Restricted or regulated</option></select></div><div className="field"><label>Preferred language</label><input value={preferredLanguage} onChange={(event) => setPreferredLanguage(event.target.value)} /></div><div className="field"><label>Tools already owned</label><input value={existingTools} onChange={(event) => setExistingTools(event.target.value)} placeholder="ChatGPT, Canva" /></div><div className="field"><label>Providers to avoid</label><input value={providersToAvoid} onChange={(event) => setProvidersToAvoid(event.target.value)} placeholder="Comma-separated" /></div><div className="field full"><label>Expected output details</label><input value={expectedOutputs} onChange={(event) => setExpectedOutputs(event.target.value)} placeholder="Optional quantities or file formats" /></div><label className="field full checkbox-field"><input type="checkbox" checked={commercialUse} onChange={(event) => setCommercialUse(event.target.checked)} /> Commercial use required</label></div></details>{error && <p className="error-message">{error}</p>}<div className="form-actions"><button className="button button-primary" disabled={busy}>{busy ? "Analysing the project…" : "Create editable workflow"}</button></div></form>;
}
