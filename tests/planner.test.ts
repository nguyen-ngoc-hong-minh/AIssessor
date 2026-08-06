import { describe,expect,it } from "vitest";
import { OnboardingSchema } from "@/lib/onboarding";
import { TaskAnalysisSchema, validatePriorityRanking } from "@/lib/planner/schema";

describe("input validation",()=>{
  it("requires exactly three onboarding answers",()=>{expect(()=>OnboardingSchema.parse({accountType:"individual",answers:{q1:"Creative",q2:"Weekly"}})).toThrow();expect(OnboardingSchema.parse({accountType:"individual",answers:{q1:"Creative",q2:"Weekly",q3:"USD 10–30"}}).answers.q3).toBe("USD 10–30")});
  it("rejects duplicate priorities",()=>expect(()=>validatePriorityRanking(["balanced","balanced","highest_quality","fastest","privacy","existing_tools"])).toThrow("exactly once"));
  it("validates a structured planner result",()=>{const parsed=TaskAnalysisSchema.safeParse({title:"Launch campaign",usageType:"one_off",summary:"A campaign",interpretedGoal:"Launch café",expectedResult:"Campaign assets",assumptions:[],warnings:[],estimatedTotalWorkload:"Two days",workflowSteps:[]});expect(parsed.success).toBe(true)});
});
