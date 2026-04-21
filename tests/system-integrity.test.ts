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
