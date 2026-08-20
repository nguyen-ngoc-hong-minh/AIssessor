import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard-view";
export const metadata:Metadata={title:"Dashboard"};
export default function DashboardPage(){return <div className="page-wrap"><div className="dashboard-top"><div><span className="kicker">Workspace</span><h1>Your AI strategies</h1><p>Saved plans, current evidence, and every workflow in one focused view.</p></div></div><DashboardView/></div>}
