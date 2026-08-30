"use client";

import { Info } from "lucide-react";

export function InfoTip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <details className="info-tip">
      <summary aria-label={`About ${label}`} title={`About ${label}`}><Info aria-hidden="true" /></summary>
      <div role="tooltip"><strong>{label}</strong><p>{children}</p></div>
    </details>
  );
}
