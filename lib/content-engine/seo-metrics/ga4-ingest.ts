import type { Pool } from "pg";
import {
  fetchGoogleServiceAccountAccessToken,
  googleScopesWebmastersAndAnalytics,
} from "@/lib/google/service-account-token";
import { ensureSeoMetricsSchema } from "@/lib/db/seo-postgres";
import { normalizeSearchConsolePath, isoDateUTC, defaultGscEndLagDays } from "./gsc-path";
import { bulkUpsertGa4LandingDaily, type Ga4LandingDailyRow } from "./ingest-batch";
import { ingestStructuredLog, withIngestRetries } from "./ingest-retry";
import { markSeoSyncFailure, markSeoSyncSuccess, SEO_SYNC_GA4_DAILY, touchSeoSyncAttempt } from "./sync-state";

function ga4PropertyResource(): string | null {
  const raw = process.env.GA4_PROPERTY_ID?.trim();
  if (!raw) return null;
  if (raw.startsWith("properties/")) return raw;
  return `properties/${raw}`;
}

type Ga4Row = {
  dimensionValues?: Array<{ value?: string }>;
  metricValues?: Array<{ value?: string }>;
};

async function runGa4Report(propertyResource: string, token: string, body: Record<string, unknown>): Promise<Ga4Row[]> {
  return withIngestRetries("ga4.runReport", async () => {
    const url = `https://analyticsdata.googleapis.com/v1beta/${propertyResource}:runReport`;
    const res = await fetch(url, {
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
      throw new Error(`GA4 runReport ${res.status}: ${text.slice(0, 600)}`);
    }
    const json = JSON.parse(text || "{}") as { rows?: Ga4Row[] };
    return json.rows ?? [];
  });
}

async function fetchAllGa4Rows(propertyResource: string, token: string, base: Record<string, unknown>): Promise<Ga4Row[]> {
  const out: Ga4Row[] = [];
  let offset = 0;
  const limit = 10000;
  for (;;) {
    const rows = await runGa4Report(propertyResource, token, { ...base, limit, offset });
    out.push(...rows);
    if (rows.length < limit) break;
    offset += limit;
    if (offset > 100_000) break;
  }
  return out;
}

export async function ingestGa4LandingDay(pool: Pool, propertyId: string, propertyResource: string, token: string, metricDate: string): Promise<number> {
  const baseBody: Record<string, unknown> = {
    dateRanges: [{ startDate: metricDate, endDate: metricDate }],
    dimensions: [{ name: "landingPagePlusQueryString" }],
    metrics: [{ name: "sessions" }, { name: "engagedSessions" }, { name: "averageSessionDuration" }],
  };
  if (process.env.GA4_SKIP_ORGANIC_FILTER !== "1") {
    baseBody.dimensionFilter = {
      filter: {
        fieldName: "sessionMedium",
        stringFilter: { matchType: "EXACT", value: "organic" },
      },
    };
  }
  const rows = await fetchAllGa4Rows(propertyResource, token, baseBody);

  const batch: Ga4LandingDailyRow[] = [];
  for (const row of rows) {
    const landing = row.dimensionValues?.[0]?.value?.trim() ?? "";
    if (!landing) continue;
    const landing_path = normalizeSearchConsolePath(landing);
    const sessions = Number(row.metricValues?.[0]?.value ?? 0);
    const engaged = Number(row.metricValues?.[1]?.value ?? 0);
    const avgDur = Number(row.metricValues?.[2]?.value ?? 0);
    batch.push({
      propertyId,
      metricDate,
      landingPath: landing_path,
      sessions,
      engagedSessions: engaged,
      avgSessionDurationSec: avgDur,
    });
  }
  await bulkUpsertGa4LandingDaily(pool, batch);
  return batch.length;
}

export type Ga4IngestSummary = {
  days: string[];
  rows: number;
  failedDays: string[];
  status: "ok" | "partial" | "failed";
};

export async function runGa4DailyIngest(opts?: { backfillDays?: number }): Promise<Ga4IngestSummary> {
  const propertyResource = ga4PropertyResource();
  if (!propertyResource) return { days: [], rows: 0, failedDays: [], status: "ok" };

  await ensureSeoMetricsSchema();
  const { getSeoPool } = await import("@/lib/db/seo-postgres");
  const pool = getSeoPool();
  const propertyId = propertyResource.replace(/^properties\//, "");

  await touchSeoSyncAttempt(pool, SEO_SYNC_GA4_DAILY);

  const token = await fetchGoogleServiceAccountAccessToken(googleScopesWebmastersAndAnalytics());
  if (!token) {
    const msg = "GA4 token failed - extend service account scopes and grant Analytics Viewer on the property.";
    await markSeoSyncFailure(pool, SEO_SYNC_GA4_DAILY, msg, {});
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

  const logId = await pool.query(`INSERT INTO seo_ingest_log (source, started_at, status, detail) VALUES ($1, now(), $2, $3::jsonb) RETURNING id`, [
    "ga4_daily",
    "running",
    JSON.stringify({ days, propertyId }),
  ]);
  const id = logId.rows[0]?.id as number | undefined;

  let rows = 0;
  const failedDays: string[] = [];
  for (const day of days) {
    try {
      rows += await ingestGa4LandingDay(pool, propertyId, propertyResource, token, day);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      failedDays.push(day);
      ingestStructuredLog({ event: "ingest_day_failed", source: "ga4", day, message: msg.slice(0, 400) });
    }
  }

  const status: Ga4IngestSummary["status"] =
    failedDays.length === 0 ? "ok" : failedDays.length === days.length ? "failed" : "partial";

  if (id != null) {
    await pool.query(`UPDATE seo_ingest_log SET finished_at = now(), status = $2, detail = COALESCE(detail, '{}'::jsonb) || $3::jsonb WHERE id = $1`, [
      id,
      status,
      JSON.stringify({ rowsWritten: rows, failedDays, finishedAt: new Date().toISOString() }),
    ]);
  }

  if (status === "failed") {
    const msg = `GA4 ingest failed for all days: ${failedDays.join(", ")}`;
    await markSeoSyncFailure(pool, SEO_SYNC_GA4_DAILY, msg, { failedDays, rows });
  } else {
    await markSeoSyncSuccess(pool, SEO_SYNC_GA4_DAILY, { rows, failedDays, partial: status === "partial", daysInRun: days.length });
  }

  return { days, rows, failedDays, status };
}
