"use client";

import { Show, UserButton } from "@clerk/nextjs";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleDollarSign,
  Gauge,
  Layers3,
  LockKeyhole,
  MousePointer2,
  RefreshCw,
  Search,
  ShieldCheck,
  Target,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Brand } from "./brand";
import { authConfigured } from "./providers";

const chapters = [
  { id: "cover", label: "Start", sub: "The AI stack advisor" },
  { id: "problem", label: "The problem", sub: "Why choosing tools is hard" },
  { id: "product", label: "Aissessor", sub: "Start with the work" },
  { id: "modes", label: "Ways to plan", sub: "Project or monthly work" },
  { id: "process", label: "Process", sub: "Four clear steps" },
  { id: "checks", label: "Evidence checks", sub: "How options qualify" },
  { id: "summary", label: "Your strategy", sub: "Tools, plans, and costs" },
  { id: "pricing", label: "Pricing", sub: "Start free" },
  { id: "start", label: "Get started", sub: "Build your AI strategy" },
];

const problems = [
  ["01", "Too many choices", "New AI products launch constantly, but most comparisons ignore the work you actually need to finish."],
  ["02", "Hidden total cost", "A cheap tool can become an expensive stack once overlapping subscriptions and usage fees are added."],
  ["03", "Evidence goes stale", "Capabilities, prices, access, and privacy terms change faster than static recommendation lists."],
];

const checks = [
  { icon: Target, code: "01", title: "Task fit", text: "Can the option complete the required work?" },
  { icon: Gauge, code: "02", title: "Quality", text: "Is there relevant evidence for this type of task?" },
  { icon: CircleDollarSign, code: "03", title: "Price", text: "What is the real plan and usage cost?" },
  { icon: Zap, code: "04", title: "Speed", text: "Will it meet the deadline and workload?" },
  { icon: LockKeyhole, code: "05", title: "Privacy", text: "Can the data be handled under your requirements?" },
  { icon: ShieldCheck, code: "06", title: "Access", text: "Is the product available and usable for you?" },
];

const process = [
  ["01", "Describe the work", "Write the goal, budget, deadline, and priorities in normal language."],
  ["02", "Review the workflow", "For projects, check and edit the steps before any recommendation is generated."],
  ["03", "Compare qualified options", "Aissessor checks capability, evidence, price, speed, privacy, and access."],
  ["04", "Save the strategy", "Return to the tools, subscription plans, alternatives, and costs whenever you need them."],
];

const verticalGridLines = Array.from({ length: 21 });
const horizontalGridLines = Array.from({ length: 13 });

function DeckAuthActions() {
  if (!authConfigured) {
    return <><Link href="/sign-in" className="lustro-text-link">Log in</Link><Link href="/sign-up" className="lustro-primary-action">Build strategy <ArrowUpRight /></Link></>;
  }

  return <>
    <Show when="signed-out">
      <Link href="/sign-in" className="lustro-text-link">Log in</Link>
      <Link href="/sign-up" className="lustro-primary-action">Build strategy <ArrowUpRight /></Link>
    </Show>
    <Show when="signed-in">
      <Link href="/dashboard" className="lustro-text-link">Dashboard</Link>
      <UserButton userProfileMode="navigation" userProfileUrl="/settings" />
    </Show>
  </>;
}

