import Link from "next/link";
import type { BlogPostDefinition } from "../types";
import BlogToolCallout from "@/components/BlogToolCallout";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        UK take-home pay is not “gross minus one tax rate.” PAYE usually removes Income Tax and employee National Insurance
        first, then any pension, salary sacrifice, or student loan your payroll is told to collect. The{" "}
        <Link href="/tools/salary-after-tax-calculator-uk" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          Salary After Tax Calculator UK
        </Link>{" "}
        applies the published 2026 to 2027 bands so you can compare offers. It is an estimate, not a payslip.
      </p>

      <h2 id="what-paye-does" className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">
        What PAYE actually deducts
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        PAYE is the collection method. Your employer estimates Income Tax from your tax code and year-to-date pay, then
        estimates Class 1 National Insurance from earnings in that pay period. Student loan and workplace pension are extra
        instructions, not part of the basic tax tables. If the tax code is wrong, the first months of a new job can look
        nothing like an annual model.
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        The generic{" "}
        <Link href="/tools/salary-after-tax-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          salary after tax calculator
        </Link>{" "}
        is a flat-rate planner: net = gross × (1 − tax rate). Use it only when you already have a single rate. Do not treat
        that page as a UK engine.
      </p>

      <h2 id="income-tax-vs-ni" className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">
        Income Tax versus National Insurance
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Income Tax uses your Personal Allowance (usually £12,570 in 2026/27) and then charges bands on taxable pay. England,
        Northern Ireland and Wales share the main table: 20% on the first £37,700 of taxable income, 40% up to an income of
        £125,140, and 45% above that. Scotland sets its own starter-to-top rates on employment income. Those figures come from{" "}
        <a href="https://www.gov.uk/income-tax-rates" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          GOV.UK Income Tax rates
        </a>{" "}
        and{" "}
        <a href="https://www.gov.uk/scottish-income-tax" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          GOV.UK Scottish Income Tax
        </a>
        .
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        Employee National Insurance is separate. For Category A in 2026/27, nothing is due until the primary threshold
        (£12,570). Then 8% applies up to the upper earnings limit (£50,270) and 2% above. Employer NI is 15% above a £5,000
        secondary threshold. That employer figure is a cost to the company, not a deduction from your net. Source:{" "}
        <a
          href="https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027"
          className="font-medium text-violet-700 underline-offset-2 hover:underline"
        >
          HMRC rates and thresholds for employers 2026 to 2027
        </a>
        .
      </p>

      <h2 id="allowance-taper" className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">
        The Personal Allowance taper
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Above £100,000 of adjusted net income the allowance falls by £1 for every £2. It reaches zero at £125,140. That
        stretch is often described as a 60% effective Income Tax band because you lose allowance while also paying 40%. The
        calculator tapers the allowance. It does not model High Income Child Benefit Charge or Marriage Allowance.
      </p>

      <h2 id="pension-sacrifice" className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">
        Pension contributions and salary sacrifice
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        A workplace pension can be relief at source, a net-pay arrangement, or salary sacrifice. Those three are not the same
        for National Insurance. In the ToolLabz model, the pension percentage reduces taxable pay only. Salary sacrifice
        reduces both taxable pay and NI-able pay. If your scheme is sacrifice, put the percentage in the sacrifice field so NI
        falls as well. If you are unsure, read your enrolment letter rather than guessing.
      </p>

      <h2 id="student-loan" className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">
        How a student loan changes take-home
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Plans 1, 2, 4 and 5 deduct 9% of earnings above that plan’s threshold. A postgraduate loan deducts 6% above £21,000
        and can sit on top of an undergraduate plan. Thresholds for 2026/27 are on the same HMRC employer page. The calculator
        uses annual earnings after salary sacrifice. It does not know your remaining balance or write-off date.
      </p>

      <h2 id="worked-example" className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">
        Worked example: £60,000 in England
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Gross £60,000, no pension, no sacrifice, no student loan, England. Personal Allowance £12,570 leaves £47,430 taxable.
        Income Tax is 20% on £37,700 (£7,540) plus 40% on £9,730 (£3,892), total £11,432. Employee NI is 8% on £37,700
        (£3,016) plus 2% on £9,730 (£194.60), total £3,210.60. Net is about £45,357.40 a year, or about £3,780 a month. A 5%
        salary sacrifice on the same salary lowers both tax and NI; a 5% employee pension lowers tax only in this model.
      </p>

      <h2 id="limitations" className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">
        Assumptions and limits
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
        <li>Tax year 2026 to 2027, reviewed 6 September 2026 against GOV.UK. Budgets can change bands.</li>
        <li>Assumes tax code 1257L and Category A National Insurance.</li>
        <li>No benefits in kind, Blind Person’s Allowance, or emergency tax codes.</li>
        <li>Self-employed Class 2/4 NI and dividend tax belong on their own tools, not this page.</li>
      </ul>

      <BlogToolCallout
        href="/tools/salary-after-tax-calculator-uk"
        title="Salary After Tax Calculator UK"
        body="Run the 2026/27 PAYE estimate with nation, pension, sacrifice and student loan fields."
      />

      <p className="mt-6 leading-7 text-slate-700">
        Buying a home at the same time? Estimate purchase tax on the{" "}
        <Link href="/tools/stamp-duty-calculator-uk" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          Stamp Duty Calculator UK
        </Link>{" "}
        rather than folding SDLT into a salary model. Sole traders should stay on the{" "}
        <Link href="/tools/self-employed-tax-calculator-uk" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          self-employed UK sketch
        </Link>
        .
      </p>
    </>
  );
}

