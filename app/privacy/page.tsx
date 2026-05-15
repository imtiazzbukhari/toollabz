import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { siteUrl } from "@/lib/seo";
import { formatSiteLastUpdatedForDisplay, SITE_LAST_UPDATED_ISO } from "@/lib/site-freshness";
import { toolGlassCard, toolGlassPanel } from "@/lib/tool-ui";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Toollabz handles cookies, analytics, advertising, and your data when you use our free online tools.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | Toollabz",
    description: "Cookies, analytics, ads, and data protection practices for Toollabz.",
    url: `${siteUrl}/privacy`,
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="transition hover:text-violet-600">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
        <span className="font-medium text-slate-700">Privacy Policy</span>
      </nav>

      <header className={`mb-8 p-6 sm:p-8 ${toolGlassPanel}`}>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 text-balance sm:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-slate-600">
          Last updated:{" "}
          <time dateTime={SITE_LAST_UPDATED_ISO}>{formatSiteLastUpdatedForDisplay()}</time>
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
          This policy describes how Toollabz (“we,” “us”) collects, uses, and protects information when you visit our website and
          use our online tools.
        </p>
      </header>

      <div className="space-y-8">
        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Information we collect</h2>
          <p className="mt-4 leading-7 text-slate-700">
            Most tools run in your browser. We may collect limited technical data automatically (such as IP address, browser type,
            device type, and pages viewed) through standard server logs and, where enabled, cookies or similar technologies.
          </p>
          <p className="mt-3 leading-7 text-slate-700">
            If you contact us or subscribe to updates, we process the information you choose to provide (for example, name, email
            address, and message content) only to respond or deliver that service.
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Cookies</h2>
          <p className="mt-4 leading-7 text-slate-700">
            We and our partners may use cookies and similar storage to remember preferences, keep the site secure, measure
            performance, and support features that rely on a session. You can control cookies through your browser settings;
            disabling some cookies may limit certain functionality.
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Analytics</h2>
          <p className="mt-4 leading-7 text-slate-700">
            We may use analytics tools to understand aggregate usage - such as popular tools, load times, and error rates - so we can
            improve reliability and content. These services may set their own cookies or identifiers and process data according to
            their policies.
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Advertising and ad networks</h2>
          <p className="mt-4 leading-7 text-slate-700">
            We may introduce display advertising or partner with ad networks in the future. If we do, those partners may use
            cookies, pixels, or similar technologies to measure delivery, limit frequency, and show more relevant ads. We will
            update this policy and, where required, provide choices or consent mechanisms aligned with applicable law.
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Data protection and retention</h2>
          <p className="mt-4 leading-7 text-slate-700">
            We apply reasonable technical and organizational measures to protect information against unauthorized access, loss, or
            misuse. We retain data only as long as needed for the purposes described here, legal obligations, or legitimate business
            needs (such as resolving disputes).
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Your rights</h2>
          <p className="mt-4 leading-7 text-slate-700">
            Depending on where you live, you may have rights to access, correct, delete, or restrict certain processing of your
            personal data, or to object to processing. To exercise these rights, contact us via our{" "}
            <Link href="/contact" className="font-medium text-violet-700 underline-offset-2 hover:underline">
              contact page
            </Link>
            .
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Children</h2>
          <p className="mt-4 leading-7 text-slate-700">
            Toollabz is not directed at children under 13, and we do not knowingly collect personal information from them. If you
            believe we have done so, please contact us so we can delete it.
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Changes</h2>
          <p className="mt-4 leading-7 text-slate-700">
            We may update this Privacy Policy from time to time. The “Last updated” date at the top will change when we do;
            continued use of the site after changes means you accept the revised policy.
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassPanel}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Contact</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Questions about privacy? Reach us through the{" "}
            <Link href="/contact" className="font-medium text-violet-700 underline-offset-2 hover:underline">
              contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
