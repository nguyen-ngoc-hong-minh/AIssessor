import type { Metadata } from "next";
import { TaskDirectory } from "@/components/task-directory";

export const metadata: Metadata = {
  title: "AI Task Directory",
  description: "Browse curated AI tools for creativity, work, and personal tasks, with pricing, releases, alternatives, and practical trade-offs.",
};

export default function TasksPage() {
  return <TaskDirectory />;
}
