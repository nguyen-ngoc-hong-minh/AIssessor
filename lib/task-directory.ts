export type TaskCategory = "creativity" | "work" | "personal";

export type DirectoryTool = {
  slug: string;
  name: string;
  category: TaskCategory;
  subcategory: string;
  task: string;
  tagline: string;
  overview: string;
  website: string;
  icon?: string;
  pricing: {
    summary: string;
    source: string;
  };
  release: {
    title: string;
    date: string;
    summary: string;
    source: string;
  };
  alternatives: string[];
  pros: string[];
  cons: string[];
  sources: Array<{ label: string; url: string }>;
  accent: string;
};

export const taskCategories = [
  {
    id: "creativity" as const,
    label: "Creativity",
    description: "Create images, text, software, video, audio, art, and visual concepts.",
    subcategories: ["Images", "Text", "Software", "Videos", "Audio", "Art", "Design", "Brainstorming", "3D", "Multimedia"],
  },
  {
    id: "work" as const,
    label: "Work",
    description: "Run a business, improve productivity, and move your career forward.",
    subcategories: ["Business", "Productivity", "Career"],
  },
  {
    id: "personal" as const,
    label: "Personal",
    description: "Learn, plan, stay healthy, and navigate everyday life with AI support.",
    subcategories: ["Relationships", "Education", "Learning", "Health", "Food", "Spirituality", "Fashion", "Wealth", "Shopping", "Travel", "Entertainment", "Personal development", "Life coaching", "Pets", "Sports", "Beauty", "Community", "Personal branding"],
  },
];

