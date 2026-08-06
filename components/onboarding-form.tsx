"use client";

import { Building2, UserRound, UsersRound } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IntegrationNotice } from "./integration-notice";
import { integrationsConfigured } from "./providers";

const schema=z.object({q1:z.string().min(1,"Choose an answer"),q2:z.string().min(1,"Choose an answer"),q3:z.string().min(1,"Choose an answer")});
type Values=z.infer<typeof schema>; type AccountType="individual"|"team"|"enterprise";
const work=["Student or academic","Creative and media","Marketing and communications","Software and technology","Research and analysis","Business and administration","Independent business","Other"];
const questions:Record<AccountType,Array<{label:string;options:string[]}>>={
  individual:[{label:"What type of work do you mainly do?",options:work},{label:"How often do you currently use AI?",options:["New to AI","Occasionally","Weekly","Daily"]},{label:"What monthly AI budget feels comfortable?",options:["Free tools only","Under USD 10","USD 10–30","USD 30–100","More than USD 100","Not sure"]}],
  team:[{label:"What type of work does your team mainly do?",options:work},{label:"How many people are in the team?",options:["2–5","6–15","16–50","More than 50"]},{label:"What is the team’s approximate monthly AI budget?",options:["Free tools only","Under USD 100","USD 100–500","USD 500–2,000","More than USD 2,000","Not sure"]}],
  enterprise:[{label:"What industry does the organisation operate in?",options:["Professional services","Technology","Financial services","Healthcare","Retail","Manufacturing","Education","Media","Other"]},{label:"Approximately how many employees are in the organisation?",options:["50–249","250–999","1,000–4,999","5,000 or more"]},{label:"What is the organisation’s approximate monthly AI spend?",options:["No paid AI yet","Under USD 500","USD 500–2,000","USD 2,000–10,000","More than USD 10,000","Unknown"]}],
};
export function OnboardingForm(){const [type,setType]=useState<AccountType>("individual");const [error,setError]=useState("");const router=useRouter();const form=useForm<Values>({resolver:zodResolver(schema),defaultValues:{q1:"",q2:"",q3:""}});function choose(next:AccountType){setType(next);form.reset({q1:"",q2:"",q3:""});}
  async function submit(values:Values){setError("");try{const response=await fetch("/api/onboarding",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({accountType:type,answers:values})});const body=await response.json() as {error?:string};if(!response.ok)throw new Error(body.error);router.push("/choose-usage");}catch(e){setError(e instanceof Error?e.message:"Unable to save onboarding");}}
  return <>{!integrationsConfigured&&<IntegrationNotice compact/>}<div className="option-grid" style={{marginTop:20}}>{([{id:"individual",title:"Individual",text:"Plan work for yourself.",icon:UserRound},{id:"team",title:"Team",text:"Plan shared work for 2–50 people.",icon:UsersRound},{id:"enterprise",title:"Enterprise",text:"Plan organisation use with stricter constraints.",icon:Building2}] as const).map(({id,title,text,icon:Icon})=><button className={`option-card ${type===id?"selected":""}`} onClick={()=>choose(id)} key={id}><Icon/><h3>{title}</h3><p>{text}</p></button>)}</div><form className="card three-questions" onSubmit={form.handleSubmit(submit)}><div className="form-grid">{questions[type].map((question,index)=><div className={`field ${index===2?"full":""}`} key={question.label}><label htmlFor={`q${index+1}`}>{index+1}. {question.label}</label><select id={`q${index+1}`} {...form.register(`q${index+1}` as keyof Values)}><option value="">Choose one</option>{question.options.map(option=><option key={option}>{option}</option>)}</select>{form.formState.errors[`q${index+1}` as keyof Values]&&<small>{form.formState.errors[`q${index+1}` as keyof Values]?.message}</small>}</div>)}</div>{error&&<p className="error-message">{error}</p>}<div className="form-actions"><button className="button button-primary" disabled={!integrationsConfigured||form.formState.isSubmitting}>{form.formState.isSubmitting?"Saving…":"Continue"}</button></div></form></>}
