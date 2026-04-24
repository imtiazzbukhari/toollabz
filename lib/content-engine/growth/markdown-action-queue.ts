import type { BehaviorPrAction } from "./behavior-actions";
import type { SerpVariantSuggestion } from "./ctr-suggestions";

export function formatCtrPrBlock(path: string, ctr: number, variants: readonly SerpVariantSuggestion[]): string {
  const lines = [
    `### CTR experiment queue: \`${path}\``,
    "",
    `- Current SERP CTR (from GSC snapshot): **${(ctr * 100).toFixed(2)}%**`,
    "- **Do not auto-apply.** Pick one variant, validate in Search Console / CMS, then ship.",
    "",
  ];
  for (const v of variants) {
    lines.push(`#### Variant ${v.variant}`, "", `**Title:** ${v.title}`, "", `**Meta:** ${v.metaDescription}`, "", `*Rationale:* ${v.rationale}`, "");
  }
  return lines.join("\n");
}

export function formatBehaviorPrBlock(action: BehaviorPrAction): string {
  const lines = [
    `### Behavior-driven PR: \`${action.path}\` (${action.trigger})`,
    "",
    `**${action.title}**`,
    "",
    ...action.checklist.map((c) => `- [ ] ${c}`),
    "",
  ];
  return lines.join("\n");
}

export function buildGrowthActionQueueDocument(input: {
  generatedAt: string;
  behaviorActions: readonly BehaviorPrAction[];
  ctrBlocks: ReadonlyArray<{ path: string; ctr: number; variants: readonly SerpVariantSuggestion[] }>;
  programmaticHeadline?: string;
}): string {
  const parts = [
    "# Growth action queue (automated draft)",
    "",
    `_Generated: ${input.generatedAt}. These are **suggestions only** — merge via normal PR review._`,
    "",
    "## 1. Behavior → content PR checklist",
    "",
  ];
  if (input.behaviorActions.length === 0) {
    parts.push("_No behavior rollups met thresholds (need `behavior-aggregates.json` + samples)._", "");
  } else {
    for (const a of input.behaviorActions) parts.push(formatBehaviorPrBlock(a), "");
  }

  parts.push("## 2. CTR → SERP experiments (A/B/C)", "");
  if (input.ctrBlocks.length === 0) {
    parts.push("_No URLs in the CTR optimization window._", "");
  } else {
    for (const c of input.ctrBlocks) parts.push(formatCtrPrBlock(c.path, c.ctr, c.variants), "");
  }

  parts.push("## 3. Programmatic / scaling", "", input.programmaticHeadline ?? "_Run `npm run content-engine:programmatic-pr` or `content-engine:scaling-pr` after reviewing cron `growthLoop`._", "", "---", "", "## Next automation", "", "- `npm run content-engine:growth-pr` — opens PR with this file.", "");
  return parts.join("\n");
}
