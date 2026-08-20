"use client";

import { Copy, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { frequencyToMonthlyUses, type MonthlyTask, type Priority } from "@/lib/planner/schema";
import { IntegrationNotice } from "./integration-notice";
import { priorityLabels } from "./priority-picker";
import { integrationsConfigured } from "./providers";
import { apiErrorMessage } from "@/lib/client/api-error";

const frequencyValues = [
  { value: "rarely", label: "Rarely", uses: 1 }, { value: "occasionally", label: "Occasionally", uses: 2 },
  { value: "weekly", label: "Weekly", uses: 4 }, { value: "several_week", label: "Several times a week", uses: 12 },
  { value: "daily", label: "Daily", uses: 22 },
] as const;
const qualityValues = [
  { value: "good_enough", label: "Good enough" }, { value: "good", label: "Good" },
  { value: "professional", label: "Professional" }, { value: "best", label: "Best possible" },
] as const;
const priorities: Exclude<Priority, "existing_tools">[] = ["lowest_cost", "balanced", "highest_quality", "fastest", "privacy"];
const commonTools = ["ChatGPT", "Claude", "Gemini", "Microsoft Copilot", "GitHub Copilot", "Canva"];

function createTask(task: string): MonthlyTask {
  return { id: crypto.randomUUID(), task, frequency: "weekly", monthlyUses: frequencyToMonthlyUses("weekly"), quality: "professional" };
}

export function MonthlyTaskBuilder() {
  const router = useRouter(); const [draft, setDraft] = useState(""); const [tasks, setTasks] = useState<MonthlyTask[]>([]);
  const [priority, setPriority] = useState<Exclude<Priority, "existing_tools">>("balanced");
  const [selectedTools, setSelectedTools] = useState<string[]>([]); const [customTool, setCustomTool] = useState("");
  const [sensitivity, setSensitivity] = useState("standard"); const [commercialUse, setCommercialUse] = useState(true);
  const [preferredLanguage, setPreferredLanguage] = useState("English"); const [providersToAvoid, setProvidersToAvoid] = useState("");
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  function addTask() { const value = draft.trim(); if (!value) return; setTasks((current) => [...current, createTask(value)]); setDraft(""); }
  function updateTask(id: string, patch: Partial<MonthlyTask>) { setTasks((current) => current.map((task) => task.id === id ? { ...task, ...patch } : task)); }
  function duplicateTask(task: MonthlyTask) { setTasks((current) => [...current, { ...task, id: crypto.randomUUID(), task: `${task.task} copy` }]); }
  function toggleTool(tool: string) { setSelectedTools((current) => current.includes(tool) ? current.filter((item) => item !== tool) : [...current, tool]); }
  function addCustomTool() { const value = customTool.trim(); if (!value) return; if (!selectedTools.includes(value)) setSelectedTools((current) => [...current, value]); setCustomTool(""); }
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError("");
    if (!tasks.length) return setError("Add at least one recurring task.");
    if (tasks.some((task) => task.task.trim().length < 3)) return setError("Each task needs a short description.");
    setBusy(true);
    try {
      const payload = { usageType: "monthly", monthlyTasks: tasks, priority, existingTools: selectedTools, optionalContext: { informationSensitivity: sensitivity, commercialUse, providersToAvoid: providersToAvoid.split(",").map((item) => item.trim()).filter(Boolean), preferredLanguage, expectedOutputs: "" } };
      const response = await fetch("/api/strategies", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const body = await response.json() as { strategyId?: string; result?: unknown; code?: string; userMessage?: string; error?: string };
      if (!response.ok || !body.strategyId) throw new Error(apiErrorMessage(body, "We couldn't analyze your recurring work right now. Please try again later."));
      if (!body.result) throw new Error("We couldn't generate your AI stack right now. Please try again later.");
      sessionStorage.setItem(`benchflow:result:${body.strategyId}`, JSON.stringify(body.result));
      router.push(`/strategy/${body.strategyId}/results`);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Planning failed"); } finally { setBusy(false); }
  }
  if (!integrationsConfigured) return <IntegrationNotice />;
  return <form className="monthly-builder" onSubmit={submit}><section className="card task-composer"><label htmlFor="new-task">What do you regularly use AI for?</label><div><input id="new-task" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addTask(); } }} placeholder="Create social media videos" /><button className="button button-primary" type="button" onClick={addTask}><Plus /> Add task</button></div></section><div className="task-list">{tasks.map((task, index) => { const frequencyIndex = frequencyValues.findIndex((item) => item.value === task.frequency); const qualityIndex = qualityValues.findIndex((item) => item.value === task.quality); return <article className="card monthly-task-card" key={task.id}><header><span>{index + 1}</span><input aria-label={`Task ${index + 1}`} value={task.task} onChange={(event) => updateTask(task.id, { task: event.target.value })} /><div><button type="button" title="Edit task" aria-label={`Edit ${task.task}`} onClick={() => document.querySelector<HTMLInputElement>(`[aria-label='Task ${index + 1}']`)?.focus()}><Pencil /></button><button type="button" title="Duplicate task" aria-label={`Duplicate ${task.task}`} onClick={() => duplicateTask(task)}><Copy /></button><button type="button" title="Delete task" aria-label={`Delete ${task.task}`} onClick={() => setTasks((current) => current.filter((item) => item.id !== task.id))}><Trash2 /></button></div></header><div className="task-sliders"><label><span>How often do you do this?<strong>{frequencyValues[frequencyIndex].label}</strong></span><input type="range" min="0" max="4" step="1" value={frequencyIndex} onChange={(event) => { const option = frequencyValues[Number(event.target.value)]; updateTask(task.id, { frequency: option.value, monthlyUses: option.uses }); }} /><small><i>Rarely</i><i>Daily</i></small></label><label><span>What quality do you usually need?<strong>{qualityValues[qualityIndex].label}</strong></span><input type="range" min="0" max="3" step="1" value={qualityIndex} onChange={(event) => updateTask(task.id, { quality: qualityValues[Number(event.target.value)].value })} /><small><i>Good enough</i><i>Best possible</i></small></label></div></article>; })}</div>{tasks.length > 0 && <button className="add-another" type="button" onClick={() => document.getElementById("new-task")?.focus()}><Plus /> Add another task</button>}<section className="card monthly-global"><fieldset><legend>What matters most across your workflow?</legend><div className="global-priorities">{priorities.map((value) => <label className={priority === value ? "selected" : ""} key={value}><input type="radio" name="priority" value={value} checked={priority === value} onChange={() => setPriority(value)} />{priorityLabels[value]}</label>)}</div></fieldset><fieldset><legend>Which AI tools do you already pay for?</legend><div className="tool-choices">{commonTools.map((tool) => <label className={selectedTools.includes(tool) ? "selected" : ""} key={tool}><input type="checkbox" checked={selectedTools.includes(tool)} onChange={() => toggleTool(tool)} />{tool}</label>)}</div><div className="custom-tool"><input value={customTool} onChange={(event) => setCustomTool(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addCustomTool(); } }} placeholder="Add another subscription" /><button type="button" className="button button-secondary" onClick={addCustomTool}>Add</button></div>{selectedTools.filter((tool) => !commonTools.includes(tool)).map((tool) => <button className="custom-tool-chip" type="button" onClick={() => toggleTool(tool)} key={tool}>{tool} ×</button>)}</fieldset><details className="optional-section"><summary>Optional details</summary><div className="optional-fields form-grid"><div className="field"><label>Information sensitivity</label><select value={sensitivity} onChange={(event) => setSensitivity(event.target.value)}><option value="standard">Standard work</option><option value="business">Confidential business</option><option value="sensitive">Sensitive information</option><option value="restricted">Restricted or regulated</option></select></div><div className="field"><label>Preferred language</label><input value={preferredLanguage} onChange={(event) => setPreferredLanguage(event.target.value)} /></div><div className="field full"><label>Providers to avoid</label><input value={providersToAvoid} onChange={(event) => setProvidersToAvoid(event.target.value)} placeholder="Comma-separated" /></div><label className="field full checkbox-field"><input type="checkbox" checked={commercialUse} onChange={(event) => setCommercialUse(event.target.checked)} /> Commercial use required</label></div></details>{error && <p className="error-message">{error}</p>}<div className="form-actions"><button className="button button-primary" disabled={busy || !tasks.length}>{busy ? "Finding your AI stack…" : "Find my monthly AI stack"}</button></div></section></form>;
}
