import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import { GLOSSARY_TERMS, getGlossaryTerm } from "@/lib/glossary/terms";
import { toolMap } from "@/lib/tools/data";
import { toolGlassCard, toolGlassPanel } from "@/lib/tool-ui";
import { capStaticParams } from "@/lib/build/static-generation";
import PageLastUpdated from "@/components/PageLastUpdated";

export async function generateStaticParams() {
  return capStaticParams(GLOSSARY_TERMS.map((t) => ({ slug: t.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const term = getGlossaryTerm(slug);
  if (!term) return {};
  return {
    title: { absolute: `${term.term} — Glossary | Toollabz` },
    description: term.definition.slice(0, 155),
    alternates: { canonical: `/glossary/${slug}` },
  };
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = getGlossaryTerm(slug);
  if (!term) notFound();

  const crumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Glossary", path: "/glossary" },
    { name: term.term, path: `/glossary/${slug}` },
  ]);
  const definedTerm = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term,
    description: term.definition,
    url: absoluteUrl(`/glossary/${slug}`),
    inDefinedTermSet: absoluteUrl("/glossary"),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <PageLastUpdated className="mb-4" />
      <article className={`space-y-6 p-6 sm:p-8 ${toolGlassPanel}`}>
        <p className="text-xs font-bold uppercase tracking-wide text-violet-600">
          <Link href="/glossary" className="hover:underline">
            Glossary
          </Link>
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{term.term}</h1>
        <p className="text-lg leading-relaxed text-slate-700">{term.definition}</p>

        <section className={`p-5 ${toolGlassCard}`}>
          <h2 className="text-lg font-bold text-slate-900">Related calculators</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {term.relatedTools.map((toolSlug) => {
              const t = toolMap.get(toolSlug);
              if (!t) return null;
              return (
                <li key={toolSlug}>
                  <Link
                    href={`/tools/${toolSlug}`}
                    className="font-medium text-violet-800 underline-offset-2 hover:underline"
                  >
                    {t.name}
                  </Link>
                  <span className="text-slate-500"> — {t.shortDescription}</span>
                </li>
              );
            })}
          </ul>
        </section>

        {term.relatedGuides?.length ? (
          <section className={`p-5 ${toolGlassCard}`}>
            <h2 className="text-lg font-bold text-slate-900">Related guides</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {term.relatedGuides.map((g) => (
                <li key={g}>
                  <Link href={`/blog/${g}`} className="font-medium text-violet-800 underline-offset-2 hover:underline">
                    /blog/{g}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className="text-sm text-slate-600">
          <Link href="/methodology" className="font-medium text-violet-800 underline-offset-2 hover:underline">
            Methodology
          </Link>
          {" · "}
          <Link href="/tools" className="font-medium text-violet-800 underline-offset-2 hover:underline">
            All tools
          </Link>
        </p>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTerm) }} />
    </div>
  );
}
