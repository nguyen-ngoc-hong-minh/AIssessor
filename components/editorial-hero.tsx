"use client";

import { ArrowRight, ArrowUpRight, Check, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { PixelCanvasCard } from "./pixel-canvas-card";

interface EditorialHeroProps {
  onBegin: () => void;
  onSelectBrief: (briefText: string, tools?: string[]) => void;
}

const CARDS_DATA = [
  {
    index: "01",
    title: "Brand & Creative Suite",
    category: "Visuals & Copy",
    type: "neural" as const,
    description: "Generate high-res visual brand identities, banners and marketing copy without bloated subscriptions.",
    brief: "Create a complete visual brand identity, generate high-res marketing banners, and draft campaign copy for a product launch.",
    tools: ["Midjourney", "Claude", "Canva"],
  },
  {
    index: "02",
    title: "Full-Stack Engineering",
    category: "Code & Logic",
    type: "matrix" as const,
    description: "Match optimal reasoning LLMs and direct API credits for high-throughput code synthesis and debugging.",
    brief: "Build a Next.js web application with PostgreSQL backend, write unit tests, and resolve complex edge-case bugs.",
    tools: ["ChatGPT", "Cursor", "Claude"],
  },
  {
    index: "03",
    title: "Market & PDF Synthesis",
    category: "2M Context",
    type: "benchmark" as const,
    description: "Ingest massive 50-page financial reports and extract structured data tables with near-zero token cost.",
    brief: "Analyze 50-page financial PDF statements, extract market growth tables, and write an executive synthesis report.",
    tools: ["Claude", "ChatGPT"],
  },
];

const CATEGORIES = ["All", "Freelancers", "Small Teams", "Growing Pros"];

export function EditorialHero({ onBegin, onSelectBrief }: EditorialHeroProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="editorial-hero-container relative w-full px-3 sm:px-6 md:px-10 py-6 sm:py-10 max-w-7xl mx-auto z-10">
      {/* Main High-Contrast Editorial Canvas Card */}
      <div className="editorial-frame relative w-full bg-[#FAF9F6] text-[#071A57] rounded-[24px] sm:rounded-[36px] border border-slate-300/80 shadow-2xl overflow-hidden p-5 sm:p-8 md:p-12 transition-all duration-300">
        
        {/* 1. Top Editorial Chrome / Navigation Bar */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-300/70">
          {/* Solid Blue Box Badge (from art direction) */}
          <div className="flex items-center gap-2 bg-[#103FD5] text-white px-3.5 py-1.5 rounded-md font-mono text-[11px] font-bold tracking-wider shadow-sm uppercase">
            <span className="w-2 h-2 rounded-full bg-[#C3F84A] animate-pulse" />
            AISSESSOR / AI ADVISOR
          </div>

          {/* Center Navigation Columns */}
          <div className="flex items-center gap-6 text-[11px] font-mono uppercase tracking-widest text-[#071A57]/80">
            <span className="hover:text-[#103FD5] cursor-pointer transition-colors font-bold text-[#103FD5]">
              MATCHING
            </span>
            <span className="hover:text-[#103FD5] cursor-pointer transition-colors">
              BENCHMARKS
            </span>
            <span className="hover:text-[#103FD5] cursor-pointer transition-colors">
              SAVINGS
            </span>
          </div>

          {/* Solid Blue Square Button Icon */}
          <button
            type="button"
            className="hidden sm:flex items-center justify-center w-9 h-9 bg-[#103FD5] hover:bg-[#071A57] text-white rounded-md transition-colors shadow-sm cursor-pointer"
            onClick={onBegin}
            aria-label="Begin trial"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </header>

        {/* 2. Main Title Section with Stepped Graphic Accent */}
        <div className="relative pt-8 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-300/70">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs font-bold text-[#103FD5] tracking-widest">
                [01 // PROCUREMENT ENGINE]
              </span>
              <span className="font-mono text-xs text-slate-500 font-semibold">
                (08)
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-extrabold tracking-tight text-[#071A57] leading-[1.02]">
              Find your <br className="hidden sm:block" />
              <span className="text-[#103FD5]">suitable AI.</span>
            </h1>
          </div>

          {/* Stepped Pixel Graphic Box (from art direction) */}
          <div className="hidden lg:flex flex-col items-end gap-1.5 self-start">
            <div className="w-16 h-8 bg-[#103FD5] rounded-t-sm" />
            <div className="w-28 h-8 bg-[#103FD5] flex items-center justify-end px-2 text-[10px] font-mono text-white font-bold">
              AI MATCH
            </div>
            <div className="w-36 h-8 bg-[#103FD5] rounded-b-sm flex items-center justify-between px-3 text-[10px] font-mono text-[#C3F84A] font-bold">
              <span>ACTIVE</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* 3. Filter Category Pills + Subtitle + Primary CTA Bar */}
        <div className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left Category List */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={"px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer " + (
                  activeCategory === cat
                    ? "bg-[#103FD5] text-white shadow-sm"
                    : "bg-slate-200/70 hover:bg-slate-300/70 text-[#071A57]"
                )}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Subtitle Description */}
          <p className="text-xs sm:text-sm font-sans text-slate-600 max-w-md leading-relaxed">
            Describe the work. Get the specific AI model for each job, the way to access it, and the real estimated cost.
          </p>

          {/* High-Contrast Solid Blue Button */}
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#103FD5] hover:bg-[#071A57] text-white font-sans font-bold text-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer self-start md:self-auto active:scale-[0.98]"
            onClick={onBegin}
          >
            <span>Try it for free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4. Interactive 3-Card Pixel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-4">
          {CARDS_DATA.map((card) => (
            <PixelCanvasCard
              key={card.index}
              index={card.index}
              title={card.title}
              category={card.category}
              description={card.description}
              type={card.type}
              onClick={() => onSelectBrief(card.brief, card.tools)}
            />
          ))}
        </div>

        {/* 5. Minimal Editorial Footer */}
        <footer className="mt-8 pt-4 border-t border-slate-300/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-slate-500">
          <span>Aissessor &bull; AI Stack Procurement Advisor &bull; 2026</span>
          <span className="font-semibold text-[#103FD5]">
            No sign-up required &bull; Free instant match
          </span>
        </footer>
      </div>
    </div>
  );
}
