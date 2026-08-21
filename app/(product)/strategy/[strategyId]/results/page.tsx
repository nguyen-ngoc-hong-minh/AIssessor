import type { Metadata } from "next";
import { ResultsView } from "@/components/results-view";

export const metadata: Metadata = { title: "Strategy Results · AIssessor" };

export default async function ResultPage({
  params,
}: {
  params: Promise<{ strategyId: string }>;
}) {
  const { strategyId } = await params;
  return (
    <div className="editorial-page-container w-full max-w-6xl mx-auto my-auto space-y-8 py-4">
      <ResultsView strategyId={strategyId} />
    </div>
  );
}
