"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import type { Priority } from "@/lib/planner/schema";

export const priorityLabels: Record<Priority, string> = {
  lowest_cost: "Lowest Cost",
  balanced: "Balanced",
  highest_quality: "Highest Quality",
  fastest: "Fastest Workflow",
  privacy: "Privacy",
  existing_tools: "Use Existing Tools First",
};

export const defaultPriorityRanking: Priority[] = [
  "balanced",
  "lowest_cost",
  "highest_quality",
  "fastest",
  "privacy",
  "existing_tools",
];

export function PriorityRanking({
  priorities,
  onChange,
}: {
  priorities: Priority[];
  onChange(value: Priority[]): void;
}) {
  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= priorities.length) return;
    const next = [...priorities];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {priorities.map((priority, index) => (
        <div className="flex items-center gap-3 w-full" key={priority}>
          <span className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold grid place-items-center flex-none">
            {index + 1}
          </span>
          <div className="styled-input pill-input py-2.5 flex items-center justify-between flex-1">
            <span className="text-sm font-semibold text-white">
              {priorityLabels[priority]}
            </span>
            <div className="flex items-center gap-1 flex-none">
              <button
                type="button"
                className="p-1 rounded-full hover:bg-white/10 text-ink-2 hover:text-white transition-colors"
                title="Move up"
                aria-label={`Move ${priorityLabels[priority]} up`}
                onClick={() => move(index, -1)}
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-1 rounded-full hover:bg-white/10 text-ink-2 hover:text-white transition-colors"
                title="Move down"
                aria-label={`Move ${priorityLabels[priority]} down`}
                onClick={() => move(index, 1)}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
