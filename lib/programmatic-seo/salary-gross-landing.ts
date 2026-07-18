import { absoluteUrl } from "@/lib/seo";

export function salaryGrossCanonicalPath(amount: number): string {
  return `/salary-after-tax/p/${amount}`;
}

/** Illustrative effective rate scenarios (not jurisdiction-specific tax law). */
export function takeHomeEstimate(gross: number, effectiveRatePct: number): number {
  return gross * (1 - effectiveRatePct / 100);
}

export type SalaryScenarioRow = {
  label: string;
  effectiveRatePct: number;
  annualNet: number;
  monthlyNet: number;
};

export function salaryGrossScenarios(amount: number): SalaryScenarioRow[] {
  const rows: Array<[string, number]> = [
    ["Lower effective rate (illustrative)", 18],
    ["Mid effective rate (illustrative)", 28],
    ["Higher effective rate (illustrative)", 38],
  ];
  return rows.map(([label, effectiveRatePct]) => {
    const annualNet = takeHomeEstimate(amount, effectiveRatePct);
    return {
      label,
      effectiveRatePct,
      annualNet,
      monthlyNet: annualNet / 12,
    };
  });
}

export function salaryGrossMetadata(amount: number) {
  const mid = takeHomeEstimate(amount, 28);
  const title = `Salary After Tax $${amount.toLocaleString("en-US")} Gross - Take-Home Estimate Instantly (Free)`.slice(
    0,
    72,
  );
  const description = `$${amount.toLocaleString("en-US")} gross: ~$${Math.round(mid).toLocaleString("en-US")}/yr take-home at an illustrative 28% effective rate. Compare rate bands and open regional calculators.`.slice(
    0,
    158,
  );
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

export function salaryGrossKeyTakeaways(amount: number): string[] {
  const f = amount.toLocaleString("en-US");
  const mid = takeHomeEstimate(amount, 28);
  return [
    `At an illustrative 28% effective rate, $${f} gross is about $${Math.round(mid).toLocaleString("en-US")} net per year (~$${Math.round(mid / 12).toLocaleString("en-US")}/month).`,
    "Real UK/US take-home uses bands, allowances, NI/Social Security, pensions, and student loans—not one flat rate.",
    "Convert offer letters and rent to the same monthly basis before judging affordability.",
    "Open a regional salary-after-tax calculator when you know the country or US state.",
  ];
}

export function salaryGrossParagraphs(amount: number): string[] {
  const f = amount.toLocaleString("en-US");
  const mid = salaryGrossScenarios(amount)[1]!;
  return [
    `Planning around a $${f} gross salary usually starts with a rough effective-rate band, then a jurisdiction-specific calculator. The table on this page shows three illustrative effective rates so you can see how sensitive take-home is before you model HMRC or IRS detail.`,
    `At ${mid.effectiveRatePct}% effective, $${f} lands near $${Math.round(mid.annualNet).toLocaleString("en-US")} net annually (about $${Math.round(mid.monthlyNet).toLocaleString("en-US")} per month). That is a planning scaffold—not a payslip.`,
    `When to use this page: comparing job offers, checking whether a raise clears a rent increase, or briefing a household budget. When not to: filing taxes, setting payroll, or signing contracts without local rules.`,
    `Common mistakes: treating UK/US progressive tax as a single flat %, forgetting pension and student loan deductions, and mixing annual gross with monthly rent without converting periods.`,
  ];
}

export function salaryGrossFaqs(amount: number): { question: string; answer: string }[] {
  const f = amount.toLocaleString("en-US");
  const mid = takeHomeEstimate(amount, 28);
  return [
    {
      question: `What is take-home pay on $${f} gross?`,
      answer: `Using an illustrative 28% effective rate, about $${Math.round(mid).toLocaleString("en-US")} per year. Your real figure depends on tax bands, NI/FICA, pensions, and other deductions—use the full salary-after-tax calculator for your region.`,
    },
    {
      question: `Why show multiple effective rates for $${f}?`,
      answer:
        "Effective rates vary by country, filing status, and deductions. The scenario table shows sensitivity so you do not treat one percentage as destiny.",
    },
    {
      question: "Is this UK or US tax law?",
      answer:
        "Neither in full. It is educational framing. Open UK or US-specific Toollabz calculators (and confirm with HMRC/IRS/payroll) for filing-grade numbers.",
    },
    {
      question: "Does this include student loans or pensions?",
      answer:
        "No. Add those deductions in a regional calculator or subtract them manually from the illustrative net.",
    },
    {
      question: "How should I budget from this page?",
      answer: `Convert the monthly net estimate to the same period as your rent and bills. For $${f} gross at 28% effective, monthly net is roughly $${Math.round(takeHomeEstimate(amount, 28) / 12).toLocaleString("en-US")}.`,
    },
    {
      question: "Where is the interactive calculator?",
      answer:
        "Use the salary after tax calculator linked on this page, then pick a regional variant if you need state or UK bands.",
    },
  ];
}
