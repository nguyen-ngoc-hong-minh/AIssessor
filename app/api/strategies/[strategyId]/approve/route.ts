import { anyApi } from "convex/server";
import { apiError, authenticatedConvex } from "@/lib/server/convex";
export async function POST(_:Request,{params}:{params:Promise<{strategyId:string}>}){try{const {strategyId}=await params;const client=await authenticatedConvex();await client.mutation(anyApi.strategies.approveWorkflow,{strategyId});return Response.json({ok:true});}catch(error){return apiError(error)}}
