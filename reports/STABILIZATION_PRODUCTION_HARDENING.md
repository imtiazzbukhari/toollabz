# Stabilization & production hardening report

**Date:** 2026-05-15  
**Scope:** Reliability, observability, dashboard trust, TypeScript strictness, security posture, and performance notes for the SEO data plane and growth console. No new AI systems or heavy APM.

---

## Part 1 - TypeScript cleanup (resolved)

| Area | Change |
|------|--------|
| **Growth console dashboard** | `ingestHealth` from the snapshot is JSON-serialized data; nested `rollupWindows`, `gscDaily`, and `ga4Daily` are now read through explicit typed slices (`seoIngestHealthRollup`, `seoIngestHealthGsc`, `seoIngestHealthGa4`) so `npx tsc --noEmit` does not treat nested fields as `{}`. |
| **Hooks / optional browser APIs** | Safer handling for `useSearchParams`, `usePathname`, and related components (login form, header, tools directory, backlinks clients). |
| **`lib/blog/related-posts.ts`** | `flatMap` replaces a map+filter pattern that confused strict narrowing. |
| **`scripts/seo-phase2-reports.ts`** | Regex compatible with configured TS targets (`[\s\S]` instead of dotAll-only `s` flag where applicable). |
| **Tests** | `tests/dashboard-console.test.ts` asserts `pageMetricsProvenance` exists with `sourceLabel` (stable contract for dashboard trust). |

**Verification:** `npx tsc --noEmit` exits 0; `npm run lint` and `npm test` pass on the hardened tree.

**Policy:** Avoid blanket `@ts-ignore` and undocumented `any`; preserve runtime behavior when tightening types.

---

## Part 2 - Ingestion reliability

### GSC daily ingest

- **Retries:** API calls wrapped with bounded retry helper (`lib/content-engine/seo-metrics/ingest-retry.ts`).
- **Partial failure:** Per-day try/catch; run summary exposes `ok` | `partial` | `failed` and `failedDays` where applicable.
- **Writes:** Batched upserts (`ingest-batch.ts`) to reduce round-trips and failure blast radius.
- **Status:** Rows appended to `seo_ingest_log`; sync state rows in `seo_sync_state` (migration `002_seo_sync_state.sql`) updated on attempt/success/failure (`sync-state.ts`).

### GA4 daily ingest

- Same retry and batching patterns; token/config failures still surface clearly after state is recorded.
- Per-day failure handling aligned with GSC so a single bad day does not silently drop the whole run without trace.

### Cron execution

- **Route:** `app/api/cron/seo-daily/route.ts` - **POST only**; **GET returns 405** to avoid prefetch/crawler noise.
- **Auth:** `x-seo-cron-secret` compared with `timingSafeEqual` to `SEO_CRON_SECRET`.
- **GA4 isolation:** Outer GSC run can succeed while GA4 errors are caught, logged (`ingestStructuredLog`), and returned as `ga4Error` with `ga4.status: "failed"` when the ingest throws.

### Stale data & last successful sync

- **`loadSeoIngestHealth`** (`ingest-health.ts`): compares `last_success_at` from `seo_sync_state` against `SEO_INGEST_STALE_HOURS` (default 96h unless overridden).
- Dashboard **Live SEO** block surfaces rollup window labels, stale flags, last success timestamps, and truncated last errors.

---

## Part 3 - Lightweight observability

| Signal | Mechanism |
|--------|-----------|
| **Ingest logs** | `seo_ingest_log` table + `loadRecentSeoIngestEvents` / dashboard “Recent ingest runs”. |
| **Structured process logs** | `ingestStructuredLog` → JSON lines on stdout (grep-friendly in server/cron logs). |
| **API / quota hints** | `isRetryableIngestError` and HTTP code extraction in retry helper; errors persisted on sync state and ingest log. |
| **Cron success/failure** | Cron route logs start/done/errors; JSON response includes GSC/GA4 summaries and `ga4Error` when applicable. |
| **Dashboard health** | `ingestHealth` + `recentIngestRuns` embedded in `SeoDataPlaneSnapshot` (`build-seo-data-plane-snapshot.ts`). |

No third-party APM or tracing SDK was added.

---

## Part 4 - Dashboard trust audit

| Requirement | Implementation |
|-------------|----------------|
| **Real stored data** | Opportunities and GA4↔GSC join load from Postgres-backed modules; empty tables show explicit copy, not fabricated numbers. |
| **Source window** | `pageMetricsProvenance.sourceLabel` and merged performance `source` strings include rollup window text from `rollupWindowLabelsUtc`. |
| **Timestamps** | `pageMetricsProvenance.updatedAt`; ingest panel shows last GSC/GA4 job times from `loadRecentSeoIngestStatus`. |
| **Missing data** | `buildSeoDataPlaneSnapshot` returns empty arrays and `ingestHealth: null` when PG is off or on DB read failure, with optional `dbError`; UI uses “-” and conditional sections. |
| **No fake placeholders** | Metrics that require DB show zeros or empty tables only when the query genuinely returns no rows; provenance distinguishes merged vs file-only paths where applicable. |

