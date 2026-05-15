import { ensureSeoMetricsSchema, getSeoPool, isSeoPostgresConfigured } from "@/lib/db/seo-postgres";

export type SeoIngestLogRow = {
  id: number;
  source: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  detail: unknown;
};

export async function loadRecentSeoIngestEvents(limit = 12): Promise<SeoIngestLogRow[]> {
  if (!isSeoPostgresConfigured()) return [];
  await ensureSeoMetricsSchema();
  const pool = getSeoPool();
  const r = await pool.query<{
    id: number;
    source: string;
    status: string;
    started_at: Date;
    finished_at: Date | null;
    detail: unknown;
  }>(`SELECT id, source, status, started_at, finished_at, detail FROM seo_ingest_log ORDER BY id DESC LIMIT $1`, [limit]);
  return r.rows.map((row) => ({
    id: row.id,
    source: row.source,
    status: row.status,
    startedAt: row.started_at.toISOString(),
    finishedAt: row.finished_at?.toISOString() ?? null,
    detail: row.detail,
  }));
}
