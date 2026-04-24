import type { ExpansionIdea } from "../funnel/smart-expansion";

export type ScalingBlogPick = {
  topic: string;
  primaryKeyword: string;
  rationale: string;
  parentPath: string;
  kind: ExpansionIdea["kind"];
};

/**
 * First expansion idea whose keyword-derived slug is unlikely to collide with an existing article slug.
 */
export function pickScalingBlogCandidate(
  expansionQueue: ReadonlyArray<{ path: string; ideas: ExpansionIdea[] }>,
  existingBlogSlugs: ReadonlySet<string>,
): ScalingBlogPick | null {
  for (const row of expansionQueue) {
    for (const idea of row.ideas) {
      const hintSlug = idea.primaryKeywordHint
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 72);
      if (hintSlug.length < 6) continue;
      if (existingBlogSlugs.has(hintSlug)) continue;
      return {
        topic: idea.titleHint.slice(0, 220),
        primaryKeyword: idea.primaryKeywordHint,
        rationale: idea.rationale,
        parentPath: row.path,
        kind: idea.kind,
      };
    }
  }
  return null;
}
