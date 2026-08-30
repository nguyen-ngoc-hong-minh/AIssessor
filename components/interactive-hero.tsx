"use client";

import { ArrowRight, Check, Cpu, DollarSign, Layers, Sparkles, TrendingDown, Wand2, Zap } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export interface PresetScenario {
  id: string;
  label: string;
  icon: string;
  badge: string;
  brief: string;
  tools: string[];
  recommendedModels: Array<{ name: string; role: string; cost: string; highlight?: boolean }>;
  traditionalCost: number;
  optimizedCost: number;
  savingsPercent: number;
  savingsNote: string;
}

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "creative",
    label: "Brand & Visuals",
    icon: "🎨",
    badge: "Creative Freelancers",
    brief: "Create a complete visual brand identity, generate high-res marketing banners, and draft campaign copy for a product launch.",
    tools: ["Midjourney", "Claude", "Canva"],
    recommendedModels: [
      { name: "Midjourney v6.1", role: "High-res Visuals & Art", cost: "$10 / mo", highlight: true },
      { name: "Claude 3.5 Sonnet", role: "Copy & Creative Direction", cost: "$0.02 / brief" },
    ],
    traditionalCost: 60,
    optimizedCost: 10.5,
    savingsPercent: 82,
    savingsNote: "Replaces 3 redundant $20/mo subscriptions with 1 targeted stack",
  },
  {
    id: "developer",
    label: "Full-Stack Dev",
    icon: "⚡",
    badge: "Solo Engineers",
    brief: "Build a Next.js web application with PostgreSQL backend, write unit tests, and resolve complex edge-case bugs.",
    tools: ["ChatGPT", "Cursor", "Claude"],
    recommendedModels: [
      { name: "Claude 3.7 Sonnet", role: "Complex Architecture & Logic", cost: "$0.03 / task", highlight: true },
      { name: "DeepSeek R1", role: "Deep Math & Algorithmic Debug", cost: "$0.55 / 1M tokens" },
    ],
    traditionalCost: 40,
    optimizedCost: 7.2,
    savingsPercent: 82,
    savingsNote: "Use direct API access for heavy coding instead of $20 flat subscription",
  },
  {
    id: "marketing",
    label: "Growth & SEO",
    icon: "📈",
    badge: "Solo Marketers",
    brief: "Research weekly trending keywords, write SEO blog posts, and repurpose articles into Twitter threads and email newsletters.",
    tools: ["Perplexity", "ChatGPT", "Canva"],
    recommendedModels: [
      { name: "Gemini 1.5 Pro", role: "Long-form SEO Articles", cost: "Free / Pay-as-go", highlight: true },
      { name: "Perplexity AI", role: "Live Web & Keyword Intel", cost: "Included Free" },
    ],
    traditionalCost: 55,
    optimizedCost: 3.5,
    savingsPercent: 93,
    savingsNote: "Leverages Gemini 2M context window + live search free tiers",
  },
  {
    id: "research",
    label: "Data & PDF Analysis",
    icon: "🔬",
    badge: "Consultants & Pros",
    brief: "Analyze 50-page financial PDF statements, extract market growth tables, and write an executive synthesis report.",
    tools: ["Claude", "ChatGPT"],
    recommendedModels: [
      { name: "Gemini 1.5 Pro", role: "Full PDF 2M Context Ingestion", cost: "$0.01 / document", highlight: true },
      { name: "Claude 3.5 Sonnet", role: "Executive Summary Polishing", cost: "$0.02 / report" },
    ],
    traditionalCost: 45,
    optimizedCost: 2.1,
    savingsPercent: 95,
    savingsNote: "Zero recurring lock-in; pay micro-cents per analyzed document",
  },
];

