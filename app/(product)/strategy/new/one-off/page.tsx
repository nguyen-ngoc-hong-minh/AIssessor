import type { Metadata } from "next";
import { OneOffStrategyForm } from "@/components/one-off-strategy-form";
export const metadata:Metadata={title:"New one-off strategy"};
export default function OneOffPage(){return <div className="page-wrap"><div className="page-title"><div><span className="kicker">One-off project</span><h1>Describe the result—not the technology.</h1><p>Give us one clear brief, a target date, and the budget BENCHFLOW should respect.</p></div></div><OneOffStrategyForm /></div>}
