import type { Metadata } from "next";
import { ResultsView } from "@/components/results-view";
export const metadata:Metadata={title:"Strategy results"};
export default async function ResultPage({params}:{params:Promise<{strategyId:string}>}){const {strategyId}=await params;return <div className="page-wrap"><div className="page-title"><div><span className="kicker">Explainable strategy</span><h1>Your compatible AI setup.</h1><p>Every option is filtered and scored from the approved workflow and the latest valid stored evidence.</p></div></div><ResultsView strategyId={strategyId}/></div>}
