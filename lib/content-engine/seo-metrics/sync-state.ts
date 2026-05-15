import type { Pool } from "pg";

export const SEO_SYNC_GSC_DAILY = "gsc_daily";
export const SEO_SYNC_GA4_DAILY = "ga4_daily";

export type SeoSyncStateRow = {
  id: string;
  last_success_at: Date | null;
  last_attempt_at: Date | null;
  last_error: string | null;
  detail: Record<string, unknown>;
};

export async function touchSeoSyncAttempt(pool: Pool, id: string): Promise<void> {
  await pool.query(
    `INSERT INTO seo_sync_state (id, last_attempt_at, detail) VALUES ($1, now(), '{}'::jsonb)
     ON CONFLICT (id) DO UPDATE SET last_attempt_at = now()`,
    [id],
  );
}

export async function markSeoSyncSuccess(pool: Pool, id: string, detail: Record<string, unknown>): Promise<void> {
  await pool.query(
    `INSERT INTO seo_sync_state (id, last_success_at, last_attempt_at, last_error, detail)
     VALUES ($1, now(), now(), NULL, $2::jsonb)
     ON CONFLICT (id) DO UPDATE SET
       last_success_at = now(),
       last_attempt_at = now(),
       last_error = NULL,
       detail = $2::jsonb`,
    [id, JSON.stringify(detail)],
  );
}

export async function markSeoSyncFailure(pool: Pool, id: string, err: string, detail: Record<string, unknown>): Promise<void> {
  await pool.query(
    `INSERT INTO seo_sync_state (id, last_attempt_at, last_error, detail)
     VALUES ($1, now(), $2, $3::jsonb)
     ON CONFLICT (id) DO UPDATE SET
       last_attempt_at = now(),
       last_error = EXCLUDED.last_error,
       detail = $3::jsonb`,
    [id, err.slice(0, 4000), JSON.stringify(detail)],
  );
}

export async function loadSeoSyncState(pool: Pool, id: string): Promise<SeoSyncStateRow | null> {
  const r = await pool.query<{
    id: string;
    last_success_at: Date | null;
    last_attempt_at: Date | null;
    last_error: string | null;
    detail: Record<string, unknown> | null;
  }>(`SELECT id, last_success_at, last_attempt_at, last_error, detail FROM seo_sync_state WHERE id = $1`, [id]);
  const row = r.rows[0];
  if (!row) return null;
  return {
    id: row.id,
    last_success_at: row.last_success_at,
    last_attempt_at: row.last_attempt_at,
    last_error: row.last_error,
    detail: row.detail ?? {},
  };
}
