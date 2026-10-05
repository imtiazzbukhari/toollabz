/**
 * Topical clusters used to order "related tools" by intent instead of catalog order.
 * Slugs are listed most-central first. Tools outside every cluster fall back to their
 * hand-written `related` list and then to same-hub peers (see lib/tools/related.ts).
 */
export type ToolCluster = {
  id: string;
  label: string;
  slugs: readonly string[];
};

export const TOOL_CLUSTERS: readonly ToolCluster[] = [
  {
    id: "uk-tax-pay",
    label: "UK tax and pay",
    slugs: [
      "salary-after-tax-calculator-uk",
      "self-employed-tax-calculator-uk",
      "dividend-tax-calculator-uk",
      "stamp-duty-calculator-uk",
      "working-days-calculator-uk",
      "vat-calculator",
    ],
  },
  {
    id: "uk-property-yield",
    label: "UK property yield",
    slugs: [
      "rental-yield-calculator-uk",
      "stamp-duty-calculator-uk",
      "property-roi-calculator",
      "mortgage-affordability-calculator",
      "rent-vs-buy-calculator",
    ],
  },
  {
    id: "small-business-margin-vat",
    label: "Small-business margin and VAT",
    slugs: [
      "profit-margin-calculator",
      "markup-calculator",
      "break-even-calculator",
      "vat-calculator",
      "invoice-generator",
      "invoice-late-fee-calculator",
      "discount-calculator",
    ],
  },
  {
    id: "australia-gst",
    label: "Australian GST",
    slugs: [
      "gst-calculator-australia",
      "invoice-late-fee-calculator",
      "invoice-generator",
      "profit-margin-calculator",
      "vat-calculator",
    ],
  },
  {
    id: "developer-json-jwt",
    label: "Developer JSON and JWT",
    slugs: [
      "json-formatter",
      "json-validator",
      "jwt-decoder",
      "jwt-expiry-checker",
      "base64-encoder-decoder",
      "unix-timestamp-converter",
      "json-minifier",
      "yaml-validator",
      "csv-to-json-converter",
      "regex-tester",
    ],
  },
];

export function clustersForTool(slug: string): ToolCluster[] {
  return TOOL_CLUSTERS.filter((c) => c.slugs.includes(slug));
}

/** Cluster peers for `slug`, ordered by cluster-then-centrality, excluding `slug` itself. */
export function clusterPeerSlugs(slug: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>([slug]);
  for (const cluster of clustersForTool(slug)) {
    for (const peer of cluster.slugs) {
      if (seen.has(peer)) continue;
      seen.add(peer);
      out.push(peer);
    }
  }
  return out;
}
