import type { BehaviorAggregates } from "../growth/behavior-types";

export type IntentMatchRow = {
  path: string;
  inferredIntent: "informational" | "comparison" | "decision";
  confidence: number;
  sectionAdjustments: string[];
  toolPlacement: string;
  ctaSuggestion: string;
};

function inferIntent(path: string, agg: BehaviorAggregates | null): IntentMatchRow["inferredIntent"] {
  const row = agg?.byPath[path];
  const bag = Object.keys(row?.entryKeywords ?? {}).join(" ");
  const t = `${path} ${bag}`.toLowerCase();
  if (/\b(vs|compare|comparison|alternative|tradeoff)\b/.test(t)) return "comparison";
  if (/\b(calculator|estimate|tool|payment|roi|payoff|quote)\b/.test(t)) return "decision";
  return "informational";
}

export function buildIntentMatchingRecommendations(
  paths: readonly string[],
  behavior: BehaviorAggregates | null,
  max = 14,
): IntentMatchRow[] {
  const out: IntentMatchRow[] = [];
  for (const path of paths.slice(0, max)) {
    const row = behavior?.byPath[path];
    const inferredIntent = inferIntent(path, behavior);
    const confidence = Math.min(100, Math.round((row?.sampleCount ?? 0) * 2 + (row?.avgMaxScroll ?? 0) * 40));
    const sectionAdjustments =
      inferredIntent === "decision"
        ? ["Move inputs/checklist above first fold", "Add worked numeric example before midpoint"]
        : inferredIntent === "comparison"
          ? ["Add concise comparison table near top", "Add criteria-based verdict section"]
          : ["Expand quick summary + definitions block", "Add jump links for scannability"];
    const toolPlacement =
      inferredIntent === "decision" ? "Place primary tool CTA after intro and after first example." : "Place tool CTA after problem framing.";
    const ctaSuggestion =
      inferredIntent === "decision"
        ? "CTA: Run the calculator with your own numbers now."
        : inferredIntent === "comparison"
          ? "CTA: Compare two scenarios in the linked tool."
          : "CTA: Start with the quick estimator, then read full guide.";
    out.push({ path, inferredIntent, confidence, sectionAdjustments, toolPlacement, ctaSuggestion });
  }
  return out;
}

