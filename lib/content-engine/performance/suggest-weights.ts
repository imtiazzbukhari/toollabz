import type { ContentOutcome } from "./types";
import type { QualityDimensionWeights } from "./weights-loader";
import { DEFAULT_QUALITY_WEIGHTS } from "./weights-loader";

/**
 * Heuristic suggestion when you periodically export outcomes (GSC + internal quality flags).
 * Does not write files - feed output into `weights.json` after human review.
 */
export function suggestDimensionWeightsFromOutcomes(
  outcomes: readonly ContentOutcome[],
): { dimensions: QualityDimensionWeights; rationale: string[] } {
  const rationale: string[] = [];
  if (outcomes.length === 0) {
    return { dimensions: { ...DEFAULT_QUALITY_WEIGHTS }, rationale: ["No outcomes; using defaults."] };
  }

  const passed = outcomes.filter((o) => o.passedQuality);
  const failed = outcomes.filter((o) => !o.passedQuality);
  const avgClicksPassed =
    passed.length === 0 ? 0 : passed.reduce((a, o) => a + o.clicks, 0) / passed.length;
  const avgImpPassed =
    passed.length === 0 ? 0 : passed.reduce((a, o) => a + o.impressions, 0) / passed.length;

  let w = { ...DEFAULT_QUALITY_WEIGHTS };

  if (passed.length && avgClicksPassed < 5 && avgImpPassed > 800) {
    w = { ...w, uniqueness: w.uniqueness + 0.03, humanization: w.humanization + 0.03, seo: w.seo - 0.02, depth: w.depth - 0.04 };
    rationale.push("Passed quality but low CTR vs impressions: nudge uniqueness + humanization, trim depth/seo weight slightly.");
  }

  if (failed.length > passed.length) {
    w = { ...w, depth: w.depth + 0.04, usefulness: w.usefulness + 0.03, humanization: w.humanization + 0.02, seo: w.seo - 0.05 };
    rationale.push("Many failures vs passes: prioritize depth + usefulness + humanization.");
  }

  const sum = w.uniqueness + w.readability + w.depth + w.seo + w.usefulness + w.humanization;
  const n = 1 / sum;
  const dimensions: QualityDimensionWeights = {
    uniqueness: w.uniqueness * n,
    readability: w.readability * n,
    depth: w.depth * n,
    seo: w.seo * n,
    usefulness: w.usefulness * n,
    humanization: w.humanization * n,
  };

  return { dimensions, rationale };
}
