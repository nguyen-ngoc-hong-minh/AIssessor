import type { Metadata } from "next";
import { OnboardingForm } from "@/components/onboarding-form";
export const metadata:Metadata={title:"Onboarding"};
export default function OnboardingPage(){return <div className="page-wrap"><div className="page-title"><div><span className="kicker">Three quick questions</span><h1>Who are we planning for?</h1><p>Choose one account type. We’ll ask exactly three questions and keep the rest for later.</p></div></div><OnboardingForm/></div>}
