import { ensureSeoMetricsSchema, getSeoPool, isSeoPostgresConfigured } from "@/lib/db/seo-postgres";
import { rollupWindowLabelsUtc } from "./gsc-path";
import { loadSeoSyncState, SEO_SYNC_GA4_DAILY, SEO_SYNC_GSC_DAILY } from "./sync-state";

export type SeoIngestHealthSnapshot = {
  staleAfterHours: number;
  rollupWindows: ReturnType<typeof rollupWindowLabelsUtc>;
  ga4Configured: boolean;
  gscDaily: {
    lastSuccessAt: string | null;
    lastAttemptAt: string | null;
    stale: boolean;
    lastError: string | null;
  };
  ga4Daily: {
    lastSuccessAt: string | null;
    lastAttemptAt: string | null;
    stale: boolean;
    lastError: string | null;
  };
};

function staleHours(): number {
  const n = Number(process.env.SEO_INGEST_STALE_HOURS ?? 96);
  return Number.isFinite(n) && n >= 1 && n <= 720 ? Math.floor(n) : 96;
}

function isStale(lastSuccess: Date | null, lastAttempt: Date | null): boolean {
  const ref = lastSuccess ?? lastAttempt;
  if (!ref) return true;
  const ageH = (Date.now() - ref.getTime()) / 3_600_000;
  return ageH > staleHours();
}

export async function loadSeoIngestHealth(): Promise<SeoIngestHealthSnapshot | null> {
  if (!isSeoPostgresConfigured()) return null;
  await ensureSeoMetricsSchema();
  const pool = getSeoPool();
  const [gsc, ga4] = await Promise.all([loadSeoSyncState(pool, SEO_SYNC_GSC_DAILY), loadSeoSyncState(pool, SEO_SYNC_GA4_DAILY)]);
  const rollupWindows = rollupWindowLabelsUtc();
  const sh = staleHours();
  return {
    staleAfterHours: sh,
    rollupWindows,
    ga4Configured: Boolean(process.env.GA4_PROPERTY_ID?.trim()),
    gscDaily: {
      lastSuccessAt: gsc?.last_success_at?.toISOString() ?? null,
      lastAttemptAt: gsc?.last_attempt_at?.toISOString() ?? null,
      stale: isStale(gsc?.last_success_at ?? null, gsc?.last_attempt_at ?? null),
      lastError: gsc?.last_error ?? null,
    },
    ga4Daily: {
      lastSuccessAt: ga4?.last_success_at?.toISOString() ?? null,
      lastAttemptAt: ga4?.last_attempt_at?.toISOString() ?? null,
      stale: process.env.GA4_PROPERTY_ID?.trim()
        ? isStale(ga4?.last_success_at ?? null, ga4?.last_attempt_at ?? null)
        : false,
      lastError: ga4?.last_error ?? null,
    },
  };
}
