export type IntentStage = "awareness" | "comparison" | "decision";

/**
 * Map keyword/topic to funnel stage for content shape + CTA strength.
 */
export function detectIntentStage(primaryKeyword: string, topic?: string): IntentStage {
  const t = `${topic ?? ""} ${primaryKeyword}`.toLowerCase();
  if (
    /\b(best|vs|versus|compare|comparison|alternative|alternatives|difference between|which is better|should i|pros and cons|tradeoff|trade-off)\b/i.test(
      t,
    )
  ) {
    return "comparison";
  }
  if (
    /\b(calculator|calculate|compute|tool|worksheet|schedule|payoff|refinance|apply|quote|payment amount|emi|amortization)\b/i.test(
      t,
    )
  ) {
    return "decision";
  }
  return "awareness";
}

export function intentStageSystemAddendum(stage: IntentStage): string {
  if (stage === "awareness") {
    return [
      "Funnel stage: AWARENESS.",
      "Write as a guide: define the problem, teach the vocabulary, and help the reader orient before choosing a path.",
      "Avoid hard-selling a single product; end with clear options and what to read or try next.",
    ].join(" ");
  }
  if (stage === "comparison") {
    return [
      "Funnel stage: COMPARISON.",
      "Structure around tradeoffs: criteria, who each option fits, and common failure modes.",
      "Use comparison tables in Markdown where helpful (short rows, plain language).",
    ].join(" ");
  }
  return [
    "Funnel stage: DECISION.",
    "Assume the reader is ready to act: lead with inputs they need, steps to validate, and how to sanity-check results.",
    "Tie examples to a concrete decision window (e.g. renewal, refinance window, offer deadline) without inventing legal advice.",
  ].join(" ");
}
