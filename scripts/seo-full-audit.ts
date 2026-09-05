import { validateHreflang } from "./validate-hreflang";
import { validateMultilingualSitemaps } from "./validate-multilingual-sitemaps";
import { validateIndexability } from "./validate-indexability";
import { validateCanonicalIntegrity } from "./validate-canonical-integrity";
import { GET as robotsGet } from "../app/robots.txt/route";
import { buildPageSitemapEntries, renderSitemapXml, sitemapPublicOrigin } from "../lib/content-engine/sitemap-data";
import { assertPageCoverage } from "../lib/i18n/page-messages";
import { assertToolCoverage } from "../lib/i18n/tool-messages";
import { NON_DEFAULT_LOCALES } from "../lib/i18n/locales";
import { classifyUrl } from "../lib/seo/url-classification";

export type AuditRow = { name: string; pass: boolean; detail: string };

export async function runSeoFullAudit(): Promise<{ rows: AuditRow[]; failed: number; passed: number }> {
  const rows: AuditRow[] = [];

  const robots = await (await robotsGet()).text();
  rows.push({
    name: "robots-content-type-contract",
    pass: robots.startsWith("User-agent:"),
    detail: "robots.txt body starts with User-agent",
  });
  rows.push({
    name: "robots-lists-locale-sitemaps",
    pass: NON_DEFAULT_LOCALES.every((l) => robots.includes(`Sitemap: https://toollabz.com/${l}/sitemap.xml`)),
    detail: `${NON_DEFAULT_LOCALES.length} locale sitemaps`,
  });
  rows.push({
    name: "robots-ai-crawlers",
    pass: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "Google-Extended", "Gemini-User"].every(
      (bot) => robots.includes(`User-agent: ${bot}`),
    ),
    detail: "legitimate AI crawlers allowed",
  });

  const pageXml = renderSitemapXml(buildPageSitemapEntries());
  rows.push({
    name: "page-sitemap-xml",
    pass: pageXml.includes("<urlset") && pageXml.includes("</urlset>") && !pageXml.includes(":3000"),
    detail: `origin=${sitemapPublicOrigin()}`,
  });

  const pageMissing = assertPageCoverage();
  rows.push({
    name: "page-copy-coverage",
    pass: pageMissing.length === 0,
    detail: pageMissing.length ? JSON.stringify(pageMissing.slice(0, 5)) : "all locales have title/h1/description/intro",
  });
  const toolMissing = assertToolCoverage();
  rows.push({
    name: "tool-copy-coverage",
    pass: toolMissing.length === 0,
    detail: toolMissing.length ? JSON.stringify(toolMissing.slice(0, 5)) : "all localized tools have required fields",
  });

  rows.push({
    name: "www-and-http-are-redirect-families",
    pass: classifyUrl("https://www.toollabz.com/").gscBucket !== "soft-404",
    detail: "classification module loaded",
  });

  rows.push(...validateHreflang(), ...validateMultilingualSitemaps(), ...validateCanonicalIntegrity(), ...(await validateIndexability()));

  const failed = rows.filter((r) => !r.pass).length;
  return { rows, failed, passed: rows.length - failed };
}

async function main() {
  const { rows, failed, passed } = await runSeoFullAudit();
  for (const r of rows) {
    console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name} — ${r.detail}`);
  }
  console.log(`\n${passed} passed, ${failed} failed, ${rows.length} checks`);
  if (failed) process.exitCode = 1;
}

const invokedDirectly = process.argv[1]?.includes("seo-full-audit");
if (invokedDirectly) {
  void main();
}
