import Link from "next/link";
import type { BlogPostDefinition } from "../types";
import BlogToolCallout from "@/components/BlogToolCallout";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        You do not need to “feel” metric conversions - you need consistent anchors. Stone, feet-and-inches, and acres survive in
        everyday language long after school taught centimeters and hectares. The failure mode is not multiplication; it is mixing
        international definitions (especially acres) while filling out forms that assume a single coherent unit system.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="stone">
        Stone to kilograms: the 14-pound bridge
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        One stone is fourteen pounds, and the international pound maps to kilograms with a fixed definition - so stone to kg is a
        chained conversion with no opinionated knobs. When someone says “twelve stone seven,” normalize to decimal stone or
        convert stone and pounds separately before typing. Use the{" "}
        <Link href="/tools/stone-to-kg-converter" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          stone to kg converter
        </Link>{" "}
        for both directions and keep four decimals internally before rounding for display rules on medical or shipping forms.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="feet">
        Feet and inches to centimeters: height forms love centimeters
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Add inches to feet×12 for total inches, multiply by 2.54 for centimeters. Reverse path: divide centimeters by 2.54 for total
        inches, then split into feet and fractional inches for human-readable heights. The{" "}
        <Link href="/tools/feet-inches-to-cm-converter" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          feet &amp; inches to cm converter
        </Link>{" "}
        handles both directions; if inches exceed eleven, consider normalizing to the next foot to match how people speak.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="acres">
        Acres to hectares: farmland listings and back-of-envelope GIS
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        The international acre is 0.40468564224 hectares - handy when a UK or EU partner quotes hectares and your local note says
        acres. US legal descriptions sometimes reference survey acres that differ slightly; for deeds, read the footnote, not just
        the blog. For quick listing comparisons, the{" "}
        <Link href="/tools/acres-to-hectares-converter" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          acres to hectares converter
        </Link>{" "}
        keeps high-precision math so you can round later.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="table">
        When to reach for which Toollabz converter
      </h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm text-slate-800">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Scenario</th>
              <th className="px-4 py-3">Tool</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-3">UK body weight in stone → kg</td>
              <td className="px-4 py-3 font-medium">Stone ↔ kg</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Visa health height in cm ↔ ft/in</td>
              <td className="px-4 py-3 font-medium">Feet/inches ↔ cm</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Field size in listings</td>
              <td className="px-4 py-3 font-medium">Acres ↔ hectares</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="neighbors">
        Neighboring conversions on Toollabz
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Pair these with{" "}
        <Link href="/tools/cm-to-feet" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          cm to feet
        </Link>{" "}
        and{" "}
        <Link href="/tools/kg-to-lbs" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          kg to lbs
        </Link>{" "}
        when the same intake form bounces between metric and imperial columns. Browse the{" "}
        <Link href="/tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          tools directory
        </Link>{" "}
        for the full converters cluster.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="mistakes">
        Common mistakes that survive because “close enough” worked once
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
        <li>Using US survey acre math on international listings without noticing.</li>
        <li>Typing 5’14” instead of normalizing to 6’2” before converting.</li>
        <li>Rounding early in multi-step chains (shipping then tax then margin).</li>
        <li>Mixing warm-body weight with clothing weight on borderline medical thresholds.</li>
      </ul>

      <BlogToolCallout
        href="/tools/stone-to-kg-converter"
        title="Stone to kg converter"
        description="Switch stone→kg or kg→stone with high-precision output for forms and fitness logs."
      />

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="numbers">
        Numbers without narrative still need context
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Conversions answer unit questions, not clinical or legal outcomes. For broader “what does this margin mean?” vocabulary,
        read{" "}
        <Link href="/blog/gross-profit-vs-net-profit-explained-for-operators" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          gross vs net profit for operators
        </Link>{" "}
        and{" "}
        <Link href="/blog/how-to-calculate-roi" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          simple ROI framing
        </Link>{" "}
        when the same spreadsheet mixes hectares with revenue assumptions.
      </p>
    </>
  );
}

export const imperialMetricStoneFeetAcresHectaresConversionGuidePost: BlogPostDefinition = {
  slug: "imperial-metric-stone-feet-acres-hectares-conversion-guide",
  seoTitle: "Stone to KG, Feet/Inches to CM, Acres to Hectares | Toollabz",
  title: "Stone, feet/inches, and acres: practical imperial↔metric conversions without folklore",
  description:
    "UK stone to kg, height feet/inches to cm for forms, acres to hectares for land listings, international vs survey acre caveat, Toollabz converters, links to cm/feet, kg/lbs, tools directory, gross vs net, ROI.",
  excerpt:
    "Conversions fail in the wild because of definition drift and sloppy rounding - not because the arithmetic is mysterious. Here is a clean map of three stubborn imperial habits.",
  publishedAt: "2026-05-15",
  dateModified: "2026-05-15T18:50:00.000Z",
  category: "Converters",
  tags: ["metric", "imperial", "height", "land"],
  readingTimeMinutes: 15,
  relatedToolSlugs: ["stone-to-kg-converter", "feet-inches-to-cm-converter", "feet-to-cm-converter", "lbs-to-kg-converter", "acres-to-hectares-converter", "cm-to-feet", "kg-to-lbs", "working-days-calculator-uk"],
  relatedPostsSlugs: [
    "gross-profit-vs-net-profit-explained-for-operators",
    "markup-vs-margin-formulas-pricing-mistakes",
    "how-to-calculate-roi",
    "working-days-uk-timezones-business-slas-toollabz",
  ],
  tableOfContents: [
    { id: "stone", label: "Stone ↔ kg" },
    { id: "feet", label: "Feet/inches ↔ cm" },
    { id: "acres", label: "Acres ↔ hectares" },
    { id: "table", label: "Which tool when" },
    { id: "neighbors", label: "Neighboring tools" },
    { id: "mistakes", label: "Mistakes" },
    { id: "numbers", label: "Context beyond numbers" },
  ],
  keyTakeaways: [
    "Stone converts through the fixed 14 lb definition; keep precision through the chain before display rounding.",
    "Height forms want cm clarity - normalize inches past eleven before sharing human-readable ft/in.",
    "International acres differ from US survey acres; deeds need legal definitions, not blog shortcuts.",
  ],
  whenToUseTools: [
    "Use stone/kg and feet-inch/cm tools for body metrics and paperwork conversions.",
    "Use acres/hectares for land listings and coarse GIS comparisons - then escalate to geodesic area for polygons.",
  ],
  commonMistakes: [
    {
      title: "Survey acre surprise",
      body: "Some US legal parcels use survey acres; international math will be close but not identical where deeds matter.",
    },
    {
      title: "Double rounding",
      body: "Round once at the end for display; intermediate rounding stacks error in multi-step pipelines.",
    },
  ],
  faqSchema: [
    {
      question: "How many kilograms in a stone?",
      answer: "One stone is 14 international pounds; convert pounds to kilograms using the fixed conversion factor - Toollabz shows high precision.",
    },
    {
      question: "Why does my cm height differ slightly from the doctor’s chart?",
      answer: "Rounding policies and measurement posture differ; this page is pure unit math, not clinical measurement protocol.",
    },
    {
      question: "Can I convert GPS polygon acres here?",
      answer: "This is flat unit conversion; geodesic polygon area needs GIS tools.",
    },
  ],
  Article,
};
