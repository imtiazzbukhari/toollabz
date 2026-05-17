#!/usr/bin/env node
/**
 * Gate `npm run start:standalone` so production never boots with missing client assets
 * (the usual cause of “unstyled HTML” with output: standalone).
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const validate = path.join(root, "scripts", "validate-standalone-assets.mjs");

const r = spawnSync(process.execPath, [validate], { cwd: root, stdio: "inherit" });
process.exit(r.status === 0 ? 0 : r.status ?? 1);
