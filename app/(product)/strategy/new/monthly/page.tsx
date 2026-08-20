import type { Metadata } from "next";
import { MonthlyTaskBuilder } from "@/components/monthly-task-builder";

export const metadata: Metadata = { title: "New Monthly Strategy · BENCHFLOW" };

export default function MonthlyPage() {
  return (
    <div className="editorial-page-container max-w-4xl">
      <div className="editorial-page-header">
        <span className="mono-badge">[ RECURRING WORKLOAD / MONTHLY ]</span>
        <h1>What Tasks Repeat Every Month?</h1>
        <p>Add each recurring task and workload volume. BENCHFLOW will analyze model pricing and generate a consolidated subscription stack.</p>
      </div>
      <MonthlyTaskBuilder />
    </div>
  );
}
