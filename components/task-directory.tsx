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
  Palette,
  Search,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { directoryReviewedAt, directoryTools, taskCategories, type DirectoryTool, type TaskCategory } from "@/lib/task-directory";
import { SiteHeader } from "./site-header";
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
  icon?: string;
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

function getFaviconUrl(websiteUrl: string): string {
  try {
    const url = new URL(websiteUrl);
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`;
  } catch {
    return "";
  }
}

function ToolAvatar({ name, icon, website, className }: { name: string; icon?: string; website?: string; className: string }) {
  const [imgFailed, setImgFailed] = useState(false);
  const logoUrl = icon || (website ? getFaviconUrl(website) : "");

  if (!logoUrl || imgFailed) {
    return <span className={`${className} ${styles.textFallbackMark}`}>{name.slice(0, 2)}</span>;
  }

  return (
    <span className={`${className} ${styles.logoMarkWrap}`}>
      <img
        src={logoUrl}
        alt={`${name} logo`}
        className={styles.toolLogoImg}
        onError={() => setImgFailed(true)}
        loading="lazy"
      />
    </span>
  );
}

function normalizeVerifiedTool(tool: DirectoryTool): DisplayTool {
  return {
    ...tool,
    icon: getFaviconUrl(tool.website),
    profileType: "verified",
    sourceName: "Official product sources",
  };
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
    icon: tool.icon || getFaviconUrl(tool.website),
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
    <div className={styles.pageWrap}>
      <SiteHeader />

      <main className={styles.mainContainer}>
        {/* Header Block & Search */}
        <section className={styles.heroSection}>
          <div className={styles.heroHeader}>
            <h1 className={styles.heroTitle}>Find an AI tool for any task</h1>
          </div>

          <div className={styles.searchContainer}>
            <div className={styles.searchBar}>
              <Search className={styles.searchIcon} aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => { setQuery(event.target.value); resetPage(); }}
                placeholder="Search tools, tasks, or features (e.g. Midjourney, video editing, code)..."
                aria-label="Search tasks or AI tools"
              />
              {query && (
                <button type="button" onClick={() => { setQuery(""); resetPage(); }} aria-label="Clear search" className={styles.clearBtn}>
                  <X />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Category Cards (Signature Metric Grid Style) */}
        <section className={styles.categoriesSection} aria-label="Task Categories">
          <div className={styles.categoryGrid}>
            {taskCategories.map((item) => {
              const Icon = categoryIcons[item.id];
              const toolCount = allTools.filter((tool) => tool.category === item.id).length;
              const isActive = item.id === category;
              return (
                <button
                  type="button"
                  key={item.id}
                  className={`${styles.categoryCard} ${isActive ? styles.categoryCardActive : ""}`}
                  onClick={() => changeCategory(item.id)}
                  aria-pressed={isActive}
                >
                  <div className={styles.categoryCardTop}>
                    <span className={styles.categoryIconWrap}><Icon aria-hidden="true" /></span>
                    <span className={styles.categoryCountBadge}>{toolCount.toLocaleString()} tools</span>
                  </div>
                  <strong className={styles.categoryCardTitle}>{item.label}</strong>
                  <p className={styles.categoryCardDesc}>{item.description}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Directory Explorer: Subcategories + List + Inspector */}
        <section className={styles.directorySection} aria-label="AI Tools Explorer">
          <div className={styles.filterBar}>
            <div className={styles.subcategoryNav} aria-label={`${activeCategory.label} subcategories`}>
              {["All tasks", ...activeCategory.subcategories].map((item) => {
                const count = item === "All tasks"
                  ? allTools.filter((tool) => tool.category === category).length
                  : allTools.filter((tool) => tool.category === category && tool.subcategory === item).length;
                const isSelected = subcategory === item;
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => { setSubcategory(item); resetPage(); }}
                    className={`${styles.subcatBtn} ${isSelected ? styles.subcatBtnActive : ""}`}
                    aria-pressed={isSelected}
                  >
                    <span>{item}</span>
                    <span className={styles.subcatCount}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.directoryLayout}>
            {/* Left Tool List */}
            <div className={styles.toolColumn}>
              <div className={styles.toolList} aria-live="polite">
                {visibleTools.map((tool, index) => {
                  const isSelected = selectedTool.slug === tool.slug;
                  return (
                    <button
                      type="button"
                      key={tool.slug}
                      className={`${styles.toolCard} ${isSelected ? styles.toolCardActive : ""}`}
                      onClick={() => selectTool(tool.slug)}
                      aria-pressed={isSelected}
                    >
                      <span className={styles.toolIndex}>{String(index + 1).padStart(2, "0")}</span>
                      <ToolAvatar
                        name={tool.name}
                        icon={tool.icon}
                        website={tool.website}
                        className={styles.toolMark}
                      />
                      <div className={styles.toolInfo}>
                        <div className={styles.toolMeta}>
                          <span className={styles.subcategoryTag}>{tool.subcategory}</span>
                        </div>
                        <strong className={styles.toolName}>{tool.name}</strong>
                        <p className={styles.toolTagline}>{tool.tagline}</p>
                      </div>
                      <ArrowUpRight className={styles.toolArrow} aria-hidden="true" />
                    </button>
                  );
                })}

                {filteredTools.length === 0 && (
                  <div className={styles.emptyState}>
                    <Search aria-hidden="true" />
                    <h3>No matching tools found</h3>
                    <p>Try searching for a different keyword or reset filters.</p>
                    <button
                      type="button"
                      className={styles.resetBtn}
                      onClick={() => { setQuery(""); setSubcategory("All tasks"); resetPage(); }}
                    >
                      Clear all filters
                    </button>
                  </div>
                )}

                {loadError && (
                  <div className={styles.emptyState}>
                    <Database aria-hidden="true" />
                    <h3>Discovery index unavailable</h3>
                    <p>Verified profiles are still accessible. Reload the page to retry the index.</p>
                  </div>
                )}
              </div>

              {visibleTools.length < filteredTools.length && (
                <button type="button" className={styles.loadMoreBtn} onClick={() => setPage((current) => current + 1)}>
                  <span>Show {Math.min(PAGE_SIZE, filteredTools.length - visibleTools.length)} more tools</span>
                  <span className={styles.loadMoreCount}>{visibleTools.length.toLocaleString()} / {filteredTools.length.toLocaleString()}</span>
                </button>
              )}
            </div>

            {/* Right Sticky Inspector */}
            <aside ref={inspectorRef} className={styles.inspector} aria-label={`${selectedTool.name} details`}>
              <div className={styles.inspectorBadgeRow}>
                <span className={styles.inspectorSubcat}>{selectedTool.subcategory}</span>
              </div>

              <div className={styles.inspectorHeader}>
                <div className={styles.inspectorTitleGroup}>
                  <ToolAvatar
                    name={selectedTool.name}
                    icon={selectedTool.icon}
                    website={selectedTool.website}
                    className={styles.largeMark}
                  />
                  <div>
                    <h3 className={styles.inspectorName}>{selectedTool.name}</h3>
                    <span className={styles.inspectorTask}>{selectedTool.task}</span>
                  </div>
                </div>
                <a
                  href={selectedTool.website}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.visitBtn}
                >
                  <span>Visit tool</span>
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </div>

              <div className={styles.jobBox}>
                <small className={styles.jobBoxKicker}>USE THIS AI FOR</small>
                <strong className={styles.jobBoxTitle}>{selectedTool.task}</strong>
                <p className={styles.jobBoxDesc}>{selectedTool.overview}</p>
              </div>

              <div className={styles.specGrid}>
                <div className={styles.specCard}>
                  <span className={styles.blockHeading}>Pricing</span>
                  <p className={styles.specSummary}>{selectedTool.pricing.summary}</p>
                  <a href={selectedTool.pricing.source} target="_blank" rel="noreferrer" className={styles.sourceLink}>
                    Check source <ExternalLink aria-hidden="true" />
                  </a>
                </div>
                <div className={styles.specCard}>
                  <span className={styles.blockHeading}>Latest release</span>
                  <strong className={styles.releaseTitle}>{selectedTool.release.title}</strong>
                  <small className={styles.releaseDate}>{selectedTool.release.date}</small>
                  <p className={styles.releaseSummary}>{selectedTool.release.summary}</p>
                  <a href={selectedTool.release.source} target="_blank" rel="noreferrer" className={styles.sourceLink}>
                    Check release <ExternalLink aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className={styles.tradeoffGrid}>
                <div className={styles.tradeoffCol}>
                  <span className={styles.blockHeading}>Strengths</span>
                  <ul className={styles.proList}>
                    {selectedTool.pros.map((item) => (
                      <li key={item}><Check aria-hidden="true" /><span>{item}</span></li>
                    ))}
                  </ul>
                </div>
                <div className={styles.tradeoffCol}>
                  <span className={styles.blockHeading}>Limitations</span>
                  <ul className={styles.conList}>
                    {selectedTool.cons.map((item) => (
                      <li key={item}><X aria-hidden="true" /><span>{item}</span></li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={styles.alternativesBlock}>
                <span className={styles.blockHeading}>Alternatives</span>
                <div className={styles.alternativeChips}>
                  {selectedAlternatives.length > 0 ? selectedAlternatives.map((alternative) => (
                    <button
                      type="button"
                      key={alternative.slug}
                      onClick={() => { setCategory(alternative.category); setSubcategory("All tasks"); setSelectedSlug(alternative.slug); resetPage(); }}
                      className={styles.alternativeBtn}
                    >
                      <span>{alternative.name}</span>
                      <ArrowUpRight aria-hidden="true" />
                    </button>
                  )) : (
                    <span className={styles.noAlternatives}>No close matches indexed yet</span>
                  )}
                </div>
              </div>

              <div className={styles.citationBox}>
                <BookOpen aria-hidden="true" className={styles.citationIcon} />
                <div className={styles.citationContent}>
                  <span className={styles.citationTitle}>
                    {selectedTool.profileType === "verified" ? "Official sources" : `Indexed via ${selectedTool.sourceName}`}
                  </span>
                  <p className={styles.citationDesc}>
                    {selectedTool.profileType === "verified" ? `Verified as of ${directoryReviewedAt}.` : "Direct listing index. Verify current fit, features, and pricing before purchase."}
                  </p>
                  <div className={styles.citationLinks}>
                    {selectedTool.sources.map((source) => (
                      <a key={`${source.label}-${source.url}`} href={source.url} target="_blank" rel="noreferrer">
                        <span>{source.label}</span>
                        <ExternalLink aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
