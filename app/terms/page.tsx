import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { siteUrl } from "@/lib/seo";
import { formatSiteLastUpdatedForDisplay, SITE_LAST_UPDATED_ISO } from "@/lib/site-freshness";
import { toolGlassCard, toolGlassPanel } from "@/lib/tool-ui";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms of use for Toollabz: estimates and disclaimers, limitation of liability, and your responsibilities when using our free online tools.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms & Conditions | Toollabz",
    description: "Legal terms for using Toollabz calculators, converters, and utilities.",
    url: `${siteUrl}/terms`,
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="transition hover:text-violet-600">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
        <span className="font-medium text-slate-700">Terms & Conditions</span>
      </nav>

      <header className={`mb-8 p-6 sm:p-8 ${toolGlassPanel}`}>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 text-balance sm:text-4xl">Terms & Conditions</h1>
        <p className="mt-3 text-sm text-slate-600">
          Last updated:{" "}
          <time dateTime={SITE_LAST_UPDATED_ISO}>{formatSiteLastUpdatedForDisplay()}</time>
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
          By accessing or using Toollabz, you agree to these terms. If you do not agree, please do not use the site.
        </p>
      </header>

      <div className="space-y-8">
        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Use of the service</h2>
          <p className="mt-4 leading-7 text-slate-700">
            Toollabz provides online tools for general information and convenience. We may change, suspend, or discontinue any tool
            or feature at any time without notice.
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Tool results are estimates</h2>
          <p className="mt-4 leading-7 text-slate-700">
            Outputs from calculators, converters, generators, and similar utilities are <strong className="font-semibold text-slate-800">estimates or illustrative results</strong> unless we explicitly state otherwise. Real-world outcomes depend on many factors we do not control - tax rules change, markets move, and individual circumstances vary.
          </p>
          <p className="mt-3 leading-7 text-slate-700">
            Do not rely on Toollabz as the sole basis for legal, tax, financial, medical, or other professional decisions. When it
            matters, consult a qualified professional and verify against official sources.
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">No warranty</h2>
          <p className="mt-4 leading-7 text-slate-700">
            The site and tools are provided “as is” and “as available,” without warranties of any kind, whether express or
            implied, including merchantability, fitness for a particular purpose, accuracy, or non-infringement.
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Limitation of liability</h2>
          <p className="mt-4 leading-7 text-slate-700">
            To the fullest extent permitted by law, Toollabz and its operators shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages, or any loss of profits, data, goodwill, or business interruption, arising
            from your use of - or inability to use - the site or tools.
          </p>
          <p className="mt-3 leading-7 text-slate-700">
            Where liability cannot be excluded, our total liability for any claim related to the service shall not exceed the
            amount you paid us to use the service in the twelve months before the claim (or, if the service is free, zero).
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Your responsibility</h2>
          <p className="mt-4 leading-7 text-slate-700">
            You are responsible for the information you enter, how you use the results, and compliance with laws that apply to
            you. You agree not to misuse the site -  including attempting to disrupt security, overload systems, scrape in a way
            that harms performance, or use tools for unlawful purposes.
          </p>
          <p className="mt-3 leading-7 text-slate-700">
            You are responsible for backing up your own data and files. Tools that process files (such as PDF utilities) run at
            your direction; you should only upload content you have the right to use.
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Third-party links and services</h2>
          <p className="mt-4 leading-7 text-slate-700">
            The site may reference or link to third-party websites or services. We do not control them and are not responsible for
            their content, policies, or practices.
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Governing law</h2>
          <p className="mt-4 leading-7 text-slate-700">
            These terms are governed by the laws applicable in your jurisdiction as we may specify in future versions, without
            regard to conflict-of-law principles. If any provision is unenforceable, the remaining provisions stay in effect.
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassPanel}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Contact</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            For questions about these terms, visit our{" "}
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
