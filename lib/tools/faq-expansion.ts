import type { ToolDefinition, ToolFAQ } from "./types";
import { pickBySlug, slugContentVariant } from "./content-variation";

const FAQ_CAP = 8;
const FAQ_MIN_IMPORTANT = 6;

function dedupeFaqs(items: ToolFAQ[]): ToolFAQ[] {
  const seen = new Set<string>();
  const out: ToolFAQ[] = [];
  for (const it of items) {
    const k = it.question.trim().toLowerCase().replace(/\s+/g, " ");
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(it);
  }
  return out;
}

/** Finance, business, legal, etc.-pages that benefit from deeper FAQ intent coverage. */
export function isHighIntentTool(tool: ToolDefinition): boolean {
  const { category, slug, name } = tool;
  if (["finance", "business", "marketing", "real-estate", "legal"].includes(category)) return true;
  if (category === "calculators") return true;
  if (category === "generators" && slug.startsWith("ai-")) return true;
  if (category === "pdf") return true;
  const health =
    /bmi|calorie|sleep|burnout|anxiety|medication|blood|vo2|hydration|macro|protein|weight|dosage|due-date|life-expectancy|heart|stress|screen-time|water|carbon|fertilizer|recipe|baking|pregnancy|child|baby|swimming|cycling|race-pace|one-rep|nutrition|deficit|metabolism/i;
  if (health.test(slug) || health.test(name)) return true;
  if (/(tax|mortgage|loan|salary|paycheck|refinance|roi|margin|amort|interest|debt|credit-card|investment|dividend|crypto|lease|insurance|settlement|forgiveness)/i.test(slug)) return true;
  return false;
}

function longTailPack(tool: ToolDefinition, formula: string): ToolFAQ[] {
  const kw = (tool.keywords[0] ?? tool.name).trim();
  const kw2 = (tool.keywords[1] ?? tool.category).trim();
  const kw3 = (tool.keywords[2] ?? "").trim();
  const name = tool.name;
  const v = slugContentVariant(`${tool.slug}-ltfaq`, 6);
  const beginner = pickBySlug(tool.slug + "-beg", [
    `What does "${kw}" mean in plain English for ${name}?`,
    `I am new to ${kw}-what should I read before using ${name}?`,
    `Is ${name} meant for beginners working with ${kw}?`,
  ] as const);
  const advanced = pickBySlug(tool.slug + "-adv", [
    `What advanced assumption should power users double-check for ${kw}?`,
    `How does ${name} handle edge cases for ${kw2}?`,
    `Does ${name} expose the raw formula so I can audit ${kw}?`,
  ] as const);
  const longTail = pickBySlug(tool.slug + "-lt", [
    `People also ask: how does ${kw} relate to ${kw2} on this page?`,
    `Long-tail intent: when is ${name} the wrong tool for ${kw}?`,
    `Search variations around ${kw}: does ${name} cover ${kw3 || kw2} scenarios?`,
  ] as const);
  const workflow = pickBySlug(tool.slug + "-wf", [
    `What is the best workflow: ${name} first, then spreadsheets, or the reverse?`,
    `Can I chain ${name} with another Toollabz page for ${kw2}?`,
    `Where should I paste ${name} results when documenting ${kw}?`,
  ] as const);
  const realWorld = pickBySlug(tool.slug + "-rw", [
    `Will landlords, lenders, or clients accept a screenshot from ${name}?`,
    `Is ${name} suitable for a quick client call about ${kw}?`,
    `How do teams use ${name} when ${kw} shows up in tickets or email threads?`,
  ] as const);
  const packs: ToolFAQ[][] = [
    [
      {
        question: beginner,
        answer: `${name} is a structured calculator around ${kw}: enter the labeled fields, run the action, and read the output. Start with conservative inputs, then widen the range once the numbers look plausible for your context.`,
      },
      {
        question: advanced,
        answer: `Power users should validate rounding rules, compounding frequency, tax basis, and any caps or floors that apply to ${kw2}. The engine documents behavior through this relationship: ${formula}`,
      },
      {
        question: longTail,
        answer: `This URL focuses on ${kw} with supporting vocabulary (${kw2}${kw3 ? `, ${kw3}` : ""}) woven into headings and FAQs. If your scenario needs jurisdiction-specific tables we do not ship, export assumptions and extend the model offline.`,
      },
    ],
    [
      {
        question: workflow,
        answer: `Most visitors run ${name} for a fast ${kw} checkpoint, then copy numbers into a spreadsheet or memo. Related tools below are picked for the next step so you do not lose context between tabs.`,
      },
      {
        question: realWorld,
        answer: `Treat outputs as transparent planning figures: include the date, URL, and inputs when you share them. For regulated filings or binding quotes, reconcile with source systems and licensed professionals.`,
      },
      {
        question: `How is ${name} different from typing ${kw} into a search bar calculator?`,
        answer: `You get deterministic Toollabz logic (${formula}), stable HTTPS URLs, and internal links to adjacent ${kw2} utilities-useful when you need repeatability rather than a one-off widget.`,
      },
    ],
  ];
  const pack = packs[v % packs.length] ?? packs[0]!;
  const extra: ToolFAQ[] = [
    {
      question: `Quick check: does ${name} round ${kw} the way my bank or payroll system does?`,
      answer:
        "Systems differ on day-count conventions, rounding per line, and batching. Match this tool to a known reference transaction first, then rely on it for deltas and scenarios rather than a single penny-perfect truth.",
    },
  ];
  return [...pack, ...extra];
}

