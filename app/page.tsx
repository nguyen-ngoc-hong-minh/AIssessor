"use client";

import { useEffect, useMemo, useState } from "react";

type View = "planner" | "models" | "dashboard" | "pricing";
type Priority = "Balanced" | "Lowest cost" | "Highest quality" | "Fastest workflow" | "Privacy";

const models = [
  {
    name: "GPT-5.6 Luna",
    variant: "High reasoning",
    mark: "O",
    color: "mint",
    intelligence: 46,
    speed: 197.5,
    price: "$1.00 / $6.00",
    privacy: "No API training by default",
    license: "Proprietary",
    fit: "Fast reasoning & structured work",
    source: "https://artificialanalysis.ai/models/gpt-5-6-luna-high/",
  },
  {
    name: "Gemini 3.5 Flash",
    variant: "High reasoning",
    mark: "G",
    color: "blue",
    intelligence: 50,
    speed: 186.1,
    price: "$1.50 / $9.00",
    privacy: "Vertex AI training restriction",
    license: "Proprietary",
    fit: "Research, multimodal & volume",
    source: "https://artificialanalysis.ai/models/gemini-3-5-flash/",
  },
  {
    name: "Claude Opus 5",
    variant: "Medium reasoning",
    mark: "A",
    color: "sand",
    intelligence: 56,
    speed: 50.1,
    price: "$5.00 / $25.00",
    privacy: "No commercial-data training",
    license: "Proprietary",
    fit: "Premium synthesis & final review",
    source: "https://artificialanalysis.ai/models/claude-opus-5-medium",
  },
  {
    name: "Kimi K3",
    variant: "Reasoning",
    mark: "K",
    color: "violet",
    intelligence: 57,
    speed: 33.3,
    price: "$3.00 / $15.00",
    privacy: "Self-hosting possible",
    license: "Commercial license required",
    fit: "Private, open-weight deployment",
    source: "https://artificialanalysis.ai/models/kimi-k3/",
  },
];

const tasks = [
  { title: "Research & source review", detail: "Search, extract, compare and cite", frequency: "12× / mo", model: "Gemini 3.5 Flash", cost: "$8.40" },
  { title: "Draft long-form content", detail: "Outline, write and adapt tone", frequency: "20× / mo", model: "GPT-5.6 Luna", cost: "$6.80" },
  { title: "Quality & accuracy pass", detail: "Critique, fact-check and approve", frequency: "8× / mo", model: "Claude Opus 5", cost: "$5.60" },
];

const priorities: Priority[] = ["Balanced", "Lowest cost", "Highest quality", "Fastest workflow", "Privacy"];

export default function Home() {
  const [view, setView] = useState<View>("planner");
  const [stakeholder, setStakeholder] = useState("Individual");
  const [projectType, setProjectType] = useState("Monthly workflow");
  const [priority, setPriority] = useState<Priority>("Balanced");
  const [quality, setQuality] = useState(72);
  const [frequency, setFrequency] = useState(62);
  const [generated, setGenerated] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("benchflow-strategy");
    if (stored) setSaved(true);
  }, []);

  const estimate = useMemo(() => {
    const multiplier = priority === "Highest quality" ? 1.55 : priority === "Lowest cost" ? 0.62 : priority === "Privacy" ? 1.32 : priority === "Fastest workflow" ? 0.9 : 1;
    return (20.8 * multiplier * (0.7 + frequency / 200)).toFixed(2);
  }, [priority, frequency]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function saveStrategy() {
    localStorage.setItem("benchflow-strategy", JSON.stringify({ priority, projectType, estimate, savedAt: new Date().toISOString() }));
    setSaved(true);
    notify("Strategy saved to your dashboard");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => setView("planner")} aria-label="Go to planner">
          <span className="brand-mark"><i /><i /><i /></span>
          <span>Benchflow</span>
        </button>

        <nav aria-label="Primary navigation">
          <p className="nav-label">Workspace</p>
          <NavButton active={view === "dashboard"} icon="⌂" label="Overview" onClick={() => setView("dashboard")} />
          <NavButton active={view === "planner"} icon="✦" label="Strategy planner" onClick={() => setView("planner")} />
          <NavButton active={view === "models"} icon="◫" label="Model explorer" onClick={() => setView("models")} />
          <p className="nav-label nav-spacer">Account</p>
          <NavButton active={view === "pricing"} icon="◇" label="Plans & billing" onClick={() => setView("pricing")} />
          <NavButton active={false} icon="⚙" label="Settings" onClick={() => notify("Settings are ready for account integration")} />
        </nav>

        <div className="side-bottom">
          <div className="plan-card">
            <div className="plan-row"><span className="plan-icon">+</span><div><strong>Plus plan</strong><small>Unlimited strategies</small></div></div>
            <div className="usage-line"><span>3 strategies saved</span><span>38%</span></div>
            <div className="usage-track"><span /></div>
            <button onClick={() => setView("pricing")}>Manage plan <span>→</span></button>
          </div>
          <div className="profile-row">
            <span className="avatar">AT</span>
            <div><strong>Alex Tran</strong><small>alex@studio.co</small></div>
            <button aria-label="Open profile menu">•••</button>
          </div>
        </div>
      </aside>

      <main className="main">
        {view === "planner" && (
          <Planner
            stakeholder={stakeholder} setStakeholder={setStakeholder}
            projectType={projectType} setProjectType={setProjectType}
            priority={priority} setPriority={setPriority}
            quality={quality} setQuality={setQuality}
            frequency={frequency} setFrequency={setFrequency}
            generated={generated} setGenerated={setGenerated}
            estimate={estimate} saved={saved} saveStrategy={saveStrategy}
          />
        )}
        {view === "models" && <ModelExplorer notify={notify} />}
        {view === "dashboard" && <Dashboard saved={saved} estimate={estimate} setView={setView} notify={notify} />}
        {view === "pricing" && <Pricing notify={notify} />}
      </main>
      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
    </div>
  );
}

