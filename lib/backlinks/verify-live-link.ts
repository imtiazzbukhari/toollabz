import { randomUUID } from "node:crypto";
import { QUALITY_GATES } from "@/lib/backlinks/quality-gates";
import { assertPublicHttpUrl } from "@/lib/backlinks/url-safety";
import {
  getProspect,
  upsertLiveLink,
  liveLinksForDomain,
  liveLinksThisMonthCount,
  updateProspect,
} from "@/lib/db/backlinks-db";

export type VerifyLiveLinkResult =
  | { ok: true; found: true; message: string }
  | { ok: true; found: false; message: string }
  | { ok: false; reason: string };

export async function verifyAndRecordLiveLink(opts: {
  prospectId: string;
  liveUrl: string;
  /** Manual 1–10 relevance score. Default 8. Must be ≥ minRelevanceScore. */
  relevance?: number;
  drOverride?: number | null;
  anchorOverride?: string | null;
  /** 1 = dofollow, 0 = nofollow */
  dofollowOverride?: number;
}): Promise<VerifyLiveLinkResult> {
  let safeUrl: string;
  try {
    safeUrl = assertPublicHttpUrl(opts.liveUrl).toString();
  } catch {
    return { ok: false, reason: "Invalid or disallowed URL." };
  }
  const p = getProspect(opts.prospectId);
  if (!p) return { ok: false, reason: "Prospect not found." };
  const relevance = typeof opts.relevance === "number" ? opts.relevance : 8;
  if (relevance < QUALITY_GATES.minRelevanceScore) {
    return { ok: false, reason: `Relevance must be ≥ ${QUALITY_GATES.minRelevanceScore}.` };
  }
  if (liveLinksThisMonthCount() >= QUALITY_GATES.maxLinksPerMonth) {
    return { ok: false, reason: `Monthly live link cap (${QUALITY_GATES.maxLinksPerMonth}) reached.` };
  }
  const domainKey = p.domain.replace(/^www\./i, "").toLowerCase();
  if (liveLinksForDomain(domainKey) >= QUALITY_GATES.maxLinksPerDomain) {
    return { ok: false, reason: `Max live links per domain (${QUALITY_GATES.maxLinksPerDomain}) reached for ${p.domain}.` };
  }

  let html = "";
  try {
    const res = await fetch(safeUrl, {
      headers: { "User-Agent": "ToollabzLinkCheck/1.0 (+https://toollabz.com)" },
      signal: AbortSignal.timeout(12000),
    });
    html = await res.text();
  } catch {
    return { ok: true, found: false, message: "Could not fetch the page yet - try again later." };
  }

  const lower = html.toLowerCase();
  const found = lower.includes("toollabz.com") || lower.includes("www.toollabz.com") || /\btoollabz\b/.test(lower);
  if (!found) {
    return { ok: true, found: false, message: "Not found yet - toollabz.com not detected on that page." };
  }

  const today = new Date().toISOString().slice(0, 10);
  const ts = new Date().toISOString();
  upsertLiveLink({
    id: randomUUID(),
    prospect_id: opts.prospectId,
    source_url: safeUrl,
    dr: opts.drOverride ?? p.dr_estimate,
    type: p.page_type,
    anchor: opts.anchorOverride ?? null,
    dofollow: typeof opts.dofollowOverride === "number" ? opts.dofollowOverride : 1,
    relevance,
    date_live: today,
    date_lost: null,
    created_at: ts,
    updated_at: ts,
  });
  updateProspect(opts.prospectId, { status: "live" });
  return { ok: true, found: true, message: "Link verified - toollabz.com found on page." };
}
