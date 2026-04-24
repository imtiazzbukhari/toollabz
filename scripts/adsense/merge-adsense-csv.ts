/**
 * Merge AdSense (or similar) page CSV into `aggregates.json` as `pageRevenue[]`.
 * Later rows win on duplicate paths; existing non-CSV rows are preserved unless overridden by CSV path.
 *
 * Usage: npm run adsense:merge-csv -- path/to/export.csv [path/to/aggregates.json]
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseAdSensePageRevenueCsv } from "../../lib/content-engine/adsense/parse-export";
import type { PageRevenueMetric } from "../../lib/content-engine/performance/types";

function isRecord(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === "object" && !Array.isArray(v);
}

function normalizeStoredRevenueRow(row: unknown): PageRevenueMetric | null {
  if (!isRecord(row)) return null;
  const p = typeof row.path === "string" ? row.path.trim() : "";
  const rpm = Number(row.rpm);
  if (!p.startsWith("/") || !Number.isFinite(rpm)) return null;
  const earnings = row.earnings != null ? Number(row.earnings) : undefined;
  const monetizedImpressions = row.monetizedImpressions != null ? Number(row.monetizedImpressions) : undefined;
  return {
    path: p,
    rpm,
    earnings: earnings != null && Number.isFinite(earnings) ? earnings : undefined,
    monetizedImpressions:
      monetizedImpressions != null && Number.isFinite(monetizedImpressions) ? monetizedImpressions : undefined,
  };
}

function main() {
  const csvPath = process.argv[2];
  const aggArg = process.argv[3];
  const defaultAgg = path.join(process.cwd(), "lib", "content-engine", "performance", "aggregates.json");
  const aggPath = aggArg ? path.resolve(process.cwd(), aggArg) : defaultAgg;

  if (!csvPath) {
    console.error("Usage: npm run adsense:merge-csv -- <adsense-pages.csv> [aggregates.json]");
    process.exit(1);
  }

  const resolvedCsv = path.resolve(process.cwd(), csvPath);
  if (!existsSync(resolvedCsv)) {
    console.error("CSV not found:", resolvedCsv);
    process.exit(1);
  }
  if (!existsSync(aggPath)) {
    console.error("Aggregates file not found:", aggPath);
    process.exit(1);
  }

  const csvText = readFileSync(resolvedCsv, "utf8");
  const fromCsv = parseAdSensePageRevenueCsv(csvText);

  const rawUnknown: unknown = JSON.parse(readFileSync(aggPath, "utf8"));
  if (!isRecord(rawUnknown) || !Array.isArray(rawUnknown.pages)) {
    console.error("aggregates.json must be an object with pages[]");
    process.exit(1);
  }
  const raw = rawUnknown as Record<string, unknown>;

  const merged = new Map<string, PageRevenueMetric>();
  const prev = raw.pageRevenue;
  if (Array.isArray(prev)) {
    for (const row of prev) {
      const n = normalizeStoredRevenueRow(row);
      if (n) merged.set(n.path, n);
    }
  }
  for (const row of fromCsv) merged.set(row.path, row);

  raw.pageRevenue = [...merged.values()];
  const prevSource = typeof raw.source === "string" ? raw.source : "";
  raw.source = prevSource ? `${prevSource}+adsense_csv` : "adsense_csv";
  raw.updatedAt = new Date().toISOString().slice(0, 10);

  writeFileSync(aggPath, JSON.stringify(raw, null, 2), "utf8");
  console.log(
    JSON.stringify({
      ok: true,
      csvRows: fromCsv.length,
      pageRevenuePaths: merged.size,
      aggregates: aggPath,
    }),
  );
}

main();
