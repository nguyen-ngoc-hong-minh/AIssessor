"use client";

import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ExternalLink,
  Palette,
  Search,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { directoryReviewedAt, directoryTools, taskCategories, type TaskCategory } from "@/lib/task-directory";
import { Brand } from "./brand";
import { VisualModeToggle } from "./visual-mode-toggle";
import styles from "./task-directory.module.css";

const categoryIcons = {
  creativity: Palette,
  work: BriefcaseBusiness,
  personal: UserRound,
};

export function TaskDirectory() {
  const [category, setCategory] = useState<TaskCategory>("creativity");
  const [subcategory, setSubcategory] = useState("All tasks");
  const [query, setQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState("midjourney");

  const activeCategory = taskCategories.find((item) => item.id === category) ?? taskCategories[0];
  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return directoryTools.filter((tool) => {
      const categoryMatch = tool.category === category;
      const subcategoryMatch = subcategory === "All tasks" || tool.subcategory === subcategory;
      const queryMatch = !normalizedQuery || [tool.name, tool.task, tool.tagline, tool.subcategory]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      return categoryMatch && subcategoryMatch && queryMatch;
    });
  }, [category, query, subcategory]);

  const selectedTool = directoryTools.find((tool) => tool.slug === selectedSlug) ?? filteredTools[0] ?? directoryTools[0];

  function changeCategory(nextCategory: TaskCategory) {
    setCategory(nextCategory);
    setSubcategory("All tasks");
    const firstTool = directoryTools.find((tool) => tool.category === nextCategory);
    if (firstTool) setSelectedSlug(firstTool.slug);
  }

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
          <p>Browse a focused set of AI-first products by what you need to get done. Compare fit, cost, updates, strengths, and trade-offs before opening another tab.</p>
        </div>
        <div className={styles.searchWrap}>
          <Search aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tasks or tools"
            aria-label="Search tasks or AI tools"
          />
          {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X /></button>}
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
            const toolCount = directoryTools.filter((tool) => tool.category === item.id).length;
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
                <b>{String(toolCount).padStart(2, "0")}</b>
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
          <p>{filteredTools.length} curated {filteredTools.length === 1 ? "tool" : "tools"}</p>
        </div>

        <div className={styles.subcategoryNav} aria-label={`${activeCategory.label} subcategories`}>
          {["All tasks", ...activeCategory.subcategories].map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => setSubcategory(item)}
              aria-pressed={subcategory === item}
            >
              {item}
              <span>{item === "All tasks" ? directoryTools.filter((tool) => tool.category === category).length : directoryTools.filter((tool) => tool.category === category && tool.subcategory === item).length}</span>
            </button>
          ))}
        </div>

        <div className={styles.directoryLayout}>
          <div className={styles.toolList} aria-live="polite">
            {filteredTools.map((tool, index) => (
              <button
                type="button"
                key={tool.slug}
                className={selectedTool.slug === tool.slug ? styles.toolActive : styles.toolButton}
                onClick={() => setSelectedSlug(tool.slug)}
                aria-pressed={selectedTool.slug === tool.slug}
              >
                <span className={styles.toolIndex}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.toolMark} style={{ "--tool-accent": tool.accent } as React.CSSProperties}>{tool.name.slice(0, 2)}</span>
                <span className={styles.toolCopy}>
                  <small>{tool.subcategory}</small>
                  <strong>{tool.task}</strong>
                  <span>{tool.name} · {tool.tagline}</span>
                </span>
                <ArrowUpRight aria-hidden="true" />
              </button>
            ))}
            {filteredTools.length === 0 && (
              <div className={styles.emptyState}>
                <Search aria-hidden="true" />
                <h3>No matching tools</h3>
                <p>Try a broader search or choose another task category.</p>
                <button type="button" onClick={() => { setQuery(""); setSubcategory("All tasks"); }}>Clear filters</button>
              </div>
            )}
          </div>

          <aside className={styles.inspector} aria-label={`${selectedTool.name} details`}>
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
                <a href={selectedTool.pricing.source} target="_blank" rel="noreferrer">Check live pricing <ExternalLink aria-hidden="true" /></a>
              </div>
              <div className={styles.detailBlock}>
                <span>Latest release</span>
                <strong>{selectedTool.release.title}</strong>
                <small>{selectedTool.release.date}</small>
                <p>{selectedTool.release.summary}</p>
                <a href={selectedTool.release.source} target="_blank" rel="noreferrer">Read release notes <ExternalLink aria-hidden="true" /></a>
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
              <div>{selectedTool.alternatives.map((alternative) => {
                const alternativeTool = directoryTools.find((tool) => tool.name === alternative);
                return alternativeTool ? (
                  <button type="button" key={alternative} onClick={() => { setCategory(alternativeTool.category); setSubcategory("All tasks"); setSelectedSlug(alternativeTool.slug); }}>{alternative}<ArrowUpRight /></button>
                ) : <span key={alternative}>{alternative}</span>;
              })}</div>
            </div>

            <div className={styles.sources}>
              <BookOpen aria-hidden="true" />
              <div>
                <span>Official sources</span>
                <p>Reviewed {directoryReviewedAt}. Pricing and product features can change.</p>
                <div>{selectedTool.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}<ExternalLink /></a>)}</div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
