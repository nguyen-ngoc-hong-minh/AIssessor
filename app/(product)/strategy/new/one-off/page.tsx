import type { Metadata } from "next";
import { OneOffStrategyForm } from "@/components/one-off-strategy-form";

export const metadata: Metadata = { title: "New Strategy · Aissessor" };

export default function OneOffPage() {
  return (
    <div className="editorial-page-container max-w-4xl mx-auto my-auto space-y-8 py-4">
      <div className="editorial-page-header mb-8">
        <h1 className="text-4xl md:text-5xl font-semibold text-ink tracking-tight">
          One-Off Project Input
        </h1>
      </div>
      <OneOffStrategyForm />
    </div>
  );
}
