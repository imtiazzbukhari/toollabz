import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, breadcrumbJsonLd, siteUrl } from "@/lib/seo";
import { toolGlassCard, toolGlassPanel } from "@/lib/tool-ui";
import PageLastUpdated from "@/components/PageLastUpdated";

export const metadata: Metadata = {
  title: { absolute: "Imtiaz Ahmad — Founder & Lead Engineer | Toollabz" },
  description:
    "Imtiaz Ahmad founded Toollabz and leads calculator engineering, formula transparency, performance, and technical SEO.",
  alternates: { canonical: "/team/imtiaz-ahmad" },
};

export default function ImtiazAhmadPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Imtiaz Ahmad", path: "/team/imtiaz-ahmad" },
  ]);
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Imtiaz Ahmad",
    jobTitle: "Founder & lead engineer",
    url: absoluteUrl("/team/imtiaz-ahmad"),
    worksFor: { "@type": "Organization", name: "Toollabz", url: siteUrl },
    description:
      "Founder of Toollabz. Focuses on calculator correctness, transparent formulas, page performance, and technical SEO.",
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <PageLastUpdated className="mb-4" />
      <article className={`space-y-6 p-6 sm:p-8 ${toolGlassPanel}`}>
        <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/about" className="hover:text-violet-700">
            About
          </Link>
          <span className="mx-1.5 opacity-40">/</span>
          <span className="font-medium text-slate-700">Imtiaz Ahmad</span>
        </nav>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Imtiaz Ahmad</h1>
        <p className="text-lg font-medium text-violet-800">Founder &amp; lead engineer</p>
        <p className="leading-7 text-slate-700">
          Imtiaz founded Toollabz in April 2026 to publish free calculators with visible formulas, honest limitations, and
          fast pages. He owns product engineering: calculator logic, client-side tooling (including PDF utilities),
          performance budgets, and technical SEO infrastructure such as sitemaps, canonicals, and structured data.
        </p>

        <section className={`space-y-3 p-5 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900">What he reviews</h2>
          <ul className="list-disc space-y-2 pl-5 text-slate-700">
            <li>Developer and PDF tools for correctness and privacy-safe client-side processing</li>
            <li>Formula documentation and edge-case handling across the tool directory</li>
            <li>Site reliability, Core Web Vitals-minded delivery, and crawl hygiene</li>
          </ul>
        </section>

        <section className={`space-y-3 p-5 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900">Standards</h2>
          <p className="text-slate-700">
            Work is guided by the{" "}
            <Link href="/methodology" className="font-medium text-violet-800 underline-offset-2 hover:underline">
              methodology
            </Link>{" "}
            and{" "}
            <Link href="/editorial-policy" className="font-medium text-violet-800 underline-offset-2 hover:underline">
              editorial policy
            </Link>
            . Finance and health pages also receive editorial review before rate-sensitive updates ship.
          </p>
        </section>

        <p className="text-sm text-slate-600">
          <Link href="/team/editorial" className="font-medium text-violet-800 underline-offset-2 hover:underline">
            Toollabz Editorial
          </Link>
          {" · "}
          <Link href="/contact" className="font-medium text-violet-800 underline-offset-2 hover:underline">
            Contact
          </Link>
        </p>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
    </div>
  );
}
