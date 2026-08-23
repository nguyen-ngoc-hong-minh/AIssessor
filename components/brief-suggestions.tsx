"use client";

import { Sparkles } from "lucide-react";
import { getBriefSuggestions } from "@/lib/planner/brief-suggestions";

export function BriefSuggestions({ brief, onApply }: { brief: string; onApply(text: string): void }) {
  const suggestions = getBriefSuggestions(brief);
  if (!suggestions.length) return null;

  return (
    <div className="mt-4 rounded-2xl border border-indigo-400/25 bg-indigo-500/[0.07] p-4" aria-live="polite">
      <div className="flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-indigo-300 mt-0.5 flex-none" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-xs font-semibold text-white">AI planning suggestions</p>
          <p className="text-[11px] text-ink-3 mt-1">Missing details detected in your brief. Click to add a prompt, then replace the brackets. No extra AI charge.</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {suggestions.map((suggestion) => (
              <button
                type="button"
                key={suggestion.id}
                onClick={() => onApply(suggestion.text)}
                className="rounded-full border border-indigo-400/30 bg-white/[0.04] px-3 py-2 text-[11px] font-medium text-indigo-100 hover:bg-indigo-400/15 hover:border-indigo-300/60 transition-colors"
                title={suggestion.text}
              >
                + {suggestion.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
