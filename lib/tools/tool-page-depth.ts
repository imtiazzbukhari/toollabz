import type { ToolDefinition } from "./types";
import { getToolFormula } from "./content";
import { getMarketingHubForTool } from "./directory-groups";

/** Approximate word count for SEO depth checks (plain text). */
export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function fieldLabels(tool: ToolDefinition): string {
  return tool.fields.map((f) => f.label).join(", ");
}

/**
 * Extra long-form blocks so every tool page clears ~450+ words in main editorial
 * (excluding nav/footer/aside chrome). Merges with existing getToolSeoContent + FAQs.
 */
export function getToolDepthIntroParagraphs(tool: ToolDefinition): string[] {
  const kw = tool.keywords[0] ?? tool.name.toLowerCase();
  const hub = getMarketingHubForTool(tool);
  return [
    `What is ${tool.name}? It is a focused, browser-based utility on Toollabz that helps you work with "${kw}" without installing desktop software. You open the HTTPS page, enter the fields that matter (${fieldLabels(tool)}), and read a structured result you can copy into email, tickets, or spreadsheets.`,
    `Who needs ${tool.name}? Anyone who touches ${kw} in real work: operators sanity-checking a number before a meeting, students rehearsing a formula, founders comparing two scenarios, or support teams reproducing a customer's math. The interface stays calm on purpose so you can return weekly without relearning hidden controls.`,
    `A concrete use case: imagine you need a defensible baseline for ${kw} before you commit to a vendor, lender, or client. You plug conservative inputs, capture the output with the date in your notes, then iterate with optimistic and pessimistic cases. ${tool.name} keeps the arithmetic consistent so the discussion stays on assumptions, not mysteriously drifting totals.`,
    `Toollabz pages are built for repeat visits: canonical URLs, structured headings, FAQs that answer the questions people actually ask, and internal links to sibling tools in the same ${tool.category} cluster plus the ${hub.title} hub. That way you can move from one calculator to the next without losing context.`,
    `When documentation feels thin elsewhere, treat this page as a working spec: the headings mirror how engineers describe the pipeline, the formula section names variables the same way as the form labels, and the FAQs pre-empt the support questions we see in analytics. Bookmark the hub (${hub.href}) if you routinely jump between related utilities.`,
  ];
}

/** Typical pitfalls when using this tool or interpreting its output. */
export function getToolCommonMistakesParagraphs(tool: ToolDefinition): string[] {
  const kw = tool.keywords[0] ?? tool.name.toLowerCase();
  const labels = tool.fields.map((f) => f.label).join(", ");
  return [
    `Mixing units is the fastest way to get a believable-but-wrong ${kw} answer. Double-check whether each field expects a percent as 7.5 versus 0.075, whether money is monthly or annual, and whether distances or weights use the same system throughout (${labels}).`,
    `Cherry-picking one scenario and treating it as guaranteed is another common slip. Run a conservative and an aggressive case, write down both, and only then share a single headline number-especially if someone else will rely on it for pricing, payroll, or compliance.`,
    `Stale inputs quietly compound: tax brackets, posted rates, rent assumptions, and utility fees change. If your ${tool.name} output is more than a few weeks old for a volatile input, refresh the numbers instead of defending the earlier screenshot.`,
  ];
}

/** Numbered-style steps expanded to prose (100+ words total). */
export function getToolDepthHowToNarrative(tool: ToolDefinition): string[] {
  const steps = tool.howToUse;
  const labels = fieldLabels(tool);
  const lines: string[] = [
    `Here is the recommended flow in five beats so you never miss a field. Step 1: enter each value carefully for ${labels} - use plain numbers unless the label asks for symbols. Step 2: if the tool offers selectors (dropdowns, toggles, or modes), pick the option that matches your jurisdiction or pricing model; mismatched mode is the top source of "wrong" outputs.`,
    `Step 3: click Calculate, Convert, or Generate (the primary action button). The page validates obvious mistakes before running so you do not get silent garbage. Step 4: read the headline result first, then scan any bullet breakdowns or secondary lines that explain how the total was composed.`,
    `Step 5: copy the result block or screenshot the section for your notes, then bookmark the URL if ${tool.keywords[0] ?? "this workflow"} shows up often. When the answer feeds another tool, open a related card from the bottom of the page instead of retyping assumptions from memory.`,
  ];
  if (steps.length) {
    lines.unshift(
      `Your official checklist from the product team: ${steps.map((s, i) => `${i + 1}) ${s}`).join(" ")} - treat those as the minimum happy path, then use the five beats above when you want a disciplined review habit.`,
    );
  }
  return lines;
}

/** Formula + variables + numeric toy example (50–120 words). */
export function getToolDepthFormulaSection(tool: ToolDefinition): string[] {
  const f = getToolFormula(tool.slug);
  const kw = tool.keywords[0] ?? "output";
  return [
    `Method and formula: ${f} Variables map directly to the labeled fields on this page; if a percentage is required, enter it as a number such as 7.5 for 7.5% unless the label states otherwise.`,
    `Illustrative numbers (not advice): suppose a toy input set produces an intermediate value of 120 and a rate multiplier of 1.08 - the tool would surface the composed ${kw} so you can trace how the pieces combine. Swap in your own figures to mirror a contract, payslip, or invoice you are allowed to model.`,
  ];
}
