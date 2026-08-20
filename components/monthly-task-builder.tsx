"use client";

import { Copy, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiErrorMessage } from "@/lib/client/api-error";
import { frequencyToMonthlyUses, type MonthlyTask } from "@/lib/planner/schema";
import { IntegrationNotice } from "./integration-notice";
import { OptionalDetails, defaultOptionalDetails } from "./optional-details";
import { PriorityRanking, defaultPriorityRanking } from "./priority-picker";
import { integrationsConfigured } from "./providers";

const frequencyValues = [
  { value: "rarely", label: "Rarely", uses: 1 },
  { value: "occasionally", label: "Occasionally", uses: 2 },
  { value: "weekly", label: "Weekly", uses: 4 },
  { value: "several_week", label: "Several times a week", uses: 12 },
  { value: "daily", label: "Daily", uses: 22 },
] as const;

const qualityValues = [
  { value: "good_enough", label: "Good enough" },
  { value: "good", label: "Good" },
  { value: "professional", label: "Professional" },
  { value: "best", label: "Best possible" },
] as const;

function createTask(task: string): MonthlyTask {
  return { id: crypto.randomUUID(), task, frequency: "weekly", monthlyUses: frequencyToMonthlyUses("weekly"), quality: "professional" };
}

export function MonthlyTaskBuilder() {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [tasks, setTasks] = useState<MonthlyTask[]>([]);
  const [priorities, setPriorities] = useState(defaultPriorityRanking);
  const [optionalDetails, setOptionalDetails] = useState(defaultOptionalDetails);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function addTask() {
    const value = draft.trim();
    if (!value) return;
    setTasks((current) => [...current, createTask(value)]);
    setDraft("");
  }

  function updateTask(id: string, patch: Partial<MonthlyTask>) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, ...patch } : task));
  }

  function duplicateTask(task: MonthlyTask) {
    setTasks((current) => [...current, { ...task, id: crypto.randomUUID(), task: `${task.task} copy` }]);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!tasks.length) return setError("Add at least one recurring task.");
    if (tasks.some((task) => task.task.trim().length < 3)) return setError("Each task needs a short description.");
    setBusy(true);
    try {
      const payload = {
        usageType: "monthly",
        monthlyTasks: tasks,
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
      const response = await fetch("/api/strategies", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const body = await response.json() as { strategyId?: string; result?: unknown; code?: string; userMessage?: string; error?: string };
      if (!response.ok || !body.strategyId) throw new Error(apiErrorMessage(body, "We couldn't analyze your recurring work right now. Please try again later."));
      if (!body.result) throw new Error("We couldn't generate your AI stack right now. Please try again later.");
      sessionStorage.setItem(`benchflow:result:${body.strategyId}`, JSON.stringify(body.result));
      router.push(`/strategy/${body.strategyId}/results`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Planning failed");
    } finally {
      setBusy(false);
    }
  }

  if (!integrationsConfigured) return <IntegrationNotice />;

  return <form className="monthly-builder" onSubmit={submit}>
    <section className="card task-composer">
      <label htmlFor="new-task">What do you regularly use AI for?</label>
      <div><input id="new-task" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addTask(); } }} placeholder="Create social media videos" /><button className="button button-primary" type="button" onClick={addTask}><Plus /> Add task</button></div>
    </section>

    <div className="task-list">{tasks.map((task, index) => {
      const frequencyIndex = frequencyValues.findIndex((item) => item.value === task.frequency);
      const qualityIndex = qualityValues.findIndex((item) => item.value === task.quality);
      return <article className="card monthly-task-card" key={task.id}>
        <header><span>{index + 1}</span><input aria-label={`Task ${index + 1}`} value={task.task} onChange={(event) => updateTask(task.id, { task: event.target.value })} /><div><button type="button" title="Edit task" aria-label={`Edit ${task.task}`} onClick={() => document.querySelector<HTMLInputElement>(`[aria-label='Task ${index + 1}']`)?.focus()}><Pencil /></button><button type="button" title="Duplicate task" aria-label={`Duplicate ${task.task}`} onClick={() => duplicateTask(task)}><Copy /></button><button type="button" title="Delete task" aria-label={`Delete ${task.task}`} onClick={() => setTasks((current) => current.filter((item) => item.id !== task.id))}><Trash2 /></button></div></header>
        <div className="task-sliders"><label><span>How often do you do this?<strong>{frequencyValues[frequencyIndex].label}</strong></span><input type="range" min="0" max="4" step="1" value={frequencyIndex} onChange={(event) => { const option = frequencyValues[Number(event.target.value)]; updateTask(task.id, { frequency: option.value, monthlyUses: option.uses }); }} /><small><i>Rarely</i><i>Daily</i></small></label><label><span>What quality do you usually need?<strong>{qualityValues[qualityIndex].label}</strong></span><input type="range" min="0" max="3" step="1" value={qualityIndex} onChange={(event) => updateTask(task.id, { quality: qualityValues[Number(event.target.value)].value })} /><small><i>Good enough</i><i>Best possible</i></small></label></div>
      </article>;
    })}</div>

    {tasks.length > 0 && <button className="add-another" type="button" onClick={() => document.getElementById("new-task")?.focus()}><Plus /> Add another task</button>}

    <section className="card monthly-global">
      <div className="field full"><span>Rank your priorities</span><PriorityRanking priorities={priorities} onChange={setPriorities} /></div>
      <OptionalDetails idPrefix="monthly" value={optionalDetails} onChange={setOptionalDetails} />
      {error && <p className="error-message">{error}</p>}
      <div className="form-actions"><button className="button button-primary" disabled={busy || !tasks.length}>{busy ? "Finding your AI stack…" : "Find my monthly AI stack"}</button></div>
    </section>
  </form>;
}
