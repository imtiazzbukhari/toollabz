import { absoluteUrl } from "@/lib/seo";

export function loanPrincipalCanonicalPath(amount: number): string {
  return `/loan-calculator/p/${amount}`;
}

export function loanPrincipalMetadata(amount: number) {
  const title = `Loan Calculator $${amount.toLocaleString("en-US")} Principal - Monthly Payments Instantly (Free)`.slice(
    0,
    72,
  );
  const description = `Estimate monthly loan payments for a $${amount.toLocaleString("en-US")} principal: amortization framing, APR assumptions, and links to the full Toollabz loan calculator.`.slice(
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

export function loanPrincipalParagraphs(amount: number): string[] {
  const f = amount.toLocaleString("en-US");
  return [
    `This landing page explains how a $${f} principal fits into a typical installment loan mental model: you choose an APR and term in the full calculator, then read the payment stack (principal and interest) over time. Toollabz keeps the narrative here so searchers who type a dollar amount plus “loan calculator” still get context before they open the interactive tool.`,
    `Why publish amount-specific pages? People often benchmark round numbers-$${f} is a common planning anchor for vehicles, personal loans, or consolidation scenarios. A dedicated URL with unique copy reduces thin-index risk versus duplicating the same paragraph everywhere, and internal links route you to the canonical calculator experience with the same glass UI as the rest of the site.`,
    `Important limitations: rates move with markets and credit profiles. This page does not pick a rate for you; it describes how to think about payments once you supply APR, term, and any fees your lender discloses. Always confirm with a licensed loan officer before you commit, especially when DTI, insurance, or escrow layers apply.`,
    `Next step: open the full loan calculator, enter $${f} as principal, then sweep APR ±1% and term ±12 months to see sensitivity. Pair that run with debt payoff or refinance tools linked from the main calculator page when you are comparing strategies rather than a single quote.`,
  ];
}

export function loanPrincipalFaqs(amount: number): { question: string; answer: string }[] {
  const f = amount.toLocaleString("en-US");
  return [
    {
      question: `Does this page calculate my exact payment for $${f}?`,
      answer:
        "It explains the framing; the live payment math runs in the full Toollabz loan calculator where you enter APR, term, and optional fees your lender uses.",
    },
    {
      question: `Why is $${f} highlighted on this URL?`,
      answer:
        "Searchers often anchor on a principal amount. This page gives unique context for that anchor and links to the interactive tool so you do not have to hunt for the entry field.",
    },
    {
      question: "Will my APR match the example rate on country pages?",
      answer:
        "Country benchmark pages are illustrative only. Your lender applies risk-based pricing; enter the APR you were quoted when you use the calculator.",
    },
    {
      question: "Can I use this for mortgages and auto loans?",
      answer:
        "Yes for high-level installment intuition, but mortgages add taxes, insurance, PMI, and escrow. Use mortgage-specific Toollabz calculators when those components matter.",
    },
    {
      question: "Is this financial advice?",
      answer:
        "No. It is educational copy plus links to calculators. Confirm material decisions with qualified professionals.",
    },
    {
      question: "How do I share this page?",
      answer: `Copy the canonical HTTPS URL /loan-calculator/p/${amount} so teammates see the same principal-focused context.`,
    },
  ];
}
