-- Last successful / attempted sync markers for cron + dashboard health.
CREATE TABLE IF NOT EXISTS seo_sync_state (
  id TEXT PRIMARY KEY,
  last_success_at TIMESTAMPTZ,
  last_attempt_at TIMESTAMPTZ,
  last_error TEXT,
  detail JSONB NOT NULL DEFAULT '{}'::jsonb
);
