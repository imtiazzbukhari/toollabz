import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Toollabz account. Sign-up flow is coming soon.",
  alternates: {
    canonical: "/signup",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-center sm:px-6 sm:py-16 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Create Account</h1>
      <p className="mt-3 text-slate-600">
        Sign up flow is coming soon. You can still use all tools for free now.
      </p>
      <Link
        href="/tools"
        className="mt-6 inline-flex rounded-full bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-2 text-sm font-medium text-white"
      >
        Explore Free Tools
      </Link>
    </div>
  );
}

