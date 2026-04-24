import type { IntentStage } from "./intent-stage";

export function highIntentContentSystemAddendum(stage: IntentStage, enabled: boolean): string {
  if (!enabled) return "";
  if (stage !== "decision") return "High-intent mode is enabled: emphasize concrete actions and measurable next steps.";
  return [
    "High-intent mode is enabled (DECISION stage).",
    "Make the page action-driven: lead with a practical checklist and required inputs.",
    "Include one short 'Act now' block with a concrete next step and one validation step.",
    "Use direct language ('do this now', 'verify this') without hype or guarantees.",
    "Prioritize tool-led workflows over generic advice.",
  ].join(" ");
}
