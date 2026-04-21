/**
 * One-off / maintenance: convert raster PNGs under public/ to WebP (same basename).
 * Run from repo root: node scripts/convert-png-to-webp.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const publicDir = path.join(root, "public");

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) walk(full, acc);
    else if (name.isFile() && /\.png$/i.test(name.name)) acc.push(full);
  }
  return acc;
}

async function main() {
  const files = walk(publicDir);
  for (const input of files) {
    const out = input.replace(/\.png$/i, ".webp");
    await sharp(input).webp({ quality: 86, effort: 4 }).toFile(out);
    const inStat = fs.statSync(input);
    const outStat = fs.statSync(out);
    console.log(
      path.relative(root, input),
      "→",
      path.relative(root, out),
      `(${(inStat.size / 1024).toFixed(1)} KB → ${(outStat.size / 1024).toFixed(1)} KB)`,
    );
    fs.unlinkSync(input);
  }
  const appIcon = path.join(root, "app", "icon.png");
  if (fs.existsSync(appIcon)) {
    fs.unlinkSync(appIcon);
    console.log("Removed app/icon.png (favicons come from metadata /logo-toollabz.webp).");
  }
  console.log(`Done. Converted ${files.length} public PNG(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
