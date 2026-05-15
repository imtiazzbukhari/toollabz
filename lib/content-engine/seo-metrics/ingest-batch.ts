import type { Pool } from "pg";

const CHUNK = 200;

export type GscPageDailyRow = {
  siteUrl: string;
  metricDate: string;
  page: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number | null;
};

export type GscQueryPageDailyRow = {
  siteUrl: string;
  metricDate: string;
  query: string;
  page: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number | null;
};

export async function bulkUpsertGscPageDaily(pool: Pool, rows: GscPageDailyRow[]): Promise<void> {
  for (let i = 0; i < rows.length; i += CHUNK) {
    const slice = rows.slice(i, i + CHUNK);
    const placeholders: string[] = [];
    const params: unknown[] = [];
    let p = 1;
    for (const r of slice) {
      placeholders.push(`($${p++},$${p++}::date,$${p++},$${p++},$${p++},$${p++},$${p++})`);
      params.push(r.siteUrl, r.metricDate, r.page, r.impressions, r.clicks, r.ctr, r.position);
    }
    await pool.query(
      `INSERT INTO gsc_page_daily (site_url, metric_date, page, impressions, clicks, ctr, position)
       VALUES ${placeholders.join(",")}
       ON CONFLICT (site_url, metric_date, page) DO UPDATE SET
         impressions = EXCLUDED.impressions,
         clicks = EXCLUDED.clicks,
         ctr = EXCLUDED.ctr,
         position = EXCLUDED.position`,
      params,
    );
  }
}

export async function bulkUpsertGscQueryPageDaily(pool: Pool, rows: GscQueryPageDailyRow[]): Promise<void> {
  for (let i = 0; i < rows.length; i += CHUNK) {
    const slice = rows.slice(i, i + CHUNK);
    const placeholders: string[] = [];
    const params: unknown[] = [];
    let p = 1;
    for (const r of slice) {
      placeholders.push(`($${p++},$${p++}::date,$${p++},$${p++},$${p++},$${p++},$${p++},$${p++})`);
      params.push(r.siteUrl, r.metricDate, r.query, r.page, r.impressions, r.clicks, r.ctr, r.position);
    }
    await pool.query(
      `INSERT INTO gsc_query_page_daily (site_url, metric_date, query, page, impressions, clicks, ctr, position)
       VALUES ${placeholders.join(",")}
       ON CONFLICT (site_url, metric_date, query, page) DO UPDATE SET
         impressions = EXCLUDED.impressions,
         clicks = EXCLUDED.clicks,
         ctr = EXCLUDED.ctr,
         position = EXCLUDED.position`,
      params,
    );
  }
}

export type Ga4LandingDailyRow = {
  propertyId: string;
  metricDate: string;
  landingPath: string;
  sessions: number;
  engagedSessions: number;
  avgSessionDurationSec: number;
};

export async function bulkUpsertGa4LandingDaily(pool: Pool, rows: Ga4LandingDailyRow[]): Promise<void> {
  for (let i = 0; i < rows.length; i += CHUNK) {
    const slice = rows.slice(i, i + CHUNK);
    const placeholders: string[] = [];
    const params: unknown[] = [];
    let p = 1;
    for (const r of slice) {
      placeholders.push(`($${p++},$${p++}::date,$${p++},$${p++},$${p++},$${p++})`);
      params.push(r.propertyId, r.metricDate, r.landingPath, r.sessions, r.engagedSessions, r.avgSessionDurationSec);
    }
    await pool.query(
      `INSERT INTO ga4_landing_daily (property_id, metric_date, landing_path, sessions, engaged_sessions, avg_session_duration_sec)
       VALUES ${placeholders.join(",")}
       ON CONFLICT (property_id, metric_date, landing_path) DO UPDATE SET
         sessions = EXCLUDED.sessions,
         engaged_sessions = EXCLUDED.engaged_sessions,
         avg_session_duration_sec = EXCLUDED.avg_session_duration_sec`,
      params,
    );
  }
}
