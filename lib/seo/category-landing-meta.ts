import type { Metadata } from "next";
import { absoluteUrl, TOOL_PAGE_TITLE_SUFFIX } from "@/lib/seo";
import { hreflangLanguages } from "@/lib/i18n/metadata";

function withBrandSuffix(title: string): string {
  const t = title.trim();
  return t.includes("Toollabz") ? t : `${t}${TOOL_PAGE_TITLE_SUFFIX}`;
}

export function categoryLandingMetadata(opts: {
  path: string;
  title: string;
  description: string;
}): Metadata {
  const { path, title, description } = opts;
  const fullTitle = withBrandSuffix(title);
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path, languages: hreflangLanguages(path) },
    openGraph: {
      title: fullTitle,
      description,
      url: absoluteUrl(path),
      type: "website",
      siteName: "Toollabz",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
