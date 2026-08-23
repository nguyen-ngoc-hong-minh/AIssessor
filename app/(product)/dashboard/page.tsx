import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard-view";

export const metadata: Metadata = { title: "Dashboard · Aissessor" };

export default function DashboardPage() {
  return (
    <div className="editorial-page-container">
      <DashboardView />
    </div>
  );
}
