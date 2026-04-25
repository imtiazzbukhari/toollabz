import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const behaviorPath = path.join(root, "lib", "content-engine", "behavior.json");

export type BehaviorRow = {
  slug: string;
  pageViews: number;
  scrollDepth: number;
  clicks: number;
  timeOnPage: number;
  ts: string;
};

type BehaviorStore = { rows: BehaviorRow[] };

function safeReadJson<T>(filePath: string, fallback: T): T {
  try {
    if (!existsSync(filePath)) return fallback;
    return JSON.parse(readFileSync(filePath, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson(filePath: string, data: unknown): void {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function readStore(): BehaviorStore {
  const parsed = safeReadJson<Partial<BehaviorStore>>(behaviorPath, {});
  return { rows: Array.isArray(parsed.rows) ? parsed.rows : [] };
}

function writeStore(store: BehaviorStore): void {
  writeJson(behaviorPath, { rows: store.rows.slice(0, 1500) });
}

export function trackBehavior(row: Omit<BehaviorRow, "ts"> & { ts?: string }): BehaviorRow {
  const normalized: BehaviorRow = {
    slug: row.slug,
    pageViews: Math.max(0, Math.round(row.pageViews)),
    scrollDepth: Math.max(0, Math.min(100, Math.round(row.scrollDepth))),
    clicks: Math.max(0, Math.round(row.clicks)),
    timeOnPage: Math.max(0, Math.round(row.timeOnPage)),
    ts: row.ts ?? new Date().toISOString(),
  };
  const prev = readStore();
  writeStore({ rows: [normalized, ...prev.rows] });
  return normalized;
}

export function readBehavior(limit = 200): BehaviorRow[] {
  return readStore().rows.slice(0, limit);
}

export function summarizeBehavior(limit = 300): {
  avgScrollDepth: number;
  avgTimeOnPage: number;
  totalPageViews: number;
  totalClicks: number;
} {
  const rows = readBehavior(limit);
  if (!rows.length) return { avgScrollDepth: 0, avgTimeOnPage: 0, totalPageViews: 0, totalClicks: 0 };
  const totals = rows.reduce(
    (acc, row) => {
      acc.scroll += row.scrollDepth;
      acc.time += row.timeOnPage;
      acc.views += row.pageViews;
      acc.clicks += row.clicks;
      return acc;
    },
    { scroll: 0, time: 0, views: 0, clicks: 0 },
  );
  return {
    avgScrollDepth: Number((totals.scroll / rows.length).toFixed(2)),
    avgTimeOnPage: Number((totals.time / rows.length).toFixed(2)),
    totalPageViews: totals.views,
    totalClicks: totals.clicks,
  };
}

