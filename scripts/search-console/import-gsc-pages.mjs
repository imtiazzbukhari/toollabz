#!/usr/bin/env node
/**
 * Converts a Search Console "Pages" table export (CSV) into aggregates.json for the feedback loop.
 *
 * Usage:
 *   node scripts/search-console/import-gsc-pages.mjs path/to/Pages.csv [out/path/aggregates.json]
 *
 * Expects columns similar to: Page,Clicks,Impressions,CTR,Position
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (!inQuotes && c === ",") {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += c;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

function main() {
  const inPath = process.argv[2];
  const outPath = process.argv[3] || path.join("lib", "content-engine", "performance", "aggregates.json");
  if (!inPath) {
    console.error("Usage: node scripts/search-console/import-gsc-pages.mjs <pages.csv> [out.json]");
    process.exit(1);
  }
  const raw = readFileSync(inPath, "utf8");
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    console.error("CSV too short");
    process.exit(1);
  }
  const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  const iPage = header.findIndex((h) => h.includes("page") || h === "url");
  const iClicks = header.findIndex((h) => h.includes("click"));
  const iImp = header.findIndex((h) => h.includes("impression"));
  const iPos = header.findIndex((h) => h.includes("position"));
  if (iPage < 0 || iClicks < 0 || iImp < 0) {
    console.error("Could not find Page, Clicks, Impressions columns", header);
    process.exit(1);
  }

  const pages = [];
  for (let r = 1; r < lines.length; r++) {
    const cols = parseCsvLine(lines[r]);
    const url = cols[iPage]?.trim();
    if (!url) continue;
    let pathname = url;
    try {
      const u = new URL(url);
      pathname = u.pathname || "/";
    } catch {
      if (!url.startsWith("/")) pathname = `/${url}`;
    }
    const clicks = Number(cols[iClicks]?.replace(/,/g, "") ?? "0");
    const impressions = Number(cols[iImp]?.replace(/,/g, "") ?? "0");
    const position = iPos >= 0 ? Number(cols[iPos]?.replace(/,/g, "")) : undefined;
    if (!Number.isFinite(clicks) || !Number.isFinite(impressions)) continue;
    pages.push({
      path: pathname,
      clicks,
      impressions,
      position: position != null && Number.isFinite(position) ? position : undefined,
    });
  }

  const payload = {
    updatedAt: new Date().toISOString().slice(0, 10),
    source: `imported from ${path.basename(inPath)}`,
    pages,
  };
  writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Wrote ${pages.length} rows to ${outPath}`);
}

main();
