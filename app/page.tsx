import {
  ArrowRight,
  Check,
  Gauge,
  Layers3,
  LockKeyhole,
  MousePointer2,
  PiggyBank,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { ParallaxHero } from "@/components/parallax-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

const steps = [
  { number: "01", icon: MousePointer2, title: "Tell us what you need", text: "Describe the project or monthly task in your own words." },
  { number: "02", icon: Layers3, title: "Check the plan", text: "For projects, review the steps BENCHFLOW understood before matching tools." },
  { number: "03", icon: Search, title: "Compare the right options", text: "We check capability, quality, price, speed, privacy, and access." },
  { number: "04", icon: ShieldCheck, title: "Save a clear strategy", text: "See which products and plans to use, what they cost, and why they fit." },
];

const checks = [
  { icon: Target, title: "Can it do the task?", text: "Options that miss a required capability are removed or clearly marked as partial." },
  { icon: Gauge, title: "Is the quality proven?", text: "Benchmarks are matched to the work instead of using one overall leaderboard." },
  { icon: PiggyBank, title: "Does the price make sense?", text: "Subscriptions and usage costs are shown separately so the total is understandable." },
  { icon: Zap, title: "Will it be fast enough?", text: "Speed matters when the deadline or monthly workload makes waiting expensive." },
  { icon: LockKeyhole, title: "Can you use it safely?", text: "Privacy, location, commercial use, and account access are checked before a recommendation." },
  { icon: RefreshCw, title: "Is the information current?", text: "Each result points to dated sources and shows when evidence needs another review." },
];

const faqs = [
  ["Do I need to know which AI tools exist?", "No. Describe the work and your priorities. BENCHFLOW translates that into requirements and explains the options in plain language."],
  ["Does AI decide everything for me?", "No. AI helps understand the work. Clear rules then check compatibility, evidence, budget, and access before the options are ranked."],
  ["What if one tool cannot complete the whole task?", "BENCHFLOW can show a combination of AI-first products, explain what each one covers, and include the combined plan in your subscription summary."],
  ["Can I change the workflow later?", "Yes. Project strategies keep an Edit workflow action, and saved strategies remain available when you return."],
];

export default function LandingPage() {
  return <><SiteHeader /><main className="landing-page">
    <ParallaxHero>
      <div className="spatial-hero-copy">
        <span className="hero-eyebrow"><Sparkles /> AI stack advisor</span>
        <h1>BENCHFLOW</h1>
        <h2>Build the right AI stack for real work.</h2>
        <p>Tell us what you need to get done. We compare AI products, plans, and costs, then turn them into one clear strategy.</p>
        <div className="hero-actions">
          <Button asChild size="lg"><Link href="/sign-up">Build my AI strategy <ArrowRight /></Link></Button>
          <Button asChild variant="outline" size="lg"><Link href="#how-it-works">See how it works</Link></Button>
        </div>
        <div className="trust-line">
          <span><Check /> No AI expertise needed</span>
          <span><Check /> Reasons you can verify</span>
          <span><Check /> Costs in one place</span>
        </div>
      </div>
      <div className="hero-signal" aria-label="BENCHFLOW checks capability, quality, price, and access">
        <span><i /> Evidence checked</span>
        <strong>One task in. A complete AI stack out.</strong>
      </div>
    </ParallaxHero>

    <section className="landing-intro section" id="how-it-works">
      <div className="section-heading">
        <span className="kicker">How it works</span>
        <h2>From a rough idea to a plan you can use.</h2>
        <p>BENCHFLOW does the technical comparison. You stay in control of the goal, workflow, and final choice.</p>
      </div>
      <div className="workflow-track">
        {steps.map(({ number, icon: Icon, title, text }) => <article key={number}>
          <header><span>{number}</span><Icon /></header>
          <h3>{title}</h3>
          <p>{text}</p>
        </article>)}
      </div>
    </section>

    <section className="use-mode-band">
      <div className="section use-mode-inner">
        <div className="section-heading">
          <span className="kicker">Choose your starting point</span>
          <h2>One project or work that repeats.</h2>
        </div>
        <div className="use-mode-grid">
          <article>
            <div className="mode-number">01</div>
            <MousePointer2 />
            <small>For a clear outcome</small>
            <h3>One-off Project</h3>
            <p>Plan a launch, report, video, website, or any project with a deadline and budget.</p>
            <Link href="/sign-up">Plan a project <ArrowRight /></Link>
          </article>
          <article>
            <div className="mode-number">02</div>
            <RefreshCw />
            <small>For recurring work</small>
            <h3>Monthly Workflow</h3>
            <p>Compare an AI stack for tasks your team repeats each week or month.</p>
            <Link href="/sign-up">Plan monthly work <ArrowRight /></Link>
          </article>
        </div>
      </div>
    </section>

    <section className="evidence-band">
      <div className="section evidence-inner">
        <div className="section-heading light">
          <span className="kicker">What BENCHFLOW checks</span>
          <h2>A good recommendation must work outside a demo.</h2>
          <p>Every option has to fit the task and the way you actually plan to use it.</p>
        </div>
        <div className="evidence-bento">
          {checks.map(({ icon: Icon, title, text }, index) => <article className={`evidence-tile evidence-tile-${index + 1}`} key={title}>
            <Icon />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>)}
        </div>
      </div>
    </section>

    <section className="strategy-preview section">
      <div className="section-heading">
        <span className="kicker">Your final strategy</span>
        <h2>Know what to use, what to buy, and what to expect.</h2>
        <p>The result brings each recommendation and the full subscription plan into one readable view.</p>
      </div>
      <div className="strategy-table" aria-label="Example BENCHFLOW strategy summary">
        <header><span>Task</span><span>Recommended setup</span><span>Why it fits</span><span>Plan</span></header>
        <div><strong>Research</strong><span>Research AI</span><span>Current sources and citations</span><b>Pro</b></div>
        <div><strong>Draft content</strong><span>Writing model</span><span>Long context and strong editing</span><b>Included</b></div>
        <div><strong>Create visuals</strong><span>Image generator</span><span>Fast, consistent campaign assets</span><b>Standard</b></div>
        <footer><span>Estimated monthly subscriptions</span><strong>Shown together, without double-counting plans</strong></footer>
      </div>
    </section>

    <section className="section pricing-preview landing-pricing">
      <div className="section-heading"><span className="kicker">Simple pricing</span><h2>Start free. Upgrade when the full plan helps.</h2></div>
      <div className="preview-plans">
        <article><small>Free</small><h3>$0</h3><p>Try one task analysis and see a short recommendation summary.</p><Link className="button button-secondary" href="/sign-up">Start free</Link></article>
        <article className="featured"><span>Most popular</span><small>Plus</small><h3>$19<em>/month</em></h3><p>Complete strategies, alternatives, saved plans, and monthly workflows.</p><Link className="button button-primary" href="/pricing">See Plus</Link></article>
        <article><small>Team</small><h3>$49<em>/month</em></h3><p>Shared strategies and collaboration for a small team.</p><Link className="button button-secondary" href="/pricing">See Team</Link></article>
      </div>
    </section>

    <section className="section faq landing-faq">
      <div className="section-heading"><span className="kicker">FAQ</span><h2>A few things worth knowing.</h2></div>
      <div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div>
    </section>

    <section className="final-cta">
      <div className="section final-cta-inner">
        <span className="kicker">Ready when you are</span>
        <h2>Turn the next task into a clear AI plan.</h2>
        <p>Start with the work. BENCHFLOW will help with the tools.</p>
        <Button asChild size="lg"><Link href="/sign-up">Build my AI strategy <ArrowRight /></Link></Button>
      </div>
    </section>
  </main><SiteFooter /></>;
}
