"use client";

import { ArrowLeft, ArrowRight, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IntegrationNotice } from "./integration-notice";
import { LoadingCounter } from "./loading-counter";
import { integrationsConfigured } from "./providers";
import { apiErrorMessage } from "@/lib/client/api-error";

type StoredStep = {
  _id: string;
  order: number;
  name: string;
  description: string;
  requirements: Record<string, unknown>;
  estimates: Record<string, unknown>;
};

type StrategyResponse = {
  strategy: { title: string; originalInput: string; status: string };
  steps: StoredStep[];
};

export function WorkflowEditor({ strategyId }: { strategyId: string }) {
  const router = useRouter();
  const [data, setData] = useState<StrategyResponse | null>(null);
  const [steps, setSteps] = useState<StoredStep[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!integrationsConfigured) return;
    fetch(`/api/strategies/${strategyId}`)
      .then(async (response) => {
        const body = (await response.json()) as StrategyResponse | { error?: string };
        if (!response.ok) throw new Error("error" in body ? body.error : "Unable to load workflow");
        return body as StrategyResponse;
      })
      .then((body) => {
        setData(body);
        setSteps(body.steps.sort((a, b) => a.order - b.order));
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Unable to load workflow"));
  }, [strategyId]);

  function change(index: number, patch: Partial<StoredStep>) {
    setSteps((current) => current.map((step, i) => (i === index ? { ...step, ...patch } : step)));
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= steps.length) return;
    const next = [...steps];
    [next[index], next[target]] = [next[target], next[index]];
    setSteps(next.map((step, i) => ({ ...step, order: i })));
  }

  function add() {
    setSteps((current) => [
      ...current,
      {
        _id: `draft-${crypto.randomUUID()}`,
        order: current.length,
        name: "New step",
        description: "Describe what should happen in this step.",
        requirements: { requiredModalities: ["text"], requiredCapabilities: [], importance: "medium", noAIEligible: false },
        estimates: { requests: 1, inputExpected: 500, outputExpected: 300 },
      },
    ]);
  }

  function remove(index: number) {
    setSteps((current) => current.filter((_, i) => i !== index).map((step, i) => ({ ...step, order: i })));
  }

  async function save() {
    const response = await fetch(`/api/strategies/${strategyId}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        steps: steps.map(({ order, name, description, requirements, estimates }) => ({
          order,
          name,
          description,
          requirements,
          estimates,
        })),
      }),
    });
    const body = (await response.json()) as { code?: string; userMessage?: string; error?: string };
    if (!response.ok) throw new Error(apiErrorMessage(body, "We couldn't save your workflow right now."));
  }

  async function handleSaveAndExit() {
    setBusy(true);
    setError("");
    try {
      await save();
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function approve() {
    setBusy(true);
    setError("");
    try {
      await save();
      const response = await fetch(`/api/strategies/${strategyId}/approve`, { method: "POST" });
      const body = (await response.json()) as { result?: unknown; code?: string; userMessage?: string; error?: string };
      if (!response.ok || !body.result) throw new Error(apiErrorMessage(body, "We couldn't generate recommendations right now."));
      sessionStorage.setItem(`benchflow:result:${strategyId}`, JSON.stringify(body.result));
      router.push(`/strategy/${strategyId}/results`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "We couldn't generate recommendations right now.");
    } finally {
      setBusy(false);
    }
  }

  if (!integrationsConfigured) return <IntegrationNotice />;
  if (error && !data) return <div className="card empty-state"><h2>Workflow unavailable</h2><p>{error}</p></div>;
  if (!data) return <div className="trial-processing" aria-live="polite"><LoadingCounter label="Understanding your work…" /></div>;

  const projectTitle = data.strategy.originalInput || data.strategy.title || "Workflow Review";

  return (
    <div className="s-compare w-full max-w-6xl mx-auto pb-6">
      {/* Header */}
      <div className="s-compare-head flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight text-center max-w-[700px] mx-auto leading-tight">
          Here&apos;s how we understand your workflow.
        </h1>
      </div>

      {/* Feature Cards Grid */}
      <div className="flex flex-wrap justify-center gap-6 w-full">
        {steps.map((step, index) => (
          <div className="feature glass-card pricing-deck-card flex flex-col justify-between p-8 w-full max-w-[320px]" key={step._id}>
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="f-num font-mono text-xs text-indigo-soft tracking-widest">
                  {String(index + 1).padStart(2, "0")}
                </div>
                {editing && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      aria-label="Move left"
                      title="Move left"
                      className="p-1 rounded-full hover:bg-white/10 text-ink-2 hover:text-white transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      aria-label="Move right"
                      title="Move right"
                      className="p-1 rounded-full hover:bg-white/10 text-ink-2 hover:text-white transition-colors"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      aria-label="Delete step"
                      title="Delete step"
                      className="p-1 rounded-full hover:bg-white/10 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {editing ? (
                <div className="space-y-6 mt-4">
                  <input
                    aria-label="Step name"
                    value={step.name}
                    onChange={(e) => change(index, { name: e.target.value })}
                    className="bg-transparent border-none outline-none p-0 text-xl font-semibold text-white mb-1 w-full focus:ring-0 focus:outline-none"
                    placeholder="Step title"
                  />
                  <textarea
                    aria-label="Step description"
                    value={step.description}
                    onChange={(event) => change(index, { description: event.target.value })}
                    className="bg-transparent border-none outline-none p-0 text-xs text-ink-2 leading-relaxed w-full min-h-[100px] resize-none focus:ring-0 focus:outline-none"
                    placeholder="Step description"
                  />
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-white mb-3">{step.name}</h3>
                  <p className="text-xs text-ink-2 leading-relaxed">{step.description}</p>
                </>
              )}
            </div>

            {editing && (
              <div className="pt-3 mt-4">
                <label className="inline-flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(step.requirements.noAIEligible)}
                    onChange={(e) => change(index, { requirements: { ...step.requirements, noAIEligible: e.target.checked } })}
                    className="cursor-pointer flex-none"
                  />
                  <span className="text-[11px] font-mono text-ink-3">Manual / No AI</span>
                </label>
              </div>
            )}
          </div>
        ))}
      </div>

      {editing && (
        <div className="flex justify-center mt-6">
          <button
            className="btn-secondary text-xs px-6 py-3 rounded-full inline-flex items-center gap-2"
            onClick={add}
          >
            <Plus className="w-4 h-4" />
            <span>Add step</span>
          </button>
        </div>
      )}

      {error && <p className="text-red-400 text-sm font-medium text-center mt-4">{error}</p>}

      {/* Centered Actions Footer */}
      <div className="trial-workflow-actions-footer">
        {editing ? (
          <>
            <button
              type="button"
              className="trial-secondary-button"
              onClick={() => {
                if (data) setSteps([...data.steps].sort((a, b) => a.order - b.order));
                setEditing(false);
              }}
              disabled={busy}
            >
              Cancel
            </button>
            <button
              type="button"
              className="trial-primary-button"
              onClick={handleSaveAndExit}
              disabled={busy}
            >
              <span>{busy ? "Saving…" : "Save workflow"}</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="trial-secondary-button"
              onClick={() => setEditing(true)}
              disabled={busy}
            >
              <Pencil className="w-4 h-4" />
              <span>Edit workflow</span>
            </button>
            <button
              type="button"
              className="trial-primary-button"
              onClick={approve}
              disabled={busy}
            >
              <span>{busy ? "Finding your AI stack…" : "Looks good — Find my AI stack"}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
