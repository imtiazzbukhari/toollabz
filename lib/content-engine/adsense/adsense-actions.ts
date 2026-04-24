import type { AdsenseReadinessIssue } from "./adsense-readiness";

export type AdsenseAction = {
  issueKey: string;
  targetPage: string;
  fix: string;
  expectedImpact: "high" | "medium" | "low";
  priority: number;
};

function toAction(issue: AdsenseReadinessIssue): AdsenseAction {
  if (issue.key === "policy_pages") {
    return {
      issueKey: issue.key,
      targetPage: "/privacy, /terms, /contact",
      fix: "Publish and globally link policy pages with clear footer navigation.",
      expectedImpact: "high",
      priority: 100,
    };
  }
  if (issue.key === "content_depth") {
    return {
      issueKey: issue.key,
      targetPage: "/blog/* (thin pages)",
      fix: "Expand weak articles to include worked examples, FAQ depth, and conversion bridge sections.",
      expectedImpact: "high",
      priority: 90,
    };
  }
  if (issue.key === "monetization_coverage") {
    return {
      issueKey: issue.key,
      targetPage: "high-traffic low-RPM pages",
      fix: "Add CTA blocks and 1-2 relevant tool links with intent-matching anchors.",
      expectedImpact: "high",
      priority: 88,
    };
  }
  if (issue.key === "content_uniqueness") {
    return {
      issueKey: issue.key,
      targetPage: "/blog/* (duplicate angle set)",
      fix: "Rewrite overlapping intros and titles; create comparison and advanced variants.",
      expectedImpact: "medium",
      priority: 75,
    };
  }
  return {
    issueKey: issue.key,
    targetPage: "/",
    fix: issue.recommendation,
    expectedImpact: issue.severity === "high" ? "high" : "medium",
    priority: issue.severity === "high" ? 70 : 55,
  };
}

export function buildAdsenseActions(issues: readonly AdsenseReadinessIssue[]): AdsenseAction[] {
  return issues
    .map(toAction)
    .sort((a, b) => b.priority - a.priority || a.issueKey.localeCompare(b.issueKey))
    .slice(0, 5);
}
