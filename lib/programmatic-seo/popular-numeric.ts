import { PROGRAMMATIC_LOAN_PRINCIPALS, PROGRAMMATIC_SALARY_GROSS } from "@/lib/programmatic-seo/amount-routes";

const LOAN_CANDIDATES = [10_000, 25_000, 50_000, 100_000, 250_000, 500_000] as const;
const SALARY_CANDIDATES = [40_000, 50_000, 75_000, 100_000, 125_000, 150_000, 200_000] as const;

/** Curated principals that exist in PROGRAMMATIC_LOAN_PRINCIPALS (for internal linking). */
export const TOP_LOAN_PRINCIPAL_LINKS: readonly number[] = LOAN_CANDIDATES.filter((n) =>
  PROGRAMMATIC_LOAN_PRINCIPALS.includes(n),
);

/** Curated gross salaries that exist in PROGRAMMATIC_SALARY_GROSS. */
export const TOP_SALARY_GROSS_LINKS: readonly number[] = SALARY_CANDIDATES.filter((n) =>
  PROGRAMMATIC_SALARY_GROSS.includes(n),
);

export function loanPrincipalPublicPath(amount: number): string {
  return `/loan-calculator/p/${amount}`;
}

export function salaryGrossPublicPath(amount: number): string {
  return `/salary-after-tax/p/${amount}`;
}
