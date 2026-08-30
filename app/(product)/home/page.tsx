import type { Metadata } from "next";
import { SignedInHome } from "@/components/signed-in-home";

export const metadata: Metadata = { title: "Home · Aissessor" };

export default function SignedInHomePage() {
  return <SignedInHome />;
}
