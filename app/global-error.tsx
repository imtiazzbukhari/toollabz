"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100">
        <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-slate-900 p-8 shadow-xl">
          <h1 className="text-xl font-bold">Application error</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            The page could not be rendered. Reload the site or try again below.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex min-h-11 items-center rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-500"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.href = "/";
              }}
              className="inline-flex min-h-11 items-center rounded-lg border border-white/20 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Go home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
