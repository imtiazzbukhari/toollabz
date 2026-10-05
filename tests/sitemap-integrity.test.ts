import { describe, expect, it } from "vitest";
import {
  buildPageSitemapEntries,
  buildSitemapEntries,
  renderSitemapXml,
  sitemapPublicOrigin,
} from "../lib/content-engine/sitemap-data";
import { SITEMAP_CM_TO_FEET_SLUGS, SITEMAP_LOAN_PRINCIPALS } from "../lib/sitemap-programmatic";
import { isValidLoanPrincipal } from "../lib/programmatic-seo/amount-routes";
import { SITEMAP_EXCLUDED_PATHS } from "../lib/seo/indexing-policy";
import { GLOSSARY_TERMS } from "../lib/glossary/terms";
import { GET as robotsGet } from "../app/robots.txt/route";

describe("sitemap + indexing integrity", () => {
  it("page sitemap has unique valid absolute URLs and includes EEAT + high-tier programmatic", () => {
    const entries = buildPageSitemapEntries();
    const urls = entries.map((e) => e.loc);
    expect(urls.length).toBeGreaterThan(40);
    expect(new Set(urls).size).toBe(urls.length);

    for (const u of urls) {
      expect(() => new URL(u)).not.toThrow();
      expect(u.startsWith("https://") || u.startsWith("http://")).toBe(true);
    }

    const origin = sitemapPublicOrigin();
    expect(urls).toContain(`${origin}/methodology`);
    expect(urls).toContain(`${origin}/editorial-policy`);
    expect(urls).toContain(`${origin}/glossary`);
    expect(urls).not.toContain(`${origin}/team/editorial`);
    expect(urls).not.toContain(`${origin}/pricing`);
    expect(urls.some((u) => new URL(u).pathname.startsWith("/category/"))).toBe(false);
    expect(urls.some((u) => new URL(u).pathname.startsWith("/salary-after-tax/"))).toBe(false);
    expect(urls).toContain(`${origin}/research`);

    for (const term of GLOSSARY_TERMS) {
      expect(urls).toContain(`${origin}/glossary/${term.slug}`);
    }
    for (const cm of SITEMAP_CM_TO_FEET_SLUGS) {
      expect(urls).toContain(`${origin}/cm-to-feet/${cm}-cm-to-feet`);
    }
    for (const amount of SITEMAP_LOAN_PRINCIPALS) {
      expect(urls).toContain(`${origin}/loan-calculator/p/${amount}`);
    }

    // Page sitemap must NOT duplicate tool/blog article URLs (those are sharded).
    expect(urls.some((u) => /\/tools\/[^/]+$/.test(new URL(u).pathname) && !u.endsWith("/tools"))).toBe(false);
    expect(urls.some((u) => /\/blog\/[^/]+$/.test(new URL(u).pathname))).toBe(false);
  });

  it("renders well-formed urlset XML without duplicate locs", () => {
    const xml = renderSitemapXml(buildPageSitemapEntries());
    expect(xml.startsWith('<?xml version="1.0"')).toBe(true);
    expect(xml).toContain("<urlset");
    expect(xml).toContain("</urlset>");
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs.length).toBeGreaterThan(40);
    expect(new Set(locs).size).toBe(locs.length);
  });

  it("only curated programmatic values are listed and every one is a valid route", () => {
    expect(SITEMAP_CM_TO_FEET_SLUGS.length).toBe(26);
    for (const amount of SITEMAP_LOAN_PRINCIPALS) expect(isValidLoanPrincipal(amount)).toBe(true);
    for (const excluded of SITEMAP_EXCLUDED_PATHS) {
      const urls = buildPageSitemapEntries().map((e) => new URL(e.loc).pathname);
      expect(urls).not.toContain(excluded);
    }
  });

  it("full inventory sitemap used by tests still covers tools + blogs without dupes", () => {
    const entries = buildSitemapEntries();
    const urls = entries.map((e) => e.loc);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.some((u) => u.includes("/tools/loan-calculator"))).toBe(true);
  });

  it("robots lists page, tool shards, and blog sitemaps; never blocks /_next/", async () => {
    const text = await (await robotsGet()).text();
    expect(text).toContain("Sitemap: https://toollabz.com/sitemap.xml");
    expect(text).toContain("Sitemap: https://toollabz.com/tools/sitemap/0.xml");
    expect(text).toContain("Sitemap: https://toollabz.com/blog/sitemap.xml");
    expect(text).toContain("Sitemap: https://toollabz.com/fr/sitemap.xml");
    expect(text).toContain("Sitemap: https://toollabz.com/es/sitemap.xml");
    expect(text).toContain("Sitemap: https://toollabz.com/pt/sitemap.xml");
    expect(text).not.toContain("/da/sitemap.xml");
    expect(text).toContain("Allow: /api/og");
    expect(text).toContain("User-agent: OAI-SearchBot");
    expect(text).not.toContain("Disallow: /_next/");
  });
});
