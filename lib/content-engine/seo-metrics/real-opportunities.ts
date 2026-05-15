import { ensureSeoMetricsSchema, getSeoPool, isSeoPostgresConfigured } from "@/lib/db/seo-postgres";
import { addDaysUtc, defaultGscEndLagDays, isoDateUTC } from "./gsc-path";

export type SeoOpportunityKind =
  | "high_impressions_low_ctr"
  | "near_page_one"
  | "declining_clicks"
  | "rising_clicks"
  | "cannibalization";

export type SeoOpportunityRow = {
  kind: SeoOpportunityKind;
  title: string;
  path?: string;
  query?: string;
  metrics: Record<string, number | string | null | undefined>;
  evidence: {
    windowCurrent: string;
    windowPrevious?: string;
    sourceTables: string[];
    note?: string;
  };
  suggestedAction: string;
};

function windowLabel(start: string, end: string): string {
  return `${start}…${end}`;
}

export async function computeSeoOpportunitiesFromDb(): Promise<SeoOpportunityRow[]> {
  if (!isSeoPostgresConfigured()) return [];
  const siteUrl = process.env.GSC_SITE_URL?.trim();
  if (!siteUrl) return [];

  await ensureSeoMetricsSchema();
  const pool = getSeoPool();
  const lag = defaultGscEndLagDays();
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - lag);
  const endStr = isoDateUTC(end);
  const curStart = addDaysUtc(endStr, -27);
  const prevEnd = addDaysUtc(endStr, -28);
  const prevStart = addDaysUtc(endStr, -55);
  const wCur = windowLabel(curStart, endStr);
  const wPrev = windowLabel(prevStart, prevEnd);

  const cur = await pool.query<{
    page: string;
    impressions: string;
    clicks: string;
    ctr: string;
    avg_pos: string | null;
  }>(
    `SELECT page,
            SUM(impressions)::bigint AS impressions,
            SUM(clicks)::bigint AS clicks,
            (SUM(clicks)::float / NULLIF(SUM(impressions), 0)) AS ctr,
            (SUM(COALESCE(position, 0) * impressions) / NULLIF(SUM(impressions), 0)) AS avg_pos
     FROM gsc_page_daily
     WHERE site_url = $1 AND metric_date >= $2::date AND metric_date <= $3::date
     GROUP BY page`,
    [siteUrl, curStart, endStr],
  );

  const prev = await pool.query<{
    page: string;
    clicks: string;
  }>(
    `SELECT page, SUM(clicks)::bigint AS clicks
     FROM gsc_page_daily
     WHERE site_url = $1 AND metric_date >= $2::date AND metric_date <= $3::date
     GROUP BY page`,
    [siteUrl, prevStart, prevEnd],
  );
  const prevClicks = new Map(prev.rows.map((r) => [r.page, Number(r.clicks)]));

  const totalImps = cur.rows.reduce((s, r) => s + Number(r.impressions), 0);
  const totalClks = cur.rows.reduce((s, r) => s + Number(r.clicks), 0);
  const siteCtr = totalClks / Math.max(1, totalImps);
  const impressionsList = cur.rows.map((r) => Number(r.impressions)).sort((a, b) => a - b);
  const p75 = impressionsList[Math.floor(impressionsList.length * 0.75)] ?? 0;

  const out: SeoOpportunityRow[] = [];

  for (const r of cur.rows) {
    const imps = Number(r.impressions);
    const clks = Number(r.clicks);
    const ctr = Number(r.ctr);
    const pos = r.avg_pos != null ? Number(r.avg_pos) : null;
    const pClicks = prevClicks.get(r.page) ?? 0;
    const dropRatio = pClicks > 0 ? (pClicks - clks) / pClicks : 0;
    const riseRatio = pClicks > 0 ? (clks - pClicks) / pClicks : clks > 0 ? 1 : 0;

    if (imps >= Math.max(200, p75 * 0.5) && ctr < Math.min(0.02, siteCtr * 0.65) && imps >= 100) {
      out.push({
        kind: "high_impressions_low_ctr",
        title: "High impressions vs low CTR (snippet / intent mismatch)",
        path: r.page,
        metrics: { impressions: imps, clicks: clks, ctr, siteCtr: Number(siteCtr.toFixed(5)) },
        evidence: {
          windowCurrent: wCur,
          windowPrevious: wPrev,
          sourceTables: ["gsc_page_daily"],
          note: `Blended site CTR ≈ ${(siteCtr * 100).toFixed(2)}%`,
        },
        suggestedAction: "Rewrite title and meta description for clearer intent; compare SERP snippet in Search Console.",
      });
    }

    if (pos != null && pos >= 8 && pos <= 20 && imps >= 80) {
      out.push({
        kind: "near_page_one",
        title: "Near page-one (position 8–20 with material impressions)",
        path: r.page,
        metrics: { impressions: imps, avgPosition: pos, clicks: clks },
        evidence: { windowCurrent: wCur, sourceTables: ["gsc_page_daily"] },
        suggestedAction: "Add depth, internal links from hubs, and FAQ blocks targeting the top queries for this URL.",
      });
    }

    if (pClicks >= 10 && dropRatio >= 0.25) {
      out.push({
        kind: "declining_clicks",
        title: "Declining clicks vs prior 28d window",
        path: r.page,
        metrics: { clicksCurrent: clks, clicksPrevious: pClicks, dropPct: Math.round(dropRatio * 100) },
        evidence: { windowCurrent: wCur, windowPrevious: wPrev, sourceTables: ["gsc_page_daily"] },
        suggestedAction: "Check rankings for top queries, refresh content freshness, and review competitors for the query set.",
      });
    }

    if (pClicks >= 10 && riseRatio >= 0.35) {
      out.push({
        kind: "rising_clicks",
        title: "Rising clicks vs prior 28d window",
        path: r.page,
        metrics: { clicksCurrent: clks, clicksPrevious: pClicks, risePct: Math.round(riseRatio * 100) },
        evidence: { windowCurrent: wCur, windowPrevious: wPrev, sourceTables: ["gsc_page_daily"] },
        suggestedAction: "Double down: add supporting articles and internal links while monitoring position stability.",
      });
    }
  }

  const cann = await pool.query<{
    query: string;
    url_count: string;
    total_clicks: string;
    breakdown: string | null;
  }>(
    `WITH qp AS (
       SELECT query, page, SUM(clicks)::bigint AS clicks
       FROM gsc_query_page_daily
       WHERE site_url = $1 AND metric_date >= $2::date AND metric_date <= $3::date
       GROUP BY query, page
     )
     SELECT query,
            COUNT(DISTINCT page)::text AS url_count,
            SUM(clicks)::text AS total_clicks,
            STRING_AGG(page || ':' || clicks::text, ' | ' ORDER BY clicks DESC) AS breakdown
     FROM qp
     GROUP BY query
     HAVING COUNT(DISTINCT page) >= 2 AND SUM(clicks) >= 3
     ORDER BY SUM(clicks) DESC
     LIMIT 25`,
    [siteUrl, curStart, endStr],
  );

  for (const row of cann.rows) {
    out.push({
      kind: "cannibalization",
      title: "Query split across multiple URLs",
      query: row.query,
      metrics: { urls: Number(row.url_count), clicks: Number(row.total_clicks) },
      evidence: {
        windowCurrent: wCur,
        sourceTables: ["gsc_query_page_daily"],
        note: row.breakdown ?? "",
      },
      suggestedAction: "Pick a primary URL, consolidate overlap, and use internal links plus intentional canonicals.",
    });
  }

  const dedupe = new Set<string>();
  return out
    .filter((o) => {
      const key = `${o.kind}:${o.path ?? ""}:${o.query ?? ""}`;
      if (dedupe.has(key)) return false;
      dedupe.add(key);
      return true;
    })
    .sort((a, b) => {
      const pa = Number(a.metrics.impressions ?? a.metrics.clicks ?? a.metrics.urls ?? 0);
      const pb = Number(b.metrics.impressions ?? b.metrics.clicks ?? b.metrics.urls ?? 0);
      return pb - pa;
    })
    .slice(0, 80);
}

