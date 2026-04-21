/** Principals for SEO landing pages (rewritten from `/loan-calculator-{n}`). */
export const PROGRAMMATIC_LOAN_PRINCIPALS: readonly number[] = (() => {
  const a: number[] = [];
  for (let n = 5000; n <= 100_000; n += 2500) a.push(n);
  for (let n = 105_000; n <= 500_000; n += 5000) a.push(n);
  for (let n = 510_000; n <= 1_000_000; n += 10_000) a.push(n);
  return a;
})();

/** Gross salary amounts for `/salary-after-tax-{n}` landing pages. */
export const PROGRAMMATIC_SALARY_GROSS: readonly number[] = (() => {
  const a: number[] = [];
  for (let n = 25_000; n <= 250_000; n += 2500) a.push(n);
  return a;
})();

export function isValidLoanPrincipal(n: number): boolean {
  return PROGRAMMATIC_LOAN_PRINCIPALS.includes(n);
}

export function isValidSalaryGross(n: number): boolean {
  return PROGRAMMATIC_SALARY_GROSS.includes(n);
}
