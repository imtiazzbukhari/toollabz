import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, breadcrumbJsonLd, siteUrl } from "@/lib/seo";
import { toolGlassCard, toolGlassPanel } from "@/lib/tool-ui";
import PageLastUpdated from "@/components/PageLastUpdated";

export const metadata: Metadata = {
  title: { absolute: "Methodology — How Toollabz Calculations Work" },
  description:
    "How Toollabz documents formulas, verifies calculator logic, cites sources, and updates pages when rates or guidance change.",
  alternates: { canonical: "/methodology" },
  openGraph: {
    title: "Toollabz methodology",
    description: "Formula documentation, verification, sources, and update process for free online calculators.",
    url: absoluteUrl("/methodology"),
    type: "website",
    siteName: "Toollabz",
  },
};

export default function MethodologyPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Methodology", path: "/methodology" },
  ]);
  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Toollabz methodology",
    url: absoluteUrl("/methodology"),
    isPartOf: { "@type": "WebSite", name: "Toollabz", url: siteUrl },
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <PageLastUpdated className="mb-4" />
      <article className={`space-y-6 p-6 sm:p-8 ${toolGlassPanel}`}>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Methodology</h1>
        <p className="text-lg text-slate-700">
          Toollabz calculators are planning tools. Every important page should show the formula, a worked example, and
          clear limitations—not a black-box result.
        </p>

        <section className={`space-y-3 p-5 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900">How calculations are verified</h2>
          <ol className="list-decimal space-y-2 pl-5 text-slate-700">
            <li>Implement the standard formula for the metric (amortization, BMI, VAT reverse charge, etc.).</li>
            <li>Cross-check with a second method (spreadsheet or hand calculation) using the same inputs.</li>
            <li>Document edge cases (zero rates, missing fees, unit mismatches) in Common mistakes.</li>
            <li>For YMYL topics, cite primary authorities (HMRC, IRS, NHS, CFPB) and label estimates as non-advice.</li>
          </ol>
        </section>

        <section className={`space-y-3 p-5 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900">Sources policy</h2>
          <p className="text-slate-700">
            Prefer primary sources: government agencies, standards bodies (NIST, ISO), and official documentation (MDN,
            RFCs). Secondary explainers are fine for learning links but should not replace citations on finance or
            health pages. See also the{" "}
            <Link href="/editorial-policy" className="font-medium text-violet-800 underline-offset-2 hover:underline">
              editorial policy
            </Link>
            .
          </p>
        </section>

        <section className={`space-y-3 p-5 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900">Updates &amp; corrections</h2>
          <p className="text-slate-700">
            When tax bands, rates, or unit definitions change, we update the calculator logic and the on-page “Last
            updated” stamp. If you find an error, contact us via{" "}
            <Link href="/contact" className="font-medium text-violet-800 underline-offset-2 hover:underline">
              Contact
            </Link>
            —corrections are prioritized for finance and health tools.
          </p>
        </section>

        <section className={`space-y-3 p-5 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900">Version history</h2>
          <ul className="space-y-3 text-sm text-slate-700">
            <li>
              <span className="font-semibold text-slate-900">2026-07 — Content &amp; EEAT wave:</span> per-tool editorial
              insights, answer-first blocks, cited sources, glossary terms, author/reviewer pages, and unique FAQs (no
              doorway filler).
            </li>
            <li>
              <span className="font-semibold text-slate-900">2026-07 — Technical SEO hygiene:</span> robots crawlability for
              Next assets, apex canonical host, honest structured data, programmatic value tiers, sitemap coverage for
              EEAT routes.
            </li>
            <li>
              <span className="font-semibold text-slate-900">Ongoing:</span> rate and guidance updates when primary
              authorities publish changes; corrections logged via Contact.
            </li>
          </ul>
        </section>

        <p className="text-sm text-slate-600">
          Related:{" "}
          <Link href="/about" className="font-medium text-violet-800 underline-offset-2 hover:underline">
            About
          </Link>
          {" · "}
          <Link href="/team/imtiaz-ahmad" className="font-medium text-violet-800 underline-offset-2 hover:underline">
            Imtiaz Ahmad
          </Link>
          {" · "}
          <Link href="/team/editorial" className="font-medium text-violet-800 underline-offset-2 hover:underline">
            Editorial
          </Link>
          {" · "}
          <Link href="/research" className="font-medium text-violet-800 underline-offset-2 hover:underline">
            Research
          </Link>
          {" · "}
          <Link href="/glossary" className="font-medium text-violet-800 underline-offset-2 hover:underline">
            Glossary
          </Link>
        </p>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />
    </div>
  );
}
