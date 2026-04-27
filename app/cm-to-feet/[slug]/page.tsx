import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import PremiumPageShell from "@/components/PremiumPageShell";
import { toolGlassCard, toolGlassPanel } from "@/lib/tool-ui";
import { capStaticParams } from "@/lib/build/static-generation";
import { absoluteUrl, siteUrl } from "@/lib/seo";

function parseSlug(slug: string) {
  const match = slug.match(/^(\d+)-cm-to-feet$/);
  if (!match) return null;
  const cm = Number(match[1]);
  if (cm < 1 || cm > 1000) return null;
  return cm;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const rows = Array.from({ length: 1000 }, (_, i) => ({ slug: `${i + 1}-cm-to-feet` }));
  return capStaticParams(rows);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cm = parseSlug(slug);
  if (!cm) return {};
  const feet = cm / 30.48;
  return {
    title: `${cm} CM to Feet Conversion`,
    description: `${cm} centimeters equals ${feet.toFixed(4)} feet. Use this instant converter with exact precision.`,
    alternates: {
      canonical: `/cm-to-feet/${slug}`,
    },
    openGraph: {
      title: `${cm} CM to Feet Conversion`,
      description: `${cm} centimeters equals ${feet.toFixed(4)} feet.`,
      url: absoluteUrl(`/cm-to-feet/${slug}`),
      type: "article",
    },
  };
}

export default async function CmToFeetProgrammaticPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cm = parseSlug(slug);
  if (!cm) notFound();
  const feet = cm / 30.48;

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: `How many feet is ${cm} cm?`, acceptedAnswer: { "@type": "Answer", text: `${cm} cm equals ${feet.toFixed(4)} feet.` } },
    ],
  };
  const path = `/cm-to-feet/${slug}`;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Tools", item: absoluteUrl("/tools") },
      { "@type": "ListItem", position: 3, name: "CM to Feet", item: absoluteUrl(path) },
    ],
  };
  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${cm} cm to feet`,
    description: `${cm} centimeters equals ${feet.toFixed(4)} feet.`,
    url: absoluteUrl(path),
  };

  return (
    <PremiumPageShell>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12 lg:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="transition hover:text-violet-600">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
          <Link href="/tools" className="transition hover:text-violet-600">
            Tools
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
          <span className="font-medium text-slate-700">{cm} cm → feet</span>
        </nav>

        <article className={`p-6 sm:p-8 ${toolGlassPanel}`}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Converter</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {cm} cm to feet
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-700">
            {cm} centimeters equals{" "}
            <strong className="text-violet-800">{feet.toFixed(4)} feet</strong>.
          </p>
        </article>

        <div className={`mt-6 p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-lg font-bold text-slate-900">Formula</h2>
          <p className="mt-2 text-slate-600">Feet = centimeters ÷ 30.48</p>
        </div>

        <div className={`mt-6 p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-lg font-bold text-slate-900">Related</h2>
          <ul className="mt-3 space-y-2 text-violet-700">
            <li>
              <Link href="/tools/cm-to-feet" className="font-medium underline-offset-2 hover:underline">
                CM to Feet converter
              </Link>
            </li>
            <li>
              <Link href="/tools/kg-to-lbs" className="font-medium underline-offset-2 hover:underline">
                KG to LBS converter
              </Link>
            </li>
          </ul>
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />
      </div>
    </PremiumPageShell>
  );
}
