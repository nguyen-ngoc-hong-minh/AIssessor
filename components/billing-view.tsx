"use client";

import { ArrowUpRight, CreditCard, ShieldCheck, Check } from "lucide-react";
import { useState } from "react";
import { IntegrationNotice } from "./integration-notice";
import { integrationsConfigured } from "./providers";

export function BillingView() {
  const [error, setError] = useState("");

  async function portal() {
    setError("");
    const response = await fetch("/api/billing/portal", { method: "POST" });
    const body = (await response.json()) as { url?: string; error?: string };
    if (!response.ok || !body.url) {
      setError(body.error ?? "Portal unavailable");
      return;
    }
    location.href = body.url;
  }

  return (
    <div className="billing-editorial-wrap space-y-10 max-w-4xl mx-auto">
      {!integrationsConfigured && <IntegrationNotice />}

      {/* Header */}
      <div className="editorial-page-header text-left">
        <div className="eyebrow mb-4">
          <span className="dt" />
          BILLING &amp; SUBSCRIPTION
        </div>
        <h1 className="h-display text-4xl font-semibold text-white mb-3">Manage Your Subscription</h1>
        <p className="body-lg text-ink-2 max-w-2xl leading-relaxed">
          Verified Stripe Checkout and subscription tier access. Upgrades, downgrades, and invoices are handled securely.
        </p>
      </div>

      {/* Main Billing Card */}
      <div className="glass-card p-8 md:p-10 space-y-8 border border-white/10">
        <div className="flex items-start gap-6 pb-6 border-b border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 grid place-items-center flex-none">
            <CreditCard className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <span className="font-mono text-xs text-indigo-soft tracking-wider block uppercase">CURRENT PLAN</span>
            <h2 className="h-display text-2xl font-medium text-white">Active Workspace Tier</h2>
            <p className="body-md text-ink-2 leading-relaxed">
              Your subscription grants access to full AI strategy plans, evidence verification, and exportable reports.
            </p>
          </div>
        </div>

        {/* Benefits List */}
        <div className="space-y-3">
          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white/5 border border-white/10 text-sm">
            <Check className="w-4 h-4 text-emerald-400 flex-none" />
            <span className="text-white font-medium">Verified Stripe Checkout integration</span>
          </div>
          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white/5 border border-white/10 text-sm">
            <Check className="w-4 h-4 text-emerald-400 flex-none" />
            <span className="text-white font-medium">Instant entitlement updates via webhooks</span>
          </div>
          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white/5 border border-white/10 text-sm">
            <Check className="w-4 h-4 text-emerald-400 flex-none" />
            <span className="text-white font-medium">Download PDF invoices &amp; receipts</span>
          </div>
          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white/5 border border-white/10 text-sm">
            <Check className="w-4 h-4 text-emerald-400 flex-none" />
            <span className="text-white font-medium">Cancel or upgrade anytime without penalties</span>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="pt-4 border-t border-white/10 flex justify-start">
          <button
            className="btn-primary"
            disabled={!integrationsConfigured}
            onClick={portal}
          >
            <span>Open Stripe Customer Portal</span>
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
