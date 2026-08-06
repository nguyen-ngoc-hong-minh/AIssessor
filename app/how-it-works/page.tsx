import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = { title: "How it works" };
const steps = [
  ["01", "Describe the result", "Tell BENCHFLOW what you need in everyday language, along with budget, timing, and priorities."],
  ["02", "Planner AI maps the work", "The planner returns a validated workflow with workload assumptions and no model names."],
  ["03", "You approve the workflow", "Edit, reorder, add, remove, or mark steps manual before any recommendation is calculated."],
  ["04", "Compatibility filters run", "Wrong modality, insufficient context, missing privacy evidence, and hard-budget failures are excluded."],
  ["05", "Eligible options are scored", "Priority-controlled weights compare performance fit, cost, speed, evidence coverage, privacy, and freshness."],
  ["06", "You save an explainable plan", "Every result includes costs, evidence dates, source links, limitations, alternatives, and exclusions."],
];
export default function HowItWorksPage(){return <><SiteHeader/><main className="section public-content"><span className="kicker">How BENCHFLOW works</span><h1>Workflow first. Evidence second. Recommendation last.</h1><p className="lead">BENCHFLOW separates understanding your work from choosing the technology. That prevents the Planner AI from simply naming a familiar model.</p><div className="process-grid">{steps.map(([n,t,p])=><article className="card" key={n}><span>{n}</span><h2>{t}</h2><p>{p}</p></article>)}</div></main><SiteFooter/></>}
