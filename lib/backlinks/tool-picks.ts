import { tools } from "@/lib/tools/data";

const SLUG_HINTS: Record<string, string[]> = {
  finance: ["emi-calculator", "loan-calculator", "mortgage-calculator", "vat-calculator"],
  pdf: ["pdf-merge", "pdf-split", "pdf-compress"],
  ai: ["ai-content-humanizer", "ai-email-subject-generator"],
  business: ["roi-calculator", "break-even-calculator"],
  marketing: ["roi-calculator-marketing", "cpm-calculator"],
  "real-estate": ["mortgage-calculator", "rent-vs-buy-calculator"],
  developer: ["json-formatter", "base64-encoder"],
  utility: ["unit-converter", "percentage-calculator"],
  tools: ["pdf-merge", "emi-calculator"],
};

export function pickToolForCategory(category: string): { url: string; name: string; description: string } {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://toollabz.com").replace(/\/$/, "");
  const hints = SLUG_HINTS[category] ?? SLUG_HINTS.tools;
  for (const slug of hints) {
    const t = tools.find((x) => x.slug === slug);
    if (t) {
      return {
        url: `${base}/tools/${t.slug}`,
        name: t.name,
        description: t.shortDescription ?? t.description,
      };
    }
  }
  const fallback = tools[0];
  return {
    url: `${base}/tools/${fallback.slug}`,
    name: fallback.name,
    description: fallback.shortDescription ?? fallback.description,
  };
}
