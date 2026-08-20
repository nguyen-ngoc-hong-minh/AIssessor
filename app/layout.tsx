import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";
import "@xyflow/react/dist/style.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

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
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}><Providers>{children}</Providers></body></html>;
}
