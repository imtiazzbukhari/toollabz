import { describe, it, expect } from "vitest";
import { tools } from "@/lib/tools/data";
import {
  getHomepageFeaturedGuidePins,
  getHomepageRecentlyUpdatedTools,
  HOMEPAGE_FEATURED_GUIDE_PIN_POOL,
} from "@/lib/homepage-content-surface";
import { HOMEPAGE_MAJOR_SHOWCASE_SLUGS, POPULAR_TOOL_SLUGS } from "@/lib/tools/popular-tools";

describe("homepage-content-surface", () => {
  it("recent picks exclude popular and major slugs, no duplicates", () => {
    const excluded = new Set<string>([...POPULAR_TOOL_SLUGS, ...HOMEPAGE_MAJOR_SHOWCASE_SLUGS]);
    const recent = getHomepageRecentlyUpdatedTools(tools, 12);
    expect(recent.length).toBe(12);
    for (const t of recent) expect(excluded.has(t.slug)).toBe(false);
    expect(new Set(recent.map((t) => t.slug)).size).toBe(12);
  });

  it("featured guide pins are a deterministic subset of the pool", () => {
    const pins = getHomepageFeaturedGuidePins(6);
    expect(pins.length).toBe(6);
    const poolHrefs = new Set(HOMEPAGE_FEATURED_GUIDE_PIN_POOL.map((p) => p.href));
    for (const p of pins) expect(poolHrefs.has(p.href)).toBe(true);
    expect(new Set(pins.map((p) => p.href)).size).toBe(6);
  });
});
