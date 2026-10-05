#!/usr/bin/env node
/**
 * Crawl a running Toollabz server (production build) and verify technical SEO invariants with
 * both a normal browser UA and a Googlebot UA.
 *
 *   node scripts/seo-crawl-verify.mjs http://127.0.0.1:3411 [--out report.json] [--link-limit 4000]
 *
 * Checks: robots.txt, every sitemap URL (200, indexable, self-canonical, head metadata before </head>,
 * no SVG <title>), hreflang reciprocity, internal links from sitemap pages (no 404s / redirects),
 * unknown-tool 404s, key redirects, /api/og.
 */
import { writeFileSync } from "node:fs";

const base = (process.argv[2] ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const outIdx = process.argv.indexOf("--out");
const outFile = outIdx > -1 ? process.argv[outIdx + 1] : "seo-crawl-report.json";
const limIdx = process.argv.indexOf("--link-limit");
const linkLimit = limIdx > -1 ? Number(process.argv[limIdx + 1]) : 4000;
const PROD_ORIGIN = "https://toollabz.com";

const UA_NORMAL = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const UA_BOT =
  "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

const failures = [];
const notes = {};
const fail = (kind, detail) => failures.push({ kind, detail });

async function pool(items, size, fn) {
  const results = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (i < items.length) {
        const idx = i++;
        try {
          results[idx] = await fn(items[idx], idx);
        } catch (e) {
          results[idx] = { error: String(e) };
        }
      }
    }),
  );
  return results;
}

async function get(pathOrUrl, ua = UA_NORMAL, redirect = "manual") {
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : base + pathOrUrl;
  const res = await fetch(url, { headers: { "user-agent": ua, accept: "text/html,*/*" }, redirect });
  return res;
}

const toLocal = (u) => (u.startsWith(PROD_ORIGIN) ? base + u.slice(PROD_ORIGIN.length) : u);
const toPath = (u) => {
  const x = new URL(toLocal(u), base);
  return x.pathname + x.search;
};

function parseHead(html) {
  const headEnd = html.indexOf("</head>");
  const head = headEnd > -1 ? html.slice(0, headEnd) : "";
  const bodyStart = html.indexOf("<body");
  const title = /<title[^>]*>([^<]*)<\/title>/i.exec(head)?.[1]?.trim() ?? null;
  const descMatch = /<meta\s+name="description"\s+content="([^"]*)"/i.exec(head);
  const canonical = /<link\s+rel="canonical"\s+href="([^"]*)"/i.exec(head)?.[1] ?? null;
  const robots = /<meta\s+name="robots"\s+content="([^"]*)"/i.exec(head)?.[1] ?? null;
  const alternates = [...head.matchAll(/<link\s+rel="alternate"\s+hrefLang="([^"]*)"\s+href="([^"]*)"/gi)].map((m) => [m[1], m[2]]);
  const alternates2 = [...head.matchAll(/<link\s+rel="alternate"\s+href="([^"]*)"\s+hrefLang="([^"]*)"/gi)].map((m) => [m[2], m[1]]);
  const bodyHasHeadTags =
    bodyStart > -1 && /<(title|link\s+rel="canonical"|meta\s+name="robots")/i.test(html.slice(bodyStart).replace(/<svg[\s\S]*?<\/svg>/gi, ""));
  const svgTitle = /<svg[^>]*>[\s\S]*?<title/i.test(html);
  return {
    hasHead: headEnd > -1,
    title,
    description: descMatch?.[1] ?? null,
    canonical,
    robots,
    alternates: [...alternates, ...alternates2],
    bodyHasHeadTags,
    svgTitle,
  };
}

function internalLinks(html) {
  const out = new Set();
  for (const m of html.matchAll(/<a\s[^>]*?href="(\/[^"#?]*)(?:\?[^"#]*)?(?:#[^"]*)?"/gi)) {
    const p = m[1];
    if (p.startsWith("//") || p.startsWith("/_next") || p.startsWith("/api/")) continue;
    out.add(p);
  }
  return [...out];
}

async function fetchSitemapUrls(path) {
  const res = await get(path);
  if (res.status !== 200) {
    fail("sitemap-status", `${path} -> ${res.status}`);
    return [];
  }
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, "&"));
}

