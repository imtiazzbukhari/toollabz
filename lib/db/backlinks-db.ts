import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type Database from "better-sqlite3";
import { DDL, BACKLINKS_SCHEMA_VERSION } from "@/lib/db/backlinks-schema";
import { isSeedDomain, type BacklinkCategory } from "@/lib/backlinks/curated-seeds";
import {
  estimateDrFromHost,
  QUALITY_GATES,
  scoreProspect,
  type PageType,
} from "@/lib/backlinks/quality-gates";

export type ProspectStatus =
  | "new"
  | "content_ready"
  | "sent"
  | "approved"
  | "negotiating"
  | "live"
  | "rejected";

export type ProspectRow = {
  id: string;
  domain: string;
  full_url: string;
  dr_estimate: number;
  category: string;
  has_write_for_us: number;
  has_resources_page: number;
  contact_email: string | null;
  page_type: PageType;
  status: string;
  quality_score: number;
  quality_rejection_reason: string | null;
  notes: string;
  page_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
};

export type ContentRow = {
  id: string;
  prospect_id: string;
  content_type: string;
  title: string | null;
  subject_line: string | null;
  body: string;
  toollabz_tool_url: string | null;
  anchor_text: string | null;
  word_count: number;
  quality_warnings: string;
  approved_by_user: number;
  meta_description: string | null;
  suggested_tags: string | null;
  extra_json: string | null;
  created_at: string;
  updated_at: string;
};

