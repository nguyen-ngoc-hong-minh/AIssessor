import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";

const SOURCE_ORIGIN = "https://taaft.com";
const READER_ORIGIN = "https://r.jina.ai/http://taaft.com";
const OUTPUT_PATH = path.resolve("public/data/task-directory.json");
const CONCURRENCY = 3;
const AUTOVENTURE_URL = "https://raw.githubusercontent.com/autoventure-projects/ai-tools-dataset/main/ai-tools.json";
const OPEN_DIRECTORY_URL = "https://raw.githubusercontent.com/diamitani/aitooldirectory/main/A.I.%20Tool%20Directory%20-%20900%20-%20ai_tools_corrected%20(1).csv";

const taskSeeds = [
  ["creativity", "Images", "image-generator"],
  ["creativity", "Text", "writing"],
  ["creativity", "Software", "coding"],
  ["creativity", "Videos", "video-generator"],
  ["creativity", "Audio", "audio"],
  ["creativity", "Art", "art"],
  ["creativity", "Design", "design"],
  ["creativity", "Brainstorming", "brainstorming"],
  ["creativity", "3D", "3d"],
  ["creativity", "Multimedia", "content-creation"],
  ["work", "Business", "business"],
  ["work", "Productivity", "productivity"],
  ["work", "Career", "career"],
  ["personal", "Relationships", "relationships"],
  ["personal", "Education", "education"],
  ["personal", "Learning", "learning"],
  ["personal", "Health", "health"],
  ["personal", "Food", "food"],
  ["personal", "Spirituality", "spirituality"],
  ["personal", "Fashion", "fashion"],
  ["personal", "Wealth", "personal-finance"],
  ["personal", "Shopping", "shopping"],
  ["personal", "Travel", "travel"],
  ["personal", "Entertainment", "entertainment"],
  ["personal", "Personal development", "personal-development"],
  ["personal", "Life coaching", "life-coaching"],
  ["personal", "Pets", "pets"],
  ["personal", "Sports", "sports"],
  ["personal", "Beauty", "beauty"],
  ["personal", "Community", "community"],
  ["personal", "Personal branding", "personal-branding"],
];

const colors = ["#6366f1", "#ec4899", "#22d3ee", "#4ade80", "#f59e0b", "#a855f7", "#14b8a6", "#fb7185"];

function decodeHtml(value = "") {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&nbsp;", " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .trim();
}

function stripTracking(rawUrl = "") {
  try {
    const url = new URL(decodeHtml(rawUrl));
    for (const key of [...url.searchParams.keys()]) {
      if (key.startsWith("utm_") || key === "ref" || key === "fid") url.searchParams.delete(key);
    }
    return url.toString().replace(/\?$/, "");
  } catch {
    return decodeHtml(rawUrl);
  }
}

