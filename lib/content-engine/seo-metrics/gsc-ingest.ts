import type { Pool } from "pg";
import { fetchGoogleServiceAccountAccessToken, GOOGLE_SCOPE_WEBMASTERS } from "@/lib/google/service-account-token";
import { ensureSeoMetricsSchema } from "@/lib/db/seo-postgres";
import { normalizeSearchConsolePath, isoDateUTC, addDaysUtc, defaultGscEndLagDays } from "./gsc-path";
import type { GscRow, GscStore } from "../seo-ranking-engine";
import { writeGscStore } from "../seo-ranking-engine";
import { tools } from "@/lib/tools/data";
import { bulkUpsertGscPageDaily, bulkUpsertGscQueryPageDaily, type GscPageDailyRow, type GscQueryPageDailyRow } from "./ingest-batch";
import { ingestStructuredLog, withIngestRetries } from "./ingest-retry";
import { markSeoSyncFailure, markSeoSyncSuccess, SEO_SYNC_GSC_DAILY, touchSeoSyncAttempt } from "./sync-state";

type GscApiRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

async function gscSearchAnalytics(siteUrl: string, token: string, body: Record<string, unknown>): Promise<GscApiRow[]> {
  return withIngestRetries("gsc.searchAnalytics", async () => {
    const encodedSite = encodeURIComponent(siteUrl);
    const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60_000),
    });
    const text = await res.text().catch(() => "");
    if (!res.ok) {
      throw new Error(`GSC searchAnalytics ${res.status}: ${text.slice(0, 500)}`);
    }
    const json = JSON.parse(text || "{}") as { rows?: GscApiRow[] };
    return json.rows ?? [];
  });
}

async function fetchAllGscRows(siteUrl: string, token: string, base: Record<string, unknown>): Promise<GscApiRow[]> {
  const out: GscApiRow[] = [];
  let startRow = 0;
  const rowLimit = 25000;
  for (;;) {
    const rows = await gscSearchAnalytics(siteUrl, token, { ...base, startRow, rowLimit });
    out.push(...rows);
    if (rows.length < rowLimit) break;
    startRow += rowLimit;
    if (startRow > 200_000) break;
  }
  return out;
}

export async function ingestGscPageDay(pool: Pool, siteUrl: string, token: string, metricDate: string): Promise<number> {
  const rows = await fetchAllGscRows(siteUrl, token, {
    startDate: metricDate,
    endDate: metricDate,
    dimensions: ["page"],
  });
  const batch: GscPageDailyRow[] = [];
  for (const row of rows) {
    const pageUrl = row.keys?.[0]?.trim() ?? "";
    if (!pageUrl) continue;
    const page = normalizeSearchConsolePath(pageUrl);
    const impressions = Math.round(Number(row.impressions ?? 0));
    const clicks = Math.round(Number(row.clicks ?? 0));
    const ctr = row.ctr != null ? Number(row.ctr) : impressions > 0 ? clicks / impressions : 0;
    const position = row.position != null ? Number(row.position) : null;
    batch.push({ siteUrl, metricDate, page, impressions, clicks, ctr, position });
  }
  await bulkUpsertGscPageDaily(pool, batch);
  return batch.length;
}

export async function ingestGscQueryPageDay(pool: Pool, siteUrl: string, token: string, metricDate: string): Promise<number> {
  const rows = await fetchAllGscRows(siteUrl, token, {
    startDate: metricDate,
    endDate: metricDate,
    dimensions: ["query", "page"],
  });
  const batch: GscQueryPageDailyRow[] = [];
  for (const row of rows) {
    const query = row.keys?.[0]?.trim() ?? "";
    const pageUrl = row.keys?.[1]?.trim() ?? "";
    if (!query || !pageUrl) continue;
    const queryKey = query.length > 900 ? query.slice(0, 900) : query;
    const page = normalizeSearchConsolePath(pageUrl);
    const impressions = Math.round(Number(row.impressions ?? 0));
    const clicks = Math.round(Number(row.clicks ?? 0));
    const ctr = row.ctr != null ? Number(row.ctr) : impressions > 0 ? clicks / impressions : 0;
    const position = row.position != null ? Number(row.position) : null;
    batch.push({ siteUrl, metricDate, query: queryKey, page, impressions, clicks, ctr, position });
  }
  await bulkUpsertGscQueryPageDaily(pool, batch);
  return batch.length;
}

