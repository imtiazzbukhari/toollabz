import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import { GLOSSARY_TERMS } from "@/lib/glossary/terms";
import { toolGlassCard, toolGlassPanel } from "@/lib/tool-ui";
import PageLastUpdated from "@/components/PageLastUpdated";

export const metadata: Metadata = {
  title: { absolute: "Glossary — Finance & Calculator Terms | Toollabz" },
  description:
    "Plain-language definitions for APR, VAT, ROI, BMI, amortization, take-home pay, and more—linked to Toollabz calculators and guides.",
  alternates: { canonical: "/glossary" },
};

export default function GlossaryIndexPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Glossary", path: "/glossary" },
  ]);
  const itemList = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Toollabz glossary",
    url: absoluteUrl("/glossary"),
    hasDefinedTerm: GLOSSARY_TERMS.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.definition,
      url: absoluteUrl(`/glossary/${t.slug}`),
    })),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <PageLastUpdated className="mb-4" />
      <div className={`space-y-6 p-6 sm:p-8 ${toolGlassPanel}`}>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Glossary</h1>
        <p className="text-slate-700">
          Short definitions for terms that appear across Toollabz calculators. Each entry links to related tools and
          guides so you can move from vocabulary to a working example.
        </p>
        <ul className="space-y-4">
          {GLOSSARY_TERMS.map((t) => (
            <li key={t.slug} className={`p-5 ${toolGlassCard}`}>
              <Link
                href={`/glossary/${t.slug}`}
                className="text-lg font-semibold text-violet-800 underline-offset-2 hover:underline"
              >
                {t.term}
              </Link>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{t.definition}</p>
            </li>
          ))}
        </ul>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
    </div>
  );
}
