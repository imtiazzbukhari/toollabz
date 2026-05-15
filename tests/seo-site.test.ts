import { describe, expect, it } from "vitest";
import { blogPostSlugs } from "../lib/blog/registry";
import { tools } from "../lib/tools/data";
import { toolMetadata } from "../lib/seo";
import { GET as robotsGet } from "../app/robots.txt/route";
import { buildSitemapEntries, sitemapPublicOrigin } from "../lib/content-engine/sitemap-data";

function sitemapAbs(path: string) {
  const origin = sitemapPublicOrigin();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${p}`;
}

describe("site SEO plumbing (sitemap, robots, metadata)", () => {
  it("robots.txt exposes sitemap URL aligned with sitemap origin", async () => {
    const res = await robotsGet();
    const text = await res.text();
    expect(text).toContain(`Sitemap: ${sitemapPublicOrigin()}/sitemap.xml`);
    expect(text).toContain("User-agent: *");
    expect(text).toContain("Allow: /");
    expect(text).toContain("Disallow: /api/");
  });

  it("sitemap contains homepage, tools index, sample tool, blog index, and every blog slug", () => {
    const entries = buildSitemapEntries(new Date());
    const urls = entries.map((e) => e.loc);

    expect(urls.length).toBeGreaterThan(100);
    expect(new Set(urls).size).toBe(urls.length);

    for (const u of urls) {
      expect(() => new URL(u)).not.toThrow();
      expect(u.startsWith("http://") || u.startsWith("https://")).toBe(true);
    }

    expect(urls).toContain(sitemapAbs("/"));
    expect(urls).toContain(sitemapAbs("/tools"));
    expect(urls).toContain(sitemapAbs("/blog"));
    expect(urls).toContain(sitemapAbs("/tools/loan-calculator"));

    for (const slug of blogPostSlugs) {
      expect(urls).toContain(sitemapAbs(`/blog/${slug}`));
    }

    const blogArticleUrls = entries.filter((e) => {
      try {
        const p = new URL(e.loc).pathname;
        return p.startsWith("/blog/") && p !== "/blog";
      } catch {
        return false;
      }
    });
    expect(blogArticleUrls.length).toBe(blogPostSlugs.length);
    for (const row of blogArticleUrls) {
      expect(row.lastmod).toBeTruthy();
      expect(Number.isNaN(Date.parse(String(row.lastmod)))).toBe(false);
    }
  });

  it("every tool slug has a sitemap URL", () => {
    const entries = buildSitemapEntries(new Date());
    const urls = new Set(entries.map((e) => e.loc));
    for (const tool of tools) {
      expect(urls.has(sitemapAbs(`/tools/${tool.slug}`))).toBe(true);
    }
  });

  it("tool metadata includes title, description bounds, and canonical path", () => {
    const sample = tools.slice(0, 25);
    for (const tool of sample) {
      const m = toolMetadata(tool);
      expect(m.title.length).toBeGreaterThan(2);
      expect(m.description.length).toBeGreaterThan(24);
      expect(m.description.length).toBeLessThanOrEqual(160);
      expect(m.alternates?.canonical).toBe(`/tools/${tool.slug}`);
    }
  });
});