export type GscIngestSummary = {
  siteUrl: string;
  days: string[];
  pageRowsWritten: number;
  queryPageRowsWritten: number;
  jsonFallbackSynced: boolean;
  failedDays: string[];
  status: "ok" | "partial" | "failed";
};

/**
 * Ingest GSC daily slices into Postgres (one API pair per calendar day).
 * Optionally backfill multiple days (default: single “latest” day only).
 */
export async function runGscDailyIngest(opts?: { backfillDays?: number }): Promise<GscIngestSummary> {
  const siteUrl = process.env.GSC_SITE_URL?.trim();
  if (!siteUrl) throw new Error("GSC_SITE_URL is not set");

  await ensureSeoMetricsSchema();
  const { getSeoPool } = await import("@/lib/db/seo-postgres");
  const pool = getSeoPool();

  await touchSeoSyncAttempt(pool, SEO_SYNC_GSC_DAILY);

  const token = await fetchGoogleServiceAccountAccessToken(GOOGLE_SCOPE_WEBMASTERS);
  if (!token) {
    const msg = "Google service account token failed (check GOOGLE_SERVICE_ACCOUNT_* env).";
    await markSeoSyncFailure(pool, SEO_SYNC_GSC_DAILY, msg, {});
    throw new Error(msg);
  }

  const lag = defaultGscEndLagDays();
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - lag);
  const backfill = Math.min(120, Math.max(1, Math.floor(opts?.backfillDays ?? 1)));

  const days: string[] = [];
  for (let i = 0; i < backfill; i += 1) {
    const d = new Date(end);
    d.setUTCDate(d.getUTCDate() - i);
    days.push(isoDateUTC(d));
  }

  const logStarted = new Date().toISOString();
  const logId = await pool.query(`INSERT INTO seo_ingest_log (source, started_at, status, detail) VALUES ($1, now(), $2, $3::jsonb) RETURNING id`, [
    "gsc_daily",
    "running",
    JSON.stringify({ days, siteUrl }),
  ]);
  const id = logId.rows[0]?.id as number | undefined;

  let pageRows = 0;
  let qpRows = 0;
  const failedDays: string[] = [];

  for (const day of days) {
    try {
      pageRows += await ingestGscPageDay(pool, siteUrl, token, day);
      qpRows += await ingestGscQueryPageDay(pool, siteUrl, token, day);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      failedDays.push(day);
      ingestStructuredLog({ event: "ingest_day_failed", source: "gsc", day, message: msg.slice(0, 400) });
    }
  }

  const okDays = days.length - failedDays.length;
  let jsonFallbackSynced = false;
  if (okDays > 0 && (pageRows > 0 || qpRows > 0)) {
    await syncGscJsonFallbackFromPostgres(pool, siteUrl, tools.map((t) => t.slug));
    jsonFallbackSynced = true;
  }

  const status: GscIngestSummary["status"] =
    failedDays.length === 0 ? "ok" : failedDays.length === days.length ? "failed" : "partial";

  if (id != null) {
    await pool.query(`UPDATE seo_ingest_log SET finished_at = now(), status = $2, detail = COALESCE(detail, '{}'::jsonb) || $3::jsonb WHERE id = $1`, [
      id,
      status,
      JSON.stringify({
        pageRowsWritten: pageRows,
        queryPageRowsWritten: qpRows,
        finishedAt: new Date().toISOString(),
        started: logStarted,
        failedDays,
      }),
    ]);
  }

  if (status === "failed") {
    const msg = `GSC ingest failed for all days: ${failedDays.join(", ")}`;
    await markSeoSyncFailure(pool, SEO_SYNC_GSC_DAILY, msg, { failedDays, pageRows, qpRows });
    ingestStructuredLog({ event: "ingest_error", source: "gsc", message: msg });
  } else {
    await markSeoSyncSuccess(pool, SEO_SYNC_GSC_DAILY, {
      pageRows,
      qpRows,
      failedDays,
      partial: status === "partial",
      daysInRun: days.length,
    });
    if (status === "partial") {
      ingestStructuredLog({ event: "ingest_ok", source: "gsc", message: `Partial: ${failedDays.length} day(s) failed` });
    } else {
      ingestStructuredLog({ event: "ingest_ok", source: "gsc" });
    }
  }

  return {
    siteUrl,
    days,
    pageRowsWritten: pageRows,
    queryPageRowsWritten: qpRows,
    jsonFallbackSynced,
    failedDays,
    status,
  };
}

