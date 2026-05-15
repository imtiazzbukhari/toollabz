import Link from "next/link";
import type { BlogPostDefinition } from "../types";
import BlogToolCallout from "@/components/BlogToolCallout";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        Late fees are where polite AR becomes contract law and arithmetic at the same time. A simple-interest clause answers: “If
        you pay N days late, what extra dollars compensate me for the time value of that float?” It is not a moral judgment - it is a
        line item you should be able to explain on a phone call without reaching for a spreadsheet macro.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="simple-interest">
        Simple interest mental model
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        A common planning shape: <strong>fee ≈ principal × (annual rate ÷ 100) × (days ÷ 365)</strong>. That assumes a 365-day
        year basis - some commercial agreements specify 360; if yours does, adjust the effective rate or the formula you expect
        finance to enforce. The{" "}
        <Link href="/tools/invoice-late-fee-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          invoice late fee calculator
        </Link>{" "}
        follows the 365-day sketch so you can sanity-check invoices before counsel reviews wording.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="legal">
        Legal caps, consumer rules, and why “because SaaS does it” fails
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Jurisdictions differ on permissible late charges - especially for consumers. This article is not legal advice. It is a
        reminder that calculators output numbers; humans decide enforceability. If a fee surprises a customer, you will debate
        contract text, not decimal precision.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="gst">
        GST/VAT layers are a separate conversation
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Late fees may or may not carry tax depending on supply type and region. When you are also splitting Australian GST lines,
        use{" "}
        <Link href="/blog/gst-australia-inclusive-exclusive-10-percent-small-business" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          GST inclusive vs exclusive guidance
        </Link>{" "}
        and the{" "}
        <Link href="/tools/gst-calculator-australia" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          GST calculator Australia
        </Link>{" "}
        so you do not fold unrelated tax stories into the same cell as the late-fee policy.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="compare-compound">
        Simple vs compound (know which contract you signed)
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Compound interest accrues on accrued interest - simple interest does not. If your agreement compounds, a one-line
        calculator will mislead you; escalate to the finance model your company already uses for AR aging.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="mistakes">
        Operational mistakes beyond the formula
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
        <li>Starting the late clock from invoice send instead of clear due date.</li>
        <li>Applying fees after partial payments without reducing principal first.</li>
        <li>Quoting annual rates that do not match the day-count basis in the contract.</li>
        <li>Surprising enterprise procurement with fees their template forbids - read their paper early.</li>
      </ul>

      <BlogToolCallout
        href="/tools/invoice-late-fee-calculator"
        title="Invoice late fee calculator"
        description="Enter principal, days late, and contractual annual rate for a simple-interest fee snapshot plus total due."
      />

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="hub">
        Business tools hub
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Continue on the{" "}
        <Link href="/business-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          business tools hub
        </Link>{" "}
        and read{" "}
        <Link href="/blog/freelance-pricing-hourly-day-rate-mistakes-calculator-guide" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          freelance pricing
        </Link>{" "}
        when late payments are chronic rather than occasional - your pricing may be financing customers implicitly.
      </p>
    </>
  );
}

export const invoiceLateFeeSimpleInterestContractsToollabzPost: BlogPostDefinition = {
  slug: "invoice-late-fee-simple-interest-contracts-toollabz",
  seoTitle: "Invoice Late Fee Calculator: Simple Interest & Contracts | Toollabz",
  title: "Invoice late fees with simple interest: contracts, caps, and calculator hygiene",
  description:
    "Explain simple-interest late fees, 365 vs 360 bases, legal caution, GST separation, common AR mistakes, Toollabz invoice late fee calculator, GST AU article, freelance pricing, business hub.",
  excerpt:
    "Late fees are arithmetic plus contract law. Model simple interest clearly, separate tax layers, and know when to escalate beyond one-line calculators.",
  publishedAt: "2026-05-15",
  dateModified: "2026-05-15T18:40:00.000Z",
  category: "Business",
  tags: ["invoicing", "AR", "contracts", "finance"],
  readingTimeMinutes: 14,
  relatedToolSlugs: ["invoice-late-fee-calculator", "gst-calculator-australia", "vat-calculator", "discount-calculator"],
  relatedPostsSlugs: [
    "gst-australia-inclusive-exclusive-10-percent-small-business",
    "vat-calculator-guide-small-businesses",
    "freelance-pricing-hourly-day-rate-mistakes-calculator-guide",
    "markup-vs-margin-formulas-pricing-mistakes",
  ],
  tableOfContents: [
    { id: "simple-interest", label: "Simple interest" },
    { id: "legal", label: "Legal caution" },
    { id: "gst", label: "GST/VAT layers" },
    { id: "compare-compound", label: "Simple vs compound" },
    { id: "mistakes", label: "Mistakes" },
    { id: "hub", label: "Business hub" },
  ],
  keyTakeaways: [
    "Simple-interest late fees multiply principal by rate and day fraction - confirm the day-count basis matches the contract.",
    "Enforceability and caps are legal questions; calculators only output math given your inputs.",
    "Keep tax splitting workflows separate from late-fee policy to avoid muddled invoices.",
  ],
  editorialNote: ["Not legal advice - have counsel review fee clauses, especially for consumer-facing contracts."],
  whenToUseTools: [
    "Use invoice late fee calculator when reviewing overdue AR scenarios with explicit annual rates.",
    "Pair with GST calculator when invoices mix Australian tax lines with overdue policies.",
  ],
  commonMistakes: [
    {
      title: "Using compound models silently",
      body: "If the contract compounds, a simple-interest tool understates exposure - switch models.",
    },
    {
      title: "Confusing due date with receipt date",
      body: "Late clocks start from defined due dates in the agreement, not when someone opened email.",
    },
  ],
  faqSchema: [
    {
      question: "Does the calculator include GST?",
      answer: "No - it models late fees on a principal line; handle tax per your jurisdiction and advisor guidance.",
    },
    {
      question: "What if my contract uses a 360-day year?",
      answer: "Adjust the effective rate or model outside this 365-day sketch to match finance’s interpretation.",
    },
    {
      question: "Can I enforce any rate I type?",
      answer: "Not necessarily - usury and consumer protection rules vary; consult counsel for enforceable clauses.",
    },
  ],
  Article,
};
