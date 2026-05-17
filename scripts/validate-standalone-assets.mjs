#!/usr/bin/env node
/**
 * Fail CI / deploy if standalone output is missing client chunks (unstyled site in production).
 * Run after `next build` + `copy-standalone-assets.mjs` when using `output: "standalone"`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const standaloneRoot = path.join(root, ".next", "standalone");
const staticRoot = path.join(standaloneRoot, ".next", "static");
const cssDir = path.join(staticRoot, "css");
const chunksDir = path.join(staticRoot, "chunks");

function listFilesRecursive(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) listFilesRecursive(p, acc);
    else acc.push(p);
  }
  return acc;
}

function main() {
  if (!fs.existsSync(path.join(standaloneRoot, "server.js"))) {
    console.error("[validate-standalone-assets] Missing .next/standalone/server.js — run `next build` with output: standalone.");
    process.exit(1);
  }
  if (!fs.existsSync(staticRoot)) {
    console.error(
      "[validate-standalone-assets] Missing .next/standalone/.next/static — run `node scripts/copy-standalone-assets.mjs` after `next build`.",
    );
    process.exit(1);
  }

  const cssFiles = fs.existsSync(cssDir) ? fs.readdirSync(cssDir).filter((f) => f.endsWith(".css")) : [];
  if (cssFiles.length === 0) {
    console.error("[validate-standalone-assets] No CSS chunks under .next/standalone/.next/static/css — site will render unstyled.");
    process.exit(1);
  }

  const chunkFiles = fs.existsSync(chunksDir) ? listFilesRecursive(chunksDir).filter((p) => p.endsWith(".js")) : [];
  if (chunkFiles.length === 0) {
    console.error("[validate-standalone-assets] No JS chunks under .next/standalone/.next/static/chunks.");
    process.exit(1);
  }

  const publicStandalone = path.join(standaloneRoot, "public");
  if (!fs.existsSync(publicStandalone)) {
    console.warn("[validate-standalone-assets] No public/ in standalone (copy script may have skipped empty public).");
  }

  console.log(
    `[validate-standalone-assets] OK — ${cssFiles.length} CSS file(s), ${chunkFiles.length} JS chunk file(s) under standalone static.`,
  );
}

main();
