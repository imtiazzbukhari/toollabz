"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function RootSegmentError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[error boundary]", error);
    }
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col justify-center px-4 py-16">
      <div className="rounded-2xl border border-violet-200/60 bg-white/90 p-8 shadow-lg backdrop-blur">
        <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          An unexpected error occurred in this section. Try again or return home. If it persists, tell us what you clicked via the
          contact page.
        </p>
        {process.env.NODE_ENV === "development" ? (
          <pre className="mt-4 max-h-40 overflow-auto rounded-lg bg-slate-900/90 p-3 text-xs text-amber-100">{error.message}</pre>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex min-h-11 items-center rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-violet-800 transition hover:bg-violet-50"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
