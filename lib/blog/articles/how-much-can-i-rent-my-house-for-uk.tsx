import Link from "next/link";
import type { BlogPostDefinition } from "../types";

function QuickAnswerBox() {
  return (
    <div className="mb-8 rounded-xl border border-sky-200 bg-sky-50 px-5 py-4 text-slate-800">
      <p className="mb-2 font-semibold text-slate-950">Quick Answer: How much can I rent my house for?</p>
      <p className="leading-7">
        UK rental prices in 2026 average about GBP 1,280/month nationally, but vary significantly by region. A general guide:
        annual rent should equal 4-6% of the property&apos;s market value. For a GBP 300,000 property, expect GBP 1,000-GBP
        1,500/month. London averages are 2-3x higher. Use the calculator below for a location-specific estimate.
      </p>
    </div>
  );
}

function Article() {
  return (
    <div className="space-y-8 text-slate-700">
      <QuickAnswerBox />

      <section id="uk-average-rental-prices">
        <h2 className="text-2xl font-bold text-slate-900">UK Average Rental Prices by Region (2026)</h2>
        <p className="mt-3 leading-7">
          Regional averages give you a starting point before checking your street, property type, and condition. These figures
          reflect public market data reported by major rental portals such as Rightmove and Zoopla, but your specific area can
          vary sharply.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-900">
              <tr>
                <th className="px-4 py-3">Region</th>
                <th className="px-4 py-3">Average monthly rent</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["London", "GBP 2,121"],
                ["South East", "GBP 1,456"],
                ["East of England", "GBP 1,280"],
                ["North West", "GBP 895"],
                ["Yorkshire", "GBP 820"],
                ["Scotland", "GBP 960"],
                ["Wales", "GBP 740"],
              ].map(([region, rent]) => (
                <tr key={region} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-medium text-slate-900">{region}</td>
                  <td className="px-4 py-3">{rent}/month</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          These are averages. Your specific area, property size, transport links, school catchment, parking, garden space, and
          finish quality will move the realistic rent up or down.
        </p>
      </section>

      <section id="rental-yield-rule">
        <h2 className="text-2xl font-bold text-slate-900">The 4-6% Rental Yield Rule</h2>
        <p className="mt-3 leading-7">
          A simple rental estimate starts with gross yield: annual rent divided by property value, multiplied by 100. Many UK
          landlords use 4-6% as a first-pass guide, then adjust for local demand, void periods, mortgage cost, and maintenance.
        </p>
        <p className="mt-3 rounded-lg bg-slate-950 px-4 py-3 font-mono text-sm text-white">
          Annual Rent / Property Value x 100 = Gross Rental Yield
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-900">
              <tr>
                <th className="px-4 py-3">Property Value</th>
                <th className="px-4 py-3">4% Yield (Monthly)</th>
                <th className="px-4 py-3">5% Yield (Monthly)</th>
                <th className="px-4 py-3">6% Yield (Monthly)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["GBP 150,000", "GBP 500", "GBP 625", "GBP 750"],
                ["GBP 250,000", "GBP 833", "GBP 1,042", "GBP 1,250"],
                ["GBP 350,000", "GBP 1,167", "GBP 1,458", "GBP 1,750"],
                ["GBP 500,000", "GBP 1,667", "GBP 2,083", "GBP 2,500"],
              ].map((row) => (
                <tr key={row[0]} className="border-t border-slate-200">
                  {row.map((cell) => (
                    <td key={cell} className="px-4 py-3">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="rent-factors">
        <h2 className="text-2xl font-bold text-slate-900">What Factors Affect How Much Rent You Can Charge?</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-7">
          <li>Location: transport links, schools, crime levels, parking, and commuting time drive demand.</li>
          <li>Property size and condition: extra bedrooms, modern kitchens, outdoor space, and energy efficiency can lift rent.</li>
          <li>Furnished versus unfurnished: furnished homes may command more in city lets but can increase replacement costs.</li>
          <li>Supply and demand: a low-stock local market supports higher asking rents, while many similar listings cap pricing.</li>
          <li>EPC rating: efficient homes are cheaper to run, and higher EPC ratings increasingly support stronger rents.</li>
        </ul>
      </section>

      <section id="legal-requirements">
        <h2 className="text-2xl font-bold text-slate-900">Legal Requirements Before Renting Your House in the UK</h2>
        <p className="mt-3 leading-7">
          Before advertising, check the legal basics. You usually need an annual Gas Safety Certificate, an Electrical
          Installation Condition Report every five years, a valid EPC, deposit protection through TDS, DPS, or mydeposits, and
          Right to Rent checks. You may also need an HMO licence if five or more tenants from two or more households live there.
        </p>
      </section>

      <section id="rental-yield-calculator">
        <h2 className="text-2xl font-bold text-slate-900">Use Our Free Rental Yield Calculator</h2>
        <p className="mt-3 leading-7">
          Once you have a monthly rent estimate, convert it into gross yield and compare it with your property value.{" "}
          <Link href="/tools/rental-yield-calculator" className="font-semibold text-violet-800 underline-offset-2 hover:underline">
            Calculate your rental yield
          </Link>{" "}
          and then rerun the numbers with a lower rent to account for void periods.
        </p>
      </section>
    </div>
  );
}

export const rentalCalculatorUkPost: BlogPostDefinition = {
  slug: "how-much-can-i-rent-my-house-for-uk",
  title: "How Much Can I Rent My House For? (2026 UK Guide)",
  seoTitle: "How Much Can I Rent My House For? UK Rental Guide 2026",
  description:
    "Find out what rent to charge in 2026. UK rental averages by region, the 4-6% yield rule, legal requirements, and a free rental income calculator.",
  excerpt:
    "UK rental averages by region, the 4-6% yield rule, legal checks, and a calculator workflow for estimating what rent to charge.",
  publishedAt: "2026-06-18",
  dateModified: "2026-06-18T00:00:00.000Z",
  category: "Finance",
  tags: ["UK rental", "rental yield", "landlords"],
  readingTimeMinutes: 8,
  relatedToolSlugs: ["rental-yield-calculator", "rental-yield-calculator-uk", "property-roi-calculator"],
  tableOfContents: [
    { id: "uk-average-rental-prices", label: "UK average rental prices" },
    { id: "rental-yield-rule", label: "The 4-6% yield rule" },
    { id: "rent-factors", label: "Factors that affect rent" },
    { id: "legal-requirements", label: "Legal requirements" },
    { id: "rental-yield-calculator", label: "Rental yield calculator" },
  ],
  keyTakeaways: [
    "A first-pass UK rent estimate is often 4-6% of property value per year.",
    "Regional averages vary widely: London is far above Wales, Yorkshire, and the North West.",
    "Legal checks such as gas safety, EICR, EPC, deposit protection, and Right to Rent matter before letting.",
  ],
  sources: [
    { label: "Rightmove rental market reporting", href: "https://www.rightmove.co.uk/news/rental-price-tracker/" },
    { label: "GOV.UK private renting guidance", href: "https://www.gov.uk/private-renting" },
  ],
  faqSchema: [
    {
      question: "Can I rent my house without telling my mortgage lender?",
      answer:
        "No. You must get consent to let from your mortgage lender before renting. Renting without permission is usually a breach of mortgage terms and could create serious problems if the lender discovers it.",
    },
    {
      question: "How much should I charge for a room in a shared house?",
      answer:
        "Room rentals in shared houses range from about GBP 400 to GBP 1,200 per month depending on location, condition, and bills. London rooms often average around GBP 900/month, while regional cities commonly sit nearer GBP 500-GBP 650.",
    },
    {
      question: "Do I pay tax on rental income?",
      answer:
        "Yes. UK rental income is taxable after allowable deductions and personal allowance rules. You can usually deduct allowable expenses such as maintenance and letting agent fees, while mortgage interest relief works differently from a direct deduction.",
    },
    {
      question: "What is a good rental yield in the UK?",
      answer:
        "A gross rental yield of 5-8% is often considered good in the UK, though targets vary by region and risk. Net yield after maintenance, insurance, agent fees, mortgage costs, and void periods is usually lower.",
    },
  ],
  Article,
};
