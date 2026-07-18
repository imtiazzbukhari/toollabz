import { absoluteUrl } from "@/lib/seo";

export function loanPrincipalCanonicalPath(amount: number): string {
  return `/loan-calculator/p/${amount}`;
}

/** Standard amortizing payment: M = P * r(1+r)^n / ((1+r)^n - 1) */
export function monthlyPayment(principal: number, annualRatePct: number, termYears: number): number {
  const r = annualRatePct / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return principal / n;
  const factor = Math.pow(1 + r, n);
  return (principal * r * factor) / (factor - 1);
}

export type LoanScenarioRow = {
  apr: number;
  termYears: number;
  monthly: number;
  totalPaid: number;
  totalInterest: number;
};

/** Unique numeric table for this principal (information gain vs template-only copy). */
export function loanPrincipalScenarios(amount: number): LoanScenarioRow[] {
  const combos: Array<[number, number]> = [
    [5.99, 3],
    [7.49, 5],
    [9.99, 5],
    [6.5, 7],
  ];
  return combos.map(([apr, termYears]) => {
    const monthly = monthlyPayment(amount, apr, termYears);
    const totalPaid = monthly * termYears * 12;
    return {
      apr,
      termYears,
      monthly,
      totalPaid,
      totalInterest: totalPaid - amount,
    };
  });
}

export function loanPrincipalMetadata(amount: number) {
  const title = `Loan Calculator $${amount.toLocaleString("en-US")} Principal - Monthly Payments Instantly (Free)`.slice(
    0,
    72,
  );
  const sample = monthlyPayment(amount, 7.49, 5);
  const description = `$${amount.toLocaleString("en-US")} loan: ~$${Math.round(sample).toLocaleString("en-US")}/mo at 7.49% APR over 5 years (illustrative). Compare APR×term scenarios and open the full calculator.`.slice(
    0,
    158,
  );
  const path = loanPrincipalCanonicalPath(amount);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      type: "website" as const,
      siteName: "Toollabz",
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
    },
  };
}

export function loanPrincipalKeyTakeaways(amount: number): string[] {
  const f = amount.toLocaleString("en-US");
  const base = monthlyPayment(amount, 7.49, 5);
  return [
    `A $${f} principal at 7.49% APR for 5 years is about $${Math.round(base).toLocaleString("en-US")} per month before fees (illustrative).`,
    "Raising APR by ~2 points usually hurts more than shortening the term by a year on mid-size personal loans—run both levers in the full calculator.",
    "Total interest is principal × (payment schedule − 1). Escrow, insurance, and origination fees are not in the simple amortization math.",
    "Use this page for planning anchors; use a lender quote APR for decisions.",
  ];
}

export function loanPrincipalParagraphs(amount: number): string[] {
  const f = amount.toLocaleString("en-US");
  const scenarios = loanPrincipalScenarios(amount);
  const mid = scenarios[1]!;
  return [
    `If you are sizing a $${f} loan, start with the payment table below. It applies the standard amortizing formula to this exact principal so you can see how APR and term change the monthly bill before you open the interactive calculator.`,
    `At ${mid.apr}% APR over ${mid.termYears} years, $${f} works out to about $${Math.round(mid.monthly).toLocaleString("en-US")} per month and roughly $${Math.round(mid.totalInterest).toLocaleString("en-US")} in interest (fees excluded). That is a planning benchmark—not a lender offer.`,
    `When to use a $${f} anchor: auto loans, personal consolidation, and home-improvement quotes often cluster near round principals. Compare your quote’s APR and term against the table, then stress-test ±1% APR in the full Toollabz loan calculator.`,
    `Common mistakes: ignoring origination fees, treating interest-only quotes as amortizing payments, and forgetting insurance/taxes on secured loans. Confirm material decisions with a licensed lender or advisor.`,
  ];
}

export function loanPrincipalFaqs(amount: number): { question: string; answer: string }[] {
  const f = amount.toLocaleString("en-US");
  const sample = monthlyPayment(amount, 7.49, 5);
  return [
    {
      question: `What is the monthly payment on a $${f} loan?`,
      answer: `At an illustrative 7.49% APR over 5 years, about $${Math.round(sample).toLocaleString("en-US")} per month using standard amortization (principal and interest only). Enter your real APR and term in the full calculator for a precise figure.`,
    },
    {
      question: `How is the $${f} payment calculated?`,
      answer:
        "Monthly payment M = P × r(1+r)^n / ((1+r)^n − 1), where P is principal, r is monthly rate (APR÷12), and n is the number of months. That is the same formula banks use for level amortizing loans.",
    },
    {
      question: `Why show multiple APR and term scenarios for $${f}?`,
      answer:
        "Searchers comparing quotes need sensitivity, not a single magic number. The table shows how the same principal behaves under different rate/term pairs so you can see which lever matters more.",
    },
    {
      question: "Does this include taxes, insurance, or PMI?",
      answer:
        "No. Those appear on mortgage stacks. For home loans, use the mortgage payment calculator after you have tax and insurance estimates.",
    },
    {
      question: "Is this financial advice?",
      answer:
        "No. It is educational math plus links to calculators. Confirm decisions with qualified professionals.",
    },
    {
      question: `How do I open the interactive calculator with $${f}?`,
      answer:
        "Use the full loan calculator link on this page, enter the principal, then set the APR and term from your quote.",
    },
  ];
}
