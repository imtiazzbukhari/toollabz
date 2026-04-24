import type { PageBehaviorRollup } from "./behavior-types";

export type EngagementFeedbackHint = {
  path: string;
  /** Prompt addendum or editorial checklist item. */
  hint: string;
  category: "intro" | "structure" | "examples" | "depth" | "section_balance";
};

function dominantExitSection(rollup: PageBehaviorRollup): string | null {
  let best: string | null = null;
  let n = 0;
  for (const [k, v] of Object.entries(rollup.exitBySection)) {
    if (k === "_unknown") continue;
    if (v > n) {
      n = v;
      best = k;
    }
  }
  return best;
}

/**
 * Turn first-party behavior rollups into editorial / LLM feedback (no auto-edits).
 */
export function behaviorRollupToEngagementHints(rollup: PageBehaviorRollup): EngagementFeedbackHint[] {
  const hints: EngagementFeedbackHint[] = [];
  const { avgMaxScroll, avgActiveMs, sampleCount, scrollHistogram } = rollup;

  if (sampleCount < 8) {
    hints.push({
      path: rollup.path,
      hint: "Low sample size: widen promotion or wait before restructuring.",
      category: "structure",
    });
    return hints;
  }

  if (avgMaxScroll < 0.35) {
    hints.push({
      path: rollup.path,
      hint: "Many users never scroll past ~35% depth: tighten the lede, add a visible outcome in the first screen, and move one proof block above the fold.",
      category: "intro",
    });
  }

  if (avgActiveMs < 12_000 && avgMaxScroll > 0.4) {
    hints.push({
      path: rollup.path,
      hint: "Scroll without long dwell: shorten paragraphs, add one concrete worked example mid-page, and break dense tables into steps.",
      category: "examples",
    });
  }

  const earlyExitMass = scrollHistogram.q0_25 + scrollHistogram.q25_50;
  const lateMass = scrollHistogram.q50_75 + scrollHistogram.q75_1;
  if (earlyExitMass > lateMass * 1.4) {
    hints.push({
      path: rollup.path,
      hint: "Histogram skews early exit: add a mini table of contents, jump links, and a 'why this matters' line before the first H2.",
      category: "structure",
    });
  }

  const domExit = dominantExitSection(rollup);
  if (domExit && (rollup.exitBySection[domExit] ?? 0) >= Math.max(3, sampleCount * 0.25)) {
    hints.push({
      path: rollup.path,
      hint: `Many exits occur near section "${domExit}": strengthen transitions out of that block and place a high-value CTA or summary immediately after.`,
      category: "section_balance",
    });
  }

  if (avgMaxScroll > 0.72 && avgActiveMs > 45_000) {
    hints.push({
      path: rollup.path,
      hint: "Strong scroll + time: candidate for FAQ expansion, comparison satellite page, or programmatic variant pages.",
      category: "depth",
    });
  }

  return hints;
}

export function topEngagementFeedbackHints(
  byPath: Record<string, PageBehaviorRollup>,
  maxPaths = 10,
): EngagementFeedbackHint[] {
  const rollups = Object.values(byPath)
    .filter((r) => r.sampleCount >= 5)
    .sort((a, b) => b.sampleCount - a.sampleCount);
  const out: EngagementFeedbackHint[] = [];
  for (const r of rollups.slice(0, maxPaths)) {
    out.push(...behaviorRollupToEngagementHints(r));
  }
  return out.slice(0, maxPaths * 3);
}
