import Link from "next/link";
import type { BlogPostDefinition } from "../types";
import BlogToolCallout from "@/components/BlogToolCallout";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        If you sell digital services, run a remote agency, or keep books for a group that spans <strong>Australia</strong> and the{" "}
        <strong>United Kingdom</strong>, you will hear two different consumption-tax dialects: <strong>GST</strong> at a headline 10% in
        Australia and <strong>VAT</strong> with a 20% standard rate commonly quoted for UK supplies in many B2B examples. The algebra is
        similar (multiply or divide by <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm">1 + rate</code>), but the{" "}
        <em>labeling culture</em> on quotes and the <em>registration story</em> are not interchangeable. This page is a practical
        comparison for operators, not legal advice for any jurisdiction.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="snapshot">
        Snapshot table (headline rates only)
      </h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200/80 bg-white/90">
        <table className="min-w-full text-left text-sm text-slate-700">
          <caption className="border-b border-slate-100 px-4 py-2 text-left text-xs font-semibold text-slate-600">
            Verify current rates, exemptions, and registration rules with HMRC, the ATO, or your accountant before filing.
          </caption>
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-800">
            <tr>
              <th className="px-4 py-2">Topic</th>
              <th className="px-4 py-2">Australia (GST)</th>
              <th className="px-4 py-2">United Kingdom (VAT)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="px-4 py-2 font-medium">Typical standard headline</td>
              <td className="px-4 py-2">10% on many taxable supplies</td>
              <td className="px-4 py-2">20% standard rate (reduced/zero categories exist)</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="px-4 py-2 font-medium">Inclusive vs exclusive habits</td>
              <td className="px-4 py-2">B2C receipts often GST-inclusive; quotes may be exclusive until stated</td>
              <td className="px-4 py-2">B2B quotes often show net + VAT lines; consumer retail often VAT-inclusive</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="px-4 py-2 font-medium">Strip tax from a gross receipt</td>
              <td className="px-4 py-2">Divide inclusive by 1.10; GST portion is inclusive minus net (one-eleventh framing)</td>
              <td className="px-4 py-2">Divide inclusive by 1.20 at 20% standard; VAT is gross minus net</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="px-4 py-2 font-medium">What calculators do here</td>
              <td className="px-4 py-2">Arithmetic for labeled inputs only</td>
              <td className="px-4 py-2">Arithmetic for labeled inputs only</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="worked">
        Worked numbers you can trace in a spreadsheet
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        <strong>Australia:</strong> You quote <strong>$330 AUD GST-inclusive</strong> for a fixed package. Net is{" "}
        <strong>$330 ÷ 1.1 = $300</strong>, GST is <strong>$30</strong>. If someone multiplies $330 by 10% and calls that the GST
        component, they are using the wrong base (classic inclusive mistake).
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        <strong>United Kingdom (illustrative 20% standard):</strong> You quote <strong>£240 VAT-inclusive</strong> for a training day.
        Net is <strong>£240 ÷ 1.2 = £200</strong>, VAT is <strong>£40</strong>. If your contract should have been net-plus-VAT but the
        PDF only shows one number, resolve the ambiguity before signatures, not after payment.
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        Use the live tools when you want the UI to carry rounding policy for you:{" "}
        <Link href="/tools/gst-calculator-australia" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          GST calculator Australia
        </Link>{" "}
        and the{" "}
        <Link href="/tools/vat-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          VAT calculator
        </Link>
        .
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="uk-hub">
        UK payroll and distributions (separate from VAT mechanics)
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Once VAT lines are credible, founders still need PAYE vs dividend sketches. The{" "}
        <Link href="/uk-finance-tax" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          UK finance and tax hub
        </Link>{" "}
        bundles those calculators with explicit non-filing disclaimers, alongside respectful Zakat planning links when that topic
        matters to the same household books.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="when-which">
        When to open which long-form guide first
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
        <li>
          <Link href="/blog/gst-australia-inclusive-exclusive-10-percent-small-business" className="font-medium text-violet-700 underline-offset-2 hover:underline">
            GST inclusive vs exclusive (Australia)
          </Link>{" "}
          when your team keeps mislabeling quote bases.
        </li>
        <li>
          <Link href="/blog/vat-calculator-uk-eu-uae-add-remove-guide" className="font-medium text-violet-700 underline-offset-2 hover:underline">
            Add vs remove VAT (UK, EU, UAE)
          </Link>{" "}
          when you need the algebra spelled out for multiple regions.
        </li>
        <li>
          <Link href="/blog/uk-self-employed-dividend-salary-effective-percent-toollabz" className="font-medium text-violet-700 underline-offset-2 hover:underline">
            UK self-employed vs dividend vs salary sketches
          </Link>{" "}
          when consumption tax is fine but personal effective rates are the argument.
        </li>
      </ul>

      <BlogToolCallout
        href="/tools/gst-calculator-australia"
        title="GST calculator Australia"
        description="Toggle inclusive vs exclusive, copy net and GST lines for quotes and review meetings."
      />

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="outreach">
        Why this page is outreach-friendly
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Communities love shareable tables with honest caveats. If you reference this URL in a thread, lead with the limitation: rates
        and registration rules change, and mixed supplies need human classification. Then link the table as a mnemonic, not as law.
      </p>
    </>
  );
}

