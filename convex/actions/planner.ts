"use node";

import { actionGeneric as action, anyApi } from "convex/server";
import { v } from "convex/values";
import { createTaskAnalysis } from "../../lib/planner/openai";
import { StrategyInputSchema } from "../../lib/planner/schema";
import { hostedAuthArgs, requireServerAuth } from "../lib/auth";

export const analyse = action({
  args: { ...hostedAuthArgs, strategyId: v.id("strategies"), input: v.any() },
  handler: async (ctx, args) => {
    requireServerAuth(args.authKey); const { strategyId, input } = args;
    const validated = StrategyInputSchema.parse(input);
    const analysis = await createTaskAnalysis(validated);
    await ctx.runMutation(anyApi.strategies.replaceWorkflow, {
      authKey: args.authKey, userEmail: args.userEmail, userName: args.userName,
      strategyId,
      steps: analysis.workflowSteps.map((step) => ({
        order: step.order, name: step.name, description: step.plainLanguageDescription,
        requirements: {
          inputDescription: step.inputDescription, outputDescription: step.outputDescription, dependencies: step.dependencies,
          requiredModalities: step.requiredModalities, requiredCapabilities: step.requiredCapabilities,
          requiresCurrentInformation: step.requiresCurrentInformation, privacyRequirement: step.privacyRequirement,
          commercialUseRequired: step.commercialUseRequired, minimumQuality: step.minimumQuality, importance: step.importance,
          noAIEligible: step.noAIEligible, noAIAlternative: step.noAIAlternative, humanReviewRecommended: step.humanReviewRecommended,
          assumptions: step.assumptions, canRunInParallel: step.canRunInParallel,
        },
        estimates: {
          inputLow: step.estimatedInputTokensLow, inputExpected: step.estimatedInputTokensExpected, inputHigh: step.estimatedInputTokensHigh,
          outputLow: step.estimatedOutputTokensLow, outputExpected: step.estimatedOutputTokensExpected, outputHigh: step.estimatedOutputTokensHigh,
          requests: step.estimatedRequestCount, images: step.estimatedImageCount, audioMinutes: step.estimatedAudioMinutes, videoMinutes: step.estimatedVideoMinutes,
        },
      })),
    });
    return analysis;
  },
});
