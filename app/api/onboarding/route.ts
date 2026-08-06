import { anyApi } from "convex/server";
import { apiError, authenticatedConvex } from "@/lib/server/convex";
import { OnboardingSchema } from "@/lib/onboarding";

export async function POST(request:Request){try{const input=OnboardingSchema.parse(await request.json());const client=await authenticatedConvex();await client.mutation(anyApi.profiles.completeOnboarding,{accountType:input.accountType,answers:input.answers,AIExperience:input.accountType==="individual"?input.answers.q2:undefined,monthlyBudget:input.answers.q3,teamSize:input.accountType==="team"?input.answers.q2:undefined,companySize:input.accountType==="enterprise"?input.answers.q2:undefined,industry:input.accountType==="enterprise"?input.answers.q1:undefined});return Response.json({ok:true});}catch(error){return apiError(error)}}
