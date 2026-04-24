export type AdSlotRecommendation = {
  id: string;
  /** Where in the article flow (editorial / layout). */
  placement: "after_intro" | "mid_content" | "before_faq";
  rationale: string;
  /** UX guardrails. */
  uxNotes: string;
};

/**
 * Editorial placement strategy — does not inject scripts. Use with your AdSense component / layout.
 * Keeps reading flow: never before first paragraph; avoid sticky overlap with CTAs.
 */
export const ADSENSE_SLOT_RECOMMENDATIONS: readonly AdSlotRecommendation[] = [
  {
    id: "slot-after-intro",
    placement: "after_intro",
    rationale: "First value proof is delivered; engaged readers tolerate one well-spaced unit.",
    uxNotes: "Only after at least 2 short paragraphs + first H2; no ads inside lists or tables.",
  },
  {
    id: "slot-mid-content",
    placement: "mid_content",
    rationale: "Captures readers who scrolled past the core explanation (higher intent depth).",
    uxNotes: "Place after a natural section break (before a new H2), not mid-sentence.",
  },
  {
    id: "slot-before-faq",
    placement: "before_faq",
    rationale: "FAQ readers are high-intent; one unit before FAQ can lift RPM without blocking answers.",
    uxNotes: "Keep minimum 300px content gap from footer; avoid duplicate units stacked back-to-back.",
  },
];

/** Higher-RPM zones when content is decision- or comparison-heavy (editorial). */
export function highRpmZoneHints(): string {
  return [
    "RPM zones: prefer one display slot after the Quick summary + first proof section.",
    "For comparison/decision pages, a second slot after the main tradeoff section often outperforms a slot at the very top.",
    "Keep FAQ ad-light unless the page is very long (>1400 words); engagement on FAQ answers matters for return visits.",
  ].join(" ");
}

export function adsensePlacementMarkdownGuide(): string {
  return [
    "### AdSense placement (RPM-friendly, UX-safe)",
    "",
    "Suggested order for long articles:",
    "",
    "1. **After intro** — following the first substantive H2 block (not inside the lede).",
    "2. **Mid content** — between major sections after ~50–60% scroll depth equivalent.",
    "3. **Before FAQ** — single unit above the FAQ heading.",
    "",
    "Avoid: hero-before-content, more than 3 display units per long page, or placements that push primary CTA (tool links) below the fold on mobile.",
    "",
    highRpmZoneHints(),
  ].join("\n");
}
