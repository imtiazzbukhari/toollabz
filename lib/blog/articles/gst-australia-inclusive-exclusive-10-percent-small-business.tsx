import Link from "next/link";
import type { BlogPostDefinition } from "../types";
import BlogToolCallout from "@/components/BlogToolCallout";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        Australian GST at 10% sounds simple until you stare at an invoice total and realize nobody labeled whether it already
        includes tax. Retail receipts are often GST-inclusive; B2B quotes are often GST-exclusive until someone explicitly states
        otherwise. The math is not hard - mislabeling the basis is.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="inclusive-exclusive">
        Inclusive vs exclusive in one sentence each
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
        <li>
          <strong>GST-exclusive</strong>  -  the number you see is before GST; you add 10% to reach what many customers actually pay.
        </li>
        <li>
          <strong>GST-inclusive</strong>  -  the number already contains GST; you back out one-eleventh of the inclusive total to recover the GST component (because 10% on top of 100 is 110, and 10/110 = 1/11).
        </li>
      </ul>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="worked">
        Worked examples you can sanity-check in your head
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Start with <strong>$200 GST-exclusive</strong>. GST is <strong>$20</strong>, so the customer pays <strong>$220</strong> inclusive. Now run the
        reverse: <strong>$220 inclusive</strong> → GST component is <strong>$20</strong> (one-eleventh), net is <strong>$200</strong>. If your spreadsheet
        shows $22 GST on $220 inclusive, you applied 10% to the wrong base - that is the classic “double tax vibe” mistake.
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        Plug your own numbers into the{" "}
        <Link href="/tools/gst-calculator-australia" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          GST calculator Australia
        </Link>{" "}
        and toggle inclusive vs exclusive to see both lines without re-deriving fractions during a pricing call.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="register">
        Registration thresholds vs “should we show GST on quotes”
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Whether you must register for GST is an ATO question with turnover tests and supply-type wrinkles. This article will not
        replace that guidance. What we can say responsibly: once you are quoting GST-aware prices, align your templates so every
        PDF states whether figures are inclusive or exclusive. Confusion at quote stage becomes churn at payment stage.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="compare-vat">
        Compared to VAT thinking (without pretending the law is identical)
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        If you already think in VAT from UK/EU business, GST-inclusive math rhymes with “gross price contains tax” habits - but rates,
        exemptions, and invoice rules differ. Our{" "}
        <Link href="/blog/vat-calculator-guide-small-businesses" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          VAT guide for small businesses
        </Link>{" "}
        and{" "}
        <Link href="/blog/vat-calculator-uk-eu-uae-add-remove-guide" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          add/remove VAT walkthrough
        </Link>{" "}
        help you keep mental models parallel without merging legal regimes.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="rounding">
        Rounding: per line vs invoice total
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Xero, MYOB, and spreadsheet templates sometimes disagree by a few cents because line-level GST rounding differs from
        invoice-total rounding. Pick the policy your finance lead wants, document it in the quote footer, and stop “fixing” tools
        that are faithfully implementing a different rounding ladder.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="late-fees">
        Late fees and GST: separate stories
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        When an overdue invoice picks up a contractual simple-interest late fee, that arithmetic is separate from GST splitting - do
        not silently fold fees into the same “inclusive” bucket unless your policy says so. Model fees with the{" "}
        <Link href="/tools/invoice-late-fee-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          invoice late fee calculator
        </Link>
        , then model GST with the GST tool so your narrative stays legible in disputes.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="mistakes">
        Common mistakes that survive even after people “know GST”
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
        <li>Quoting GST-exclusive to consumers who expect shelf-style inclusive totals.</li>
        <li>Using 10% of the inclusive amount as GST instead of the one-eleventh split.</li>
        <li>Mixing AUD and USD in the same worksheet without locking FX columns.</li>
        <li>Forgetting some supplies are GST-free or input-taxed - your calculator cannot classify your catalog for you.</li>
      </ul>

      <BlogToolCallout
        href="/tools/gst-calculator-australia"
        title="GST calculator Australia (10%)"
        description="Switch inclusive vs exclusive modes, enter AUD amounts, and copy the split lines for quotes or review - not tax filing."
      />

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="finance-hub">
        Explore finance tools on Toollabz
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Visit the{" "}
        <Link href="/finance-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          finance tools hub
        </Link>{" "}
        for calculators that pair with pricing decisions - margins, ROI, and budgets - after you have clean GST lines.
      </p>
    </>
  );
}

