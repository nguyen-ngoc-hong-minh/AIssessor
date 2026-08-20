import type { Metadata } from "next";
import { OneOffStrategyForm } from "@/components/one-off-strategy-form";

export const metadata: Metadata = { title: "New Strategy · AIssessor" };

export default function OneOffPage() {
  return (
    <div className="editorial-page-container max-w-4xl">
      <div className="editorial-page-header">
        <span className="mono-badge">[ Project input / Step 01 ]</span>
        <h1>What are you working on?</h1>
        <p>Describe what you want to accomplish. AIssessor builds the workflow and compares current AI options.</p>
      </div>
      <OneOffStrategyForm />
    </div>
  );
}
