import { describe, expect, it } from "vitest";
import { tools } from "../lib/tools/data";
import { toolMetadata } from "../lib/seo";

describe("tool SERP metadata", () => {
  it("uses unique titles and includes tool name for every tool", () => {
    const titles = new Map<string, string[]>();
    for (const tool of tools) {
      const { title } = toolMetadata(tool);
      expect(typeof title).toBe("string");
      expect(title).toContain(tool.name);
      const list = titles.get(title) ?? [];
      list.push(tool.slug);
      titles.set(title, list);
    }
    const dupes = [...titles.entries()].filter(([, slugs]) => slugs.length > 1);
    expect(dupes, `Duplicate titles: ${JSON.stringify(dupes)}`).toEqual([]);
  });

  it("keeps meta descriptions within 140–160 chars (auto path)", () => {
    for (const tool of tools) {
      const { description } = toolMetadata(tool);
      expect(description.length).toBeGreaterThanOrEqual(140);
      expect(description.length).toBeLessThanOrEqual(160);
    }
  });
});
