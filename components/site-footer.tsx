import Link from "next/link";
import { Brand } from "./brand";

export function SiteFooter() {
  return <footer className="site-footer"><div><Brand /><p>A clear AI stack for the work you actually need to do.</p></div><div><strong>Product</strong><Link href="/how-it-works">How it works</Link><Link href="/pricing">Pricing</Link><Link href="/sign-up">New strategy</Link></div><div><strong>Company</strong><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><small>© 2026 BENCHFLOW. Recommendations use dated, source-linked evidence.</small></footer>;
}
