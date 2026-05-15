import Link from "next/link";
import type { BlogPostDefinition } from "../types";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        The <strong className="font-semibold text-slate-800">interest rate</strong> on a loan usually describes how fast periodic
        interest accrues on the principal according to the note’s compounding rhythm. <strong className="font-semibold text-slate-800">APR</strong>{" "}
        (annual percentage rate) is a regulatory-flavored attempt to express a loan’s yearly cost including certain fees,
        expressed as if those costs were spread across the life of the loan. APR helps shoppers; it is not always the number your
        amortization engine uses line-by-line without adjustment.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="auto-example">
        Auto loan: fee shifts APR more than “rate”
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Imagine financing <strong className="font-semibold text-slate-800">$28,000</strong> for 60 months. Lender A quotes{" "}
        <strong className="font-semibold text-slate-800">6.9%</strong> “interest” with <strong className="font-semibold text-slate-800">$0</strong> origination.
        Lender B quotes <strong className="font-semibold text-slate-800">6.5%</strong> but adds a <strong className="font-semibold text-slate-800">$799</strong>{" "}
        origination fee capitalized into the amount financed. Monthly payment math for B uses a slightly lower periodic rate on a
        slightly higher principal - APR is designed so you can ask which offer is stingier in total annualized cost terms even when
        monthly payments look close.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="mortgage">
        Mortgages: APY vs APR vs TIP
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Mortgage disclosures (in the U.S., the Loan Estimate) bundle multiple boxes: note rate, APR, finance charges, and total
        interest percentage (TIP) over the full term if you never prepay. Use APR to compare lender packages; use amortization
        tables for actual monthly principal/interest - our{" "}
        <Link href="/blog/how-loan-amortization-schedules-work-principal-interest" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          amortization explainer
        </Link>{" "}
        connects the math to escrowed taxes/insurance in{" "}
        <Link href="/blog/mortgage-payment-usa-piti-escrow-guide" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          the PITI guide
        </Link>
        .
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="table">
        Interest rate vs APR (practical framing)
      </h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm text-slate-800">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Label</th>
              <th className="px-4 py-3">You use it to…</th>
              <th className="px-4 py-3">Watch-outs</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-3 font-medium">Contract / note rate</td>
              <td className="px-4 py-3">Drive periodic accrual on principal</td>
              <td className="px-4 py-3">Ignores many upfront fees by itself</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">APR</td>
              <td className="px-4 py-3">Compare offers with different fee stacks</td>
              <td className="px-4 py-3">Assumes you keep the loan to term; prepay and effective cost changes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="credit-cards">
        Credit cards: APR tiers are not mortgage APR
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Revolving credit often quotes multiple APRs (purchase, balance transfer, cash advance). Daily periodic rates and grace
        periods mean effective interest depends on behavior, not a single amortizing schedule. If you are modeling payoff velocity,
        pair this article with{" "}
        <Link href="/blog/credit-card-payoff-avalanche-vs-snowball" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          avalanche vs snowball payoff strategy
        </Link>{" "}
        and the{" "}
        <Link href="/tools/credit-card-interest-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          credit card interest calculator
        </Link>
        .
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="cluster">
        Cluster navigation
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        APR literacy connects to{" "}
        <Link href="/blog/how-loan-amortization-schedules-work-principal-interest" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          amortization mechanics
        </Link>
        ,{" "}
        <Link href="/blog/rental-yield-vs-monthly-cash-flow-investment-property" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          rental leverage decisions
        </Link>
        , and broader{" "}
        <Link href="/finance-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          finance calculators
        </Link>{" "}
        on Toollabz.
      </p>
    </>
  );
}

export const aprVsInterestRatePost: BlogPostDefinition = {
  slug: "apr-vs-interest-rate-mortgage-auto-loans",
  title: "APR vs interest rate on mortgages and auto loans",
  description:
    "Separate note rate from APR, walk a financed-fee auto example, decode mortgage disclosures at a high level, and link to amortization, PITI, and credit-card payoff tools on Toollabz.",
  excerpt:
    "Interest rate drives periodic accrual math; APR folds more upfront costs into an annualized comparison figure - know which question you are answering.",
  publishedAt: "2026-05-11",
  dateModified: "2026-05-14T12:00:00.000Z",
  category: "Finance",
  tags: ["APR", "mortgages", "auto loans", "truth in lending"],
  readingTimeMinutes: 16,
  relatedToolSlugs: ["loan-calculator", "emi-calculator", "credit-card-interest-calculator", "refinance-calculator-mortgage"],
  relatedPostsSlugs: [
    "how-loan-amortization-schedules-work-principal-interest",
    "mortgage-payment-usa-piti-escrow-guide",
    "credit-card-payoff-avalanche-vs-snowball",
    "rental-yield-vs-monthly-cash-flow-investment-property",
  ],
  tableOfContents: [
    { id: "auto-example", label: "Auto loan example" },
    { id: "mortgage", label: "Mortgage disclosures" },
    { id: "table", label: "Comparison table" },
    { id: "credit-cards", label: "Credit cards" },
    { id: "cluster", label: "Cluster" },
  ],
  keyTakeaways: [
    "APR is a shopping comparison figure that includes many finance charges; the contract rate drives base accrual on principal.",
    "Financed fees raise the amortized principal and can lift APR even if the quoted rate looks lower.",
    "Revolving credit APR behaves differently from installment APR - behavior changes realized interest.",
  ],
  editorialNote: [
    "Disclosure rules vary by country; U.S. mortgage examples cite CFPB-style concepts without replacing your Closing Disclosure.",
  ],
  whenToUseTools: [
    "Use loan/EMI calculators after you know the amount financed, note rate, and term.",
    "Use credit card calculators when modeling payoff order under different APR tiers.",
  ],
  commonMistakes: [
    {
      title: "Assuming lowest monthly payment equals lowest APR",
      body: "Longer terms reduce payments but can increase total interest; compare APR and total interest, not payment alone.",
    },
    {
      title: "Ignoring prepayment plans",
      body: "APR spreads some costs as if you keep the loan to maturity; selling or refinancing early changes effective cost.",
    },
  ],
  sources: [{ label: "CFPB  -  What is APR? (consumer reference)", href: "https://www.consumerfinance.gov/ask-cfpb/what-is-an-apr-en-5/" }],
  faqSchema: [
    {
      question: "Is APR always higher than the interest rate?",
      answer:
        "Often on loans with upfront fees, APR is equal or higher. Promotional scenarios with lender credits can occasionally make comparisons non-intuitive - read the fee table.",
    },
    {
      question: "Does APR include escrowed taxes and insurance?",
      answer:
        "Mortgage APR treatment of escrow varies; many non-mortgage APRs exclude voluntary escrowed items. Use the Loan Estimate fee chart for mortgages.",
    },
    {
      question: "How do I connect APR to monthly payments?",
      answer:
        "Payments follow amortization on amount financed and periodic rate; APR is a summary statistic for comparison, not always the literal monthly accrual input.",
    },
  ],
  Article,
};
