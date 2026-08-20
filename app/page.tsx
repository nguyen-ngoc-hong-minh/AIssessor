import {
  ArrowUpRight,
  Check,
  Cpu,
  Gauge,
  Layers,
  LockKeyhole,
  MousePointer2,
  PiggyBank,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { ParallaxHero } from "@/components/parallax-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const processSteps = [
  {
    number: "01.",
    title: "Define Objectives",
    text: "Describe the project or recurring workflow in plain English without technical jargon.",
  },
  {
    number: "02.",
    title: "Deconstruct Requirements",
    text: "BENCHFLOW breaks down your workload to determine the required AI capabilities and parameters.",
  },
  {
    number: "03.",
    title: "Evaluate Options",
    text: "Our engine cross-checks thousands of AI models on capability, quality, cost, speed, and privacy.",
  },
  {
    number: "04.",
    title: "Generate AI Stack",
    text: "Receive an actionable recommendation plan with exact tools, subscription tiers, and monthly costs.",
  },
];

const evaluationChecks = [
  {
    code: "01",
    title: "Task Capability Match",
    text: "Eliminates models lacking required features or clearly flags partial capability matches.",
  },
  {
    code: "02",
    title: "Empirical Quality",
    text: "Matches benchmarks to your specific workload rather than relying on generic leaderboards.",
  },
  {
    code: "03",
    title: "Transparent Pricing",
    text: "Calculates subscription tiers and usage pricing together to prevent unexpected monthly bills.",
  },
  {
    code: "04",
    title: "Latency & Speed",
    text: "Ensures model response times fit your real-world project deadlines.",
  },
  {
    code: "05",
    title: "Privacy & Compliance",
    text: "Verifies data privacy policies, server locations, and commercial license rights before recommending.",
  },
  {
    code: "06",
    title: "Source-Linked Evidence",
    text: "Every recommendation links to dated, verifiable benchmark sources and pricing documentation.",
  },
];

