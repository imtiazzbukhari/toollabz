import { describe, expect, it } from "vitest";
import { tools } from "../lib/tools/data";
import { getToolInsight, TOOL_INSIGHTS } from "../lib/tools/tool-insights";

describe("tool insights", () => {
  it("defines a unique insight entry for every tool slug", () => {
    for (const tool of tools) {
      const insight = getToolInsight(tool.slug);
      expect(insight, `missing insight for ${tool.slug}`).toBeTruthy();
      expect(insight!.quickAnswer.length).toBeGreaterThan(12);
      expect(insight!.explain.length).toBeGreaterThan(24);
      expect(insight!.example.length).toBeGreaterThan(16);
      expect(insight!.insights.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("has no duplicate quickAnswer strings (sanity check against copy-paste)", () => {
    const answers = Object.values(TOOL_INSIGHTS).map((i) => i.quickAnswer);
    const unique = new Set(answers);
    expect(unique.size).toBe(answers.length);
  });
});
