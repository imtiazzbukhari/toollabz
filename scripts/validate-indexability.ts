import { classifyUrl } from "../lib/seo/url-classification";
import { buildPageSitemapEntries, buildSitemapEntries } from "../lib/content-engine/sitemap-data";
import { GET as robotsGet } from "../app/robots.txt/route";

export type CheckResult = { name: string; pass: boolean; detail: string };

const PRIVATE = [
  "/api/seo-console/data",
  "/dashboard",
  "/seo-growth-console",
  "/embed/loan-calculator",
  "/login",
  "/signup",
];

const PUBLIC_INDEXABLE = ["/", "/tools/loan-calculator", "/about", "/methodology", "/fr", "/fr/tools/loan-calculator"];

export async function validateIndexability(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  const robots = await (await robotsGet()).text();

  for (const path of PRIVATE) {
    const c = classifyUrl(path);
    results.push({
      name: `private-${path}`,
      pass: c.indexability === "noindex" || c.indexability === "blocked",
      detail: `${c.indexability} / ${c.recommendedAction}`,
    });
  }

  for (const path of PUBLIC_INDEXABLE) {
    const c = classifyUrl(path);
    results.push({
      name: `public-${path}`,
      pass: c.indexability === "index",
      detail: c.indexability,
    });
  }

  results.push({
    name: "robots-allows-oai-searchbot",
    pass: robots.includes("User-agent: OAI-SearchBot") && robots.includes("Allow: /"),
    detail: "OAI-SearchBot Allow: /",
  });
  results.push({
    name: "robots-blocks-private",
    pass:
      robots.includes("Disallow: /api/") &&
      robots.includes("Disallow: /dashboard/") &&
      robots.includes("Disallow: /seo-growth-console/") &&
      robots.includes("Disallow: /embed/"),
    detail: "private disallows present",
  });
  results.push({
    name: "robots-does-not-block-next",
    pass: !robots.includes("Disallow: /_next/"),
    detail: "no /_next/ block",
  });

  const page = buildPageSitemapEntries();
  const full = buildSitemapEntries();
  results.push({
    name: "sitemaps-https-or-test-origin",
    pass: [...page, ...full].every((e) => !e.loc.includes(":3000") && !e.loc.includes("www.")),
    detail: `${page.length} page + ${full.length} full`,
  });

  const stub = classifyUrl("/loan-calculator/usa");
  results.push({
    name: "country-stub-redirects",
    pass: stub.indexability === "redirect" && stub.redirectTarget === "/tools/loan-calculator",
    detail: `${stub.status} → ${stub.redirectTarget}`,
  });

  return results;
}

if (process.argv[1]?.includes("validate-indexability")) {
  void validateIndexability().then((rows) => {
    const failed = rows.filter((r) => !r.pass);
    for (const r of rows) console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}  ${r.detail}`);
    if (failed.length) process.exitCode = 1;
  });
}
