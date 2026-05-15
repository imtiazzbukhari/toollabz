import { describe, expect, it } from "vitest";
import { buildDashboardSnapshot } from "../lib/content-engine/dashboard/build-dashboard-snapshot";
import { encodeSeoCookieToken, timingSafeStringEq } from "../lib/content-engine/seo-console-auth";

describe("dashboard / snapshot", () => {
  it("buildDashboardSnapshot returns stable keys", async () => {
    const s = await buildDashboardSnapshot();
    expect(s.overview.blogCount).toBeGreaterThan(0);
    expect(s.overview.toolCount).toBeGreaterThan(0);
    expect(s.priorityEngineOrder.length).toBeGreaterThan(3);
    expect(Array.isArray(s.opportunityEngine.prioritized)).toBe(true);
    expect(s.failSafe.rules.length).toBeGreaterThan(0);
    expect(s.clusterDomination.totalPlannedIdeas).toBeGreaterThan(100);
    expect(s.clusterDomination.summaries.length).toBeGreaterThan(0);
    expect(s.outreachExecution.queueSummary.dailyCap).toBeGreaterThan(0);
    expect(s.competitorIntelligence.path).toContain("competitor-analyze");
    expect(s.pageMetricsProvenance).toBeDefined();
    expect(s.pageMetricsProvenance).toHaveProperty("sourceLabel");
    expect(s.seoDataPlane).toBeDefined();
    expect(Array.isArray(s.orphanLinkHints)).toBe(true);
  });
});

describe("seo-console-auth", () => {
  it("encodeSeoCookieToken round-trips compare with timingSafeStringEq", () => {
    const secret = "test-secret-value-32chars___";
    const tok = encodeSeoCookieToken(secret);
    expect(tok.length).toBeGreaterThan(8);
    expect(timingSafeStringEq(tok, encodeSeoCookieToken(secret))).toBe(true);
    expect(timingSafeStringEq(tok, encodeSeoCookieToken(secret + "x"))).toBe(false);
  });
});