const FLOATING_BADGES = [
  {
    id: "claude",
    name: "Claude 3.7 Sonnet",
    role: "Reasoning & Code",
    tag: "High Quality",
    accent: "#6366f1",
    pos: { desktop: "top-[10%] left-[2%]", floatClass: "float-badge-1" },
    presetId: "developer",
  },
  {
    id: "midjourney",
    name: "Midjourney v6.1",
    role: "Ultra-res Visuals",
    tag: "Photoreal",
    accent: "#ec4899",
    pos: { desktop: "top-[16%] right-[2%]", floatClass: "float-badge-2" },
    presetId: "creative",
  },
  {
    id: "gemini",
    name: "Gemini 1.5 Pro",
    role: "2M Context & Video",
    tag: "Lowest Cost",
    accent: "#06b6d4",
    pos: { desktop: "bottom-[24%] left-[3%]", floatClass: "float-badge-3" },
    presetId: "research",
  },
  {
    id: "deepseek",
    name: "DeepSeek R1",
    role: "Math & Deep Logic",
    tag: "90% Cheaper",
    accent: "#10b981",
    pos: { desktop: "bottom-[22%] right-[3%]", floatClass: "float-badge-4" },
    presetId: "developer",
  },
];

interface InteractiveHeroProps {
  onBegin: () => void;
  onSelectPreset: (preset: PresetScenario) => void;
}

