import type { ToolDefinition } from "./types";
import { getToolInsight } from "./tool-insights";
import { getToolFormula } from "./content";
import { getPriorityQuickAnswer, getPriorityWhoUses } from "./priority-tool-content";
import { getCategorySources, getReviewerForTool, type SourceRef } from "./category-sources";
import { getToolCommonMistakesParagraphs } from "./tool-page-depth";
import { getToolBenchmark, type ToolBenchmark } from "./priority-benchmarks";
import { SITE_LAST_UPDATED_ISO, formatSiteLastUpdatedForDisplay } from "@/lib/site-freshness";

export type ToolEditorial = {
  quickAnswer: { title: string; answer: string; example: string };
  definition: string[];
  whenToUse: string[];
  formula: string;
  formulaExplanation: string[];
  workedExample: string;
  takeaways: string[];
  mistakes: string[];
  whoUses: string;
  sources: SourceRef[];
  benchmark: ToolBenchmark | null;
  reviewer: { name: string; role: string; profileHref: string };
  lastReviewedLabel: string;
  lastUpdatedLabel: string;
};

/**
 * Unique editorial surface for every tool page.
 * Prefers per-tool insight registry (276 unique quickAnswers) over template packs.
 */
export function getToolEditorial(tool: ToolDefinition): ToolEditorial {
  const insight = getToolInsight(tool.slug);
  const priorityQa = getPriorityQuickAnswer(tool);
  const formula = getToolFormula(tool.slug);
  const fieldLabels = tool.fields.slice(0, 4).map((f) => f.label);
  const kw = tool.keywords[0] ?? tool.name.toLowerCase();

  const answer =
    priorityQa?.answer ??
    insight?.quickAnswer ??
    `${tool.name} computes a result from the fields on this page for ${kw}. Check the formula section before you rely on the number.`;
  const example =
    priorityQa?.example ??
    insight?.example ??
    (fieldLabels.length
      ? `Enter realistic values for ${fieldLabels.join(", ")}, then read the result beside the form.`
      : `Run ${tool.name} once with a known example so you can verify the output against a spreadsheet.`);

  const definition = [
    insight?.explain ??
      `${tool.name} is a free browser calculator on Toollabz for ${kw}. ${tool.shortDescription}`,
    tool.description,
    `Inputs on this page: ${fieldLabels.length ? fieldLabels.join(", ") : "the fields shown above the result"}. Assumptions stay visible so you can reproduce the figure elsewhere.`,
  ].filter(Boolean);

  const whenToUse = [
    `Use ${tool.name} when you need a transparent ${kw} answer before you commit numbers to a spreadsheet, invoice, or conversation.`,
    fieldLabels[0]
      ? `Reach for it when you already know (or can estimate) ${fieldLabels[0]} and want the dependent result without rebuilding the formula by hand.`
      : `Reach for it when a quick check is enough and you do not need a full accounting system.`,
    `Skip it when you need certified advice, signed-off payroll, or a lender’s official quote—those require the primary institution’s systems.`,
  ];

  const formulaExplanation = [
    `Core relationship for ${tool.name}:`,
    formula,
    insight?.example
      ? `Worked check: ${insight.example}`
      : `Validate once with a hand calculation using the same inputs you type into the fields.`,
  ];

  const priorityWho = getPriorityWhoUses(tool);
  const whoUses =
    priorityWho ??
    (insight
      ? `People who care about ${kw} use ${tool.name} as a planning sandbox: ${insight.insights[0] ?? "keep assumptions explicit and re-run when inputs change."}`
      : `Operators, students, and households use ${tool.name} when they need a repeatable ${kw} check without installing software.`);

  const takeaways =
    insight?.insights?.length && insight.insights.length >= 2
      ? insight.insights
      : [
          `${tool.name} is for planning, not a substitute for professional advice when stakes are high.`,
          `Match field labels to your real documents so the result is comparable later.`,
          `Re-run the calculation when rates, fees, or unit conventions change.`,
        ];

  // Prefer slug-specific mistakes; avoid the shared "Mixing units is the fastest…" fallback pack.
  const depthMistakes = getToolCommonMistakesParagraphs(tool);
  const isGenericMistakes = depthMistakes[0]?.startsWith("Mixing units is the fastest") ?? true;
  const mistakes = !isGenericMistakes
    ? depthMistakes.slice(0, 4)
    : [
        `For ${tool.name}, mismatched units or periods (monthly vs annual, % vs decimal) are the fastest path to a believable wrong answer on ${kw}.`,
        insight?.insights?.[1]
          ? `Watch for this pitfall: ${insight.insights[1]}`
          : `Do not treat one run as final—vary ${fieldLabels[0] ?? "the main input"} once high and once low before you share a headline number.`,
        `If you paste the result into a decision doc, note the formula and the page date (${SITE_LAST_UPDATED_ISO}) so teammates can reproduce it.`,
      ];

  return {
    quickAnswer: {
      title: priorityQa?.title ?? `Quick answer: ${tool.name}`,
      answer,
      example,
    },
    definition,
    whenToUse,
    formula,
    formulaExplanation,
    workedExample: example,
    takeaways,
    mistakes,
    whoUses,
    sources: getCategorySources(tool),
    benchmark: getToolBenchmark(tool),
    reviewer: getReviewerForTool(tool),
    lastReviewedLabel: formatSiteLastUpdatedForDisplay(),
    lastUpdatedLabel: SITE_LAST_UPDATED_ISO,
  };
}
