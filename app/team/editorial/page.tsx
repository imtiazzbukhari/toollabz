import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, breadcrumbJsonLd, siteUrl } from "@/lib/seo";
import { toolGlassCard, toolGlassPanel } from "@/lib/tool-ui";
import PageLastUpdated from "@/components/PageLastUpdated";

export const metadata: Metadata = {
  title: { absolute: "Toollabz Editorial — Reviewers | Toollabz" },
  description:
    "How Toollabz Editorial reviews finance, tax, and health-adjacent calculator pages for formula clarity, sources, and disclaimers.",
  alternates: { canonical: "/team/editorial" },
};

export default function EditorialTeamPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Toollabz Editorial", path: "/team/editorial" },
  ]);
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Toollabz Editorial",
    url: absoluteUrl("/team/editorial"),
    parentOrganization: { "@type": "Organization", name: "Toollabz", url: siteUrl },
    description:
      "Editorial workflow that reviews calculator explanations, FAQs, citations, and YMYL disclaimers on Toollabz.",
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <PageLastUpdated className="mb-4" variant="editorial" />
      <article className={`space-y-6 p-6 sm:p-8 ${toolGlassPanel}`}>
        <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/about" className="hover:text-violet-700">
            About
          </Link>
          <span className="mx-1.5 opacity-40">/</span>
          <span className="font-medium text-slate-700">Toollabz Editorial</span>
        </nav>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Toollabz Editorial</h1>
        <p className="text-lg font-medium text-violet-800">Finance &amp; product editors</p>
        <p className="leading-7 text-slate-700">
          Toollabz Editorial is the named review workflow for calculator pages that affect money, tax, loans, or
          health-adjacent screening metrics. Editors check that formulas match the implementation, that primary sources
          are cited, and that limitations are visible before a user treats an estimate as advice.
        </p>

        <section className={`space-y-3 p-5 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900">Review checklist</h2>
          <ol className="list-decimal space-y-2 pl-5 text-slate-700">
            <li>Does the on-page formula match the code path users run?</li>
            <li>Are FAQs specific to this tool (not generic mobile/accuracy spam)?</li>
            <li>Are HMRC, IRS, NHS, CFPB, or other primary sources linked where rates or categories matter?</li>
            <li>Is the disclaimer proportionate to YMYL risk?</li>
          </ol>
        </section>

        <section className={`space-y-3 p-5 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900">Cadence</h2>
          <p className="text-slate-700">
            UK tax/VAT pages are reviewed after major April rate updates. US withholding assumptions are checked after
            official annual releases. Other calculators are refreshed when logic or public guidance changes. See{" "}
            <Link href="/methodology" className="font-medium text-violet-800 underline-offset-2 hover:underline">
              methodology
            </Link>{" "}
            for verification steps and{" "}
            <Link href="/editorial-policy" className="font-medium text-violet-800 underline-offset-2 hover:underline">
              editorial policy
            </Link>{" "}
            for corrections.
          </p>
        </section>

        <p className="text-sm text-slate-600">
          <Link href="/team/imtiaz-ahmad" className="font-medium text-violet-800 underline-offset-2 hover:underline">
            Imtiaz Ahmad
          </Link>
          {" · "}
          <Link href="/about" className="font-medium text-violet-800 underline-offset-2 hover:underline">
            About Toollabz
          </Link>
        </p>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
    </div>
  );
}
