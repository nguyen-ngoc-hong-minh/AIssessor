import type { Metadata } from "next";
import { MonthlyTaskBuilder } from "@/components/monthly-task-builder";

export const metadata: Metadata = { title: "New Monthly Strategy · AIssessor" };

export default function NewMonthlyStrategyPage() {
  return (
    <main className="form-page">
      <div className="form-header">
        <span className="eyebrow"><span className="dt" />Monthly pipeline workflow</span>
        <h1 className="h-display font-medium text-3xl mt-2">Build Recurring AI Stack</h1>
        <p>Add each recurring task and workload volume. AIssessor will analyze model pricing and generate a consolidated subscription stack.</p>
      </div>
      <MonthlyTaskBuilder />
    </main>
  );
}
