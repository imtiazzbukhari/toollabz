import Link from "next/link";
import { toolGlassPanel } from "@/lib/tool-ui";
import { POPULAR_TOOL_SLUGS } from "@/lib/tools/popular-tools";
import { tools } from "@/lib/tools/data";
import { blogPosts } from "@/lib/blog/registry";

const popular = POPULAR_TOOL_SLUGS.map((slug) => tools.find((t) => t.slug === slug)).filter(Boolean) as typeof tools;
const guideCount = blogPosts.length;

/**
 * Long-form homepage copy for crawlers (topical depth + internal links) using the same glass panel as other hubs.
 */
export default function HomeSeoDeepSection() {
  return (
    <section className="section-fade bg-transparent" aria-labelledby="home-seo-guide-heading">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-8">
        <div className={`p-6 sm:p-8 ${toolGlassPanel}`}>
          <h2 id="home-seo-guide-heading" className="text-xl font-bold text-slate-900 sm:text-2xl">
            Developer utilities, UK finance and tax, SaaS metrics, and practical calculators in one place
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            <p>
              Toollabz is structured for{" "}
              <strong className="font-semibold text-slate-800">repeatable workflows</strong>: deterministic calculators and
              formatters you can trust in a meeting, a ticket, or a spreadsheet. The strongest verticals are{" "}
              <Link href="/developer-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                developer utilities
              </Link>{" "}
              (JSON, JWT, SQL), the{" "}
              <Link href="/uk-finance-tax" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                UK finance and tax hub
              </Link>
              ,{" "}
              <Link href="/business-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                business and SaaS metrics
              </Link>
              , GST for Australia alongside global finance tools, plus converters, PDF utilities, and marketing calculators.
              Pages use HTTPS canonical URLs, structured headings, FAQs, and internal links so you can move between related
              tools without losing context.
            </p>
            <p>
              When you need{" "}
              <strong className="font-semibold text-slate-800">UK-specific answers</strong>, start from the finance hub
              for salary, self-employment, dividends, and working-days sketches, then follow related links into VAT, loans,
              or business margin tools. For{" "}
              <strong className="font-semibold text-slate-800">operators and founders</strong>, pair{" "}
              <Link href="/marketing-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                marketing calculators
              </Link>{" "}
              with fee and break-even utilities when you are sanity-checking a launch or a payout. For{" "}
              <strong className="font-semibold text-slate-800">engineering</strong>, keep JSON validation, JWT inspection,
              and SQL formatting next to your API debugging flow.
            </p>
            <p>
              <strong className="font-semibold text-slate-800">PDF tools</strong> cover merge and compression for the last
              mile before upload; pair them with{" "}
              <Link href="/finance-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                finance calculators
              </Link>{" "}
              or{" "}
              <Link href="/real-estate-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                real estate calculators
              </Link>{" "}
              when you are packaging disclosures or client-ready packets.{" "}
              <strong className="font-semibold text-slate-800">AI tools</strong> are framed as drafting assistants: you
              supply facts and tone, then edit before publishing-especially important in regulated topics. For depth beyond
              a single page, use the{" "}
              <Link href="/blog" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                article library
              </Link>{" "}
              ({guideCount}+ guides on tax concepts, JSON and JWT usage, SaaS metrics, and workflow explainers).
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
              when you want related utilities to surface together: less tab-hopping across single-purpose sites, clearer
              scope in FAQs, and hubs that stitch crawl-friendly paths between clusters.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
