import type { Metadata } from "next";
import { MonthlyTaskBuilder } from "@/components/monthly-task-builder";

export const metadata: Metadata = { title: "New Monthly Strategy · AIssessor" };

export default function NewMonthlyStrategyPage() {
  return (
    <div className="editorial-page-container max-w-4xl mx-auto my-auto space-y-8 py-4">
      <div className="editorial-page-header mb-8">
        <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
          Monthly Pipeline Workflow
        </h1>
      </div>
      <MonthlyTaskBuilder />
    </div>
  );
}