export function LustroLanding() {
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const deckRef = useRef<HTMLElement>(null);
  const touchStart = useRef({ x: 0, y: 0 });
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((next: number) => {
    if (next < 0 || next >= chapters.length || next === active || transitioning) return;
    setTransitioning(true);
    setActive(next);
    window.history.replaceState(null, "", `#${chapters[next].id}`);
    deckRef.current?.querySelector<HTMLElement>(`#${chapters[next].id}`)?.scrollTo({ top: 0 });
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    transitionTimer.current = setTimeout(() => setTransitioning(false), 760);
  }, [active, transitioning]);

  useEffect(() => {
    document.body.classList.add("lustro-page-active");
    const syncChapterFromHash = () => {
      const chapter = chapters.findIndex(({ id }) => `#${id}` === window.location.hash);
      if (chapter >= 0) setActive(chapter);
    };
    const initialFrame = window.requestAnimationFrame(syncChapterFromHash);
    window.addEventListener("hashchange", syncChapterFromHash);

    return () => {
      document.body.classList.remove("lustro-page-active");
      window.removeEventListener("hashchange", syncChapterFromHash);
      window.cancelAnimationFrame(initialFrame);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key === "Escape") setMenuOpen(false);
      if (menuOpen) return;
      if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "PageDown") goTo(active + 1);
      if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "PageUp") goTo(active - 1);
      if (/^[1-9]$/.test(event.key)) goTo(Number(event.key) - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active, goTo, menuOpen]);

  useEffect(() => () => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
  }, []);

  const selectChapter = (index: number) => {
    setMenuOpen(false);
    goTo(index);
  };

  const onTouchStart = (event: React.TouchEvent) => {
    touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const dx = event.changedTouches[0].clientX - touchStart.current.x;
    const dy = event.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) goTo(dx < 0 ? active + 1 : active - 1);
  };

  return <main className="lustro-deck" ref={deckRef} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
    <div className="lustro-grid" aria-hidden="true">
      <div className="lustro-grid-vertical">{verticalGridLines.map((_, index) => <i key={index} />)}</div>
      <div className="lustro-grid-horizontal">{horizontalGridLines.map((_, index) => <i key={index} />)}</div>
    </div>
    <header className="lustro-chrome">
      <Brand />
      <div className="lustro-account"><DeckAuthActions /></div>
    </header>

    <section id="cover" className={`lustro-slide lustro-cover ${active === 0 ? "active" : ""}`} aria-hidden={active !== 0}>
      <div className="lustro-slide-inner lustro-cover-inner">
        <div className="lustro-eyebrow lustro-reveal"><span /> Evidence-led AI stack advisor</div>
        <h1 className="lustro-cover-headline">
          <span className="lustro-cover-line"><span><em>Aissessor</em> is here.</span></span>
          <span className="lustro-cover-line"><span>AI stack, finally clear.</span></span>
        </h1>
        <p className="lustro-body-lg lustro-reveal">Audit overlapping subscriptions, choose the smallest effective AI stack for your actual work, and stop paying for duplicate tools.</p>
        <div className="lustro-cover-meta lustro-reveal">
          <span>For freelancers</span><i />
          <span>Small team workflows</span><i />
          <span>Zero duplicate seats</span>
        </div>
        <div className="lustro-actions lustro-reveal">
          <Link href="/sign-up" className="lustro-primary-action">Build my AI strategy <ArrowRight /></Link>
          <button type="button" className="lustro-secondary-action" onClick={() => goTo(1)}>See how it works</button>
        </div>
        <div className="lustro-cover-version">PRODUCT / DECK / 0001 · AISSESSOR</div>
      </div>
    </section>

    <section id="problem" className={`lustro-slide ${active === 1 ? "active" : ""}`} aria-hidden={active !== 1}>
      <div className="lustro-slide-inner lustro-two-column">
        <div className="lustro-chapter-copy">
          <div className="lustro-eyebrow lustro-reveal"><span /> The problem</div>
          <h2 className="lustro-display lustro-reveal">More subscriptions.<br /><em>Less certainty.</em></h2>
          <p className="lustro-body-lg lustro-reveal">Choosing an AI tool is easy. Building a stack that works together, fits the budget, and stays current is not.</p>
        </div>
        <div className="lustro-problem-list">
          {problems.map(([number, title, text]) => <article className="lustro-problem-row lustro-reveal" key={number}>
            <span>{number}</span><div><h3>{title}</h3><p>{text}</p></div><ArrowUpRight />
          </article>)}
        </div>
      </div>
    </section>

    <section id="product" className={`lustro-slide ${active === 2 ? "active" : ""}`} aria-hidden={active !== 2}>
      <div className="lustro-slide-inner lustro-two-column">
        <div className="lustro-chapter-copy">
          <div className="lustro-eyebrow lustro-reveal"><span /> Aissessor</div>
          <h2 className="lustro-display lustro-reveal">Start with the work.<br /><em>Not a leaderboard.</em></h2>
          <p className="lustro-body-lg lustro-reveal">Aissessor understands the task first, then compares only the AI-first products that can help complete it.</p>
          <div className="lustro-feature-pairs lustro-reveal">
            <span><Search /> Current evidence</span><span><Layers3 /> Multi-tool combinations</span><span><CircleDollarSign /> Plan-level costs</span><span><ShieldCheck /> Clear limitations</span>
          </div>
        </div>
        <div className="lustro-stack-visual lustro-reveal" aria-label="A task flows through evidence checks into an AI stack">
          <div className="stack-input"><small>Your work</small><strong>Launch campaign</strong></div>
          <div className="stack-route"><i /><i /><i /></div>
          <div className="stack-output"><small>Qualified AI stack</small><strong>Research AI</strong><strong>Writing AI</strong><strong>Visual AI</strong><footer><Check /> Plans consolidated</footer></div>
        </div>
      </div>
    </section>

    <section id="modes" className={`lustro-slide ${active === 3 ? "active" : ""}`} aria-hidden={active !== 3}>
      <div className="lustro-slide-inner lustro-feature-slide">
        <div className="lustro-slide-heading">
          <div><div className="lustro-eyebrow lustro-reveal"><span /> Two ways to plan</div><h2 className="lustro-display lustro-reveal">Choose the shape of your work.</h2></div>
          <p className="lustro-body-lg lustro-reveal">A defined project needs a reviewed workflow. Recurring work can move directly from task analysis to stack matching.</p>
        </div>
        <div className="lustro-mode-grid">
          <article className="lustro-mode-card lustro-reveal"><span>01</span><MousePointer2 /><small>One clear outcome</small><h3>One-off Project</h3><p>Create and approve an editable workflow before Aissessor recommends the tools for each step.</p><Link href="/strategy/new/one-off">Plan a project <ArrowRight /></Link></article>
          <article className="lustro-mode-card lustro-mode-featured lustro-reveal"><span>02</span><RefreshCw /><small>Work that repeats</small><h3>Monthly Workflow</h3><p>Describe recurring tasks and move straight to the AI stack, plan, and monthly subscription summary.</p><Link href="/strategy/new/monthly">Plan monthly work <ArrowRight /></Link></article>
        </div>
      </div>
    </section>

    <section id="process" className={`lustro-slide ${active === 4 ? "active" : ""}`} aria-hidden={active !== 4}>
      <div className="lustro-slide-inner lustro-process-slide">
        <div className="lustro-slide-heading">
          <div><div className="lustro-eyebrow lustro-reveal"><span /> The process</div><h2 className="lustro-display lustro-reveal">From task to strategy in four steps.</h2></div>
        </div>
        <div className="lustro-timeline">
          {process.map(([number, title, text], index) => <article className="lustro-timeline-item lustro-reveal" key={number}>
            <div className="timeline-marker"><span>{number}</span><i className={index === 3 ? "complete" : ""} /></div>
            <div><h3>{title}</h3><p>{text}</p></div>
          </article>)}
        </div>
      </div>
    </section>

    <section id="checks" className={`lustro-slide ${active === 5 ? "active" : ""}`} aria-hidden={active !== 5}>
      <div className="lustro-slide-inner lustro-feature-slide">
        <div className="lustro-slide-heading">
          <div><div className="lustro-eyebrow lustro-reveal"><span /> Evidence checks</div><h2 className="lustro-display lustro-reveal">A recommendation has to survive the real world.</h2></div>
          <p className="lustro-body-lg lustro-reveal">Options are checked against the task and the way you plan to use them. Partial matches stay visible, with the gap explained.</p>
        </div>
        <div className="lustro-check-grid">
          {checks.map(({ icon: Icon, code, title, text }) => <article className="lustro-check-card lustro-reveal" key={code}><header><span>{code}</span><Icon /></header><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </div>
    </section>

    <section id="summary" className={`lustro-slide ${active === 6 ? "active" : ""}`} aria-hidden={active !== 6}>
      <div className="lustro-slide-inner lustro-summary-slide">
        <div className="lustro-slide-heading">
          <div><div className="lustro-eyebrow lustro-reveal"><span /> Your strategy</div><h2 className="lustro-display lustro-reveal">Know what to use and what to buy.</h2></div>
          <p className="lustro-body-lg lustro-reveal">Every task includes options and reasons. The final table combines shared subscriptions so plans are not counted twice.</p>
        </div>
        <div className="lustro-summary-table lustro-reveal">
          <header><span>Task</span><span>AI-first setup</span><span>Reason</span><span>Plan</span></header>
          <div><strong>Research</strong><span>Research assistant</span><span>Current sources and citations</span><b>Pro</b></div>
          <div><strong>Draft content</strong><span>Writing model</span><span>Long context and editing quality</span><b>Included</b></div>
          <div><strong>Create visuals</strong><span>Image generator</span><span>Fast, consistent campaign assets</span><b>Standard</b></div>
          <footer><span>Monthly subscription summary</span><strong>One consolidated total</strong></footer>
        </div>
      </div>
    </section>

    <section id="pricing" className={`lustro-slide ${active === 7 ? "active" : ""}`} aria-hidden={active !== 7}>
      <div className="lustro-slide-inner lustro-pricing-slide">
        <div className="lustro-slide-heading">
          <div><div className="lustro-eyebrow lustro-reveal"><span /> Pricing</div><h2 className="lustro-display lustro-reveal">Start free. Upgrade when the full plan helps.</h2></div>
        </div>
        <div className="lustro-pricing-grid">
          <article className="lustro-plan lustro-reveal"><small>STARTER</small><h3>$2.99 <em>/ month</em></h3><p>3 AI Task Assessments, AI recommendation, cost estimate &amp; 3 saved strategies.</p><Link href="/sign-up">Start Starter <ArrowRight /></Link></article>
          <article className="lustro-plan lustro-plan-featured lustro-reveal"><span>Recommended</span><small>OPTIMISE</small><h3>$9.99 <em>/ month</em></h3><p>20 AI Task Assessments, full AI workflow, subscription optimisation &amp; monthly recommendations.</p><Link href="/choose-usage">Start Optimise <ArrowRight /></Link></article>
          <article className="lustro-plan lustro-reveal"><small>TEAM</small><h3>CUSTOM</h3><p>Custom AI Task Assessments, shared AI workspace, team cost tracking &amp; recommendations.</p><a href="mailto:sales@aissessor.app">Contact Sales <ArrowRight /></a></article>
        </div>
      </div>
    </section>

    <section id="start" className={`lustro-slide lustro-final ${active === 8 ? "active" : ""}`} aria-hidden={active !== 8}>
      <div className="lustro-slide-inner lustro-final-inner">
        <div className="lustro-eyebrow lustro-reveal"><span /> Ready when you are</div>
        <h2 className="lustro-display lustro-reveal">Start with the work.<br /><em>We will help with the stack.</em></h2>
        <p className="lustro-body-lg lustro-reveal">Create a strategy, compare qualified AI-first options, and keep the result ready for the next time you return.</p>
        <div className="lustro-actions lustro-reveal"><Link href="/sign-up" className="lustro-primary-action">Build my AI strategy <ArrowRight /></Link><Link href="/how-it-works" className="lustro-secondary-action">Read how it works</Link></div>
        <div className="lustro-final-links lustro-reveal"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><a href="https://templatemo.com/tm-624-lustro-slideshow" target="_blank" rel="nofollow noopener">Design base: TemplateMo</a></div>
      </div>
    </section>

    <div className="lustro-section-status" aria-live="polite"><span /><div><small>{String(active + 1).padStart(2, "0")}</small><strong>{chapters[active].label}</strong></div></div>
    <div className="lustro-next-hint">{active < chapters.length - 1 ? <>Next <span>{chapters[active + 1].label}</span></> : <>Complete <span>Build your strategy</span></>}</div>
    <a className="lustro-credit" href="https://templatemo.com/tm-624-lustro-slideshow" target="_blank" rel="nofollow noopener">TemplateMo <span /></a>

    <nav className="lustro-deck-nav" aria-label="Presentation navigation">
      <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous chapter"><ArrowLeft /></button>
      <button type="button" className={menuOpen ? "open" : ""} onClick={() => setMenuOpen(true)} aria-label="Open chapter menu"><span className="lustro-menu-icon"><i /><i /><i /></span></button>
      <div><span>{String(active + 1).padStart(2, "0")}</span> / {String(chapters.length).padStart(2, "0")}</div>
      <button type="button" onClick={() => goTo(active + 1)} disabled={active === chapters.length - 1} aria-label="Next chapter"><ArrowRight /></button>
    </nav>

    <div className={`lustro-menu-overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />
    <aside className={`lustro-menu-panel ${menuOpen ? "open" : ""}`} role="dialog" aria-modal="true" aria-label="Choose a chapter">
      <header><div><small>Navigate</small><h2>Choose a chapter</h2></div><button type="button" onClick={() => setMenuOpen(false)} aria-label="Close chapter menu"><X /></button></header>
      <div className="lustro-menu-list">{chapters.map((chapter, index) => <button type="button" className={index === active ? "current" : ""} onClick={() => selectChapter(index)} key={chapter.id}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{chapter.label}</strong><small>{chapter.sub}</small></div><ArrowRight /></button>)}</div>
      <footer><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><a href="https://templatemo.com" target="_blank" rel="nofollow noopener">TemplateMo</a></footer>
    </aside>
  </main>;
}
