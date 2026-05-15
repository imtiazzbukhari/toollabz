/**
 * Caps how many paths each `generateStaticParams` pre-renders at build time.
 * Keeps `next build` bounded on low-RAM VPS; other paths still render via `dynamicParams` (default true).
 */
export const STATIC_BUILD_PARAM_CAP = 80;

export function capStaticParams<T extends Record<string, string>>(rows: readonly T[], cap = STATIC_BUILD_PARAM_CAP): T[] {
  return rows.slice(0, cap);
}
