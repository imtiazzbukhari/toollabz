import { randomUUID } from "node:crypto";
import { seedsForCategory, isSeedDomain, type BacklinkCategory } from "@/lib/backlinks/curated-seeds";
import { enrichUrl } from "@/lib/backlinks/enrich-url";
import { hostFromUrl, queriesForCategory, serpApiSearch } from "@/lib/backlinks/serp-search";
import {
  domainHasProhibitedTld,
  estimateDrFromHost,
  QUALITY_GATES,
  scoreProspect,
  textHasProhibitedKeywords,
} from "@/lib/backlinks/quality-gates";
import { getBacklinksDb, insertProspect } from "@/lib/db/backlinks-db";

function domainExists(domain: string): boolean {
  const row = getBacklinksDb().prepare("SELECT 1 as x FROM prospects WHERE domain = ? LIMIT 1").get(domain) as { x?: number } | undefined;
  return Boolean(row);
}

function inferPageType(url: string, snippet: string): "write_for_us" | "resource_page" | "tool_directory" {
  const t = `${url} ${snippet}`.toLowerCase();
  if (t.includes("write for us") || t.includes("guest post") || t.includes("contributor")) return "write_for_us";
  if (t.includes("directory") || t.includes("submit") || t.includes("product hunt") || t.includes("alternative")) {
    return "tool_directory";
  }
  return "resource_page";
}

const MAX_NEW_PER_RUN = 28;

export type FindProspectsResult = {
  added: number;
  seeded_initial: number;
  skipped_low_score: number;
  serp_used: boolean;
  serpNotice: string | null;
};

export async function runProspectFinder(category: string, analyzeLimit = 40): Promise<FindProspectsResult> {
  const cat = (category || "tools") as BacklinkCategory;
  let added = 0;
  let seededInitial = 0;
  let skippedLowScore = 0;
  const serpKey = process.env.SERPAPI_KEY?.trim();
  const serpUsed = Boolean(serpKey);
  const serpNotice = serpUsed ? null : "Add SERPAPI_KEY for Google discovery";

  const unique = new Map<string, { domain: string; fullUrl: string; page_type: "write_for_us" | "resource_page" | "tool_directory"; fromSeed: boolean }>();

  for (const domain of seedsForCategory(cat)) {
    if (!unique.has(domain)) unique.set(domain, { domain, fullUrl: `https://${domain}/`, page_type: "resource_page", fromSeed: true });
  }

  if (serpKey) {
    for (const q of queriesForCategory(cat)) {
      const organic = await serpApiSearch(q);
      for (const o of organic) {
        const link = o.link;
        if (!link) continue;
        const host = hostFromUrl(link);
        if (!host || domainHasProhibitedTld(host)) continue;
        if (!unique.has(host)) {
          unique.set(host, { domain: host, fullUrl: link, page_type: inferPageType(link, o.snippet ?? ""), fromSeed: false });
        }
      }
    }
  }

  let analyzed = 0;
  for (const c of unique.values()) {
    if (added >= MAX_NEW_PER_RUN) break;
    if (analyzed >= analyzeLimit) break;
    analyzed++;
    if (domainExists(c.domain)) {
      continue;
    }
    const enriched = await enrichUrl(c.fullUrl);
    if (textHasProhibitedKeywords(enriched.sampleText)) {
      skippedLowScore++;
      continue;
    }
    const inSeed = isSeedDomain(c.domain);
    const dr = estimateDrFromHost(c.domain, inSeed);
    const { score, rejectionReason } = scoreProspect({
      domain: c.domain,
      inSeedList: inSeed,
      hasWriteForUs: enriched.hasWriteForUs || c.page_type === "write_for_us",
      hasResourcesPage: enriched.hasResourcesPage || c.page_type !== "write_for_us",
      contactEmail: enriched.contactEmail,
      pageHtmlSample: enriched.sampleText,
    });
    if (rejectionReason || score < QUALITY_GATES.minProspectScoreToShow) {
      skippedLowScore++;
      continue;
    }
    const status = "new";
    insertProspect({
      id: randomUUID(),
      domain: c.domain,
      full_url: c.fullUrl,
      dr_estimate: dr,
      category: cat,
      has_write_for_us: enriched.hasWriteForUs || c.page_type === "write_for_us" ? 1 : 0,
      has_resources_page: enriched.hasResourcesPage || c.page_type !== "write_for_us" ? 1 : 0,
      contact_email: enriched.contactEmail,
      page_type: c.page_type,
      status,
      quality_score: score,
      quality_rejection_reason: null,
      notes: "",
      page_title: enriched.title,
      meta_description: enriched.metaDescription,
    });
    added++;
    if (c.fromSeed) seededInitial++;
  }

  return {
    added,
    seeded_initial: seededInitial,
    skipped_low_score: skippedLowScore,
    serp_used: serpUsed,
    serpNotice,
  };
}
