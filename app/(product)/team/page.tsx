import type { Metadata } from "next";
import { TeamView } from "@/components/team-view";
export const metadata:Metadata={title:"Team"};
export default function TeamPage(){return <div className="page-wrap"><div className="page-title"><div><span className="kicker">Team</span><h1>Shared strategy workspace</h1><p>Minimal collaboration for active Team subscribers.</p></div></div><TeamView/></div>}
