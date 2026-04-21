"use client";

import { FormEvent, useState } from "react";
import { Mail } from "lucide-react";

export default function NewsletterForm({ variant = "hero" }: { variant?: "hero" | "footer" }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <form
      onSubmit={onSubmit}
      className={
        variant === "footer"
          ? "mt-2 flex w-full min-w-0 flex-col gap-2.5 rounded-2xl border border-white/50 bg-white/75 p-3 backdrop-blur-sm"
          : "mt-4 flex w-full flex-col gap-2 rounded-2xl border border-white/40 bg-white/25 p-2 backdrop-blur sm:flex-row sm:rounded-full sm:p-1.5 md:mt-0 md:max-w-md lg:w-[440px]"
      }
    >
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className={
          variant === "footer"
            ? "glow-ring box-border min-h-10 w-full min-w-0 rounded-xl border border-violet-200/60 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            : "glow-ring min-h-10 w-full flex-1 rounded-xl bg-white/75 px-4 py-2.5 text-sm text-slate-700 outline-none sm:min-h-0 sm:rounded-full"
        }
        placeholder="Enter your email"
      />
      <button
        type="submit"
        className={
          variant === "footer"
            ? "inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition duration-300 hover:brightness-110"
            : "inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-[0_8px_20px_rgba(15,23,42,0.35)] transition duration-300 hover:bg-slate-800 sm:w-auto sm:rounded-full sm:py-2.5"
        }
      >
        <Mail
          className={variant === "footer" ? "h-6 w-6 shrink-0" : "h-4 w-4"}
          strokeWidth={variant === "footer" ? 2.25 : 2}
          aria-hidden="true"
        />
        <span>{submitted ? "Subscribed" : "Subscribe"}</span>
      </button>
    </form>
  );
}

