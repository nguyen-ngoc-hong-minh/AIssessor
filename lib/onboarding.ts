import { z } from "zod";
export const OnboardingSchema=z.object({accountType:z.enum(["individual","team","enterprise"]),answers:z.object({q1:z.string().min(1),q2:z.string().min(1),q3:z.string().min(1)})});
export type OnboardingInput=z.infer<typeof OnboardingSchema>;
