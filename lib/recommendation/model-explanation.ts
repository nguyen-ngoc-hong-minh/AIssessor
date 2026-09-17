import type { Capability } from "./taxonomy";

const CAPABILITY_DESCRIPTIONS: Record<Capability, string> = {
  text_generation: "draft and rewrite clear text",
  reasoning: "work through multi-step decisions",
  coding: "write and explain code",
  repository_editing: "make coordinated changes across a codebase",
  test_generation: "create tests for the work it produces",
  deployment: "help prepare and deploy an application",
  web_research: "find current information on the web",
  citation_support: "connect claims to sources",
  long_context: "work with long documents and large inputs",
  document_parsing: "read and extract details from documents",
  spreadsheet_analysis: "analyze spreadsheet data",
  structured_data_output: "organize results into a structured format",
  translation: "translate while preserving meaning and tone",
  image_generation: "create images from written instructions",
  image_understanding: "interpret images and visual references",
  audio_generation: "create audio from instructions",
  speech_to_text: "turn speech into editable text",
  text_to_speech: "turn written text into spoken audio",
  video_generation: "generate video clips from prompts",
  video_editing: "edit and assemble video material",
  presentation_generation: "build presentation content and slides",
  ui_generation: "create user-interface concepts and layouts",
  browser_automation: "carry out repeatable browser tasks",
  tool_use: "use connected tools to complete actions",
  agentic_execution: "complete a sequence of tasks with limited supervision",
  workflow_automation: "automate a repeatable workflow",
  multimodal_analysis: "reason across text, images, and other media",
};

function sentenceList(items: string[]) {
  if (items.length === 0) return "support the required work";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function phrase(value: string | null | undefined, fallback: string) {
  const clean = value?.trim().replace(/[.!?]+$/, "") ?? "";
  return clean || fallback;
}

function lowerFirst(value: string) {
  return value ? value[0].toLowerCase() + value.slice(1) : value;
}

function plainLimitation(value: string) {
  if (/Some comparison fields are unavailable/i.test(value)) return "Some model details could not be compared. Check the linked provider page before making a final decision.";
  if (/Privacy terms were not verified/i.test(value)) return "Privacy terms could not be verified. Do not upload sensitive material until you review the provider’s data policy.";
  if (/Commercial-use terms were not verified/i.test(value)) return "Commercial-use terms could not be verified. Review the provider’s terms before publishing or selling the result.";
  if (/Evidence confidence is limited/i.test(value)) return "There is limited evidence for this exact task. Test it with a small sample before committing the full project.";
  if (/Task evidence is (\d+) days old/i.test(value)) return value.replace(/^Task evidence/i, "The supporting task evidence");
  if (/manual tool handoffs?/i.test(value)) return "This step may require moving work between tools, which adds a little setup and review time.";
  return value;
}

export type ModelExplanationInput = {
  modelName: string;
  stepName: string;
  stepDescription?: string;
  inputDescription?: string;
  outputDescription?: string;
  coveredCapabilities: Capability[];
  limitations: string[];
  evidenceConfidence: "High" | "Moderate" | "Limited";
  humanReviewRecommended: boolean;
  accessRoute: string;
  costLabel: string;
};

export function buildModelExplanation(input: ModelExplanationInput) {
  const capabilities = input.coveredCapabilities.map((item) => CAPABILITY_DESCRIPTIONS[item]);
  const task = phrase(input.stepName, "this workflow step");
  const stepDescription = phrase(input.stepDescription, `Complete ${task}`);
  const source = phrase(input.inputDescription, "your project brief and source material");
  const output = phrase(input.outputDescription, `a completed result for ${task}`);
  const cons = [...new Set(input.limitations.map(plainLimitation))];
  if (input.humanReviewRecommended) cons.push("A person should review the output for accuracy, brand fit, and final approval.");
  if (cons.length === 0) cons.push("Results still depend on the quality of your instructions and source material. Test one representative output first.");
  const evidenceSummary = input.evidenceConfidence === "High"
    ? "Strong supporting evidence is available for this kind of task."
    : input.evidenceConfidence === "Moderate"
      ? "Relevant supporting evidence is available, although not every comparison field may be complete."
      : "The recommendation clearly shows where evidence is limited instead of treating missing information as proven.";

  return {
    fit: `${input.modelName} is matched to “${task}” because it can ${sentenceList(capabilities)}. That directly supports this job: ${lowerFirst(stepDescription)}.`,
    canDo: `Use ${input.modelName} with ${lowerFirst(source)} to help produce ${lowerFirst(output)}.`,
    example: `Give ${input.modelName} ${lowerFirst(source)} and ask it to create ${lowerFirst(output)}. Include your audience, tone, format, and any must-follow constraints.`,
    pros: [
      `Covers the key needs for this step: ${sentenceList(capabilities)}.`,
      evidenceSummary,
      `You can access it through ${input.accessRoute}; ${input.costLabel.toLowerCase()}.`,
    ],
    cons: [...new Set(cons)],
  };
}