export const ukTakeHomePayIncomeTaxNationalInsurancePost: BlogPostDefinition = {
  slug: "uk-take-home-pay-income-tax-national-insurance",
  seoTitle: "How UK take-home pay is calculated (Income Tax and NI)",
  title: "How is take-home pay calculated in the UK?",
  description:
    "How UK PAYE take-home works in 2026/27: Income Tax bands, employee National Insurance, pension, salary sacrifice and student loan, with a £60,000 England example.",
  excerpt:
    "PAYE is Income Tax plus National Insurance, then the extras your payroll is told to take. Here is the 2026/27 shape without pretending to be HMRC software.",
  publishedAt: "2026-09-06",
  dateModified: "2026-09-06T12:00:00.000Z",
  category: "Finance",
  tags: ["UK", "PAYE", "take-home pay", "National Insurance", "Income Tax"],
  readingTimeMinutes: 12,
  relatedToolSlugs: [
    "salary-after-tax-calculator-uk",
    "self-employed-tax-calculator-uk",
    "dividend-tax-calculator-uk",
    "stamp-duty-calculator-uk",
    "employee-cost-calculator",
  ],
  relatedPostsSlugs: [
    "how-to-calculate-take-home-salary-country-guide",
    "uk-self-employed-dividend-salary-effective-percent-toollabz",
    "uk-stamp-duty-england-scotland-wales-guide",
  ],
  tableOfContents: [
    { id: "what-paye-does", label: "What PAYE deducts" },
    { id: "income-tax-vs-ni", label: "Income Tax vs NI" },
    { id: "allowance-taper", label: "Allowance taper" },
    { id: "pension-sacrifice", label: "Pension and sacrifice" },
    { id: "student-loan", label: "Student loan" },
    { id: "worked-example", label: "£60,000 example" },
    { id: "limitations", label: "Limits" },
  ],
  keyTakeaways: [
    "Income Tax and National Insurance are different deductions with different thresholds.",
    "Scotland has its own Income Tax bands; Wales does not.",
    "Salary sacrifice and employee pension are not interchangeable for NI.",
  ],
  editorialNote: ["Not tax advice. Confirm filings and payroll with HMRC-qualified professionals."],
  sources: [
    { label: "GOV.UK — Income Tax rates and Personal Allowances", href: "https://www.gov.uk/income-tax-rates" },
    { label: "GOV.UK — Rates and thresholds for employers 2026 to 2027", href: "https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027" },
    { label: "GOV.UK — Income Tax in Scotland", href: "https://www.gov.uk/scottish-income-tax" },
  ],
  faqSchema: [
    {
      question: "How is take-home pay calculated in the UK?",
      answer:
        "Start from gross, subtract salary sacrifice, apply Income Tax bands after Personal Allowance, subtract employee National Insurance, then pension and student loan if they apply.",
    },
    {
      question: "What is the difference between Income Tax and National Insurance?",
      answer:
        "Income Tax uses the Personal Allowance and progressive bands. Employee NI uses the primary threshold and upper earnings limit and does not use the same bands.",
    },
    {
      question: "Does salary sacrifice reduce National Insurance?",
      answer: "Usually yes, because sacrificed pay is not NI-able. A plain employee pension contribution often does not reduce NI.",
    },
    {
      question: "Is this official HMRC software?",
      answer: "No. It is a planning estimate using published 2026/27 rates. Use payroll software or a tax agent for filings.",
    },
  ],
  Article,
};