export function InteractiveHero({ onBegin, onSelectPreset }: InteractiveHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePreset, setActivePreset] = useState<PresetScenario>(PRESET_SCENARIOS[0]);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const [activeBadgeTooltip, setActiveBadgeTooltip] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePos({
        x: Math.max(0, Math.min(1, x)),
        y: Math.max(0, Math.min(1, y)),
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  const tiltX = (mousePos.y - 0.5) * -10;
  const tiltY = (mousePos.x - 0.5) * 12;

  return (
    <div
      ref={containerRef}
      className="interactive-hero-wrapper relative w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0.5, y: 0.5 });
      }}
    >
      {/* 1. Ambient Mouse-Follow Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background: "radial-gradient(650px circle at " + (mousePos.x * 100) + "% " + (mousePos.y * 100) + "%, rgba(16, 63, 213, 0.12), rgba(103, 186, 228, 0.05) 40%, transparent 80%)",
          opacity: isHovered ? 1 : 0.6,
        }}
        aria-hidden="true"
      />

      {/* 2. Floating 3D AI Model Badges */}
      <div className="pointer-events-none absolute inset-0 hidden xl:block overflow-hidden" aria-hidden="true">
        {FLOATING_BADGES.map((badge, idx) => {
          const depthMultiplier = (idx + 1) * 12;
          const offsetX = (mousePos.x - 0.5) * depthMultiplier;
          const offsetY = (mousePos.y - 0.5) * depthMultiplier;
          const isTargeted = activeBadgeTooltip === badge.id;

          return (
            <div
              key={badge.id}
              className={"pointer-events-auto absolute " + badge.pos.desktop + " " + badge.pos.floatClass + " transition-transform duration-300 ease-out cursor-pointer z-10"}
              style={{
                transform: "translate3d(" + offsetX + "px, " + offsetY + "px, 0) scale(" + (isTargeted ? 1.06 : 1) + ")",
              }}
              onMouseEnter={() => setActiveBadgeTooltip(badge.id)}
              onMouseLeave={() => setActiveBadgeTooltip(null)}
              onClick={() => {
                const matched = PRESET_SCENARIOS.find((s) => s.id === badge.presetId) || PRESET_SCENARIOS[0];
                setActivePreset(matched);
                onSelectPreset(matched);
              }}
            >
              <div className="group relative flex items-center gap-2.5 rounded-full px-4 py-2 border backdrop-blur-md transition-all duration-300 shadow-md hover:shadow-xl bg-white/90 dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-500/50">
                <span
                  className="w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{ backgroundColor: badge.accent }}
                />
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 font-sans">
                      {badge.name}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded-full font-mono font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
                      {badge.tag}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {badge.role}
                  </span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-indigo-500">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Hero Copy & Primary Call to Action */}
      <div className="trial-intro-copy mx-auto text-center pt-8 pb-4 relative z-10 max-w-3xl px-4">
        <p className="trial-kicker flex items-center justify-center gap-2 text-xs font-mono tracking-widest uppercase font-semibold text-indigo-600 dark:text-indigo-400 mb-4">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping inline-block" />
          YOUR AI STACK ADVISOR
        </p>

        <h1 className="trial-animated-title font-sans font-bold text-slate-900 dark:text-white tracking-tight leading-[1.05] text-4xl sm:text-6xl md:text-7xl mb-4">
          <span>Find your</span>
          <em className="text-indigo-600 dark:text-indigo-400 not-italic block mt-1">
            suitable AI.
          </em>
        </h1>

        <p className="trial-intro-body text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-xl mx-auto mb-7 leading-relaxed">
          Describe the work. Get the specific AI model for each job, the way to access it, and the real estimated cost.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            className="trial-primary-button trial-intro-cta group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.03] active:scale-[0.98]"
            onClick={onBegin}
          >
            <span>Try it for free</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
        <small className="trial-intro-note block mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          No sign-up required.
        </small>
      </div>

      {/* 4. Interactive Live Stack Simulator Card */}
      <div className="relative z-10 max-w-3xl mx-auto mt-6 px-4 pb-12">
        <div className="text-center mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 shadow-sm">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            Interactive Live Comparison Simulator
          </span>
        </div>

        {/* Preset Selector Tabs */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap mb-4">
          {PRESET_SCENARIOS.map((preset) => {
            const isActive = activePreset.id === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                className={"flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer " + (
                  isActive
                    ? "bg-indigo-600 text-white shadow-md scale-[1.03]"
                    : "bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60"
                )}
                onClick={() => setActivePreset(preset)}
              >
                <span>{preset.icon}</span>
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3D Interactive Card */}
        <div
          className="perspective-[1000px] transition-all duration-200 ease-out"
          style={{
            transform: "perspective(1000px) rotateX(" + (tiltX * 0.35) + "deg) rotateY(" + (tiltY * 0.35) + "deg)",
          }}
        >
          <div className="relative rounded-2xl p-5 sm:p-6 border backdrop-blur-xl transition-all duration-300 shadow-xl bg-white/90 dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800/90 hover:border-indigo-500/40">
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activePreset.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-sans">
                      {activePreset.label}
                    </h3>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
                      {activePreset.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {activePreset.brief}
                  </p>
                </div>
              </div>

              {/* Savings Pill */}
              <div className="flex items-center gap-2 self-start sm:self-auto bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60 px-3 py-1.5 rounded-full">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 font-mono">
                  Save {activePreset.savingsPercent}% / mo
                </span>
              </div>
            </div>

            {/* Models & Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              {/* Recommended Lean AI Stack */}
              <div className="rounded-xl p-3.5 bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                    <Wand2 className="w-3 h-3 text-indigo-500" />
                    Recommended Lean AI Stack
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {"~$" + activePreset.optimizedCost.toFixed(2) + "/mo"}
                  </span>
                </div>

                <div className="space-y-2">
                  {activePreset.recommendedModels.map((m) => (
                    <div
                      key={m.name}
                      className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                        <div>
                          <strong className="text-slate-900 dark:text-slate-100 font-medium block">
                            {m.name}
                          </strong>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            {m.role}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {m.cost}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Traditional Bloated Stack vs Lean Savings */}
              <div className="rounded-xl p-3.5 bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-rose-500" />
                      Traditional Subscriptions
                    </span>
                    <span className="text-xs font-mono font-medium line-through text-slate-400">
                      {"$" + activePreset.traditionalCost + "/mo"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed my-2">
                    {activePreset.savingsNote}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <DollarSign className="w-3 h-3 text-emerald-500" />
                    <span>Monthly Waste Eliminated:</span>
                  </div>
                  <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                    {"+$" + (activePreset.traditionalCost - activePreset.optimizedCost).toFixed(2) + "/mo"}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Card Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Want this exact AI setup for your project?
              </span>

              <button
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 shadow-md cursor-pointer"
                onClick={() => {
                  onSelectPreset(activePreset);
                }}
              >
                <span>Test this brief in free trial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}