function categoryLongTail(tool: ToolDefinition): ToolFAQ[] {
  const kw = tool.keywords[0] ?? tool.name;
  if (tool.category === "finance" || tool.category === "real-estate") {
    return [
      {
        question: `Does ${tool.name} model APR, amortization, or simple interest for ${kw}?`,
        answer:
          "The on-page formula block states the relationship we implement. APR usually includes fees spread across the loan; simple interest ignores compounding inside a period. Match the mode to your contract or use conservative assumptions.",
      },
      {
        question: `How should I think about ROI, margin, or cash flow alongside ${kw}?`,
        answer:
          "Use this tool for the specific metric it computes, then open a margin or ROI utility when you need profitability framing. Mixing definitions (gross vs net, pre-tax vs post-tax) is a common source of mismatched stories in meetings.",
      },
    ];
  }
  if (tool.category === "business" || tool.category === "marketing") {
    return [
      {
        question: `Where do CAC, LTV, conversion rate, or ROAS fit with ${tool.name}?`,
        answer:
          "Those metrics describe funnel economics and acquisition efficiency. If your question is spend or revenue efficiency, pair this output with the marketing calculators linked from the hub so vocabulary stays consistent across slides.",
      },
    ];
  }
  if (/(bmi|calorie|sleep|burnout|anxiety|medication|blood|vo2|hydration|macro|protein|weight)/i.test(tool.slug)) {
    return [
      {
        question: `Is ${tool.name} medical advice or a screening diagnosis?`,
        answer:
          "No. Outputs are educational estimates. BMI, calories, sleep scores, and similar metrics vary by individual physiology-use them for orientation and discuss changes with a qualified clinician when health decisions are involved.",
      },
      {
        question: `How do hydration, metabolism, and calorie deficit relate to ${kw}?`,
        answer:
          "Those concepts interact in real life: hydration affects performance signals, metabolism influences burn estimates, and deficit planning should stay within safe bands. Treat ranges as planning sketches, not prescriptions.",
      },
    ];
  }
  if (tool.category === "developer" || tool.category === "utility") {
    return [
      {
        question: `Will ${tool.name} corrupt encoding or break JSON/XML for ${kw}?`,
        answer:
          "The tool applies deterministic transforms. Always validate against your runtime or schema after export-especially for escaped characters, unicode, and line endings across Windows and Unix.",
      },
    ];
  }
  return [
    {
      question: `What real-world mistake shows up most often for ${kw} here?`,
      answer:
        "Mixing units or percentage bases (0.075 vs 7.5) is the top issue. Read field labels literally, run twice with different assumptions, then keep the run that matches your source document.",
    },
  ];
}

function scoreFaq(tool: ToolDefinition, f: ToolFAQ): number {
  const q = f.question.trim().toLowerCase();
  if (tool.faqs.some((b) => b.question.trim().toLowerCase() === q)) return 5;
  const kw = (tool.keywords[0] ?? "").toLowerCase();
  if (kw && q.includes(kw)) return 4;
  if (
    q.includes("difference between") ||
    q.includes("people also ask") ||
    q.includes("workflow") ||
    q.includes("long-tail") ||
    q.includes("advanced assumption")
  ) {
    return 3;
  }
  if (q.includes("accurate") || q.includes("precise") || q.includes("trust")) return 2;
  if (q.includes("mobile") || q.includes("phone") || q.includes("tablet") || q.includes("free to use")) return 1;
  return 2;
}

function rankAndCap(tool: ToolDefinition, list: ToolFAQ[], cap: number): ToolFAQ[] {
  const deduped = dedupeFaqs(list);
  const sorted = [...deduped].sort((a, b) => scoreFaq(tool, b) - scoreFaq(tool, a));
  return sorted.slice(0, cap);
}

/** Merge long-tail + topical FAQ intent; cap at FAQ_CAP; ensure minimum depth for high-intent tools. */
export function augmentToolFaqsForIntent(tool: ToolDefinition, merged: ToolFAQ[], formulaLine: string): ToolFAQ[] {
  const important = isHighIntentTool(tool);
  const injected = dedupeFaqs([...longTailPack(tool, formulaLine), ...categoryLongTail(tool)]);
  let list = dedupeFaqs([...merged, ...injected]);

  if (important && list.length < FAQ_MIN_IMPORTANT) {
    const more = longTailPack(tool, formulaLine).filter((p) => !list.some((x) => x.question === p.question));
    list = dedupeFaqs([...list, ...more]);
  } else if (!important && list.length < 5) {
    list = dedupeFaqs([...list, ...longTailPack(tool, formulaLine).slice(0, 3)]);
  }

  return rankAndCap(tool, list, FAQ_CAP);
}
