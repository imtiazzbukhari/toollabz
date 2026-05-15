import type { ToolDefinition } from "./types";
import { getToolFormula } from "./content";

/** One or two sentences weaving related entities for topical authority (finance, health, math, etc.). */
export function getEntityTopicalSnippet(tool: ToolDefinition): string | null {
  switch (tool.category) {
    case "finance":
    case "real-estate":
      return `Topically, ${tool.name} sits next to ideas people search in clusters-APR and amortization, gross vs net cash flow, ROI, margins, inflation, and tax timing-so treat the headline number as one layer in a fuller housing or business model.`;
    case "business":
    case "marketing":
      return `For go-to-market math, ${tool.name} often pairs mentally with CAC, LTV, ROAS, conversion rate, and contribution margin; keep definitions aligned with your finance partner so deck numbers do not drift between tools.`;
    case "legal":
      return `Legal-adjacent tools on Toollabz are framed for planning language, not outcomes: fault percentages, caps, and settlement bands vary by venue-use outputs to structure questions for licensed counsel.`;
    case "developer":
    case "utility":
      return `Developer utilities reinforce the same algebra as spreadsheets-percentages, string encoding, radix conversions, and structured data-while staying deterministic so CI and local runs match.`;
    case "calculators":
      return `Calculator pages assume comfort with percentages, ratios, and unit conversions; when a result feeds homework or instruction, show the formula line so learners see the relationship, not just the final figure.`;
    default:
      if (/(bmi|calorie|sleep|burnout|anxiety|medication|blood|vo2|hydration|macro|protein|weight)/i.test(tool.slug)) {
        return `Wellness-adjacent queries often bundle BMI, calorie targets, deficit planning, hydration, sleep debt, and metabolism language-use this page as an educational checkpoint, not a substitute for individualized medical guidance.`;
      }
      if (/(convert|cm-to|kg-to|mile|fahrenheit|mb-to|stone-to|acre|feet-inch)/i.test(tool.slug)) {
        return `Conversion tools reinforce dimensional analysis: keep units explicit, watch significant figures, and remember classroom formulas (ratios, linear transforms) extend to engineering and travel planning.`;
      }
      return null;
  }
}

export type ComparisonBlock = {
  title: string;
  paragraphs: readonly string[];
};

/** Long-tail “difference / when to use” style copy using related tools (no new URLs). */
export function getToolComparisonBlock(tool: ToolDefinition, related: readonly ToolDefinition[]): ComparisonBlock | null {
  const a = related[0];
  const b = related[1];
  if (!a) return null;
  const kw = tool.keywords[0] ?? tool.name;
  return {
    title: `Difference between ${tool.name} and ${a.name}`,
    paragraphs: [
      `${tool.name} is optimized for ${kw} with the fields you see on this page. ${a.name} shifts the question slightly-open it when your next step needs its specific inputs rather than forcing everything through one form.`,
      b
        ? `If you are torn between paths, run ${tool.name} and ${a.name} with the same baseline assumptions, then use ${b.name} only if your scenario explicitly calls for that metric.`
        : `If numbers disagree between tools, compare rounding, basis (annual vs monthly), and whether fees or taxes are included-those details usually explain the gap.`,
    ],
  };
}

export function getWhenToUseThisToolBullets(tool: ToolDefinition): string[] {
  const kw = tool.keywords[0] ?? tool.name;
  return [
    `Use ${tool.name} when you need a fast, repeatable answer for ${kw} before you invest time in a spreadsheet model.`,
    `Prefer it for teaching, estimation, and meeting prep-when everyone should see the same formula and field labels on an HTTPS URL.`,
    `Switch to a specialized Toollabz sibling (see Related tools) when jurisdiction tables, inventory rules, or campaign structure require a different field set.`,
  ];
}

export function getRelatedFormulasList(tool: ToolDefinition): { label: string; expression: string }[] {
  const primary = getToolFormula(tool.slug);
  const rows = [{ label: "This tool", expression: primary }];
  const alt = tool.keywords.slice(0, 2).map((k) => ({
    label: `Related intent: ${k}`,
    expression: `See paired tools for ${k}-each page documents its own core relationship next to the live form.`,
  }));
  return [...rows, ...alt].slice(0, 4);
}
