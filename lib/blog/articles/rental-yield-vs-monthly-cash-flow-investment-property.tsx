import Link from "next/link";
import type { BlogPostDefinition } from "../types";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        <strong className="font-semibold text-slate-800">Rental yield</strong> is usually a simple ratio: annual rent divided by
        property price or value, expressed as a percentage. <strong className="font-semibold text-slate-800">Cash flow</strong> is
        what hits your checking account after mortgage principal and interest, taxes, insurance, maintenance, vacancies, and
        management. A “high yield” asset can still drip negative monthly cash if leverage and expenses are hungry enough.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="numbers">
        Worked example: same rent, different cash
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Suppose a duplex trades for <strong className="font-semibold text-slate-800">$420,000</strong> and rents for{" "}
        <strong className="font-semibold text-slate-800">$3,400</strong> per month total. Gross annual rent ≈{" "}
        <strong className="font-semibold text-slate-800">$40,800</strong>. Gross yield ≈ 40,800 / 420,000 ≈{" "}
        <strong className="font-semibold text-slate-800">9.7%</strong> before expenses - headline attractive in many markets.
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        Layer financing: <strong className="font-semibold text-slate-800">20%</strong> down (<strong className="font-semibold text-slate-800">$84,000</strong>) plus
        closing, and a loan at <strong className="font-semibold text-slate-800">6.75%</strong> fixed for 30 years on{" "}
        <strong className="font-semibold text-slate-800">$336,000</strong>. Principal+interest might land near{" "}
        <strong className="font-semibold text-slate-800">$2,180</strong>/month depending on exact fees and escrow treatment. Add{" "}
        <strong className="font-semibold text-slate-800">$420</strong> taxes/insurance reserves, <strong className="font-semibold text-slate-800">$300</strong> maintenance/vacancy
        reserve, <strong className="font-semibold text-slate-800">$200</strong> management - monthly outflows could approach{" "}
        <strong className="font-semibold text-slate-800">$3,100</strong>. Pre-tax cash flow is only about{" "}
        <strong className="font-semibold text-slate-800">$300</strong>/month even though gross yield looked generous.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="compare">
        When yield is the right scoreboard
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Yield shines when comparing unlevered opportunities or benchmarking cap-rate-like thinking across geographies. It fails
        when debt terms, tax treatment, or capex cycles dominate outcomes - then cash flow is the adult supervision metric.
      </p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm text-slate-800">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Metric</th>
              <th className="px-4 py-3">Strength</th>
              <th className="px-4 py-3">Blind spot</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-3 font-medium">Gross rental yield</td>
              <td className="px-4 py-3">Fast comparables across listings</td>
              <td className="px-4 py-3">Ignores financing, repairs, vacancy, tax</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Monthly cash flow</td>
              <td className="px-4 py-3">Liquidity and survivability</td>
              <td className="px-4 py-3">Can miss long-term appreciation or principal paydown benefits</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="tools">
        Toollabz calculators
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Start with the{" "}
        <Link href="/tools/rental-yield-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          rental yield calculator
        </Link>{" "}
        for headline ratios, then layer{" "}
        <Link href="/tools/property-roi-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          property ROI
        </Link>{" "}
        and{" "}
        <Link href="/tools/rent-vs-buy-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          rent vs buy
        </Link>{" "}
        when deciding whether to allocate cash to equity or keep optionality.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="cluster">
        Real-estate cluster reading
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Connect yield vs cash thinking to{" "}
        <Link href="/blog/rent-vs-buy-usa-guide" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          rent vs buy USA
        </Link>
        ,{" "}
        <Link href="/blog/how-to-compare-rent-vs-buy-without-hype" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          comparing rent vs buy without hype
        </Link>
        , and loan literacy in{" "}
        <Link href="/blog/how-loan-amortization-schedules-work-principal-interest" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          how amortization works
        </Link>
        . For portfolio-level profit language, revisit{" "}
        <Link href="/blog/gross-profit-vs-net-profit-explained-for-operators" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          gross vs net profit
        </Link>
        .
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="hub">
        Hub
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        More housing and leverage tools live on the{" "}
        <Link href="/real-estate-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          real estate tools hub
        </Link>
        .
      </p>
    </>
  );
}

export const rentalYieldVsCashFlowPost: BlogPostDefinition = {
  slug: "rental-yield-vs-monthly-cash-flow-investment-property",
  title: "Rental yield vs monthly cash flow on investment property",
  description:
    "Define gross rental yield vs levered monthly cash flow with a duplex-style example, compare scoreboards, and link to Toollabz rental yield, ROI, rent-vs-buy, and mortgage literacy guides.",
  excerpt:
    "Yield compares rent to price; cash flow asks what is left after debt and operating reality - high yield can still be negative monthly cash.",
  publishedAt: "2026-05-11",
  dateModified: "2026-05-14T12:00:00.000Z",
  category: "Real estate",
  tags: ["rental yield", "cash flow", "leverage", "landlording"],
  readingTimeMinutes: 17,
  relatedToolSlugs: ["rental-yield-calculator", "property-roi-calculator", "rent-vs-buy-calculator", "loan-calculator", "mortgage-affordability-calculator"],
  relatedPostsSlugs: [
    "rent-vs-buy-usa-guide",
    "how-to-compare-rent-vs-buy-without-hype",
    "how-loan-amortization-schedules-work-principal-interest",
    "gross-profit-vs-net-profit-explained-for-operators",
  ],
  tableOfContents: [
    { id: "numbers", label: "Worked example" },
    { id: "compare", label: "When each metric wins" },
    { id: "tools", label: "Calculators" },
    { id: "cluster", label: "Cluster reading" },
    { id: "hub", label: "Hub" },
  ],
  keyTakeaways: [
    "Gross yield is a quick ratio; cash flow is a liquidity story after financing and operating costs.",
    "Leverage magnifies yield headlines - always model PITI, vacancy, and maintenance reserves.",
    "ROI-style property calculators help fold appreciation assumptions; yield alone cannot.",
  ],
  editorialNote: [
    "Real estate is jurisdiction-specific; tax treatment of mortgage interest, depreciation, and rent control changes outcomes we cannot universalize.",
  ],
  whenToUseTools: [
    "Use rental yield calculators for screening listings.",
    "Use rent vs buy and mortgage affordability tools when comparing capital allocation to equities or savings.",
  ],
  commonMistakes: [
    {
      title: "Using pro forma rent instead of leased rent",
      body: "Marketing brochures love best-case rents; underwriting should start from signed leases or conservative market comps.",
    },
    {
      title: "Ignoring capex reserves",
      body: "Roofs and HVAC bills arrive lumpy; monthly cash flow models without capex buffers look artificially safe.",
    },
  ],
  sources: [{ label: "HUD fair housing & rental guidance (U.S. context)", href: "https://www.hud.gov/" }],
  faqSchema: [
    {
      question: "Is net yield the same as cash flow?",
      answer:
        "Net yield often subtracts some operating costs from rent before dividing by price, but it still may ignore debt service - cash flow explicitly models financing.",
    },
    {
      question: "Can cash flow be negative while the investment still makes sense?",
      answer:
        "Speculative or appreciation-heavy strategies sometimes tolerate negative carry; that is a risk preference, not a free lunch.",
    },
    {
      question: "How does Toollabz help?",
      answer:
        "Use rental yield, property ROI, and rent vs buy calculators to iterate scenarios quickly before involving lenders or CPAs.",
    },
  ],
  Article,
};
