import { describe, expect, it } from "vitest";
import {
  buildPageSitemapEntries,
  buildSitemapEntries,
  renderSitemapXml,
  sitemapPublicOrigin,
} from "../lib/content-engine/sitemap-data";
import {
  SITEMAP_CM_TO_FEET_SLUGS,
  SITEMAP_LOAN_PRINCIPALS,
  SITEMAP_SALARY_GROSS,
} from "../lib/sitemap-programmatic";
import {
  cmToFeetValueTier,
  loanPrincipalValueTier,
  salaryGrossValueTier,
  shouldIndexProgrammatic,
  shouldSitemapProgrammatic,
} from "../lib/programmatic-seo/value-tier";
import { PROGRAMMATIC_LOAN_PRINCIPALS, PROGRAMMATIC_SALARY_GROSS } from "../lib/programmatic-seo/amount-routes";
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
    expect(urls).toContain(`${origin}/team/editorial`);
    expect(urls).toContain(`${origin}/research`);

    for (const term of GLOSSARY_TERMS) {
      expect(urls).toContain(`${origin}/glossary/${term.slug}`);
    }
    for (const cm of SITEMAP_CM_TO_FEET_SLUGS) {
      expect(urls).toContain(`${origin}/cm-to-feet/${cm}-cm-to-feet`);
      expect(shouldSitemapProgrammatic(cmToFeetValueTier(cm))).toBe(true);
    }
    for (const amount of SITEMAP_LOAN_PRINCIPALS) {
      expect(urls).toContain(`${origin}/loan-calculator/p/${amount}`);
    }
    for (const amount of SITEMAP_SALARY_GROSS) {
      expect(urls).toContain(`${origin}/salary-after-tax/p/${amount}`);
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

  it("medium programmatic amounts stay indexable; only high enter sitemap lists", () => {
    const mediumLoan = PROGRAMMATIC_LOAN_PRINCIPALS.find((n) => loanPrincipalValueTier(n) === "medium");
    expect(mediumLoan).toBeTruthy();
    expect(shouldIndexProgrammatic(loanPrincipalValueTier(mediumLoan!))).toBe(true);
    expect(shouldSitemapProgrammatic(loanPrincipalValueTier(mediumLoan!))).toBe(false);

    const mediumSalary = PROGRAMMATIC_SALARY_GROSS.find((n) => salaryGrossValueTier(n) === "medium");
    expect(mediumSalary).toBeTruthy();
    expect(shouldIndexProgrammatic(salaryGrossValueTier(mediumSalary!))).toBe(true);

    expect(shouldIndexProgrammatic(cmToFeetValueTier(170))).toBe(true);
    expect(shouldIndexProgrammatic(cmToFeetValueTier(847))).toBe(false);
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
    expect(text).toContain("User-agent: OAI-SearchBot");
    expect(text).not.toContain("Disallow: /_next/");
  });
});
