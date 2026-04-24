import { existsSync } from "node:fs";
import path from "node:path";
import { blogPosts } from "@/lib/blog/registry";
import { tools } from "@/lib/tools/data";
import type { PerformanceAggregates } from "../performance/types";
import { buildMonetizationGapEngine } from "../dashboard/monetization-gap";

export type AdsenseReadinessIssue = {
  key:
    | "content_depth"
    | "content_uniqueness"
    | "page_value"
    | "navigation_completeness"
    | "policy_pages"
    | "monetization_coverage";
  severity: "high" | "medium" | "low";
  message: string;
  recommendation: string;
};

export type AdsenseReadinessReport = {
  score: number;
  approvalProbability: number;
  checks: {
    contentDepth: number;
    uniqueness: number;
    pageValue: number;
    navigation: number;
    policyPages: number;
    monetizationCoverage: number;
  };
  issues: AdsenseReadinessIssue[];
};

function policyPageExists(slug: string): boolean {
  return existsSync(path.join(process.cwd(), "app", slug, "page.tsx"));
}

function avgDescriptionWords(): number {
  if (!blogPosts.length) return 0;
  const total = blogPosts.reduce((n, p) => n + (p.description?.split(/\s+/).filter(Boolean).length ?? 0), 0);
  return total / blogPosts.length;
}

function uniquenessScore(): number {
  if (!blogPosts.length) return 0;
  const titles = new Set<string>();
  let duplicates = 0;
  for (const p of blogPosts) {
    const t = p.title.trim().toLowerCase();
    if (titles.has(t)) duplicates += 1;
    titles.add(t);
  }
  return Math.max(0, Math.min(100, Math.round(100 - (duplicates / Math.max(1, blogPosts.length)) * 100)));
}

export function buildAdsenseReadinessReport(performance: PerformanceAggregates | null): AdsenseReadinessReport {
  const issues: AdsenseReadinessIssue[] = [];
  const policyPages = ["privacy", "terms", "contact"];
  const policyHits = policyPages.filter((p) => policyPageExists(p));
  const policyScore = Math.round((policyHits.length / policyPages.length) * 100);
  if (policyScore < 100) {
    issues.push({
      key: "policy_pages",
      severity: "high",
      message: "Required policy pages are incomplete.",
      recommendation: "Ensure Privacy, Terms, and Contact pages are present and linked globally.",
    });
  }

  const navScore = tools.length >= 30 ? 100 : tools.length >= 20 ? 78 : 55;
  if (navScore < 80) {
    issues.push({
      key: "navigation_completeness",
      severity: "medium",
      message: "Navigation depth is low for broad discovery.",
      recommendation: "Add category discoverability and supporting hubs to improve crawl/value signals.",
    });
  }

  const depthWords = avgDescriptionWords();
  const contentDepth = depthWords >= 28 ? 100 : depthWords >= 20 ? 80 : depthWords >= 14 ? 62 : 40;
  if (contentDepth < 70) {
    issues.push({
      key: "content_depth",
      severity: "high",
      message: "Content depth appears thin on average metadata/article setup.",
      recommendation: "Increase article depth and richer summaries before scaling publication.",
    });
  }

  const uniq = uniquenessScore();
  if (uniq < 85) {
    issues.push({
      key: "content_uniqueness",
      severity: "high",
      message: "Duplicate or near-duplicate content patterns detected.",
      recommendation: "Diversify titles/angles and avoid repeated template-only article variants.",
    });
  }

  const valueSignal =
    performance?.pages?.length && performance.pages.length > 0
      ? Math.round(
          Math.min(
            100,
            (performance.pages.filter((p) => p.clicks >= 25).length / performance.pages.length) * 70 +
              Math.min(30, (performance.pageRevenue?.filter((r) => r.rpm >= 6).length ?? 0) * 3),
          ),
        )
      : 45;
  if (valueSignal < 65) {
    issues.push({
      key: "page_value",
      severity: "medium",
      message: "Insufficient high-value traffic/revenue evidence on key pages.",
      recommendation: "Focus updates on high-intent pages and reinforce conversion + monetization blocks.",
    });
  }

  const monetizationCoverage = performance
    ? Math.max(0, 100 - Math.min(90, buildMonetizationGapEngine(performance, null, 100).length * 3))
    : 40;
  if (monetizationCoverage < 65) {
    issues.push({
      key: "monetization_coverage",
      severity: "medium",
      message: "Traffic pages are under-monetized.",
      recommendation: "Apply CTA/tool-link blocks and safe ad placement suggestions on gap pages.",
    });
  }

  const score = Math.round(
    contentDepth * 0.2 + uniq * 0.18 + valueSignal * 0.2 + navScore * 0.14 + policyScore * 0.18 + monetizationCoverage * 0.1,
  );
  const approvalProbability = Math.max(5, Math.min(98, Math.round(score * 0.92 - issues.filter((i) => i.severity === "high").length * 6)));

  return {
    score,
    approvalProbability,
    checks: {
      contentDepth,
      uniqueness: uniq,
      pageValue: valueSignal,
      navigation: navScore,
      policyPages: policyScore,
      monetizationCoverage,
    },
    issues,
  };
}