const faqs = [
  [
    "Do I need prior knowledge of AI tools?",
    "No. Describe your work and budget. BENCHFLOW translates your goals into technical requirements and explains recommendations in plain English.",
  ],
  [
    "How does BENCHFLOW evaluate AI models?",
    "We maintain a live index of benchmark scores, pricing sheets, privacy terms, and rate limits, continuously updated from primary sources.",
  ],
  [
    "What if one AI tool cannot complete the entire task?",
    "BENCHFLOW builds a multi-tool pipeline, detailing which tool handles each step and consolidating the combined subscription cost in one summary.",
  ],
  [
    "Can I edit or update my saved strategy later?",
    "Yes. Saved strategies remain accessible in your dashboard and can be edited or re-evaluated as new AI models launch.",
  ],
];

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main className="editorial-landing">
        {/* Editorial Hero */}
        <ParallaxHero>
          <div className="editorial-hero-copy">
            <div className="hero-pill-tag">
              <span>[ SYSTEM ADVISOR ]</span>
              <span className="pill-dot" />
              <span>STABLE RELEASE</span>
            </div>
            <h1>
              Build the right AI stack <span className="subtle-heading">for real work.</span>
            </h1>
            <p>
              Tell us what you need to get done. We compare AI models, pricing tiers, and capabilities, then consolidate them into one verified strategy.
            </p>
            <div className="hero-btn-row">
              <Link href="/sign-up" className="minimal-btn minimal-btn-dark">
                <span>Build My AI Strategy</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link href="#process" className="minimal-btn minimal-btn-outline">
                <span>Explore Process ↘</span>
              </Link>
            </div>
          </div>
        </ParallaxHero>

        {/* Section 1: Inverted Dark Highlight Block (Inspired by Reference 3 & 5) */}
        <section className="dark-banner-section section">
          <div className="dark-banner-inner">
            <div className="banner-top-row">
              <span className="dark-badge">SECTION 1</span>
              <span className="banner-big-num">01</span>
            </div>
            <div className="banner-content">
              <h2>
                Introducing BENCHFLOW <br />
                <span className="banner-subheading">
                  Our smart evaluation engine capable of structuring how AI work runs.
                </span>
              </h2>
              <div className="banner-footer-row">
                <p>
                  A new category of advisory platform built to understand complex tasks, eliminate software waste, and deliver verified AI recommendations.
                </p>
                <Link href="/sign-up" className="minimal-btn minimal-btn-outline dark-theme-btn">
                  <span>Get Started Now</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Overview & Key Facts (Inspired by Reference 3 & 4) */}
        <section className="editorial-section border-top" id="overview">
          <div className="section-grid-header">
            <span className="section-tag">[ 02 / OVERVIEW ]</span>
            <h2>Why BENCHFLOW works.</h2>
          </div>
          
          <div className="facts-editorial-grid">
            <div className="fact-card highlight-card">
              <div className="fact-num">65%</div>
              <div className="fact-title">Average Cost Savings</div>
              <p>By eliminating duplicate AI subscriptions and selecting correct tiers.</p>
            </div>

            <div className="fact-card">
              <div className="fact-num">1,200+</div>
              <div className="fact-title">Evaluated AI Models</div>
              <p>Continuously indexed across capabilities, benchmark scores, and rate limits.</p>
            </div>

            <div className="fact-card">
              <div className="fact-num">100%</div>
              <div className="fact-title">Verifiable Evidence</div>
              <p>Every recommendation links to primary benchmark sources and dated pricing.</p>
            </div>
          </div>
        </section>

        {/* Section 3: Process Steps (Inspired by Reference 4 Product/Service Offerings) */}
        <section className="editorial-section border-top" id="process">
          <div className="section-grid-header">
            <span className="section-tag">[ 03 / PROCESS ]</span>
            <h2>How it works in 4 steps.</h2>
          </div>

          <div className="process-editorial-grid">
            {processSteps.map(({ number, title, text }) => (
              <article key={number} className="process-card">
                <header>
                  <span className="process-num">{number}</span>
                  <ArrowUpRight className="w-5 h-5 text-black" />
                </header>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Section 4: Evaluation Criteria */}
        <section className="editorial-section border-top" id="criteria">
          <div className="section-grid-header">
            <span className="section-tag">[ 04 / CRITERIA ]</span>
            <h2>6-Point verification checklist.</h2>
          </div>

          <div className="criteria-editorial-grid">
            {evaluationChecks.map(({ code, title, text }) => (
              <article key={code} className="criteria-tile">
                <span className="tile-code">[{code}]</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Section 5: Strategy Table */}
        <section className="editorial-section border-top">
          <div className="section-grid-header">
            <span className="section-tag">[ 05 / STRATEGY DEMO ]</span>
            <h2>Example AI Strategy summary.</h2>
          </div>

          <div className="editorial-table-container">
            <table className="editorial-table">
              <thead>
                <tr>
                  <th>Task Stage</th>
                  <th>Recommended Tool</th>
                  <th>Fitness Rationale</th>
                  <th>Plan Tier</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Deep Research &amp; Synthesis</strong></td>
                  <td>Perplexity Pro / Claude 3.5 Sonnet</td>
                  <td>Live citation sources &amp; high analytical accuracy</td>
                  <td><span className="badge-tag">Pro ($20/mo)</span></td>
                </tr>
                <tr>
                  <td><strong>Drafting &amp; Code Generation</strong></td>
                  <td>DeepSeek R1 / GPT-4o</td>
                  <td>Superior reasoning benchmark &amp; large context window</td>
                  <td><span className="badge-tag">Included</span></td>
                </tr>
                <tr>
                  <td><strong>Campaign Visual Generation</strong></td>
                  <td>Midjourney v6 / Recraft</td>
                  <td>Consistent brand visual output &amp; high resolution</td>
                  <td><span className="badge-tag">Standard ($10/mo)</span></td>
                </tr>
              </tbody>
            </table>
            <div className="table-footer-bar">
              <span>ESTIMATED TOTAL SUBSCRIPTION</span>
              <strong>$20 / Month (Consolidated without double counting plans)</strong>
            </div>
          </div>
        </section>

        {/* Section 6: Pricing */}
        <section className="editorial-section border-top" id="pricing">
          <div className="section-grid-header">
            <span className="section-tag">[ 06 / PRICING ]</span>
            <h2>Simple, transparent pricing.</h2>
          </div>

          <div className="pricing-editorial-grid">
            <article className="pricing-box">
              <span className="plan-tag">FREE</span>
              <div className="price-tag">$0</div>
              <p>Evaluate a single task and view a concise recommendation summary.</p>
              <Link href="/sign-up" className="minimal-btn minimal-btn-outline full-width">
                Start Free
              </Link>
            </article>

            <article className="pricing-box featured-box">
              <span className="plan-tag dark-tag">[ MOST POPULAR ]</span>
              <div className="price-tag">$19 <small>/ month</small></div>
              <p>Full AI strategies, alternatives, saved plans, and monthly recurring workflows.</p>
              <Link href="/pricing" className="minimal-btn minimal-btn-dark full-width">
                <span>Choose Plus</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </article>

            <article className="pricing-box">
              <span className="plan-tag">TEAM</span>
              <div className="price-tag">$49 <small>/ month</small></div>
              <p>Shared workspace, team collaboration, and team strategy management.</p>
              <Link href="/pricing" className="minimal-btn minimal-btn-outline full-width">
                Choose Team
              </Link>
            </article>
          </div>
        </section>

        {/* Section 7: FAQ */}
        <section className="editorial-section border-top">
          <div className="section-grid-header">
            <span className="section-tag">[ 07 / FAQ ]</span>
            <h2>Frequently asked questions.</h2>
          </div>

          <div className="faq-editorial-list">
            {faqs.map(([question, answer]) => (
              <details key={question} className="faq-card">
                <summary>
                  <span>{question}</span>
                  <span className="plus-icon">+</span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="editorial-cta-section border-top">
          <div className="section cta-banner-box">
            <span className="dark-badge">READY TO START</span>
            <h2>Turn your next task into a clear AI strategy.</h2>
            <p>Start with your workload. BENCHFLOW will handle tool evaluation.</p>
            <Link href="/sign-up" className="minimal-btn minimal-btn-dark">
              <span>Build My AI Strategy</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
