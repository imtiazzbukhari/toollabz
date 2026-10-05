import { describe, expect, it } from "vitest";
import { tools } from "../lib/tools/data";
import { getToolFaqs } from "../lib/tools/content";

const BOILERPLATE = /people also ask|long-tail intent|search variations around|what if .* disagrees with another calculator/i;

describe("tool FAQs are tool-specific", () => {
  it("never exceeds 8 FAQs and never renders empty", () => {
    for (const tool of tools) {
      const faqs = getToolFaqs(tool);
      expect(faqs.length).toBeLessThanOrEqual(8);
      expect(faqs.length).toBeGreaterThan(0);
    }
  });

  it("contains no keyword-template boilerplate questions", () => {
    for (const tool of tools) {
      for (const faq of getToolFaqs(tool)) {
        expect(faq.question, `${tool.slug}: ${faq.question}`).not.toMatch(BOILERPLATE);
      }
    }
  });

  it("keeps a professional-advice disclaimer on finance tools", () => {
    const loan = tools.find((t) => t.slug === "loan-calculator")!;
    expect(getToolFaqs(loan).some((f) => /substitute for professional advice/i.test(f.question))).toBe(true);
  });
});
