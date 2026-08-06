"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { integrationsConfigured } from "@/components/providers";

const plans=[
  {name:"Free",price:"$0",text:"Understand one task before deciding whether to pay.",features:["Account and onboarding","One task analysis","Editable workflow preview","Limited recommendation summary"]},
  {name:"Plus",price:"$19",text:"Complete plans and alternatives for individual work.",features:["Full AI Strategy Plans","Saved strategies","Multiple strategies","Monthly workflow recommendations"],featured:true},
  {name:"Team",price:"$49",text:"Shared planning for a small team.",features:["Everything in Plus","Shared workspace","Multiple members","Shared saved strategies"]},
  {name:"Enterprise",price:"Custom",text:"Organisation access and support without a large admin suite.",features:["Organisation workspace","Custom access","Implementation support","Contact sales"]},
];
export default function PricingPage(){
  async function checkout(plan:string){if(!integrationsConfigured)return;const response=await fetch("/api/billing/checkout",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({plan:plan.toLowerCase()})});const data=await response.json() as {url?:string};if(data.url)window.location.assign(data.url);}
  return <div className="pricing-page"><SiteHeader/><main className="section"><div className="pricing-header"><span className="kicker">Simple pricing</span><h1>Pay for complete answers, not a fake success screen.</h1><p>Plus and Team use verified Stripe Checkout. Access changes only after a signed webhook.</p></div><div className="plans-grid">{plans.map(plan=><article className={`card plan-card ${plan.featured?"featured":""}`} key={plan.name}>{plan.featured&&<em>Most popular</em>}<small>{plan.name}</small><h2>{plan.name}</h2><div className="plan-price">{plan.price}{plan.price.startsWith("$")&&<span> / month</span>}</div><p>{plan.text}</p>{plan.name==="Free"?<Link className="button button-secondary" href="/sign-up">Start free</Link>:plan.name==="Enterprise"?<a className="button button-secondary" href="mailto:sales@benchflow.app">Contact sales</a>:<button className="button button-primary" disabled={!integrationsConfigured} onClick={()=>checkout(plan.name)}>{integrationsConfigured?`Choose ${plan.name}`:"Configure Stripe to continue"}</button>}<ul>{plan.features.map(feature=><li key={feature}><Check/>{feature}</li>)}</ul></article>)}</div></main><SiteFooter/></div>}
