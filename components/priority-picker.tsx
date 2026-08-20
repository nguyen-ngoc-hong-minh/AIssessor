"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import type { Priority } from "@/lib/planner/schema";

export const priorityLabels: Record<Priority, string> = {
  lowest_cost: "Lowest Cost", balanced: "Balanced", highest_quality: "Highest Quality",
  fastest: "Fastest Workflow", privacy: "Privacy", existing_tools: "Use Existing Tools First",
};

export const defaultPriorityRanking: Priority[] = ["balanced", "lowest_cost", "highest_quality", "fastest", "privacy", "existing_tools"];

export function PriorityRanking({ priorities, onChange }: { priorities: Priority[]; onChange(value: Priority[]): void }) {
  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= priorities.length) return;
    const next = [...priorities];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }
  return <div className="priority-rank">{priorities.map((priority, index) => <div className="priority-item" key={priority}><span>{index + 1}</span><strong>{priorityLabels[priority]}</strong><div><button type="button" title="Move up" aria-label={`Move ${priorityLabels[priority]} up`} onClick={() => move(index, -1)}><ChevronUp /></button><button type="button" title="Move down" aria-label={`Move ${priorityLabels[priority]} down`} onClick={() => move(index, 1)}><ChevronDown /></button></div></div>)}</div>;
}
