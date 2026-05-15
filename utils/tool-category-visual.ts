/** Tailwind gradient classes for tool category (hero + cards). */
export const TOOL_CATEGORY_ICON_GRADIENT: Record<string, string> = {
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

export function getToolCategoryIconGradient(category: string): string {
  return TOOL_CATEGORY_ICON_GRADIENT[category] ?? "from-violet-500 to-blue-500";
}
