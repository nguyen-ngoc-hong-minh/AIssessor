import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";
import "@xyflow/react/dist/style.css";

const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
const jetBrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "BENCHFLOW — Build the right AI stack", template: "%s · BENCHFLOW" },
  description: "Compare AI products, plans, costs, and evidence for the work you need to do.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Build the right AI stack for real work.",
    description: "Clear tools, plans, costs, and reasons.",
  },
  twitter: { card: "summary" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetBrainsMono.variable}`}><Providers>{children}</Providers></body></html>;
}
