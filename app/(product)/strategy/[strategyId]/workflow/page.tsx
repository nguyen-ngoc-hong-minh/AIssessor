import type { Metadata } from "next";
import { WorkflowEditor } from "@/components/workflow-editor";

export const metadata: Metadata = { title: "Review Workflow · AIssessor" };

export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ strategyId: string }>;
}) {
  const { strategyId } = await params;

  return (
    <div className="editorial-page-container w-full max-w-6xl mx-auto my-auto flex flex-col justify-center py-6">
      <WorkflowEditor strategyId={strategyId} />
    </div>
  );
}
