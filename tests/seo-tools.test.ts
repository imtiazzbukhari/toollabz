import { describe, expect, it } from "vitest";
import { tools } from "../lib/tools/data";
import { toolMetadata } from "../lib/seo";

const newFinanceSlugs = [
  "debt-payoff-calculator-snowball",
  "debt-payoff-calculator-avalanche",
  "credit-card-interest-calculator",
  "credit-utilization-calculator",
  "early-loan-payoff-calculator",
  "refinance-calculator-mortgage",
  "emergency-fund-calculator",
  "savings-interest-calculator-usa",
  "paycheck-calculator-usa",
  "hourly-to-salary-converter-usa",
  "paycheck-calculator-california",
  "paycheck-calculator-texas",
  "salary-to-hourly-converter-usa",
  "overtime-pay-calculator-usa",
  "car-loan-affordability-calculator",
  "mortgage-affordability-calculator-usa",
  "rent-vs-buy-calculator-usa",
  "property-roi-calculator",
  "rental-yield-calculator-uk",
  "gas-cost-calculator-road-trip",
  "salary-after-tax-calculator-california",
  "salary-after-tax-calculator-texas",
  "salary-after-tax-calculator-new-york",
  "salary-after-tax-calculator-florida",
  "salary-after-tax-calculator-uk",
  "roi-calculator-marketing",
  "cac-calculator-saas",
  "ltv-calculator-saas",
  "break-even-calculator-business",
  "profit-margin-calculator-business",
  "ai-email-subject-line-generator",
  "ai-cold-email-generator",
  "ai-linkedin-post-generator",
  "ai-resume-summary-generator",
  "ai-product-description-generator",
  "json-validator",
  "base64-encoder-decoder",
  "url-encoder-decoder",
  "regex-tester",
  "api-response-formatter",
  "moving-cost-calculator-usa",
  "electricity-cost-calculator-usa",
  "internet-speed-requirement-calculator",
  "budget-planner-monthly-usa",
  "daily-calorie-calculator",
  "business-name-generator",
  "username-generator",
  "random-name-generator",
  "startup-name-generator",
  "brand-name-generator-ai",
  "time-zone-converter",
  "date-difference-calculator",
  "age-calculator",
  "unit-price-calculator",
  "discount-calculator",
];

describe("SEO validation for new finance tools", () => {
  it("includes required SEO fields and country-modifier intent", () => {
    for (const slug of newFinanceSlugs) {
      const tool = tools.find((item) => item.slug === slug);
      expect(tool).toBeTruthy();
      expect(tool?.keywords.length).toBeGreaterThanOrEqual(5);
      expect(tool?.related.length).toBeGreaterThanOrEqual(3);
      expect(tool?.faqs.length).toBeGreaterThanOrEqual(5);
      expect(tool?.howToUse.length).toBeGreaterThanOrEqual(4);
      expect(tool?.keywords.join(" ").toLowerCase()).toMatch(/usa|uk|canada|australia/);
    }
  });

  it("builds metadata titles and descriptions for each new tool page", () => {
    for (const slug of newFinanceSlugs) {
      const tool = tools.find((item) => item.slug === slug);
      if (!tool) continue;
      const metadata = toolMetadata(tool);
      expect(metadata.title).toContain(tool.name);
      expect(metadata.description.length).toBeGreaterThan(24);
      expect(metadata.description.length).toBeLessThanOrEqual(158);
      expect(
        metadata.description.includes(tool.description.trim()) ||
          metadata.description.startsWith(tool.description.trim().slice(0, Math.min(48, tool.description.trim().length))),
      ).toBe(true);
      expect(metadata.alternates.canonical).toBe(`/tools/${tool.slug}`);
    }
  });
});
