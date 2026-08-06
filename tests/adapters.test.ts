import { afterEach,describe,expect,it,vi } from "vitest";
import { ArtificialAnalysisAdapter, OpenRouterAdapter } from "@/lib/model-data/adapters";
import { normalizeArtificialAnalysis, normalizeOpenRouter } from "@/lib/model-data/normalizers";
afterEach(()=>vi.unstubAllGlobals());
describe("live source adapters",()=>{
  it("uses the Artificial Analysis API key header",async()=>{const fetchMock=vi.fn().mockResolvedValue(new Response(JSON.stringify({data:[]}),{status:200}));vi.stubGlobal("fetch",fetchMock);await new ArtificialAnalysisAdapter("key").fetchSnapshot();expect(fetchMock.mock.calls[0][1].headers["x-api-key"]).toBe("key")});
  it("uses OpenRouter bearer authentication",async()=>{const fetchMock=vi.fn().mockResolvedValue(new Response(JSON.stringify({data:[]}),{status:200}));vi.stubGlobal("fetch",fetchMock);await new OpenRouterAdapter("key").fetchSnapshot();expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer key")});
  it("normalizes only present values",()=>{const aa=normalizeArtificialAnalysis({data:[{name:"Measured",model_creator:{name:"Lab"},evaluations:{artificial_analysis_intelligence_index:42},pricing:{price_1m_input_tokens:1}}]},100);expect(aa[0].benchmarks[0].score).toBe(42);expect(aa[0].prices).toHaveLength(1);const or=normalizeOpenRouter({data:[{id:"lab/model",name:"Model",context_length:1000,pricing:{prompt:"0.000001"},architecture:{input_modalities:["text"]}}]},100);expect(or[0].prices[0].amount).toBe(1)});
});
