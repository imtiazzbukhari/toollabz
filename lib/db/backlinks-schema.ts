export const BACKLINKS_SCHEMA_VERSION = 2;

/** Base DDL for fresh installs. Migrations add columns on older DBs. */
export const DDL = `
CREATE TABLE IF NOT EXISTS schema_migrations (
  id INTEGER PRIMARY KEY,
  version INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS prospects (
  id TEXT PRIMARY KEY,
  domain TEXT NOT NULL,
  full_url TEXT NOT NULL,
  dr_estimate INTEGER,
  category TEXT NOT NULL,
  has_write_for_us INTEGER DEFAULT 0,
  has_resources_page INTEGER DEFAULT 0,
  contact_email TEXT,
  page_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  quality_score INTEGER NOT NULL,
  quality_rejection_reason TEXT,
  notes TEXT DEFAULT '',
  page_title TEXT,
  meta_description TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_prospects_category ON prospects(category);
CREATE INDEX IF NOT EXISTS idx_prospects_status ON prospects(status);
CREATE INDEX IF NOT EXISTS idx_prospects_quality ON prospects(quality_score);
CREATE UNIQUE INDEX IF NOT EXISTS idx_prospects_domain_unique ON prospects(domain);

CREATE TABLE IF NOT EXISTS content (
  id TEXT PRIMARY KEY,
  prospect_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  title TEXT,
  subject_line TEXT,
  body TEXT NOT NULL DEFAULT '',
  toollabz_tool_url TEXT,
  anchor_text TEXT,
  word_count INTEGER DEFAULT 0,
  quality_warnings TEXT DEFAULT '[]',
  approved_by_user INTEGER DEFAULT 0,
  meta_description TEXT,
  suggested_tags TEXT,
  extra_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (prospect_id) REFERENCES prospects(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_content_prospect ON content(prospect_id);

CREATE TABLE IF NOT EXISTS outreach_log (
  id TEXT PRIMARY KEY,
  prospect_id TEXT NOT NULL UNIQUE,
  sent_at TEXT,
  follow_up_date TEXT,
  follow_up_sent_at TEXT,
  follow_up_subject TEXT,
  follow_up_body TEXT,
  response_date TEXT,
  response_type TEXT,
  notes TEXT DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (prospect_id) REFERENCES prospects(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_outreach_prospect ON outreach_log(prospect_id);

CREATE TABLE IF NOT EXISTS live_links (
  id TEXT PRIMARY KEY,
  prospect_id TEXT,
  source_url TEXT NOT NULL,
  dr INTEGER,
  type TEXT DEFAULT 'editorial',
  anchor TEXT,
  dofollow INTEGER,
  relevance INTEGER NOT NULL DEFAULT 8,
  date_live TEXT NOT NULL,
  date_lost TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_live_links_date ON live_links(date_live);

CREATE TABLE IF NOT EXISTS activity (
  id TEXT PRIMARY KEY,
  ts TEXT NOT NULL,
  kind TEXT NOT NULL,
  message TEXT NOT NULL,
  prospect_id TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_activity_ts ON activity(ts DESC);
`;
