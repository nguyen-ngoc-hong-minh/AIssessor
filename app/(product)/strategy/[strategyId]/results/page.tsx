import type { Metadata } from "next";
import { ResultsView } from "@/components/results-view";
export const metadata:Metadata={title:"Strategy results"};
export default async function ResultPage({params}:{params:Promise<{strategyId:string}>}){const {strategyId}=await params;return <div className="page-wrap"><div className="page-title"><div><span className="kicker">AI strategy</span><h1>Your compatible AI stack</h1><p>Each option is matched to your workload, checked against current evidence, and saved for your next visit.</p></div></div><ResultsView strategyId={strategyId}/></div>}