export const gstAustraliaInclusiveExclusive10PercentSmallBusinessPost: BlogPostDefinition = {
  slug: "gst-australia-inclusive-exclusive-10-percent-small-business",
  seoTitle: "GST Inclusive vs Exclusive Australia (10%) Explained | Toollabz",
  title: "GST inclusive vs exclusive in Australia: the 10% math operators actually get wrong",
  description:
    "Clear AU GST explanations: inclusive vs exclusive, one-eleventh split, worked dollar examples, rounding realities, links to GST calculator, VAT comparisons, invoice late fees, and finance hub.",
  excerpt:
    "Ten percent GST is simple arithmetic with brutal social failure modes - usually mislabeling inclusive vs exclusive or applying 10% to the wrong base.",
  publishedAt: "2026-05-15",
  dateModified: "2026-05-15T18:20:00.000Z",
  category: "Finance",
  tags: ["GST", "Australia", "tax", "small business"],
  readingTimeMinutes: 17,
  relatedToolSlugs: ["gst-calculator-australia", "vat-calculator", "invoice-late-fee-calculator", "profit-margin-calculator-business"],
  relatedPostsSlugs: [
    "gst-vs-vat-uk-au-cross-border-pricing-toollabz",
    "vat-calculator-guide-small-businesses",
    "vat-calculator-uk-eu-uae-add-remove-guide",
    "invoice-late-fee-simple-interest-contracts-toollabz",
    "markup-vs-margin-formulas-pricing-mistakes",
    "freelance-pricing-hourly-day-rate-mistakes-calculator-guide",
  ],
  tableOfContents: [
    { id: "inclusive-exclusive", label: "Inclusive vs exclusive" },
    { id: "worked", label: "Worked examples" },
    { id: "register", label: "Registration context" },
    { id: "compare-vat", label: "Compared to VAT" },
    { id: "rounding", label: "Rounding" },
    { id: "late-fees", label: "Late fees" },
    { id: "mistakes", label: "Common mistakes" },
    { id: "finance-hub", label: "Finance hub" },
  ],
  keyTakeaways: [
    "GST-exclusive adds 10% to reach inclusive totals; inclusive splits use the one-eleventh method on the inclusive amount.",
    "Label quotes explicitly - consumer confusion is a pricing problem, not a calculator bug.",
    "Rounding policy belongs to finance ops; calculators should mirror the policy you document.",
  ],
  editorialNote: [
    "Educational content only - not ATO advice. Confirm classifications, registration, and reporting with a qualified tax agent.",
  ],
  whenToUseTools: [
    "Use GST calculator when reconciling invoices or sanity-checking quote templates.",
    "Pair with invoice late fee calculator when overdue arithmetic is also in play.",
  ],
  commonMistakes: [
    {
      title: "Ten percent of inclusive as GST",
      body: "That overstates tax on inclusive totals; use the net = inclusive ÷ 1.1 split unless your advisor instructs otherwise.",
    },
    {
      title: "Hiding GST-free lines inside blended totals",
      body: "Mixed-supply baskets need human classification - tools cannot infer exempt items from a single lump sum.",
    },
  ],
  faqSchema: [
    {
      question: "How do I remove GST from an inclusive price?",
      answer: "Divide inclusive by 1.1 to get the GST-exclusive amount; subtract to find GST, or use the Toollabz GST calculator inclusive mode.",
    },
    {
      question: "Is Australian GST always 10%?",
      answer: "Many supplies use 10%, but some supplies are GST-free or input-taxed - confirm supply type with professional guidance.",
    },
    {
      question: "Does this page tell me when to register for GST?",
      answer: "No. Registration depends on turnover tests and supply rules from the ATO; consult an accountant for eligibility.",
    },
    {
      question: "Why might my accounting software disagree by cents?",
      answer: "Per-line GST rounding vs invoice-total rounding causes small differences - align policy across quotes and invoices.",
    },
  ],
  Article,
};
