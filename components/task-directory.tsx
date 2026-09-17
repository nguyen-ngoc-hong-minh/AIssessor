"use client";

import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Check,
  Database,
  ExternalLink,
  LoaderCircle,
  Palette,
  Search,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { directoryReviewedAt, directoryTools, taskCategories, type DirectoryTool, type TaskCategory } from "@/lib/task-directory";
import { Brand } from "./brand";
import { VisualModeToggle } from "./visual-mode-toggle";
import styles from "./task-directory.module.css";

const PAGE_SIZE = 18;

type IndexedTool = {
  id: string;
  slug: string;
  name: string;
  category: TaskCategory;
  subcategory: string;
  task: string;
  tagline: string;
  overview: string;
  website: string;
  icon: string;
  pricing: string;
  version: string;
  released: string;
  directoryUrl: string;
  sourceUrl: string;
  sourceName: string;
  sourceLicense: string;
  accent: string;
};

type DirectoryPayload = {
  generatedAt: string;
  counts: { unique: number; scraped: number; supplemental: number };
  tools: IndexedTool[];
};

type DisplayTool = {
  slug: string;
  name: string;
  category: TaskCategory;
  subcategory: string;
  task: string;
  tagline: string;
  overview: string;
  website: string;
  pricing: { summary: string; source: string };
  release: { title: string; date: string; summary: string; source: string };
  alternatives: string[];
  pros: string[];
  cons: string[];
  sources: Array<{ label: string; url: string }>;
  accent: string;
  profileType: "verified" | "listing";
  sourceName: string;
};

const categoryIcons = {
  creativity: Palette,
  work: BriefcaseBusiness,
  personal: UserRound,
};

function normalizeVerifiedTool(tool: DirectoryTool): DisplayTool {
  return { ...tool, profileType: "verified", sourceName: "Official product sources" };
}

function normalizeIndexedTool(tool: IndexedTool): DisplayTool {
  const hasPricing = tool.pricing && tool.pricing !== "Pricing not listed" && !tool.pricing.startsWith("See provider");
  const hasRelease = tool.released && !tool.released.startsWith("Release date not listed");
  const sourceLink = tool.directoryUrl || tool.sourceUrl;

  return {
    slug: tool.slug,
    name: tool.name,
    category: tool.category,
    subcategory: tool.subcategory,
    task: tool.task,
    tagline: tool.tagline,
    overview: tool.overview,
    website: tool.website,
    pricing: { summary: tool.pricing || "See provider for current pricing", source: sourceLink },
    release: {
      title: tool.version || "Current listing",
      date: tool.released || "Release date not listed",
      summary: `Release information shown by ${tool.sourceName}. Check the provider before making a purchase decision.`,
      source: sourceLink,
    },
    alternatives: [],
    pros: [
      `Indexed for ${tool.task}`,
      hasPricing ? "Public pricing signal available" : "Direct provider link available",
      "Easy to compare with tools for the same task",
    ],
    cons: [
      "Not independently tested by AIssessor",
      hasRelease ? "Release age is directory-reported" : "Release history is not available",
      "Pricing and availability can change",
    ],
    sources: [
      { label: tool.sourceName, url: tool.sourceUrl },
      { label: "Provider website", url: tool.website },
    ],
    accent: tool.accent,
    profileType: "listing",
    sourceName: tool.sourceName,
  };
}

