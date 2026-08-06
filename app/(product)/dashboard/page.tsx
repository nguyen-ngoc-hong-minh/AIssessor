import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard-view";
export const metadata:Metadata={title:"Dashboard"};
export default function DashboardPage(){return <div className="page-wrap"><div className="dashboard-top"><div><span className="kicker">Dashboard</span><h1>Your AI strategies</h1><p>Real saved records, kept intentionally simple.</p></div></div><DashboardView/></div>}
