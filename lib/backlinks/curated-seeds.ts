/** Curated high-intent domains by Toollabz category (seed list). */

export type BacklinkCategory =
  | "finance"
  | "pdf"
  | "ai"
  | "business"
  | "real-estate"
  | "tools"
  | "marketing"
  | "developer"
  | "utility";

export const CURATED_SEEDS: Record<BacklinkCategory, readonly string[]> = {
  finance: [
    "nerdwallet.com",
    "investopedia.com",
    "thebalancemoney.com",
    "bankrate.com",
    "money.usnews.com",
    "creditkarma.com",
    "wisebread.com",
    "financialmodelingprep.com",
    "personalfinancelab.com",
    "moneycrashers.com",
  ],
  tools: [
    "zapier.com",
    "producthunt.com",
    "alternativeto.net",
    "capterra.com",
    "g2.com",
    "saashub.com",
    "toolbox.com",
    "softwaresuggest.com",
  ],
  pdf: ["smallpdf.com", "adobe.com", "pdftables.com"],
  ai: ["aitools.fyi", "futurepedia.io", "theresanaiforthat.com", "toolify.ai"],
  business: [
    "entrepreneur.com",
    "inc.com",
    "forbes.com",
    "businessnewsdaily.com",
    "score.org",
    "sba.gov",
  ],
  "real-estate": ["biggerpockets.com", "fool.com", "realtor.com"],
  marketing: ["hubspot.com", "moz.com", "searchenginejournal.com"],
  developer: ["stackoverflow.blog", "dev.to", "smashingmagazine.com"],
  utility: ["lifehacker.com", "howtogeek.com"],
};

export function seedsForCategory(category: string): readonly string[] {
  const c = category as BacklinkCategory;
  if (c in CURATED_SEEDS) return CURATED_SEEDS[c];
  return CURATED_SEEDS.tools;
}

export function isSeedDomain(domain: string): boolean {
  const d = domain.replace(/^www\./i, "").toLowerCase();
  for (const list of Object.values(CURATED_SEEDS)) {
    if (list.some((x) => d === x || d.endsWith(`.${x}`) || d.endsWith(x))) return true;
  }
  return false;
}
