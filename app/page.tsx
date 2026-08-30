import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TrialExperience } from "@/components/trial-experience";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    const { userId } = await auth();
    if (userId) redirect("/dashboard");
  }
  return <TrialExperience />;
}
