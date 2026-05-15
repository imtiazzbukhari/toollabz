-- Minimal SEO data plane (GSC + GA4 + reports + indexing audit trail).
-- Apply with: npx tsx scripts/db-migrate-seo.ts

CREATE TABLE IF NOT EXISTS gsc_page_daily (
  site_url TEXT NOT NULL,
  metric_date DATE NOT NULL,
  page TEXT NOT NULL,
  impressions BIGINT NOT NULL DEFAULT 0,
  clicks BIGINT NOT NULL DEFAULT 0,
  ctr DOUBLE PRECISION,
  position DOUBLE PRECISION,
  PRIMARY KEY (site_url, metric_date, page)
);

CREATE INDEX IF NOT EXISTS idx_gsc_page_daily_site_date ON gsc_page_daily (site_url, metric_date DESC);

CREATE TABLE IF NOT EXISTS gsc_query_page_daily (
  site_url TEXT NOT NULL,
  metric_date DATE NOT NULL,
  query TEXT NOT NULL,
  page TEXT NOT NULL,
  impressions BIGINT NOT NULL DEFAULT 0,
  clicks BIGINT NOT NULL DEFAULT 0,
  ctr DOUBLE PRECISION,
  position DOUBLE PRECISION,
  PRIMARY KEY (site_url, metric_date, query, page)
);

CREATE INDEX IF NOT EXISTS idx_gsc_query_page_query ON gsc_query_page_daily (site_url, metric_date DESC, query);

CREATE TABLE IF NOT EXISTS ga4_landing_daily (
  property_id TEXT NOT NULL,
  metric_date DATE NOT NULL,
  landing_path TEXT NOT NULL,
  sessions DOUBLE PRECISION,
  engaged_sessions DOUBLE PRECISION,
  avg_session_duration_sec DOUBLE PRECISION,
  PRIMARY KEY (property_id, metric_date, landing_path)
);

CREATE INDEX IF NOT EXISTS idx_ga4_landing_date ON ga4_landing_daily (property_id, metric_date DESC);

CREATE TABLE IF NOT EXISTS seo_report_snapshots (
  id BIGSERIAL PRIMARY KEY,
  kind TEXT NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  payload JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_seo_report_kind_time ON seo_report_snapshots (kind, generated_at DESC);

CREATE TABLE IF NOT EXISTS seo_ingest_log (
  id BIGSERIAL PRIMARY KEY,
  source TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  finished_at TIMESTAMPTZ,
  status TEXT NOT NULL,
  detail JSONB
);

CREATE TABLE IF NOT EXISTS url_indexing_history (
  id BIGSERIAL PRIMARY KEY,
  site_url TEXT NOT NULL,
  page TEXT NOT NULL,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  verdict TEXT,
  coverage_state TEXT,
  detail JSONB
);

CREATE INDEX IF NOT EXISTS idx_url_indexing_page ON url_indexing_history (site_url, page, checked_at DESC);
