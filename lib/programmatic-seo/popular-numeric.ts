import { SITEMAP_LOAN_PRINCIPALS, SITEMAP_SALARY_GROSS } from "@/lib/sitemap-programmatic";

/** Internal links prefer High-tier programmatic landings (sitemap parity). */
export const TOP_LOAN_PRINCIPAL_LINKS: readonly number[] = [...SITEMAP_LOAN_PRINCIPALS].slice(0, 12);

export const TOP_SALARY_GROSS_LINKS: readonly number[] = [...SITEMAP_SALARY_GROSS].slice(0, 12);

export function loanPrincipalPublicPath(amount: number): string {
  return `/loan-calculator/p/${amount}`;
}

export function salaryGrossPublicPath(amount: number): string {
  return `/salary-after-tax/p/${amount}`;
}
