import type { Metadata } from "next";
import { BillingView } from "@/components/billing-view";

export const metadata: Metadata = { title: "Billing · BENCHFLOW" };

export default function BillingPage() {
  return (
    <div className="editorial-page-container max-w-4xl">
      <BillingView />
    </div>
  );
}
