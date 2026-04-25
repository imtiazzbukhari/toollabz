import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const filePath = path.join(root, "lib", "content-engine", "revenue-live.json");

export type RevenueLiveRow = {
  slug: string;
  affiliateClicks: number;
  conversions: number;
  estimatedRevenue: number;
  ts: string;
};

type RevenueLiveStore = { rows: RevenueLiveRow[] };

function safeReadJson<T>(p: string, fallback: T): T {
  try {
    if (!existsSync(p)) return fallback;
    return JSON.parse(readFileSync(p, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson(p: string, data: unknown): void {
  mkdirSync(path.dirname(p), { recursive: true });
  writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function readStore(): RevenueLiveStore {
  const parsed = safeReadJson<Partial<RevenueLiveStore>>(filePath, {});
  return { rows: Array.isArray(parsed.rows) ? parsed.rows : [] };
}

function writeStore(store: RevenueLiveStore): void {
  writeJson(filePath, { rows: store.rows.slice(0, 2000) });
}

export function recordRevenueLive(input: Omit<RevenueLiveRow, "ts"> & { ts?: string }): RevenueLiveRow {
  const row: RevenueLiveRow = {
    slug: input.slug,
    affiliateClicks: Math.max(0, Math.round(input.affiliateClicks)),
    conversions: Math.max(0, Math.round(input.conversions)),
    estimatedRevenue: Number(Math.max(0, input.estimatedRevenue).toFixed(2)),
    ts: input.ts ?? new Date().toISOString(),
  };
  const prev = readStore();
  writeStore({ rows: [row, ...prev.rows] });
  return row;
}

export function readRevenueLive(limit = 500): RevenueLiveRow[] {
  return readStore().rows.slice(0, limit);
}

export function summarizeRevenueLive(limit = 500): {
  totalRevenue: number;
  totalAffiliateClicks: number;
  totalConversions: number;
  topEarningPages: Array<{ slug: string; revenue: number; affiliateClicks: number; conversions: number }>;
} {
  const rows = readRevenueLive(limit);
  const bySlug = new Map<string, { revenue: number; affiliateClicks: number; conversions: number }>();
  let totalRevenue = 0;
  let totalAffiliateClicks = 0;
  let totalConversions = 0;
  for (const row of rows) {
    totalRevenue += row.estimatedRevenue;
    totalAffiliateClicks += row.affiliateClicks;
    totalConversions += row.conversions;
    const prev = bySlug.get(row.slug) ?? { revenue: 0, affiliateClicks: 0, conversions: 0 };
    bySlug.set(row.slug, {
      revenue: Number((prev.revenue + row.estimatedRevenue).toFixed(2)),
      affiliateClicks: prev.affiliateClicks + row.affiliateClicks,
      conversions: prev.conversions + row.conversions,
    });
  }
  const topEarningPages = [...bySlug.entries()]
    .map(([slug, x]) => ({ slug, revenue: x.revenue, affiliateClicks: x.affiliateClicks, conversions: x.conversions }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 20);
  return {
    totalRevenue: Number(totalRevenue.toFixed(2)),
    totalAffiliateClicks,
    totalConversions,
    topEarningPages,
  };
}

export function detectWinnerPages(input: {
  rankingRows: Array<{ slug: string; position: number; clicks?: number; impressions?: number }>;
  ctaPerformance: Array<{ slug: string; ctr: number; conversionRate: number }>;
  revenueRows: Array<{ slug: string; estimatedRevenue: number }>;
}): Array<{ slug: string; score: number; reason: string }> {
  const ctaMap = new Map(input.ctaPerformance.map((x) => [x.slug, x]));
  const revenueBySlug = new Map<string, number>();
  for (const r of input.revenueRows) revenueBySlug.set(r.slug, (revenueBySlug.get(r.slug) ?? 0) + r.estimatedRevenue);

  const winners: Array<{ slug: string; score: number; reason: string }> = [];
  for (const row of input.rankingRows) {
    const cta = ctaMap.get(row.slug);
    const rev = revenueBySlug.get(row.slug) ?? 0;
    const trafficScore = Math.min(40, Math.max(0, (row.clicks ?? 0) / 2));
    const rankingScore = Math.max(0, 25 - row.position);
    const ctaScore = Math.min(20, (cta?.ctr ?? 0) / 2 + (cta?.conversionRate ?? 0));
    const revenueScore = Math.min(30, rev / 5);
    const score = Number((trafficScore + rankingScore + ctaScore + revenueScore).toFixed(2));
    if (score < 30) continue;
    winners.push({
      slug: row.slug,
      score,
      reason: `traffic=${trafficScore.toFixed(1)} cta=${ctaScore.toFixed(1)} revenue=${revenueScore.toFixed(1)}`,
    });
  }
  return winners.sort((a, b) => b.score - a.score).slice(0, 10);
}

