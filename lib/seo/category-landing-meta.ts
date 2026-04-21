import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export function categoryLandingMetadata(opts: {
  path: `/${string}`;
  title: string;
  description: string;
}): Metadata {
  const { path, title, description } = opts;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      type: "website",
      siteName: "Toollabz",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
