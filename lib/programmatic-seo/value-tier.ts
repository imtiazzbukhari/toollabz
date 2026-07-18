/**
 * Programmatic URL value tiers (quality-first; do not blindly noindex).
 *
 * High   — clear search demand + unique answer → index + sitemap + enrich
 * Medium — useful unique answer, secondary demand → index + selective sitemap
 * Low    — no meaningful unique value (stubs/duplicates) → noindex + parent canonical
 *
 * GSC click data was unavailable in audit (DATABASE_URL unset). Tiers are
 * based on content uniqueness + typical query patterns, not traffic guesses.
 */

export type ProgrammaticValueTier = "high" | "medium" | "low";

/** Human-height and common round cm values with clear conversion intent. */
const CM_HIGH = new Set<number>([
  50, 100, 120, 140, 145, 150, 152, 155, 157, 160, 163, 165, 168, 170, 173, 175, 178, 180, 183, 185,
  188, 190, 193, 195, 198, 200,
]);

export function cmToFeetValueTier(cm: number): ProgrammaticValueTier {
  if (!Number.isFinite(cm) || cm < 1 || cm > 1000) return "low";
  if (CM_HIGH.has(cm)) return "high";
  // Round, commonly searched conversions — indexable but not sitemap-priority.
  if (cm % 5 === 0 && cm <= 250) return "medium";
  // Long-tail / uncommon lengths: unique math, weak standalone intent → noindex.
  return "low";
}

/** Round principals people commonly plan around. */
const LOAN_HIGH = new Set<number>([
  5_000, 10_000, 15_000, 20_000, 25_000, 30_000, 40_000, 50_000, 75_000, 100_000, 150_000, 200_000,
  250_000, 300_000, 400_000, 500_000, 750_000, 1_000_000,
]);

export function loanPrincipalValueTier(amount: number): ProgrammaticValueTier {
  if (!Number.isFinite(amount) || amount <= 0) return "low";
  if (LOAN_HIGH.has(amount)) return "high";
  // Other generated principals remain useful amount-specific landings.
  return "medium";
}

const SALARY_HIGH = new Set<number>([
  30_000, 35_000, 40_000, 45_000, 50_000, 55_000, 60_000, 65_000, 70_000, 75_000, 80_000, 85_000,
  90_000, 100_000, 110_000, 120_000, 125_000, 150_000, 175_000, 200_000, 250_000,
]);

export function salaryGrossValueTier(amount: number): ProgrammaticValueTier {
  if (!Number.isFinite(amount) || amount <= 0) return "low";
  if (SALARY_HIGH.has(amount)) return "high";
  return "medium";
}

/** Thin country rate stubs — no calculator, no unique methodology. */
export function countryStubValueTier(): ProgrammaticValueTier {
  return "low";
}

/** Full tool re-hosted at country×amount URL — duplicate of /tools/{slug}. */
export function countryAmountToolMirrorValueTier(): ProgrammaticValueTier {
  return "low";
}

/**
 * Index policy (protect useful unique answers):
 * - high: index + sitemap
 * - medium: index (unique math / scenarios); discover via internal links (not sitemap)
 * - low: noindex + consolidate to parent tool (stubs / duplicates / no unique value)
 *
 * Do not noindex medium amount/conversion pages — they answer distinct queries.
 */
export function shouldIndexProgrammatic(tier: ProgrammaticValueTier): boolean {
  return tier === "high" || tier === "medium";
}

export function shouldSitemapProgrammatic(tier: ProgrammaticValueTier): boolean {
  return tier === "high";
}