export const gstVsVatUkAuCrossBorderPricingToollabzPost: BlogPostDefinition = {
  slug: "gst-vs-vat-uk-au-cross-border-pricing-toollabz",
  seoTitle: "GST vs VAT: Australia vs UK Pricing Comparison | Toollabz",
  title: "GST vs VAT for Australia and UK operators: comparison table and worked examples",
  description:
    "Side-by-side GST (AU) vs VAT (UK) snapshot for operators, worked AUD and GBP examples, calculator links, UK hub pointer, and honest compliance caveats.",
  excerpt:
    "A practical AU vs UK consumption tax comparison with a reference table, inclusive pricing math, and links to GST and VAT calculators plus UK planning hub.",
  publishedAt: "2026-05-15",
  dateModified: "2026-05-15T19:00:00.000Z",
  category: "Finance",
  tags: ["GST", "VAT", "Australia", "UK", "cross-border"],
  readingTimeMinutes: 12,
  relatedToolSlugs: ["gst-calculator-australia", "vat-calculator", "currency-converter", "profit-margin-calculator-business"],
  relatedPostsSlugs: [
    "gst-australia-inclusive-exclusive-10-percent-small-business",
    "vat-calculator-uk-eu-uae-add-remove-guide",
    "uk-self-employed-dividend-salary-effective-percent-toollabz",
    "zakat-calculation-nisab-practical-guide-respectful",
  ],
  tableOfContents: [
    { id: "snapshot", label: "Snapshot table" },
    { id: "worked", label: "Worked examples" },
    { id: "uk-hub", label: "UK hub" },
    { id: "when-which", label: "Which guide first" },
    { id: "outreach", label: "Outreach use" },
  ],
  keyTakeaways: [
    "GST (AU) and VAT (UK) share net-gross algebra but differ in rates, labeling norms, and compliance detail.",
    "Never use 10% or 20% of an inclusive receipt as the tax component unless the base matches your jurisdiction’s rules.",
    "Pair consumption-tax math with the UK hub when the next question is PAYE, dividends, or sole trader sketches.",
  ],
  editorialNote: [
    "Educational comparison only. Confirm rates, exemptions, and registration with HMRC, the ATO, and your tax advisor.",
  ],
  whenToUseTools: [
    "Open GST calculator when reconciling Australian quotes or invoices.",
    "Open VAT calculator when modeling UK/EU/UAE gross-to-net splits with a chosen percentage.",
  ],
  commonMistakes: [
    {
      title: "Merging legal regimes because the math looks similar",
      body: "Similar fractions do not mean identical invoice disclosures, reverse charge, or OSS rules. Keep jurisdictions in separate worksheets.",
    },
    {
      title: "Publishing blended FX without stating the rate date",
      body: "Cross-border decks should show the FX table date beside AUD and GBP lines so readers do not treat snapshots as live feeds.",
    },
  ],
  faqSchema: [
    {
      question: "Is Australian GST the same as UK VAT?",
      answer:
        "They are both consumption taxes with net and gross conversions, but rates, exemptions, invoice rules, and registration tests differ. Treat this page as a mental model, not a filing guide.",
    },
    {
      question: "How do I strip GST from an inclusive Australian price?",
      answer: "Divide the inclusive amount by 1.1 to obtain the GST-exclusive net; subtract net from inclusive to isolate GST, or use the GST calculator Australia tool.",
    },
    {
      question: "How do I strip 20% UK VAT from an inclusive price?",
      answer: "At a 20% standard rate, divide inclusive by 1.2 to obtain the net; subtract net from inclusive for VAT. Reduced rates need a different divisor.",
    },
    {
      question: "Does Toollabz tell me which regime applies to my contract?",
      answer: "No. Jurisdiction and supply type drive that answer. Use accountants and official guidance for classification.",
    },
  ],
  Article,
};
