import type { Metadata } from "next";
import { SettingsView } from "@/components/settings-view";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
export const metadata:Metadata={title:"Settings"};
export default async function SettingsPage(){const user=await requireChatGPTUser("/settings");return <div className="page-wrap"><div className="page-title"><div><span className="kicker">Settings</span><h1>Profile and security</h1><p>Your BENCHFLOW profile is linked to your verified ChatGPT identity.</p></div></div><SettingsView name={user.displayName} email={user.email}/></div>}
