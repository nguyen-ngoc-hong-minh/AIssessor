import type { Metadata } from "next";
import { SettingsView } from "@/components/settings-view";
export const metadata:Metadata={title:"Settings"};
export default function SettingsPage(){return <div className="page-wrap"><div className="page-title"><div><span className="kicker">Settings</span><h1>Profile and security</h1><p>Manage email, connected sign-in methods, password recovery, and account deletion through Clerk.</p></div></div><SettingsView/></div>}
