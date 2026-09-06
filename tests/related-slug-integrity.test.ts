import { describe, expect, it } from "vitest";
import { tools } from "../lib/tools/data";
import { LOCALIZED_RELATED_SLUGS, LOCALIZED_TOOL_SLUGS, localizedRelatedSlugs } from "../lib/i18n/catalog";

describe("related slug integrity", () => {
  const slugs = new Set(tools.map((t) => t.slug));

  it("every explicit related[] slug exists in the catalog", () => {
    const missing: string[] = [];
    for (const tool of tools) {
      for (const related of tool.related) {
        if (!slugs.has(related)) missing.push(`${tool.slug} → ${related}`);
      }
    }
    expect(missing, missing.join("\n")).toEqual([]);
  });

  it("localized related maps only catalog tools and stays topical", () => {
    for (const slug of LOCALIZED_TOOL_SLUGS) {
      const related = localizedRelatedSlugs(slug);
      expect(related.length).toBeGreaterThanOrEqual(2);
      expect(related).not.toContain(slug);
      for (const rel of related) {
        expect(LOCALIZED_TOOL_SLUGS).toContain(rel);
        expect(slugs.has(rel)).toBe(true);
      }
    }
    expect(Object.keys(LOCALIZED_RELATED_SLUGS).sort()).toEqual([...LOCALIZED_TOOL_SLUGS].sort());
    expect(localizedRelatedSlugs("loan-calculator")).toContain("compound-interest-calculator");
    expect(localizedRelatedSlugs("profit-margin-calculator")).toContain("roi-calculator");
    expect(localizedRelatedSlugs("loan-calculator")).not.toContain("bmi-calculator");
    expect(localizedRelatedSlugs("json-formatter")).not.toContain("loan-calculator");
  });

  it("localized BMI and tip tools have inbound English related links", () => {
    const inbound = (target: string) => tools.filter((t) => t.related.includes(target)).map((t) => t.slug);
    expect(inbound("bmi-calculator").length).toBeGreaterThanOrEqual(2);
    expect(inbound("tip-calculator")).toContain("tip-calculator-split-bill");
    expect(inbound("character-counter")).toContain("word-counter");
  });
});
