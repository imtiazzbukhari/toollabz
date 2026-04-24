import Link from "next/link";
import type { Metadata } from "next";
import PremiumPageShell from "@/components/PremiumPageShell";

export const metadata: Metadata = {
  title: "Login",
  description: "Toollabz login page. Authentication is not available yet.",
  alternates: {
    canonical: "/login",
  },
};

export default function LoginPage() {
  return (
    <PremiumPageShell>
      <div className="mx-auto max-w-2xl px-4 py-10 text-center sm:px-6 sm:py-12 lg:px-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Login</h1>
        <p className="mt-3 text-slate-600">
          Authentication is coming soon. Explore tools in the meantime.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/tools"
            className="inline-flex rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            Browse tools
          </Link>
          <Link
            href="/blog"
            className="inline-flex rounded-full border border-violet-200 bg-white px-5 py-2 text-sm font-medium text-violet-800 shadow-sm transition hover:border-violet-300 hover:bg-violet-50"
          >
            Read guides
          </Link>
        </div>
      </div>
    </PremiumPageShell>
  );
}

