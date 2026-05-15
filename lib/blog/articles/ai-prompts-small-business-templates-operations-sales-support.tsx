import Link from "next/link";
import type { BlogPostDefinition } from "../types";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        Small businesses do not need thousand-line prompt libraries - they need a handful of reusable patterns with slots for
        customer context, guardrails against hallucinated numbers, and a review step that matches how thin teams actually ship work.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="template">
        The five-slot prompt skeleton
      </h2>
      <ol className="mt-3 list-decimal space-y-3 pl-6 text-slate-700">
        <li>
          <strong>Role</strong> - “You are an ops lead at a 12-person services firm…”
        </li>
        <li>
          <strong>Audience</strong> - reading level, jurisdiction, risk tolerance.
        </li>
        <li>
          <strong>Inputs</strong> - paste facts; explicitly forbid inventing metrics not present.
        </li>
        <li>
          <strong>Output shape</strong> - bullets vs email vs SOP steps; max words.
        </li>
        <li>
          <strong>Verification</strong> - “List assumptions separately” or “If data missing, ask one clarifying question only.”
        </li>
      </ol>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="ops">
        Operations: weekly status to clients without fluff
      </h2>
      <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50/80 p-4 font-mono text-sm leading-relaxed text-slate-800">
        {`Role: account manager at a small logistics broker.\nAudience: busy shipper who scans email on mobile.\nFacts: {{BULLETS_FROM_CRM}}.\nTask: Draft a 120-word Friday update with what shipped, what is blocked, and one explicit ask.\nRules: Do not invent delays; if a date is unknown write “TBD” and name the owner.\nOutput: subject + body.`}
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="sales">
        Sales: cold outreach that cites first-party observations
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Pair prompts with the{" "}
        <Link href="/tools/ai-cold-email-generator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          AI cold email generator
        </Link>{" "}
        and{" "}
        <Link href="/tools/ai-email-subject-line-generator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          subject line generator
        </Link>
        , but insist the model only reference facts you pasted from LinkedIn or public filings - never let it hallucinate traction
        metrics.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="support">
        Support: macros that stay on-brand
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Feed ticket snippets and policy excerpts; require the model to quote policy section titles instead of paraphrasing legal
        promises. After generation, run a quick read against{" "}
        <Link href="/blog/how-ai-content-detectors-work-limits-ethics" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          detector limitations
        </Link>{" "}
        so you do not ship robotic tone to angry customers.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="compare">
        Prompt depth vs maintenance cost
      </h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm text-slate-800">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Style</th>
              <th className="px-4 py-3">When it shines</th>
              <th className="px-4 py-3">Failure mode</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-3 font-medium">Short system + strict slots</td>
              <td className="px-4 py-3">Daily ops cadence</td>
              <td className="px-4 py-3">Forgetting to refresh banned phrases quarterly</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Long playbooks</td>
              <td className="px-4 py-3">Rare complex proposals</td>
              <td className="px-4 py-3">Nobody reads version 19; drift accumulates</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="marketing">
        Marketing metrics literacy
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        When prompts generate campaign summaries, anchor vocabulary using{" "}
        <Link href="/blog/roi-vs-roas-when-to-trust-each-metric" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          ROI vs ROAS
        </Link>{" "}
        so account managers do not confuse platform ratios with board metrics. For funnel math drills, the{" "}
        <Link href="/tools/conversion-rate-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          conversion rate calculator
        </Link>{" "}
        pairs well with qualitative copy prompts.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="humanization">
        Humanization handoff
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        After drafting, move to{" "}
        <Link href="/blog/ai-text-humanization-editorial-workflow-beyond-spinning" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          editorial humanization
        </Link>{" "}
        and the{" "}
        <Link href="/tools/ai-content-humanizer" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          AI content humanizer
        </Link>{" "}
        for tone tightening - not fact invention.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="hub">
        Hubs & utilities
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Browse{" "}
        <Link href="/ai-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          AI tools
        </Link>
        ,{" "}
        <Link href="/business-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          business tools
        </Link>
        , and trim verbosity with the{" "}
        <Link href="/tools/word-counter" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          word counter
        </Link>
        .
      </p>
    </>
  );
}

export const aiPromptsSmbPost: BlogPostDefinition = {
  slug: "ai-prompts-small-business-templates-operations-sales-support",
  title: "AI prompts for small businesses: ops, sales, and support templates",
  description:
    "Ship a five-slot prompt skeleton, copy-ready ops/sales/support patterns, compare prompt maintenance styles, and link to Toollabz AI generators, ROI vs ROAS literacy, and humanization guides.",
  excerpt:
    "Reusable prompts beat giant libraries when they include slots for facts, explicit hallucination guardrails, and a review rhythm your team will actually follow.",
  publishedAt: "2026-05-13",
  dateModified: "2026-05-14T12:00:00.000Z",
  category: "AI",
  tags: ["prompts", "SMB", "operations", "sales"],
  readingTimeMinutes: 17,
  relatedToolSlugs: ["ai-cold-email-generator", "ai-email-subject-line-generator", "ai-content-humanizer", "word-counter", "conversion-rate-calculator"],
  relatedPostsSlugs: [
    "how-ai-content-detectors-work-limits-ethics",
    "ai-text-humanization-editorial-workflow-beyond-spinning",
    "ai-content-humanizer-natural-text-guide",
    "roi-vs-roas-when-to-trust-each-metric",
  ],
  tableOfContents: [
    { id: "template", label: "Five-slot skeleton" },
    { id: "ops", label: "Operations example" },
    { id: "sales", label: "Sales" },
    { id: "support", label: "Support" },
    { id: "compare", label: "Depth vs maintenance" },
    { id: "marketing", label: "Marketing metrics" },
    { id: "humanization", label: "Humanization" },
    { id: "hub", label: "Hubs" },
  ],
  keyTakeaways: [
    "Prompts should forbid invented numbers and require unknowns to surface as TBD with owners.",
    "Short, slot-based templates beat mega-playbooks for teams without prompt librarians.",
    "Tone polish belongs after factual review - humanizers are not fact-checkers.",
  ],
  editorialNote: [
    "Never paste secrets, customer PII, or unreleased financials into third-party models without legal clearance.",
  ],
  whenToUseTools: [
    "Use cold email + subject generators after you paste vetted facts from CRM or public sources.",
    "Use word counter to cap mobile-friendly email length.",
  ],
  commonMistakes: [
    {
      title: "Skipping the verification slot",
      body: "Models confidently fill gaps; forcing an assumptions section makes gaps visible before send.",
    },
    {
      title: "One prompt for every vertical",
      body: "Vertical-specific vocabulary reduces generic cadence that triggers detectors and spam filters alike.",
    },
  ],
  sources: [{ label: "NIST AI Risk Management Framework (policy context)", href: "https://www.nist.gov/itl/ai-risk-management-framework" }],
  faqSchema: [
    {
      question: "How long should a business prompt be?",
      answer:
        "Long enough to encode constraints; short enough that humans actually maintain it - often under 40 lines for recurring workflows.",
    },
    {
      question: "Should I share customer data?",
      answer:
        "Only under policy; prefer synthetic or redacted examples when training teammates.",
    },
  ],
  Article,
};
