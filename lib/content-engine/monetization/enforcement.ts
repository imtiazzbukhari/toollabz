import type { BlogDraftPayload } from "../types";
import { detectIntentStage } from "../funnel/intent-stage";
import { adsenseApprovalModeEnabled } from "../config";

export type MonetizationEnforcementResult = {
  passed: boolean;
  score: number;
  issues: string[];
  notes: string[];
};

function countToolLinks(md: string): number {
  return (md.match(/\]\(\/tools\/[a-z0-9-]+(?:\/|\))/gi) ?? []).length;
}

function hasCta(md: string): boolean {
  return /\b(try|use|calculate|estimate|start|compare)\b.{0,28}\b(tool|calculator|planner|checker)\b/i.test(md);
}

function hasMonetizationIntent(topic: string, keyword: string, body: string): boolean {
  const sample = `${topic} ${keyword} ${body.slice(0, 1800)}`;
  return /\b(cost|price|budget|save|rate|loan|tax|salary|mortgage|insurance|roi|revenue|comparison|best)\b/i.test(sample);
}

function thinOrTemplateRisk(md: string): string[] {
  const issues: string[] = [];
  const words = md.split(/\s+/).filter(Boolean).length;
  if (words < 600) issues.push("thin_content");
  const repeatedHeadings = (md.match(/^##\s+/gm) ?? []).length;
  if (repeatedHeadings < 4) issues.push("low_structural_depth");
  if ((md.match(/\b(lorem ipsum|in conclusion|click here)\b/gi) ?? []).length > 0) issues.push("low_quality_pattern");
  return issues;
}

export function enforceBlogMonetization(input: {
  topic: string;
  primaryKeyword: string;
  draft: BlogDraftPayload;
}): MonetizationEnforcementResult {
  const issues: string[] = [];
  const notes: string[] = [];
  const toolLinks = countToolLinks(input.draft.bodyMarkdown);
  const cta = hasCta(input.draft.bodyMarkdown);
  const monetizationIntent = hasMonetizationIntent(input.topic, input.primaryKeyword, input.draft.bodyMarkdown);
  const stage = detectIntentStage(input.primaryKeyword, input.topic);
  const qualityIssues = thinOrTemplateRisk(input.draft.bodyMarkdown);

  if (toolLinks < 1) issues.push("missing_tool_links");
  if (!cta) issues.push("missing_cta");
  if (!monetizationIntent) issues.push("missing_monetization_intent");
  issues.push(...qualityIssues);
  if (adsenseApprovalModeEnabled() && stage === "awareness" && toolLinks < 2) {
    issues.push("approval_mode_requires_stronger_commercial_bridging");
  }

  if (stage === "decision" || stage === "comparison") notes.push("high_intent_topic");
  if (toolLinks >= 2) notes.push("tool_linking_ok");
  if (cta) notes.push("cta_ok");

  const score = Math.max(0, 100 - issues.length * (adsenseApprovalModeEnabled() ? 14 : 10));
  const hardBlocked = adsenseApprovalModeEnabled()
    ? issues.some((i) => i === "thin_content" || i === "missing_monetization_intent" || i === "missing_cta")
    : issues.some((i) => i === "thin_content");
  return { passed: !hardBlocked, score, issues, notes };
}

export function enforceToolPageMonetization(input: { contentMarkdown: string; path: string }): MonetizationEnforcementResult {
  const issues: string[] = [];
  if (input.contentMarkdown.split(/\s+/).filter(Boolean).length < 250) issues.push("missing_supporting_content");
  if (countToolLinks(input.contentMarkdown) < 1) issues.push("missing_internal_links");
  const score = Math.max(0, 100 - issues.length * 18);
  return {
    passed: issues.length === 0,
    score,
    issues,
    notes: [`tool_page_checked:${input.path}`],
  };
}
