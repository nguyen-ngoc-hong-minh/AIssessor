import type { Metadata } from "next";
import { StrategyForm } from "@/components/strategy-form";
export const metadata:Metadata={title:"New one-off strategy"};
export default function OneOffPage(){return <div className="page-wrap"><div className="page-title"><div><span className="kicker">One-off project</span><h1>Describe the result—not the technology.</h1><p>BENCHFLOW will infer the necessary steps and technical requirements internally.</p></div></div><StrategyForm usageType="one_off"/></div>}
