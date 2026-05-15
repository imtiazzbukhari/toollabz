import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { siteUrl } from "@/lib/seo";
import { formatSiteLastUpdatedForDisplay, SITE_LAST_UPDATED_ISO } from "@/lib/site-freshness";
import { toolGlassCard, toolGlassPanel } from "@/lib/tool-ui";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Important limitations for Toollabz calculators, converters, AI helpers, and PDF tools: estimates only, no professional advice, and your responsibility for how you use results.",
  alternates: { canonical: "/disclaimer" },
  openGraph: {
    title: "Disclaimer | Toollabz",
    description: "How to interpret Toollabz tool outputs, liability limits, and when to seek professional advice.",
    url: `${siteUrl}/disclaimer`,
    type: "website",
  },
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="transition hover:text-violet-600">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
        <span className="font-medium text-slate-700">Disclaimer</span>
      </nav>

      <header className={`mb-8 p-6 sm:p-8 ${toolGlassPanel}`}>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 text-balance sm:text-4xl">Disclaimer</h1>
        <p className="mt-3 text-sm text-slate-600">
          Last updated:{" "}
          <time dateTime={SITE_LAST_UPDATED_ISO}>{formatSiteLastUpdatedForDisplay()}</time>
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
          Toollabz provides free online tools for general information, education, and convenience. By using the site, you agree that
          the limitations below apply.
        </p>
      </header>

      <div className="space-y-8">
        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Not professional advice</h2>
          <p className="mt-4 leading-7 text-slate-700">
            Nothing on Toollabz is legal, tax, medical, financial, accounting, or investment advice. Outputs are educational
            estimates and may omit rules that apply to your jurisdiction, employer, lender, insurer, or regulator. Always confirm
            material decisions with a qualified professional and official sources.
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Accuracy and assumptions</h2>
          <p className="mt-4 leading-7 text-slate-700">
            Calculators and converters depend on the numbers and settings you enter. Small input mistakes, mixed units, or
            mismatched time periods can produce plausible-looking but incorrect results. AI-assisted tools can be incorrect,
            outdated, or incomplete; you are responsible for fact-checking before you rely on generated text in public or regulated
            contexts.
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">PDF and file tools</h2>
          <p className="mt-4 leading-7 text-slate-700">
            File processing tools run at your direction. You should only upload content you have the right to use. We do not
            guarantee preservation of complex layouts, embedded fonts, signatures, or accessibility metadata after conversion or
            compression. Keep originals when authenticity matters.
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">No warranties</h2>
          <p className="mt-4 leading-7 text-slate-700">
            The site and tools are provided &quot;as is&quot; and &quot;as available,&quot; without warranties of any kind, whether express or implied,
            including merchantability, fitness for a particular purpose, accuracy, availability, or non-infringement, to the extent
            permitted by law.
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Limitation of liability</h2>
          <p className="mt-4 leading-7 text-slate-700">
            To the fullest extent permitted by law, Toollabz and its operators are not liable for any loss or damage arising from
            your use of, or inability to use, the site or tools, including indirect or consequential damages. Because the service is
            offered at no charge, your remedy is to stop using the affected tool and seek independent professional guidance.
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassPanel}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Related policies</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Read the{" "}
            <Link href="/terms" className="font-medium text-violet-700 underline-offset-2 hover:underline">
              Terms &amp; Conditions
            </Link>
            ,{" "}
            <Link href="/privacy" className="font-medium text-violet-700 underline-offset-2 hover:underline">
              Privacy Policy
            </Link>
            , and reach us on the{" "}
            <Link href="/contact" className="font-medium text-violet-700 underline-offset-2 hover:underline">
              contact page
            </Link>{" "}
            if you spot an error we should correct.
          </p>
        </section>
      </div>
    </div>
  );
}
