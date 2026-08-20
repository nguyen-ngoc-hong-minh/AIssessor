import { anyApi } from "convex/server";
import { apiError, authenticatedConvex } from "@/lib/server/convex";
export async function GET(_:Request,{params}:{params:Promise<{strategyId:string}>}){try{const {strategyId}=await params;const client=await authenticatedConvex();const saved=await client.action(anyApi.actions.recommend.loadSaved,{strategyId});return Response.json(saved??await client.action(anyApi.actions.recommend.generate,{strategyId,region:"global"}));}catch(error){return apiError(error)}}
