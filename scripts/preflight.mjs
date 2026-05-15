#!/usr/bin/env node
/**
 * Deploy / local readiness checks.
 *
 * Usage:
 *   node scripts/preflight.mjs # env checklist + TypeScript
 *   node scripts/preflight.mjs --build      # + production build (needs NEXT_PUBLIC_SITE_URL)
 *   node scripts/preflight.mjs --strict     # fail if SITE_URL missing or localhost-like
 *
 * Reads optional .env then .env.local from project root (no extra dependencies).
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

function loadEnvFile(name) {
  const p = resolve(process.cwd(), name);
  if (!existsSync(p)) return {};
  const out = {};
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function isLocalLike(url) {
  if (!url) return true;
  const lower = url.toLowerCase();
  return (
    lower.includes("localhost") ||
    lower.includes("127.0.0.1") ||
    lower.startsWith("http://0.0.0.0")
  );
}

function run(cmd, args, env = process.env) {
  const r = spawnSync(cmd, args, { stdio: "inherit", env, shell: false });
  return r.status ?? 1;
}

const fileEnv = { ...loadEnvFile(".env"), ...loadEnvFile(".env.local") };
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || fileEnv.NEXT_PUBLIC_SITE_URL || "")
  .trim()
  .replace(/\/$/, "");

const strict = process.argv.includes("--strict");
const withBuild = process.argv.includes("--build");

console.log("=== Toolabz preflight ===\n");

console.log("Environment checklist (production):\n");
console.log("  NEXT_PUBLIC_SITE_URL - canonical origin, no trailing slash (required for `next build` in production code paths)");

let failed = false;

if (!siteUrl) {
  console.log("  ! Not set in process.env or .env / .env.local");
  if (strict) failed = true;
} else if (isLocalLike(siteUrl)) {
  console.log("  ! Current value looks local/dev:", siteUrl);
  if (strict) failed = true;
} else {
  console.log("  OK", siteUrl);
}

const optional = [
  ["NEXT_PUBLIC_GA_ID", "Google Analytics 4 measurement ID"],
  ["NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION", "Search Console HTML tag token"],
  ["NEXT_PUBLIC_ADSENSE_CLIENT_ID", "AdSense client id (ca-pub-…)"],
];

console.log("\nOptional (analytics / monetization):\n");
for (const [key, hint] of optional) {
  const v = (process.env[key] || fileEnv[key] || "").trim();
  console.log(v ? `  OK ${key}` : `  · ${key} - ${hint}`);
}

if (failed) {
  console.error("\nPreflight failed (--strict). Set a public NEXT_PUBLIC_SITE_URL.\n");
  process.exit(1);
}

console.log("\n--- TypeScript ---\n");
if (run("npx", ["tsc", "--noEmit"]) !== 0) {
  console.error("\nPreflight failed: TypeScript errors.\n");
  process.exit(1);
}
console.log("OK tsc --noEmit\n");

if (withBuild) {
  const buildUrl = siteUrl || "http://localhost:3000";
  console.log("--- Production build ---\n");
  console.log("Using NEXT_PUBLIC_SITE_URL=", buildUrl, "\n");
  if (run("npm", ["run", "build"], { ...process.env, NEXT_PUBLIC_SITE_URL: buildUrl }) !== 0) {
    console.error("\nPreflight failed: next build.\n");
    process.exit(1);
  }
  console.log("OK next build\n");
}

console.log("Preflight completed successfully.\n");
