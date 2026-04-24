import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { GscPageMetric, PageRevenueMetric, PerformanceAggregates } from "./types";

function isRecord(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === "object" && !Array.isArray(v);
}

function normalizePageRow(row: unknown): GscPageMetric | null {
  if (!isRecord(row)) return null;
  const p = typeof row.path === "string" ? row.path.trim() : "";
  const clicks = Number(row.clicks);
  const impressions = Number(row.impressions);
  if (!p || !Number.isFinite(clicks) || !Number.isFinite(impressions)) return null;
  const position = row.position != null ? Number(row.position) : undefined;
  return {
    path: p.startsWith("/") ? p : `/${p}`,
    clicks,
    impressions,
    position: position != null && Number.isFinite(position) ? position : undefined,
  };
}

function normalizeRevenueRow(row: unknown): PageRevenueMetric | null {
  if (!isRecord(row)) return null;
  const p = typeof row.path === "string" ? row.path.trim() : "";
  const rpm = Number(row.rpm);
  if (!p || !Number.isFinite(rpm)) return null;
  const earnings = row.earnings != null ? Number(row.earnings) : undefined;
  const monetizedImpressions = row.monetizedImpressions != null ? Number(row.monetizedImpressions) : undefined;
  return {
    path: p.startsWith("/") ? p : `/${p}`,
    rpm,
    earnings: earnings != null && Number.isFinite(earnings) ? earnings : undefined,
    monetizedImpressions:
      monetizedImpressions != null && Number.isFinite(monetizedImpressions) ? monetizedImpressions : undefined,
  };
}

function normalizePageRevenueArray(arr: unknown): PageRevenueMetric[] | undefined {
  if (!Array.isArray(arr) || arr.length === 0) return undefined;
  const out: PageRevenueMetric[] = [];
  for (const row of arr) {
    const n = normalizeRevenueRow(row);
    if (n) out.push(n);
  }
  return out.length ? out : undefined;
}

function normalizePagesArray(arr: unknown): GscPageMetric[] {
  if (!Array.isArray(arr)) return [];
  const out: GscPageMetric[] = [];
  for (const row of arr) {
    const n = normalizePageRow(row);
    if (n) out.push(n);
  }
  return out;
}

function parseAggregates(raw: unknown): PerformanceAggregates | null {
  if (!isRecord(raw)) return null;
  const pages = raw.pages;
  if (!Array.isArray(pages)) return null;
  const normalized = normalizePagesArray(pages);
  const prevRaw = raw.pagesPrevious;
  const pagesPrevious = Array.isArray(prevRaw) && prevRaw.length > 0 ? normalizePagesArray(prevRaw) : undefined;

  const updatedAt = typeof raw.updatedAt === "string" ? raw.updatedAt : new Date().toISOString().slice(0, 10);
  const source = typeof raw.source === "string" ? raw.source : undefined;
  const pageRevenue = normalizePageRevenueArray(raw.pageRevenue);
  return { updatedAt, pages: normalized, pagesPrevious, pageRevenue, source };
}

/**
 * Load optional GSC-style aggregates for the feedback loop.
 * Path order: `CONTENT_ENGINE_PERFORMANCE_JSON` → `lib/content-engine/performance/aggregates.json`.
 */
export function loadPerformanceAggregates(): PerformanceAggregates | null {
  const envPath = process.env.CONTENT_ENGINE_PERFORMANCE_JSON?.trim();
  const candidates = [
    envPath,
    path.join(process.cwd(), "lib", "content-engine", "performance", "aggregates.json"),
  ].filter((p): p is string => Boolean(p));

  for (const filePath of candidates) {
    try {
      if (!existsSync(filePath)) continue;
      const parsed = JSON.parse(readFileSync(filePath, "utf8")) as unknown;
      const out = parseAggregates(parsed);
      if (out && out.pages.length > 0) return out;
    } catch {
      /* ignore parse errors — fail safe */
    }
  }
  return null;
}
