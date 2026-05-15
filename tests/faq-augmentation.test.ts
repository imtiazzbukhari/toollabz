import { describe, expect, it } from "vitest";
import { tools } from "../lib/tools/data";
import { getToolFaqs } from "../lib/tools/content";
import { isHighIntentTool } from "../lib/tools/faq-expansion";

describe("FAQ augmentation (phase 2)", () => {
  it("caps merged FAQs at 8 and keeps at least 5 for high-intent finance tools", () => {
    const loan = tools.find((t) => t.slug === "loan-calculator");
    expect(loan).toBeTruthy();
    const faqs = getToolFaqs(loan!);
    expect(isHighIntentTool(loan!)).toBe(true);
    expect(faqs.length).toBeGreaterThanOrEqual(5);
    expect(faqs.length).toBeLessThanOrEqual(8);
  });

  it("never exceeds 8 FAQs for any tool", () => {
    for (const tool of tools) {
      const faqs = getToolFaqs(tool);
      expect(faqs.length).toBeLessThanOrEqual(8);
      expect(faqs.length).toBeGreaterThan(0);
    }
  });
});
