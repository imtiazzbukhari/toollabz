import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, breadcrumbJsonLd, siteUrl } from "@/lib/seo";
import { toolGlassCard, toolGlassPanel } from "@/lib/tool-ui";
import PageLastUpdated from "@/components/PageLastUpdated";

export const metadata: Metadata = {
  title: { absolute: "Editorial Policy — Toollabz" },
  description:
    "Toollabz editorial standards: helpful content, EEAT, review process, YMYL disclaimers, and corrections policy for calculators and guides.",
  alternates: { canonical: "/editorial-policy" },
};

export default function EditorialPolicyPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Editorial policy", path: "/editorial-policy" },
  ]);
  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Editorial policy",
    url: absoluteUrl("/editorial-policy"),
    isPartOf: { "@type": "WebSite", name: "Toollabz", url: siteUrl },
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <PageLastUpdated className="mb-4" variant="editorial" />
      <article className={`space-y-6 p-6 sm:p-8 ${toolGlassPanel}`}>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Editorial policy</h1>
        <p className="text-lg text-slate-700">
          We publish free calculators and guides meant to be helpful, accurate enough for planning, and honest about
          limits. We do not invent credentials, rates, or medical advice.
        </p>

        <section className={`space-y-3 p-5 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900">Review process</h2>
          <ul className="list-disc space-y-2 pl-5 text-slate-700">
            <li>Engineering implements and unit-tests calculator logic.</li>
            <li>Editorial reviews formula wording, FAQs, and disclaimers on finance and health pages.</li>
            <li>Pages show a last-reviewed / last-updated stamp when content ships.</li>
          </ul>
        </section>

        <section className={`space-y-3 p-5 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900">YMYL topics</h2>
          <p className="text-slate-700">
            Money, tax, loans, and health-related tools include visible disclaimers. Outputs are educational estimates.
            Confirm decisions with HMRC, IRS, a licensed advisor, or a clinician as appropriate. See{" "}
            <Link href="/disclaimer" className="font-medium text-violet-800 underline-offset-2 hover:underline">
              Disclaimer
            </Link>
            .
          </p>
        </section>

        <section className={`space-y-3 p-5 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900">Corrections</h2>
          <p className="text-slate-700">
            Report issues via{" "}
            <Link href="/contact" className="font-medium text-violet-800 underline-offset-2 hover:underline">
              Contact
            </Link>
            . We prioritize factual errors in formulas and outdated statutory rates.
          </p>
        </section>

        <section className={`space-y-3 p-5 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900">Team</h2>
          <p className="text-slate-700">
            Meet{" "}
            <Link href="/team/imtiaz-ahmad" className="font-medium text-violet-800 underline-offset-2 hover:underline">
              Imtiaz Ahmad
            </Link>{" "}
            and{" "}
            <Link href="/team/editorial" className="font-medium text-violet-800 underline-offset-2 hover:underline">
              Toollabz Editorial
            </Link>
            , or start from the{" "}
            <Link href="/about" className="font-medium text-violet-800 underline-offset-2 hover:underline">
              About
            </Link>{" "}
            page. Methodology details live at{" "}
            <Link href="/methodology" className="font-medium text-violet-800 underline-offset-2 hover:underline">
              /methodology
            </Link>
            .
          </p>
        </section>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />
    </div>
  );
}
