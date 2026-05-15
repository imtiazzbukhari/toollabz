/**
 * Merge GSC daily rows in Postgres into the same shape as performance aggregates (JSON fallback when empty).
 */
import type { GscPageMetric, PerformanceAggregates } from "../performance/types";
import { loadPerformanceAggregates } from "../performance/load-aggregates";
import { ensureSeoMetricsSchema, getSeoPool, isSeoPostgresConfigured } from "@/lib/db/seo-postgres";
import { addDaysUtc, defaultGscEndLagDays, isoDateUTC, rollupWindowLabelsUtc } from "./gsc-path";

async function rollupPages(
  siteUrl: string,
  rangeStart: string,
  rangeEnd: string,
): Promise<GscPageMetric[]> {
  const pool = getSeoPool();
  const res = await pool.query<{
    page: string;
    impressions: string;
    clicks: string;
    pos: string | null;
  }>(
    `SELECT page,
            SUM(impressions)::bigint AS impressions,
            SUM(clicks)::bigint AS clicks,
            (SUM(COALESCE(position, 0) * impressions) / NULLIF(SUM(impressions), 0))::float AS pos
     FROM gsc_page_daily
     WHERE site_url = $1 AND metric_date >= $2::date AND metric_date <= $3::date
     GROUP BY page
     HAVING SUM(impressions) > 0`,
    [siteUrl, rangeStart, rangeEnd],
  );
  return res.rows.map((r) => ({
    path: r.page,
    impressions: Number(r.impressions),
    clicks: Number(r.clicks),
    position: r.pos != null && Number.isFinite(Number(r.pos)) ? Number(r.pos) : undefined,
  }));
}

export async function loadPerformanceAggregatesMerged(): Promise<PerformanceAggregates | null> {
  const base = loadPerformanceAggregates();
  if (!isSeoPostgresConfigured()) return base;

  const siteUrl = process.env.GSC_SITE_URL?.trim();
  if (!siteUrl) return base;

  try {
    await ensureSeoMetricsSchema();
    const lag = defaultGscEndLagDays();
    const end = new Date();
    end.setUTCDate(end.getUTCDate() - lag);
    const endStr = isoDateUTC(end);
    const curStart = addDaysUtc(endStr, -27);
    const prevEnd = addDaysUtc(endStr, -28);
    const prevStart = addDaysUtc(endStr, -55);

    const [cur, prev] = await Promise.all([
      rollupPages(siteUrl, curStart, endStr),
      rollupPages(siteUrl, prevStart, prevEnd),
    ]);

    if (cur.length === 0) return base;

    const win = rollupWindowLabelsUtc();
    return {
      updatedAt: new Date().toISOString(),
      pages: cur,
      pagesPrevious: prev.length > 0 ? prev : undefined,
      pageRevenue: base?.pageRevenue,
      source: `postgres:gsc_page_daily [current=${win.current28d}; prev=${win.previous28d}] + ${base?.source ?? "no_json"}`,
    };
  } catch {
    return base;
  }
}

export type Ga4GscJoinRow = {
  path: string;
  gscClicks: number;
  gscImpressions: number;
  ga4OrganicSessions: number;
  ga4EngagedSessions: number;
  engagementRate: number | null;
};

export async function loadGa4GscJoinLast28d(): Promise<Ga4GscJoinRow[]> {
  if (!isSeoPostgresConfigured()) return [];
  const siteUrl = process.env.GSC_SITE_URL?.trim();
  const prop = process.env.GA4_PROPERTY_ID?.trim()?.replace(/^properties\//, "");
  if (!siteUrl || !prop) return [];

  try {
    await ensureSeoMetricsSchema();
    const lag = defaultGscEndLagDays();
    const end = new Date();
    end.setUTCDate(end.getUTCDate() - lag);
    const endStr = isoDateUTC(end);
    const startStr = addDaysUtc(endStr, -27);

    const pool = getSeoPool();
    const res = await pool.query<{
      path: string;
      gsc_clicks: string;
      gsc_impressions: string;
      ga4_sessions: string;
      ga4_engaged: string;
    }>(
      `WITH gsc AS (
       SELECT page AS path,
              SUM(clicks)::bigint AS gsc_clicks,
              SUM(impressions)::bigint AS gsc_impressions
       FROM gsc_page_daily
       WHERE site_url = $1 AND metric_date >= $2::date AND metric_date <= $3::date
       GROUP BY page
     ),
     ga AS (
       SELECT landing_path AS path,
              SUM(sessions)::float AS ga4_sessions,
              SUM(engaged_sessions)::float AS ga4_engaged
       FROM ga4_landing_daily
       WHERE property_id = $4 AND metric_date >= $2::date AND metric_date <= $3::date
       GROUP BY landing_path
     )
     SELECT COALESCE(gsc.path, ga.path) AS path,
            COALESCE(gsc.gsc_clicks, 0)::text AS gsc_clicks,
            COALESCE(gsc.gsc_impressions, 0)::text AS gsc_impressions,
            COALESCE(ga.ga4_sessions, 0)::text AS ga4_sessions,
            COALESCE(ga.ga4_engaged, 0)::text AS ga4_engaged
     FROM gsc
     FULL OUTER JOIN ga ON ga.path = gsc.path
     WHERE COALESCE(gsc.gsc_clicks, 0) > 0 OR COALESCE(ga.ga4_sessions, 0) > 0
     ORDER BY COALESCE(gsc.gsc_impressions, 0) DESC
     LIMIT 60`,
      [siteUrl, startStr, endStr, prop],
    );

    return res.rows.map((r) => {
      const ga4OrganicSessions = Number(r.ga4_sessions);
      const ga4EngagedSessions = Number(r.ga4_engaged);
      const engagementRate =
        ga4OrganicSessions > 0 ? Number((ga4EngagedSessions / ga4OrganicSessions).toFixed(4)) : null;
      return {
        path: r.path,
        gscClicks: Number(r.gsc_clicks),
        gscImpressions: Number(r.gsc_impressions),
        ga4OrganicSessions,
        ga4EngagedSessions,
        engagementRate,
      };
    });
  } catch {
    return [];
  }
}