async function main() {
  const started = Date.now();

  // robots.txt
  const robots = await (await get("/robots.txt")).text();
  const sitemapDecls = [...robots.matchAll(/^Sitemap:\s*(\S+)/gim)].map((m) => m[1]);
  notes.robotsSitemaps = sitemapDecls;
  if (!/Allow: \/api\/og/.test(robots)) fail("robots", "missing Allow: /api/og");
  if (/Disallow:\s*\/_next/.test(robots)) fail("robots", "blocks /_next/");

  // sitemaps
  const sitemapUrls = new Map(); // url -> sitemap
  for (const decl of sitemapDecls) {
    const urls = await fetchSitemapUrls(toPath(decl));
    for (const u of urls) {
      if (sitemapUrls.has(u)) fail("sitemap-duplicate", u);
      sitemapUrls.set(u, decl);
    }
  }
  notes.sitemapUrlCount = sitemapUrls.size;
  const sitemapPaths = new Set([...sitemapUrls.keys()].map(toPath));

  // page checks with both UAs
  const urlList = [...sitemapUrls.keys()];
  const pageData = new Map();
  const rows = await pool(urlList, 12, async (u) => {
    const p = toPath(u);
    const [normal, bot] = await Promise.all([get(p, UA_NORMAL), get(p, UA_BOT)]);
    const res = {};
    for (const [label, r] of [["normal", normal], ["bot", bot]]) {
      if (r.status !== 200) {
        fail("sitemap-url-not-200", `${label} ${p} -> ${r.status}`);
        res[label] = { status: r.status };
        continue;
      }
      const html = await r.text();
      const head = parseHead(html);
      res[label] = { status: 200, head, html: label === "normal" ? html : undefined };
      if (!head.hasHead) fail("no-head", `${label} ${p}`);
      if (!head.title) fail("head-missing-title", `${label} ${p}`);
      if (!head.description) fail("head-missing-description", `${label} ${p}`);
      if (!head.canonical) fail("head-missing-canonical", `${label} ${p}`);
      if (head.bodyHasHeadTags) fail("metadata-in-body", `${label} ${p}`);
      if (head.svgTitle) fail("svg-title-present", `${label} ${p}`);
      if (head.robots && /noindex/i.test(head.robots)) fail("sitemap-url-noindex", `${label} ${p}`);
      if (head.canonical && toPath(head.canonical).replace(/\/$/, "") !== p.replace(/\/$/, "")) {
        fail("sitemap-url-not-self-canonical", `${label} ${p} canonical=${head.canonical}`);
      }
    }
    if (res.normal.head && res.bot.head) {
      const a = res.normal.head;
      const b = res.bot.head;
      if (a.title !== b.title || a.canonical !== b.canonical || a.robots !== b.robots) {
        fail("ua-mismatch", `${p} normal/bot head differ`);
      }
    }
    pageData.set(p, res);
    return { p };
  });
  void rows;

  // hreflang checks
  let hreflangPages = 0;
  for (const [p, res] of pageData) {
    const head = res.normal?.head;
    if (!head || head.alternates.length === 0) continue;
    const codes = head.alternates.map(([c]) => c);
    if (head.alternates.length <= 2 && codes.every((c) => c === "en" || c === "x-default")) {
      // self + x-default only (untranslated page): must self-reference.
      const en = head.alternates.find(([c]) => c === "en");
      if (en && toPath(en[1]) !== p) fail("hreflang-en-not-self", `${p} -> ${en[1]}`);
      continue;
    }
    hreflangPages++;
    if (!codes.includes("x-default")) fail("hreflang-no-x-default", p);
    const self = head.alternates.find(([, href]) => toPath(href) === p);
    if (!self) fail("hreflang-not-self-referencing", p);
    for (const [code, href] of head.alternates) {
      const target = toPath(href);
      const targetPage = pageData.get(target);
      if (!targetPage) {
        fail("hreflang-target-not-in-sitemap", `${p} -> ${code} ${target}`);
        continue;
      }
      const back = targetPage.normal?.head?.alternates ?? [];
      if (!back.some(([, h]) => toPath(h) === p)) fail("hreflang-not-reciprocal", `${p} <-> ${target}`);
      if (targetPage.normal?.head?.robots && /noindex/i.test(targetPage.normal.head.robots)) {
        fail("hreflang-target-noindex", `${p} -> ${target}`);
      }
    }
  }
  notes.hreflangClusters = hreflangPages;

  // internal links
  const linkSources = new Map();
  for (const [p, res] of pageData) {
    for (const l of internalLinks(res.normal?.html ?? "")) {
      if (!linkSources.has(l)) linkSources.set(l, p);
    }
  }
  const links = [...linkSources.keys()].filter((l) => !sitemapPaths.has(l)).slice(0, linkLimit);
  notes.internalLinksChecked = links.length + [...linkSources.keys()].filter((l) => sitemapPaths.has(l)).length;
  await pool(links, 16, async (l) => {
    const r = await get(l, UA_BOT);
    if (r.status >= 300 && r.status < 400) fail("internal-link-redirects", `${l} (from ${linkSources.get(l)}) -> ${r.status} ${r.headers.get("location")}`);
    else if (r.status !== 200) fail("internal-link-broken", `${l} (from ${linkSources.get(l)}) -> ${r.status}`);
    else if (r.headers.get("content-type")?.includes("text/html")) {
      const head = parseHead(await r.text());
      if (head.robots && /noindex/i.test(head.robots)) (notes.linksToNoindex ||= []).push(`${l} (from ${linkSources.get(l)})`);
    }
    else await r.arrayBuffer();
  });

  // targeted checks
  const expect404 = [
    "/tools/ai-resume-generator",
    "/tools/savings-interest-calculator",
    "/tools/saas-mrr-arr-calculator",
    "/tools/definitely-not-a-real-tool",
    "/blog/definitely-not-a-real-post",
  ];
  for (const p of expect404) {
    for (const ua of [UA_NORMAL, UA_BOT]) {
      const r = await get(p, ua);
      if (r.status !== 404) fail("unknown-url-not-404", `${p} -> ${r.status}`);
      else {
        const html = await r.text();
        if (!/<title/i.test(html.slice(0, html.indexOf("</head>")))) fail("404-missing-head-title", p);
      }
    }
  }

  const expectRedirect = {
    "/pricing": "/about",
    "/team/editorial": "/editorial-policy",
    "/category/finance": "/finance-tools",
    "/category/does-not-exist": "/tools",
    "/tools/profit-margin-calculator-business": "/tools/profit-margin-calculator",
    "/tools/rental-yield-calculator": "/tools/rental-yield-calculator-uk",
    "/cm-to-feet/847-cm-to-feet": "/tools/cm-to-feet",
    "/loan-calculator/p/250000": "/tools/loan-calculator",
    "/salary-after-tax/p/50000": "/tools/salary-after-tax-calculator",
    "/salary-after-tax-calculator/uk/50000-salary-after-tax-uk": "/tools/salary-after-tax-calculator-uk",
    "/da/tools/loan-calculator": "/tools/loan-calculator",
    "/fr/about": "/about",
    "/fr/tools/vat-calculator": "/tools/vat-calculator",
    "/blog/pdf-merge-guide": "/tools/pdf-merge",
    "/blog/how-to-calculate-roi": "/blog/roi-calculator-measure-return-on-investment",
    "/en/tools/loan-calculator": "/tools/loan-calculator",
  };
  for (const [from, to] of Object.entries(expectRedirect)) {
    const r = await get(from, UA_BOT);
    const loc = r.headers.get("location");
    const ok = (r.status === 301 || r.status === 308) && loc && toPath(loc) === to;
    if (!ok) fail("redirect-mismatch", `${from} -> ${r.status} ${loc} (expected ${to})`);
    else {
      const second = await get(to, UA_BOT);
      if (second.status !== 200) fail("redirect-target-not-200", `${to} -> ${second.status}`);
    }
  }

  // trailing slash
  for (const p of ["/tools/loan-calculator/", "/about/"]) {
    const r = await get(p, UA_BOT);
    const loc = r.headers.get("location");
    if (!(r.status === 308 || r.status === 301) || !loc || toPath(loc) !== p.replace(/\/$/, "")) {
      fail("trailing-slash", `${p} -> ${r.status} ${loc}`);
    }
  }

  // important pages remain indexable
  const important = [
    "/",
    "/tools",
    "/tools/salary-after-tax-calculator-uk",
    "/tools/stamp-duty-calculator-uk",
    "/tools/rental-yield-calculator-uk",
    "/tools/self-employed-tax-calculator-uk",
    "/tools/dividend-tax-calculator-uk",
    "/tools/vat-calculator",
    "/tools/gst-calculator-australia",
    "/tools/json-formatter",
    "/tools/jwt-decoder",
    "/tools/loan-calculator",
    "/tools/profit-margin-calculator",
    "/uk-finance-tax",
    "/finance-tools",
    "/blog",
  ];
  for (const p of important) {
    for (const ua of [UA_NORMAL, UA_BOT]) {
      const r = await get(p, ua);
      if (r.status !== 200) {
        fail("important-page-not-200", `${p} -> ${r.status}`);
        continue;
      }
      const head = parseHead(await r.text());
      if (head.robots && /noindex/i.test(head.robots)) fail("important-page-noindex", p);
      if (!head.title || !head.canonical || !head.description) fail("important-page-head-incomplete", p);
    }
  }

  // YMYL tools must be noindex but reachable
  const ymyl = await get("/tools/medication-dosage-calculator", UA_BOT);
  notes.ymylSample = { status: ymyl.status };
  if (ymyl.status === 200) {
    const head = parseHead(await ymyl.text());
    if (!head.robots || !/noindex/i.test(head.robots)) fail("ymyl-not-noindex", "/tools/medication-dosage-calculator");
  }

  // /api/og
  try {
    const og = await get("/api/og?title=UK%20Salary%20After%20Tax&category=finance", UA_BOT);
    const buf = Buffer.from(await og.arrayBuffer());
    notes.ogImage = { status: og.status, contentType: og.headers.get("content-type"), bytes: buf.length };
    if (og.status !== 200 || !String(og.headers.get("content-type")).startsWith("image/") || buf.length < 1000) {
      fail("api-og", JSON.stringify(notes.ogImage));
    }
  } catch (e) {
    notes.ogImage = { error: String(e) };
    fail("api-og", String(e));
  }

  const summary = {
    base,
    seconds: Math.round((Date.now() - started) / 1000),
    notes,
    failureCount: failures.length,
    failuresByKind: failures.reduce((acc, f) => ((acc[f.kind] = (acc[f.kind] ?? 0) + 1), acc), {}),
    failures: failures.slice(0, 400),
  };
  writeFileSync(outFile, JSON.stringify(summary, null, 2));
  console.log(JSON.stringify({ ...summary, failures: undefined }, null, 2));
  console.log(failures.slice(0, 40).map((f) => `${f.kind}: ${f.detail}`).join("\n"));
  process.exitCode = failures.length ? 1 : 0;
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
