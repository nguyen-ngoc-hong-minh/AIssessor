import Link from "next/link";
import { Layers } from "lucide-react";

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="BENCHFLOW home">
      <span className="brand-icon">
        <Layers className="w-4 h-4 text-black" />
      </span>
      <span className="brand-text">BENCHFLOW</span>
    </Link>
  );
}
