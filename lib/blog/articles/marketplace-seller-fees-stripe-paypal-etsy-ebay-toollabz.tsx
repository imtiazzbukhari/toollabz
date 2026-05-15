import Link from "next/link";
import type { BlogPostDefinition } from "../types";
import BlogToolCallout from "@/components/BlogToolCallout";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        Marketplace fee statements are honest and still confusing. Stripe might separate card network costs from platform fees.
        PayPal tiers differ for micropayments. Etsy stacks listing, transaction, and payment processing lines. eBay final value fees
        change with category caps and promoted listings. A planning calculator should not pretend to download your CSV. It should
        let you type the percentages and fixed lines you already see on your statement, then iterate quickly while repricing SKUs.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="stripe">
        Stripe: percent plus fixed is the mental model
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        The{" "}
        <Link href="/tools/stripe-fee-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          Stripe fee calculator
        </Link>{" "}
        combines a percentage and a fixed per charge. Pull both numbers from your dashboard export for the month you care about.
        International cards, FX, Radar, Billing, and VAT on fees are manual overlays. That is not laziness; it is realism. Your
        spreadsheet already does the same folding when finance says “use 1.7% blended for EU cards this quarter.”
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="paypal">
        PayPal: domestic goods and services vs friends and family
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        The{" "}
        <Link href="/tools/paypal-fee-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          PayPal fee calculator
        </Link>{" "}
        targets commercial-style percent plus fixed fees. Friends and family transfers are usually a different product with
        different risk. If your statement shows micropayment pricing, lower the percent and fixed inputs accordingly.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="etsy">
        Etsy: listing plus stacked percents
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        The{" "}
        <Link href="/tools/etsy-fee-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          Etsy fee calculator
        </Link>{" "}
        sums a flat listing fee with transaction and payment processing percentages on item price. Offsite ads and regulatory fees
        can dominate margin for some shops. Model them as extra percent lines in your own sheet, then type the net blended inputs
        here when you want a quick answer during a pricing call.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="ebay">
        eBay: final value fee plus per-order fixed
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        The{" "}
        <Link href="/tools/ebay-fee-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          eBay fee calculator
        </Link>{" "}
        focuses on final value percent and a fixed closing fee. Promoted listings and insertion fees belong as separate rows. If
        your category caps FVF, reflect the cap by lowering the effective percent you type.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="compare">
        Comparison: what each marketplace statement emphasizes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
        <li>Stripe: transparency into card costs for some statements, still needs blending for planning.</li>
        <li>PayPal: strong consumer brand, fee tables vary by account and region.</li>
        <li>Etsy: stacked percents on small tickets hurt unless prices include fees consciously.</li>
        <li>eBay: promoted listing spend can be optional but sometimes feels mandatory for visibility.</li>
      </ul>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="mistakes">
        Common mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
        <li>Forgetting VAT on fees in regions where it applies, then blaming the SKU margin.</li>
        <li>Using US fee tables while selling primarily in the UK or EU.</li>
        <li>Ignoring refunds and chargebacks when setting cash reserves.</li>
        <li>Comparing gross marketplace sales to net bank deposits without a bridge table.</li>
      </ul>

      <BlogToolCallout
        href="/tools/stripe-fee-calculator"
        title="Stripe fee calculator"
        body="Model percent plus fixed on each charge, then compare with PayPal and marketplaces side by side."
      />

      <p className="mt-3 leading-7 text-slate-700">
        Pair payout math with{" "}
        <Link href="/blog/roi-vs-roas-when-to-trust-each-metric" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          ROI vs ROAS trust boundaries
        </Link>{" "}
        and margin thinking in{" "}
        <Link href="/blog/markup-vs-margin-formulas-pricing-mistakes" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          markup vs margin formulas
        </Link>
        .
      </p>
    </>
  );
}

export const marketplaceFeesPost: BlogPostDefinition = {
  slug: "marketplace-seller-fees-stripe-paypal-etsy-ebay-toollabz",
  seoTitle: "Stripe, PayPal, Etsy, eBay fees: planning models for sellers",
  title: "Marketplace seller fees: Stripe, PayPal, Etsy, and eBay",
  description:
    "Model percent plus fixed Stripe and PayPal fees, Etsy listing and stacked percents, and eBay final value sketches with honest limits. Link to ROI vs ROAS and margin guides on Toollabz.",
  excerpt:
    "Statements already tell the truth in CSV form. These calculators help you type blended rates quickly while repricing, not replace your payout exports.",
  publishedAt: "2026-05-16",
  dateModified: "2026-05-16T12:00:00.000Z",
  category: "Finance",
  tags: ["Stripe", "PayPal", "Etsy", "eBay", "fees"],
  readingTimeMinutes: 17,
  relatedToolSlugs: ["stripe-fee-calculator", "paypal-fee-calculator", "etsy-fee-calculator", "ebay-fee-calculator", "unit-price-calculator", "profit-margin-calculator-business"],
  relatedPostsSlugs: ["roi-vs-roas-when-to-trust-each-metric", "markup-vs-margin-formulas-pricing-mistakes", "uk-self-employed-dividend-salary-effective-percent-toollabz"],
  tableOfContents: [
    { id: "stripe", label: "Stripe" },
    { id: "paypal", label: "PayPal" },
    { id: "etsy", label: "Etsy" },
    { id: "ebay", label: "eBay" },
    { id: "compare", label: "Comparison" },
    { id: "mistakes", label: "Mistakes" },
  ],
  keyTakeaways: [
    "Blended percent plus fixed captures most domestic card stories; fold international and tax-on-fees manually.",
    "Etsy and eBay need extra rows for ads, insertion, and refunds that calculators cannot guess from price alone.",
    "Pair fee tools with margin content so gross sales do not disguise weak contribution.",
  ],
  whenToUseTools: [
    "When repricing SKUs after a marketplace fee change email.",
    "When building a bridge from gross GMV to expected bank deposits.",
  ],
  commonMistakes: [
    { title: "Single global fee percent", body: "Split regions or copy monthly blended rates from exports." },
    { title: "Ignoring refunds", body: "Reserve cash separately; fee credits lag by statement cycle." },
  ],
  faqSchema: [
    { question: "Does this replace Stripe reporting?", answer: "No. It is a fast planning layer using inputs you control." },
    { question: "Where do I get percents?", answer: "From your monthly CSV or fee schedule PDF for the account and region." },
    { question: "Can I include VAT on fees?", answer: "Increase effective percent manually when your statement includes VAT lines." },
    { question: "Promoted listings?", answer: "Add ad spend as a separate cost row outside simple FVF models." },
    { question: "Currency?", answer: "Keep each run in one currency for clean comparisons." },
  ],
  Article,
};
