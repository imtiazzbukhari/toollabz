"use client";

import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SeoConsoleLoginForm() {
  const [secret, setSecret] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/seo-growth-console";
  const cfgErr = sp.get("error");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/seo-console/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });
      const j = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !j.ok) {
        setErr(j.error || "Login failed");
        return;
      }
      router.replace(next.startsWith("/") ? next : "/seo-growth-console");
      router.refresh();
    } catch {
      setErr("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold text-slate-900">SEO growth console</h1>
      <p className="mt-2 text-sm text-slate-600">Admin sign-in (cookie, 12h). Use the same value as TOOLLABZ_SEO_CONSOLE_SECRET.</p>
      {cfgErr === "not_configured" ? (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Console secret is not set on this deployment. Set TOOLLABZ_SEO_CONSOLE_SECRET before using this route in production.
        </p>
      ) : null}
      <form className="mt-8 space-y-4" onSubmit={onSubmit}>
        <label className="block text-sm font-medium text-slate-700">
          Secret
          <input
            type="password"
            autoComplete="off"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
          />
        </label>
        {err ? <p className="text-sm text-red-600">{err}</p> : null}
        <button
          type="submit"
          disabled={loading || !secret.trim()}
          className="w-full rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-violet-700 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
