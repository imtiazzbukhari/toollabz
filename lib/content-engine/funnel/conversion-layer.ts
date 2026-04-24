/**
 * CRO-style “next step” guidance for generated longform (no spammy CTAs).
 */
export function conversionLayerSystemAddendum(): string {
  return [
    "Conversion layer: include a dedicated Markdown section `## Next steps` near the end (before FAQs if FAQs exist).",
    "Use exactly three bullets, each one line, with this pattern and explicit action verbs:",
    "- **Try:** one concrete calculator/tool path the reader should use next (use a plausible Toollabz-style `/tools/...` path only if you are confident it exists; otherwise describe the tool generically).",
    "- **Compare:** one bullet that names two approaches or products to contrast (no hype; state what differs and what to check first).",
    "- **Read:** one deeper guide angle the reader should read next (can be phrased as a topic, not a fake URL), ending with one action the user should take this week.",
    "Each bullet should make the user do a concrete next action in under 10 minutes.",
    "Keep the section under 120 words total. No exclamation spam, no 'click here'.",
  ].join(" ");
}
