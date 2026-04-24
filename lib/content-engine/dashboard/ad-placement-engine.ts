import { ADSENSE_SLOT_RECOMMENDATIONS } from "../monetization/adsense-strategy";

export type AdPlacementPlan = {
  path: string;
  pageType: "informational" | "comparison" | "decision" | "calculator";
  suggestedMaxSlots: number;
  placements: Array<{
    slotId: string;
    placement: "after_intro" | "mid_content" | "before_faq";
    rationale: string;
    policySafe: string;
    uiHint: string;
  }>;
};

export function buildAdPlacementEngine(
  pages: readonly { path: string; pageType: "informational" | "comparison" | "decision" | "calculator" }[],
  max = 20,
): AdPlacementPlan[] {
  return pages.slice(0, max).map((p) => ({
    path: p.path,
    pageType: p.pageType,
    suggestedMaxSlots: p.pageType === "informational" ? 2 : 3,
    placements: ADSENSE_SLOT_RECOMMENDATIONS.map((s) => ({
      slotId: `${p.path}:${s.id}`,
      placement: s.placement,
      rationale:
        p.pageType === "decision" || p.pageType === "calculator"
          ? `${s.rationale} Prioritize this for high-intent pages.`
          : s.rationale,
      policySafe: `${s.uxNotes} Keep ad density moderate and avoid accidental-click layouts.`,
      uiHint: `Expose as optional slot "${s.id}" in dashboard. No auto-injection.`,
    })),
  }));
}

