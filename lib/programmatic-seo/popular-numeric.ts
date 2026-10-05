import { LOAN_AMOUNT_INDEXABLE_VALUES } from "@/lib/seo/indexing-policy";

/** Internal links point only at amount pages that are indexable (policy parity with the sitemap). */
export const TOP_LOAN_PRINCIPAL_LINKS: readonly number[] = LOAN_AMOUNT_INDEXABLE_VALUES;

export function loanPrincipalPublicPath(amount: number): string {
  return `/loan-calculator/p/${amount}`;
}
