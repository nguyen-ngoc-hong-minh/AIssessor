"use client";

import Link from "next/link";
import { Check } from "lucide-react";

export function BillingView() {
  return (
    <div className="billing-editorial-wrap space-y-12 w-full max-w-6xl mx-auto">
      {/* Centered Slide 6 Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="eyebrow mx-auto">
          <span className="dt" />
          Simple pricing
        </div>
        <h1 className="h-display text-4xl md:text-5xl font-semibold text-white tracking-tight">
          Affordable plans for every budget
        </h1>
        <p className="body-lg text-ink-2 leading-relaxed text-sm md:text-base">
          Explore our range of pricing options designed to fit any budget, offering exceptional value and flexibility to meet your unique needs.
        </p>
      </div>

      {/* 3-Column Pricing Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Card 1: Free Plan (Current Plan) */}
        <div className="glass-card pricing-deck-card border border-white/10 w-full flex flex-col justify-between p-8 relative">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="plan-name mb-0 text-xl font-semibold text-white">Free Plan</div>
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
                Current plan
              </span>
            </div>
            <div className="plan-price-row flex items-baseline gap-1 my-4">
              <span className="plan-price text-4xl font-bold text-white">$0</span>
              <span className="plan-period text-sm text-ink-2">/month</span>
            </div>
            <p className="plan-desc text-xs text-ink-2 leading-relaxed mb-6">
              Perfect for Individual Builders, Startups, and Workflow Discovery.
            </p>

            <div className="plan-features-label font-mono text-xs text-indigo-soft uppercase tracking-wider mb-3">
              Features:
            </div>
            <ul className="plan-features-list space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm text-ink-2">
                <span className="w-4 h-4 rounded-full bg-white/20 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>Account and onboarding</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-2">
                <span className="w-4 h-4 rounded-full bg-white/20 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>One task analysis</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-2">
                <span className="w-4 h-4 rounded-full bg-white/20 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>Editable workflow preview</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-2">
                <span className="w-4 h-4 rounded-full bg-white/20 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>Limited recommendation summary</span>
              </li>
            </ul>
          </div>

          <Link href="/dashboard" className="btn-secondary plan-cta-btn w-full text-center justify-center">
            Get Started
          </Link>
        </div>

        {/* Card 2: Featured Plus Plan */}
        <div className="glass-card pricing-deck-card bg-gradient-to-b from-[#151929] to-[#0c0f1c] border-2 border-indigo-500/60 shadow-2xl relative w-full flex flex-col justify-between p-8">
          <div>
            <div className="plan-name text-xl font-semibold text-white mb-4">Plus Plan</div>
            <div className="plan-price-row flex items-baseline gap-1 my-4">
              <span className="plan-price text-4xl font-bold text-white">$19</span>
              <span className="plan-period text-sm text-ink-2">/month</span>
            </div>
            <p className="plan-desc text-xs text-ink-2 leading-relaxed mb-6">
              Complete plans and alternatives for growing businesses.
            </p>

            <div className="plan-features-label font-mono text-xs text-indigo-soft uppercase tracking-wider mb-3">
              Features:
            </div>
            <ul className="plan-features-list space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm text-white font-medium">
                <span className="w-4 h-4 rounded-full bg-indigo-500 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span className="text-white font-medium">Full AI Strategy Plans</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-2">
                <span className="w-4 h-4 rounded-full bg-indigo-500 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>Unlimited saved strategies</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-2">
                <span className="w-4 h-4 rounded-full bg-indigo-500 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>Primary evidence verification</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-2">
                <span className="w-4 h-4 rounded-full bg-indigo-500 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>Monthly workflow recommendations</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="btn-primary plan-cta-btn w-full text-center justify-center text-black bg-white hover:bg-indigo-100"
          >
            Get Started
          </button>
        </div>

        {/* Card 3: Enterprise Plan */}
        <div className="glass-card pricing-deck-card border border-white/10 w-full flex flex-col justify-between p-8">
          <div>
            <div className="plan-name text-xl font-semibold text-white mb-4">Enterprise Plan</div>
            <div className="plan-price-row flex items-baseline gap-1 my-4">
              <span className="plan-price text-4xl font-bold text-white">Custom</span>
            </div>
            <p className="plan-desc text-xs text-ink-2 leading-relaxed mb-6">
              Organisation access, custom API, and dedicated support.
            </p>

            <div className="plan-features-label font-mono text-xs text-indigo-soft uppercase tracking-wider mb-3">
              Features:
            </div>
            <ul className="plan-features-list space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm text-ink-2">
                <span className="w-4 h-4 rounded-full bg-white/20 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>Organisation workspace</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-2">
                <span className="w-4 h-4 rounded-full bg-white/20 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>Custom API access</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-2">
                <span className="w-4 h-4 rounded-full bg-white/20 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>Implementation support</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-ink-2">
                <span className="w-4 h-4 rounded-full bg-white/20 grid place-items-center flex-none">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <span>SLA &amp; dedicated manager</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="btn-secondary plan-cta-btn w-full text-center justify-center"
          >
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
}
