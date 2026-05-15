import { describe, expect, it } from "vitest";
import { computeTool } from "../lib/tools/engine";
import { tools } from "../lib/tools/data";
import { getRelatedToolsMergedDeduped } from "../lib/tools/related";

const valueOverrides: Record<string, Record<string, string>> = {
  "due-date-calculator": { lastMenstrualPeriod: "2026-01-10" },
  "medication-dosage-calculator": { concentrationMgPerMl: "0" },
  "time-zone-converter": { time: "14:30", fromOffset: "-5", toOffset: "1" },
  "date-difference-calculator": { startDate: "2026-01-01", endDate: "2026-01-31" },
  "age-calculator": { birthDate: "1995-08-15", asOfDate: "2026-04-09" },
  "json-validator": { json: '{"ok":true}' },
  "json-formatter": { json: '{"ok":true}' },
  "api-response-formatter": { response: '{"status":"ok"}' },
  "ai-citation-checker": {
    pastedText:
      "Studies show that 42% of teams lack clear attribution models. Research suggests multi-touch approaches help. According to experts, data quality matters. See https://example.com/report for methodology and doi 10.1000/182.",
  },
  "retention-hook-analyzer": {
    fullScript:
      "Here is the hook you need for retention\n- step one is clarity\n- step two is proof\nHowever the real mistake is pacing. Watch this next beat for the fix.",
  },
  "html-formatter": { html: "<div><span>a</span></div>" },
  "css-minifier": { css: "body { color: #111; }\n" },
  "json-minifier": { json: '{"a":1,"b":[2]}' },
  "xml-formatter": { xml: "<root><item>1</item></root>" },
  "yaml-validator": { yaml: "service:\n  port: 8080\n" },
  "csv-to-json-converter": { csv: "name,score\nAda,99\nBob,87" },
  "jwt-expiry-checker": { jwt: "eyJhbGciOiJub25lIn0.eyJleHAiOjE4OTM0NTYwMDB9.x" },
  "api-status-checker": { url: "https://example.com/health" },
  "self-employed-tax-calculator-uk": { annualProfit: "48000", incomeTaxPercent: "18", niPercent: "6" },
  "dividend-tax-calculator-uk": { dividendGross: "10000", dividendTaxPercent: "25" },
  "stripe-fee-calculator": { chargeAmount: "120", feePercent: "1.5", fixedFee: "0.2" },
  "paypal-fee-calculator": { saleAmount: "80", feePercent: "2.9", fixedFee: "0.3" },
  "etsy-fee-calculator": { salePrice: "40", listingFee: "0.2", transactionPercent: "6.5", paymentPercent: "4" },
  "ebay-fee-calculator": { soldPrice: "150", finalValuePercent: "12.8", fixedPerOrder: "0.3" },
  "churn-calculator": { startingCustomers: "1000", monthlyChurnPercent: "3", months: "12" },
  "roas-calculator": { conversionRevenue: "24000", adSpend: "6000" },
  "working-days-calculator-uk": { startDate: "2026-01-05", endDate: "2026-01-30", bankHolidayDays: "2" },
  "business-days-calculator": { startDate: "2026-03-01", endDate: "2026-03-31" },
  "random-team-generator": { names: "Ada\nBob\nChen\nDana", teamCount: "2" },
  "lbs-to-kg-converter": { lbs: "150" },
  "feet-to-cm-converter": { feet: "5.75" },
  "pace-calculator": { distance: "10", hours: "0", minutes: "52", seconds: "0" },
  "mph-to-kmh-converter": { mph: "70" },
  "square-feet-to-square-meters-converter": { squareFeet: "1200" },
};

const fallbackForField = (type: string, min?: number, option?: string) => {
  if (type === "select") return option ?? "";
  if (type === "textarea") return "sample text";
  if (type === "number") return String(typeof min === "number" ? Math.max(min, 1) : 1);
  return "sample";
};

describe("system integrity", () => {
  it("all tools compute without runtime crashes", () => {
    for (const tool of tools) {
      const override = valueOverrides[tool.slug] ?? {};
      const form = Object.fromEntries(
        tool.fields.map((field) => [
          field.name,
          override[field.name] ?? fallbackForField(field.type, field.min, field.options?.[0]?.value),
        ]),
      );

      const result = computeTool(tool.slug, form);
      expect(result).toBeTruthy();
      expect(typeof result.title).toBe("string");
      expect(typeof result.value).toBe("string");
    }
  });

  it("related linking pool resolves to at least 3 tools per page", () => {
    for (const tool of tools) {
      const relatedPool = getRelatedToolsMergedDeduped(tool, tools);
      expect(relatedPool.length).toBeGreaterThanOrEqual(3);
    }
  });
});
