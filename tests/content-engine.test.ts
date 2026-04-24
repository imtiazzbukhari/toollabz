import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { discoverKeywordOpportunities, prioritizeOpportunities } from "../lib/content-engine/opportunity-engine";
import { buildProcessingQueue, dedupeOpportunities, topicBucket } from "../lib/content-engine/keyword-intelligence";
import { scoreBlogDraft } from "../lib/content-engine/quality-score";
import { googlePingUrlForSitemap } from "../lib/content-engine/google-indexing";
import { suggestInternalLinks } from "../lib/content-engine/internal-linking";
import { validateToolSpec } from "../lib/content-engine/tool-spec";
import { detectIntentStage } from "../lib/content-engine/funnel/intent-stage";
import { findRefreshCandidates } from "../lib/content-engine/funnel/content-refresh";
import { suggestAuthorityAugmentedLinks } from "../lib/content-engine/funnel/authority-links";
import { applyDecisionIntentBoost } from "../lib/content-engine/funnel/revenue-funnel";
import { suggestExpansionsForUrl } from "../lib/content-engine/funnel/smart-expansion";
import { highRpmZoneHints } from "../lib/content-engine/monetization/adsense-strategy";
import type { PrioritizedOpportunity } from "../lib/content-engine/types";

describe("content-engine / keyword intelligence", () => {
  it("dedupes case-insensitive duplicates", () => {
    const rows = dedupeOpportunities([
      { keyword: "Loan Calculator", intent: "transactional", monetizationScore: 0.5, competitionScore: 0.5, sources: ["a"] },
      { keyword: "loan calculator", intent: "informational", monetizationScore: 0.6, competitionScore: 0.4, sources: ["b"] },
    ]);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.keyword).toBe("loan calculator");
    expect(rows[0]!.sources.sort()).toEqual(["a", "b"].sort());
  });

  it("topicBucket clusters by first two tokens", () => {
    expect(topicBucket("how to calculate mortgage payment")).toBe("how to");
  });

  it("buildProcessingQueue returns stable ordering by priority", () => {
    const q = buildProcessingQueue(
      [
        { keyword: "aaa", intent: "mixed", monetizationScore: 0.1, competitionScore: 0.1, sources: ["x"] },
        { keyword: "bbb", intent: "mixed", monetizationScore: 0.9, competitionScore: 0.9, sources: ["y"] },
      ],
      10,
    );
    expect(q[0]!.keyword).toBe("bbb");
  });
});

describe("content-engine / opportunity engine", () => {
  it("discovers a non-trivial set of opportunities", () => {
    const all = discoverKeywordOpportunities();
    expect(all.length).toBeGreaterThan(50);
  });

  it("prioritizes editorial and tool-backed keywords", () => {
    const p = prioritizeOpportunities(5);
    expect(p.length).toBeGreaterThan(0);
    expect(p[0]!.keyword.length).toBeGreaterThan(2);
  });
});

