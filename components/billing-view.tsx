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
    <div className="billing-editorial-wrap">
      {!integrationsConfigured && <IntegrationNotice />}

      {/* Header */}
      <div className="editorial-page-header">
        <span className="mono-badge">[ BILLING &amp; SUBSCRIPTION ]</span>
        <h1>Manage Your Subscription</h1>
        <p>Verified Stripe Checkout and subscription tier access. Upgrades, downgrades, and invoices are handled securely.</p>
      </div>

      {/* Main Billing Card */}
      <div className="editorial-card-block">
        <div className="billing-card-top">
          <div className="billing-icon-wrap">
            <CreditCard className="w-6 h-6 text-black" />
          </div>
          <div>
            <span className="mono-badge">[ CURRENT PLAN ]</span>
            <h2>Active Workspace Tier</h2>
            <p>Your subscription grants access to full AI strategy plans, evidence verification, and exportable reports.</p>
          </div>
        </div>

        <div className="billing-features-grid">
          <div className="b-feature-item">
            <Check className="w-4 h-4 text-black flex-none" />
            <span>Verified Stripe Checkout integration</span>
          </div>
          <div className="b-feature-item">
            <Check className="w-4 h-4 text-black flex-none" />
            <span>Instant entitlement updates via webhooks</span>
          </div>
          <div className="b-feature-item">
            <Check className="w-4 h-4 text-black flex-none" />
            <span>Download PDF invoices &amp; receipts</span>
          </div>
          <div className="b-feature-item">
            <Check className="w-4 h-4 text-black flex-none" />
            <span>Cancel or upgrade anytime without penalties</span>
          </div>
        </div>

        {error && <p className="error-message mt-4">{error}</p>}

        <div className="billing-action-bar">
          <button
            className="minimal-btn minimal-btn-dark"
            disabled={!integrationsConfigured}
            onClick={portal}
          >
            <span>Open Stripe Customer Portal</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