export async function loadRecentSeoIngestStatus(): Promise<{
  lastGsc: { at: string; status: string; detail: unknown } | null;
  lastGa4: { at: string; status: string; detail: unknown } | null;
}> {
  if (!isSeoPostgresConfigured()) return { lastGsc: null, lastGa4: null };
  await ensureSeoMetricsSchema();
  const pool = getSeoPool();
  const [g, a] = await Promise.all([
    pool.query(
      `SELECT COALESCE(finished_at, started_at) AS at, status, detail FROM seo_ingest_log WHERE source = 'gsc_daily' ORDER BY id DESC LIMIT 1`,
    ),
    pool.query(
      `SELECT COALESCE(finished_at, started_at) AS at, status, detail FROM seo_ingest_log WHERE source = 'ga4_daily' ORDER BY id DESC LIMIT 1`,
    ),
  ]);
  const gRow = g.rows[0] as { at: string; status: string; detail: unknown } | undefined;
  const aRow = a.rows[0] as { at: string; status: string; detail: unknown } | undefined;
  return {
    lastGsc: gRow?.at ? { at: gRow.at, status: gRow.status, detail: gRow.detail } : null,
    lastGa4: aRow?.at ? { at: aRow.at, status: aRow.status, detail: aRow.detail } : null,
  };
}

export async function loadIndexingHistory(limit = 25): Promise<
  Array<{ page: string; checkedAt: string; verdict: string | null; coverageState: string | null }>
> {
  if (!isSeoPostgresConfigured()) return [];
  const siteUrl = process.env.GSC_SITE_URL?.trim();
  if (!siteUrl) return [];
  await ensureSeoMetricsSchema();
  const pool = getSeoPool();
  const res = await pool.query(
    `SELECT page, checked_at, verdict, coverage_state
     FROM url_indexing_history
     WHERE site_url = $1
     ORDER BY checked_at DESC
     LIMIT $2`,
    [siteUrl, limit],
  );
  return res.rows.map((r: { page: string; checked_at: string; verdict: string | null; coverage_state: string | null }) => ({
    page: r.page,
    checkedAt: r.checked_at,
    verdict: r.verdict,
    coverageState: r.coverage_state,
  }));
}
