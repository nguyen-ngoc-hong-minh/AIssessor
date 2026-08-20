"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { IntegrationNotice } from "./integration-notice";
import { OptionalDetails, defaultOptionalDetails } from "./optional-details";
import { PriorityRanking, defaultPriorityRanking } from "./priority-picker";
import { integrationsConfigured } from "./providers";
import { apiErrorMessage } from "@/lib/client/api-error";
import { ArrowUpRight } from "lucide-react";

export function OneOffStrategyForm() {
  const router = useRouter();
  const [baseTime] = useState(() => Date.now());
  const [todayValue] = useState(() => new Date().toISOString().slice(0, 10));
  const [brief, setBrief] = useState("");
  const [deadline, setDeadline] = useState("");
  const [budgetChoice, setBudgetChoice] = useState("100");
  const [customBudget, setCustomBudget] = useState("");
  const [currency, setCurrency] = useState<"USD" | "AUD" | "VND">("USD");
  const [priorities, setPriorities] = useState(defaultPriorityRanking);
  const [optionalDetails, setOptionalDetails] = useState(defaultOptionalDetails);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const deadlineSummary = useMemo(() => {
    if (!deadline) return "Choose a target date";
    const days = Math.ceil((new Date(`${deadline}T23:59:59`).getTime() - baseTime) / 86_400_000);
    if (days < 0) return "Choose today or a future date";
    if (days === 0) return "Today";
    return `${days} day${days === 1 ? "" : "s"} from today`;
  }, [baseTime, deadline]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const amount = Number(budgetChoice === "custom" ? customBudget : budgetChoice);
    if (brief.trim().length < 20) return setError("Tell us a little more about the result you need.");
    if (!deadline || deadline < todayValue) return setError("Choose today or a future completion date.");
    if (!Number.isFinite(amount) || amount < 0) return setError("Enter a valid budget amount.");

    setBusy(true);
    try {
      const payload = {
        usageType: "one_off",
        projectBrief: brief.trim(),
        deadline,
        budgetAmount: amount,
        budgetCurrency: currency,
        priorities,
        existingTools: optionalDetails.existingTools.split(",").map((item) => item.trim()).filter(Boolean),
        optionalContext: {
          informationSensitivity: optionalDetails.informationSensitivity,
          commercialUse: optionalDetails.commercialUse,
          providersToAvoid: optionalDetails.providersToAvoid.split(",").map((item) => item.trim()).filter(Boolean),
          preferredLanguage: optionalDetails.preferredLanguage,
          expectedOutputs: optionalDetails.expectedOutputs,
        },
      };
      const response = await fetch("/api/strategies", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as { strategyId?: string; code?: string; userMessage?: string; error?: string };
      if (!response.ok || !body.strategyId) {
        throw new Error(apiErrorMessage(body, "We couldn't analyze your project right now. Please try again later."));
      }
      router.push(`/strategy/${body.strategyId}/workflow`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Planning failed");
    } finally {
      setBusy(false);
    }
  }

  if (!integrationsConfigured) return <IntegrationNotice />;

  return (
    <form className="editorial-card-block strategy-form-card space-y-6" onSubmit={submit}>
      {/* Section 12 — Dominant AI Input Surface */}
      <div className="styled-field full">
        <label htmlFor="project-brief" className="font-mono text-xs text-tertiary uppercase tracking-wider block mb-2">
          Tell us what you’re working on
        </label>
        <textarea
          id="project-brief"
          className="styled-textarea text-base p-5 min-h-[160px] bg-[#0C0D0F] border-white/10"
          value={brief}
          onChange={(event) => setBrief(event.target.value)}
          placeholder="Describe what you want to accomplish... (e.g. Launch a new skincare brand: market research, brand positioning, campaign visuals, and web app build)"
        />
      </div>

      {/* Section 12 — Quiet Secondary Parameters */}
      <div className="grid-2-col gap-4">
        <div className="styled-field">
          <label htmlFor="deadline" className="text-xs text-secondary font-mono uppercase tracking-wider">
            Deadline
          </label>
          <input
            id="deadline"
            type="date"
            className="styled-input bg-[#0C0D0F]"
            min={todayValue}
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
          />
          <small className="field-hint">{deadlineSummary}</small>
        </div>

        <div className="styled-field">
          <label htmlFor="currency" className="text-xs text-secondary font-mono uppercase tracking-wider">
            Currency
          </label>
          <select
            id="currency"
            className="styled-select bg-[#0C0D0F]"
            value={currency}
            onChange={(event) => setCurrency(event.target.value as typeof currency)}
          >
            <option value="USD">USD ($)</option>
            <option value="AUD">AUD (A$)</option>
            <option value="VND">VND (₫)</option>
          </select>
        </div>
      </div>

      <div className="styled-field full">
        <label className="text-xs text-secondary font-mono uppercase tracking-wider">Budget Ceiling</label>
        <div className="budget-pills-row mt-1">
          {[50, 100, 500].map((amount) => (
            <button
              type="button"
              className={`budget-pill ${budgetChoice === String(amount) ? "selected-pill" : ""}`}
              onClick={() => setBudgetChoice(String(amount))}
              key={amount}
            >
              {currency === "VND" ? amount.toLocaleString() : `${currency === "USD" ? "$" : "A$"}${amount}`}
            </button>
          ))}
          <button
            type="button"
            className={`budget-pill ${budgetChoice === "custom" ? "selected-pill" : ""}`}
            onClick={() => setBudgetChoice("custom")}
          >
            Enter exact budget
          </button>
        </div>
        {budgetChoice === "custom" && (
          <input
            aria-label="Exact budget"
            type="number"
            className="styled-input bg-[#0C0D0F] mt-3"
            min="0"
            step="any"
            value={customBudget}
            onChange={(event) => setCustomBudget(event.target.value)}
            placeholder="Enter budget amount"
          />
        )}
      </div>

      <div className="styled-field full">
        <label className="text-xs text-secondary font-mono uppercase tracking-wider">Priority Ranking</label>
        <PriorityRanking priorities={priorities} onChange={setPriorities} />
      </div>

      <OptionalDetails idPrefix="one-off" value={optionalDetails} onChange={setOptionalDetails} />

      {error && <p className="error-message">{error}</p>}

      {/* Section 12 — Primary CTA */}
      <div className="form-actions-bar">
        <button className="minimal-btn minimal-btn-dark" disabled={busy}>
          <span>{busy ? "ANALYZING PROJECT..." : "Build Strategy →"}</span>
        </button>
      </div>
    </form>
  );
}