function NavButton({ active, icon, label, onClick }: { active: boolean; icon: string; label: string; onClick: () => void }) {
  return <button className={`nav-item ${active ? "active" : ""}`} onClick={onClick}><span>{icon}</span>{label}</button>;
}

function Planner(props: {
  stakeholder: string; setStakeholder: (v: string) => void;
  projectType: string; setProjectType: (v: string) => void;
  priority: Priority; setPriority: (v: Priority) => void;
  quality: number; setQuality: (v: number) => void;
  frequency: number; setFrequency: (v: number) => void;
  generated: boolean; setGenerated: (v: boolean) => void;
  estimate: string; saved: boolean; saveStrategy: () => void;
}) {
  const [taskCount, setTaskCount] = useState(3);
  const [description, setDescription] = useState("Create a repeatable content engine for research-led articles and client newsletters.");
  const visibleTasks = tasks.slice(0, taskCount);

  return (
    <div className="planner-page">
      <header className="topbar">
        <div><span className="eyebrow">New strategy</span><h1>Build your AI workflow</h1><p>Tell us what you do. We’ll map the work, compare the models, and optimize every dollar.</p></div>
        <div className="verified"><span>●</span> Benchmarks verified <b>Aug 6, 2026</b></div>
      </header>

      <div className="stepper" aria-label="Planner progress">
        <Step done number="1" title="Your profile" note={props.stakeholder} />
        <span className="step-line done" />
        <Step active number="2" title="Your workflow" note="Define tasks & priorities" />
        <span className="step-line" />
        <Step number="3" title="Your strategy" note="Compare & save" />
      </div>

      <section className="panel profile-strip">
        <div className="section-heading compact"><span className="section-icon">1</span><div><h2>Who is this strategy for?</h2><p>Three quick details personalize cost and privacy guidance.</p></div></div>
        <div className="segmented three">
          {["Individual", "Team", "Enterprise"].map((item) => <button key={item} className={props.stakeholder === item ? "selected" : ""} onClick={() => props.setStakeholder(item)}>{item === "Individual" ? "◎" : item === "Team" ? "◉" : "▦"}<span>{item}<small>{item === "Individual" ? "Just for me" : item === "Team" ? "2–50 people" : "50+ people"}</small></span></button>)}
        </div>
        <div className="mini-fields">
          {props.stakeholder === "Individual" && <><MiniField label="What do you do?" value="Content strategist" /><MiniField label="Main field" value="Marketing & media" /><MiniField label="Monthly AI budget" value="$50–$150" /></>}
          {props.stakeholder === "Team" && <><MiniField label="Team function" value="Marketing" /><MiniField label="Team size" value="6–15 people" /><MiniField label="Monthly AI budget" value="$500–$1,500" /></>}
          {props.stakeholder === "Enterprise" && <><MiniField label="Industry" value="Professional services" /><MiniField label="Company size" value="500–1,000" /><MiniField label="Main requirement" value="Governance & privacy" /></>}
        </div>
      </section>

      <section className="panel workflow-panel">
        <div className="section-heading"><span className="section-icon dark">2</span><div><h2>What are you planning?</h2><p>Choose a format and describe the work in plain language.</p></div></div>
        <div className="project-tabs">
          {["One-off project", "Monthly workflow"].map((item) => <button key={item} className={props.projectType === item ? "selected" : ""} onClick={() => props.setProjectType(item)}><span className="radio"><i /></span><div><strong>{item}</strong><small>{item === "One-off project" ? "A defined project with a deadline" : "Recurring tasks you do every month"}</small></div>{props.projectType === item && <b>Selected</b>}</button>)}
        </div>

        <label className="field-label" htmlFor="project-description">Describe the outcome you need</label>
        <textarea id="project-description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="helper-row"><span>Include the result, audience, and anything the AI must protect.</span><span>{description.length}/240</span></div>

        {props.projectType === "Monthly workflow" ? (
          <>
            <div className="tasks-heading"><div><h3>Break it into tasks</h3><p>Edit the workflow before we score the models.</p></div><button onClick={() => setTaskCount(Math.min(3, taskCount + 1))}>＋ Add task</button></div>
            <div className="task-list">
              {visibleTasks.map((task, index) => <div className="task-row" key={task.title}><span className="drag">⠿</span><span className="task-number">{index + 1}</span><div className="task-copy"><strong>{task.title}</strong><small>{task.detail}</small></div><span className="task-frequency">{task.frequency}</span><button aria-label={`Edit ${task.title}`}>Edit</button><button aria-label={`Remove ${task.title}`} onClick={() => setTaskCount(Math.max(1, taskCount - 1))}>×</button></div>)}
            </div>
            <div className="sliders-grid">
              <Slider label="Monthly frequency" low="Rarely" high="Daily" value={props.frequency} setValue={props.setFrequency} />
              <Slider label="Quality level" low="Good" high="Professional" value={props.quality} setValue={props.setQuality} />
            </div>
          </>
        ) : (
          <div className="oneoff-grid">
            <MiniField label="Deadline" value="3 weeks" /><MiniField label="Project budget" value="$250" /><MiniField label="Quality target" value="Client-ready" />
          </div>
        )}

        <div className="priority-block">
          <div><h3>Rank your first priority</h3><p>We’ll optimize for this, then balance the rest.</p></div>
          <div className="priority-list">{priorities.map((item, i) => <button key={item} className={props.priority === item ? "selected" : ""} onClick={() => props.setPriority(item)}><span>{props.priority === item ? "✓" : i + 1}</span>{item}</button>)}</div>
        </div>
        <button className="primary-action" onClick={() => props.setGenerated(true)}>Generate my AI strategy <span>→</span></button>
      </section>

      {props.generated && <StrategyResult estimate={props.estimate} priority={props.priority} saved={props.saved} saveStrategy={props.saveStrategy} />}
    </div>
  );
}

