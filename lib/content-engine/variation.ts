export type VariationProfile = {
  tone: "direct" | "conversational" | "tutorial";
  introStyle: "question" | "story" | "statement";
  exampleMode: "numeric" | "scenario" | "checklist";
};

const TONES: VariationProfile["tone"][] = ["direct", "conversational", "tutorial"];
const INTROS: VariationProfile["introStyle"][] = ["question", "story", "statement"];
const EXAMPLES: VariationProfile["exampleMode"][] = ["numeric", "scenario", "checklist"];

function hashSeed(seed: string): number {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) h = (h * 33) ^ seed.charCodeAt(i);
  return Math.abs(h);
}

/**
 * Deterministic variation from a seed (topic + keyword + day bucket) to reduce repetitive cadence across posts.
 */
export function pickVariationProfile(seed: string): VariationProfile {
  const h = hashSeed(seed);
  return {
    tone: TONES[h % TONES.length]!,
    introStyle: INTROS[(h >> 3) % INTROS.length]!,
    exampleMode: EXAMPLES[(h >> 6) % EXAMPLES.length]!,
  };
}

export function variationPromptFragment(v: VariationProfile): string {
  const tone =
    v.tone === "direct"
      ? "Tone: short, direct sentences. Avoid throat-clearing."
      : v.tone === "conversational"
        ? "Tone: conversational but precise; occasional first person is fine when it adds clarity."
        : "Tone: calm tutorial voice; teach without lecturing.";

  const intro =
    v.introStyle === "question"
      ? "Open the H1 section after one short hook paragraph that starts with a concrete question a reader might actually ask."
      : v.introStyle === "story"
        ? "Open with a tight mini-scenario (2–4 sentences) before the first H2, then pivot to instruction."
        : "Open with a blunt thesis statement in the first paragraph, then support it.";

  const ex =
    v.exampleMode === "numeric"
      ? "Examples: prefer at least one numeric worked mini-example with plausible round numbers."
      : v.exampleMode === "scenario"
        ? "Examples: use a named fictional household or job-change scenario; keep it realistic and non-identifiable."
        : "Examples: include at least one short checklist readers can scan in under 20 seconds.";

  return [tone, intro, ex, "Vary sentence openings; do not start three consecutive paragraphs the same way."].join(" ");
}
