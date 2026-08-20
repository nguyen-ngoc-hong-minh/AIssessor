"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export function LustroDeck() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const slidesCount = 7;

  const slidesData = [
    { section: "Cover", sub: "The launch headline" },
    { section: "The problem", sub: "Why teams struggle today" },
    { section: "Introducing BENCHFLOW", sub: "The optimization engine" },
    { section: "The process", sub: "Goal analysis to strategy plan" },
    { section: "Planning modes", sub: "One-off project or monthly pipeline" },
    { section: "Pricing plans", sub: "Free, Plus, and Enterprise" },
    { section: "Get started", sub: "Build your AI strategy" },
  ];

  const go = useCallback((targetIdx: number) => {
    if (isAnimating || targetIdx === currentIdx || targetIdx < 0 || targetIdx >= slidesCount) return;
    setIsAnimating(true);
    setCurrentIdx(targetIdx);
    setMenuOpen(false);
    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  }, [isAnimating, currentIdx, slidesCount]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        return;
      }
      if (menuOpen) return;
      if (e.key === "ArrowRight") go(currentIdx + 1);
      if (e.key === "ArrowLeft") go(currentIdx - 1);
      if (e.key === " ") {
        e.preventDefault();
        go(currentIdx + 1);
      }
      if (e.key === "m" || e.key === "M") {
        setMenuOpen((prev) => !prev);
      }
      if (/^[1-7]$/.test(e.key)) {
        go(parseInt(e.key, 10) - 1);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIdx, menuOpen, go]);

  return (
    <>
      {/* Background Orbs & Grid */}
      <div className="deck-bg" />

      {/* Persistent Chrome: Brand Header */}
      <div className="brand">
        <span className="logo" />
        BENCHFLOW <span className="slash">/</span> <span className="brand-subtitle">AI Stack Advisor</span>
      </div>

      {/* Section Tag Indicator */}
      <div className="section-tag">
        <span className="pip" />
        <span>{slidesData[currentIdx].section}</span>
      </div>

      {/* Right Credit Tag */}
      <a className="tm-credit" href="https://github.com/tttam2702-ui/dms4_mvp" target="_blank" rel="noreferrer">
        <span className="tm-dot" />
        <span className="tm-label">BENCHFLOW v4.0</span>
      </a>

      {/* Persistent Nav & Counter */}
      <div className="nav">
        <button onClick={() => go(currentIdx - 1)} disabled={currentIdx === 0} aria-label="Previous slide">
          &larr;
        </button>
        <button
          className={`menu-btn ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open slide menu"
        >
          <span className="icon">
            <i />
            <i />
            <i />
          </span>
        </button>
        <div className="counter">
          <span>{String(currentIdx + 1).padStart(2, "0")}</span> / <span>07</span>
        </div>
        <button onClick={() => go(currentIdx + 1)} disabled={currentIdx === slidesCount - 1} aria-label="Next slide">
          &rarr;
        </button>
      </div>

      {/* Popup Navigation Menu Modal */}
      <div className={`menu-overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />
      <div className={`menu-panel ${menuOpen ? "open" : ""}`} role="dialog" aria-label="Slide navigation">
        <div className="menu-header">
          <h3>Jump to slide</h3>
          <div className="menu-meta">
            <span>{String(currentIdx + 1).padStart(2, "0")}</span> / <span>07</span>
          </div>
        </div>
        <div className="menu-list">
          {slidesData.map((slide, i) => (
            <div
              key={slide.section}
              className={`menu-item ${i === currentIdx ? "current" : ""}`}
              onClick={() => go(i)}
            >
              <span className="mi-num">{String(i + 1).padStart(2, "0")}</span>
              <div style={{ flex: 1 }}>
                <div className="mi-label">{slide.section}</div>
                <div className="mi-sub">{slide.sub}</div>
              </div>
              <span className="mi-arr">&rarr;</span>
            </div>
          ))}
        </div>
        <div className="menu-footer">
          <span>Tip &middot; press <kbd>M</kbd> to toggle</span>
          <span><kbd>1</kbd>&ndash;<kbd>7</kbd> direct jump</span>
        </div>
      </div>

      {/* DECK SLIDES */}
      <div className="deck">
        {/* ============ SLIDE 1: COVER ============ */}
        <section className={`slide ${currentIdx === 0 ? "active" : ""}`} data-section="Cover">
          <div className="slide-inner s-cover">
            <div className="s-cover-inner">
              <div className="s-cover-glow" />
              <div className="eyebrow reveal">
                <span className="dt" />
                BENCHFLOW 4.0 Launch
              </div>
              <h1 className="h-display">
                <span className="line">
                  <span><span className="grd">BENCHFLOW</span> is here.</span>
                </span>
                <span className="line">
                  <span>AI Stack, finally optimized.</span>
                </span>
              </h1>
              <p className="body-lg reveal" style={{ maxWidth: 680 }}>
                Tell us what you need to accomplish. BENCHFLOW builds the workflow, compares current AI options, and finds the subscriptions worth paying for.
              </p>
              <div className="s-cover-meta reveal">
                <span>v 4.0</span><span className="sep" />
                <span>August 2026</span><span className="sep" />
                <span>1,200+ AI Models</span>
              </div>
              <div className="s-cover-cta reveal">
                <Link href="/sign-up" className="btn-primary">
                  Build My AI Strategy &rarr;
                </Link>
                <button onClick={() => go(1)} className="btn-secondary">
                  Explore Presentation
                </button>
              </div>
              <div className="s-cover-version">PRESS / DECK / 0001 &middot; BENCHFLOW HQ</div>
            </div>
          </div>
        </section>

        {/* ============ SLIDE 2: PROBLEM ============ */}
        <section className={`slide ${currentIdx === 1 ? "active" : ""}`} data-section="The problem">
          <div className="slide-inner s-problem">
            <div className="s-problem-grid">
              <div className="s-problem-left">
                <div className="eyebrow reveal">
                  <span className="dt" />
                  The problem
                </div>
                <h2 className="h-display reveal">
                  Modern AI stacks are <em>loud</em>. Teams are tired of decoding options.
                </h2>
                <p className="body-lg reveal" style={{ maxWidth: 520 }}>
                  Teams spend an average of <strong style={{ color: "#fff", fontWeight: 500 }}>6.5 hours per project</strong> piecing together which AI tools and subscription tiers to use. We think that's broken.
                </p>
              </div>
              <div className="s-problem-right">
                <div className="problem-card glass-card reveal">
                  <div className="pc-num">01</div>
                  <div className="pc-body">
                    <h3>Too many tools &amp; tiers</h3>
                    <p>ChatGPT, Claude, Perplexity, Midjourney—each with separate seats and overlapping feature sets.</p>
                  </div>
                </div>
                <div className="problem-card glass-card reveal">
                  <div className="pc-num">02</div>
                  <div className="pc-body">
                    <h3>Hidden API &amp; usage limits</h3>
                    <p>Rate limits and unexpected usage bills cause surprise charges mid-project.</p>
                  </div>
                </div>
                <div className="problem-card glass-card reveal">
                  <div className="pc-num">03</div>
                  <div className="pc-body">
                    <h3>Context &amp; privacy risks</h3>
                    <p>Lack of clarity on data privacy terms, server regions, and commercial licensing.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SLIDE 3: INTRODUCING BENCHFLOW ============ */}
        <section className={`slide ${currentIdx === 2 ? "active" : ""}`} data-section="Introducing BENCHFLOW">
          <div className="slide-inner s-product">
            <div className="s-product-grid">
              <div className="s-product-left">
                <span className="product-tag reveal">&#10022; New &middot; In BENCHFLOW 4.0</span>
                <h2 className="h-display reveal">
                  Meet <span className="grd">BENCHFLOW</span>. Your AI stack, explained.
                </h2>
                <p className="body-lg reveal">
                  BENCHFLOW turns your workload goals into a verified, plain-language AI strategy. Ask questions in English. Get exact tool stacks, subscription tiers, and dollar savings.
                </p>
                <div className="s-product-features reveal">
                  <div className="pf">
                    <span>Natural language workflow</span>
                  </div>
                  <div className="pf">
                    <span>Verified benchmark evidence</span>
                  </div>
                  <div className="pf">
                    <span>Plain-English summaries</span>
                  </div>
                  <div className="pf">
                    <span>Consolidated subscription savings</span>
                  </div>
                </div>
                <div className="s-product-cta reveal">
                  <Link href="/sign-up" className="btn-primary">
                    Build Strategy &rarr;
                  </Link>
                </div>
              </div>
              <div className="s-product-right">
                <div className="mock-ui glass-card">
                  <div className="mock-head">
                    <div className="mh-l">
                      <span className="mh-dot" />
                      benchflow / pipeline
                    </div>
                    <div className="mh-r"><i /><i /><i /></div>
                  </div>
                  <div className="mock-stat">
                    <div className="ms-l">
                      <span>CONSOLIDATED SUBSCRIPTION STACK</span>
                      <strong>$55<span style={{ fontSize: ".55em", color: "var(--ink-3)", fontWeight: 400 }}>/mo</span></strong>
                    </div>
                    <div className="mock-stat">
                      <span className="ms-delta">SAVE $39 / MO</span>
                    </div>
                  </div>
                  <div className="mock-chart">
                    <svg viewBox="0 0 500 140" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="mockGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#a5b4fc" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path className="area-path" d="M0,90 C40,80 70,70 100,75 S160,55 200,60 S260,40 300,50 S360,30 400,35 S460,55 500,40 L500,140 L0,140 Z" />
                      <path className="line-path" d="M0,90 C40,80 70,70 100,75 S160,55 200,60 S260,40 300,50 S360,30 400,35 S460,55 500,40" />
                    </svg>
                  </div>
                  <div className="mock-tiles">
                    <div className="mock-tile">
                      <span>Indexed Models</span>
                      <strong>1,200+</strong>
                    </div>
                    <div className="mock-tile">
                      <span>Speed</span>
                      <strong>&lt; 3 Secs</strong>
                    </div>
                    <div className="mock-tile">
                      <span>Evidence</span>
                      <strong>100%</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SLIDE 4: THE PROCESS (Icons Removed & Spacing Increased) ============ */}
        <section className={`slide ${currentIdx === 3 ? "active" : ""}`} data-section="The process">
          <div className="slide-inner s-features">
            <div className="s-features-head">
              <div className="sf-l">
                <div className="eyebrow reveal">
                  <span className="dt" />
                  The BENCHFLOW Process
                </div>
                <h2 className="h-display reveal">Workflow first. Evidence second. Recommendation last.</h2>
              </div>
              <p className="sf-r reveal">
                BENCHFLOW turns your plain-language goal into a verified, actionable AI stack plan through a transparent 4-step process.
              </p>
            </div>
            <div className="feature-grid">
              <div className="feature glass-card reveal">
                <div className="f-num">01</div>
                <h3>Describe the result</h3>
                <p>Tell BENCHFLOW what you need in everyday language, along with budget, target deadline, and priority ranking.</p>
              </div>
              <div className="feature-grid-item feature glass-card reveal">
                <div className="f-num">02</div>
                <h3>Planner AI maps the work</h3>
                <p>The planner returns a validated workflow breakdown with workload assumptions and exact step requirements.</p>
              </div>
              <div className="feature-grid-item feature glass-card reveal">
                <div className="f-num">03</div>
                <h3>Primary evidence matching</h3>
                <p>Modality fit, context window limits, missing privacy evidence, and hard-budget failures are automatically filtered out.</p>
              </div>
              <div className="feature-grid-item feature glass-card reveal">
                <div className="f-num">04</div>
                <h3>Optimized stack &amp; savings</h3>
                <p>Priority-controlled weights calculate performance fit, subscription consolidation, and net monthly dollar savings.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SLIDE 5: PLANNING MODES (Icons Removed & Spacing Increased) ============ */}
        <section className={`slide ${currentIdx === 4 ? "active" : ""}`} data-section="Planning modes">
          <div className="slide-inner s-features">
            <div className="s-features-head">
              <div className="sf-l">
                <div className="eyebrow reveal">
                  <span className="dt" />
                  Choose your planning mode
                </div>
                <h2 className="h-display reveal">Tailored for one-off projects or recurring workloads.</h2>
              </div>
              <p className="sf-r reveal">
                Select how you want to structure your AI recommendations based on your team's workflow style and delivery cadence.
              </p>
            </div>
            <div className="feature-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
              <div className="feature glass-card reveal flex flex-col justify-between min-h-[300px]">
                <div>
                  <div className="f-num">01</div>
                  <h3>One-off Project Strategy</h3>
                  <p>A specific deliverable with an exact target completion date, project brief, and budget ceiling limit.</p>
                </div>
                <Link href="/strategy/new/one-off" className="f-link mt-8">
                  <span>Plan One-off Project</span> <span>&rarr;</span>
                </Link>
              </div>

              <div className="feature glass-card reveal flex flex-col justify-between min-h-[300px]">
                <div>
                  <div className="f-num">02</div>
                  <h3>Monthly Workload Pipeline</h3>
                  <p>Multiple recurring tasks, each with its own execution frequency, model tier, and quality requirements.</p>
                </div>
                <Link href="/strategy/new/monthly" className="f-link mt-8">
                  <span>Build Monthly Pipeline</span> <span>&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SLIDE 6: PRICING PLANS ============ */}
        <section className={`slide ${currentIdx === 5 ? "active" : ""}`} data-section="Pricing plans">
          <div className="slide-inner s-compare">
            <div className="s-compare-head">
              <div className="eyebrow reveal">
                <span className="dt" />
                Simple pricing
              </div>
              <h2 className="h-display reveal">Pay for complete answers, not a fake success screen.</h2>
              <p className="body-lg reveal">
                Transparent plans with verified Stripe Checkout. Upgrade or cancel anytime without hidden fees.
              </p>
            </div>
            <div className="feature-grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="feature glass-card reveal p-8 flex flex-col justify-between">
                <div>
                  <div className="font-mono text-xs text-ink-3 uppercase mb-3">Free Plan</div>
                  <div className="metric-num grd font-sans text-3xl font-bold mb-3">$0</div>
                  <p className="body-md text-xs text-ink-2 mb-6 leading-relaxed">Understand one task before deciding whether to pay.</p>
                  <ul className="space-y-3 text-xs text-ink-2 mb-6">
                    <li>&bull; Account and onboarding</li>
                    <li>&bull; One task analysis</li>
                    <li>&bull; Editable workflow preview</li>
                    <li>&bull; Limited recommendation summary</li>
                  </ul>
                </div>
                <Link href="/sign-up" className="btn-secondary text-xs w-full justify-center">
                  Start Free
                </Link>
              </div>

              <div className="feature glass-card reveal p-8 flex flex-col justify-between border-2 border-indigo-500/50 relative">
                <span className="recommended-badge absolute -top-3 right-6">★ RECOMMENDED</span>
                <div>
                  <div className="font-mono text-xs text-indigo-soft uppercase mb-3">Plus Plan</div>
                  <div className="metric-num grd font-sans text-3xl font-bold mb-3">$19 <span style={{ fontSize: "14px", fontWeight: 400, color: "var(--ink-3)" }}>/ month</span></div>
                  <p className="body-md text-xs text-ink-2 mb-6 leading-relaxed">Complete plans and alternatives for individual work.</p>
                  <ul className="space-y-3 text-xs text-ink-2 mb-6">
                    <li>&bull; Full AI Strategy Plans</li>
                    <li>&bull; Unlimited saved strategies</li>
                    <li>&bull; Primary evidence verification</li>
                    <li>&bull; Monthly workflow recommendations</li>
                  </ul>
                </div>
                <Link href="/sign-up" className="btn-primary text-xs w-full justify-center">
                  Choose Plus &rarr;
                </Link>
              </div>

              <div className="feature glass-card reveal p-8 flex flex-col justify-between">
                <div>
                  <div className="font-mono text-xs text-pink-soft uppercase mb-3">Enterprise Plan</div>
                  <div className="metric-num grd font-sans text-3xl font-bold mb-3">Custom</div>
                  <p className="body-md text-xs text-ink-2 mb-6 leading-relaxed">Organisation access and dedicated support without admin bloat.</p>
                  <ul className="space-y-3 text-xs text-ink-2 mb-6">
                    <li>&bull; Organisation workspace</li>
                    <li>&bull; Custom API access</li>
                    <li>&bull; Implementation support</li>
                    <li>&bull; SLA &amp; dedicated manager</li>
                  </ul>
                </div>
                <a href="mailto:sales@benchflow.app" className="btn-secondary text-xs w-full justify-center">
                  Contact Sales
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SLIDE 7: GET STARTED (CTA) ============ */}
        <section className={`slide ${currentIdx === 6 ? "active" : ""}`} data-section="Get started">
          <div className="slide-inner s-cta">
            <div className="s-cta-inner">
              <div className="s-cta-glow" />
              <div className="eyebrow reveal">
                <span className="dt" />
                Available today
              </div>
              <h2 className="h-display">
                <span className="mw"><span>Start <span className="grd">optimizing</span></span></span><br />
                <span className="mw"><span>your AI stack.</span></span>
              </h2>
              <p className="body-lg reveal" style={{ maxWidth: 580 }}>
                Free to start. No credit card required. Describe your project and BENCHFLOW will deliver an actionable AI stack plan in seconds.
              </p>
              <div className="s-cta-row reveal">
                <Link href="/sign-up" className="btn-primary">
                  Build My AI Strategy &rarr;
                </Link>
                <Link href="/choose-usage" className="btn-secondary">
                  Create Workflow
                </Link>
              </div>
              <div className="s-cta-launch-info reveal">
                <div className="launch-item">
                  <span className="li-l">Pricing</span>
                  <span className="li-v">From <span className="accent">$0</span> / month</span>
                </div>
                <div className="launch-item">
                  <span className="li-l">Available</span>
                  <span className="li-v">1,200+ models indexed</span>
                </div>
                <div className="launch-item">
                  <span className="li-l">Compliance</span>
                  <span className="li-v">SOC 2 &middot; ISO 27001 &middot; HIPAA</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
