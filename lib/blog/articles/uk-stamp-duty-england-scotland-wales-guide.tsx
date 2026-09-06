import Link from "next/link";
import type { BlogPostDefinition } from "../types";
import BlogToolCallout from "@/components/BlogToolCallout";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        “Stamp duty” is everyday language for three different residential property taxes. England and Northern Ireland charge
        Stamp Duty Land Tax (SDLT). Scotland charges Land and Buildings Transaction Tax (LBTT). Wales charges Land Transaction
        Tax (LTT). The{" "}
        <Link href="/tools/stamp-duty-calculator-uk" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          Stamp Duty Calculator UK
        </Link>{" "}
        keeps those modes on one page so you do not need five near-duplicate tools.
      </p>

      <h2 id="england-ni" className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">
        How SDLT works in England and Northern Ireland
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        You pay SDLT on slices of the price, not on the whole price at the top rate. From 1 April 2025 the standard residential
        table is 0% to £125,000, 2% to £250,000, 5% to £925,000, 10% to £1.5 million and 12% above that. GOV.UK’s own example
        for a £295,000 purchase is £4,750. Source:{" "}
        <a
          href="https://www.gov.uk/stamp-duty-land-tax/residential-property-rates"
          className="font-medium text-violet-700 underline-offset-2 hover:underline"
        >
          GOV.UK residential SDLT rates
        </a>
        .
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        First-time buyers (everyone on the purchase must qualify) pay 0% up to £300,000 and 5% from £300,001 to £500,000. If
        the price is over £500,000 the relief is withdrawn in full and standard rates apply to the whole price. Additional
        residential property usually adds 5 percentage points on every band when the price is £40,000 or more. Non-UK residents
        usually add a further 2% of the price.
      </p>

      <h2 id="scotland" className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">
        LBTT in Scotland
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        The Scottish Budget 2026-27 kept residential LBTT bands: 0% to £145,000, 2% to £250,000, 5% to £325,000, 10% to
        £750,000 and 12% above. First-time buyer relief raises the nil-rate band to £175,000. Additional Dwelling Supplement
        stays at 8% of the whole price on relevant purchases of £40,000 or more, and it blocks first-time buyer relief. Source:{" "}
        <a
          href="https://www.gov.scot/publications/scottish-budget-2026-2027/pages/4/"
          className="font-medium text-violet-700 underline-offset-2 hover:underline"
        >
          Scottish Budget 2026 to 2027, Chapter 2
        </a>
        .
      </p>

      <h2 id="wales" className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">
        Land Transaction Tax in Wales
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Main residential LTT (from 10 October 2022) is 0% to £225,000, 6% to £400,000, 7.5% to £750,000, 10% to £1.5 million
        and 12% above. GOV.WALES’s £280,000 example is £3,300. There is no separate first-time buyer relief. Additional
        property uses a higher-rate table; from 11 December 2024 that starts at 5% on the first £180,000. Source:{" "}
        <a href="https://www.gov.wales/land-transaction-tax-rates-and-bands" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          GOV.WALES LTT rates and bands
        </a>
        .
      </p>

      <h2 id="cash-needed" className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">
        How much cash do you need?
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Tax is calculated on the price. Cash at completion is usually deposit plus tax, plus conveyancing, surveys and any
        broker fee. The calculator adds only the deposit you type. A 10% deposit on the GOV.UK £295,000 example is £29,500;
        with £4,750 SDLT the modelled cash required is £34,250 before legal costs.
      </p>

      <h2 id="yield" className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">
        Buy-to-let: do not put stamp duty in annual yield
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Stamp duty is a purchase cost. The{" "}
        <Link href="/tools/rental-yield-calculator-uk" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          UK rental yield calculator
        </Link>{" "}
        treats annual costs as recurring fees, insurance and maintenance. Put SDLT, LBTT or LTT into cash-to-complete, then
        measure yield on rent versus price. Additional-property surcharges are why a second home and a moving-home purchase
        are different questions.
      </p>

      <h2 id="official" className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">
        Official calculators still win at exchange
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        ToolLabz does not file returns. Before you exchange, use the{" "}
        <a
          href="https://www.tax.service.gov.uk/calculate-stamp-duty-land-tax/#/intro"
          className="font-medium text-violet-700 underline-offset-2 hover:underline"
        >
          HMRC SDLT calculator
        </a>{" "}
        for England and NI, and the Scottish and Welsh government calculators for those nations. Shared ownership, linked
        purchases, companies and lease NPV rent are out of scope here.
      </p>

      <BlogToolCallout
        href="/tools/stamp-duty-calculator-uk"
        title="Stamp Duty Calculator UK"
        body="Compare SDLT, LBTT and LTT with first-time, additional-property and cash-required fields."
      />
    </>
  );
}

