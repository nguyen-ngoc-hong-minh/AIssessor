import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/providers";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import "./globals.css";
import "@xyflow/react/dist/style.css";

const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], display: "swap" });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], display: "swap" });
const jetBrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "AIssessor — Build the right AI stack", template: "%s · AIssessor" },
  description: "Tell us what you’re working on. AIssessor finds the smallest AI stack that can do it within your budget.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Build the right AI stack for real work.",
    description: "Try it free. No account needed until you save your recommendation.",
  },
  twitter: { card: "summary" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetBrainsMono.variable}`}><Providers><AnalyticsTracker />{children}</Providers></body></html>;
}
