import { createHash } from "node:crypto";

export type SourceSnapshot = { source: "artificial_analysis" | "openrouter"; payload: unknown; payloadHash: string; fetchedAt: number };

export interface ModelSourceAdapter {
  readonly source: SourceSnapshot["source"];
  fetchSnapshot(): Promise<SourceSnapshot>;
}

function snapshot(source: SourceSnapshot["source"], payload: unknown): SourceSnapshot {
  const serialised = JSON.stringify(payload);
  return { source, payload, payloadHash: createHash("sha256").update(serialised).digest("hex"), fetchedAt: Date.now() };
}

export class ArtificialAnalysisAdapter implements ModelSourceAdapter {
  readonly source = "artificial_analysis" as const;
  constructor(private readonly apiKey: string, private readonly baseUrl = "https://artificialanalysis.ai/api/v2") {}
  async fetchSnapshot(): Promise<SourceSnapshot> {
    const response = await fetch(`${this.baseUrl}/language/models`, { headers: { "x-api-key": this.apiKey }, signal: AbortSignal.timeout(20_000) });
    if (!response.ok) throw new Error(`Artificial Analysis sync failed with ${response.status}`);
    return snapshot(this.source, await response.json());
  }
}

export class OpenRouterAdapter implements ModelSourceAdapter {
  readonly source = "openrouter" as const;
  constructor(private readonly apiKey: string, private readonly baseUrl = "https://openrouter.ai/api/v1") {}
  async fetchSnapshot(): Promise<SourceSnapshot> {
    const response = await fetch(`${this.baseUrl}/models`, { headers: { Authorization: `Bearer ${this.apiKey}` }, signal: AbortSignal.timeout(20_000) });
    if (!response.ok) throw new Error(`OpenRouter sync failed with ${response.status}`);
    return snapshot(this.source, await response.json());
  }
}
