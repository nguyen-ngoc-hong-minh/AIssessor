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

const CAPABILITY_LABELS: Record<Capability, string> = {
  text_generation: "Writing",
  reasoning: "Planning",
  coding: "Coding",
  repository_editing: "Codebase editing",
  test_generation: "Test creation",
  deployment: "Deployment",
  web_research: "Web research",
  citation_support: "Citations",
  long_context: "Long documents",
  document_parsing: "Document reading",
  spreadsheet_analysis: "Spreadsheets",
  structured_data_output: "Structured output",
  translation: "Translation",
  image_generation: "Image creation",
  image_understanding: "Visual analysis",
  audio_generation: "Audio creation",
  speech_to_text: "Transcription",
  text_to_speech: "Voice generation",
  video_generation: "Video creation",
  video_editing: "Video editing",
  presentation_generation: "Presentations",
  ui_generation: "UI design",
  browser_automation: "Browser tasks",
  tool_use: "Connected tools",
  agentic_execution: "Multi-step execution",
  workflow_automation: "Automation",
  multimodal_analysis: "Mixed-media analysis",
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
  if (/Some comparison fields are unavailable/i.test(value)) return "Some comparison data is unavailable.";
  if (/Privacy terms were not verified/i.test(value)) return "Review privacy terms before uploading sensitive files.";
  if (/Commercial-use terms were not verified/i.test(value)) return "Check commercial-use rights before publishing.";
  if (/Evidence confidence is limited/i.test(value)) return "Test a small sample first; evidence is limited.";
  if (/Task evidence is (\d+) days old/i.test(value)) return "Some supporting evidence may be out of date.";
  if (/manual tool handoffs?/i.test(value)) return "A manual handoff between tools may be needed.";
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
  const skills = input.coveredCapabilities.map((item) => CAPABILITY_LABELS[item]).slice(0, 4);
  const task = phrase(input.stepName, "this workflow step");
  const source = phrase(input.inputDescription, "your project brief and source material");
  const output = phrase(input.outputDescription, `a completed result for ${task}`);
  const cons = [...new Set(input.limitations.map(plainLimitation))];
  if (input.humanReviewRecommended) cons.unshift("Review the final output for accuracy and brand fit.");
  if (cons.length === 0) cons.push("Results depend on the quality of your instructions.");

  return {
    fit: `${input.modelName} fits ${task} because it can ${sentenceList(capabilities.slice(0, 2))}.`,
    example: `“Using ${lowerFirst(source)}, create ${lowerFirst(output)}.”`,
    skills,
    evidence: `${input.evidenceConfidence} evidence`,
    pros: [
      `Covers ${sentenceList(skills.map((item) => item.toLowerCase()))}.`,
      `${input.costLabel} via ${input.accessRoute}.`,
    ],
    cons: [...new Set(cons)].slice(0, 3),
  };
}
