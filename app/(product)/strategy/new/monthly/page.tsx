import type { Metadata } from "next";
import { StrategyForm } from "@/components/strategy-form";
export const metadata:Metadata={title:"New monthly strategy"};
export default function MonthlyPage(){return <div className="page-wrap"><div className="page-title"><div><span className="kicker">Monthly use</span><h1>Describe the work that keeps coming back.</h1><p>Volume and frequency help estimate a realistic monthly subscription and API mix.</p></div></div><StrategyForm usageType="monthly"/></div>}
