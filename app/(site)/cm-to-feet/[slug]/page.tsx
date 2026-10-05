import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import PremiumPageShell from "@/components/PremiumPageShell";
import { toolGlassCard, toolGlassPanel } from "@/lib/tool-ui";
import { absoluteUrl, siteUrl } from "@/lib/seo";
import { CM_TO_FEET_INDEXABLE_VALUES } from "@/lib/seo/indexing-policy";

function parseSlug(slug: string) {
  const match = slug.match(/^(\d+)-cm-to-feet$/);
  if (!match) return null;
  const cm = Number(match[1]);
  if (cm < 1 || cm > 1000) return null;
  return cm;
}

function feetAndInches(cm: number) {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches - feet * 12;
  return { feet, inches, totalInches, decimalFeet: cm / 30.48 };
}

/** Only the curated height/round values exist; every other value is 301'd in next.config.ts. */
export const dynamicParams = false;

export async function generateStaticParams() {
  return CM_TO_FEET_INDEXABLE_VALUES.map((cm) => ({ slug: `${cm}-cm-to-feet` }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cm = parseSlug(slug);
  if (!cm) return {};
  const { decimalFeet, feet, inches } = feetAndInches(cm);
  return {
    title: `${cm} CM to Feet (${feet}' ${inches.toFixed(1)}")`,
    description: `${cm} cm = ${decimalFeet.toFixed(4)} ft (${feet} ft ${inches.toFixed(1)} in). Exact formula, worked example, and related height converters.`,
    alternates: {
      canonical: `/cm-to-feet/${slug}`,
    },
    openGraph: {
      title: `${cm} CM to Feet Conversion`,
      description: `${cm} centimeters equals ${decimalFeet.toFixed(4)} feet (${feet}' ${inches.toFixed(1)}").`,
      url: absoluteUrl(`/cm-to-feet/${slug}`),
      type: "article",
    },
  };
}

export default async function CmToFeetProgrammaticPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cm = parseSlug(slug);
  if (!cm) notFound();
  const { decimalFeet, feet, inches, totalInches } = feetAndInches(cm);
  const nearby = [...CM_TO_FEET_INDEXABLE_VALUES]
    .filter((n) => n !== cm)
    .sort((a, b) => Math.abs(a - cm) - Math.abs(b - cm) || a - b)
    .slice(0, 3)
    .sort((a, b) => a - b);

  const faqs = [
    {
      question: `How many feet is ${cm} cm?`,
      answer: `${cm} cm equals ${decimalFeet.toFixed(4)} feet, or ${feet} feet and ${inches.toFixed(1)} inches.`,
    },
    {
      question: `How do you convert ${cm} cm to feet?`,
      answer: `Divide centimeters by 30.48 for decimal feet, or divide by 2.54 for inches then split into feet and leftover inches. For ${cm} cm: ${cm} ÷ 30.48 = ${decimalFeet.toFixed(4)} ft.`,
    },
    {
      question: `Is ${cm} cm a common height?`,
      answer:
        cm >= 140 && cm <= 200
          ? `${cm} cm is within the adult standing-height band commonly used on clothing charts and many medical intake forms (not a clinical standard). Confirm with a clinician for health decisions.`
          : `${cm} cm is outside typical adult standing height; it is still useful for objects, furniture, or partial measurements.`,
    },
  ];

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  const path = `/cm-to-feet/${slug}`;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Tools", item: absoluteUrl("/tools") },
      { "@type": "ListItem", position: 3, name: "CM to Feet", item: absoluteUrl("/tools/cm-to-feet") },
      { "@type": "ListItem", position: 4, name: `${cm} cm`, item: absoluteUrl(path) },
    ],
  };
  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${cm} cm to feet`,
    description: `${cm} centimeters equals ${decimalFeet.toFixed(4)} feet (${feet}' ${inches.toFixed(1)}").`,
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
          <Link href="/tools/cm-to-feet" className="transition hover:text-violet-600">
            CM to Feet
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
          <span className="font-medium text-slate-700">{cm} cm → feet</span>
        </nav>

        <article className={`p-6 sm:p-8 ${toolGlassPanel}`}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Converter</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {cm} cm to feet
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-800">
            <strong>
              {cm} cm = {decimalFeet.toFixed(4)} ft
            </strong>{" "}
            ({feet} ft {inches.toFixed(1)} in).
          </p>
          <p className="mt-3 text-slate-600">
            That is {totalInches.toFixed(2)} inches total. Use the{" "}
            <Link href="/tools/cm-to-feet" className="font-medium text-violet-700 underline-offset-2 hover:underline">
              interactive CM to Feet converter
            </Link>{" "}
            when you need to convert a range of values quickly.
          </p>
        </article>

        <div className={`mt-6 p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-lg font-bold text-slate-900">Key takeaways</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
            <li>
              Exact decimal feet: <strong>{decimalFeet.toFixed(4)}</strong>
            </li>
            <li>
              Everyday height style: <strong>{feet}&apos; {inches.toFixed(1)}&quot;</strong>
            </li>
            <li>Formula: feet = cm ÷ 30.48 (1 foot = 30.48 cm exactly in international inch definition)</li>
          </ul>
        </div>

        <div className={`mt-6 p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-lg font-bold text-slate-900">Worked example</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-600">
            <li>Start with {cm} centimeters.</li>
            <li>
              Divide by 30.48 → {cm} ÷ 30.48 = {decimalFeet.toFixed(4)} feet.
            </li>
            <li>
              Or convert to inches first: {cm} ÷ 2.54 = {totalInches.toFixed(2)} in → {feet} ft +{" "}
              {inches.toFixed(1)} in.
            </li>
          </ol>
        </div>

        <div className={`mt-6 p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-lg font-bold text-slate-900">Common mistakes</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
            <li>Dividing by 30 instead of 30.48 (introduces ~1.6% error).</li>
            <li>Mixing feet-decimal with feet-and-inches without converting the fractional foot to inches × 12.</li>
            <li>Rounding too early when you need millimetre-level fit (furniture, medical charts).</li>
          </ul>
        </div>

        <div className={`mt-6 p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-lg font-bold text-slate-900">FAQs</h2>
          <dl className="mt-3 space-y-4 text-slate-600">
            {faqs.map((f) => (
              <div key={f.question}>
                <dt className="font-semibold text-slate-900">{f.question}</dt>
                <dd className="mt-1">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={`mt-6 p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-lg font-bold text-slate-900">Nearby conversions</h2>
          <ul className="mt-3 flex flex-wrap gap-2 text-sm">
            {nearby.map((n) => (
              <li key={n}>
                <Link
                  href={`/cm-to-feet/${n}-cm-to-feet`}
                  className="rounded-lg border border-violet-200/70 bg-white/80 px-3 py-1.5 font-medium text-violet-800 hover:bg-violet-50"
                >
                  {n} cm
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/tools/cm-to-feet"
                className="rounded-lg border border-violet-200/70 bg-white/80 px-3 py-1.5 font-medium text-violet-800 hover:bg-violet-50"
              >
                Full converter
              </Link>
            </li>
            <li>
              <Link
                href="/tools/kg-to-lbs"
                className="rounded-lg border border-violet-200/70 bg-white/80 px-3 py-1.5 font-medium text-violet-800 hover:bg-violet-50"
              >
                KG to LBS
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
