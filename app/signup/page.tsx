import Link from "next/link";
import type { Metadata } from "next";
import PremiumPageShell from "@/components/PremiumPageShell";

export const metadata: Metadata = {
  title: { absolute: "Sign Up | Toollabz" },
  description: "Create your Toollabz account. Sign-up flow is coming soon.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: "/signup",
  },
};

export default function SignupPage() {
  return (
    <PremiumPageShell>
      <div className="mx-auto max-w-2xl px-4 py-10 text-center sm:px-6 sm:py-12 lg:px-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Create account</h1>
        <p className="mt-3 text-slate-600">
          Sign up flow is coming soon. You can still use all tools for free now.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/tools"
            className="inline-flex rounded-full bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-2 text-sm font-medium text-white shadow-md transition hover:brightness-110"
          >
            Explore free tools
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