function Step({ done, active, number, title, note }: { done?: boolean; active?: boolean; number: string; title: string; note: string }) {
  return <div className={`step ${done ? "done" : ""} ${active ? "active" : ""}`}><span>{done ? "✓" : number}</span><div><strong>{title}</strong><small>{note}</small></div></div>;
}

function MiniField({ label, value }: { label: string; value: string }) {
  return <label className="mini-field"><span>{label}</span><select defaultValue={value} aria-label={label}><option>{value}</option><option>Not sure yet</option></select></label>;
}

function Slider({ label, low, high, value, setValue }: { label: string; low: string; high: string; value: number; setValue: (v: number) => void }) {
  return <div className="slider-field"><div><strong>{label}</strong><span>{value > 68 ? high : value > 36 ? "Regularly" : low}</span></div><input aria-label={label} type="range" min="0" max="100" value={value} onChange={(e) => setValue(Number(e.target.value))} style={{ "--value": `${value}%` } as React.CSSProperties} /><small><span>{low}</span><span>{high}</span></small></div>;
}

function StrategyResult({ estimate, priority, saved, saveStrategy }: { estimate: string; priority: Priority; saved: boolean; saveStrategy: () => void }) {
  return <section className="panel result-panel">
    <div className="result-head"><div><span className="result-kicker">Strategy ready</span><h2>Your balanced content stack</h2><p>Optimized for <b>{priority.toLowerCase()}</b> across 40 monthly runs.</p></div><div className="result-actions"><button onClick={() => window.print()}>Export</button><button className="save-button" onClick={saveStrategy}>{saved ? "✓ Saved" : "Save strategy"}</button></div></div>
    <div className="metric-row"><Metric label="Estimated monthly" value={`$${estimate}`} note="API usage" /><Metric label="Completion time" value="≈ 7.2 hrs" note="−64% vs manual" /><Metric label="Quality confidence" value="High" note="3-stage review" /><Metric label="Potential savings" value="$74 / mo" note="vs one premium model" positive /></div>
    <div className="workflow-map">
      {tasks.map((task, index) => <div className="workflow-card" key={task.title}><span className="flow-step">0{index + 1}</span><div className={`model-mark ${index === 0 ? "blue" : index === 1 ? "mint" : "sand"}`}>{index === 0 ? "G" : index === 1 ? "O" : "A"}</div><div className="flow-copy"><span>{task.title}</span><strong>{task.model}</strong><small>{task.detail}</small></div><div className="flow-price"><strong>{task.cost}</strong><small>/ month</small></div>{index < 2 && <span className="flow-arrow">→</span>}</div>)}
    </div>
    <div className="alternatives">
      <div><span className="alt-icon green">↓</span><div><strong>Budget alternative</strong><p>Route drafts through Gemini 3.5 Flash (minimal)</p></div><b>$14.20<small>/mo</small></b><em>Save 32%</em></div>
      <div><span className="alt-icon violet">↑</span><div><strong>Premium alternative</strong><p>Use Claude Opus 5 for every final output</p></div><b>$38.70<small>/mo</small></b><em>+14% quality</em></div>
    </div>
    <div className="refresh-card"><span className="spark">✦</span><div><strong>Plan refresh is on</strong><p>We’ll compare this workflow against new models and alert you when a verified improvement appears.</p></div><button>How refresh works</button></div>
  </section>;
}

