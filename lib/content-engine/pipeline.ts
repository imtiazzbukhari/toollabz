import { autoPublishThreshold } from "./config";
import type { BlogDraftPayload, BlogPipelineResult, PublishMode } from "./types";
import { generateBlogDraft } from "./llm-blog";
import { pickVariationProfile } from "./variation";
import { scoreBlogDraft } from "./quality-score";
import { contentEngineLog } from "./logging";
import { detectIntentStage, intentStageSystemAddendum } from "./funnel/intent-stage";
import { conversionLayerSystemAddendum } from "./funnel/conversion-layer";
import { engagementOptimizationAddendum } from "./funnel/engagement";
import { suggestAuthorityAugmentedLinks } from "./funnel/authority-links";
import { findClusterForKeyword } from "./topic-clusters";
import type { IntentStage } from "./funnel/intent-stage";
import { loadBehaviorAggregates } from "./growth/load-behavior-aggregates";
import { behaviorRollupToEngagementHints } from "./growth/engagement-feedback";
import { highIntentContentSystemAddendum } from "./funnel/high-intent-mode";
import { highIntentContentModeEnabled } from "./config";
import { enforceBlogMonetization } from "./monetization/enforcement";
import { adsenseApprovalModeEnabled } from "./config";

function adsenseScan(draft: BlogDraftPayload): string[] {
  const flags: string[] = [];
  const words = draft.bodyMarkdown.split(/\s+/).filter(Boolean).length;
  if (words < 450) flags.push("thin_content_risk: low word count");
  if (!draft.faqSchema || draft.faqSchema.length < 2) flags.push("thin_content_risk: weak FAQ section for trust");
  const l = draft.bodyMarkdown.toLowerCase();
  if ((l.match(/\b(click here|buy now|limited time)\b/g) ?? []).length > 2) flags.push("spam_tone_risk: aggressive CTA language");
  return flags;
}

/**
 * SAFE: always returns a draft + quality report; HTTP layer should never merge without review.
 * AUTO: sets wouldAutoPublish when score clears the higher threshold (still does not write files here).
 */
export type IntentStageMode = "auto" | IntentStage;

export async function runBlogGenerationPipeline(input: {
  topic: string;
  primaryKeyword: string;
  mode: PublishMode;
  /** Optional seed so automated runs vary tone/intro/examples deterministically. */
  variationSeed?: string;
  /** `auto` infers from keyword/topic. */
  intentStage?: IntentStageMode;
  /** When set (e.g. `/blog/foo`), append first-party behavior hints to the LLM prompt. */
  behaviorPath?: string;
  /** Optional override for high-intent action mode; defaults to env flag. */
  highIntentMode?: boolean;
}): Promise<BlogPipelineResult> {
  const { topic, primaryKeyword, mode } = input;
  contentEngineLog({ type: "generate_blog_start", topic, mode });

  const seed = input.variationSeed ?? `${topic}|${primaryKeyword}`;
  const variation = pickVariationProfile(seed);
  const intentStage: IntentStage =
    input.intentStage && input.intentStage !== "auto" ? input.intentStage : detectIntentStage(primaryKeyword, topic);
  let behaviorHintsApplied: string[] | undefined;
  let behaviorAugment = "";
  const bp = input.behaviorPath?.trim();
  if (bp?.startsWith("/")) {
    const agg = loadBehaviorAggregates();
    const rollup = agg?.byPath[bp];
    if (rollup && rollup.sampleCount >= 8) {
      const hints = behaviorRollupToEngagementHints(rollup).filter((h) => !h.hint.startsWith("Low sample"));
      if (hints.length) {
        behaviorHintsApplied = hints.map((h) => h.hint);
        behaviorAugment = [
          "FIRST-PARTY ENGAGEMENT SIGNALS (follow structurally; do not mention analytics or tracking to the reader):",
          ...behaviorHintsApplied.map((h) => `- ${h}`),
        ].join(" ");
      }
    }
  }

  const funnelAugment = [
    intentStageSystemAddendum(intentStage),
    conversionLayerSystemAddendum(),
    highIntentContentSystemAddendum(intentStage, input.highIntentMode ?? highIntentContentModeEnabled()),
    engagementOptimizationAddendum(),
    behaviorAugment,
  ]
    .filter(Boolean)
    .join(" ");

  const draft = await generateBlogDraft(topic, primaryKeyword, variation, funnelAugment);
  const quality = scoreBlogDraft(draft, primaryKeyword);
  const cluster = findClusterForKeyword(primaryKeyword);
  const internalLinks = suggestAuthorityAugmentedLinks(
    topic,
    draft.bodyMarkdown.slice(0, 4000),
    { clusterId: cluster?.id, pillarToolSlug: cluster?.pillarToolSlug },
    6,
  );
  const adsenseFlags = adsenseScan(draft);
  const monetizationGuard = enforceBlogMonetization({ topic, primaryKeyword, draft });
  const approvalMode = adsenseApprovalModeEnabled();
  const approvalModeFlags =
    approvalMode && monetizationGuard.issues.length > 0
      ? [`approval_mode_block:${monetizationGuard.issues.join(",")}`]
      : [];

  const threshold = autoPublishThreshold(mode);
  const passesAdsense = adsenseFlags.length === 0 && monetizationGuard.passed && approvalModeFlags.length === 0;
  const wouldAutoPublish = quality.passed && passesAdsense && quality.score >= threshold;

  if (!quality.passed) {
    contentEngineLog({ type: "generate_blog_rejected", topic, reasons: quality.reasons });
  }
  contentEngineLog({
    type: "generate_blog_done",
    topic,
    mode,
    score: quality.score,
    approved: wouldAutoPublish,
  });

  return {
    mode,
    draft,
    quality: {
      ...quality,
      passed: quality.passed && passesAdsense,
      reasons: [...quality.reasons, ...(passesAdsense ? [] : adsenseFlags), ...monetizationGuard.issues, ...approvalModeFlags],
    },
    wouldAutoPublish,
    internalLinks,
    adsenseFlags: [...adsenseFlags, ...monetizationGuard.issues, ...approvalModeFlags],
    funnel: {
      intentStage,
      internalLinkStrategy: "authority-augmented",
    },
    behaviorHintsApplied,
  };
}
