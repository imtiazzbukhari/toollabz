/**
 * Safe, non-destructive content improvement suggestions (human applies in CMS).
 */
export function buildContentImprovementSuggestions(input: { path: string; titleHint?: string }): {
  titleOptions: string[];
  introOutline: string[];
  faqAdds: Array<{ question: string; answer: string }>;
} {
  const slug = input.path.replace(/^\/blog\//, "").replace(/-/g, " ");
  const base = input.titleHint ?? slug;
  return {
    titleOptions: [
      `${base}: practical checklist (2026)`,
      `${base}: what to verify before you decide`,
      `${base}: common mistakes + how to avoid them`,
    ],
    introOutline: [
      "Open with the outcome readers want in one sentence.",
      "Add a 3-bullet 'what you will get' before the first H2.",
      "Insert one worked example with numbers in the first screen.",
    ],
    faqAdds: [
      {
        question: `Who is this guide for?`,
        answer: `Readers evaluating ${base} who want a clear, conservative plan without hype.`,
      },
      {
        question: `What should I do next?`,
        answer: `Use the related calculators linked in this article and compare scenarios before committing.`,
      },
    ],
  };
}
