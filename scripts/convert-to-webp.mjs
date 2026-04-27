/**
 * Convert .png and .jpg/.jpeg under public/ to .webp alongside originals (does not delete sources).
 * Requires sharp. Run: node scripts/convert-to-webp.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const publicDir = path.join(root, "public");

/** @param {string} dir @param {string[]} acc */
function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) walk(full, acc);
    else if (name.isFile() && /\.(png|jpe?g)$/i.test(name.name)) acc.push(full);
  }
  return acc;
}

async function main() {
  const files = walk(publicDir);
  const report = [];
  for (const input of files) {
    const out = input.replace(/\.(png|jpe?g)$/i, ".webp");
    if (fs.existsSync(out)) {
      report.push({ input: path.relative(root, input), skipped: true, reason: "webp exists" });
      continue;
    }
    await sharp(input).webp({ quality: 86, effort: 4 }).toFile(out);
    const inStat = fs.statSync(input);
    const outStat = fs.statSync(out);
    report.push({
      input: path.relative(root, input),
      output: path.relative(root, out),
      inKb: (inStat.size / 1024).toFixed(1),
      outKb: (outStat.size / 1024).toFixed(1),
    });
  }
  console.log("[convert-to-webp] Report:");
  for (const row of report) {
    if ("skipped" in row && row.skipped) console.log("  skip", row.input, row.reason);
    else console.log("  ok", row.input, "→", row.output, `${row.inKb} KB → ${row.outKb} KB`);
  }
  console.log(`[convert-to-webp] Done. ${report.filter((r) => !("skipped" in r && r.skipped)).length} converted, ${report.filter((r) => "skipped" in r && r.skipped).length} skipped.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
