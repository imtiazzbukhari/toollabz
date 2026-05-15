import Link from "next/link";
import type { BlogPostDefinition } from "../types";
import BlogToolCallout from "@/components/BlogToolCallout";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        UK tax conversations online often collapse because people mix three different layers: statutory rules, personal
        allowances, and cash timing. Toollabz publishes small calculators that use <strong>effective percentages you supply</strong>{" "}
        so you can mirror an accountant spreadsheet without pretending HMRC math is hard-coded into a free webpage.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="self-employed">
        Self-employed sketches: profit, tax, NI in one line
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        The{" "}
        <Link href="/tools/self-employed-tax-calculator-uk" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          self employed tax calculator UK
        </Link>{" "}
        multiplies annual profit by income tax and NI percentages you enter. Class 2, Class 4, and personal allowance stacking are
        not auto-modeled because those rules move with budgets. Instead, bring the blended rate your advisor already put in a
        forecast and use the tool for reserves planning, not filing.
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        Payments on account also move cash timing. A model that only shows “after tax profit” still helps you decide how much to
        park in a business savings pot before January, even if it does not print HMRC forms.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="dividends">
        Dividends: why “effective dividend tax %” is a planning hack
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        The{" "}
        <Link href="/tools/dividend-tax-calculator-uk" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          dividend tax calculator UK
        </Link>{" "}
        applies one percentage to gross dividends. Real life has allowances, bands, and interactions with salary. The hack is
        intentional: directors often already have a blended rate from their accountant for board slides. Type that rate, get a
        net figure, and label the slide “illustrative.”
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="salary">
        PAYE salary after tax UK: compare with sole trader sketches
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        The{" "}
        <Link href="/tools/salary-after-tax-calculator-uk" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          salary after tax calculator UK
        </Link>{" "}
        uses gross salary plus income tax, NI, and pension percentages. It is still not a payroll engine, but it is the right shape
        when someone asks “if I take this PAYE offer, what net hits my bank?” Pair it with the{" "}
        <Link href="/blog/freelance-pricing-hourly-day-rate-mistakes-calculator-guide" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          freelance pricing and day rate guide
        </Link>{" "}
        when you are choosing between employment and contracting routes.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="compare">
        Comparison: which calculator matches which life event
      </h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm text-slate-800">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Life event</th>
              <th className="px-4 py-3">Start here</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-3">Sole trader year-end reserves</td>
              <td className="px-4 py-3">Self employed tax calculator UK</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Director distribution planning</td>
              <td className="px-4 py-3">Dividend tax calculator UK</td>
            </tr>
            <tr>
              <td className="px-4 py-3">PAYE offer evaluation</td>
              <td className="px-4 py-3">Salary after tax UK</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="mistakes">
        Common mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
        <li>Typing statutory headline rates instead of blended effective rates from your forecast.</li>
        <li>Forgetting pension salary sacrifice changes both tax and NI bases.</li>
        <li>Mixing Scottish and rest-of-UK band assumptions without relabeling.</li>
        <li>Treating illustrative tools as HMRC submissions.</li>
      </ul>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="when">
        When to use these tools
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
        <li>When you already have advisor percentages and need quick net figures for decisions.</li>
        <li>When comparing PAYE vs dividends at a whiteboard level.</li>
        <li>When building personal cash buffers before January balancing payments.</li>
      </ul>

      <BlogToolCallout
        href="/tools/salary-after-tax-calculator-uk"
        title="Salary after tax calculator UK"
        body="Estimate take-home from gross with tax, NI, and pension fields you control."
      />

      <p className="mt-3 leading-7 text-slate-700">
        For wider money context, read{" "}
        <Link href="/blog/net-worth-calculator-five-minute-guide" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          net worth in five minutes
        </Link>{" "}
        and{" "}
        <Link href="/blog/hourly-vs-salary-comparison" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          hourly vs salary framing
        </Link>
        . Australian readers can compare GST habits with{" "}
        <Link href="/blog/gst-australia-inclusive-exclusive-10-percent-small-business" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          GST inclusive vs exclusive
        </Link>
        .
      </p>
    </>
  );
}

export const ukTaxSketchesPost: BlogPostDefinition = {
  slug: "uk-self-employed-dividend-salary-effective-percent-toollabz",
  seoTitle: "UK self employed, dividends, and PAYE: effective percent models",
  title: "UK self employment, dividends, and PAYE take-home sketches",
  description:
    "Use effective tax and NI percentages responsibly: self employed profit sketches, dividend net after your blended rate, and PAYE salary after tax UK alongside freelance and net worth guides on Toollabz.",
  excerpt:
    "HMRC rules move; free tools should not pretend to file for you. These calculators mirror advisor percentages for planning, not submissions.",
  publishedAt: "2026-05-16",
  dateModified: "2026-05-16T12:00:00.000Z",
  category: "Finance",
  tags: ["UK", "tax", "self employed", "dividends", "PAYE"],
  readingTimeMinutes: 18,
  relatedToolSlugs: [
    "self-employed-tax-calculator-uk",
    "dividend-tax-calculator-uk",
    "salary-after-tax-calculator-uk",
    "freelance-day-rate-calculator",
    "employee-cost-calculator",
    "invoice-late-fee-calculator",
  ],
  relatedPostsSlugs: [
    "freelance-pricing-hourly-day-rate-mistakes-calculator-guide",
    "employee-loaded-cost-pricing-seat-economics-toollabz",
    "gst-australia-inclusive-exclusive-10-percent-small-business",
    "net-worth-calculator-five-minute-guide",
    "hourly-vs-salary-comparison",
  ],
  tableOfContents: [
    { id: "self-employed", label: "Self employed" },
    { id: "dividends", label: "Dividends" },
    { id: "salary", label: "PAYE salary" },
    { id: "compare", label: "Comparison" },
    { id: "mistakes", label: "Mistakes" },
    { id: "when", label: "When to use" },
  ],
  keyTakeaways: [
    "Blended effective rates belong in planning calculators; statutory band engines belong in certified software.",
    "Dividend and salary tools answer different cash timing questions; label slides illustrative.",
    "Pair UK tools with freelance pricing content when comparing contracting paths.",
  ],
  editorialNote: ["Not tax advice. Confirm filings with HMRC-qualified professionals."],
  whenToUseTools: [
    "Use self employed calculator when you have annual profit and effective tax plus NI percentages.",
    "Use dividend calculator when the board already has a blended dividend tax rate.",
    "Use salary calculator UK when evaluating PAYE offers with pension contributions modeled.",
  ],
  commonMistakes: [
    { title: "Using headline bands literally", body: "Effective rates from forecasts already fold allowances and bands." },
    { title: "Mixing currencies", body: "Keep inputs in GBP for UK context to avoid silent FX mistakes." },
  ],
  faqSchema: [
    {
      question: "Is this official HMRC software?",
      answer: "No. These are arithmetic sketches for planning with percentages you supply.",
    },
    {
      question: "Where do I get effective percentages?",
      answer: "From your accountant, payroll, or your own spreadsheet model that mirrors your situation.",
    },
    {
      question: "Does the dividend tool model the dividend allowance?",
      answer: "Fold allowances into the effective percentage you enter rather than hard-coding law that changes with budgets.",
    },
    {
      question: "Can I model Scottish rates?",
      answer: "Yes by entering the effective rates that reflect Scottish income tax treatment in your forecast.",
    },
    {
      question: "Should I include student loans?",
      answer: "If your forecast includes loan deductions, fold them into the PAYE percentage fields or model separately.",
    },
  ],
  Article,
};
