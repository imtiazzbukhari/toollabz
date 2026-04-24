import { describe, expect, it } from "vitest";
import { blogPostSlugs } from "../lib/blog/registry";
import { tools } from "../lib/tools/data";
import { absoluteUrl, siteUrl, toolMetadata } from "../lib/seo";
import robots from "../app/robots";
import sitemap from "../app/sitemap";

describe("site SEO plumbing (sitemap, robots, metadata)", () => {
   it("robots.txt rules expose sitemap and host aligned with siteUrl", () => {
    const r = robots();
    expect(r.sitemap).toBe(`${siteUrl}/sitemap.xml`);
    expect(r.host).toBe(siteUrl);
    const rules = r.rules == null ? [] : Array.isArray(r.rules) ? r.rules : [r.rules];
    expect(rules.length).toBeGreaterThan(0);
    const star = rules.find((rule) => rule.userAgent === "*");
    expect(star?.allow).toContain("/");
  });

  it("sitemap contains homepage, tools index, sample tool, blog index, and every blog slug", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);

    expect(urls.length).toBeGreaterThan(100);
    expect(new Set(urls).size).toBe(urls.length);

    for (const u of urls) {
      expect(() => new URL(u)).not.toThrow();
      expect(u.startsWith("http://") || u.startsWith("https://")).toBe(true);
    }

    expect(urls).toContain(absoluteUrl("/"));
    expect(urls).toContain(absoluteUrl("/tools"));
    expect(urls).toContain(absoluteUrl("/blog"));
    expect(urls).toContain(absoluteUrl("/tools/loan-calculator"));

    for (const slug of blogPostSlugs) {
      expect(urls).toContain(absoluteUrl(`/blog/${slug}`));
    }
  });

  it("every tool slug has a sitemap URL", () => {
    const entries = sitemap();
    const urls = new Set(entries.map((e) => e.url));
    for (const tool of tools) {
      expect(urls.has(absoluteUrl(`/tools/${tool.slug}`))).toBe(true);
    }
  });

  it("tool metadata includes title, description bounds, and canonical path", () => {
    const sample = tools.slice(0, 25);
    for (const tool of sample) {
      const m = toolMetadata(tool);
      expect(m.title.length).toBeGreaterThan(2);
      expect(m.description.length).toBeGreaterThan(24);
      expect(m.description.length).toBeLessThanOrEqual(158);
      expect(m.alternates?.canonical).toBe(`/tools/${tool.slug}`);
    }
  });
});
