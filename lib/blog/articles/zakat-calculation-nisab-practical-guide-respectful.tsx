import Link from "next/link";
import type { BlogPostDefinition } from "../types";
import BlogToolCallout from "@/components/BlogToolCallout";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        Zakat is worship expressed through disciplined math: you identify zakatable wealth, compare it to a threshold called <em>nisab</em>, and - when the
        conditions you follow are met - apply a small percentage so wealth circulates. This page is <strong>not</strong> a religious ruling, a fatwa, or a
        replacement for a scholar you trust. It explains how calculators structure numbers so you can have clearer conversations with guidance you
        already rely on.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="what-calculator-does">
        What a calculator can do honestly
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        A respectful tool multiplies surplus above a threshold by a rate - usually two point five percent in many mainstream explanations - after <em>you</em>
        decide what counts as zakatable wealth and what nisab threshold applies for your lunar year. Toollabz{" "}
        <Link href="/tools/zakat-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          Zakat calculator
        </Link>{" "}
        follows that narrow job: you enter wealth, nisab, and rate; it returns arithmetic. It does not auto-fetch gold prices, infer school-specific
        rules, or adjudicate debts and exemptions.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="nisab">
        Nisab: why calculators ask you to type a number
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Nisab traditionally ties to gold and silver weights; market prices move, and institutions publish updated equivalents. Rather than silently
        guessing a spot price, the Toollabz calculator asks you to supply the threshold in the same currency units as your wealth total. That design is
        intentional: transparency beats fake precision.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="gold-cash">
        Gold vs cash vs “everything I see in the app”
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        People mix zakatable categories because banking apps make balances feel uniform. In planning conversations, separate personal cash, business
        operating cash you truly control, receivables you expect to collect, and gold held as savings - then ask qualified guidance how each line counts for
        you. A calculator only sees the single number you type.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="fx">
        Multi-currency reality
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        If you hold USD, EUR, and local currency, sum in one coherent way before entering wealth. The{" "}
        <Link href="/tools/currency-converter" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          currency converter
        </Link>{" "}
        can help sketch FX, but zakat planning also needs consistency about which rate snapshot you use for the lunar year - again, a human policy choice.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="mistakes">
        Common mistakes that are arithmetic, not theology
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
        <li>Applying 2.5% to gross income instead of zakatable wealth categories your school includes.</li>
        <li>Forgetting debts that reduce zakatable assets in some methodologies before comparing to nisab.</li>
        <li>Mixing household and business ledgers without a clear boundary.</li>
        <li>Using last year’s nisab number because a blog cached it - refresh from your authority’s table.</li>
      </ul>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="charity-finance">
        Where charity finance meets household planning
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        After you understand your surplus line, liquidity still matters. Some families pair zakat planning with emergency runway using{" "}
        <Link href="/tools/emergency-fund-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          emergency fund tools
        </Link>{" "}
        and broader balance-sheet context with{" "}
        <Link href="/blog/net-worth-calculator-five-minute-guide" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          net worth guidance
        </Link>
        . Those tools do not replace zakat rules - they help you avoid cash shocks when obligations and life happen in the same month.
      </p>

      <BlogToolCallout
        href="/tools/zakat-calculator"
        title="Zakat calculator"
        description="Enter zakatable wealth, your chosen nisab threshold, and rate - get surplus-line arithmetic only, with clear disclaimers."
      />

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="closing">
        Closing note
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        If anything here disagrees with your local scholar or institution, follow them - not a general-purpose website. Toollabz aims to reduce spreadsheet
        errors, not to compress centuries of scholarship into a text box.
      </p>
    </>
  );
}

export const zakatCalculationNisabPracticalGuideRespectfulPost: BlogPostDefinition = {
  slug: "zakat-calculation-nisab-practical-guide-respectful",
  seoTitle: "Zakat Calculation & Nisab: Practical, Respectful Guide | Toollabz",
  title: "Zakat calculation and nisab: how calculators help without replacing guidance",
  description:
    "Respectful explainer on zakatable wealth, nisab thresholds you supply, gold vs cash planning, FX consistency, common spreadsheet mistakes, and Toollabz Zakat calculator with currency and emergency-fund links.",
  excerpt:
    "Zakat is worship with disciplined math - this guide clarifies what calculators can do, why nisab is user-supplied, and where scholars still lead.",
  publishedAt: "2026-05-15",
  dateModified: "2026-05-15T18:25:00.000Z",
  category: "Finance",
  tags: ["Zakat", "planning", "charity", "finance"],
  readingTimeMinutes: 16,
  relatedToolSlugs: ["zakat-calculator", "currency-converter", "net-worth-calculator", "emergency-fund-calculator"],
  relatedPostsSlugs: [
    "net-worth-calculator-five-minute-guide",
    "hourly-vs-salary-comparison",
    "freelance-pricing-hourly-day-rate-mistakes-calculator-guide",
  ],
  tableOfContents: [
    { id: "what-calculator-does", label: "What calculators do" },
    { id: "nisab", label: "Nisab inputs" },
    { id: "gold-cash", label: "Gold vs cash" },
    { id: "fx", label: "Multi-currency" },
    { id: "mistakes", label: "Common mistakes" },
    { id: "charity-finance", label: "Liquidity context" },
    { id: "closing", label: "Closing note" },
  ],
  keyTakeaways: [
    "Calculators multiply declared surplus by a rate - they do not classify assets or set nisab for you.",
    "Supply nisab in the same currency units as wealth to avoid silent FX mistakes.",
    "Scholars and institutions outrank blog prose whenever they differ.",
  ],
  editorialNote: [
    "This article is educational, not a religious ruling. Consult qualified guidance for eligibility, timing, and categories.",
  ],
  whenToUseTools: [
    "Use Zakat calculator after you already know zakatable wealth and nisab threshold inputs.",
    "Use currency converter to normalize mixed-currency holdings before summing.",
  ],
  commonMistakes: [
    {
      title: "Letting apps choose categories for you",
      body: "Bank balances are not a substitute for zakatable-wealth definitions in your school of thought.",
    },
    {
      title: "Using stale nisab from memory",
      body: "Refresh thresholds when bullion or institution tables move mid-year planning.",
    },
  ],
  faqSchema: [
    {
      question: "Does Toollabz set nisab automatically?",
      answer: "No - you enter the threshold you follow so the tool stays transparent about assumptions.",
    },
    {
      question: "Is 2.5% always correct?",
      answer: "Many explanations use 2.5% on eligible surplus, but your scenario may differ - confirm with qualified guidance.",
    },
    {
      question: "Can I mix currencies without converting?",
      answer: "You should normalize to one currency with a clear FX policy before entering a single wealth total.",
    },
    {
      question: "Does this page replace a scholar?",
      answer: "No. It explains calculator structure and common spreadsheet pitfalls only.",
    },
  ],
  Article,
};
