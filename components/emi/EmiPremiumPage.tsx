import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ToolDefinition } from "@/lib/tools/types";
import { toolGlassPanel } from "@/lib/tool-ui";
import ToolHeroVisual from "@/components/ToolHeroVisual";
import EmiCalculatorWidget from "./EmiCalculatorWidget";

export default function EmiPremiumPage({ tool }: { tool: ToolDefinition }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <nav className="mb-5 flex flex-wrap items-center gap-1 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="transition hover:text-violet-600">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
        <Link href="/tools?category=finance" className="transition hover:text-violet-600">
          Calculators
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
        <span className="font-medium text-slate-700">Finance</span>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
        <span className="font-medium text-slate-700">{tool.name}</span>
      </nav>

      <section className={`mb-6 p-6 sm:p-8 ${toolGlassPanel}`}>
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <span className="inline-flex rounded-full border border-violet-300/60 bg-violet-100/70 px-3 py-1 text-xs font-semibold text-violet-700">
              Finance
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">EMI Calculator</h1>
            <p className="mt-3 max-w-xl text-slate-600">
              Find your monthly EMI, principal and interest breakdown.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["100% Free", "No Sign Up", "Accurate Results", "Mobile Friendly"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-violet-200/70 bg-white/75 px-3 py-1 text-xs text-slate-600"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-8 -z-10 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.25),rgba(59,130,246,0.05)_70%)] blur-2xl" />
            <ToolHeroVisual tool={tool} variant="compact" />
          </div>
        </div>
      </section>

      <EmiCalculatorWidget />
    </div>
  );
}
