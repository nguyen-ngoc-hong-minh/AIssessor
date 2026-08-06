"use client";

import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { IntegrationNotice } from "./integration-notice";
import { integrationsConfigured } from "./providers";
export function BillingView(){const [error,setError]=useState("");async function portal(){setError("");const response=await fetch("/api/billing/portal",{method:"POST"});const body=await response.json() as {url?:string;error?:string};if(!response.ok||!body.url){setError(body.error??"Portal unavailable");return}location.href=body.url}return <>{!integrationsConfigured&&<IntegrationNotice/>}<div className="card form-card" style={{marginTop:16}}><h2 style={{fontSize:17}}>Manage your subscription</h2><p style={{color:"#68748a",fontSize:11,lineHeight:1.6}}>Upgrades, downgrades, cancellation, and payment methods are handled by the Stripe Customer Portal. BENCHFLOW reads access only from verified subscription events.</p>{error&&<p className="error-message">{error}</p>}<button className="button button-primary" disabled={!integrationsConfigured} onClick={portal}><ExternalLink/>Open Customer Portal</button></div></>}
