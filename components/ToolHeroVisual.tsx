import type { ToolDefinition } from "@/lib/tools/types";
import { getToolCardIcon } from "@/utils/icons";
import { getToolCategoryIconGradient } from "@/utils/tool-category-visual";

type Props = {
  tool: Pick<ToolDefinition, "name" | "slug" | "category">;
  /** Default: full tool hero. `compact` for EMI-style narrow columns. */
  variant?: "hero" | "compact";
};

/**
 * Replaces the generic WebP hub art with a lightweight, tool-specific “3D” icon treatment
 * (CSS perspective + glass panel). Icon resolves from slug heuristics + category (see `getToolCardIcon`).
 */
export default function ToolHeroVisual({ tool, variant = "hero" }: Props) {
  const Icon = getToolCardIcon(tool);
  const gradient = getToolCategoryIconGradient(tool.category);
  const iconClass =
    variant === "compact"
      ? "h-[5.5rem] w-[5.5rem] text-white drop-shadow-[0_6px_18px_rgba(15,23,42,0.35)] sm:h-24 sm:w-24"
      : "h-24 w-24 text-white drop-shadow-[0_8px_22px_rgba(15,23,42,0.4)] sm:h-28 sm:w-28 lg:h-32 lg:w-32";

  return (
    <div
      className="relative mx-auto w-full max-w-[14rem] shrink-0 select-none lg:mx-0 lg:max-w-[min(18rem,34vw)]"
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="absolute h-[118%] w-[118%] rounded-full border border-violet-300/25 bg-[radial-gradient(circle_at_30%_20%,rgba(167,139,250,0.35),transparent_55%)] blur-[2px]" />
        <div
          className="absolute h-full w-full rounded-full border border-fuchsia-200/20 opacity-80"
          style={{ transform: "rotate(-8deg) scale(1.05)" }}
        />
      </div>
      <div
        className="relative mx-auto aspect-square w-[88%] max-w-[13.5rem] [perspective:900px] sm:w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="relative flex h-full w-full items-center justify-center rounded-[1.65rem] border border-white/60 bg-gradient-to-br from-white/95 via-violet-50/90 to-indigo-100/80 p-6 shadow-[0_22px_48px_rgba(76,29,149,0.22),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-violet-200/40 sm:rounded-[1.85rem] sm:p-8"
          style={{
            transform: "rotateX(10deg) rotateY(-16deg)",
            boxShadow: "0 24px 50px rgba(76, 29, 149, 0.18), inset 0 0 0 1px rgba(255,255,255,0.5)",
          }}
        >
          <div
            className={`absolute inset-[10%] rounded-2xl bg-gradient-to-br ${gradient} opacity-[0.22] blur-xl`}
            aria-hidden
          />
          <div
            className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} p-[0.65rem] shadow-[0_12px_28px_rgba(30,27,75,0.35)] ring-2 ring-white/70`}
          >
            <Icon className={iconClass} strokeWidth={1.35} aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}