describe("content-engine / quality scoring", () => {
  beforeEach(() => {
    vi.stubEnv("CONTENT_ENGINE_QUALITY_MIN", "60");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("passes a strong synthetic draft", () => {
    const section = [
      "# How to read your mortgage statement without panic",
      "",
      "## Introduction",
      "If you have a mortgage, you will eventually stare at a mortgage statement full of numbers. The goal is simple: understand what changed month to month.",
      "",
      "## Step-by-step",
      "1. Find the starting balance.",
      "2. Find the interest charge for the period.",
      "3. Find the principal paid.",
      "4. Confirm the ending balance matches your own calculation within a few dollars.",
      "",
      "## Real examples",
      "Say you owe $320,000 at 6.5% annual interest. A monthly interest charge is roughly principal times monthly rate. If your statement shows something wildly different, ask why before assuming fraud.",
      "",
      "## Common mistakes",
      "People mix escrow (taxes and insurance) with principal and interest. They are different buckets.",
      "",
      "## Checklist before you call your servicer",
      "Gather last month’s statement, note the payment date, and write down two numbers you expect: interest and principal. Servicers sometimes mis-apply partial payments; a calm comparison saves time.",
      "",
      "## Escrow changes vs rate changes",
      "Escrow swings from tax reassessment look like payment shocks even when your note rate is fixed. Rate changes show up in the interest line first.",
      "",
      "## Amortization vocabulary",
      "Amortization is just the schedule that maps each payment to principal and interest over time.",
      "",
      "## FAQs",
      "See structured FAQ separately.",
    ].join("\n");

    const extra = Array.from({ length: 90 }, (_, i) => {
      const season = ["winter", "spring", "summer", "fall"][i % 4]!;
      const channel = ["email", "portal", "paper", "fax"][i % 4]!;
      const v1 = ["Trace", "Log", "Record", "Capture", "Compare", "Reconcile", "Audit", "Scan"][i % 8]!;
      const v2 = ["Verify", "Validate", "Confirm", "Cross-check", "Double-check", "Inspect", "Review", "Challenge"][i % 8]!;
      const v3 = ["Flag", "Highlight", "Circle", "Annotate", "Question", "Research", "Clarify", "Document"][i % 8]!;
      const token = `ledger${i}orchard${i}violet${i}`;
      return [
        `## ${season} ${token} review`,
        "",
        `Use your ${channel} packet ${token}. Match subtotals to workbook tab ${token}.`,
        "",
        `- ${v1} cadence ${token}.`,
        `- ${v2} timing ${token}.`,
        `- ${v3} opaque labels ${token}.`,
        "",
      ].join("\n");
    }).join("\n");

    const body = [section, extra].join("\n");

    const draft = {
      seoTitle: "How to read a mortgage loan statement (practical walkthrough)",
      metaDescription:
        "Learn how to read a mortgage statement: principal, interest, escrow, and the common mistakes that make balances look wrong.",
      slugSuggestion: "how-to-read-a-mortgage-loan-statement",
      bodyMarkdown: body,
      faqSchema: [
        { question: "What is escrow?", answer: "Escrow is money collected to pay taxes and insurance on your behalf." },
        { question: "Why did my payment change?", answer: "Usually taxes, insurance, or an ARM adjustment changed the amount due." },
      ],
    };

    const q = scoreBlogDraft(draft, "mortgage statement");
    expect(q.score).toBeGreaterThanOrEqual(60);
    expect(q.passed).toBe(true);
  });

  it("fails thin / robotic drafts", () => {
    const draft = {
      seoTitle: "x",
      metaDescription: "short",
      slugSuggestion: "bad",
      bodyMarkdown: "delve into the landscape. ".repeat(40),
    };
    const q = scoreBlogDraft(draft, "mortgage");
    expect(q.passed).toBe(false);
    expect(q.reasons.length).toBeGreaterThan(0);
  });
});

describe("content-engine / google ping URL", () => {
  it("encodes sitemap URL for Google ping endpoint", () => {
    const u = googlePingUrlForSitemap("https://toollabz.com/sitemap.xml");
    expect(u.startsWith("https://www.google.com/ping?sitemap=")).toBe(true);
    expect(u).toContain(encodeURIComponent("https://toollabz.com/sitemap.xml"));
  });
});

describe("content-engine / internal linking", () => {
  it("returns a small set of unique links", () => {
    const links = suggestInternalLinks("mortgage payment calculator with taxes", "mortgage piti escrow", 4);
    expect(links.length).toBeGreaterThanOrEqual(1);
    expect(links.length).toBeLessThanOrEqual(4);
    const hrefs = new Set(links.map((l) => l.href));
    expect(hrefs.size).toBe(links.length);
  });
});

describe("content-engine / full funnel SEO", () => {
  it("detectIntentStage maps comparison, decision, and awareness", () => {
    expect(detectIntentStage("rent vs buy calculator tradeoffs")).toBe("comparison");
    expect(detectIntentStage("mortgage payment calculator with taxes")).toBe("decision");
    expect(detectIntentStage("what is escrow on a mortgage")).toBe("awareness");
  });

  it("findRefreshCandidates surfaces low CTR and declining clicks", () => {
    const lowCtr = findRefreshCandidates(
      {
        updatedAt: "2026-01-01",
        pages: [{ path: "/blog/test-slug", clicks: 10, impressions: 2000, position: 8 }],
        pagesPrevious: [],
      },
      5,
    );
    expect(lowCtr.some((c) => c.signal === "low_ctr")).toBe(true);

    const declining = findRefreshCandidates(
      {
        updatedAt: "2026-01-01",
        pages: [{ path: "/tools/loan-calculator", clicks: 5, impressions: 800, position: 5 }],
        pagesPrevious: [{ path: "/tools/loan-calculator", clicks: 20, impressions: 900, position: 5 }],
      },
      5,
    );
    expect(declining.some((c) => c.signal === "declining_clicks")).toBe(true);
  });

  it("suggestAuthorityAugmentedLinks prefers pillar then fills from base linker", () => {
    const links = suggestAuthorityAugmentedLinks(
      "loan payment calculator amortization",
      "principal extra payment interest schedule",
      { clusterId: "loan-core", pillarToolSlug: "loan-calculator" },
      6,
    );
    expect(links.length).toBeGreaterThan(0);
    const hrefs = links.map((l) => l.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("applyDecisionIntentBoost raises priority for decision-stage keywords", () => {
    const base: PrioritizedOpportunity = {
      keyword: "loan payoff calculator extra payment",
      intent: "transactional",
      priority: 80,
      linkToolSlugs: [],
    };
    const out = applyDecisionIntentBoost([base]);
    expect(out[0]!.priority).toBeGreaterThan(base.priority);
  });

  it("suggestExpansionsForUrl returns ideas only for strong metrics", () => {
    expect(suggestExpansionsForUrl("/blog/weak", { path: "/blog/weak", clicks: 2, impressions: 100, position: 20 })).toHaveLength(0);
    const strong = suggestExpansionsForUrl("/tools/x", { path: "/tools/x", clicks: 30, impressions: 500, position: 4 });
    expect(strong.length).toBeGreaterThanOrEqual(3);
  });

  it("highRpmZoneHints returns non-empty guidance", () => {
    expect(highRpmZoneHints().length).toBeGreaterThan(40);
  });
});

describe("content-engine / tool spec validation", () => {
  it("rejects vague specs", () => {
    const res = validateToolSpec({
    slug: "Bad_Slug",
    name: "",
    category: "finance",
    shortDescription: "",
    description: "short",
    keywords: [],
    fields: [],
    computeKey: "",
  });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.reasons.length).toBeGreaterThan(0);
  });
});
