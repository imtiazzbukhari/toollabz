/**
 * High-tier programmatic URLs for sitemap inclusion.
 * Medium-tier pages stay indexable via internal links (see value-tier.ts).
 * Low-tier stubs (thin country pages / tool mirrors) stay noindex.
 */
import {
  loanPrincipalValueTier,
  salaryGrossValueTier,
  shouldSitemapProgrammatic,
} from "@/lib/programmatic-seo/value-tier";
import { PROGRAMMATIC_LOAN_PRINCIPALS, PROGRAMMATIC_SALARY_GROSS } from "@/lib/programmatic-seo/amount-routes";

/** High-demand cm→feet conversions (human heights + common round values). */
export const SITEMAP_CM_TO_FEET_SLUGS = [
  50, 100, 120, 140, 145, 150, 152, 155, 157, 160, 163, 165, 168, 170, 173, 175, 178, 180, 183, 185,
  188, 190, 193, 195, 198, 200,
] as const;

export const SITEMAP_LOAN_PRINCIPALS = PROGRAMMATIC_LOAN_PRINCIPALS.filter((n) =>
  shouldSitemapProgrammatic(loanPrincipalValueTier(n)),
);

export const SITEMAP_SALARY_GROSS = PROGRAMMATIC_SALARY_GROSS.filter((n) =>
  shouldSitemapProgrammatic(salaryGrossValueTier(n)),
);
