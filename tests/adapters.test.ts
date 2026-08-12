import { afterEach, describe, expect, it, vi } from "vitest";
import { ArtificialAnalysisAdapter, OpenRouterAdapter } from "@/lib/model-data/adapters";
import { normalizeArtificialAnalysis, normalizeMmluPro, normalizeOpenAiOfficial, normalizeOpenRouter } from "@/lib/model-data/normalizers";

afterEach(() => vi.unstubAllGlobals());

describe("official source adapters", () => {
  it("uses the Artificial Analysis key and free-tier endpoint", async () => {
    const fetchMock = vi.fn().mockImplementation(() => Promise.resolve(new Response(JSON.stringify({ data: [] }), { status: 200 })));
    vi.stubGlobal("fetch", fetchMock);
    await new ArtificialAnalysisAdapter("key").fetchSnapshot();
    expect(fetchMock.mock.calls[0][0]).toContain("/language/models/free");
    expect(fetchMock.mock.calls[0][1].headers["x-api-key"]).toBe("key");
  });

  it("supports OpenRouter's public models endpoint and optional authentication", async () => {
    const fetchMock = vi.fn().mockImplementation(() => Promise.resolve(new Response(JSON.stringify({ data: [] }), { status: 200 })));
    vi.stubGlobal("fetch", fetchMock);
    await new OpenRouterAdapter().fetchSnapshot();
    expect(fetchMock.mock.calls[0][1].headers).toBeUndefined();
    await new OpenRouterAdapter("key").fetchSnapshot();
    expect(fetchMock.mock.calls[1][1].headers.Authorization).toBe("Bearer key");
  });
});

describe("source normalizers", () => {
  it("normalizes only present Artificial Analysis and OpenRouter values", () => {
    const aa = normalizeArtificialAnalysis({ data: [{ name: "GPT-4o", slug: "gpt-4o", model_creator: { name: "OpenAI" }, evaluations: { artificial_analysis_intelligence_index: 42 }, pricing: { price_1m_input_tokens: 1 } }] }, 100);
    expect(aa[0].benchmarks[0].score).toBe(42);
    expect(aa[0].prices).toHaveLength(1);
    const openRouter = normalizeOpenRouter({ data: [{ id: "lab/model", name: "Model", context_length: 1000, pricing: { prompt: "0.000001" }, architecture: { input_modalities: ["text"] } }] }, 100);
    expect(openRouter[0].prices[0].amount).toBe(1);
  });

  it("retains unknown benchmark identities for manual review without fuzzy merging", () => {
    const [model] = normalizeArtificialAnalysis({ data: [{ name: "Nearly GPT Four Oh", slug: "nearly-gpt" }] }, 100);
    expect(model.canonicalId).toContain("unmatched/artificial_analysis");
    expect(model.manualReviewRequired).toBe(true);
  });

  it("maps official MMLU-Pro categories and explicit GPT-4o aliases", () => {
    const csv = "Models,Data Source,Overall,Business,Law,Health,Computer Science\nGPT-4o (2024-05-13),TIGER-Lab,0.7255,0.8,0.7,0.6,0.75\n";
    const [model] = normalizeMmluPro(csv, 100, "revision-1");
    expect(model.canonicalId).toBe("openai/gpt-4o");
    expect(model.mappingConfidence).toBe("explicit_alias");
    expect(model.benchmarks.find((item) => item.category === "legal")?.normalizedValue).toBe(70);
    expect(model.benchmarks.every((item) => item.sourceVersion === "revision-1")).toBe(true);
  });

  it("fails closed on malformed MMLU-Pro CSV", () => {
    expect(() => normalizeMmluPro("Name,Score\nModel,1\n", 100)).toThrow("missing required Models or Overall");
  });

  it("leaves a missing trailing official CSV category unavailable without shifting columns", () => {
    const [model] = normalizeMmluPro("Models,Data Source,Overall,Business,Other\nUnknown,TIGER-Lab,0.5,0.7\n", 100);
    expect(model.benchmarks.find((item) => item.metric === "mmlu_pro_business")?.normalizedValue).toBe(70);
    expect(model.benchmarks.some((item) => item.metric === "mmlu_pro_other")).toBe(false);
  });

  it("extracts exact pricing, context, capabilities, and privacy from OpenAI docs", () => {
    const markdown = "# GPT-4o\n\nModel ID: `gpt-4o`\n\n## Model details\n- Input modalities: text, image\n- Output modalities: text\n- 128,000 context window\n\n## Pricing\n| Metric | Price | Unit |\n| --- | ---: | --- |\n| Input | $2.5 | 1M tokens |\n| Cached input | $1.25 | 1M tokens |\n| Output | $10 | 1M tokens |\n\n## Supported features\n- structured_outputs\n- function_calling\n\n## Supported tools\n";
    const privacy = "API data is not used to train or improve models. Abuse monitoring logs are retained for up to 30 days.";
    const [model] = normalizeOpenAiOfficial({ models: [{ url: "https://developers.openai.com/api/docs/models/gpt-4o.md", markdown }], privacy: { url: "https://developers.openai.com/api/docs/guides/your-data.md", markdown: privacy } }, 100);
    expect(model.contextWindow).toBe(128000);
    expect(model.prices.map((item) => item.amount)).toEqual([2.5, 1.25, 10]);
    expect(model.capabilities).toContain("structured_outputs");
    expect(model.privacy[0].level).toBe("standard");
    expect(model.licenses).toEqual([]);
  });

  it("fails closed when provider documentation loses required fields", () => {
    expect(() => normalizeOpenAiOfficial({ models: [{ url: "https://example.test/model.md", markdown: "# Model" }], privacy: { url: "https://example.test/privacy.md", markdown: "changed" } }, 100)).toThrow("expected data-control statements");
  });
});