---

## Part 5 - Performance review (high level)

- **Batching:** GSC/GA4 daily upserts use chunked batches to limit statement size and memory spikes.
- **Parallel reads:** `buildSeoDataPlaneSnapshot` uses `Promise.all` for independent queries.
- **Join path:** `loadGa4GscJoinLast28d` is wrapped defensively in merge layer where noted in prior work; avoid N+1 by keeping aggregates in SQL or single-query patterns.
- **Hydration:** Dashboard receives snapshot props from server/build paths; dynamic `Record<string, unknown>` slices are narrowed in the client only for display (no silent coercion of numbers).

**Future if load grows:** materialized views for 28d rollups, pagination on large join tables, and Redis-style rate limiting for cron (not implemented here).

---

## Part 6 - Security findings

| Topic | Status / note |
|-------|----------------|
| **Secrets client-side** | Cron secret and DB URLs are server-only env vars; not passed to `SeoGrowthConsoleDashboard` props. |
| **Cron protection** | Timing-safe header check; missing secret → all requests unauthorized. |
| **Dashboard auth** | Existing SEO console cookie/session flows unchanged; keep production secrets long and random. |
| **SQL injection** | Ingest and metrics loaders use parameterized queries via the Postgres client patterns established in `seo-postgres` / ingest modules. |
| **`execSync` usage** | `app/api/seo-console/action/route.ts` (`run_pr_script`) and `execution/route.ts` (`generate_pr`) map user-facing keys to **allowlisted** `npm run content-engine:*` commands only; both routes require `isSeoConsoleAuthenticated`. `pre-deploy-check.mjs` is dev/CI only. |

---

## Part 7 - Data validation (manual / ongoing)

| Check | How |
|-------|-----|
| **GSC totals vs Search Console** | Compare sum of `gsc_page_daily` (or site-level aggregates) for the same property and date range in the UI; expect small differences from timing, data freshness, and API dimension filters. |
| **GA4 path normalization** | Spot-check joined paths against GA4 landing page report for organic channel; confirm trailing slash and casing rules in merge SQL/TS. |
| **Duplicate rows** | Daily upserts should use conflict keys on `(site, date, path, …)` as defined in `001_seo_metrics.sql`; re-run cron should update, not duplicate. |
| **Backfills** | `backfill` query param capped (e.g. 120 days); monitor `seo_ingest_log` for overlapping runs. |
| **Opportunity evidence** | Opportunities attach `evidence.windowCurrent` and metrics JSON from the same DB window as the engine query. |

Automated golden-file tests against live Google APIs are intentionally out of scope (flaky + credential coupling).

---

## Part 8 - Summary tables

### Resolved TypeScript issues (this pass)

1. `SeoGrowthConsoleDashboard.tsx` - nested `ingestHealth` fields typed for strict TS.  
2. `tests/dashboard-console.test.ts` - `pageMetricsProvenance` contract test.

### Ingest reliability (design)

- Retries + structured logging + batched writes + sync state + ingest log + partial-day semantics + cron POST-only + GA4 error containment.

### Dashboard trust

- Provenance object on snapshot; live panel for Postgres, windows, stale detection, and recent runs; opportunities show window column from evidence.

### Security

- Cron timing-safe secret; server-only `execSync`; parameterized SQL; PR scripts remain allowlisted npm targets (not arbitrary shell).

### Remaining technical debt

- Broader dashboard modules still mix heuristic engines with PG-backed SEO; progressively align or label non-DB metrics.  
- Add integration tests with a test Postgres container for ingest idempotency.  
- Optional: admin-only endpoint to expose last `seo_ingest_log` rows without loading full dashboard.

### Recommended scaling limits (order of magnitude)

| Resource | Soft limit | Mitigation |
|----------|------------|------------|
| **Cron duration** | Platform `maxDuration` (e.g. 300s) | Reduce `backfill`, split GSC/GA4 crons, increase batch size cautiously. |
| **Rows per sync** | Very large sites (millions of URLs/day) | Property filters, shard tables, or incremental export. |
| **API quota** | Google Search Console / GA4 daily quotas | Exponential backoff already partially covered; add explicit quota error classification in logs. |
| **DB size** | Long retention of daily rows | Partition by month, archive cold data. |

---

*This document is the Part 8 deliverable for the stabilization phase; keep it updated when ingest schema or auth flows change.*
