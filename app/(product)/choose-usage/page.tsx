import type { Metadata } from "next";
import { ArrowRight, CalendarCheck2, RefreshCw } from "lucide-react";
import Link from "next/link";
export const metadata:Metadata={title:"Choose usage"};
export default function ChooseUsagePage(){return <div className="page-wrap"><div className="page-title"><div><span className="kicker">Choose one</span><h1>What do you want to plan?</h1><p>Use a project brief for a defined deliverable, or build a recurring workload task by task.</p></div></div><div className="usage-choice"><Link href="/strategy/new/one-off"><CalendarCheck2/><h2>One-off Project</h2><p>A specific result with an exact target date and project budget.</p><span>Plan a project <ArrowRight/></span></Link><Link href="/strategy/new/monthly"><RefreshCw/><h2>Monthly Workflows</h2><p>Multiple recurring tasks, each with its own frequency and quality level.</p><span>Build monthly workload <ArrowRight/></span></Link></div></div>}
