import { expect, test } from "@playwright/test";

test.describe("seo (live HTML)", () => {
  test("home has canonical, description, and JSON-LD WebSite", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const href = await canonical.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).toMatch(/^https?:\/\//);

    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveCount(1);
    const content = await desc.getAttribute("content");
    expect(content && content.length > 20).toBe(true);

    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    const parsed = ld.map((raw) => {
      try {
        return JSON.parse(raw) as { "@type"?: string; url?: string };
      } catch {
        return null;
      }
    });
    const types = parsed.filter(Boolean).map((o) => o?.["@type"]);
    expect(types).toContain("WebSite");
    expect(types).toContain("Organization");
  });

  test("tool page has canonical, meta description, and single h1", async ({ page }) => {
    await page.goto("/tools/vat-calculator", { waitUntil: "domcontentloaded" });
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    await expect(canonical).toHaveAttribute("href", /\/tools\/vat-calculator$/);

    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveCount(1);

    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  });

  test("blog article has canonical and article JSON-LD", async ({ page }) => {
    await page.goto("/blog/roi-calculator-measure-return-on-investment", { waitUntil: "domcontentloaded" });
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    await expect(canonical).toHaveAttribute("href", /\/blog\/roi-calculator-measure-return-on-investment$/);

    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    const hasArticle = ld.some((raw) => {
      try {
        const o = JSON.parse(raw) as { "@type"?: string };
        return o["@type"] === "Article";
      } catch {
        return false;
      }
    });
    expect(hasArticle).toBe(true);
  });

  test("robots.txt references sitemap", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.ok()).toBe(true);
    const text = await res.text();
    expect(text.toLowerCase()).toContain("sitemap:");
  });

  test("sitemaps listed in robots.txt cover tool and blog URLs", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    const sitemapPaths = [...robots.matchAll(/^Sitemap:\s*https?:\/\/[^/\s]+(\/\S+)/gim)].map((m) => m[1]);
    expect(sitemapPaths).toContain("/sitemap.xml");

    let combined = "";
    for (const path of sitemapPaths) {
      const res = await request.get(path);
      expect(res.ok(), path).toBe(true);
      const text = await res.text();
      expect(text, path).toContain("<urlset");
      combined += text;
    }
    expect(combined).toContain("/tools/loan-calculator");
    expect(combined).toContain("/blog/roi-calculator-measure-return-on-investment");
  });
});