export const directoryTools: DirectoryTool[] = [
  {
    slug: "midjourney",
    name: "Midjourney",
    category: "creativity",
    subcategory: "Images",
    task: "Generate campaign and concept images",
    tagline: "High-quality image generation with strong visual style.",
    overview: "Midjourney turns text and image references into polished visuals. It is a strong fit for concept art, campaign exploration, moodboards, and art-direction work where visual character matters more than exact production control.",
    website: "https://www.midjourney.com/",
    icon: "/logos/midjourney.svg",
    pricing: {
      summary: "Subscription only. Plans currently start at US$10/month; higher tiers add more GPU time, relaxed generation, and privacy controls.",
      source: "https://docs.midjourney.com/hc/en-us/articles/27870484040333-Comparing-Midjourney-Plans",
    },
    release: {
      title: "Midjourney V8.2",
      date: "24 Jul 2026",
      summary: "The current default model improves aesthetics, image quality, personalization, and editing workflows.",
      source: "https://docs.midjourney.com/hc/en-us/articles/32199405667853-Version",
    },
    alternatives: ["Ideogram", "Runway"],
    pros: ["Distinctive visual quality", "Strong reference-image workflows", "Fast concept exploration"],
    cons: ["No permanent free tier", "Precise layouts can need iteration", "Private generation requires a higher plan"],
    sources: [
      { label: "Official plans", url: "https://docs.midjourney.com/hc/en-us/articles/27870484040333-Comparing-Midjourney-Plans" },
      { label: "Model versions", url: "https://docs.midjourney.com/hc/en-us/articles/32199405667853-Version" },
    ],
    accent: "#ec4899",
  },
  {
    slug: "ideogram",
    name: "Ideogram",
    category: "creativity",
    subcategory: "Design",
    task: "Create graphics with readable text",
    tagline: "Image generation built for design, typography, and branded visuals.",
    overview: "Ideogram is useful when an image needs legible words, poster-like composition, logos, or branded graphic exploration. Its editing and prompt workflows make it easier to iterate on a visual without starting over.",
    website: "https://ideogram.ai/",
    pricing: {
      summary: "Free plan available. Plus is US$20/month, Pro US$60/month, and Team starts at US$30/member/month on monthly billing.",
      source: "https://docs.ideogram.ai/plans-and-pricing/available-plans",
    },
    release: {
      title: "Ideogram 4.0",
      date: "3 Jun 2026",
      summary: "A new frontier image model released with open weights and commercial licensing options.",
      source: "https://ideogram.ai/news/ideogram-4.0/",
    },
    alternatives: ["Midjourney", "Gamma"],
    pros: ["Strong text rendering", "Useful design-oriented controls", "Free plan for testing"],
    cons: ["Credit limits vary by plan", "Complex scenes still need iteration", "Team features cost more"],
    sources: [
      { label: "Official plans", url: "https://docs.ideogram.ai/plans-and-pricing/available-plans" },
      { label: "Ideogram 4.0", url: "https://ideogram.ai/news/ideogram-4.0/" },
    ],
    accent: "#f59e0b",
  },
  {
    slug: "runway",
    name: "Runway",
    category: "creativity",
    subcategory: "Videos",
    task: "Generate and edit short-form video",
    tagline: "An AI video workspace for generation, editing, and production tests.",
    overview: "Runway combines text-to-video, image-to-video, editing, and production utilities in one workspace. It suits concept films, social clips, pitch visuals, and rapid pre-visualization before a full production shoot.",
    website: "https://runwayml.com/",
    pricing: {
      summary: "A free plan is available. Paid creator plans use monthly credits; model and duration choices change how quickly credits are consumed.",
      source: "https://runwayml.com/pricing",
    },
    release: {
      title: "Runway Gen-4.5",
      date: "Dec 2025",
      summary: "A higher-fidelity generation model with stronger motion and multi-shot creative workflows.",
      source: "https://runwayml.com/changelog",
    },
    alternatives: ["Midjourney", "ElevenLabs"],
    pros: ["Purpose-built video workflow", "Generation and editing in one place", "Useful production controls"],
    cons: ["Video credits can disappear quickly", "Long sequences require assembly", "Output consistency depends on inputs"],
    sources: [
      { label: "Official pricing", url: "https://runwayml.com/pricing" },
      { label: "Runway changelog", url: "https://runwayml.com/changelog" },
    ],
    accent: "#6366f1",
  },
  {
    slug: "elevenlabs",
    name: "ElevenLabs",
    category: "creativity",
    subcategory: "Audio",
    task: "Create voiceovers, dubbing, and sound",
    tagline: "Expressive speech, voice, dubbing, and audio generation.",
    overview: "ElevenLabs covers text-to-speech, speech-to-text, voice design, dubbing, music, and sound effects. It works well for narrated video, localized content, podcasts, prototypes, and voice-enabled products.",
    website: "https://elevenlabs.io/",
    pricing: {
      summary: "Free plan includes 10k credits. Starter is US$6/month and Creator US$22/month; higher tiers increase credits, seats, and audio quality.",
      source: "https://elevenlabs.io/pricing",
    },
    release: {
      title: "Lower API pricing and PAYG",
      date: "7 May 2026",
      summary: "API and agent pricing was reduced, with pay-as-you-go options added for eligible plans.",
      source: "https://elevenlabs.io/blog/weve-lowered-api-agents-pricing-and-introduced-pay-as-you-go",
    },
    alternatives: ["Runway", "Gamma"],
    pros: ["Natural, expressive speech", "Broad audio toolset", "Good localization support"],
    cons: ["Credits vary by operation", "Voice rights require care", "Professional cloning has plan requirements"],
    sources: [
      { label: "Official pricing", url: "https://elevenlabs.io/pricing" },
      { label: "Pricing update", url: "https://elevenlabs.io/blog/weve-lowered-api-agents-pricing-and-introduced-pay-as-you-go" },
    ],
    accent: "#22d3ee",
  },
  {
    slug: "gamma",
    name: "Gamma",
    category: "creativity",
    subcategory: "Multimedia",
    task: "Turn an outline into a presentation",
    tagline: "Generate and refine presentations, documents, and simple web pages.",
    overview: "Gamma helps turn notes or a prompt into structured slides, documents, and shareable pages. It is most useful for getting from a rough narrative to a presentable first draft quickly, then refining the layout and brand.",
    website: "https://gamma.app/",
    pricing: {
      summary: "Free plan includes starter credits. Plus, Pro, and Ultra plans add unlimited AI creation, larger decks, premium models, branding, analytics, and API access.",
      source: "https://gamma.app/pricing",
    },
    release: {
      title: "Mobile apps, Slack, and API expansion",
      date: "28 Aug 2026",
      summary: "Gamma added native mobile apps, Slack workflows, and broader API support for analytics, comments, export, and multi-page content.",
      source: "https://ideas.gamma.app/changelog",
    },
    alternatives: ["Ideogram", "NotebookLM"],
    pros: ["Fast first drafts", "Flexible presentation layouts", "Easy sharing and export"],
    cons: ["Best results still need editing", "Free credits do not refill", "Advanced brand controls are paid"],
    sources: [
      { label: "Official pricing", url: "https://gamma.app/pricing" },
      { label: "Gamma changelog", url: "https://ideas.gamma.app/changelog" },
    ],
    accent: "#a855f7",
  },
  {
    slug: "perplexity",
    name: "Perplexity",
    category: "work",
    subcategory: "Productivity",
    task: "Research a topic with linked sources",
    tagline: "Search, synthesis, and research with citations attached.",
    overview: "Perplexity combines web search with language models to produce source-linked answers and longer research reports. It is a practical starting point for market scans, competitor research, and questions that require current information.",
    website: "https://www.perplexity.ai/",
    pricing: {
      summary: "Standard is free. Pro and Max raise research, file, and advanced-model limits; verified Education Pro is currently US$10/month.",
      source: "https://www.perplexity.ai/help-center/en/articles/11187416-which-perplexity-subscription-plan-is-right-for-you",
    },
    release: {
      title: "Computer in email and new models",
      date: "24 Aug 2026",
      summary: "Recent updates added email-based computer workflows, subagents, automations, and new model access.",
      source: "https://www.perplexity.ai/changelog",
    },
    alternatives: ["Gemini Notebook", "Khanmigo"],
    pros: ["Sources are visible", "Good for current information", "Fast multi-source summaries"],
    cons: ["Citations still need checking", "Usage limits depend on plan", "Not a substitute for primary-source review"],
    sources: [
      { label: "Plan guide", url: "https://www.perplexity.ai/help-center/en/articles/11187416-which-perplexity-subscription-plan-is-right-for-you" },
      { label: "Product changelog", url: "https://www.perplexity.ai/changelog" },
    ],
    accent: "#14b8a6",
  },
  {
    slug: "cursor",
    name: "Cursor",
    category: "work",
    subcategory: "Productivity",
    task: "Build and refactor software in an AI editor",
    tagline: "A code editor designed around AI agents and codebase context.",
    overview: "Cursor combines an editor, inline completion, chat, and coding agents that can work across a repository. It is a strong fit for developers who want AI embedded in daily coding rather than in a separate browser tab.",
    website: "https://cursor.com/",
    pricing: {
      summary: "Hobby is free. Pro is US$20/month, Pro+ US$60/month, Ultra US$200/month, and Teams Standard US$40/user/month.",
      source: "https://cursor.com/pricing",
    },
    release: {
      title: "Cursor Projects",
      date: "10 Sep 2026",
      summary: "Projects adds long-running context, cloud agents, delegation, and recurring work for larger engineering efforts.",
      source: "https://cursor.com/changelog",
    },
    alternatives: ["GitHub Copilot", "Lovable"],
    pros: ["Deep editor integration", "Understands repository context", "Strong agent workflows"],
    cons: ["Usage can exceed included allowance", "Requires code review", "Another editor to adopt"],
    sources: [
      { label: "Official pricing", url: "https://cursor.com/pricing" },
      { label: "Cursor changelog", url: "https://cursor.com/changelog" },
    ],
    accent: "#4ade80",
  },
  {
    slug: "github-copilot",
    name: "GitHub Copilot",
    category: "work",
    subcategory: "Productivity",
    task: "Get coding help across editor, terminal, and GitHub",
    tagline: "AI coding assistance across IDEs, pull requests, CLI, and GitHub.",
    overview: "GitHub Copilot supports code completion, chat, agent workflows, code review, and CLI work. It fits teams already centered on GitHub and developers who want broad IDE support without moving to a new editor.",
    website: "https://github.com/features/copilot",
    pricing: {
      summary: "Free plan available. Pro is US$10/month, Pro+ US$39/month, and Max US$100/month; business plans are priced per seat.",
      source: "https://github.com/features/copilot/plans",
    },
    release: {
      title: "Copilot product updates",
      date: "Updated continuously",
      summary: "GitHub publishes frequent changes across coding agents, code review, supported models, CLI, and IDE integrations.",
      source: "https://github.blog/changelog/label/copilot/",
    },
    alternatives: ["Cursor", "Lovable"],
    pros: ["Works across popular IDEs", "Native GitHub integration", "Free entry tier"],
    cons: ["Advanced usage consumes credits", "Quality varies by codebase context", "Generated code still needs review"],
    sources: [
      { label: "Official plans", url: "https://github.com/features/copilot/plans" },
      { label: "Copilot changelog", url: "https://github.blog/changelog/label/copilot/" },
    ],
    accent: "#60a5fa",
  },
  {
    slug: "lovable",
    name: "Lovable",
    category: "work",
    subcategory: "Productivity",
    task: "Turn a product idea into a web app",
    tagline: "Prompt-driven web app building with editable code and hosting.",
    overview: "Lovable lets non-specialists and developers create web applications through conversation, then inspect and own the generated code. It is best for prototypes, internal tools, landing pages, and early product validation.",
    website: "https://lovable.dev/",
    pricing: {
      summary: "Free daily build credits are available. Paid workspaces add a shared credit balance for building, hosting, and AI features; usage depends on task complexity.",
      source: "https://lovable.dev/pricing",
    },
    release: {
      title: "Unified workspace credits",
      date: "13 Jun 2026",
      summary: "Lovable consolidated build, cloud, and AI usage into one balance with clearer spend reporting.",
      source: "https://lovable.dev/blog/simplifying-billing",
    },
    alternatives: ["Cursor", "GitHub Copilot"],
    pros: ["Fast prototype creation", "Code ownership", "Built-in publishing path"],
    cons: ["Complex apps still need engineering", "Credit cost varies by prompt", "Generated architecture requires review"],
    sources: [
      { label: "Official pricing", url: "https://lovable.dev/pricing" },
      { label: "Billing update", url: "https://lovable.dev/blog/simplifying-billing" },
    ],
    accent: "#f472b6",
  },
  {
    slug: "gemini-notebook",
    name: "Gemini Notebook",
    category: "personal",
    subcategory: "Learning",
    task: "Study and synthesize your own source material",
    tagline: "Source-grounded notes, reports, study guides, and audio overviews.",
    overview: "Gemini Notebook, previously NotebookLM, answers from the sources you provide and creates study artifacts such as reports, audio overviews, slide decks, and worksheets. It is well suited to courses, personal research, and document-heavy learning.",
    website: "https://notebooklm.google.com/",
    pricing: {
      summary: "Standard access is free. Higher limits and premium features are available through Google AI Plus, Pro, Ultra, qualifying Workspace plans, or enterprise licenses.",
      source: "https://support.google.com/gemininotebook/answer/16213268?hl=en",
    },
    release: {
      title: "NotebookLM became Gemini Notebook",
      date: "16 Jul 2026",
      summary: "The product gained deeper Gemini integration, a secure cloud computer, and broader research outputs while remaining source grounded.",
      source: "https://blog.google/innovation-and-ai/products/gemini-notebook/notebooklm-gemini-notebook/",
    },
    alternatives: ["Perplexity", "Khanmigo"],
    pros: ["Grounded in your sources", "Useful study artifacts", "Free standard tier"],
    cons: ["Quality depends on source material", "Higher limits require another plan", "Not every feature is available in every region"],
    sources: [
      { label: "Upgrade guide", url: "https://support.google.com/gemininotebook/answer/16213268?hl=en" },
      { label: "Product update", url: "https://blog.google/innovation-and-ai/products/gemini-notebook/notebooklm-gemini-notebook/" },
    ],
    accent: "#3b82f6",
  },
  {
    slug: "khanmigo",
    name: "Khanmigo",
    category: "personal",
    subcategory: "Education",
    task: "Learn with a guided AI tutor",
    tagline: "A tutoring and teaching assistant built around Khan Academy learning.",
    overview: "Khanmigo is designed to guide learners with questions instead of simply handing over answers. It also gives educators tools for lesson planning, rubrics, objectives, and classroom preparation.",
    website: "https://www.khanacademy.org/khan-labs",
    pricing: {
      summary: "Learner and parent subscriptions are US$4/month in the US. Teacher tools are free in eligible regions; district pricing is separate.",
      source: "https://support.khanacademy.org/hc/en-us/articles/25921448458893-What-features-are-available-in-the-Learner-Parent-and-Teacher-Khanmigo-subscription-plans",
    },
    release: {
      title: "Expanded school and district access",
      date: "27 Jan 2026",
      summary: "Khan Academy clarified Enterprise and Enterprise Starter paths for schools using Khanmigo with learners and teachers.",
      source: "https://support.khanacademy.org/hc/en-us/articles/21990986024845-Where-can-I-learn-more-about-using-Khanmigo-in-my-school-district",
    },
    alternatives: ["Gemini Notebook", "Perplexity"],
    pros: ["Guided learning approach", "Connected to Khan Academy content", "Free educator tools in eligible regions"],
    cons: ["Learner access is region limited", "Requires a suitable account or plan", "Less useful outside education"],
    sources: [
      { label: "Plan comparison", url: "https://support.khanacademy.org/hc/en-us/articles/25921448458893-What-features-are-available-in-the-Learner-Parent-and-Teacher-Khanmigo-subscription-plans" },
      { label: "Khanmigo overview", url: "https://www.khanacademy.org/khan-labs" },
    ],
    accent: "#10b981",
  },
  {
    slug: "mindtrip",
    name: "Mindtrip",
    category: "personal",
    subcategory: "Travel",
    task: "Build a collaborative travel plan",
    tagline: "AI itineraries, maps, bookings, and shared trip organization.",
    overview: "Mindtrip creates editable itineraries from a prompt, image, screenshot, or document, then brings places, maps, reservations, and group planning together. It is useful for turning scattered travel inspiration into a workable trip.",
    website: "https://mindtrip.ai/",
    pricing: {
      summary: "The consumer app is free. Business packages use contact-based pricing for embedded destination and travel experiences.",
      source: "https://mindtrip.ai/",
    },
    release: {
      title: "Mindtrip Stays",
      date: "15 Jul 2026",
      summary: "Mindtrip expanded hotel discovery and booking inside its agentic travel-planning experience.",
      source: "https://mindtrip.ai/press",
    },
    alternatives: ["Perplexity", "Gemini Notebook"],
    pros: ["Travel-specific interface", "Collaborative itineraries", "Free consumer access"],
    cons: ["Coverage varies by destination", "Booking details still need verification", "Business pricing is not public"],
    sources: [
      { label: "Official product", url: "https://mindtrip.ai/" },
      { label: "Product news", url: "https://mindtrip.ai/press" },
    ],
    accent: "#fb7185",
  },
];

export const directoryReviewedAt = "17 Sep 2026";
