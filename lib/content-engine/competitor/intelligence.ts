import { extractHeadingsFromHtml } from "./extract-headings";
import { fetchPageHtml } from "./fetch-page";
import { compareOurPageVsCompetitors, type CompetitorPageBrief } from "./compare";
import { getOurTemplateHeadingsForPath } from "./our-page-headings";

export type CompetitorIntelligenceReport = ReturnType<typeof compareOurPageVsCompetitors> & {
  contentDepthHint: { competitorAvgHeadings: number; ours: number };
};

export async function runCompetitorIntelligence(input: {
  ourPath: string;
  competitorUrls: readonly string[];
  maxCompetitors?: number;
}): Promise<CompetitorIntelligenceReport> {
  const max = Math.min(5, input.maxCompetitors ?? 3);
  const urls = input.competitorUrls.filter(Boolean).slice(0, max);
  const competitors: CompetitorPageBrief[] = [];

  for (const url of urls) {
    const fetched = await fetchPageHtml(url);
    if (!fetched.ok) {
      competitors.push({ url, headings: [], headingCount: 0, error: fetched.error });
      continue;
    }
    const headings = extractHeadingsFromHtml(fetched.html);
    competitors.push({ url, headings, headingCount: headings.length });
  }

  const ourHeadings = getOurTemplateHeadingsForPath(input.ourPath);
  const base = compareOurPageVsCompetitors(input.ourPath, ourHeadings, competitors);
  const avg =
    competitors.filter((c) => c.headingCount > 0).reduce((a, c) => a + c.headingCount, 0) /
    Math.max(1, competitors.filter((c) => c.headingCount > 0).length);

  return {
    ...base,
    contentDepthHint: {
      competitorAvgHeadings: Math.round(avg * 10) / 10,
      ours: ourHeadings.length,
    },
  };
}
