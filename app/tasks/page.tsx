import type { Metadata } from "next";
import { TaskDirectory } from "@/components/task-directory";

export const metadata: Metadata = {
  title: "AI Task Directory",
  description: "Search thousands of AI tools across creativity, work, and personal tasks, then compare verified pricing, releases, alternatives, and trade-offs.",
};

export default function TasksPage() {
  return <TaskDirectory />;
}