export type OutreachLogRow = {
  id: string;
  prospect_id: string;
  sent_at: string | null;
  follow_up_date: string | null;
  follow_up_sent_at: string | null;
  follow_up_subject: string | null;
  follow_up_body: string | null;
  response_date: string | null;
  response_type: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type LiveLinkRow = {
  id: string;
  prospect_id: string | null;
  source_url: string;
  dr: number | null;
  type: string | null;
  anchor: string | null;
  dofollow: number;
  relevance: number | null;
  date_live: string;
  date_lost: string | null;
  created_at: string;
  updated_at: string;
};

export type ActivityEntry = {
  id: string;
  ts: string;
  kind: string;
  message: string;
  prospect_id: string | null;
  created_at: string;
};

let _db: Database.Database | null = null;

function tableColumnNames(db: Database.Database, table: string): Set<string> {
  const rows = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
  return new Set(rows.map((r) => r.name));
}

function addColumnIfMissing(db: Database.Database, table: string, col: string, sqlType: string) {
  if (tableColumnNames(db, table).has(col)) return;
  db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${sqlType}`);
}

function runBacklinksMigrations(db: Database.Database) {
  addColumnIfMissing(db, "outreach_log", "follow_up_sent_at", "TEXT");
  addColumnIfMissing(db, "outreach_log", "follow_up_subject", "TEXT");
  addColumnIfMissing(db, "outreach_log", "follow_up_body", "TEXT");
  addColumnIfMissing(db, "live_links", "updated_at", "TEXT");
  addColumnIfMissing(db, "content", "meta_description", "TEXT");
  addColumnIfMissing(db, "content", "suggested_tags", "TEXT");
  addColumnIfMissing(db, "content", "extra_json", "TEXT");
  const row = db.prepare("SELECT MAX(version) as v FROM schema_migrations").get() as { v: number | null };
  const v = row.v ?? 0;
  if (v < BACKLINKS_SCHEMA_VERSION) {
    db.prepare("INSERT INTO schema_migrations (version) VALUES (?)").run(BACKLINKS_SCHEMA_VERSION);
  }
  try {
    db.exec("UPDATE live_links SET relevance = 8 WHERE relevance IS NULL");
  } catch {
    /* ignore */
  }
}

export function getBacklinksDbPath(): string {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, "backlinks.db");
}

function openDatabase(): Database.Database {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Database = require("better-sqlite3") as typeof import("better-sqlite3");
  const dbPath = getBacklinksDbPath();
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(DDL);
  runBacklinksMigrations(db);
  const row = db.prepare("SELECT MAX(version) as v FROM schema_migrations").get() as { v: number | null };
  if (row.v == null) {
    db.prepare("INSERT INTO schema_migrations (version) VALUES (?)").run(BACKLINKS_SCHEMA_VERSION);
  }
  return db;
}

/** Idempotent: ensures tables exist and migrations applied. Call on server startup. */
export function initDb(): void {
  if (_db) {
    runBacklinksMigrations(_db);
    return;
  }
  const db = openDatabase();
  _db = db;
  seedCuratedProspectsIfNeeded(db);
}

export function getBacklinksDb(): Database.Database {
  if (_db) return _db;
  const db = openDatabase();
  _db = db;
  seedCuratedProspectsIfNeeded(db);
  return db;
}

function nowIso() {
  return new Date().toISOString();
}

function seedCuratedProspectsIfNeeded(db: Database.Database) {
  const count = (db.prepare("SELECT COUNT(*) as c FROM prospects").get() as { c: number }).c;
  if (count >= 20) return;

  const seeds: Array<{ domain: string; category: BacklinkCategory; page_type: PageType; path: string }> = [
    { domain: "nerdwallet.com", category: "finance", page_type: "resource_page", path: "https://www.nerdwallet.com/blog" },
    { domain: "investopedia.com", category: "finance", page_type: "write_for_us", path: "https://www.investopedia.com" },
    { domain: "bankrate.com", category: "finance", page_type: "resource_page", path: "https://www.bankrate.com" },
    { domain: "zapier.com", category: "tools", page_type: "resource_page", path: "https://zapier.com/blog" },
    { domain: "producthunt.com", category: "tools", page_type: "tool_directory", path: "https://www.producthunt.com" },
    { domain: "alternativeto.net", category: "tools", page_type: "tool_directory", path: "https://alternativeto.net" },
    { domain: "capterra.com", category: "tools", page_type: "tool_directory", path: "https://www.capterra.com" },
    { domain: "g2.com", category: "tools", page_type: "tool_directory", path: "https://www.g2.com" },
    { domain: "smallpdf.com", category: "pdf", page_type: "resource_page", path: "https://smallpdf.com/blog" },
    { domain: "adobe.com", category: "pdf", page_type: "resource_page", path: "https://www.adobe.com/acrobat/resources.html" },
    { domain: "aitools.fyi", category: "ai", page_type: "tool_directory", path: "https://aitools.fyi" },
    { domain: "futurepedia.io", category: "ai", page_type: "tool_directory", path: "https://www.futurepedia.io" },
    { domain: "entrepreneur.com", category: "business", page_type: "write_for_us", path: "https://www.entrepreneur.com" },
    { domain: "inc.com", category: "business", page_type: "resource_page", path: "https://www.inc.com" },
    { domain: "sba.gov", category: "business", page_type: "resource_page", path: "https://www.sba.gov" },
    { domain: "biggerpockets.com", category: "real-estate", page_type: "resource_page", path: "https://www.biggerpockets.com" },
    { domain: "moz.com", category: "marketing", page_type: "write_for_us", path: "https://moz.com/blog" },
    { domain: "dev.to", category: "developer", page_type: "resource_page", path: "https://dev.to" },
    { domain: "lifehacker.com", category: "utility", page_type: "resource_page", path: "https://lifehacker.com" },
    { domain: "moneycrashers.com", category: "finance", page_type: "resource_page", path: "https://www.moneycrashers.com" },
  ];

  const insert = db.prepare(`
    INSERT OR IGNORE INTO prospects (
      id, domain, full_url, dr_estimate, category, has_write_for_us, has_resources_page, contact_email,
      page_type, status, quality_score, quality_rejection_reason, notes, page_title, meta_description, created_at, updated_at
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);

  for (const s of seeds) {
    const inSeed = isSeedDomain(s.domain);
    const dr = estimateDrFromHost(s.domain, inSeed);
    const { score, rejectionReason } = scoreProspect({
      domain: s.domain,
      inSeedList: inSeed,
      hasWriteForUs: s.page_type === "write_for_us",
      hasResourcesPage: s.page_type === "resource_page" || s.page_type === "tool_directory",
      contactEmail: null,
      pageHtmlSample: "",
    });
    const status = rejectionReason ? "rejected" : "new";
    insert.run(
      randomUUID(),
      s.domain,
      s.path,
      dr,
      s.category,
      s.page_type === "write_for_us" ? 1 : 0,
      s.page_type === "resource_page" || s.page_type === "tool_directory" ? 1 : 0,
      null,
      s.page_type,
      status,
      score,
      rejectionReason,
      "seed",
      s.domain,
      null,
      nowIso(),
      nowIso(),
    );
  }
}

export type ListProspectFilters = {
  minScore?: number;
  category?: string;
  status?: string;
  pageType?: string;
  includeRejected?: boolean;
};

export function getAllProspects(opts: ListProspectFilters = {}): ProspectRow[] {
  const db = getBacklinksDb();
  let minScore = opts.minScore ?? QUALITY_GATES.minProspectScoreToShow;
  let includeRejected = Boolean(opts.includeRejected);
  if (opts.status === "rejected") {
    includeRejected = true;
    minScore = 0;
  }
  const parts = ["quality_score >= ?", "1=1"];
  const params: unknown[] = [minScore];
  if (!includeRejected) {
    parts.push("status != 'rejected'");
  }
  if (opts.category) {
    parts.push("category = ?");
    params.push(opts.category);
  }
  if (opts.status) {
    parts.push("status = ?");
    params.push(opts.status);
  }
  if (opts.pageType) {
    parts.push("page_type = ?");
    params.push(opts.pageType);
  }
  const sql = `SELECT * FROM prospects WHERE ${parts.join(" AND ")} ORDER BY quality_score DESC, domain ASC`;
  return db.prepare(sql).all(...params) as ProspectRow[];
}

/** @deprecated use getAllProspects */
export const listProspects = getAllProspects;

export function countProspectsByStatus(status: string): number {
  const db = getBacklinksDb();
  const row = db.prepare("SELECT COUNT(*) as c FROM prospects WHERE status = ?").get(status) as { c: number };
  return row.c;
}

export function upsertProspect(
  row: Omit<ProspectRow, "created_at" | "updated_at"> & { created_at?: string; updated_at?: string },
): void {
  const db = getBacklinksDb();
  const ts = nowIso();
  const existing = db.prepare("SELECT id FROM prospects WHERE domain = ?").get(row.domain) as { id: string } | undefined;
  if (existing) {
    db.prepare(
      `UPDATE prospects SET
        full_url=?, dr_estimate=?, category=?, has_write_for_us=?, has_resources_page=?, contact_email=?,
        page_type=?, status=?, quality_score=?, quality_rejection_reason=?, notes=?, page_title=?, meta_description=?, updated_at=?
       WHERE domain=?`,
    ).run(
      row.full_url,
      row.dr_estimate,
      row.category,
      row.has_write_for_us,
      row.has_resources_page,
      row.contact_email,
      row.page_type,
      row.status,
      row.quality_score,
      row.quality_rejection_reason,
      row.notes,
      row.page_title,
      row.meta_description,
      ts,
      row.domain,
    );
    return;
  }
  db.prepare(
    `INSERT INTO prospects (
      id, domain, full_url, dr_estimate, category, has_write_for_us, has_resources_page, contact_email,
      page_type, status, quality_score, quality_rejection_reason, notes, page_title, meta_description, created_at, updated_at
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  ).run(
    row.id,
    row.domain,
    row.full_url,
    row.dr_estimate,
    row.category,
    row.has_write_for_us,
    row.has_resources_page,
    row.contact_email,
    row.page_type,
    row.status,
    row.quality_score,
    row.quality_rejection_reason,
    row.notes,
    row.page_title,
    row.meta_description,
    row.created_at ?? ts,
    row.updated_at ?? ts,
  );
}

export function insertProspect(row: Omit<ProspectRow, "created_at" | "updated_at"> & { created_at?: string; updated_at?: string }) {
  const db = getBacklinksDb();
  const ts = nowIso();
  db.prepare(
    `INSERT INTO prospects (
      id, domain, full_url, dr_estimate, category, has_write_for_us, has_resources_page, contact_email,
      page_type, status, quality_score, quality_rejection_reason, notes, page_title, meta_description, created_at, updated_at
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  ).run(
    row.id,
    row.domain,
    row.full_url,
    row.dr_estimate,
    row.category,
    row.has_write_for_us,
    row.has_resources_page,
    row.contact_email,
    row.page_type,
    row.status,
    row.quality_score,
    row.quality_rejection_reason,
    row.notes,
    row.page_title,
    row.meta_description,
    row.created_at ?? ts,
    row.updated_at ?? ts,
  );
}

export function updateProspect(
  id: string,
  patch: Partial<
    Pick<
      ProspectRow,
      | "status"
      | "notes"
      | "page_title"
      | "meta_description"
      | "contact_email"
      | "has_write_for_us"
      | "has_resources_page"
      | "dr_estimate"
    >
  >,
) {
  const db = getBacklinksDb();
  const keys = Object.keys(patch);
  if (!keys.length) return;
  const sets = keys.map((k) => `${k} = ?`).join(", ");
  const vals = keys.map((k) => (patch as Record<string, unknown>)[k]);
  db.prepare(`UPDATE prospects SET ${sets}, updated_at = ? WHERE id = ?`).run(...vals, nowIso(), id);
}

export function getProspect(id: string): ProspectRow | undefined {
  return getBacklinksDb().prepare("SELECT * FROM prospects WHERE id = ?").get(id) as ProspectRow | undefined;
}

export function upsertContent(
  row: Omit<ContentRow, "created_at" | "updated_at"> & { created_at?: string; updated_at?: string },
): string {
  const db = getBacklinksDb();
  const ts = nowIso();
  const existing = db.prepare("SELECT id FROM content WHERE prospect_id = ?").get(row.prospect_id) as { id: string } | undefined;
  if (existing) {
    db.prepare(
      `UPDATE content SET content_type=?, title=?, subject_line=?, body=?, toollabz_tool_url=?, anchor_text=?, word_count=?, quality_warnings=?, approved_by_user=?, meta_description=?, suggested_tags=?, extra_json=?, updated_at=? WHERE id=?`,
    ).run(
      row.content_type,
      row.title,
      row.subject_line,
      row.body,
      row.toollabz_tool_url,
      row.anchor_text,
      row.word_count,
      row.quality_warnings,
      row.approved_by_user,
      row.meta_description ?? null,
      row.suggested_tags ?? null,
      row.extra_json ?? null,
      ts,
      existing.id,
    );
    return existing.id;
  }
  db.prepare(
    `INSERT INTO content (id, prospect_id, content_type, title, subject_line, body, toollabz_tool_url, anchor_text, word_count, quality_warnings, approved_by_user, meta_description, suggested_tags, extra_json, created_at, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  ).run(
    row.id,
    row.prospect_id,
    row.content_type,
    row.title,
    row.subject_line,
    row.body,
    row.toollabz_tool_url,
    row.anchor_text,
    row.word_count,
    row.quality_warnings,
    row.approved_by_user,
    row.meta_description ?? null,
    row.suggested_tags ?? null,
    row.extra_json ?? null,
    row.created_at ?? ts,
    row.updated_at ?? ts,
  );
  return row.id;
}

export function getContentByProspect(prospectId: string): ContentRow | undefined {
  return getBacklinksDb().prepare("SELECT * FROM content WHERE prospect_id = ? ORDER BY updated_at DESC LIMIT 1").get(prospectId) as
    | ContentRow
    | undefined;
}

export function getOutreachLog(prospectId: string): OutreachLogRow | undefined {
  return getBacklinksDb()
    .prepare("SELECT * FROM outreach_log WHERE prospect_id = ? ORDER BY updated_at DESC LIMIT 1")
    .get(prospectId) as OutreachLogRow | undefined;
}

function mergeOutreachRow(
  existing: OutreachLogRow,
  row: Partial<
    Pick<
      OutreachLogRow,
      | "sent_at"
      | "follow_up_date"
      | "follow_up_sent_at"
      | "follow_up_subject"
      | "follow_up_body"
      | "response_date"
      | "response_type"
      | "notes"
    >
  >,
): OutreachLogRow {
  const patch = Object.fromEntries(Object.entries(row).filter(([, v]) => v !== undefined)) as Partial<OutreachLogRow>;
  return {
    ...existing,
    ...patch,
    id: existing.id,
    prospect_id: existing.prospect_id,
    created_at: existing.created_at,
  };
}

export function upsertOutreachLog(
  row: Partial<Omit<OutreachLogRow, "id" | "created_at" | "updated_at">> & { prospect_id: string; id?: string },
): OutreachLogRow {
  const db = getBacklinksDb();
  const ts = nowIso();
  const existing = getOutreachLog(row.prospect_id);
  if (existing) {
    const patch = mergeOutreachRow(existing, row);
    db.prepare(
      `UPDATE outreach_log SET
        sent_at=?, follow_up_date=?, follow_up_sent_at=?, follow_up_subject=?, follow_up_body=?,
        response_date=?, response_type=?, notes=?, updated_at=?
       WHERE id=?`,
    ).run(
      patch.sent_at,
      patch.follow_up_date,
      patch.follow_up_sent_at,
      patch.follow_up_subject,
      patch.follow_up_body,
      patch.response_date,
      patch.response_type,
      patch.notes,
      ts,
      existing.id,
    );
    return getBacklinksDb().prepare("SELECT * FROM outreach_log WHERE id = ?").get(existing.id) as OutreachLogRow;
  }
  const id = row.id ?? randomUUID();
  db.prepare(
    `INSERT INTO outreach_log (id, prospect_id, sent_at, follow_up_date, follow_up_sent_at, follow_up_subject, follow_up_body, response_date, response_type, notes, created_at, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
  ).run(
    id,
    row.prospect_id,
    row.sent_at ?? null,
    row.follow_up_date ?? null,
    row.follow_up_sent_at ?? null,
    row.follow_up_subject ?? null,
    row.follow_up_body ?? null,
    row.response_date ?? null,
    row.response_type ?? null,
    row.notes ?? "",
    ts,
    ts,
  );
  return getBacklinksDb().prepare("SELECT * FROM outreach_log WHERE id = ?").get(id) as OutreachLogRow;
}

export function getOrCreateOutreachLog(prospectId: string): OutreachLogRow {
  const found = getOutreachLog(prospectId);
  if (found) return found;
  return upsertOutreachLog({ prospect_id: prospectId });
}

export function updateOutreachLog(
  prospectId: string,
  patch: Partial<
    Pick<
      OutreachLogRow,
      | "sent_at"
      | "follow_up_date"
      | "follow_up_sent_at"
      | "follow_up_subject"
      | "follow_up_body"
      | "response_date"
      | "response_type"
      | "notes"
    >
  >,
) {
  const log = getOrCreateOutreachLog(prospectId);
  upsertOutreachLog(mergeOutreachRow(log, patch));
}

export function upsertLiveLink(row: Omit<LiveLinkRow, "created_at" | "updated_at"> & { created_at?: string; updated_at?: string }) {
  const db = getBacklinksDb();
  const ts = nowIso();
  const created = row.created_at ?? ts;
  const updated = row.updated_at ?? ts;
  db.prepare(
    `INSERT INTO live_links (id, prospect_id, source_url, dr, type, anchor, dofollow, relevance, date_live, date_lost, created_at, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
  ).run(
    row.id,
    row.prospect_id,
    row.source_url,
    row.dr,
    row.type,
    row.anchor,
    row.dofollow,
    row.relevance,
    row.date_live,
    row.date_lost,
    created,
    updated,
  );
}

export function insertLiveLink(row: Omit<LiveLinkRow, "created_at" | "updated_at"> & { created_at?: string; updated_at?: string }) {
  upsertLiveLink({
    ...row,
    updated_at: row.updated_at ?? row.created_at ?? nowIso(),
  });
}

export function getLiveLinks(): LiveLinkRow[] {
  return getBacklinksDb().prepare("SELECT * FROM live_links ORDER BY date_live DESC").all() as LiveLinkRow[];
}

export const listLiveLinks = getLiveLinks;

export function liveLinksThisMonthCount(): number {
  const db = getBacklinksDb();
  const start = new Date();
  start.setUTCDate(1);
  start.setUTCHours(0, 0, 0, 0);
  const row = db
    .prepare("SELECT COUNT(*) as c FROM live_links WHERE date_live >= ?")
    .get(start.toISOString().slice(0, 10)) as { c: number };
  return row.c;
}

/** Count live links tied to prospects on this apex domain (www-stripped). */
export function liveLinksForDomain(hostname: string): number {
  const host = hostname.replace(/^www\./i, "").toLowerCase();
  const row = getBacklinksDb()
    .prepare(
      "SELECT COUNT(*) as c FROM live_links ll " +
        "JOIN prospects p ON p.id = ll.prospect_id " +
        "WHERE replace(lower(p.domain), 'www.', '') = ?",
    )
    .get(host) as { c: number };
  return row.c;
}

export function outreachStats(): {
  prospectsThisMonth: number;
  sentThisMonth: number;
  responses: number;
  approved: number;
  liveThisMonth: number;
  contentReady: number;
} {
  const db = getBacklinksDb();
  const start = new Date();
  start.setUTCDate(1);
  start.setUTCHours(0, 0, 0, 0);
  const iso = start.toISOString();

  const prospectsThisMonth = (
    db.prepare("SELECT COUNT(*) as c FROM prospects WHERE created_at >= ?").get(iso) as { c: number }
  ).c;
  const sentThisMonth = (
    db.prepare("SELECT COUNT(*) as c FROM outreach_log WHERE sent_at IS NOT NULL AND sent_at >= ?").get(iso) as { c: number }
  ).c;
  const responses = (
    db.prepare("SELECT COUNT(*) as c FROM outreach_log WHERE response_date IS NOT NULL").get() as { c: number }
  ).c;
  const approved = (
    db.prepare("SELECT COUNT(*) as c FROM outreach_log WHERE response_type = 'approved'").get() as { c: number }
  ).c;
  const liveThisMonth = liveLinksThisMonthCount();
  const contentReady = countProspectsByStatus("content_ready");
  return { prospectsThisMonth, sentThisMonth, responses, approved, liveThisMonth, contentReady };
}

export function deleteProspect(id: string) {
  getBacklinksDb().prepare("DELETE FROM prospects WHERE id = ?").run(id);
}

export type OutreachQueueRow = ProspectRow & {
  subject_line: string | null;
  content_title: string | null;
  content_type: string | null;
  body_preview: string | null;
  sent_at: string | null;
  follow_up_date: string | null;
  response_type: string | null;
};

export function listOutreachQueue(): OutreachQueueRow[] {
  const db = getBacklinksDb();
  return db
    .prepare(
      `SELECT p.*, c.subject_line as subject_line, c.title as content_title, c.content_type as content_type,
        substr(c.body, 1, 240) as body_preview,
        o.sent_at as sent_at, o.follow_up_date as follow_up_date, o.response_type as response_type
       FROM prospects p
       INNER JOIN content c ON c.prospect_id = p.id
       LEFT JOIN outreach_log o ON o.prospect_id = p.id
       WHERE p.quality_score >= ?
         AND p.status IN ('content_ready', 'sent', 'approved', 'negotiating')
       ORDER BY
         CASE p.status WHEN 'content_ready' THEN 0 WHEN 'sent' THEN 1 ELSE 2 END,
         p.quality_score DESC`,
    )
    .all(QUALITY_GATES.minProspectScoreToShow) as OutreachQueueRow[];
}

export function latestOutreachLog(prospectId: string): OutreachLogRow | undefined {
  return getOutreachLog(prospectId);
}

export function addActivity(entry: Omit<ActivityEntry, "created_at"> & { created_at?: string }): void {
  const db = getBacklinksDb();
  const ts = nowIso();
  db.prepare(`INSERT INTO activity (id, ts, kind, message, prospect_id, created_at) VALUES (?,?,?,?,?,?)`).run(
    entry.id,
    entry.ts,
    entry.kind,
    entry.message,
    entry.prospect_id ?? null,
    entry.created_at ?? ts,
  );
}

export function getActivity(limit = 50): ActivityEntry[] {
  const lim = Math.min(500, Math.max(1, limit));
  return getBacklinksDb()
    .prepare(`SELECT * FROM activity ORDER BY ts DESC LIMIT ${lim}`)
    .all() as ActivityEntry[];
}
