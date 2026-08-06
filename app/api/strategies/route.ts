import { anyApi } from "convex/server";
import { StrategyInputSchema } from "@/lib/planner/schema";
import { apiError, authenticatedConvex } from "@/lib/server/convex";

export async function GET(){try{const client=await authenticatedConvex();return Response.json(await client.query(anyApi.strategies.listMine,{}));}catch(error){return apiError(error)}}
export async function POST(request:Request){try{const input=StrategyInputSchema.parse(await request.json());const client=await authenticatedConvex();const strategyId=await client.mutation(anyApi.strategies.create,{usageType:input.usageType,title:input.description.slice(0,70),originalInput:input.description,expectedResult:input.expectedResult,deadline:input.deadline,budget:input.budgetUsd??undefined,priorities:input.priorities});const analysis=await client.action(anyApi.actions.planner.analyse,{strategyId,input});return Response.json({strategyId,analysis});}catch(error){return apiError(error)}}
