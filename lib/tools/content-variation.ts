/** Stable 0..mod-1 from slug for template rotation (no runtime randomness). */
export function slugContentVariant(slug: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return mod > 0 ? h % mod : 0;
}

export function pickBySlug<T>(slug: string, options: readonly T[]): T {
  if (options.length === 0) throw new Error("pickBySlug requires options");
  return options[slugContentVariant(slug, options.length)]!;
}
