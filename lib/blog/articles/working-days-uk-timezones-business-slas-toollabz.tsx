import Link from "next/link";
import type { BlogPostDefinition } from "../types";
import BlogToolCallout from "@/components/BlogToolCallout";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        Payroll and SLA math both need “how many weekdays?” answers, but they rarely need the same holiday calendar. UK payroll
        teams subtract bank holidays that land on weekdays. Global product teams sometimes count pure Monday to Friday spans and
        attach holiday tables separately in Jira. Time zones add a third axis when “midnight” is not midnight for the customer.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="uk-working">
        UK working days: weekdays minus holidays you enter
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        The{" "}
        <Link href="/tools/working-days-calculator-uk" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          working days calculator UK
        </Link>{" "}
        counts Monday through Friday inclusive on ISO dates using UTC anchors, then subtracts a holiday count you provide. It does
        not embed the UK bank holiday calendar because England, Scotland, and Northern Ireland differ. That is a feature: your
        contract already says which holiday set applies.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="business">
        Business days: neutral weekday counts for SLAs
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        The{" "}
        <Link href="/tools/business-days-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          business days calculator
        </Link>{" "}
        counts weekdays between inclusive dates without a holiday table. Customer success teams use it when the contract says
        “five business days” and both sides still argue whether Saturday counts. It does not.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="timezone">
        Time zone converter: wall clock vs UTC logs
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        When an incident spans Sydney and Dublin, someone always asks what 09:00 UTC means locally. The{" "}
        <Link href="/tools/time-zone-converter" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          time zone converter
        </Link>{" "}
        supports offset-style workflows already used elsewhere on Toollabz. Pair it with the{" "}
        <Link href="/tools/date-difference-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          date difference calculator
        </Link>{" "}
        when you need raw calendar span context next to weekday-only counts.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="compare">
        Comparison: inclusive dates and holiday policy
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
        <li>Both calculators here treat start and end dates inclusively when they fall on weekdays.</li>
        <li>UK tool expects you to subtract bank holidays manually; generic tool does not subtract any public holidays.</li>
        <li>Time zone shifts can change which calendar day a timestamp lands on; log in UTC, explain in local.</li>
      </ul>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="mistakes">
        Common mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
        <li>Mixing exclusive end dates from one vendor with inclusive counters from another.</li>
        <li>Forgetting May bank holiday moves some years when copying last year’s spreadsheet.</li>
        <li>Using local laptop timezone while the contract defines UTC business days.</li>
      </ul>

      <BlogToolCallout
        href="/tools/working-days-calculator-uk"
        title="Working days calculator UK"
        body="Count Mon–Fri between ISO dates, then subtract the bank holidays that apply to your payroll period."
      />

      <p className="mt-3 leading-7 text-slate-700">
        For body measurements that show up next to calendar planning in relocation threads, see{" "}
        <Link href="/blog/imperial-metric-stone-feet-acres-hectares-conversion-guide" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          imperial and metric conversions for stone, feet, and acres
        </Link>
        .
      </p>
    </>
  );
}

export const workingDaysTimezonePost: BlogPostDefinition = {
  slug: "working-days-uk-timezones-business-slas-toollabz",
  seoTitle: "UK working days, business days, and time zones for SLAs",
  title: "Working days in the UK, business days, and time zones",
  description:
    "Explain inclusive weekday counting, manual UK bank holiday subtraction, neutral business day SLAs, and how the time zone converter pairs with date difference tools on Toollabz.",
  excerpt:
    "Payroll and SLAs argue about the same integers with different holiday tables. Split UK weekday counts from global business-day counts and log in UTC.",
  publishedAt: "2026-05-16",
  dateModified: "2026-05-16T12:00:00.000Z",
  category: "Utility",
  tags: ["UK", "calendar", "timezone", "SLA"],
  readingTimeMinutes: 15,
  relatedToolSlugs: ["working-days-calculator-uk", "business-days-calculator", "time-zone-converter", "date-difference-calculator", "notice-period-calculator"],
  relatedPostsSlugs: ["imperial-metric-stone-feet-acres-hectares-conversion-guide", "uk-self-employed-dividend-salary-effective-percent-toollabz"],
  tableOfContents: [
    { id: "uk-working", label: "UK working days" },
    { id: "business", label: "Business days" },
    { id: "timezone", label: "Time zones" },
    { id: "compare", label: "Comparison" },
    { id: "mistakes", label: "Mistakes" },
  ],
  keyTakeaways: [
    "UK payroll needs explicit bank holiday subtraction; Toollabz does not guess your jurisdiction set.",
    "Business day SLAs often mean Mon–Fri only until contracts define holidays.",
    "UTC logging plus a time zone converter reduces “midnight bug” confusion.",
  ],
  whenToUseTools: [
    "Use working days UK when payroll asks for weekdays between payslip dates.",
    "Use business days when tickets reference generic business-day SLAs.",
    "Use time zone converter when correlating customer reports with UTC logs.",
  ],
  commonMistakes: [
    { title: "Scotland vs England holidays", body: "Subtract the correct count for your contract, not a generic UK list from memory." },
    { title: "Exclusive end dates", body: "Confirm whether your vendor uses inclusive or exclusive end semantics before debating counts." },
  ],
  faqSchema: [
    { question: "Does the UK tool include bank holidays automatically?", answer: "No. Enter how many bank holidays fall on weekdays in your range to subtract." },
    { question: "Are weekend work days counted?", answer: "No. Weekday tallies exclude Saturday and Sunday." },
    { question: "Why UTC anchors?", answer: "They keep counts reproducible across machines and daylight saving transitions." },
    { question: "How do I pair with SLAs?", answer: "Start with business days, then subtract contract holidays manually if required." },
    { question: "Where do time zones fit?", answer: "Use the time zone converter when wall clocks differ from log timestamps." },
  ],
  Article,
};
