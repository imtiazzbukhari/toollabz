export type SerpOrganic = { link?: string; title?: string; snippet?: string };

/** Google results via SerpAPI. Returns empty if SERPAPI_KEY unset. */
export async function serpApiSearch(query: string): Promise<SerpOrganic[]> {
  const key = process.env.SERPAPI_KEY?.trim();
  if (!key) return [];
  const u = new URL("https://serpapi.com/search.json");
  u.searchParams.set("engine", "google");
  u.searchParams.set("q", query);
  u.searchParams.set("num", "10");
  u.searchParams.set("api_key", key);
  const res = await fetch(u.toString(), { next: { revalidate: 0 } });
  if (!res.ok) return [];
  const data = (await res.json()) as { organic_results?: SerpOrganic[] };
  return Array.isArray(data.organic_results) ? data.organic_results : [];
}

export function queriesForCategory(category: string): string[] {
  const c = category.replace(/-/g, " ");
  return [
    `${c} blog "write for us"`,
    `${c} tools "submit a tool"`,
    `${c} resources "add your tool"`,
    `"best ${c} tools" guest post`,
    `"free ${c} calculators" resources`,
    `site:.edu "${c}" tools resources`,
  ];
}

export function hostFromUrl(raw: string): string | null {
  try {
    const u = new URL(raw);
    return u.hostname.replace(/^www\./i, "");
  } catch {
    return null;
  }
}
