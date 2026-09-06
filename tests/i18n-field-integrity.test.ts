import { describe, expect, it } from "vitest";
import { LOCALES } from "../lib/i18n/locales";
import { LOCALIZED_HUB_PATHS, LOCALIZED_HUB_TOOLS, LOCALIZED_TOOL_SLUGS } from "../lib/i18n/catalog";
import { getToolCopy } from "../lib/i18n/tool-messages";
import { localizeToolDefinition } from "../lib/i18n/localize-tool";
import { toolMap } from "../lib/tools/data";

describe("localized field keys match the calculator engine", () => {
  it("every locale field label key exists on the ToolDefinition (or is a select option overlay)", () => {
    const mismatches: string[] = [];
    for (const slug of LOCALIZED_TOOL_SLUGS) {
      const tool = toolMap.get(slug);
      if (!tool) throw new Error(`missing tool ${slug}`);
      const fieldNames = new Set(tool.fields.map((f) => f.name));
      const optionKeys = new Set(
        tool.fields.flatMap((f) => (f.options ?? []).map((o) => `${f.name}.${o.value}`)),
      );
      for (const locale of LOCALES) {
        const copy = getToolCopy(locale, slug);
        for (const key of Object.keys(copy.fields)) {
          if (fieldNames.has(key) || optionKeys.has(key)) continue;
          mismatches.push(`${locale} ${slug} extra key ${key}`);
        }
        for (const name of fieldNames) {
          if (!copy.fields[name]) mismatches.push(`${locale} ${slug} missing label for ${name}`);
        }
      }
    }
    expect(mismatches, mismatches.join("\n")).toEqual([]);
  });

  it("French field labels are applied to the workspace definition", () => {
    const loan = toolMap.get("loan-calculator");
    if (!loan) throw new Error("missing loan");
    const localized = localizeToolDefinition(loan, "fr");
    expect(localized.fields.find((f) => f.name === "years")?.label).toBe("Durée");
    expect(localized.fields.find((f) => f.name === "principal")?.label).toBe("Capital");
  });

  it("FR/ES/PT high-value tools have complete FAQ and methodology copy", () => {
    for (const locale of ["fr", "es", "pt"] as const) {
      for (const slug of ["loan-calculator", "salary-after-tax-calculator", "profit-margin-calculator"] as const) {
        const copy = getToolCopy(locale, slug);
        expect(copy.faqs.length, `${locale} ${slug} faqs`).toBeGreaterThanOrEqual(2);
        expect(copy.whoItsFor.length, `${locale} ${slug} who`).toBeGreaterThan(40);
        expect(copy.howItWorks.length, `${locale} ${slug} how`).toBeGreaterThan(40);
        expect(copy.assumptions.length, `${locale} ${slug} assumptions`).toBeGreaterThanOrEqual(2);
      }
      expect(getToolCopy(locale, "vat-calculator").h1.toLowerCase()).toContain("uk");
    }
  });

  it("localized hubs list topical catalog tools instead of an empty intro", () => {
    expect(LOCALIZED_HUB_TOOLS["/finance-tools"]).toContain("loan-calculator");
    expect(LOCALIZED_HUB_TOOLS["/business-tools"]).toContain("profit-margin-calculator");
    expect(LOCALIZED_HUB_TOOLS["/real-estate-tools"]).toContain("loan-calculator");
    expect(LOCALIZED_HUB_TOOLS["/real-estate-tools"]).not.toContain("rental-yield-calculator-uk");
    expect(Object.keys(LOCALIZED_HUB_TOOLS).sort()).toEqual([...LOCALIZED_HUB_PATHS].sort());
  });
});
