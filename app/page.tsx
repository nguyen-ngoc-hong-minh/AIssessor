import { ArrowRight, Check, Gauge, Layers3, LockKeyhole, MousePointer2, PiggyBank, RefreshCw, Search, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

const considerations = [
  { icon: Gauge, title: "Performance", text: "Evidence that matches each step—not a universal leaderboard winner." },
  { icon: PiggyBank, title: "Price", text: "Fixed subscriptions and estimated usage are kept separate." },
  { icon: RefreshCw, title: "Speed", text: "Latency and throughput matter when turnaround is the priority." },
  { icon: LockKeyhole, title: "Privacy", text: "Unknown or incompatible data controls remove an option." },
  { icon: ShieldCheck, title: "Commercial use", text: "Commercial compatibility must be confirmed when required." },
  { icon: Layers3, title: "Existing tools", text: "Tools you already pay for are considered before adding more." },
];

export default function LandingPage() {
  return <><SiteHeader /><main>
    <section className="hero section"><div className="hero-copy"><span className="kicker"><Sparkles /> Evidence-led AI procurement</span><h1>Your AI stack, built around the work.</h1><p>Describe a project or recurring tasks. BENCHFLOW turns the workload into a clear, compatible set of AI products, plans, and costs.</p><div className="hero-actions"><Button asChild size="lg"><Link href="/sign-up">Build my AI strategy <ArrowRight /></Link></Button><Button asChild variant="outline" size="lg"><Link href="/how-it-works">See how it works</Link></Button></div><div className="trust-line"><span><Check /> No AI expertise required</span><span><Check /> Explainable comparisons</span><span><Check /> Current, source-dated evidence</span></div></div><div className="hero-product" aria-label="BENCHFLOW product workflow preview"><div className="product-top"><span /><span /><span /><b>Campaign workflow</b><em>Ready to review</em></div><div className="goal-card"><small>Your goal</small><strong>Launch a neighbourhood café</strong><p>Campaign assets for opening week</p></div><div className="mini-flow"><div><span><Search /></span><b>Research</b><small>Market and audience</small></div><i>→</i><div><span><MousePointer2 /></span><b>Write copy</b><small>Messages and offers</small></div><i>→</i><div><span><Sparkles /></span><b>Create visuals</b><small>Five launch assets</small></div></div><div className="fit-card"><span><ShieldCheck /></span><div><small>Recommendation status</small><strong>Compatible options found</strong></div><b>Evidence checked</b></div></div></section>

    <section className="section how-summary"><div className="section-heading"><span className="kicker">How it works</span><h2>From a messy idea to a clear AI plan.</h2><p>BENCHFLOW handles the technical interpretation. You stay in control of the work.</p></div><div className="four-steps">{[
      ["01", "Describe your work", "Use normal language. No categories, models, or token estimates."],
      ["02", "Review the workflow", "Edit the simple steps and approve what BENCHFLOW understood."],
      ["03", "Compare compatible options", "Hard filters remove tools that cannot safely do the job."],
      ["04", "Save your strategy", "See costs, reasons, alternatives, sources, and known limitations."],
    ].map(([n,t,d]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></section>

    <section className="section usage-section"><div className="section-heading"><span className="kicker">Two ways to use BENCHFLOW</span><h2>Plan once or optimize every month.</h2></div><div className="usage-cards"><article><span className="usage-icon"><MousePointer2 /></span><small>For a defined outcome</small><h3>One-off Project</h3><p>Find the best AI workflow for a specific project with a deadline and project budget.</p><Link href="/sign-up">Plan a project <ArrowRight /></Link></article><article><span className="usage-icon"><RefreshCw /></span><small>For recurring work</small><h3>Monthly Use</h3><p>Find a cost-effective AI setup for work that repeats throughout the month.</p><Link href="/sign-up">Plan monthly work <ArrowRight /></Link></article></div></section>

    <section className="consider-section"><div className="section consider-inner"><div className="section-heading light"><span className="kicker">What recommendations consider</span><h2>Compatibility first. Score second.</h2><p>A high benchmark means nothing if the option cannot meet the modality, privacy, commercial-use, region, or budget requirement.</p></div><div className="consider-grid">{considerations.map(({icon: Icon,title,text}) => <article key={title}><Icon /><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="section example-section"><div className="example-copy"><span className="kicker">Example strategy</span><h2>“Create a launch campaign for a small café.”</h2><p>BENCHFLOW first turns the goal into an editable plan. Current model names are intentionally not hardcoded into landing-page examples.</p><div className="example-note"><ShieldCheck /><span><strong>The user approves this workflow first.</strong> Only then does the deterministic engine compare live, compatible options.</span></div></div><div className="example-flow">{["Research", "Write copy", "Create visuals", "Review output"].map((step,index) => <div key={step}><span>{index + 1}</span><strong>{step}</strong>{index < 3 && <i>↓</i>}</div>)}</div></section>

    <section className="section pricing-preview"><div className="section-heading"><span className="kicker">Simple pricing</span><h2>Explore free. Unlock complete strategies when they help.</h2></div><div className="preview-plans"><article><small>Free</small><h3>$0</h3><p>One task analysis and a limited recommendation summary.</p><Link className="button button-secondary" href="/sign-up">Start free</Link></article><article className="featured"><span>Most popular</span><small>Plus</small><h3>$19<em>/month</em></h3><p>Full plans, alternatives, saves, and monthly workflow recommendations.</p><Link className="button button-primary" href="/pricing">See Plus</Link></article><article><small>Team</small><h3>$49<em>/month</em></h3><p>Shared strategies and collaboration for a small team.</p><Link className="button button-secondary" href="/pricing">See Team</Link></article></div></section>

    <section className="section faq"><div className="section-heading"><span className="kicker">FAQ</span><h2>Questions before you start.</h2></div><div>{[
      ["Do I need to know which AI models exist?", "No. Describe the work. BENCHFLOW infers technical requirements and explains the final comparison in plain language."],
      ["Does the Planner AI choose the winning model?", "No. It creates the workflow only. Deterministic server-side code applies compatibility filters and scoring to stored source data."],
      ["What happens when live model data is unavailable?", "BENCHFLOW uses the most recent valid stored snapshot, shows its date, marks it stale when necessary, and never invents replacement values."],
      ["Can I edit the generated workflow?", "Yes. Add, remove, reorder, or edit steps and mark work as manual before approving it."],
    ].map(([q,a]) => <details key={q}><summary>{q}<span>＋</span></summary><p>{a}</p></details>)}</div></section>
  </main><SiteFooter /></>;
}
