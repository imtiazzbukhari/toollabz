import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Mail } from "lucide-react";
import { absoluteUrl, breadcrumbJsonLd, siteUrl } from "@/lib/seo";
import { toolGlassCard, toolGlassPanel } from "@/lib/tool-ui";
import { tools } from "@/lib/tools/data";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "hello@toollabz.com";

export const metadata: Metadata = {
  title: { absolute: `About Toollabz | Toollabz - Free Online Tools` },
  description:
    "Meet the Toollabz team, our mission to ship accurate free calculators & PDF tools, founding story, and how to reach us - Toollabz editorial & engineering.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Toollabz",
    description:
      "Transparent online utilities: who builds Toollabz, why we care about HTTPS and structured data, and how to contact the team.",
    url: `${siteUrl}/about`,
    type: "website",
    siteName: "Toollabz",
  },
};

const team = [
  {
    name: "Imtiaz Ahmad",
    role: "Founder & lead engineer",
    initials: "IA",
    bio: "Imtiaz founded Toollabz in April 2026 and leads product engineering, calculator logic, performance, and technical SEO. His focus is building practical tools with visible assumptions, fast pages, and enough explanation for users to check the result instead of blindly trusting a black box.",
  },
  {
    name: "Toollabz Editorial",
    role: "Product editor",
    initials: "TE",
    bio: "The editorial workflow reviews finance and legal-adjacent pages for formula clarity, source references, and visible disclaimers. Pages are updated when rates, public guidance, or tool behavior changes.",
  },
] as const;

export default function AboutPage() {
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);

  const aboutPageLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Toollabz",
    url: absoluteUrl("/about"),
    description: "Mission, team, and contact for the Toollabz free calculators and PDF utilities directory.",
    mainEntity: {
      "@type": "Organization",
      name: "Toollabz",
      url: siteUrl,
      logo: absoluteUrl("/logo-toollabz.webp"),
      foundingDate: "2026-04",
      description:
        "Free online tools for finance, business, PDF, developer, and utility tasks with visible formulas, FAQs, and editorial review notes.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: contactEmail,
        url: absoluteUrl("/contact"),
      },
    },
  };

  const teamListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: team.map((member, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Person",
        name: member.name,
        jobTitle: member.role,
        description: member.bio,
        worksFor: { "@type": "Organization", name: "Toollabz", url: siteUrl },
      },
    })),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(teamListLd) }} />
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="transition hover:text-violet-600">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
        <span className="font-medium text-slate-700">About Us</span>
      </nav>

      <header className={`mb-8 p-6 sm:p-8 ${toolGlassPanel}`}>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 text-balance sm:text-4xl">About Toollabz</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Founded in April 2026, Toollabz publishes {tools.length}+ HTTPS-first calculators, converters, developer helpers,
          and PDF utilities for people who need a quick answer and a clear explanation of how it was produced.
        </p>
      </header>

      <div className="space-y-8">
        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Who We Are</h2>
          <p className="mt-4 leading-7 text-slate-700">
            Toollabz started from a simple frustration: many “free tool” sites either paywall mid-flow, bury assumptions inside
            black-box JavaScript, or pad pages with generic copy. Our mission is to keep useful calculations accessible, explain
            the formula in plain language, and show enough context for users to spot mistakes before relying on an output.
          </p>
          <p className="mt-4 leading-7 text-slate-700">
            Compared with larger directories such as Calculator.net or Omni Calculator, Toollabz is narrower and more workflow
            focused. We pair tools with related guides, keep the UI lightweight, and prioritize transparent assumptions over
            trying to cover every possible academic model.
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Our Editorial Standards</h2>
          <p className="mt-4 leading-7 text-slate-700">
            Each calculator starts with a documented formula, test inputs, and visible limits. Finance and tax tools are reviewed
            against official sources where relevant, such as HMRC for UK tax and VAT guidance and IRS material for US tax context.
          </p>
          <p className="mt-4 leading-7 text-slate-700">
            Rate-sensitive pages are checked on a predictable cadence: UK tax rates after each April update, US tax assumptions
            after official annual releases, and general calculators monthly when we refresh tool content. Toollabz is for
            planning and education, not licensed financial, legal, medical, or tax advice.
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Meet the Team</h2>
          <ul className="mt-4 space-y-5">
            {team.map((member) => (
              <li key={member.name} className="flex gap-4 border-b border-violet-100 pb-5 last:border-0 last:pb-0">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-800">
                  {member.initials}
                </span>
                <div>
                  <p className="text-lg font-semibold text-slate-900">{member.name}</p>
                  <p className="text-sm font-medium text-violet-700">{member.role}</p>
                  <p className="mt-2 leading-7 text-slate-700">{member.bio}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Contact</h2>
          <p className="mt-4 leading-7 text-slate-700">
            For corrections, partnerships, calculator feedback, or privacy questions, email{" "}
            <a href={`mailto:${contactEmail}`} className="font-medium text-violet-800 underline-offset-2 hover:underline">
              {contactEmail}
            </a>
            . We aim to review genuine support and correction requests within 2-3 business days.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
          >
            <Mail className="h-4 w-4" aria-hidden />
            Contact Toollabz
          </Link>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassPanel}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Explore</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/tools"
              className="inline-flex rounded-xl border border-violet-300/60 bg-white/70 px-5 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-white"
            >
              Browse all tools
            </Link>
            <Link
              href="/blog"
              className="inline-flex rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              Read the blog
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
