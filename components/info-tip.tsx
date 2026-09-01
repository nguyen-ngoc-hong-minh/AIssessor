"use client";

import { Info } from "lucide-react";

export function InfoTip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span className="info-tip" tabIndex={0} aria-label={`About ${label}`} role="note">
      <span className="info-tip-trigger" aria-hidden="true">
        <Info />
      </span>
      <div role="tooltip" className="info-tip-content">
        <strong>{label}</strong>
        <p>{children}</p>
      </div>
    </span>
  );
}
