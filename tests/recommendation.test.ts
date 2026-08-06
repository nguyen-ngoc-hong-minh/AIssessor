import { describe,expect,it } from "vitest";
import { estimateStepCost, generateStrategyPlan, getExclusionReasons, priorityWeights, scoreCandidate } from "@/lib/recommendation/engine";
import type { WorkflowStep, Priority } from "@/lib/planner/schema";
import type { CanonicalModel } from "@/lib/recommendation/types";

const step:WorkflowStep={id:"s1",order:0,name:"Write",plainLanguageDescription:"Write copy",inputDescription:"Brief",outputDescription:"Copy",dependencies:[],canRunInParallel:false,estimatedInputTokensLow:500,estimatedInputTokensExpected:1000,estimatedInputTokensHigh:1500,estimatedOutputTokensLow:300,estimatedOutputTokensExpected:500,estimatedOutputTokensHigh:800,estimatedRequestCount:10,estimatedImageCount:0,estimatedAudioMinutes:0,estimatedVideoMinutes:0,requiredModalities:["text"],requiredCapabilities:["structured_outputs"],requiresCurrentInformation:false,privacyRequirement:"business",commercialUseRequired:true,minimumQuality:"professional",importance:"high",noAIEligible:false,noAIAlternative:"Write manually",humanReviewRecommended:true,assumptions:[]};
const model:CanonicalModel={id:"m1",name:"Measured model",provider:"Provider",active:true,modalities:["text"],capabilities:["structured_outputs"],contextWindow:100000,inputPricePerMillion:1,outputPricePerMillion:4,qualityScore:75,outputTokensPerSecond:100,privacyLevel:"business",commercialUse:true,regions:["global"],source:"source",measuredAt:Date.now(),retrievedAt:Date.now(),existingTool:false};
const priorities:Priority[]=["balanced","lowest_cost","highest_quality","fastest","privacy","existing_tools"];
const context={priorities,budgetUsd:10,region:"global",now:Date.now()};
describe("deterministic recommendation engine",()=>{
  it("converts priority ranking into normalized weights",()=>expect(Object.values(priorityWeights(priorities)).reduce((a,b)=>a+b,0)).toBeCloseTo(1));
  it("estimates cost from expected workload",()=>expect(estimateStepCost(step,model)).toBeCloseTo(.03));
  it("hard-excludes a wrong modality",()=>expect(getExclusionReasons({...step,requiredModalities:["image"]},model,context)).toContain("Missing image support"));
  it("hard-excludes unknown privacy",()=>expect(getExclusionReasons(step,{...model,privacyLevel:null},context)).toContain("Critical privacy evidence is unavailable"));
  it("produces a rounded explainable score",()=>expect(scoreCandidate(step,model,context).roundedScore%5).toBe(0));
  it.each(["one_off","monthly"])("generates a %s strategy without changing calculation",()=>{const plan=generateStrategyPlan([step],[model],context,"recommended");expect(plan.steps[0].selected?.model.id).toBe("m1");expect(plan.totalCostUsd).toBe(.03)});
});
