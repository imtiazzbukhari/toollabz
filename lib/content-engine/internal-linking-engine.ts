type LinkCandidate = { slug: string; keyword: string };

function tokenize(input: string): Set<string> {
  return new Set(
    input
      .toLowerCase()
      .split(/[^a-z0-9]+/g)
      .map((x) => x.trim())
      .filter((x) => x.length > 2),
  );
}

function overlapScore(a: Set<string>, b: Set<string>): number {
  let score = 0;
  for (const token of a) {
    if (b.has(token)) score += 1;
  }
  return score;
}

export type InternalLinkSuggestion = {
  sourceSlug: string;
  targetSlug: string;
  anchorText: string;
  url: string;
  score: number;
};

export function suggestInternalLinks(
  source: LinkCandidate,
  corpus: LinkCandidate[],
  limit = 3,
): InternalLinkSuggestion[] {
  const sourceTokens = tokenize(`${source.slug} ${source.keyword}`);
  const suggestions = corpus
    .filter((x) => x.slug !== source.slug)
    .map((x) => {
      const score = overlapScore(sourceTokens, tokenize(`${x.slug} ${x.keyword}`));
      return {
        sourceSlug: source.slug,
        targetSlug: x.slug,
        anchorText: x.keyword.trim() || x.slug.replace(/-/g, " "),
        url: `/tools/${x.slug}`,
        score,
      };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  return suggestions;
}

export function buildInternalLinkPatchMarkdown(suggestions: InternalLinkSuggestion[]): string {
  if (!suggestions.length) return "";
  const lines = suggestions.map((s) => `- [${s.anchorText}](${s.url})`);
  return `Recommended related tools:\n${lines.join("\n")}`;
}

