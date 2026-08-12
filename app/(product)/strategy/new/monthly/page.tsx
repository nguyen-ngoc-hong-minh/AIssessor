import type { Metadata } from "next";
import { MonthlyTaskBuilder } from "@/components/monthly-task-builder";
export const metadata:Metadata={title:"New monthly strategy"};
export default function MonthlyPage(){return <div className="page-wrap"><div className="page-title"><div><span className="kicker">Monthly workflows</span><h1>Build the workload that repeats each month.</h1><p>Add each task separately so frequency, quality, and existing subscriptions shape the stack.</p></div></div><MonthlyTaskBuilder /></div>}
