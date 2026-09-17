import { describe, expect, it } from "vitest";
import { buildModelExplanation } from "@/lib/recommendation/model-explanation";

describe("beginner-friendly model explanations", () => {
  it("relates verified capabilities to the job and produces an actionable example", () => {
    const result = buildModelExplanation({
      modelName: "Example AI",
      stepName: "Concept and storyboard generation",
      stepDescription: "Analyze a reference style and create a storyboard.",
      inputDescription: "the project brief and reference video",
      outputDescription: "a script and shot-by-shot storyboard",
      coveredCapabilities: ["reasoning", "text_generation", "image_understanding"],
      limitations: ["Evidence confidence is limited for this task"],
      evidenceConfidence: "Limited",
      humanReviewRecommended: true,
      accessRoute: "Example Studio",
      costLabel: "$0.01 estimated usage",
    });

    expect(result.fit).toContain("Concept and storyboard generation");
    expect(result.fit).toContain("interpret images and visual references");
    expect(result.example).toContain("script and shot-by-shot storyboard");
    expect(result.pros.join(" ")).toContain("Example Studio");
    expect(result.pros.join(" ")).toContain("shows where evidence is limited");
    expect(result.cons.join(" ")).toContain("Test it with a small sample");
    expect(result.cons.join(" ")).toContain("A person should review");
    expect(result.fit).not.toContain("general_writing");
  });

  it("uses clear fallbacks for older saved consultations", () => {
    const result = buildModelExplanation({
      modelName: "Example AI",
      stepName: "Visual planning",
      coveredCapabilities: ["image_understanding"],
      limitations: [],
      evidenceConfidence: "Moderate",
      humanReviewRecommended: false,
      accessRoute: "Example Studio",
      costLabel: "$1 estimated usage",
    });

    expect(result.canDo).toContain("your project brief and source material");
    expect(result.example).toContain("completed result for Visual planning");
  });
});
