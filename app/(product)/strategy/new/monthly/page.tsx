import type { Metadata } from "next";
import { MonthlyTaskBuilder } from "@/components/monthly-task-builder";
export const metadata:Metadata={title:"New monthly strategy"};
export default function MonthlyPage(){return <div className="page-wrap"><div className="page-title"><div><span className="kicker">Monthly AI stack</span><h1>What repeats every month?</h1><p>Add each recurring task. BENCHFLOW will analyze the workload and go directly to the most efficient AI stack.</p></div></div><MonthlyTaskBuilder /></div>}
