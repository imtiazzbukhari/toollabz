"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function HomeSearchForm({ variant = "default" }: { variant?: "default" | "hero-compact" | "hero-premium" }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const q = query.trim();
    router.push(q ? `/tools?q=${encodeURIComponent(q)}` : "/tools");
  };

  return (
    <form
      onSubmit={onSubmit}
      className={
        variant === "hero-compact"
          ? "mt-6 flex w-full max-w-lg flex-col gap-2 rounded-2xl border border-white/50 bg-white/75 p-2 shadow-[0_8px_20px_rgba(15,23,42,0.08)] sm:flex-row sm:rounded-full sm:p-1.5 md:max-w-xl"
          : variant === "hero-premium"
            ? "mt-0 flex w-full max-w-xl flex-col gap-2 rounded-2xl border border-white/50 bg-white/85 p-2 shadow-lg backdrop-blur-sm sm:flex-row sm:gap-0 sm:rounded-full sm:p-1.5"
          : "mt-8 flex w-full max-w-2xl flex-col gap-2 rounded-2xl border border-white/50 bg-white/75 p-2 shadow-[0_12px_30px_rgba(76,29,149,0.12)] backdrop-blur sm:flex-row sm:rounded-full sm:p-1.5"
      }
    >
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search any tool you need..."
        className={
          variant === "hero-compact"
            ? "glow-ring min-h-11 w-full flex-1 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none sm:min-h-0 sm:rounded-full"
            : variant === "hero-premium"
              ? "glow-ring min-h-11 w-full flex-1 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none sm:min-h-0 sm:rounded-full sm:px-5"
            : "glow-ring min-h-11 w-full flex-1 rounded-xl px-4 py-3 text-slate-700 outline-none sm:min-h-0 sm:rounded-full sm:px-5"
        }
      />
      <button
        type="submit"
        className={
          variant === "hero-compact"
            ? "inline-flex w-full shrink-0 items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:brightness-110 sm:w-auto sm:rounded-full sm:py-2.5"
            : variant === "hero-premium"
              ? "inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(79,70,229,0.35)] transition duration-300 hover:brightness-110 sm:w-auto sm:rounded-full sm:px-6"
            : "inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(79,70,229,0.35)] transition duration-300 hover:brightness-110 sm:w-auto sm:rounded-full sm:px-6"
        }
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        <span>Search</span>
      </button>
    </form>
  );
}

