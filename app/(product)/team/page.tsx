import type { Metadata } from "next";
import { TeamView } from "@/components/team-view";

export const metadata: Metadata = { title: "Team · BENCHFLOW" };

export default function TeamPage() {
  return (
    <div className="editorial-page-container max-w-4xl">
      <TeamView />
    </div>
  );
}