function textFrom(block, pattern) {
  const match = block.match(pattern);
  return match ? decodeHtml(match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")) : "";
}

function attrFrom(tag, attribute) {
  return decodeHtml(tag.match(new RegExp(`${attribute}="([^"]*)"`))?.[1] ?? "");
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}

function compactSummary(value = "") {
  const cleaned = value.replace(/^DESCRIPTION:\s*/i, "").replace(/\s+/g, " ").trim();
  if (cleaned.length <= 240) return cleaned;
  const shortened = cleaned.slice(0, 237);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, lastSpace > 170 ? lastSpace : 237)}...`;
}

function mapExternalCategory(category) {
  const normalized = category.toLowerCase();

  if (/audio/.test(normalized)) return ["creativity", "Audio"];
  if (/video/.test(normalized)) return ["creativity", "Videos"];
  if (/image/.test(normalized)) return ["creativity", "Images"];
  if (/design|creative/.test(normalized)) return ["creativity", "Design"];
  if (/writing/.test(normalized)) return ["creativity", "Text"];
  if (/code|developer/.test(normalized)) return ["creativity", "Software"];
  if (/education/.test(normalized)) return ["personal", "Education"];
  if (/health/.test(normalized)) return ["personal", "Health"];
  if (/finance/.test(normalized)) return ["personal", "Wealth"];
  if (/marketing|seo|ecommerce|real estate|customer|legal|hiring/.test(normalized)) return ["work", "Business"];
  if (/research|data|document/.test(normalized)) return ["work", "Business"];
  if (/productivity|automation|chatbot|meeting|email|translation|social/.test(normalized)) return ["work", "Productivity"];
  return ["personal", "Personal development"];
}

function splitCards(html) {
  const start = html.indexOf('<h2 class="title_inner"');
  const end = html.indexOf("Related Tasks", start);
  const scoped = start >= 0 ? html.slice(start, end >= 0 ? end : undefined) : html;
  const matches = [...scoped.matchAll(/<li class="li [^>]*data-name="[^"]+"[^>]*>/g)];

  return matches.map((match, index) => ({
    tag: match[0],
    block: scoped.slice(match.index, matches[index + 1]?.index ?? scoped.length),
  }));
}

function parsePage(html, category, subcategory, sourceSlug) {
  return splitCards(html).flatMap(({ tag, block }, index) => {
    if (tag.includes('data-featured="true"') || tag.includes("mini-tool")) return [];

    const id = attrFrom(tag, "data-id");
    const name = attrFrom(tag, "data-name");
    const task = attrFrom(tag, "data-task") || subcategory;
    const taskSlug = attrFrom(tag, "data-task_slug") || slugify(task);
    const website = stripTracking(attrFrom(tag, "data-url"));
    const directoryPath = block.match(/<a class="ai_link[^"]*"[^>]*href="([^"]+)"/)?.[1] ?? "";
    const overview = textFrom(block, /<div class="short_desc">([\s\S]*?)<\/div>/);
    const version = textFrom(block, /<span class="current_version">([\s\S]*?)<\/span>/);
    const released = textFrom(block, /<div class="released">[\s\S]*?<span class="relative">([\s\S]*?)<\/span>/);
    const pricing = textFrom(block, /<a class="ai_launch_date"[^>]*>([\s\S]*?)<\/a>/) || "Pricing not listed";
    const icon = decodeHtml(block.match(/<img[^>]+class="taaft_icon"[^>]+src="([^"]+)"|<img[^>]+src="([^"]+)"[^>]+class="taaft_icon"/)?.[1]
      ?? block.match(/<img[^>]+class="taaft_icon"[^>]+src="([^"]+)"|<img[^>]+src="([^"]+)"[^>]+class="taaft_icon"/)?.[2]
      ?? "");

    if (!id || !name || !website || !overview) return [];

    return [{
      id: `taaft-${id}`,
      slug: `${slugify(name)}-${id}`,
      name,
      category,
      subcategory,
      task,
      taskSlug,
      tagline: overview,
      overview,
      website,
      icon,
      pricing,
      version: version || "Current listing",
      released: released || "Release date not listed",
      sourceTask: sourceSlug,
      directoryUrl: stripTracking(directoryPath || `${SOURCE_ORIGIN}/ai/${slugify(name)}/`),
      sourceUrl: `${SOURCE_ORIGIN}/s/${sourceSlug}/`,
      sourceName: "There's An AI For That",
      sourceLicense: "Public search index",
      accent: colors[index % colors.length],
    }];
  });
}

async function fetchAutoVenture() {
  const response = await fetch(AUTOVENTURE_URL, { signal: AbortSignal.timeout(60_000) });
  if (!response.ok) throw new Error(`AutoVenture: ${response.status}`);
  const payload = await response.json();

  return payload.tools.map((tool, index) => {
    const [category, subcategory] = mapExternalCategory(tool.category);
    return {
      id: `autoventure-${tool.slug}`,
      slug: `${tool.slug}-autoventure`,
      name: tool.name,
      category,
      subcategory,
      task: tool.category,
      taskSlug: slugify(tool.category),
      tagline: compactSummary(tool.description),
      overview: compactSummary(tool.description),
      website: stripTracking(tool.website),
      icon: "",
      pricing: tool.pricing || "See provider for current pricing",
      version: "Current listing",
      released: `Dataset updated ${payload.updated}`,
      sourceTask: tool.category_id,
      directoryUrl: tool.review_url,
      sourceUrl: "https://github.com/autoventure-projects/ai-tools-dataset",
      sourceName: "AutoVenture AI Tools Dataset",
      sourceLicense: "CC BY 4.0",
      accent: colors[index % colors.length],
    };
  });
}

async function fetchOpenDirectory() {
  const response = await fetch(OPEN_DIRECTORY_URL, { signal: AbortSignal.timeout(60_000) });
  if (!response.ok) throw new Error(`Open AI Tool Directory: ${response.status}`);
  const records = parse(await response.text(), {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  });

  return records.flatMap((tool, index) => {
    if (!tool.Name || !tool.URL || !tool.Description) return [];
    const [category, subcategory] = mapExternalCategory(tool.Category || "General");
    const slug = slugify(tool.Name);
    return [{
      id: `open-directory-${slug}-${index}`,
      slug: `${slug}-open-directory-${index}`,
      name: tool.Name.trim(),
      category,
      subcategory,
      task: tool.Category || subcategory,
      taskSlug: slugify(tool.Category || subcategory),
      tagline: compactSummary(tool.Description),
      overview: compactSummary(tool.Description),
      website: stripTracking(tool.URL),
      icon: "",
      pricing: /freemium/i.test(tool.Description) ? "Freemium" : /free tool|100% free/i.test(tool.Description) ? "Free access mentioned" : "See provider for current pricing",
      version: "Current listing",
      released: "Release date not listed",
      sourceTask: slugify(tool.Category || subcategory),
      directoryUrl: "https://github.com/diamitani/aitooldirectory",
      sourceUrl: "https://github.com/diamitani/aitooldirectory",
      sourceName: "Open AI Tool Directory",
      sourceLicense: "Free to use and reuse",
      accent: colors[index % colors.length],
    }];
  });
}

async function fetchSeed([category, subcategory, sourceSlug]) {
  const url = `${READER_ORIGIN}/s/${sourceSlug}/`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "AIssessor public directory indexer/1.0",
      "X-Return-Format": "html",
    },
    signal: AbortSignal.timeout(120_000),
  });

  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const html = await response.text();
  const tools = parsePage(html, category, subcategory, sourceSlug);
  process.stdout.write(`${category}/${subcategory}: ${tools.length}\n`);
  return tools;
}

async function runPool(items) {
  const queue = [...items];
  const results = [];

  async function worker() {
    while (queue.length) {
      const seed = queue.shift();
      if (!seed) return;
      try {
        results.push(...await fetchSeed(seed));
      } catch (error) {
        process.stderr.write(`Failed ${seed[2]}: ${error.message}\n`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  return results;
}

let previousTools = [];
try {
  previousTools = JSON.parse(await readFile(OUTPUT_PATH, "utf8")).tools ?? [];
} catch {
  previousTools = [];
}

const [scraped, autoVenture, openDirectory] = await Promise.all([
  runPool(taskSeeds),
  fetchAutoVenture(),
  fetchOpenDirectory(),
]);
const preservedTaaft = previousTools
  .filter((tool) => tool.id?.startsWith("taaft-"))
  .map((tool) => ({
    ...tool,
    sourceName: tool.sourceName || "There's An AI For That",
    sourceLicense: tool.sourceLicense || "Public search index",
  }));
const collected = [...preservedTaaft, ...scraped, ...autoVenture, ...openDirectory];
const unique = new Map();

for (const tool of collected) {
  const key = tool.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "").toLowerCase();
  const existing = unique.get(key);
  if (!existing) {
    unique.set(key, { ...tool, categories: [tool.category], subcategories: [tool.subcategory], tasks: [tool.task] });
    continue;
  }
  existing.categories = [...new Set([...existing.categories, tool.category])];
  existing.subcategories = [...new Set([...existing.subcategories, tool.subcategory])];
  existing.tasks = [...new Set([...existing.tasks, tool.task])];
}

const tools = [...unique.values()].sort((a, b) => a.name.localeCompare(b.name));
const payload = {
  source: `${SOURCE_ORIGIN}/tasks/`,
  sourcePolicy: `${SOURCE_ORIGIN}/robots.txt`,
  generatedAt: new Date().toISOString(),
  seeds: taskSeeds.map(([category, subcategory, slug]) => ({ category, subcategory, slug })),
  counts: {
    scraped: tools.filter((tool) => tool.sourceName === "There's An AI For That").length,
    supplemental: tools.filter((tool) => tool.sourceName !== "There's An AI For That").length,
    unique: tools.length,
    creativity: tools.filter((tool) => tool.categories.includes("creativity")).length,
    work: tools.filter((tool) => tool.categories.includes("work")).length,
    personal: tools.filter((tool) => tool.categories.includes("personal")).length,
  },
  tools,
};

await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
await writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
process.stdout.write(`Wrote ${tools.length} unique tools to ${OUTPUT_PATH}\n`);
