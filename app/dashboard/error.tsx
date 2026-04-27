"use client";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg p-6">
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-6">
        <h1 className="text-lg font-semibold text-rose-900">Dashboard error</h1>
        <p className="mt-2 text-sm text-rose-700">Something went wrong in this section. You can try again.</p>
        <p className="mt-2 text-xs text-rose-600">{error.message}</p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
