/**
 * Crawl sitemap URLs (from buildSitemapEntries), extract same-origin links from page HTML,
 * and report broken links / pages with no internal links. Requires running site (BASE_URL).
 *
 * Usage: BASE_URL=http://localhost:3000 npx tsx scripts/audit-internal-links.ts
 */
import { buildSitemapEntries } from "../lib/content-engine/sitemap-data";

const base = process.env.BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:3000";

function sameOriginPath(href: string): string | null {
  try {
    if (href.startsWith("/")) return href.split("#")[0] ?? href;
    const u = new URL(href);
    const origin = new URL(base).origin;
    if (u.origin !== origin) return null;
    return u.pathname + u.search;
  } catch {
    return null;
  }
}

function extractInternalLinks(html: string): string[] {
  const out = new Set<string>();
  const re = /href=["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const p = sameOriginPath(m[1]);
    if (p && !p.startsWith("/api/") && !p.startsWith("/seo-growth-console")) out.add(p);
  }
  return [...out];
}

async function main() {
  const entries = buildSitemapEntries(new Date());
  const paths = entries.map((e) => new URL(e.loc).pathname);
  const pathSet = new Set(paths);
  const inbound = new Map<string, Set<string>>();
  const broken: string[] = [];
  const zeroLinks: string[] = [];

  for (const pathname of paths) {
    const url = `${base}${pathname}`;
    let html: string;
    try {
      const res = await fetch(url, { redirect: "follow" });
      html = await res.text();
      if (!res.ok) {
        broken.push(`${pathname} -> HTTP ${res.status}`);
        continue;
      }
    } catch (e) {
      broken.push(`${pathname} -> fetch_error ${e instanceof Error ? e.message : String(e)}`);
      continue;
    }
    const links = extractInternalLinks(html);
    if (links.length === 0) zeroLinks.push(pathname);
    for (const target of links) {
      if (!inbound.has(target)) inbound.set(target, new Set());
      inbound.get(target)!.add(pathname);
    }
    for (const target of links) {
      const clean = target.split("?")[0] ?? target;
      if (!pathSet.has(clean)) broken.push(`${pathname} links_to_missing ${target}`);
    }
  }

  const orphans = paths.filter((p) => !inbound.has(p) || inbound.get(p)!.size === 0);

  console.log(`[audit-internal-links] BASE_URL=${base}`);
  console.log(`[audit-internal-links] Sitemap paths: ${paths.length}`);
  console.log(`[audit-internal-links] Broken / missing targets: ${broken.length}`);
  for (const b of broken.slice(0, 200)) console.log("  ", b);
  if (broken.length > 200) console.log(`  ... and ${broken.length - 200} more`);
  console.log(`[audit-internal-links] Pages with zero same-origin links in HTML: ${zeroLinks.length}`);
  for (const z of zeroLinks.slice(0, 50)) console.log("  ", z);
  console.log(`[audit-internal-links] Orphan-ish (no inbound from crawled HTML): ${orphans.length}`);
  for (const o of orphans.slice(0, 40)) console.log("  ", o);

  if (broken.length) process.exitCode = 1;
}

void main();
