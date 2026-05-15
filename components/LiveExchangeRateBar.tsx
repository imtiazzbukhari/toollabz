"use client";

import { useCallback, useState } from "react";

export default function LiveExchangeRateBar({
  form,
  setForm,
}: {
  form: Record<string, string>;
  setForm: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const apply = useCallback(async () => {
    const from = (form.fromCurrency ?? "USD").trim();
    const to = (form.toCurrency ?? "EUR").trim();
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/exchange-rates?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`, {
        credentials: "same-origin",
      });
      const data = (await res.json()) as { rate?: number; error?: string; asOf?: string };
      if (!res.ok) {
        setStatus(data.error === "rate_limited" ? "Too many requests - try again shortly." : "Could not load rate.");
        return;
      }
      if (typeof data.rate !== "number") {
        setStatus("Unexpected response");
        return;
      }
      setForm((s) => ({ ...s, rate: String(data.rate) }));
      setStatus(
        `Reference: 1 ${from} ≈ ${data.rate} ${to}${data.asOf ? ` (as of ${data.asOf})` : ""} - ECB via Frankfurter; bank spreads extra.`,
      );
    } catch {
      setStatus("Network error");
    } finally {
      setBusy(false);
    }
  }, [form.fromCurrency, form.toCurrency, setForm]);

  return (
    <div className="rounded-xl border border-violet-200/60 bg-violet-50/40 p-4 text-sm">
      <p className="font-semibold text-slate-800">Live exchange rate</p>
      <p className="mt-1 text-xs text-slate-600">
        Pulls a mid-market ECB reference rate. Override the rate field anytime for your bank’s quote.
      </p>
      <button
        type="button"
        onClick={() => void apply()}
        disabled={busy}
        className="mt-3 inline-flex items-center justify-center rounded-lg bg-violet-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-800 disabled:opacity-60"
      >
        {busy ? "Loading…" : "Apply live rate"}
      </button>
      {status ? <p className="mt-2 text-xs text-slate-700">{status}</p> : null}
    </div>
  );
}
