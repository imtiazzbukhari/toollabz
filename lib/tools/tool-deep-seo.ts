import type { ToolDefinition } from "./types";
import { getToolFormula } from "./content";
import { PRIORITY_EXAMPLE_BULLETS } from "./priority-example-bullets";
import { pickBySlug, slugContentVariant } from "./content-variation";

function catLabel(category: string): string {
  return category.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

const OPENERS = [
  "If you landed here from search, you probably want a straight answer without signing up for another account.",
  "This page is written for people who prefer clarity over jargon: what the tool does, how it behaves, and where it fits in a workflow.",
  "Toollabz keeps the interface lightweight on purpose so you can focus on inputs, outputs, and the story the numbers tell.",
  "Whether you are planning, estimating, or sanity-checking a figure someone sent you, the goal is the same: fast, repeatable math you can trust.",
  "Use this page as both a calculator and a mini-guide: the sections below explain intent, limits, and practical follow-ups.",
  "Some visitors only need a single output; others want the surrounding context so they can defend a number in a meeting - both paths are supported here.",
  "Instead of hunting through forum threads, you get labeled fields, readable outputs, and FAQs written for the same vocabulary people type into search.",
] as const;

const MID_CONNECTORS = [
  "In practice, that means",
  "For most workflows,",
  "When you compare scenarios,",
  "If you are collaborating,",
  "As you iterate on inputs,",
] as const;

const CATEGORY_VOICES: Partial<Record<ToolDefinition["category"], string>> = {
  finance:
    "Finance pages on Toollabz emphasize transparent assumptions - rates, horizons, and tax sketches - so you can document what you tested before you talk to a professional.",
  business:
    "Business tools here focus on ratios and planning bands you can drop into a memo, a pitch appendix, or a weekly metrics review without rebuilding a model from scratch.",
  marketing:
    "Marketing utilities translate spend and funnel signals into comparable numbers so growth, content, and finance can align on definitions before budgets move.",
  developer:
    "Developer helpers prioritize deterministic parsing and formatting so your output matches what CLI tools expect, which reduces back-and-forth during integrations.",
  utility:
    "Utility tools cover the small-but-expensive minutes lost to unit confusion, time zones, and formatting - tasks that should never require a heavyweight install.",
  pdf: "PDF workflows are often the last mile before a packet is uploaded, merged, or emailed - so the copy here stresses scope, file hygiene, and realistic limitations.",
  "real-estate":
    "Real estate calculators are framed around monthly cash flow and break-even thinking because that is how buyers, renters, and landlords usually make decisions.",
  legal:
    "Legal-adjacent generators describe outputs as drafts that still need professional review - use them to structure thinking, not to replace counsel.",
  creator:
    "Creator-focused tools assume you are shipping weekly, so the guidance highlights iteration speed, tone control, and how to pair outputs with editorial review.",
  converters:
    "Converters are built for precision and repeatability: the same input should always yield the same output so you can trust pasted values in downstream systems.",
  calculators:
    "Calculator-style tools document the core relationship between inputs so you can spot whether a result is in the right order of magnitude before you rely on it.",
  generators:
    "Generator-style tools blend structured prompts with editable outputs so you can move from blank page to first draft without losing your brand voice.",
  image:
    "Image-related utilities focus on checklists and planning outputs that keep production work organized while you use specialized software for pixels.",
};

export function getToolDeepGuideParagraphs(tool: ToolDefinition): string[] {
  const kw = tool.keywords[0] ?? tool.name.toLowerCase();
  const kw2 = tool.keywords[1] ?? `${tool.name} online`;
  const cat = tool.category;
  const voice = CATEGORY_VOICES[cat] ?? CATEGORY_VOICES.utility!;
  const opener = pickBySlug(tool.slug, OPENERS);
  const mid = pickBySlug(tool.slug + "-mid", MID_CONNECTORS);
  const v = slugContentVariant(tool.slug, 3);
  const audience =
    v === 0
      ? "individuals planning personal decisions"
      : v === 1
        ? "operators who need a quick numeric checkpoint during the week"
        : "teams that want a shared baseline before deeper analysis";

  const p1 = `${opener} ${tool.name} is a free online Toollabz experience centered on “${kw}” and related searches such as “${kw2}”. ${voice} The short description on this page - “${tool.shortDescription}” - is the fastest way to confirm you are in the right place before you scroll to the interactive area above the guide sections.`;

  const p2 = `${mid} you should treat ${tool.name.toLowerCase()} as a structured sandbox: enter realistic values, capture the output, then adjust one variable at a time. That approach mirrors how spreadsheets are used, but with guardrails so invalid combinations are caught early. People who care about ${kw} often rerun the same tool monthly; bookmark the HTTPS URL so your team always references the same definitions.`;

  const p3 = `Who should use this tool? ${audience} will get the most value when ${tool.description.slice(0, Math.min(220, tool.description.length))}${tool.description.length > 220 ? "…" : ""} If your scenario is more specialized than the fields allow, treat the result as directional and extend the model offline with the extra constraints your organization requires.`;

  const p4 = `Why Toollabz keeps ${tool.category} tools consistent: internal links on this page point to adjacent utilities so you can finish multi-step work - convert units, validate payloads, estimate tax bands, or draft copy - without bouncing between unrelated domains. That topical clustering also helps search systems understand that this URL is part of a broader, trustworthy collection rather than a thin doorway page.`;

  const p5 = `Responsible use matters. ${tool.name} does not know your jurisdiction, employer rules, lender overlays, or medical facts unless you type them; it cannot replace licensed advice where regulations apply. When stakes are high, export your assumptions and outputs, then validate with a qualified professional. For everyday estimation and classroom-style exploration, run multiple cases, write down deltas, and use the FAQ section to clarify edge cases you might otherwise overlook.`;

  return [p1, p2, p3, p4, p5];
}

export function getToolRealWorldExampleBullets(tool: ToolDefinition): string[] {
  const priority = PRIORITY_EXAMPLE_BULLETS[tool.slug];
  if (priority?.length) {
    return [...priority];
  }
  const k = tool.keywords[0] ?? tool.name.toLowerCase();
  const n = tool.name;
  const a = slugContentVariant(tool.slug + "ex", 5);
  const templates: string[][] = [
    [
      `You are comparing two offers and need a consistent ${k} baseline before you negotiate.`,
      `A teammate asked for a screenshot-friendly output from ${n} to paste into a shared doc.`,
      `You want to sanity-check an invoice line item or receipt total tied to ${k} before you approve it.`,
      `You are learning how ${n} behaves and you run textbook inputs to match a known reference.`,
    ],
    [
      `You are building a personal finance routine and ${k} shows up in the same monthly checklist.`,
      `You need a fast answer on mobile during a meeting without opening a spreadsheet named “final_FINAL”.`,
      `You are translating a client request into numbers your team can reproduce with ${n}.`,
      `You are teaching someone else the workflow and you want deterministic steps tied to ${k}.`,
    ],
    [
      `You are preparing homework or training material where ${n} illustrates a real formula.`,
      `You are estimating a side project where ${k} influences pricing or capacity.`,
      `You are cross-checking an automated report that already claims to compute ${k}.`,
      `You are documenting assumptions for an audit trail that cites Toollabz as a planning reference only.`,
    ],
    [
      `You found ${n} while researching ${k} and you want a credible first pass before deeper tools.`,
      `You are comparing geographies or product tiers where ${k} differs by a small margin you still want to see.`,
      `You are pairing ${n} with a related calculator linked below to finish a two-step story.`,
      `You are sharing a link with a friend who prefers plain language over raw equations.`,
    ],
    [
      `You are prototyping a dashboard and you need quick ${k} numbers to size components.`,
      `You are writing a blog post and you want to verify an example tied to ${n}.`,
      `You are planning travel or logistics where ${k} influences cost or timing bands.`,
      `You are archiving “what we assumed” notes next to a ${n} screenshot for later review.`,
    ],
  ];
  return templates[a] ?? templates[0]!;
}

export function getToolLogicExplanationParagraph(tool: ToolDefinition): string {
  const formula = getToolFormula(tool.slug);
  const cat = catLabel(tool.category);
  return `How the logic is expressed on this page: the implementation follows ${formula} The UI maps your fields into that relationship, validates obvious mistakes (empty values, impossible ranges where detectable), and returns a readable breakdown. Category context (${cat}) determines which related tools we recommend next, because people who finish ${tool.name.toLowerCase()} often continue with a neighboring calculator or converter rather than stopping at a single number.`;
}
