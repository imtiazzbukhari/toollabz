#!/usr/bin/env node
/**
 * Guard for `next start`: production server requires a finished build.
 * Run automatically via npm `prestart`.
 */
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const manifest = resolve(process.cwd(), ".next", "routes-manifest.json");
if (existsSync(manifest)) {
  process.exit(0);
}

console.error(`
[!] Missing ${manifest}
    Run a production build first:
      npm run build
    If you use \`next dev\` in another terminal, finish or stop it before
    \`npm run build\` so two processes do not fight over the .next folder.

    For a full wipe + rebuild (CI / stuck cache):
      npm run build:clean
`);
process.exit(1);
