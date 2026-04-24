/**
 * Prompt-level engagement signals (scroll-friendly structure, skim value).
 */
export function engagementOptimizationAddendum(): string {
  return [
    "Engagement: after the H1, include a 3–5 bullet `## Quick summary` with takeaways a skimmer can use in 20 seconds.",
    "Use frequent subheads (## / ###) and short paragraphs (2–4 sentences).",
    "Add one 'checkpoint' line mid-article: a single sentence that tells the reader what they should know by that point.",
    "Prefer one numbered mini-walkthrough (3–6 steps) in the decision or comparison stages.",
  ].join(" ");
}