function Metric({ label, value, note, positive }: { label: string; value: string; note: string; positive?: boolean }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong><small className={positive ? "positive" : ""}>{positive ? "↘ " : ""}{note}</small></div>;
}

function ModelExplorer({ notify }: { notify: (m: string) => void }) {
  const [filter, setFilter] = useState("All models");
  return <div className="content-page"><header className="content-header"><div><span className="eyebrow">Model explorer</span><h1>Compare models without the noise.</h1><p>Independent benchmark snapshots, normalized pricing, privacy controls, and license fit.</p></div><button className="outline-button" onClick={() => notify("Benchmark snapshot refreshed")}>↻ Refresh data</button></header>
    <div className="source-banner"><span>i</span><p><strong>No invented scores.</strong> Figures shown are a dated public snapshot from Artificial Analysis. Provider terms still govern privacy and commercial use.</p><a href="https://artificialanalysis.ai/models/" target="_blank" rel="noreferrer">View source ↗</a></div>
    <div className="model-toolbar"><div className="filter-tabs">{["All models", "Fastest", "Best quality", "Open weights"].map((item) => <button key={item} onClick={() => setFilter(item)} className={filter === item ? "selected" : ""}>{item}</button>)}</div><span>4 verified models</span></div>
    <div className="model-grid">{models.filter((m) => filter !== "Open weights" || m.name === "Kimi K3").map((model) => <article className="model-card" key={model.name}><div className="model-title"><span className={`model-mark ${model.color}`}>{model.mark}</span><div><h2>{model.name}</h2><p>{model.variant}</p></div><button aria-label={`Favorite ${model.name}`}>☆</button></div><div className="score-pair"><div><span>AA Intelligence</span><strong>{model.intelligence}<small>/100</small></strong><div className="score-track"><i style={{ width: `${model.intelligence}%` }} /></div></div><div><span>Output speed</span><strong>{model.speed}<small> t/s</small></strong><div className="score-track speed"><i style={{ width: `${Math.min(100, model.speed / 2.1)}%` }} /></div></div></div><dl><div><dt>API input / output</dt><dd>{model.price} <small>/ 1M</small></dd></div><div><dt>Privacy</dt><dd>{model.privacy}</dd></div><div><dt>License</dt><dd>{model.license}</dd></div><div><dt>Best fit</dt><dd>{model.fit}</dd></div></dl><a href={model.source} target="_blank" rel="noreferrer">View benchmark source <span>↗</span></a></article>)}</div>
  </div>;
}

