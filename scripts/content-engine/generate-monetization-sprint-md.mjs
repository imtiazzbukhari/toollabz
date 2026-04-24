#!/usr/bin/env node
/**
 * Pull sprint markdown from automation bundle and write PR-ready checklist.
 * Usage:
 *   CONTENT_ENGINE_SITE_URL=https://toollabz.com
 *   CONTENT_ENGINE_SECRET=...
 *   node scripts/content-engine/generate-monetization-sprint-md.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

async function fetchJson(url, headers) {
  const res = await fetch(url, { headers });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 500)}`);
  return JSON.parse(text);
}

async function main() {
  const site = (process.env.CONTENT_ENGINE_SITE_URL || process.env.SITE_URL || "").replace(/\/$/, "");
  const secret = process.env.CONTENT_ENGINE_SECRET || process.env.CRON_SECRET;
  if (!site || !secret) {
    console.error("Missing CONTENT_ENGINE_SITE_URL/SITE_URL or CONTENT_ENGINE_SECRET/CRON_SECRET");
    process.exit(1);
  }
  const json = await fetchJson(`${site}/api/content-engine/automation-bundle`, { "x-toollabz-secret": secret });
  const md = typeof json.sprintMarkdown === "string" ? json.sprintMarkdown : "";
  if (!md) {
    console.error("No sprintMarkdown returned from automation bundle.");
    process.exit(1);
  }
  const outDir = path.join(process.cwd(), "lib", "content-engine", "action-queue");
  mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "monetization-sprint.md");
  writeFileSync(outPath, md, "utf8");
  console.log(JSON.stringify({ ok: true, outPath }));
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : String(e));
  process.exit(1);
});

