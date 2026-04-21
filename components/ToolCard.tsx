import Image from "next/image";
import Link from "next/link";
import type { ToolListingPreview } from "@/lib/tools/tool-listing";
import { toolIllustrationSrc } from "@/lib/tools/tool-illustration";
import { toolGlassCard } from "@/lib/tool-ui";
import { getToolCardIcon } from "@/utils/icons";

const iconGradient: Record<string, string> = {
  converters: "from-violet-500 to-fuchsia-500",
  finance: "from-emerald-500 to-green-500",
  pdf: "from-rose-500 to-red-500",
  generators: "from-sky-500 to-blue-500",
  developer: "from-indigo-500 to-blue-600",
  utility: "from-cyan-500 to-blue-500",
  business: "from-orange-500 to-amber-500",
  marketing: "from-pink-500 to-rose-500",
  "real-estate": "from-teal-500 to-cyan-500",
  legal: "from-violet-500 to-purple-600",
  creator: "from-blue-500 to-indigo-500",
  calculators: "from-sky-500 to-cyan-500",
  image: "from-fuchsia-500 to-pink-500",
};

export default function ToolCard({
  tool,
  showThumbnail = true,
}: {
  tool: ToolListingPreview;
  /** When false, icon-only card (e.g. homepage Popular Tools). */
  showThumbnail?: boolean;
}) {
  const Icon = getToolCardIcon(tool);
  const iconTone = iconGradient[tool.category] ?? "from-violet-500 to-blue-500";

  if (!showThumbnail) {
    return (
      <Link
        href={`/tools/${tool.slug}`}
        className="group flex h-full min-h-[9.5rem] flex-col rounded-2xl border border-white/50 bg-white/75 p-4 shadow-[0_8px_20px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(76,29,149,0.12)] sm:p-5"
      >
        <div
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${iconTone} text-white transition duration-300 group-hover:shadow-[0_0_22px_rgba(99,102,241,0.35)]`}
        >
          <Icon className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden="true" />
        </div>
        <div className="mt-3 flex min-h-0 flex-1 flex-col">
          <span className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900">{tool.name}</span>
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-snug text-slate-600">{tool.shortDescription}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={`group flex h-full min-h-[11rem] flex-col overflow-hidden ${toolGlassCard} transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(76,29,149,0.14)]`}
    >
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-transparent">
        <Image
          src={toolIllustrationSrc()}
          alt=""
          fill
          className="object-cover object-center transition duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
          aria-hidden
        />
        {/* Fade into page shell so the photo does not read as a separate white/plastic box */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-t from-[#eef2ff]/95 via-[#eef2ff]/45 to-transparent"
          aria-hidden
        />
        <div
          className={`absolute bottom-2 left-2 z-[1] inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${iconTone} text-white shadow-md ring-2 ring-white/80`}
        >
          <Icon className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-transparent to-white/25 p-4 sm:p-5">
        <span className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900">{tool.name}</span>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-snug text-slate-600">{tool.shortDescription}</p>
      </div>
    </Link>
  );
}
