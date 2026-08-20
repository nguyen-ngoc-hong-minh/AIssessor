import type { Metadata } from "next";
import { BillingView } from "@/components/billing-view";

export const metadata: Metadata = { title: "Billing · AIssessor" };

export default function BillingPage() {
  return <BillingView />;
}