function Dashboard({ saved, estimate, setView, notify }: { saved: boolean; estimate: string; setView: (v: View) => void; notify: (m: string) => void }) {
  return <div className="content-page"><header className="content-header"><div><span className="eyebrow">Overview</span><h1>Good morning, Alex.</h1><p>Your AI stack is healthy. One new saving opportunity was found this week.</p></div><button className="primary-small" onClick={() => setView("planner")}>＋ New strategy</button></header>
    <div className="dashboard-metrics"><Metric label="Active strategies" value={saved ? "3" : "2"} note="Across 5 workflows" /><Metric label="Monthly AI cost" value={`$${estimate}`} note="Within $150 budget" /><Metric label="Saved this month" value="$74.20" note="↘ 38% optimized" positive /><Metric label="Next refresh" value="4 days" note="Automatic scan" /></div>
    <div className="dashboard-grid"><section className="panel current-card"><div className="card-head"><div><span className="green-dot" />Current AI strategy</div><button onClick={() => setView("planner")}>Open plan →</button></div><h2>Content operations · Balanced</h2><p>Research, writing and quality review for 40 monthly runs.</p><div className="stack-row"><span className="model-mark blue">G</span><i>→</i><span className="model-mark mint">O</span><i>→</i><span className="model-mark sand">A</span><b>$20.80 / mo</b></div><div className="health-row"><span>Strategy health</span><strong>Excellent</strong><div><i /></div></div></section>
      <section className="panel update-card"><span className="spark">✦</span><small>New opportunity</small><h2>Gemini 3.5 Flash is now a better fit for research.</h2><p>Switch the first stage and save 18% while increasing median output speed.</p><div className="switch-row"><span>GPT-5.5</span><i>→</i><strong>Gemini 3.5 Flash</strong><em>−$6.40/mo</em></div><button onClick={() => notify("Refresh suggestion applied")}>Review refresh</button></section></div>
    <section className="panel history-card"><div className="card-head"><div>Refresh history</div><button onClick={() => notify("Full history is ready for account sync")}>View all</button></div><div className="history-row"><span className="history-icon">↻</span><div><strong>Research model optimized</strong><small>Today · Content operations</small></div><b>−$6.40/mo</b><em>Recommended</em></div><div className="history-row"><span className="history-icon">✓</span><div><strong>Privacy terms re-verified</strong><small>Jul 28 · Client proposals</small></div><b>No change</b><em className="neutral">Verified</em></div></section>
  </div>;
}

const plans = [
  { name: "Go", tone: "green", price: "$0", subtitle: "Explore", value: "Find the right tools before you spend.", features: ["3 strategy plans / month", "2 plan refreshes", "Workflow & stack recommendation", "Basic benchmark summary"] },
  { name: "Plus", tone: "blue", price: "$19", subtitle: "Optimize", value: "Save money across everyday AI work.", features: ["Unlimited strategy plans", "Unlimited plan refreshes", "Workflow history", "Privacy & license comparison"], featured: true },
  { name: "Pro", tone: "violet", price: "$49", subtitle: "Scale", value: "Maximize every workflow’s return.", features: ["Everything in Plus", "Multi-workflow optimization", "API cost & ROI estimates", "Real-time model alerts"] },
  { name: "Enterprise", tone: "dark", price: "Custom", subtitle: "Govern", value: "Control AI cost and adoption at scale.", features: ["Organization dashboard", "License management", "Department spend analytics", "Admin controls & support"] },
];

function Pricing({ notify }: { notify: (m: string) => void }) {
  const [annual, setAnnual] = useState(true);
  return <div className="content-page pricing-page"><header className="pricing-head"><span className="eyebrow">Simple pricing</span><h1>Start informed. Scale with confidence.</h1><p>Every plan is designed to save more than it costs.</p><div className="billing-toggle"><button className={!annual ? "selected" : ""} onClick={() => setAnnual(false)}>Monthly</button><button className={annual ? "selected" : ""} onClick={() => setAnnual(true)}>Yearly <span>Save 20%</span></button></div></header><div className="pricing-grid">{plans.map((plan) => <article className={`price-card ${plan.featured ? "featured" : ""}`} key={plan.name}>{plan.featured && <span className="popular">Most popular</span>}<span className={`plan-orb ${plan.tone}`}>✦</span><div className="plan-name"><h2>{plan.name}</h2><span>{plan.subtitle}</span></div><div className="price"><strong>{plan.price === "$19" && annual ? "$15" : plan.price === "$49" && annual ? "$39" : plan.price}</strong>{plan.price !== "Custom" && <span>/ month</span>}</div><p>{plan.value}</p><button onClick={() => notify(`${plan.name} selected — checkout integration is ready`)}>{plan.name === "Enterprise" ? "Talk to sales" : plan.name === "Go" ? "Start free" : `Choose ${plan.name}`}</button><ul>{plan.features.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}</ul></article>)}</div><p className="pricing-note">Benchmark data is informational, changes over time, and should be verified before material purchasing decisions.</p></div>;
}
