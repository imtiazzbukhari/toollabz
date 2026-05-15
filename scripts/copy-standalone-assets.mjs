#!/usr/bin/env node
/**
 * Next.js `output: "standalone"` ships a minimal server under `.next/standalone`.
 * Client chunks, CSS, and media live under `.next/static` at the repo root and are NOT
 * copied automatically - without this step, `/_next/static/*` returns 404 and the UI
 * renders unstyled. Public files must also live beside the server as `./public`.
 *
 * Run automatically after `next build` via the `build` npm script.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const standaloneDir = path.join(root, ".next", "standalone");
const staticSrc = path.join(root, ".next", "static");
const staticDest = path.join(standaloneDir, ".next", "static");
const publicSrc = path.join(root, "public");
const publicDest = path.join(standaloneDir, "public");

if (!fs.existsSync(standaloneDir)) {
  console.warn("[copy-standalone-assets] .next/standalone missing - skipping (run `next build` with output: standalone).");
  process.exit(0);
}

if (!fs.existsSync(staticSrc)) {
  console.error("[copy-standalone-assets] Missing .next/static - build may have failed or distDir changed.");
  process.exit(1);
}

fs.mkdirSync(path.dirname(staticDest), { recursive: true });
fs.rmSync(staticDest, { recursive: true, force: true });
fs.cpSync(staticSrc, staticDest, { recursive: true });
console.log("[copy-standalone-assets] Copied .next/static -> .next/standalone/.next/static");

if (fs.existsSync(publicSrc)) {
  fs.rmSync(publicDest, { recursive: true, force: true });
  fs.cpSync(publicSrc, publicDest, { recursive: true });
  console.log("[copy-standalone-assets] Copied public -> .next/standalone/public");
} else {
  console.warn("[copy-standalone-assets] No public/ folder at project root - skipped.");
}