/** Refresh gsc-data.json from Postgres so ranking code keeps working without DB reads. */
export async function syncGscJsonFallbackFromPostgres(pool: Pool, siteUrl: string, toolSlugs: string[]): Promise<void> {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - defaultGscEndLagDays());
  const endStr = isoDateUTC(end);
  const startStr = addDaysUtc(endStr, -13);
  const slugSet = new Set(toolSlugs.map((s) => s.toLowerCase()));

  const topQ = await pool.query<{
    page: string;
    query: string;
    impressions: string;
    clicks: string;
    ctr: string;
    position: string;
  }>(
    `SELECT * FROM (
       SELECT page, query,
         SUM(impressions)::text AS impressions,
         SUM(clicks)::text AS clicks,
         (SUM(clicks)::float / NULLIF(SUM(impressions), 0))::text AS ctr,
         (SUM(COALESCE(position, 0) * impressions) / NULLIF(SUM(impressions), 0))::text AS position,
         ROW_NUMBER() OVER (PARTITION BY page ORDER BY SUM(impressions) DESC) AS rn
       FROM gsc_query_page_daily
       WHERE site_url = $1 AND metric_date >= $2::date AND metric_date <= $3::date
       GROUP BY page, query
     ) t WHERE rn = 1`,
    [siteUrl, startStr, endStr],
  );

  const pageAgg = await pool.query<{
    page: string;
    impressions: string;
    clicks: string;
    ctr: string;
    position: string;
  }>(
    `SELECT page,
       SUM(impressions)::text AS impressions,
       SUM(clicks)::text AS clicks,
       (SUM(clicks)::float / NULLIF(SUM(impressions), 0))::text AS ctr,
       (SUM(COALESCE(position, 0) * impressions) / NULLIF(SUM(impressions), 0))::text AS position
     FROM gsc_page_daily
     WHERE site_url = $1 AND metric_date >= $2::date AND metric_date <= $3::date
     GROUP BY page`,
    [siteUrl, startStr, endStr],
  );

  const qByPage = new Map(topQ.rows.map((r) => [r.page, r]));
  const rows: GscRow[] = [];
  for (const r of pageAgg.rows) {
    const m = r.page.match(/^\/tools\/([^/]+)\/?$/i);
    const slug = m?.[1]?.toLowerCase();
    if (!slug || !slugSet.has(slug)) continue;
    const qrow = qByPage.get(r.page);
    const keyword = (qrow?.query ?? slug.replace(/-/g, " ")).toLowerCase();
    rows.push({
      slug,
      keyword,
      impressions: Number(r.impressions),
      clicks: Number(r.clicks),
      ctr: Number(r.ctr),
      position: Number(r.position) || 100,
      ts: new Date().toISOString(),
    });
  }
  const store: GscStore = { updatedAt: new Date().toISOString(), rows };
  writeGscStore(store);
}
