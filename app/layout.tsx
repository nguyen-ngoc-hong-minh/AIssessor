import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";
import "@xyflow/react/dist/style.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers(); const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https"; const image = `${protocol}://${host}/og-benchflow-blue.png`;
  return { title: { default: "BENCHFLOW — Find the right AI setup", template: "%s · BENCHFLOW" }, description: "Describe your work, review the workflow, and compare compatible AI options with source-dated evidence.", icons: { icon: "/favicon.svg" }, openGraph: { title: "Find the right AI setup for the work you actually do.", description: "Workflow-first, explainable AI recommendations.", images: [{ url: image, width: 1200, height: 630, alt: "BENCHFLOW workflow planning" }] }, twitter: { card: "summary_large_image", images: [image] } };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}><Providers>{children}</Providers></body></html>;
}
