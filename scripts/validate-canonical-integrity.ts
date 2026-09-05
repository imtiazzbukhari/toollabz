import { tools } from "../lib/tools/data";
import { absoluteUrl, toolMetadata } from "../lib/seo";
import { buildHreflangPaths } from "../lib/i18n/hreflang";
import { LOCALIZED_TOOL_SLUGS } from "../lib/i18n/catalog";
import { localizePath } from "../lib/i18n/paths";

export type CheckResult = { name: string; pass: boolean; detail: string };

export function validateCanonicalIntegrity(): CheckResult[] {
  const results: CheckResult[] = [];
  const sample = tools.slice(0, 40);
  for (const tool of sample) {
    const meta = toolMetadata(tool);
    const expected = absoluteUrl(`/tools/${tool.slug}`);
    results.push({
      name: `canonical-${tool.slug}`,
      pass: meta.alternates?.canonical === expected,
      detail: String(meta.alternates?.canonical),
    });
    results.push({
      name: `no-port-${tool.slug}`,
      pass: !/toollabz\.com:3000/i.test(String(meta.alternates?.canonical)),
      detail: String(meta.alternates?.canonical),
    });
  }

  for (const slug of LOCALIZED_TOOL_SLUGS) {
    const map = buildHreflangPaths(`/tools/${slug}`);
    results.push({
      name: `hreflang-canonical-en-${slug}`,
      pass: map.en === `/tools/${slug}` && map.fr === localizePath(`/tools/${slug}`, "fr"),
      detail: `en=${map.en} fr=${map.fr}`,
    });
    results.push({
      name: `no-cross-language-en-canonical-${slug}`,
      pass: map.en !== map.fr,
      detail: "translated URL is distinct",
    });
  }

  return results;
}

if (process.argv[1]?.includes("validate-canonical-integrity")) {
  const rows = validateCanonicalIntegrity();
  const failed = rows.filter((r) => !r.pass);
  for (const r of rows) console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}  ${r.detail}`);
  if (failed.length) process.exitCode = 1;
}
