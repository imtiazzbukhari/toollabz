import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Mail } from "lucide-react";
import { absoluteUrl, breadcrumbJsonLd, siteUrl } from "@/lib/seo";
import { toolGlassCard, toolGlassPanel } from "@/lib/tool-ui";
import { tools } from "@/lib/tools/data";

export const metadata: Metadata = {
  title: { absolute: `About Toollabz | Toollabz - Free Online Tools` },
  description:
    "Meet the Toollabz team, our mission to ship accurate free calculators & PDF tools, founding story, and how to reach us — Toollabz editorial & engineering.",
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
    bio: "Owns architecture, performance budgets, and the boring reliability work that keeps hundreds of tools fast on modest hardware.",
  },
  {
    name: "Toollabz Editorial",
    role: "Product editor",
    bio: "Coordinates accuracy reviews for finance and legal-adjacent calculators, pairs long-form guides with the live tools, and keeps disclaimers visible.",
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
          We publish {tools.length}+ free, HTTPS-first calculators, converters, and PDF utilities so you can finish real work
          without signing up for another SaaS trial.
        </p>
      </header>

      <div className="space-y-8">
        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Founding story</h2>
          <p className="mt-4 leading-7 text-slate-700">
            Toollabz started from a simple frustration: most “free tool” sites either paywall mid-flow, ship dark-pattern ads, or
            hide assumptions inside black-box JavaScript. We wanted the opposite—deterministic math, visible formulas where
            possible, and pages that read well on a phone on a train.
          </p>
          <p className="mt-4 leading-7 text-slate-700">
            Today the directory spans finance, PDF, developer, and AI drafting utilities. Growth is intentionally boring: ship a
            tool, document how it behaves, link to siblings and hubs, and revisit when tax tables or browser APIs change.
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Mission</h2>
          <p className="mt-4 leading-7 text-slate-700">
            Make accurate utilities accessible: no account wall between you and the calculation, canonical URLs for every page,
            structured data for discovery, and plain-language limits so you know when to escalate to a licensed professional.
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Team</h2>
          <ul className="mt-4 space-y-5">
            {team.map((member) => (
              <li key={member.name} className="border-b border-violet-100 pb-5 last:border-0 last:pb-0">
                <p className="text-lg font-semibold text-slate-900">{member.name}</p>
                <p className="text-sm font-medium text-violet-700">{member.role}</p>
                <p className="mt-2 leading-7 text-slate-700">{member.bio}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Contact</h2>
          <p className="mt-4 leading-7 text-slate-700">
            For partnerships, corrections on a calculator, or DMCA-style PDF concerns, use the contact page — we read every
            message, even if we cannot reply instantly.
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
