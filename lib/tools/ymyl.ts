import type { ToolDefinition } from "./types";

const EXPERT_DISCLAIMER_SLUGS = new Set<string>([
  "mesothelioma-compensation-estimator",
  "medical-malpractice-settlement-estimator",
  "anxiety-level-self-assessment",
]);

/** Legal / medical / mental-health tools that need the standard expert disclaimer. */
export function toolNeedsExpertDisclaimer(tool: ToolDefinition): boolean {
  if (EXPERT_DISCLAIMER_SLUGS.has(tool.slug)) return true;
  return false;
}

/** Finance calculators: estimates only (YMYL-style framing). */
export function toolIsFinanceCategory(tool: ToolDefinition): boolean {
  return tool.category === "finance";
}

export function toolNeedsEditorialReviewLine(tool: ToolDefinition): boolean {
  return toolNeedsExpertDisclaimer(tool) || toolIsFinanceCategory(tool);
}
