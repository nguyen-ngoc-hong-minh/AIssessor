import type { Metadata } from "next";
import { BillingView } from "@/components/billing-view";
export const metadata:Metadata={title:"Billing"};
export default function BillingPage(){return <div className="page-wrap"><div className="page-title"><div><span className="kicker">Billing</span><h1>Plan and subscription</h1><p>Access is enforced in Convex from verified Stripe state.</p></div></div><BillingView/></div>}
