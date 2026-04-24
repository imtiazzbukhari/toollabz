import type { SerpVariantSuggestion } from "../growth/ctr-suggestions";
import type { BehaviorPrAction } from "../growth/behavior-actions";

export type AutoFixFile = { path: string; filename: string; markdown: string };

function slugFromPath(p: string): string {
  return p.replace(/\/+$/, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 80) || "page";
}

function ctrBlock(path: string, ctr: number, impressions: number, variants: readonly SerpVariantSuggestion[]): string {
  const lines = [
    `# Auto-fix draft: CTR improvements for \`${path}\``,
    "",
    `- Observed CTR: **${(ctr * 100).toFixed(2)}%** · impressions: **${impressions}**`,
    "",
    "## Suggested SERP experiments (pick one; do not auto-publish)",
    "",
  ];
  for (const v of variants) {
    lines.push(`### Variant ${v.variant}`, "", `**Title:** ${v.title}`, "", `**Meta:** ${v.metaDescription}`, "", `*Why:* ${v.rationale}`, "");
  }
  lines.push("## On-page checklist", "", "- [ ] Align H1 + first paragraph with chosen title promise", "- [ ] Add one numeric proof line in the lede", "");
  return lines.join("\n");
}

function behaviorBlock(action: BehaviorPrAction): string {
  return [
    `# Auto-fix draft: behavior-driven changes for \`${action.path}\``,
    "",
    `**${action.title}** (${action.trigger})`,
    "",
    ...action.checklist.map((c) => `- [ ] ${c}`),
    "",
    "_Merge via PR after human review._",
  ].join("\n");
}

/**
 * Markdown files for a single “content improvement” PR (CTR + behavior), never applied to live routes.
 */
export function buildAutoFixPrFiles(input: {
  ctrRows: ReadonlyArray<{ path: string; ctr: number; impressions: number; variants: readonly SerpVariantSuggestion[] }>;
  behaviorActions: readonly BehaviorPrAction[];
  maxCtr?: number;
  maxBehavior?: number;
}): AutoFixFile[] {
  const out: AutoFixFile[] = [];
  const maxC = input.maxCtr ?? 5;
  const maxB = input.maxBehavior ?? 6;

  for (const row of input.ctrRows.slice(0, maxC)) {
    const slug = `ctr-${slugFromPath(row.path)}`;
    out.push({
      path: row.path,
      filename: `${slug}.md`,
      markdown: ctrBlock(row.path, row.ctr, row.impressions, row.variants),
    });
  }

  for (const a of input.behaviorActions.slice(0, maxB)) {
    const slug = `behavior-${slugFromPath(a.path)}-${a.trigger}`;
    out.push({
      path: a.path,
      filename: `${slug}.md`,
      markdown: behaviorBlock(a),
    });
  }

  return out;
}
