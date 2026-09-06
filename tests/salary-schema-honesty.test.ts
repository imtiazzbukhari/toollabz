import { describe, expect, it } from "vitest";
import { toolMap } from "../lib/tools/data";
import { faqSchema, toolMetadata, toolSchema } from "../lib/seo";
import { getToolCopy } from "../lib/i18n/tool-messages";
import { getToolInsight } from "../lib/tools/tool-insights";
import { LOCALES } from "../lib/i18n/locales";

/** Product chrome that presents this slug as a UK tax engine (false). */
const UK_PRODUCT_CLAIM =
  /\(UK\)|UK Take-Home|2026\/27|Royaume-Uni|Reino Unido|Storbritannien|Spojeném království|Regatul Unit|Egyesült Királyság|Ηνωμένο Βασίλειο|Велик(ій|а) Британ|Обединеното кралство|Spojenom kráľovstve|Ujedinjenom Kraljevstvu|Jungtinėje Karalystėje|Apvienotajā Karalistē|Ühendkuningriigis|Združenem kraljestvu/i;

describe("salary-after-tax generic tool honesty", () => {
  const tool = toolMap.get("salary-after-tax-calculator");
  if (!tool) throw new Error("missing salary-after-tax-calculator");

  it("English title, meta, and JSON-LD describe the flat-rate tool", () => {
    const meta = toolMetadata(tool);
    const schema = toolSchema(tool, "/tools/salary-after-tax-calculator");
    const title = typeof meta.title === "string" ? meta.title : String(meta.title);
    expect(title).not.toMatch(UK_PRODUCT_CLAIM);
    expect(meta.description).not.toMatch(/National Insurance|student loan|auto-enrolment/i);
    expect(schema.name).toBe("Salary After Tax Calculator");
    expect(String(schema.description)).toMatch(/tax rate/i);
    expect(String(schema.description)).not.toMatch(/National Insurance|student loan/i);
    expect(schema.url).toMatch(/\/tools\/salary-after-tax-calculator$/);
    const insight = getToolInsight("salary-after-tax-calculator");
    expect(insight.quickAnswer).toMatch(/1\s*[−-]/);
    expect(insight.quickAnswer).not.toMatch(/federal brackets|PAYE flavor|UK Take-Home/i);
    const faq = faqSchema(tool);
    const faqText = JSON.stringify(faq);
    expect(faqText).toMatch(/1\s*[−-]/);
    expect(faqText).not.toMatch(/UK Take-Home|2026\/27|PAYE flavor/i);
  });

  it("localized title/H1/name do not brand the flat-rate tool as UK-only", () => {
    for (const locale of LOCALES) {
      const copy = getToolCopy(locale, "salary-after-tax-calculator");
      expect(copy.h1, `${locale} h1`).not.toMatch(UK_PRODUCT_CLAIM);
      expect(copy.title, `${locale} title`).not.toMatch(UK_PRODUCT_CLAIM);
      expect(copy.name, `${locale} name`).not.toMatch(UK_PRODUCT_CLAIM);
      expect(copy.formula).toMatch(/1\s*[−-]/);
    }
  });
});
