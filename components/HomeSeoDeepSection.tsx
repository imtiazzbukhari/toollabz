import Link from "next/link";
import { toolGlassPanel } from "@/lib/tool-ui";
import { POPULAR_TOOL_SLUGS } from "@/lib/tools/popular-tools";
import { tools } from "@/lib/tools/data";

const popular = POPULAR_TOOL_SLUGS.map((slug) => tools.find((t) => t.slug === slug)).filter(Boolean) as typeof tools;

/**
 * Long-form homepage copy for crawlers (keywords + internal links) using the same glass panel as other hubs.
 */
export default function HomeSeoDeepSection() {
  return (
    <section className="section-fade bg-transparent" aria-labelledby="home-seo-guide-heading">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-8">
        <div className={`p-6 sm:p-8 ${toolGlassPanel}`}>
          <h2 id="home-seo-guide-heading" className="text-xl font-bold text-slate-900 sm:text-2xl">
            Free online tools for calculators, converters, PDF workflows, and AI drafting
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            <p>
              Toollabz is built for people who want{" "}
              <strong className="font-semibold text-slate-800">free online tools</strong> that behave predictably: you
              open a page, enter values, and leave with an answer you can paste into email, a spreadsheet, or a ticket.
              The collection spans{" "}
              <Link href="/finance-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                finance calculators
              </Link>
              ,{" "}
              <Link href="/utility-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                unit converters
              </Link>
              ,{" "}
              <Link href="/pdf-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                PDF tools
              </Link>{" "}
              for merge and compression tasks, and{" "}
              <Link href="/ai-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                AI tools
              </Link>{" "}
              that help you draft subject lines, posts, and summaries you still edit by hand. Every experience is wired
              with HTTPS canonical URLs, structured headings, and internal links so you can move between related utilities
              without losing context.
            </p>
            <p>
              When someone searches for{" "}
              <strong className="font-semibold text-slate-800">calculators and converters</strong>, they usually need a
              fast answer - not a signup wall. That is why paycheck, loan, ROI, VAT, and measurement utilities live next
              to encoding helpers and JSON validators: real workflows rarely stop at a single page. Use the directory
              search on the homepage hero, then follow category hubs (
              <Link href="/developer-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                developer
              </Link>
              ,{" "}
              <Link href="/marketing-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                marketing
              </Link>
              ,{" "}
              <Link href="/business-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                business
              </Link>
              ) to discover adjacent tools you might not think to search for explicitly.
            </p>
            <p>
              <strong className="font-semibold text-slate-800">PDF tools</strong> focus on the last mile before upload:
              merge exhibits, shrink oversized attachments, and keep filenames consistent. Pair them with{" "}
              <Link href="/real-estate-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                real estate calculators
              </Link>{" "}
              when you are packaging disclosures, or with invoice utilities when you are sending client-ready packets.
            </p>
            <p>
              <strong className="font-semibold text-slate-800">AI tools</strong> on Toollabz are framed as drafting
              assistants: you supply facts, tone, and audience, then edit outputs before publishing - especially important
              for regulated industries. Link from AI generators to marketing ROI calculators when you are building a
              campaign narrative backed by numbers, or jump to{" "}
              <Link href="/blog" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                guides
              </Link>{" "}
              when you want longer explanations.
            </p>
            <p>
              Start with a high-intent shortcut below, then explore the full{" "}
              <Link href="/tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                tools directory
              </Link>
              :
            </p>
            <ul className="list-disc space-y-2 pl-5">
              {popular.map((t) => (
                <li key={t.slug}>
                  <Link href={`/tools/${t.slug}`} className="font-medium text-violet-800 underline-offset-2 hover:underline">
                    {t.name}
                  </Link>
                  <span className="text-slate-600"> - {t.shortDescription}</span>
                </li>
              ))}
            </ul>
            <p>
              Bookmark{" "}
              <Link href="/" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                Toollabz.com
              </Link>{" "}
              as your hub for repeat tasks: the site is designed so related tools surface together, FAQs clarify scope,
              and you spend less time tab-hopping across single-purpose domains.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
