export type QualityScoreRow = {
  slug: string;
  contentQuality: number;
  seoStrength: number;
  conversionPotential: number;
  overall: number;
  lowQuality: boolean;
  reason: string;
};

const DEFAULT_THRESHOLD = 62;

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

export function computeQualityScores(input: {
  rankingRows: Array<{ slug: string; position: number; trend?: "up" | "down" | "stagnant"; impressions?: number; clicks?: number }>;
  ctaRows: Array<{ slug: string; ctr: number; conversionRate: number }>;
  revenueRows: Array<{ slug: string; estimatedRevenue: number }>;
  behaviorRows: Array<{ slug: string; scrollDepth: number; timeOnPage: number; pageViews: number }>;
  threshold?: number;
}): { rows: QualityScoreRow[]; threshold: number; lowQualitySlugs: string[] } {
  const threshold = input.threshold ?? DEFAULT_THRESHOLD;
  const ctaMap = new Map(input.ctaRows.map((x) => [x.slug, x]));
  const revMap = new Map<string, number>();
  for (const r of input.revenueRows) revMap.set(r.slug, (revMap.get(r.slug) ?? 0) + r.estimatedRevenue);
  const behBySlug = new Map<string, { scrollDepth: number; timeOnPage: number; pageViews: number; count: number }>();
  for (const row of input.behaviorRows) {
    const prev = behBySlug.get(row.slug) ?? { scrollDepth: 0, timeOnPage: 0, pageViews: 0, count: 0 };
    behBySlug.set(row.slug, {
      scrollDepth: prev.scrollDepth + row.scrollDepth,
      timeOnPage: prev.timeOnPage + row.timeOnPage,
      pageViews: prev.pageViews + row.pageViews,
      count: prev.count + 1,
    });
  }

  const rows: QualityScoreRow[] = input.rankingRows.map((row) => {
    const cta = ctaMap.get(row.slug);
    const rev = revMap.get(row.slug) ?? 0;
    const b = behBySlug.get(row.slug);
    const avgScroll = b && b.count > 0 ? b.scrollDepth / b.count : 45;
    const avgTime = b && b.count > 0 ? b.timeOnPage / b.count : 60;
    const contentQuality = clamp(avgScroll * 0.55 + Math.min(45, avgTime / 4));
    const seoStrength = clamp((100 - row.position) * 0.7 + ((row.impressions ?? 0) > 120 ? 18 : 8) + (row.trend === "up" ? 8 : row.trend === "down" ? -8 : 0));
    const conversionPotential = clamp((cta?.ctr ?? 0) * 2.4 + (cta?.conversionRate ?? 0) * 3 + Math.min(35, rev / 3));
    const overall = Number((contentQuality * 0.38 + seoStrength * 0.37 + conversionPotential * 0.25).toFixed(2));
    const lowQuality = overall < threshold;
    const reason = lowQuality ? "low composite quality score" : "healthy score";
    return { slug: row.slug, contentQuality, seoStrength, conversionPotential, overall, lowQuality, reason };
  });

  const lowQualitySlugs = rows.filter((x) => x.lowQuality).map((x) => x.slug);
  return { rows: rows.sort((a, b) => b.overall - a.overall), threshold, lowQualitySlugs };
}

export function detectTopNiche(input: {
  winners: Array<{ slug: string; score: number }>;
  revenueRows: Array<{ slug: string; estimatedRevenue: number }>;
}): { niche: string; confidence: number } {
  const nicheScore = new Map<string, number>();
  const scoreBySlug = new Map(input.winners.map((w) => [w.slug, w.score]));
  for (const r of input.revenueRows) {
    const niche = r.slug.split("-")[0] || "general";
    const winnerBoost = (scoreBySlug.get(r.slug) ?? 0) * 0.4;
    nicheScore.set(niche, (nicheScore.get(niche) ?? 0) + r.estimatedRevenue + winnerBoost);
  }
  const top = [...nicheScore.entries()].sort((a, b) => b[1] - a[1])[0];
  if (!top) return { niche: "general", confidence: 0 };
  const total = [...nicheScore.values()].reduce((a, b) => a + b, 0) || 1;
  return { niche: top[0], confidence: Number(((top[1] / total) * 100).toFixed(2)) };
}

