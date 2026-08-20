import type { Metadata } from "next";
import { OneOffStrategyForm } from "@/components/one-off-strategy-form";

export const metadata: Metadata = { title: "New One-off Strategy · BENCHFLOW" };

export default function OneOffPage() {
  return (
    <div className="editorial-page-container max-w-4xl">
      <div className="editorial-page-header">
        <span className="mono-badge">[ ONE-OFF PROJECT / BRIEF ]</span>
        <h1>Describe the Result — Not the Technology</h1>
        <p>Provide a project brief, a target deadline, and your budget limit. BENCHFLOW will evaluate the optimal AI model pipeline.</p>
      </div>
      <OneOffStrategyForm />
    </div>
  );
}
