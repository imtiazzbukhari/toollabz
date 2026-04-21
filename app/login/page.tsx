import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Toollabz login page. Authentication is not available yet.",
  alternates: {
    canonical: "/login",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-center sm:px-6 sm:py-16 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Login</h1>
      <p className="mt-3 text-slate-600">
        Authentication is coming soon. Explore tools in the meantime.
      </p>
      <Link
        href="/tools"
        className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white"
      >
        Browse Tools
      </Link>
    </div>
  );
}

