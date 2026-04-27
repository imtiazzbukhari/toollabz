import Link from "next/link";
import type { BlogPostDefinition } from "../types";
import BlogToolCallout from "@/components/BlogToolCallout";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        VAT (value-added tax) is a consumption tax collected in stages. For operators, the recurring question is not “what is
        20%?” but whether a figure is <em>net</em> or <em>gross</em>, and whether you should add VAT or strip it out for a quote.
        Getting that direction wrong silently shifts margin.
      </p>

      <h2 id="add-remove" className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">
        Add VAT vs remove VAT (algebra)
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        If net = <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm">N</code> and VAT rate ={" "}
        <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm">v</code> (as decimal, e.g. 20% → 0.20), gross{" "}
        <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm">G = N × (1 + v)</code>. If you only know gross and need
        net, <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm">N = G / (1 + v)</code> and VAT portion is{" "}
        <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm">G − N</code>. Those two lines power most VAT calculator
        apps, including ours — the rest is UX and rounding policy.
      </p>

      <h2 id="rates" className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">
        Reference rates (verify before filing)
      </h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-violet-200/60 bg-white/80">
        <table className="min-w-full text-left text-sm text-slate-700">
          <caption className="border-b border-violet-100 px-4 py-2 text-left text-xs font-semibold text-slate-600">
            Illustrative standard rates — confirm with official sources for your period.
          </caption>
          <thead className="bg-violet-50/80 text-xs font-bold uppercase tracking-wide text-violet-900">
            <tr>
              <th className="px-4 py-2">Region</th>
              <th className="px-4 py-2">Typical headline VAT</th>
              <th className="px-4 py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-violet-100">
              <td className="px-4 py-2 font-medium">United Kingdom</td>
              <td className="px-4 py-2">20% standard (reduced/zero categories exist)</td>
              <td className="px-4 py-2">B2B reverse charge on certain cross-border services.</td>
            </tr>
            <tr className="border-t border-violet-100">
              <td className="px-4 py-2 font-medium">European Union</td>
              <td className="px-4 py-2">Varies by member state (often 17–27% standard bands)</td>
              <td className="px-4 py-2">OSS/IOSS and digital goods rules add complexity beyond a toy calculator.</td>
            </tr>
            <tr className="border-t border-violet-100">
              <td className="px-4 py-2 font-medium">United Arab Emirates</td>
              <td className="px-4 py-2">5% federal VAT (exemptions apply)</td>
              <td className="px-4 py-2">Design zones and specific supplies may differ.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-4 leading-7 text-slate-700">
        When you model a proposal, pick the rate that matches your customer jurisdiction and invoice type, then document it beside
        the number. For deeper SMB context, see our{" "}
        <Link href="/blog/vat-calculator-guide-small-businesses" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          VAT guide for small businesses
        </Link>{" "}
        and the{" "}
        <Link href="/finance-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          finance tools hub
        </Link>
        .
      </p>

      <BlogToolCallout
        href="/tools/vat-calculator"
        title="VAT calculator"
        description="Switch between adding VAT to a net price and extracting VAT from a gross receipt with clear rounding."
      />
    </>
  );
}

const faqSchema = [
  {
    question: "How do I add 20% VAT to a UK net price?",
    answer:
      "Multiply the net price by 1.20 to obtain the VAT-inclusive gross. If you need the VAT component alone, compute gross minus net, or equivalently multiply net by 0.20. Rounding should follow your invoice policy—some businesses round per line, others per invoice total.",
  },
  {
    question: "How do I remove VAT from a gross EU price?",
    answer:
      "Divide the gross amount by (1 + rate as decimal). Example at 19%: gross / 1.19 yields the net base; subtract net from gross to isolate VAT. If your receipt shows multiple rates, split line items—one blended division will be wrong.",
  },
  {
    question: "Does the Toollabz VAT calculator include reduced rates?",
    answer:
      "You can type any percentage the UI exposes, which covers reduced bands when you know the correct statutory rate for your supply. The tool does not maintain a live government rate database; always cross-check against official publications before filing.",
  },
  {
    question: "Is UAE VAT calculated the same way as EU VAT?",
    answer:
      "The multiply/divide structure is the same algebraically, but eligibility, zero-rating, and designations differ. Use the 5% headline only when your supply actually falls under the standard rated category for that emirate and period.",
  },
  {
    question: "Can I use this for invoices I send to clients?",
    answer:
      "Use it to rehearse numbers and sanity-check proposals, then export figures into your accounting system. Final invoices should follow your accountant’s chart of accounts, numbering rules, and disclosure text required locally.",
  },
  {
    question: "What if my marketplace collects VAT for me?",
    answer:
      "Platforms may remit OSS/IOSS or marketplace facilitator taxes. Your displayed price might already be gross of VAT in consumer contexts. Read the settlement report rather than guessing from the shelf sticker alone.",
  },
] as const;

export const vatCalculatorUkEuUaeAddRemoveGuidePost: BlogPostDefinition = {
  slug: "vat-calculator-uk-eu-uae-add-remove-guide",
  seoTitle: "VAT Calculator: Add & Remove VAT (UK, EU, UAE) | Toollabz",
  description:
    "Add vs remove VAT formulas, UK/EU/UAE reference rates (verify officially), worked examples, and a free VAT calculator on Toollabz.",
  title: "VAT Calculator: How to Add & Remove VAT (UK, EU, UAE Guide)",
  excerpt: "Net vs gross math, regional reference table, and calculator CTA — with compliance caveats spelled out.",
  publishedAt: "2026-04-26",
  category: "Business",
  tags: ["VAT", "UK", "EU", "UAE", "tax"],
  readingTimeMinutes: 15,
  tableOfContents: [
    { id: "add-remove", label: "Add vs remove VAT" },
    { id: "rates", label: "Regional reference rates" },
  ],
  relatedToolSlugs: ["vat-calculator", "invoice-generator", "profit-margin-calculator-business"],
  faqSchema: [...faqSchema],
  Article,
};
