/**
 * Pre-deploy sanity checks (no network). Set RUN_BUILD=1 to also run `next build` (slow).
 * Usage: node scripts/pre-deploy-check.mjs
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const issues = [];

function fail(msg) {
  issues.push(msg);
  console.error(`FAIL: ${msg}`);
}

function pass(msg) {
  console.log(`PASS: ${msg}`);
}

function read(p) {
  return fs.readFileSync(path.join(root, p), "utf8");
}

function sitemapCheck() {
  try {
    const xml = execSync("npx --yes tsx scripts/sitemap-smoke.ts", {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    if (!/^<\?xml version="1.0" encoding="UTF-8"\?>\s*<urlset/.test(xml)) fail("sitemap XML missing urlset preamble");
    else pass(`sitemap XML well-formed (${(xml.match(/<url>/g) || []).length} URLs)`);
  } catch (e) {
    fail(`sitemap generation check: ${e instanceof Error ? e.message : String(e)}`);
  }
}

function robotsCheck() {
  const txt = read("app/robots.txt/route.ts");
  if (!/googlebot/i.test(txt) && !/User-agent:\s*\*/i.test(txt)) fail("robots route may not declare standard agents");
  else pass("robots.ts mentions crawlers");
  if (/disallow:\s*\/\s*$/im.test(txt) && /googlebot/i.test(txt)) {
    const blockAll = /User-agent:\s*\*[\s\S]*?Disallow:\s*\/\s*$/im.test(txt);
    if (blockAll) fail("robots may block entire site for *");
  }
}

function envExampleCheck() {
  const exPath = path.join(root, ".env.example");
  if (!fs.existsSync(exPath)) {
    fail(".env.example missing");
    return;
  }
  const ex = read(".env.example");
  const required = [
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_GA_MEASUREMENT_ID",
    "NEXT_PUBLIC_GSC_VERIFICATION",
    "MAILCHIMP_API_KEY",
    "MAILCHIMP_LIST_ID",
    "MAILCHIMP_SERVER_PREFIX",
    "REDIS_URL",
    "NEXT_PUBLIC_TRUSTPILOT_BUSINESS_ID",
  ];
  for (const k of required) {
    if (!ex.includes(k)) fail(`.env.example missing documented key: ${k}`);
  }
  if (issues.filter((i) => i.includes(".env.example")).length === 0) pass(".env.example lists core production keys");
}

function main() {
  console.log("[pre-deploy-check] Starting…\n");
  envExampleCheck();
  robotsCheck();
  sitemapCheck();

  if (process.env.RUN_BUILD === "1") {
    try {
      const out = execSync("npm run build", { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
      if (/error/i.test(out) && /Failed/i.test(out)) fail("next build reported failure in output");
      else pass("next build completed (stdout captured)");
    } catch (e) {
      fail(`next build: ${e instanceof Error ? e.message : String(e)}`);
    }
    try {
      execSync("npm run validate:standalone", { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
      pass("standalone static assets present (CSS/JS chunks)");
    } catch (e) {
      fail(`standalone asset validation: ${e instanceof Error ? e.message : String(e)}`);
    }
  } else {
    pass("next build skipped (set RUN_BUILD=1 to run)");
  }

  if (issues.length) {
    console.error(`\n[pre-deploy-check] RESULT: FAIL (${issues.length} issue(s))`);
    process.exit(1);
  }
  console.log(`\n[pre-deploy-check] RESULT: PASS`);
}

main();
