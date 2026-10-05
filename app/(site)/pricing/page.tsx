import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Toollabz pricing details. Current tools are free to use.",
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6 sm:py-16 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Pricing</h1>
      <p className="mt-3 text-slate-600">
        Toollabz is currently free to use. Premium plans will be announced
        here.
      </p>
      <div className="mt-8 rounded-2xl border border-white/50 bg-white/75 p-6 shadow-sm backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-slate-900">Free Plan</h2>
        <p className="mt-2 text-sm text-slate-600">
          Access all available tools with no signup required.
        </p>
      </div>
      <Link
        href="/tools"
        className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white"
      >
        Start Using Tools
      </Link>
    </div>
  );
}

