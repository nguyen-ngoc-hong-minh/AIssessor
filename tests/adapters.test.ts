import { afterEach, describe, expect, it, vi } from "vitest";
import { ArtificialAnalysisAdapter, OpenRouterAdapter, parseArtificialAnalysisPublicPages } from "@/lib/model-data/adapters";
import { normalizeArtificialAnalysis, normalizeMmluPro, normalizeOpenAiOfficial, normalizeOpenRouter } from "@/lib/model-data/normalizers";

afterEach(() => vi.unstubAllGlobals());

describe("official source adapters", () => {
  it("uses the Artificial Analysis key and free-tier endpoint", async () => {
    const fetchMock = vi.fn().mockImplementation(() => Promise.resolve(new Response(JSON.stringify({ data: [] }), { status: 200 })));
    vi.stubGlobal("fetch", fetchMock);
    await new ArtificialAnalysisAdapter("key").fetchSnapshot();
    const apiCall = fetchMock.mock.calls.find((call) => String(call[0]).includes("/language/models/free"));
    expect(apiCall?.[1].headers["x-api-key"]).toBe("key");
  });

  it("uses public language, image, and video datasets without a paid key", async () => {
    const dataset = (name: string, data: unknown[]) => `<script type="application/ld+json">${JSON.stringify({ name, data })}</script>`;
    const language = [
      dataset("Artificial Analysis Intelligence Index", [{ label: "Gemini 3.5 Flash-Lite", intelligenceIndex: 50, detailsUrl: "/models/gemini-3-5-flash-lite" }]),
      dataset("Pricing: Cache Hit, Input, and Output", [{ label: "Gemini 3.5 Flash-Lite", pricing: [{ name: "inputPrice", value: .1 }, { name: "outputPrice", value: .4 }], detailsUrl: "/models/gemini-3-5-flash-lite" }]),
      dataset("Context Window", [{ label: "Gemini 3.5 Flash-Lite", contextWindowTokens: 1000000, detailsUrl: "/models/gemini-3-5-flash-lite" }]),
    ].join("");
    const image = [dataset("Image Arena Quality Elo", [{ label: "GPT Image", elo: [{ name: "mid", value: 1200 }], detailsUrl: "/image/model-families/openai-gpt" }]), dataset("Price ($/1k images)", [{ label: "GPT Image", price: 40 }])].join("");
    const video = [dataset("Video Arena Quality Elo", [{ label: "Veo", elo: [{ name: "mid", value: 1300 }], detailsUrl: "/video/model-families/google-veo" }]), dataset("Price ($/min)", [{ label: "Veo", price: 6 }])].join("");
    const parsed = parseArtificialAnalysisPublicPages(language, image, video);
    expect(parsed.data[0]).toMatchObject({ slug: "gemini-3-5-flash-lite", context_window_tokens: 1000000 });
    expect(parsed.imageModels[0]).toMatchObject({ name: "GPT Image", price: 40 });
    expect(parsed.videoModels[0]).toMatchObject({ name: "Veo", price: 6 });
  });

  it("supports OpenRouter's public models endpoint and optional authentication", async () => {
    const fetchMock = vi.fn().mockImplementation(() => Promise.resolve(new Response(JSON.stringify({ data: [] }), { status: 200 })));
    vi.stubGlobal("fetch", fetchMock);
    await new OpenRouterAdapter().fetchSnapshot();
    expect(fetchMock.mock.calls[0][1].headers["User-Agent"]).toBe("BENCHFLOW/1.0 evidence-sync");
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

  it("normalizes public image and video benchmarks with their published prices", () => {
    const models = normalizeArtificialAnalysis({ imageModels: [{ name: "GPT Image", sourcePath: "/image/model-families/openai-gpt", qualityElo: 1200, normalizedQuality: 100, price: 40 }], videoModels: [{ name: "Veo", sourcePath: "/video/model-families/google-veo", qualityElo: 1300, normalizedQuality: 100, price: 6 }] }, 100);
    expect(models[0]).toMatchObject({ modalities: ["text", "image"], capabilities: ["image_generation"] });
    expect(models[0].prices[0]).toMatchObject({ pricingType: "image_generation", amount: 40, unit: "1k_images" });
    expect(models[1].benchmarks[0]).toMatchObject({ category: "video", normalizedValue: 100 });
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
