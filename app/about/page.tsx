import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { siteUrl } from "@/lib/seo";
import { toolGlassCard, toolGlassPanel } from "@/lib/tool-ui";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Toollabz is a free online tools platform for calculators, converters, PDF utilities, and more - built for accuracy, speed, and people everywhere.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Toollabz",
    description:
      "Free online tools for work and life - simple interfaces, clear results, and no paywall between you and the job.",
    url: `${siteUrl}/about`,
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
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
          We built Toollabz because everyone deserves quick, dependable utilities without signing up for yet another product.
        </p>
      </header>

      <div className="space-y-8">
        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">What we do</h2>
          <p className="mt-4 leading-7 text-slate-700">
            Toollabz is an online tools platform: calculators, converters, generators, PDF helpers, and more - all in one place.
            Whether you are estimating a loan, checking a conversion, or cleaning up a document, the idea is the same - open the
            page, enter your numbers or text, get an answer you can actually use.
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Free, full stop</h2>
          <p className="mt-4 leading-7 text-slate-700">
            Our tools are free to use. No credit card wall, no “three tries then pay.” We care more about you finishing the task
            than about squeezing a signup out of you mid-flow.
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Built for people everywhere</h2>
          <p className="mt-4 leading-7 text-slate-700">
            People use Toollabz from different countries, time zones, and devices. We keep interfaces readable on a phone, fast on
            a laptop, and honest about what each tool can and cannot do - so you are never guessing whether the result applies to
            your situation.
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Accuracy and simplicity</h2>
          <p className="mt-4 leading-7 text-slate-700">
            We aim for clear math, predictable behavior, and labels that make sense the first time you read them. A good tool
            should feel almost boring: you trust it, you move on. If something looks off, we want you to know what inputs drove the
            output - not a black box.
          </p>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassPanel}`}>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Try the tools</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Explore the directory or jump to a category to find what you need.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/tools"
              className="inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
            >
              Browse all tools
            </Link>
            <Link
              href="/contact"
              className="inline-flex rounded-xl border border-violet-300/60 bg-white/70 px-5 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-white"
            >
              Contact us
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
