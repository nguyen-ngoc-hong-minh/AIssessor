import { createHash } from "node:crypto";
import type { SourceId } from "./source-registry";

export type SourceSnapshot = {
  source: SourceId;
  sourceUrl: string;
  attribution: string;
  payload: unknown;
  payloadHash: string;
  fetchedAt: number;
  sourceVersion?: string;
  metadata?: Record<string, unknown>;
};

export interface ModelSourceAdapter {
  readonly source: SourceId;
  fetchSnapshot(): Promise<SourceSnapshot>;
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`).join(",")}}`;
  return JSON.stringify(value);
}

function snapshot(source: SourceId, sourceUrl: string, attribution: string, payload: unknown, response?: Response): SourceSnapshot {
  const serialised = typeof payload === "string" ? payload : stableJson(payload);
  const sourceVersion = response?.headers.get("x-repo-commit") ?? response?.headers.get("etag") ?? response?.headers.get("last-modified") ?? undefined;
  return {
    source,
    sourceUrl,
    attribution,
    payload,
    payloadHash: createHash("sha256").update(serialised).digest("hex"),
    fetchedAt: Date.now(),
    sourceVersion,
    metadata: response ? { contentType: response.headers.get("content-type"), sourceVersion } : undefined,
  };
}

async function checkedFetch(url: string, init?: RequestInit) {
  const response = await fetch(url, { ...init, signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response;
}

export class ArtificialAnalysisAdapter implements ModelSourceAdapter {
  readonly source = "artificial_analysis" as const;
  constructor(private readonly apiKey: string, private readonly baseUrl = "https://artificialanalysis.ai/api/v2") {}
  async fetchSnapshot(): Promise<SourceSnapshot> {
    if (!this.apiKey) throw new Error("ARTIFICIAL_ANALYSIS_API_KEY is not configured");
    const sourceUrl = `${this.baseUrl}/language/models/free`;
    const pages: unknown[] = [];
    let page = 1;
    let response: Response | undefined;
    while (page <= 100) {
      response = await checkedFetch(page === 1 ? sourceUrl : `${sourceUrl}?page=${page}`, { headers: { "x-api-key": this.apiKey } });
      const payload = await response.json() as Record<string, unknown>;
      pages.push(...(Array.isArray(payload.data) ? payload.data : []));
      const pagination = (payload.pagination && typeof payload.pagination === "object" ? payload.pagination : {}) as Record<string, unknown>;
      const current = Number(pagination.current_page ?? pagination.page ?? page);
      const total = Number(pagination.total_pages ?? current);
      if (!Number.isFinite(total) || current >= total) break;
      page = current + 1;
    }
    return snapshot(this.source, sourceUrl, "Artificial Analysis official API", { data: pages }, response);
  }
}

export class OpenRouterAdapter implements ModelSourceAdapter {
  readonly source = "openrouter" as const;
  constructor(private readonly apiKey = "", private readonly baseUrl = "https://openrouter.ai/api/v1") {}
  async fetchSnapshot(): Promise<SourceSnapshot> {
    const sourceUrl = `${this.baseUrl}/models`;
    const headers = this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : undefined;
    const response = await checkedFetch(sourceUrl, { headers });
    return snapshot(this.source, sourceUrl, "OpenRouter official models API", await response.json(), response);
  }
}

export class MmluProAdapter implements ModelSourceAdapter {
  readonly source = "mmlu_pro" as const;
  constructor(private readonly sourceUrl = "https://huggingface.co/datasets/TIGER-Lab/mmlu_pro_leaderboard_submission/resolve/main/results.csv") {}
  async fetchSnapshot(): Promise<SourceSnapshot> {
    const response = await checkedFetch(this.sourceUrl);
    return snapshot(this.source, this.sourceUrl, "TIGER-Lab MMLU-Pro official leaderboard dataset", await response.text(), response);
  }
}

export class OpenAiOfficialAdapter implements ModelSourceAdapter {
  readonly source = "openai_official" as const;
  constructor(
    private readonly modelUrls = ["https://developers.openai.com/api/docs/models/gpt-4o.md"],
    private readonly privacyUrl = "https://developers.openai.com/api/docs/guides/your-data.md",
  ) {}
  async fetchSnapshot(): Promise<SourceSnapshot> {
    const [models, privacyResponse] = await Promise.all([
      Promise.all(this.modelUrls.map(async (url) => ({ url, markdown: await (await checkedFetch(url)).text() }))),
      checkedFetch(this.privacyUrl),
    ]);
    const payload = { models, privacy: { url: this.privacyUrl, markdown: await privacyResponse.text() } };
    return snapshot(this.source, this.modelUrls[0], "OpenAI official model and data-control documentation", payload, privacyResponse);
  }
}
