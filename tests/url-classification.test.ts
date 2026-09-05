import { describe, expect, it } from "vitest";
import { classifyUrl } from "../lib/seo/url-classification";

describe("GSC URL classification", () => {
  it("keeps primary tools indexable and in sitemap", () => {
    const c = classifyUrl("https://toollabz.com/tools/loan-calculator");
    expect(c.indexability).toBe("index");
    expect(c.canonical).toBe("self");
    expect(c.sitemap).toBe(true);
  });

  it("treats private surfaces as blocked or noindex", () => {
    expect(classifyUrl("/api/foo").indexability).toBe("blocked");
    expect(classifyUrl("/dashboard").indexability).toBe("blocked");
    expect(classifyUrl("/login").robotsMeta).toBe("noindex,nofollow");
  });

  it("maps legacy hyphen amounts and thin country URLs to redirects", () => {
    expect(classifyUrl("/loan-calculator-10000").redirectTarget).toBe("/loan-calculator/p/10000");
    expect(classifyUrl("/loan-calculator/uk").redirectTarget).toBe("/tools/loan-calculator");
    expect(classifyUrl("/salary-after-tax-calculator/usa/50000-salary-after-tax-usa").indexability).toBe("redirect");
  });
});
