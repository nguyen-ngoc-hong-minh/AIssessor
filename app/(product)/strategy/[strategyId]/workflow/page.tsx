import type { Metadata } from "next";
import { WorkflowEditor } from "@/components/workflow-editor";
export const metadata:Metadata={title:"Review workflow"};
export default async function WorkflowPage({params}:{params:Promise<{strategyId:string}>}){const {strategyId}=await params;return <div className="page-wrap"><div className="page-title"><div><span className="kicker">Workflow review</span><h1>Here’s the workflow we understood</h1><p>Review the steps before we match the best AI tools to each part of your project.</p></div></div><WorkflowEditor strategyId={strategyId}/></div>}
