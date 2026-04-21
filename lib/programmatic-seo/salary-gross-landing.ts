import { absoluteUrl } from "@/lib/seo";

export function salaryGrossCanonicalPath(amount: number): string {
  return `/salary-after-tax/p/${amount}`;
}

export function salaryGrossMetadata(amount: number) {
  const title = `Salary After Tax $${amount.toLocaleString("en-US")} Gross - Take-Home Estimate Instantly (Free)`.slice(
    0,
    72,
  );
  const description = `Plan take-home pay from a $${amount.toLocaleString(
    "en-US",
  )} gross salary: tax-rate intuition, links to regional salary-after-tax calculators, and FAQs.`.slice(0, 158);
  const path = salaryGrossCanonicalPath(amount);
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

export function salaryGrossParagraphs(amount: number): string[] {
  const f = amount.toLocaleString("en-US");
  return [
    `This page targets people who search gross salaries like $${f} alongside “after tax” or “take home.” Toollabz separates two layers: (1) a quick mental model using an effective tax rate you supply, and (2) regional calculators when you need US state, UK, or other localized tables linked from the main directory.`,
    `Why $${f} specifically? Round and semi-round salaries cluster in real job posts and offer letters. Unique copy per amount helps search systems distinguish pages instead of recycling one paragraph, while internal links push you to the interactive salary-after-tax calculator and related finance utilities without changing the site's visual system.`,
    `What you should still enter manually: pre-tax deductions, retirement deferrals, HSA contributions, and local taxes when they apply. The base calculator on Toollabz is a sandbox - excellent for comparisons, not a substitute for payroll software or employer withholdings.`,
    `Recommended workflow: start with the general salary-after-tax calculator using $${f} gross and your best guess at a blended rate, then open a regional variant (for example California or UK) if you need a closer approximation. Finish with budgeting or net-worth tools when you are translating take-home into monthly cash flow.`,
  ];
}

export function salaryGrossFaqs(amount: number): { question: string; answer: string }[] {
  const f = amount.toLocaleString("en-US");
  return [
    {
      question: `How accurate is take-home for $${f} gross?`,
      answer:
        "Accuracy depends on the tax rate and deductions you enter. Use regional calculators when locality matters; this landing page orients you rather than guessing your jurisdiction.",
    },
    {
      question: `Why create a page for $${f} specifically?`,
      answer:
        "Searchers often type an exact gross amount. Unique explanations per amount improve content depth and reduce duplicate indexing signals.",
    },
    {
      question: "Does Toollabz store my salary?",
      answer:
        "Design favors client-side flows without persisting inputs on our servers; avoid entering secrets on shared machines regardless.",
    },
    {
      question: "Where is the interactive calculator?",
      answer:
        "Use the primary Toollabz salary-after-tax calculator linked from this page, then branch to state or country variants as needed.",
    },
    {
      question: "Can I compare two offers with different gross amounts?",
      answer:
        "Yes - run each gross separately, record take-home under identical deduction assumptions, and compare side by side.",
    },
    {
      question: "Is this tax advice?",
      answer:
        "No. It is educational guidance and calculator links. Confirm withholding with payroll or a tax professional.",
    },
  ];
}
