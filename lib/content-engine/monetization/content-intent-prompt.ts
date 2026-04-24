/**
 * System prompt addendum: steer drafts toward high-value reader intent (decisions, money tradeoffs).
 */
export function highValueCommercialIntentAddendum(): string {
  return [
    "Commercial intent: assume readers are trying to make or defend a money decision (timing, tradeoffs, risks), not browsing trivia.",
    "Examples must involve plausible dollar amounts, rates, dates, or quantities where relevant; avoid vague 'imagine you have money' filler.",
    "Prefer decision framing: options, constraints, what changes the outcome, and what to verify with a professional when stakes are high.",
    "Do not promise outcomes you cannot support; keep disclaimers human and short where risk is legal, tax, or medical.",
  ].join(" ");
}
