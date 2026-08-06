import type { Metadata } from "next";
import { WorkflowEditor } from "@/components/workflow-editor";
export const metadata:Metadata={title:"Review workflow"};
export default async function WorkflowPage({params}:{params:Promise<{strategyId:string}>}){const {strategyId}=await params;return <div className="page-wrap"><div className="page-title"><div><span className="kicker">Review before comparison</span><h1>We understood your work as follows.</h1><p>Edit the steps, quantities, importance, and manual work. Models are not compared until you approve.</p></div></div><WorkflowEditor strategyId={strategyId}/></div>}
