import Link from "next/link";
import { Brand } from "./brand";

export function SiteFooter() {
  return <footer className="site-footer"><div><Brand /><p>Explainable AI workflow and model recommendations for real work.</p></div><div><strong>Product</strong><Link href="/how-it-works">How it works</Link><Link href="/pricing">Pricing</Link></div><div><strong>Legal</strong><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><small>© 2026 BENCHFLOW. Model data is dated and source-linked.</small></footer>;
}
