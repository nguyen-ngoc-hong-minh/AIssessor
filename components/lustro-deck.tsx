"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, X, ChevronRight, Sparkles, Layers, ShieldCheck, Zap, Cpu } from "lucide-react";

export function LustroDeck() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const slidesCount = 9;

  const slidesData = [
    { section: "Cover", sub: "The launch headline" },
    { section: "The problem", sub: "Why teams struggle today" },
    { section: "Introducing BENCHFLOW", sub: "The optimization engine" },
    { section: "What's new", sub: "Four core capabilities" },
    { section: "Roadmap", sub: "What ships next" },
    { section: "Early signals", sub: "Numbers from benchmark beta" },
    { section: "Compare", sub: "BENCHFLOW vs manual procurement" },
    { section: "AI Catalog", sub: "Indexed AI products" },
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
      if (/^[1-9]$/.test(e.key)) {
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
        BENCHFLOW <span className="slash">/</span> AI Stack Advisor
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
          <span>{String(currentIdx + 1).padStart(2, "0")}</span> / <span>09</span>
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
            <span>{String(currentIdx + 1).padStart(2, "0")}</span> / <span>09</span>
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
          <span><kbd>1</kbd>&ndash;<kbd>9</kbd> direct jump</span>
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
                  <div className="pc-icon">&hellip;</div>
                </div>
                <div className="problem-card glass-card reveal">
                  <div className="pc-num">02</div>
                  <div className="pc-body">
                    <h3>Hidden API &amp; usage limits</h3>
                    <p>Rate limits and unexpected usage bills cause surprise charges mid-project.</p>
                  </div>
                  <div className="pc-icon">&#9888;</div>
                </div>
                <div className="problem-card glass-card reveal">
                  <div className="pc-num">03</div>
                  <div className="pc-body">
                    <h3>Context &amp; privacy risks</h3>
                    <p>Lack of clarity on data privacy terms, server regions, and commercial licensing.</p>
                  </div>
                  <div className="pc-icon">&#10067;</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SLIDE 3: PRODUCT & MOCK UI ============ */}
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
                    <div className="pf-ic">&#9889;</div>
                    <span>Natural language workflow</span>
                  </div>
                  <div className="pf">
                    <div className="pf-ic">&#9737;</div>
                    <span>Verified benchmark evidence</span>
                  </div>
                  <div className="pf">
                    <div className="pf-ic">&#9728;</div>
                    <span>Plain-English summaries</span>
                  </div>
                  <div className="pf">
                    <div className="pf-ic">&#9986;</div>
                    <span>Consolidated subscription savings</span>
                  </div>
                </div>
                <div className="s-product-cta reveal">
                  <Link href="/sign-up" className="btn-primary">
                    Build Strategy &rarr;
                  </Link>
                  <Link href="/choose-usage" className="btn-secondary">
                    View Demo
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

        {/* ============ SLIDE 4: FEATURES ============ */}
        <section className={`slide ${currentIdx === 3 ? "active" : ""}`} data-section="What's new">
          <div className="slide-inner s-features">
            <div className="s-features-head">
              <div className="sf-l">
                <div className="eyebrow reveal">
                  <span className="dt" />
                  What's new
                </div>
                <h2 className="h-display reveal">Built for teams that ship calmly.</h2>
              </div>
              <p className="sf-r reveal">
                Four capabilities, deeply integrated. No technical jargon to learn, no extra subscriptions to waste. Just describe your work and get an optimized stack.
              </p>
            </div>
            <div className="feature-grid">
              <div className="feature glass-card reveal">
                <div className="f-num">01</div>
                <div className="f-ic">&#9889;</div>
                <h3>Natural-language ops</h3>
                <p>"Build a market analysis and brand launch workflow." BENCHFLOW maps required capabilities to verified AI tools.</p>
                <a className="f-link">Learn more <span>&rarr;</span></a>
              </div>
              <div className="feature glass-card reveal">
                <div className="f-num">02</div>
                <div className="f-ic">&#9737;</div>
                <h3>Smart Tool Matching</h3>
                <p>Automatic signal grouping across models. Perplexity for research, Claude for strategy, Lovable for web builds.</p>
                <a className="f-link">Learn more <span>&rarr;</span></a>
              </div>
              <div className="feature glass-card reveal">
                <div className="f-num">03</div>
                <div className="f-ic">&#9728;</div>
                <h3>Daily Cost Briefings</h3>
                <p>Consolidated subscription views. See exact monthly costs and potential cancellations in one dashboard.</p>
                <a className="f-link">Learn more <span>&rarr;</span></a>
              </div>
              <div className="feature glass-card reveal">
                <div className="f-num">04</div>
                <div className="f-ic">&#9986;</div>
                <h3>Drop-in Compatibility</h3>
                <p>Works with existing OpenAI, Anthropic, Google, and open-source models. Zero code changes required.</p>
                <a className="f-link">Learn more <span>&rarr;</span></a>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SLIDE 5: ROADMAP ============ */}
        <section className={`slide ${currentIdx === 4 ? "active" : ""}`} data-section="Roadmap">
          <div className="slide-inner s-roadmap">
            <div className="s-roadmap-head">
              <div className="eyebrow reveal">
                <span className="dt" />
                The road ahead
              </div>
              <h2 className="h-display reveal">Shipping forward, one quarter at a time.</h2>
              <p className="body-lg reveal">
                A transparent four-quarter roadmap. We commit publicly so you can plan your AI stack with confidence.
              </p>
            </div>
            <div className="timeline">
              <div className="tl-item now reveal">
                <div className="tl-quarter">Q2 / 2026</div>
                <div className="tl-status"><span className="s-dot" /><span>Shipping now</span></div>
                <div className="tl-card">
                  <h3>BENCHFLOW 4.0</h3>
                  <ul>
                    <li>Natural-language strategy builder</li>
                    <li>Consolidated subscription stack</li>
                    <li>6-Point empirical verification</li>
                    <li>14-region benchmarks</li>
                  </ul>
                </div>
              </div>
              <div className="tl-item reveal">
                <div className="tl-quarter">Q3 / 2026</div>
                <div className="tl-status"><span className="s-dot" /><span>In development</span></div>
                <div className="tl-card">
                  <h3>Team Intelligence</h3>
                  <ul>
                    <li>Shared team workspaces</li>
                    <li>Subscription seat management</li>
                    <li>Custom team budget caps</li>
                    <li>SAML / SSO suite</li>
                  </ul>
                </div>
              </div>
              <div className="tl-item reveal">
                <div className="tl-quarter">Q4 / 2026</div>
                <div className="tl-status"><span className="s-dot" /><span>Planned</span></div>
                <div className="tl-card">
                  <h3>Predictive Layer</h3>
                  <ul>
                    <li>Automatic model update alerts</li>
                    <li>API usage forecasting</li>
                    <li>Auto-remediation runbooks</li>
                    <li>On-call AI procurement bot</li>
                  </ul>
                </div>
              </div>
              <div className="tl-item reveal">
                <div className="tl-quarter">Q1 / 2027</div>
                <div className="tl-status"><span className="s-dot" /><span>Exploring</span></div>
                <div className="tl-card">
                  <h3>Open Ecosystem</h3>
                  <ul>
                    <li>Public Benchmark SDK</li>
                    <li>Third-party AI plugins</li>
                    <li>Air-gapped enterprise deploys</li>
                    <li>FedRAMP certification</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SLIDE 6: METRICS ============ */}
        <section className={`slide ${currentIdx === 5 ? "active" : ""}`} data-section="Early signals">
          <div className="slide-inner s-metrics">
            <div className="s-metrics-head">
              <div className="eyebrow reveal">
                <span className="dt" />
                From the closed beta
              </div>
              <h2 className="h-display reveal">
                The numbers from <span className="grd">410 teams</span> using BENCHFLOW.
              </h2>
            </div>
            <div className="metric-grid">
              <div className="metric glass-card reveal">
                <div>
                  <div className="metric-num grd">65<span className="unit">%</span></div>
                  <div className="metric-lbl">average software cost savings per team</div>
                </div>
                <div className="metric-spark">
                  <svg viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,18 L15,16 L30,12 L45,14 L60,8 L75,6 L90,4 L100,3" />
                  </svg>
                </div>
              </div>
              <div className="metric glass-card reveal">
                <div>
                  <div className="metric-num grd">1,200<span className="unit">+</span></div>
                  <div className="metric-lbl">indexed AI models, benchmarks &amp; rate limits</div>
                </div>
                <div className="metric-spark">
                  <svg viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,4 L15,8 L30,6 L45,12 L60,14 L75,16 L90,18 L100,20" />
                  </svg>
                </div>
              </div>
              <div className="metric glass-card reveal">
                <div>
                  <div className="metric-num grd">4.9<span className="unit">/5</span></div>
                  <div className="metric-lbl">customer satisfaction across verified reviews</div>
                </div>
                <div className="metric-spark">
                  <svg viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,12 L15,10 L30,8 L45,7 L60,5 L75,4 L90,3 L100,2" />
                  </svg>
                </div>
              </div>
              <div className="metric glass-card reveal">
                <div>
                  <div className="metric-num grd">$39<span className="unit">/mo</span></div>
                  <div className="metric-lbl">average monthly savings per project strategy</div>
                </div>
                <div className="metric-spark">
                  <svg viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path d="M0,20 L15,16 L30,14 L45,10 L60,8 L75,6 L90,4 L100,3" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="s-metrics-quote glass-card reveal">
              <div className="q-mark">&ldquo;</div>
              <blockquote>
                BENCHFLOW is the first AI tool advisor we haven't had to second-guess. It just&hellip; <em style={{ color: "var(--indigo-soft)", fontStyle: "normal" }}>shows us what actually works</em>.
              </blockquote>
              <div className="q-attr">
                <strong>Maya Rodriguez</strong>
                <span>VP Engineering, Northwind</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SLIDE 7: COMPARISON TABLE ============ */}
        <section className={`slide ${currentIdx === 6 ? "active" : ""}`} data-section="Compare">
          <div className="slide-inner s-compare">
            <div className="s-compare-head">
              <div className="eyebrow reveal">
                <span className="dt" />
                How we compare
              </div>
              <h2 className="h-display reveal">The capabilities that matter, side by side.</h2>
              <p className="body-lg reveal">
                An honest, feature-by-feature comparison against manual tool selection and traditional SaaS directories.
              </p>
            </div>
            <div className="cmp-table-wrap glass-card reveal">
              <table className="cmp-table">
                <thead>
                  <tr>
                    <th>Capability</th>
                    <th className="featured center">
                      <div className="vendor-name">
                        <span className="v-logo" />
                        BENCHFLOW Engine
                      </div>
                      <span className="recommended-badge">Recommended</span>
                    </th>
                    <th className="center">Manual Search</th>
                    <th className="center">SaaS Directories</th>
                    <th className="center">Generic AI Chat</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Natural-language workflow build</td>
                    <td className="featured"><span className="check">&#10003;</span></td>
                    <td className="center"><span className="cross">&#10005;</span></td>
                    <td className="center"><span className="cross">&#10005;</span></td>
                    <td className="center"><span className="partial">Partial</span></td>
                  </tr>
                  <tr>
                    <td>Verifiable primary benchmark evidence</td>
                    <td className="featured"><span className="check">&#10003;</span></td>
                    <td className="center"><span className="partial">Manual</span></td>
                    <td className="center"><span className="cross">&#10005;</span></td>
                    <td className="center"><span className="cross">&#10005;</span></td>
                  </tr>
                  <tr>
                    <td>Consolidated subscription savings</td>
                    <td className="featured"><span className="check">&#10003;</span></td>
                    <td className="center"><span className="cross">&#10005;</span></td>
                    <td className="center"><span className="cross">&#10005;</span></td>
                    <td className="center"><span className="cross">&#10005;</span></td>
                  </tr>
                  <tr>
                    <td>OpenTelemetry &amp; model API checks</td>
                    <td className="featured"><span className="check">&#10003;</span></td>
                    <td className="center"><span className="check">&#10003;</span></td>
                    <td className="center"><span className="cross">&#10005;</span></td>
                    <td className="center"><span className="partial">Partial</span></td>
                  </tr>
                  <tr>
                    <td>Median time-to-first-strategy</td>
                    <td className="featured" style={{ color: "var(--green)", fontWeight: 600 }}>&lt; 3 secs</td>
                    <td className="center">4.5 hours</td>
                    <td className="center">2 hours</td>
                    <td className="center">15 mins</td>
                  </tr>
                  <tr>
                    <td>Base tier pricing</td>
                    <td className="featured" style={{ color: "var(--indigo-soft)", fontWeight: 600 }}>Free / $19</td>
                    <td className="center">Free</td>
                    <td className="center">$49/mo</td>
                    <td className="center">$20/mo</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="cmp-footnote">Source &middot; BENCHFLOW Benchmark Engine &middot; Primary Source Snapshots 2026</div>
          </div>
        </section>

        {/* ============ SLIDE 8: AI CATALOG / DISCOVERY ============ */}
        <section className={`slide ${currentIdx === 7 ? "active" : ""}`} data-section="AI Catalog">
          <div className="slide-inner s-more">
            <div className="s-more-head">
              <div className="sm-l">
                <div className="eyebrow reveal">
                  <span className="dt" />
                  AI Catalog
                </div>
                <h2 className="h-display reveal">
                  Top evaluated <span className="grd">AI products</span>.
                </h2>
              </div>
              <p className="sm-r reveal">
                Four of the leading AI models continuously benchmarked in BENCHFLOW.
              </p>
            </div>
            <div className="more-grid">
              <div className="more-card glass-card">
                <div className="mc-thumb">
                  <Cpu className="w-10 h-10 text-indigo-400" />
                </div>
                <div className="mc-body">
                  <div className="mc-tag"><span className="pip" />PERPLEXITY PRO</div>
                  <div className="mc-title">Deep Research</div>
                  <div className="mc-desc">Live citation sources and competitor synthesis with zero hallucinated data.</div>
                  <div className="mc-cta">View evaluation <span>&rarr;</span></div>
                </div>
              </div>

              <div className="more-card glass-card">
                <div className="mc-thumb">
                  <Sparkles className="w-10 h-10 text-pink-400" />
                </div>
                <div className="mc-body">
                  <div className="mc-tag"><span className="pip" />CLAUDE 3.5 SONNET</div>
                  <div className="mc-title">Strategy &amp; Logic</div>
                  <div className="mc-desc">High analytical reasoning score and 200k context window for strategy briefs.</div>
                  <div className="mc-cta">View evaluation <span>&rarr;</span></div>
                </div>
              </div>

              <div className="more-card glass-card">
                <div className="mc-thumb">
                  <Layers className="w-10 h-10 text-cyan-400" />
                </div>
                <div className="mc-body">
                  <div className="mc-tag"><span className="pip" />MIDJOURNEY V6</div>
                  <div className="mc-title">Visual Generation</div>
                  <div className="mc-desc">Consistent brand aesthetic output and high resolution visual campaign assets.</div>
                  <div className="mc-cta">View evaluation <span>&rarr;</span></div>
                </div>
              </div>

              <div className="more-card glass-card">
                <div className="mc-thumb">
                  <Zap className="w-10 h-10 text-emerald-400" />
                </div>
                <div className="mc-body">
                  <div className="mc-tag"><span className="pip" />LOVABLE PRO</div>
                  <div className="mc-title">Web App Generation</div>
                  <div className="mc-desc">Full-stack React &amp; Tailwind web application generation from design briefs.</div>
                  <div className="mc-cta">View evaluation <span>&rarr;</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SLIDE 9: CTA ============ */}
        <section className={`slide ${currentIdx === 8 ? "active" : ""}`} data-section="Get started">
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
