import Link from "next/link";
import type { BlogPostDefinition } from "../types";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        Most people meet their mortgage payment through a headline number on a listing card. It feels precise, but it is often
        missing half the story. The real monthly hit is not just principal and interest. It is taxes, insurance, and sometimes PMI
        and HOA all stacked on top. If you skip those lines, your budget can look healthy right up until closing.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">What a full mortgage payment actually includes</h2>
      <p className="mt-3 leading-7 text-slate-700">
        A complete housing payment in the US is usually called <strong className="font-semibold text-slate-800">PITI</strong>:
        principal, interest, taxes, and insurance. If your down payment is below 20%, add PMI. If the property has an association,
        add HOA too. None of this is exotic. It is just the real monthly cash leaving your account.
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        If you want a clean worksheet, start with the{" "}
        <Link href="/tools/mortgage-payment-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          mortgage payment calculator
        </Link>{" "}
        and type each component explicitly instead of relying on a bundled estimate from a listing site.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Step-by-step: calculate a realistic monthly payment</h2>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">1) Start with loan amount, not purchase price</h3>
      <p className="mt-2 leading-7 text-slate-700">
        If the home is $520,000 and you put 10% down, your financed principal is about $468,000 before financed fees. That number
        drives principal + interest.
      </p>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">2) Add annual property tax and homeowners insurance</h3>
      <p className="mt-2 leading-7 text-slate-700">
        Divide annual tax and insurance by 12. This is where many budgets break, because buyers focus on note payment and forget
        escrow-heavy regions.
      </p>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">3) Include PMI when down payment is under 20%</h3>
      <p className="mt-2 leading-7 text-slate-700">
        PMI can be temporary, but it is still a monthly cost today. Model it as part of year-one affordability.
      </p>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">4) Add HOA and maintenance reserve</h3>
      <p className="mt-2 leading-7 text-slate-700">
        HOA is obvious. Maintenance is less visible, but no less real. Even conservative buyers should set aside a monthly reserve
        for repairs.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Real example: why PI-only feels cheaper than reality</h2>
      <p className="mt-3 leading-7 text-slate-700">
        Say your principal + interest comes to <strong className="font-semibold text-slate-800">$2,945</strong>. Then you add{" "}
        <strong className="font-semibold text-slate-800">$540</strong> taxes,{" "}
        <strong className="font-semibold text-slate-800">$145</strong> insurance,{" "}
        <strong className="font-semibold text-slate-800">$185</strong> PMI, and{" "}
        <strong className="font-semibold text-slate-800">$110</strong> HOA. Your practical monthly total becomes{" "}
        <strong className="font-semibold text-slate-800">$3,925</strong>. That is a $980 difference from PI-only.
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        Before you submit an offer, sanity-check your ceiling with the{" "}
        <Link
          href="/tools/mortgage-affordability-calculator-usa"
          className="font-medium text-violet-700 underline-offset-2 hover:underline"
        >
          mortgage affordability calculator
        </Link>{" "}
        so your payment target aligns with debt-to-income guardrails.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Common mistakes that make buyers feel “surprised” later</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-slate-700">
        <li>Using a listing estimate that excludes PMI or HOA.</li>
        <li>Assuming taxes stay flat after reassessment in a hot market.</li>
        <li>Treating maintenance as optional because it is not in escrow.</li>
        <li>Comparing rent to PI-only instead of full monthly ownership cost.</li>
      </ul>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Conclusion</h2>
      <p className="mt-3 leading-7 text-slate-700">
        A mortgage payment is not one number; it is a stack. If you model the full stack early, you make better decisions about
        home price, down payment, and timing. Then if rates move later, you can check whether a refinance is worth it with the{" "}
        <Link href="/tools/refinance-break-even-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          refinance break-even calculator
        </Link>
        .
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">FAQ</h2>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">Is escrow always required?</h3>
      <p className="mt-2 leading-7 text-slate-700">
        Not always, but many lenders require it, especially with lower down payments. Even when optional, budgeting monthly for tax
        and insurance is still smart.
      </p>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">Should I count maintenance in affordability?</h3>
      <p className="mt-2 leading-7 text-slate-700">
        Yes. Roofs, plumbing, and HVAC are not hypothetical expenses. If you ignore maintenance, your payment looks safer than it is.
      </p>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">Why does my lender estimate differ from online tools?</h3>
      <p className="mt-2 leading-7 text-slate-700">
        Differences usually come from tax assumptions, insurance quotes, PMI factors, or financed fees. Compare each line item, not
        just the final total.
      </p>
    </>
  );
}

export const mortgagePaymentWithTaxesInsurancePost: BlogPostDefinition = {
  slug: "how-to-calculate-mortgage-payment-with-taxes-and-insurance",
  seoTitle: "How to Calculate Mortgage Payment With Taxes and Insurance (PITI Guide)",
  description:
    "Learn how to calculate real monthly mortgage cost with taxes, insurance, PMI, and HOA. Includes step-by-step breakdown and practical example.",
  title: "How to calculate mortgage payment with taxes and insurance",
  excerpt:
    "The listing payment is often incomplete. Here is the full PITI method with a real monthly example so your budget reflects reality.",
  publishedAt: "2026-04-23",
  relatedToolSlugs: ["mortgage-payment-calculator", "mortgage-affordability-calculator-usa", "refinance-break-even-calculator"],
  faqSchema: [
    {
      question: "Is escrow always required for taxes and insurance?",
      answer:
        "Not in every scenario, but many lenders require escrow depending on loan type and down payment. Even without escrow, budget those costs monthly.",
    },
    {
      question: "Should maintenance be included when comparing rent vs buy?",
      answer:
        "Yes. Maintenance is a recurring ownership reality and should be included as a monthly reserve for fair comparison.",
    },
    {
      question: "Why can lender estimates differ from calculator outputs?",
      answer:
        "Differences usually come from PMI assumptions, tax estimates, insurance quotes, and financed fees that vary by lender and property.",
    },
  ],
  Article,
};
