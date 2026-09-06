import { describe, expect, it } from "vitest";
import { toolMap } from "../lib/tools/data";
import { toolMetadata, toolSchema } from "../lib/seo";
import { getPriorityQuickAnswer, getRelatedArticlesForTool } from "../lib/tools/priority-tool-content";
import { getToolFormula } from "../lib/tools/content";
import { POPULAR_TOOL_SLUGS } from "../lib/tools/popular-tools";

describe("ranking recovery priority pages", () => {
  it("UK rental yield title, formula, and schema match buy-to-let yield intent", () => {
    const tool = toolMap.get("rental-yield-calculator-uk");
    if (!tool) throw new Error("missing rental-yield-calculator-uk");
    const meta = toolMetadata(tool);
    const title = String(meta.title);
    expect(title).toMatch(/rental yield/i);
    expect(title).toMatch(/UK/i);
    expect(title).toMatch(/gross|net/i);
    expect(String(meta.description)).toMatch(/gross|net/i);
    expect(getToolFormula(tool.slug)).toMatch(/monthly rent/i);
    const qa = getPriorityQuickAnswer(tool);
    expect(qa?.answer).toMatch(/monthly rent/i);
    expect(getRelatedArticlesForTool(tool).some((a) => a.url.includes("how-much-can-i-rent-my-house-for-uk"))).toBe(
      true,
    );
    const schema = toolSchema(tool);
    expect(schema.name).toBe("Rental Yield Calculator UK");
    expect(String(schema.description)).toMatch(/buy-to-let|gross/i);
  });

  it("generic salary page stays flat-rate and points to country tools", () => {
    const tool = toolMap.get("salary-after-tax-calculator");
    if (!tool) throw new Error("missing salary-after-tax-calculator");
    const title = String(toolMetadata(tool).title);
    expect(title).not.toMatch(/UK Take-Home|2026\/27/i);
    expect(tool.description).toMatch(/1 − tax rate|1 - tax rate/i);
    expect(tool.related).toContain("salary-after-tax-calculator-uk");
    expect(tool.related).toContain("paycheck-calculator-usa");
    expect(tool.faqs.some((f) => /UK/i.test(f.answer) && /No/i.test(f.answer))).toBe(true);
  });

  it("profit margin page leads with the margin formula and markup contrast", () => {
    const tool = toolMap.get("profit-margin-calculator");
    if (!tool) throw new Error("missing profit-margin-calculator");
    const qa = getPriorityQuickAnswer(tool);
    expect(qa?.answer).toMatch(/revenue/i);
    expect(qa?.answer).toMatch(/markup/i);
    expect(getRelatedArticlesForTool(tool).some((a) => a.url.includes("markup-vs-margin"))).toBe(true);
    expect(tool.related).toContain("markup-calculator");
  });

  it("homepage popular set includes the highest-impression GSC tool", () => {
    expect(POPULAR_TOOL_SLUGS).toContain("rental-yield-calculator-uk");
    expect(POPULAR_TOOL_SLUGS).toHaveLength(16);
  });
});
