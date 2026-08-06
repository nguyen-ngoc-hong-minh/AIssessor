import type { Metadata } from "next";
import { ArrowRight, CalendarCheck2, RefreshCw } from "lucide-react";
import Link from "next/link";
export const metadata:Metadata={title:"Choose usage"};
export default function ChooseUsagePage(){return <div className="page-wrap"><div className="page-title"><div><span className="kicker">Choose one</span><h1>What do you want to plan?</h1><p>Both paths use simple language and the same explainable recommendation engine.</p></div></div><div className="usage-choice"><Link href="/strategy/new/one-off"><CalendarCheck2/><h2>One-off Project</h2><p>Find the best AI workflow for a specific project with a deadline and project budget.</p><span>Plan a project <ArrowRight/></span></Link><Link href="/strategy/new/monthly"><RefreshCw/><h2>Monthly Use</h2><p>Find a cost-effective AI setup for work that repeats throughout the month.</p><span>Plan recurring work <ArrowRight/></span></Link></div></div>}