export const ukStampDutyEnglandScotlandWalesGuidePost: BlogPostDefinition = {
  slug: "uk-stamp-duty-england-scotland-wales-guide",
  seoTitle: "How stamp duty works in England, Scotland and Wales",
  title: "How does stamp duty work in England, Scotland and Wales?",
  description:
    "SDLT, LBTT and LTT explained for 2026: first-time buyers, additional property, cash required, and why one UK calculator is enough.",
  excerpt:
    "Three nations, three taxes, one buyer question. Here are the published residential tables and what ToolLabz does — and does not — model.",
  publishedAt: "2026-09-06",
  dateModified: "2026-09-06T12:00:00.000Z",
  category: "Real Estate",
  tags: ["UK", "stamp duty", "SDLT", "LBTT", "LTT"],
  readingTimeMinutes: 11,
  relatedToolSlugs: [
    "stamp-duty-calculator-uk",
    "rental-yield-calculator-uk",
    "mortgage-affordability-calculator",
    "property-roi-calculator",
    "salary-after-tax-calculator-uk",
  ],
  relatedPostsSlugs: [
    "how-much-can-i-rent-my-house-for-uk",
    "rental-yield-vs-monthly-cash-flow-investment-property",
    "uk-take-home-pay-income-tax-national-insurance",
  ],
  tableOfContents: [
    { id: "england-ni", label: "England and NI (SDLT)" },
    { id: "scotland", label: "Scotland (LBTT)" },
    { id: "wales", label: "Wales (LTT)" },
    { id: "cash-needed", label: "Cash required" },
    { id: "yield", label: "Yield vs purchase tax" },
    { id: "official", label: "Official calculators" },
  ],
  keyTakeaways: [
    "England/NI, Scotland and Wales use different taxes and different first-time buyer rules.",
    "Additional property is a surcharge or a separate rate table, not a second URL.",
    "Stamp duty is cash-to-complete, not an annual yield cost.",
  ],
  editorialNote: ["Not tax or conveyancing advice. Confirm the official national calculator before exchange."],
  sources: [
    { label: "GOV.UK — SDLT residential rates", href: "https://www.gov.uk/stamp-duty-land-tax/residential-property-rates" },
    { label: "HMRC — SDLT calculator", href: "https://www.tax.service.gov.uk/calculate-stamp-duty-land-tax/#/intro" },
    { label: "Scottish Budget 2026-27 — LBTT", href: "https://www.gov.scot/publications/scottish-budget-2026-2027/pages/4/" },
    { label: "GOV.WALES — LTT rates and bands", href: "https://www.gov.wales/land-transaction-tax-rates-and-bands" },
  ],
  faqSchema: [
    {
      question: "Is stamp duty the same across the UK?",
      answer: "No. SDLT, LBTT and LTT are separate taxes with their own bands and reliefs.",
    },
    {
      question: "Do first-time buyers pay stamp duty?",
      answer:
        "In England and NI, relief applies up to £500,000 with 0% on the first £300,000. Scotland raises the nil-rate band to £175,000. Wales has no separate first-time buyer relief.",
    },
    {
      question: "What is SDLT versus LBTT?",
      answer: "SDLT is England and Northern Ireland. LBTT is Scotland. They are not interchangeable.",
    },
    {
      question: "Should I create a separate stamp duty calculator for each nation?",
      answer: "No. Same intent, one tool with a nation selector.",
    },
  ],
  Article,
};