export function TaskDirectory() {
  const [category, setCategory] = useState<TaskCategory>("creativity");
  const [subcategory, setSubcategory] = useState("All tasks");
  const [query, setQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState("midjourney");
  const [payload, setPayload] = useState<DirectoryPayload | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [page, setPage] = useState(1);
  const inspectorRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let active = true;
    fetch("/data/task-directory.json")
      .then((response) => {
        if (!response.ok) throw new Error("Directory request failed");
        return response.json() as Promise<DirectoryPayload>;
      })
      .then((data) => {
        if (active) setPayload(data);
      })
      .catch(() => {
        if (active) setLoadError(true);
      });
    return () => { active = false; };
  }, []);

  const allTools = useMemo(() => {
    const verified = directoryTools.map(normalizeVerifiedTool);
    const verifiedWebsites = new Set(verified.map((tool) => tool.website.replace(/\/$/, "").toLowerCase()));
    const indexed = (payload?.tools ?? [])
      .filter((tool) => !verifiedWebsites.has(tool.website.replace(/\/$/, "").toLowerCase()))
      .map(normalizeIndexedTool);
    return [...verified, ...indexed];
  }, [payload]);

  const activeCategory = taskCategories.find((item) => item.id === category) ?? taskCategories[0];
  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return allTools.filter((tool) => {
      const categoryMatch = tool.category === category;
      const subcategoryMatch = subcategory === "All tasks" || tool.subcategory === subcategory;
      const queryMatch = !normalizedQuery || [tool.name, tool.task, tool.tagline, tool.subcategory]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      return categoryMatch && subcategoryMatch && queryMatch;
    });
  }, [allTools, category, query, subcategory]);

  const visibleTools = filteredTools.slice(0, page * PAGE_SIZE);
  const selectedTool = filteredTools.find((tool) => tool.slug === selectedSlug) ?? filteredTools[0] ?? allTools.find((tool) => tool.slug === selectedSlug) ?? allTools[0];
  const selectedAlternatives = useMemo(() => {
    if (!selectedTool) return [];
    const named = selectedTool.alternatives
      .map((name) => allTools.find((tool) => tool.name === name))
      .filter((tool): tool is DisplayTool => Boolean(tool));
    const related = allTools.filter((tool) => tool.slug !== selectedTool.slug && tool.task === selectedTool.task);
    return [...new Map([...named, ...related].map((tool) => [tool.slug, tool])).values()].slice(0, 5);
  }, [allTools, selectedTool]);

  function resetPage() {
    setPage(1);
  }

  function changeCategory(nextCategory: TaskCategory) {
    setCategory(nextCategory);
    setSubcategory("All tasks");
    resetPage();
    const firstTool = allTools.find((tool) => tool.category === nextCategory);
    if (firstTool) setSelectedSlug(firstTool.slug);
  }

  function selectTool(slug: string) {
    setSelectedSlug(slug);
    if (window.matchMedia("(max-width: 1100px)").matches) {
      window.requestAnimationFrame(() => inspectorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }

  if (!selectedTool) return null;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Brand />
        <nav className={styles.headerNav} aria-label="Task directory navigation">
          <Link href="/" className={styles.backLink}><ArrowLeft aria-hidden="true" /> Back home</Link>
          <VisualModeToggle />
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><Sparkles aria-hidden="true" /> AI TASK DIRECTORY</p>
          <h1>Find an AI tool<br />for the task.</h1>
          <p>Search a broad AI discovery index, then open verified profiles when you need deeper pricing, release, strength, and trade-off research.</p>
        </div>
        <div>
          <div className={styles.searchWrap}>
            <Search aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => { setQuery(event.target.value); resetPage(); }}
              placeholder="Search thousands of tools and tasks"
              aria-label="Search tasks or AI tools"
            />
            {query && <button type="button" onClick={() => { setQuery(""); resetPage(); }} aria-label="Clear search"><X /></button>}
          </div>
          <div className={styles.indexSummary} aria-live="polite">
            {payload ? <><Database aria-hidden="true" /><strong>{payload.counts.unique.toLocaleString()}</strong> tools indexed</> : <><LoaderCircle className={styles.spinner} aria-hidden="true" /> Loading directory</>}
            <span><BadgeCheck aria-hidden="true" />{directoryTools.length} independently verified</span>
          </div>
        </div>
      </section>

      <section className={styles.categoryBand} aria-labelledby="category-heading">
        <div className={styles.sectionLabel}>
          <span>01</span>
          <p id="category-heading">Choose a category</p>
        </div>
        <div className={styles.categoryGrid}>
          {taskCategories.map((item) => {
            const Icon = categoryIcons[item.id];
            const toolCount = allTools.filter((tool) => tool.category === item.id).length;
            return (
              <button
                type="button"
                key={item.id}
                className={item.id === category ? styles.categoryActive : styles.categoryButton}
                onClick={() => changeCategory(item.id)}
                aria-pressed={item.id === category}
              >
                <span className={styles.categoryIcon}><Icon aria-hidden="true" /></span>
                <span><strong>{item.label}</strong><small>{item.description}</small></span>
                <b>{toolCount.toLocaleString()}</b>
              </button>
            );
          })}
        </div>
      </section>

      <section className={styles.directorySection} aria-labelledby="directory-heading">
        <div className={styles.directoryTopline}>
          <div>
            <p className={styles.eyebrow}>02 / {activeCategory.label.toUpperCase()}</p>
            <h2 id="directory-heading">Tasks and tools</h2>
          </div>
          <p>{filteredTools.length.toLocaleString()} matching {filteredTools.length === 1 ? "tool" : "tools"}</p>
        </div>

        <div className={styles.subcategoryNav} aria-label={`${activeCategory.label} subcategories`}>
          {["All tasks", ...activeCategory.subcategories].map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => { setSubcategory(item); resetPage(); }}
              aria-pressed={subcategory === item}
            >
              {item}
              <span>{item === "All tasks" ? allTools.filter((tool) => tool.category === category).length : allTools.filter((tool) => tool.category === category && tool.subcategory === item).length}</span>
            </button>
          ))}
        </div>

        <div className={styles.directoryLayout}>
          <div className={styles.toolColumn}>
            <div className={styles.toolList} aria-live="polite">
              {visibleTools.map((tool, index) => (
                <button
                  type="button"
                  key={tool.slug}
                  className={selectedTool.slug === tool.slug ? styles.toolActive : styles.toolButton}
                  onClick={() => selectTool(tool.slug)}
                  aria-pressed={selectedTool.slug === tool.slug}
                >
                  <span className={styles.toolIndex}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.toolMark} style={{ "--tool-accent": tool.accent } as React.CSSProperties}>{tool.name.slice(0, 2)}</span>
                  <span className={styles.toolCopy}>
                    <small>{tool.subcategory} · {tool.profileType === "verified" ? "Verified" : "Directory"} · {tool.task}</small>
                    <strong>{tool.name}</strong>
                    <span>{tool.tagline}</span>
                  </span>
                  <ArrowUpRight aria-hidden="true" />
                </button>
              ))}
              {filteredTools.length === 0 && (
                <div className={styles.emptyState}>
                  <Search aria-hidden="true" />
                  <h3>No matching tools</h3>
                  <p>Try a broader search or choose another task category.</p>
                  <button type="button" onClick={() => { setQuery(""); setSubcategory("All tasks"); resetPage(); }}>Clear filters</button>
                </div>
              )}
              {loadError && (
                <div className={styles.emptyState}>
                  <Database aria-hidden="true" />
                  <h3>Discovery index unavailable</h3>
                  <p>The verified profiles are still available. Reload to retry the full directory.</p>
                </div>
              )}
            </div>
            {visibleTools.length < filteredTools.length && (
              <button type="button" className={styles.loadMore} onClick={() => setPage((current) => current + 1)}>
                Show {Math.min(PAGE_SIZE, filteredTools.length - visibleTools.length)} more
                <span>{visibleTools.length.toLocaleString()} / {filteredTools.length.toLocaleString()}</span>
              </button>
            )}
          </div>

          <aside ref={inspectorRef} className={styles.inspector} aria-label={`${selectedTool.name} details`}>
            <div className={styles.profileBadge} data-profile={selectedTool.profileType}>
              {selectedTool.profileType === "verified" ? <BadgeCheck aria-hidden="true" /> : <Database aria-hidden="true" />}
              {selectedTool.profileType === "verified" ? "Verified profile" : "Directory listing"}
            </div>
            <div className={styles.inspectorHeader}>
              <div className={styles.inspectorTitle}>
                <span className={styles.largeMark} style={{ "--tool-accent": selectedTool.accent } as React.CSSProperties}>{selectedTool.name.slice(0, 2)}</span>
                <div><small>{selectedTool.subcategory}</small><h3>{selectedTool.name}</h3></div>
              </div>
              <a href={selectedTool.website} target="_blank" rel="noreferrer">Visit tool <ArrowUpRight aria-hidden="true" /></a>
            </div>

            <div className={styles.detailBlock}>
              <span>Overview</span>
              <p>{selectedTool.overview}</p>
            </div>

            <div className={styles.detailGrid}>
              <div className={styles.detailBlock}>
                <span>Pricing</span>
                <p>{selectedTool.pricing.summary}</p>
                <a href={selectedTool.pricing.source} target="_blank" rel="noreferrer">Check source <ExternalLink aria-hidden="true" /></a>
              </div>
              <div className={styles.detailBlock}>
                <span>Latest release</span>
                <strong>{selectedTool.release.title}</strong>
                <small>{selectedTool.release.date}</small>
                <p>{selectedTool.release.summary}</p>
                <a href={selectedTool.release.source} target="_blank" rel="noreferrer">Check release source <ExternalLink aria-hidden="true" /></a>
              </div>
            </div>

            <div className={styles.tradeoffGrid}>
              <div>
                <span>Pros</span>
                <ul>{selectedTool.pros.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul>
              </div>
              <div>
                <span>Cons</span>
                <ul>{selectedTool.cons.map((item) => <li key={item}><X aria-hidden="true" />{item}</li>)}</ul>
              </div>
            </div>

            <div className={styles.alternatives}>
              <span>Alternatives</span>
              <div>{selectedAlternatives.length > 0 ? selectedAlternatives.map((alternative) => (
                <button type="button" key={alternative.slug} onClick={() => { setCategory(alternative.category); setSubcategory("All tasks"); setSelectedSlug(alternative.slug); resetPage(); }}>{alternative.name}<ArrowUpRight /></button>
              )) : <span>No close matches indexed yet</span>}</div>
            </div>

            <div className={styles.sources}>
              <BookOpen aria-hidden="true" />
              <div>
                <span>{selectedTool.profileType === "verified" ? "Official sources" : `Indexed by ${selectedTool.sourceName}`}</span>
                <p>{selectedTool.profileType === "verified" ? `Reviewed ${directoryReviewedAt}.` : "Discovery record only; verify claims, pricing, and fit before purchasing."}</p>
                <div>{selectedTool.sources.map((source) => <a key={`${source.label}-${source.url}`} href={source.url} target="_blank" rel="noreferrer">{source.label}<ExternalLink /></a>)}</div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
