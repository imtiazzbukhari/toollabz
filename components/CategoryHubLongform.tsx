import type { DirectoryGroupId } from "@/lib/tools/directory-groups";
import { toolGlassPanel } from "@/lib/tool-ui";

type HubCopy = {
  h2: string;
  intro: string[];
  benefits: string[];
  faqs: { question: string; answer: string }[];
};

const HUB_COPY: Record<DirectoryGroupId, HubCopy> = {
  finance: {
    h2: "Finance calculators and planning tools on Toollabz",
    intro: [
      "Whether you are comparing loan offers, stress-testing a monthly budget, or estimating take-home pay after deductions, finance tools should give you numbers you can trust without opening a fragile spreadsheet. Toollabz groups paycheck, tax, savings, debt, and investment-style calculators in one place so you can move from question to answer in a single session instead of hunting across ad-heavy sites.",
      "Each finance tool is built around clear inputs, deterministic math, and outputs you can screenshot or share with a partner, accountant, or loan officer. You can model what-if scenarios such as extra principal payments, different APRs, or a higher 401(k) deferral rate, then compare side-by-side outcomes. The goal is practical orientation: these calculators support planning conversations, not personalized financial, tax, or legal advice.",
      "Bookmark the calculators you use monthly (for example net pay, rent versus buy, or credit card payoff order) and pair them with the related tools section on each page to discover adjacent workflows like emergency fund sizing, refinance break-even timing, or simple ROI on a side project. When you need a fast sanity check before a bigger decision, start here, write down the results, and validate assumptions with a qualified professional when stakes are high.",
    ],
    benefits: [
      "Run common US-focused paycheck, loan, and savings scenarios without sign-up friction.",
      "Explore related tools in the same workflow so internal linking surfaces the next logical step.",
      "Keep sensitive inputs in your browser session with a privacy-first, no-account posture.",
      "Use consistent layouts across tools so muscle memory transfers between calculators.",
    ],
    faqs: [
      {
        question: "Are Toollabz finance calculators personalized advice?",
        answer:
          "No. They provide general-purpose math and planning estimates. Always confirm tax, lending, and investment decisions with a licensed professional when outcomes materially affect you.",
      },
      {
        question: "Which finance tools are most popular for monthly budgeting?",
        answer:
          "Users often combine paycheck calculators, budget planners, and debt payoff tools to reconcile cash flow, minimum payments, and savings goals in one pass.",
      },
      {
        question: "Do these tools store my salary or loan numbers?",
        answer:
          "Toollabz is designed for client-side workflows without persisting your inputs on our servers. Still avoid entering highly sensitive secrets on shared devices.",
      },
      {
        question: "Can I link internally from a blog post to a specific calculator?",
        answer:
          "Yes. Each tool has a stable HTTPS URL under /tools/{slug} with canonical metadata, which helps readers land on the exact experience you reference.",
      },
    ],
  },
  "real-estate": {
    h2: "Real estate tools for buyers, renters, and landlords",
    intro: [
      "Real estate decisions hinge on monthly cash flow, long-term appreciation assumptions, and financing terms that are easy to misunderstand when you only look at list price. Toollabz real estate utilities focus on transparent rent versus buy comparisons, mortgage affordability bands, rental yield, and property ROI so you can pressure-test a listing before you fall in love with the kitchen photos.",
      "Use these tools when you are comparing neighborhoods, evaluating a refinance, or underwriting a small rental. You can translate abstract rates into concrete payment stacks, estimate how long it takes for equity to offset transaction costs, and sanity-check yield against local operating assumptions. Pair results with professional inspections, appraisals, and loan estimates because no online calculator replaces boots-on-the-ground diligence.",
      "Internal links from each tool page surface adjacent workflows such as mortgage payment breakdowns, moving cost estimates, or simple ROI math for renovations. That structure helps search engines understand topical clusters while helping humans discover the next calculator they did not know they needed.",
    ],
    benefits: [
      "Translate rates, prices, and rents into comparable monthly and annual figures quickly.",
      "Explore refinance and affordability angles without rebuilding amortization tables by hand.",
      "Jump to related tools after each run so discovery stays inside a coherent topical hub.",
      "Use HTTPS canonical URLs for every page so shared links stay consistent in messages and docs.",
    ],
    faqs: [
      {
        question: "Do real estate tools replace a mortgage pre-approval?",
        answer:
          "No. They illustrate math from the numbers you supply. Lenders apply overlays, credit checks, and escrow rules that only appear in an official pre-approval.",
      },
      {
        question: "Are rent versus buy models sensitive to how long I stay?",
        answer:
          "Yes. Break-even timelines swing heavily with assumed holding period, maintenance, and opportunity cost of a down payment. Adjust assumptions to match your horizon.",
      },
      {
        question: "Can landlords use rental yield calculators for multiple markets?",
        answer:
          "You can rerun scenarios with different rents, vacancy buffers, and price points to compare markets, then document assumptions for partners or lenders.",
      },
      {
        question: "Why does Toollabz emphasize internal links between property tools?",
        answer:
          "Clustered linking helps visitors complete multi-step research and signals topical depth to crawlers without changing the visual layout of the directory.",
      },
    ],
  },
  "business-saas": {
    h2: "Business and SaaS metrics you can run in the browser",
    intro: [
      "Operators, founders, and marketers all speak different dialects, but they converge on a small set of ratios: margins, CAC, LTV, payback, break-even volume, and simple ROI on experiments. Toollabz business utilities translate those concepts into calculators you can run in minutes during a standup, a board prep session, or a late-night pricing debate.",
      "Instead of rebuilding the same spreadsheet every quarter, you can plug in trailing spend, new customer counts, churn, and ARPU to see whether the narrative matches the arithmetic. The tools are opinionated about clarity: labeled outputs, conservative defaults where ambiguity exists, and copy that explains what each field is trying to capture so new hires are not blocked.",
      "Because each page includes FAQs, structured headings, and related tools, you can move from a margin check to a break-even sheet to a lightweight SaaS valuation band without losing context. Canonical HTTPS URLs keep your bookmarks and shared links aligned with how search engines index the hub.",
    ],
    benefits: [
      "Stress-test pricing, spend, and retention assumptions before you commit them to a deck.",
      "Pair margin and break-even tools with marketing ROI utilities for full-funnel thinking.",
      "Use consistent SERP metadata so each calculator is discoverable on its own intent.",
      "Stay on non-www HTTPS URLs to avoid duplicate indexing across host variants.",
    ],
    faqs: [
      {
        question: "Are SaaS valuation outputs investment advice?",
        answer:
          "No. They illustrate simple multiple bands from the inputs you provide. Institutional diligence goes far beyond these sketches.",
      },
      {
        question: "Which business metrics should I track weekly versus monthly?",
        answer:
          "Weekly: spend, pipeline creation, activation. Monthly: churn, gross margin, runway. Toollabz helps you compute the ratios once definitions are stable.",
      },
      {
        question: "Can I compare CAC across two channels?",
        answer:
          "Run the CAC calculator twice with channel-specific spend and new customer counts, then document the assumptions beside each result.",
      },
      {
        question: "Why include FAQs on business tool pages?",
        answer:
          "They clarify scope, reduce misuse, and give search engines additional natural-language context around intent and limitations.",
      },
    ],
  },
  marketing: {
    h2: "Marketing calculators for campaigns, creators, and funnels",
    intro: [
      "Marketing teams juggle spend, reach, conversion, and creative throughput at the same time. Toollabz marketing calculators focus on the arithmetic behind those conversations: CPC and CPM relationships, conversion rate impacts, ROAS bands, and lightweight creator metrics so you can align finance, growth, and content without debating formulas.",
      "Use these tools when you are sizing a test budget, sanity-checking an agency report, or translating platform metrics into something leadership understands. Each calculator is written to stand alone in search while still linking to adjacent utilities such as UTM builders, ROI helpers, or social copy generators so you can finish a workflow without bouncing to unrelated sites.",
      "The long-form guides on this hub page explain how to chain tools together responsibly: start with a funnel assumption, validate it against historical conversion, then model spend changes. That narrative depth complements the grid of tool cards without altering the visual system you already use elsewhere on Toollabz.",
    ],
    benefits: [
      "Turn platform metrics into comparable ROI stories for stakeholders.",
      "Discover copy, script, and metadata helpers through internal links from related tools.",
      "Keep titles and descriptions unique per tool to improve snippet relevance in search.",
      "Use HTTPS-only canonicals so campaign links do not split equity across protocols.",
    ],
    faqs: [
      {
        question: "Do marketing calculators include platform fees?",
        answer:
          "Unless a specific field asks for fees, treat outputs as directional. Add buffers for creative production, agency retainers, and FX when relevant.",
      },
      {
        question: "How should creators use these tools differently than performance marketers?",
        answer:
          "Creators often stress-test RPM, posting cadence, and conversion to email lists, while performance marketers focus on CAC and ROAS. Both paths are supported via related links.",
      },
      {
        question: "Can I trust rounding in small-budget scenarios?",
        answer:
          "Very small spends amplify rounding. Export the numbers you care about and recompute in your finance model when budgets are tiny but precision matters.",
      },
      {
        question: "Why does Toollabz add topical paragraphs on category hubs?",
        answer:
          "Thin hub pages under-index. Unique explanatory copy improves crawl budget usage and clarifies user value without changing layout chrome.",
      },
    ],
  },
  ai: {
    h2: "AI writing and ideation tools with clear guardrails",
    intro: [
      "AI assistants are best when they accelerate first drafts, not when they replace judgment about facts, compliance, or tone. Toollabz AI utilities focus on structured prompts for email subjects, cold outreach, LinkedIn posts, resume summaries, product blurbs, and similar tasks where a tight template keeps outputs useful instead of generic.",
      "Each tool explains what context to supply, what to verify manually, and how to iterate safely. You can chain outputs into your CRM, editor, or hiring workflow, then refine with human review. Internal links point to adjacent generators so a campaign build can move from subject lines to body copy to social snippets without losing momentum.",
      "Search engines reward pages that state limitations clearly. That is why these hubs pair marketing copy with explicit FAQs about originality, factual accuracy, and privacy. You still get the same card grid and glass panels - only the semantic depth underneath grows so crawlers and users both understand the scope of the collection.",
    ],
    benefits: [
      "Generate structured drafts faster while keeping a human-in-the-loop review habit.",
      "Move between related AI tools using on-page internal links instead of random search tabs.",
      "Understand limitations up front through FAQs that reduce misuse and support trust.",
      "Share stable HTTPS URLs that match canonical tags for every individual tool page.",
    ],
    faqs: [
      {
        question: "Will AI tools fabricate facts about my company?",
        answer:
          "They can if you do not constrain inputs. Always supply accurate product facts and edit outputs before publishing, especially for regulated industries.",
      },
      {
        question: "Is my prompt content used to train models?",
        answer:
          "Toollabz does not operate proprietary foundation models here; follow your provider’s terms for any third-party APIs you connect on your side.",
      },
      {
        question: "How do I keep tone consistent across channels?",
        answer:
          "Reuse the same tone and audience fields across tools, then paste outputs into a single style guide document for a final consistency pass.",
      },
      {
        question: "Why list AI tools under a dedicated hub instead of only tags?",
        answer:
          "A dedicated hub concentrates topical relevance, improves internal linking, and helps visitors who arrive with AI-specific intent find the right surface faster.",
      },
    ],
  },
  developer: {
    h2: "Developer utilities for encoding, validation, and API ergonomics",
    intro: [
      "Developer time is lost to small friction: a malformed JSON payload, a Base64 string that needed URL-safe encoding, or a regex that almost works. Toollabz developer utilities focus on those sharp edges with fast feedback, readable error messages, and predictable behavior so you can unblock integration work without installing another desktop utility.",
      "Use these tools when you are debugging a client integration, preparing sample data for QA, or teaching a teammate how encoding layers stack. Each page includes how-to steps and FAQs that document edge cases such as unicode in JSON, multiline patterns in regex, or charset boundaries in encoders. Related tools help you jump from validation to formatting to documentation helpers when your task spans multiple steps.",
      "From an SEO perspective, developer tools compete on specificity. That is why this hub stresses real workflows and honest limitations instead of keyword stuffing. Canonical HTTPS URLs and structured headings make it easier for search systems to match long-tail queries like JSON validation or URL encoding to concrete pages.",
    ],
    benefits: [
      "Validate and transform payloads quickly during incidents or code reviews.",
      "Use internal links to discover adjacent utilities you might not search for explicitly.",
      "Rely on deterministic tools where possible so outputs match CLI expectations.",
      "Bookmark HTTPS tool URLs that align with sitemap entries and canonical metadata.",
    ],
    faqs: [
      {
        question: "Should I paste production secrets into browser tools?",
        answer:
          "Never paste live credentials, tokens, or customer secrets. Use synthetic data in shared browsers and follow your security policy for sensitive payloads.",
      },
      {
        question: "Do regex testers cover every engine flavor?",
        answer:
          "Engines differ. Treat results as indicative, then run your target engine’s test suite for authoritative behavior.",
      },
      {
        question: "Are JSON tools strict about duplicate keys?",
        answer:
          "ECMAScript JSON parsing follows JSON semantics; duplicate keys should be avoided in source payloads even if some parsers appear tolerant.",
      },
      {
        question: "Why include narrative copy on a developer hub?",
        answer:
          "Searchers often include intent phrases like safe, online, or compare. Unique copy aligns the page with those phrases while the grid still presents tools visually.",
      },
    ],
  },
  utility: {
    h2: "Utility tools for everyday conversions, text, and quick answers",
    intro: [
      "Utility tools are the quiet workhorses of the web: unit converters, text transformers, time zone helpers, and small generators you open dozens of times a month. Toollabz keeps them fast, readable, and consistent so you are not relearning a new interface every time you convert centimeters to feet or compare two dates across zones.",
      "Many visitors arrive from long-tail searches with immediate intent. That is why each tool page pairs a concise description with deeper paragraphs, how-to steps, and FAQs that answer common follow-up questions. Internal links surface related utilities so a visitor who landed on one converter can discover a companion tool that completes their errand.",
      "This hub also anchors mixed categories such as calculators that are not strictly finance and non-AI generators that still benefit from narrative context. The layout stays identical to other hubs - glass panel header, breadcrumb, responsive grid - while the text block underneath adds crawlable depth that reduces thin-content risk for the directory as a whole.",
    ],
    benefits: [
      "Solve quick conversion and formatting tasks without installing native apps.",
      "Move between related utilities using curated internal links on each tool page.",
      "Enjoy mobile-friendly layouts with tap-friendly controls and readable type scales.",
      "Share HTTPS links that match canonical metadata and sitemap entries.",
    ],
    faqs: [
      {
        question: "How accurate are unit conversions?",
        answer:
          "Conversions use standard constants and rounding appropriate for general use. For mission-critical science or engineering, cross-check with calibrated references.",
      },
      {
        question: "Can I use utilities offline?",
        answer:
          "You need a live session to load the app assets, but many calculations run client-side once the page is loaded.",
      },
      {
        question: "Why are some utilities grouped under marketing or AI elsewhere?",
        answer:
          "Directory grouping follows how people search. This utility hub still lists cross-links so you can navigate by task, not only by taxonomy.",
      },
      {
        question: "Do utilities respect privacy for pasted text?",
        answer:
          "Design favors client-side processing where feasible, but avoid pasting confidential data on shared machines regardless.",
      },
    ],
  },
  pdf: {
    h2: "PDF tools for merge, split, compress, and document workflows",
    intro: [
      "PDFs persist because they freeze layout across devices, but they are painful when you need to merge exhibits, split a scanned packet, or compress a file under an upload limit. Toollabz PDF utilities focus on the most common browser-friendly workflows with clear expectations about what happens on-device versus what requires careful handling for large files.",
      "Use these tools when you are preparing closing packets, client deliverables, or archival copies where file size and page order matter. FAQs call out limitations such as scanned image quality, password-protected inputs, and accessibility considerations so you do not discover constraints only after a deadline. Related links point to adjacent business or real estate calculators when users jump between document prep and numeric planning.",
      "Search visibility for PDF tasks is competitive, so each tool page combines structured headings, honest scope statements, and internal links to neighboring utilities. That stack improves crawlability without altering the visual design language established across Toollabz.",
    ],
    benefits: [
      "Handle common merge, split, and compression tasks without desktop licenses.",
      "Understand scope limits up front through FAQs instead of trial-and-error uploads.",
      "Jump to related calculators when PDF prep is part of a larger transaction workflow.",
      "Rely on HTTPS URLs for sharing finalized document links externally.",
    ],
    faqs: [
      {
        question: "Do PDF tools OCR scanned documents?",
        answer:
          "Unless a specific tool advertises OCR, assume text in scans is not editable. Use dedicated OCR software for heavy remediation.",
      },
      {
        question: "Will compression reduce visual quality?",
        answer:
          "Lossy compression can affect images embedded in PDFs. Keep originals backed up before aggressive compression.",
      },
      {
        question: "Can I process legally sensitive PDFs here?",
        answer:
          "Follow your organization’s data handling policy. Prefer offline tooling when documents include privileged or regulated information.",
      },
      {
        question: "Why emphasize internal links from PDF tools to finance utilities?",
        answer:
          "Many real-world flows pair document prep with numbers - mortgage packets, invoices, and disclosures - so linking reflects real user journeys.",
      },
    ],
  },
};

export default function CategoryHubLongform({ group }: { group: DirectoryGroupId }) {
  const copy = HUB_COPY[group];
  return (
    <section
      className={`mb-10 space-y-5 p-6 sm:p-8 ${toolGlassPanel}`}
      aria-labelledby={`category-hub-${group}`}
    >
      <h2 id={`category-hub-${group}`} className="text-xl font-bold text-slate-900 sm:text-2xl">
        {copy.h2}
      </h2>
      <div className="space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
        {copy.intro.map((p, i) => (
          <p key={`intro-${group}-${i}`}>{p}</p>
        ))}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-900">What you can do with this collection</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600 sm:text-base">
          {copy.benefits.map((b, i) => (
            <li key={`benefit-${group}-${i}`}>{b}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-900">FAQs</h3>
        <dl className="mt-3 space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
          {copy.faqs.map((faq) => (
            <div key={faq.question}>
              <dt className="font-semibold text-slate-900">{faq.question}</dt>
              <dd className="mt-1">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
