import type { PageBehaviorRollup } from "./behavior-types";

/** Structured checklist for a human / PR (never auto-applied). */
export type BehaviorPrAction = {
  path: string;
  trigger: "low_scroll" | "early_exit_histogram" | "high_exit_section" | "scroll_without_dwell";
  title: string;
  checklist: string[];
};

export function rollupToBehaviorPrActions(rollup: PageBehaviorRollup): BehaviorPrAction[] {
  const actions: BehaviorPrAction[] = [];
  const { avgMaxScroll, avgActiveMs, sampleCount, scrollHistogram, exitBySection, path } = rollup;

  if (sampleCount < 8) return actions;

  if (avgMaxScroll < 0.35) {
    actions.push({
      path,
      trigger: "low_scroll",
      title: "Improve above-the-fold engagement",
      checklist: [
        "Rewrite intro in first 120–180 words with one concrete outcome and one number or scenario.",
        "Add a 3–5 bullet Quick summary box immediately under the intro.",
        "Add jump links (TOC) to first H2s so scanners see structure without scrolling blind.",
      ],
    });
  }

  const earlyExitMass = scrollHistogram.q0_25 + scrollHistogram.q25_50;
  const lateMass = scrollHistogram.q50_75 + scrollHistogram.q75_1;
  if (earlyExitMass > lateMass * 1.4) {
    actions.push({
      path,
      trigger: "early_exit_histogram",
      title: "Reduce early abandonment",
      checklist: [
        "Insert a mini table of contents with anchor links after the intro.",
        "Add one proof block (example, mini-table, or checklist) before the first long section.",
        "Shorten paragraphs in the first two screens to under 4 lines each on mobile.",
      ],
    });
  }

  if (avgActiveMs < 12_000 && avgMaxScroll > 0.4) {
    actions.push({
      path,
      trigger: "scroll_without_dwell",
      title: "Increase meaningful dwell mid-page",
      checklist: [
        "Add one worked numeric example with labeled steps mid-page.",
        "Improve transitions between sections (bridge sentence + 'why this matters').",
        "Break dense tables into phased steps or collapsible summary + detail.",
      ],
    });
  }

  let bestSec: string | null = null;
  let bestN = 0;
  for (const [k, v] of Object.entries(exitBySection)) {
    if (k === "_unknown") continue;
    if (v > bestN) {
      bestN = v;
      bestSec = k;
    }
  }
  if (bestSec && bestN >= Math.max(3, sampleCount * 0.25)) {
    actions.push({
      path,
      trigger: "high_exit_section",
      title: `Strengthen flow around “${bestSec}”`,
      checklist: [
        `Add a short recap or “so what” line at the end of the “${bestSec}” block.`,
        "Place one relevant internal link or tool CTA immediately after that section.",
        "Add a concrete example that resolves the question readers likely had entering that section.",
      ],
    });
  }

  return actions;
}

export function buildBehaviorPrActionQueue(
  byPath: Record<string, PageBehaviorRollup>,
  maxPaths = 12,
): BehaviorPrAction[] {
  const rollups = Object.values(byPath)
    .filter((r) => r.sampleCount >= 8)
    .sort((a, b) => b.sampleCount - a.sampleCount);
  const out: BehaviorPrAction[] = [];
  for (const r of rollups.slice(0, maxPaths)) {
    out.push(...rollupToBehaviorPrActions(r));
  }
  return out.slice(0, 36);
}
