"use client";

import { FormEvent, useState } from "react";
import { Mail } from "lucide-react";

export default function NewsletterForm({ variant = "hero" }: { variant?: "hero" | "footer" }) {
  const [email, setEmail] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [honey, setHoney] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (companyWebsite.trim()) return;
    if (!email.trim()) return;
    setPending(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), _honey: honey }),
        credentials: "same-origin",
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError("Could not subscribe right now. Try again later or use the contact page.");
        return;
      }
      setSubmitted(true);
      setEmail("");
    } catch {
      setError("Network error. Check your connection and retry.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className={
        variant === "footer"
          ? "mt-2 flex w-full min-w-0 flex-col gap-2.5 rounded-2xl border border-white/50 bg-white/75 p-3 backdrop-blur-sm"
          : "mt-4 flex w-full flex-col gap-2 rounded-2xl border border-white/40 bg-white/25 p-2 backdrop-blur sm:flex-row sm:rounded-full sm:p-1.5 md:mt-0 md:max-w-md lg:w-[440px]"
      }
    >
      <input
        type="text"
        name="company_website"
        value={companyWebsite}
        onChange={(e) => setCompanyWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-px w-px opacity-0"
      />
      <input
        type="text"
        name="_honey"
        value={honey}
        onChange={(e) => setHoney(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        style={{ display: "none" }}
      />
      <input
        type="email"
        name="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        maxLength={254}
        className={
          variant === "footer"
            ? "glow-ring box-border min-h-10 w-full min-w-0 rounded-xl border border-violet-200/60 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            : "glow-ring min-h-10 w-full flex-1 rounded-xl bg-white/75 px-4 py-2.5 text-sm text-slate-700 outline-none sm:min-h-0 sm:rounded-full"
        }
        placeholder="you@example.com"
      />
      <button
        type="submit"
        disabled={pending}
        className={
          variant === "footer"
            ? "inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition duration-300 hover:brightness-110 disabled:opacity-60"
            : "inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-[0_8px_20px_rgba(15,23,42,0.35)] transition duration-300 hover:bg-slate-800 disabled:opacity-60 sm:w-auto sm:rounded-full sm:py-2.5"
        }
      >
        <Mail
          className={variant === "footer" ? "h-6 w-6 shrink-0" : "h-4 w-4"}
          strokeWidth={variant === "footer" ? 2.25 : 2}
          aria-hidden="true"
        />
        <span>{pending ? "Sending…" : submitted ? "Subscribed" : "Subscribe"}</span>
      </button>
      {error ? <p className="text-xs text-rose-700 sm:col-span-full">{error}</p> : null}
    </form>
  );
}
