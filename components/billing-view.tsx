"use client";

import Link from "next/link";
import { Check } from "lucide-react";

export function BillingView() {
  return (
    <div className="slide-inner s-compare w-full max-w-full">
      {/* Deck 6 style header layout */}
      <div className="s-compare-head">
        <div className="eyebrow mb-2">
          <span className="dt" />
          Simple pricing
        </div>
        <h2 className="h-display text-4xl md:text-5xl lg:text-6xl font-semibold">
          Affordable plans for every budget
        </h2>
        <p className="body-lg">
          Explore our range of pricing options designed to fit any budget, offering exceptional value and flexibility to meet your unique needs.
        </p>
      </div>

      {/* 3-Column Pricing Grid matching new plan tiers */}
      <div className="feature-grid grid grid-cols-1 md:grid-cols-3 gap-6 mt-6" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {/* Card 1: STARTER ($2.99/mo) */}
        <div className="feature glass-card pricing-deck-card flex flex-col justify-between p-8 relative overflow-visible pt-8 z-20">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-sm bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
              <div className="plan-name text-xl font-semibold text-white tracking-wide uppercase">STARTER</div>
            </div>
            <div className="plan-price-row flex items-baseline gap-1 my-3">
              <span className="plan-price text-4xl font-bold text-white">$2.99</span>
              <span className="plan-period text-sm text-ink-2">/month</span>
            </div>
            <div className="font-medium text-sm text-indigo-300 mb-4 pb-3 border-b border-white/10">
              3 AI Task Assessments / month
            </div>

            <div className="plan-features-label font-mono text-xs text-indigo-soft uppercase tracking-wider mb-3">
              Features:
            </div>
            <ul className="plan-features-list space-y-3 mb-6">
              <li className="flex items-center gap-3 text-sm text-ink-2">
                <span className="w-4 h-4 rounded-full bg-white/20 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>AI recommendation</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-2">
                <span className="w-4 h-4 rounded-full bg-white/20 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>Cost estimate</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-2">
                <span className="w-4 h-4 rounded-full bg-white/20 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>Save up to 3 strategies</span>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-white/90 mb-4 pt-4 border-t border-white/10 flex items-center gap-1.5">
              <span>&rarr;</span> <span>Best for Creative Freelancers</span>
            </div>
            <Link href="/choose-usage" className="btn-secondary plan-cta-btn w-full text-center justify-center">
              Get Started
            </Link>
          </div>
        </div>

        {/* Card 2: OPTIMISE ($9.99/mo) (Recommended) */}
        <div className="feature glass-card pricing-deck-card bg-gradient-to-b from-[#151929] to-[#0c0f1c] border-2 border-indigo-500/60 shadow-2xl relative overflow-visible flex flex-col justify-between p-8 pt-8 z-20">
          <div className="eyebrow absolute -top-3.5 right-6 z-[100] bg-[#181a30] border border-indigo-400/60 shadow-md">
            <span className="dt" />
            <span>Recommended</span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-amber-400 text-sm">⭐</span>
              <div className="plan-name text-xl font-semibold text-white tracking-wide uppercase">OPTIMISE</div>
            </div>
            <div className="plan-price-row flex items-baseline gap-1 my-3">
              <span className="plan-price text-4xl font-bold text-white">$9.99</span>
              <span className="plan-period text-sm text-ink-2">/month</span>
            </div>
            <div className="font-medium text-sm text-indigo-300 mb-4 pb-3 border-b border-white/10">
              20 AI Task Assessments / month
            </div>

            <div className="plan-features-label font-mono text-xs text-indigo-soft uppercase tracking-wider mb-3">
              Features:
            </div>
            <ul className="plan-features-list space-y-3 mb-6">
              <li className="flex items-center gap-3 text-sm text-white font-medium">
                <span className="w-4 h-4 rounded-full bg-indigo-500 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>Full AI workflow</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-2">
                <span className="w-4 h-4 rounded-full bg-indigo-500 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>Cost &amp; performance comparison</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-2">
                <span className="w-4 h-4 rounded-full bg-indigo-500 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>Subscription optimisation</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-2">
                <span className="w-4 h-4 rounded-full bg-indigo-500 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>Potential savings estimate</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-2">
                <span className="w-4 h-4 rounded-full bg-indigo-500 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>Save up to 20 strategies</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-2">
                <span className="w-4 h-4 rounded-full bg-indigo-500 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>Monthly AI recommendations</span>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-white/90 mb-4 pt-4 border-t border-white/10 flex items-center gap-1.5">
              <span>&rarr;</span> <span>Best for Independent Professionals</span>
            </div>
            <Link
              href="/choose-usage"
              className="btn-primary plan-cta-btn w-full text-center justify-center text-black bg-white hover:bg-indigo-100"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Card 3: TEAM (CUSTOM) */}
        <div className="feature glass-card pricing-deck-card flex flex-col justify-between p-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
              <div className="plan-name text-xl font-semibold text-white tracking-wide uppercase">TEAM</div>
            </div>
            <div className="plan-price-row flex items-baseline gap-1 my-3">
              <span className="plan-price text-4xl font-bold text-white">CUSTOM</span>
            </div>
            <div className="font-medium text-sm text-indigo-300 mb-4 pb-3 border-b border-white/10">
              Custom AI Task Assessments
            </div>

            <div className="plan-features-label font-mono text-xs text-indigo-soft uppercase tracking-wider mb-3">
              Features:
            </div>
            <ul className="plan-features-list space-y-3 mb-6">
              <li className="flex items-center gap-3 text-sm text-ink-2">
                <span className="w-4 h-4 rounded-full bg-white/20 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>Full AI workflow</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-2">
                <span className="w-4 h-4 rounded-full bg-white/20 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>Cost &amp; performance comparison</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-2">
                <span className="w-4 h-4 rounded-full bg-white/20 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>Subscription optimisation</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-2">
                <span className="w-4 h-4 rounded-full bg-white/20 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>Custom strategy storage</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-2">
                <span className="w-4 h-4 rounded-full bg-white/20 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>Shared AI workspace</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-2">
                <span className="w-4 h-4 rounded-full bg-white/20 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>Team cost tracking</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-2">
                <span className="w-4 h-4 rounded-full bg-white/20 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>Team recommendations</span>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-white/90 mb-4 pt-4 border-t border-white/10 flex items-center gap-1.5">
              <span>&rarr;</span> <span>Best for: Growing Businesses</span>
            </div>
            <a
              href="mailto:sales@aissessor.app"
              className="btn-secondary plan-cta-btn w-full text-center justify-center"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
