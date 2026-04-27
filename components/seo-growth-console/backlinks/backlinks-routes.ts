/** SEO console vs dashboard mirror use different URL segments for generator + outreach. */

export function backlinksBasePath(pathname: string | null): "/dashboard/backlinks" | "/seo-growth-console/backlinks" {
  if (pathname?.startsWith("/dashboard/backlinks")) return "/dashboard/backlinks";
  return "/seo-growth-console/backlinks";
}

export function isDashboardBacklinks(pathname: string | null): boolean {
  return Boolean(pathname?.startsWith("/dashboard/backlinks"));
}

export function backlinksContentGeneratorPath(pathname: string | null): string {
  const base = backlinksBasePath(pathname);
  return `${base}/${isDashboardBacklinks(pathname) ? "content-generator" : "generate"}`;
}

export function backlinksOutreachPath(pathname: string | null): string {
  const base = backlinksBasePath(pathname);
  return `${base}/${isDashboardBacklinks(pathname) ? "outreach-manager" : "outreach"}`;
}
