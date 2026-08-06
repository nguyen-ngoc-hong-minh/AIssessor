export type NormalizedModel = {
  canonicalId: string; name: string; provider: string; modalities: string[]; capabilities: string[];
  contextWindow?: number; active: boolean; commercialUse?: boolean; privacyLevel?: string; regions: string[];
  benchmarks: Array<{ metric: string; score: number; measuredAt: number; confidence: string }>;
  prices: Array<{ pricingType: string; amount: number; unit: string; currency: string; effectiveAt: number }>;
};

type JsonRecord = Record<string, unknown>;
function record(value: unknown): JsonRecord { return typeof value === "object" && value !== null ? value as JsonRecord : {}; }
function list(value: unknown): unknown[] { return Array.isArray(value) ? value : []; }
function text(value: unknown): string | undefined { return typeof value === "string" && value.trim() ? value : undefined; }
function number(value: unknown): number | undefined { const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN; return Number.isFinite(n) ? n : undefined; }
function canonical(provider: string, name: string) { return `${provider}:${name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

export function normalizeArtificialAnalysis(payload: unknown, fetchedAt: number): NormalizedModel[] {
  return list(record(payload).data).flatMap((raw) => {
    const item = record(raw); const name = text(item.name); const creator = record(item.model_creator); const provider = text(creator.name);
    if (!name || !provider) return [];
    const evaluations = record(item.evaluations); const pricing = record(item.pricing); const performance = record(item.performance);
    const quality = number(evaluations.artificial_analysis_intelligence_index); const speed = number(performance.median_output_tokens_per_second);
    const benchmarks: NormalizedModel["benchmarks"] = [];
    if (quality !== undefined) benchmarks.push({ metric: "artificial_analysis_intelligence_index", score: quality, measuredAt: fetchedAt, confidence: "source_reported" });
    if (speed !== undefined) benchmarks.push({ metric: "output_tokens_per_second", score: speed, measuredAt: fetchedAt, confidence: "source_reported" });
    const prices: NormalizedModel["prices"] = []; const input = number(pricing.price_1m_input_tokens); const output = number(pricing.price_1m_output_tokens);
    if (input !== undefined) prices.push({ pricingType: "input_tokens", amount: input, unit: "1m_tokens", currency: "USD", effectiveAt: fetchedAt });
    if (output !== undefined) prices.push({ pricingType: "output_tokens", amount: output, unit: "1m_tokens", currency: "USD", effectiveAt: fetchedAt });
    return [{ canonicalId: canonical(provider, name), name, provider, modalities: list(item.input_modalities).filter((v): v is string => typeof v === "string"), capabilities: [], contextWindow: number(item.context_window), active: true, regions: [], benchmarks, prices }];
  });
}

export function normalizeOpenRouter(payload: unknown, fetchedAt: number): NormalizedModel[] {
  return list(record(payload).data).flatMap((raw) => {
    const item = record(raw); const id = text(item.id); const name = text(item.name) ?? id; if (!id || !name) return [];
    const provider = id.split("/")[0] || "unknown"; const architecture = record(item.architecture); const pricing = record(item.pricing);
    const promptPrice = number(pricing.prompt); const completionPrice = number(pricing.completion); const prices: NormalizedModel["prices"] = [];
    if (promptPrice !== undefined) prices.push({ pricingType: "input_tokens", amount: promptPrice * 1_000_000, unit: "1m_tokens", currency: "USD", effectiveAt: fetchedAt });
    if (completionPrice !== undefined) prices.push({ pricingType: "output_tokens", amount: completionPrice * 1_000_000, unit: "1m_tokens", currency: "USD", effectiveAt: fetchedAt });
    const modalities = [...list(architecture.input_modalities), ...list(architecture.output_modalities)].filter((v): v is string => typeof v === "string");
    return [{ canonicalId: canonical(provider, name), name, provider, modalities: [...new Set(modalities)], capabilities: list(item.supported_parameters).filter((v): v is string => typeof v === "string"), contextWindow: number(item.context_length), active: true, regions: [], benchmarks: [], prices }];
  });
}
