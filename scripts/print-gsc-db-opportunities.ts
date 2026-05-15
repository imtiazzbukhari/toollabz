/**
 * Emit Markdown from Postgres-backed GSC opportunities (real ingested data).
 * Requires DATABASE_URL, GSC_SITE_URL (must match gsc_page_daily.site_url), and populated gsc_page_daily.
 *
 * Usage: DATABASE_URL=... GSC_SITE_URL='sc-domain:example.com' npx tsx scripts/print-gsc-db-opportunities.ts
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { closeSeoPool } from "../lib/db/seo-postgres";
import { suggestSerpVariantsForPage } from "../lib/content-engine/growth/ctr-suggestions";
import type { GscPageMetric } from "../lib/content-engine/performance/types";
import { loadGa4GscJoinLast28d } from "../lib/content-engine/seo-metrics/merge-performance";
import type { SeoOpportunityRow } from "../lib/content-engine/seo-metrics/real-opportunities";
import { computeSeoOpportunitiesFromDb, loadRecentSeoIngestStatus } from "../lib/content-engine/seo-metrics/real-opportunities";

const OUT = path.join(process.cwd(), "reports", "gsc-db-opportunities.md");

function appendEditorialRecommendations(o: SeoOpportunityRow, lines: string[]) {
  if (!o.path) return;
  lines.push("- **Editorial recommendations (human review):**");
  if (o.kind === "high_impressions_low_ctr") {
    lines.push(
      `  - **Title/meta**: test one variant in GSC; align primary keyword with top query in Performance → Pages → ${o.path}.`,
    );
    lines.push("  - **FAQ**: add two questions copied from actual search queries (wording), each answered in ≤55 words.");
    lines.push("  - **Headings**: ensure first H2 matches the dominant intent phrase; avoid duplicate H2s across sibling URLs.");
    lines.push("  - **Internal links**: one link up to the nearest hub + one sideways link to a calculator or guide that completes the task.");
  } else if (o.kind === "near_page_one") {
    lines.push("  - **Depth**: add a comparison table or worked example block; keep claims bounded with disclaimers where needed.");
    lines.push("  - **Internal links**: two inbound references from cluster hubs or high-crawl posts edited this month.");
    lines.push("  - **Snippet**: add a concise definition sentence in the first 120 words to win definition-style SERPs.");
  } else if (o.kind === "declining_clicks") {
    lines.push("  - **Refresh**: update `dateModified`, check top queries for position drift, and patch outdated examples.");
    lines.push("  - **Competitors**: open top 3 SERP results; close obvious content gaps without copying.");
  } else if (o.kind === "rising_clicks") {
    lines.push("  - **Double down**: add one supporting article that links in with a varied anchor; avoid changing URL/slug.");
  } else if (o.kind === "cannibalization") {
    lines.push(`  - **Primary URL**: choose one winner for query “${o.query ?? ""}”; demote overlapping headings on secondary URLs.`);
    lines.push("  - **Cross-links**: clarify user journeys so each URL has a distinct job-to-be-done.");
  } else {
    lines.push("  - **General**: align on-page H1, meta, and first paragraph with the same promise; add FAQ only if queries support it.");
  }
  lines.push("");
}

function appendExecutionPlaybook(lines: string[]) {
  lines.push("## Execution playbook (editorial)", "");
  lines.push("1. **Low CTR (high impressions)**: run title/meta variants in GSC; add 1-2 FAQs that match query wording; tighten H1 alignment with top queries.");
  lines.push("2. **Near page one (pos 8-20)**: add internal links from the closest hub + one related blog; expand worked examples and comparison tables.");
  lines.push("3. **Rising clicks**: protect the URL (avoid unnecessary refactors); add supporting posts that link in with varied anchors.");
  lines.push("4. **Declining clicks**: check query-level position changes; refresh dateModified where facts changed; compare SERP competitors.");
  lines.push("5. **Cannibalization**: pick a primary URL per query cluster; demote duplicate headings on secondary pages; cross-link intentionally.");
  lines.push("6. **Weak engagement (GA4)**: shorten intros, move the calculator above the fold, add jump links, reduce friction fields.");
  lines.push("");
}

async function main() {
  const lines: string[] = [];
  lines.push("# GSC + GA4 execution report (Postgres data plane)", "");
  lines.push(`_Generated ${new Date().toISOString()}_`, "");

  if (!process.env.DATABASE_URL?.trim()) {
    lines.push("**DATABASE_URL** is not set. Point it at the SEO Postgres instance, run ingestion, then rerun this script.");
    writeOut(lines.join("\n"));
    return;
  }
  if (!process.env.GSC_SITE_URL?.trim()) {
    lines.push(
      "**GSC_SITE_URL** is not set. It must match `gsc_page_daily.site_url` exactly (for example `sc-domain:toollabz.com` or `https://www.toollabz.com/` depending on your property).",
    );
    writeOut(lines.join("\n"));
    return;
  }

  const status = await loadRecentSeoIngestStatus();
  lines.push("## Recent ingest status", "", "```json", JSON.stringify(status, null, 2), "```", "");

  const opportunities = await computeSeoOpportunitiesFromDb();
  if (!opportunities.length) {
    lines.push(
      "_No GSC opportunity rows returned (sparse window, thresholds, or empty `gsc_page_daily`)._",
      "",
    );
  } else {
    lines.push(`## GSC opportunity queue (${opportunities.length})`, "");

    for (const o of opportunities) {
      lines.push(`### ${o.kind}: ${o.title}`, "");
      if (o.path) lines.push(`- **Path**: \`${o.path}\``);
      if (o.query) lines.push(`- **Query**: ${o.query}`);
      lines.push(`- **Metrics**: \`${JSON.stringify(o.metrics)}\``);
      lines.push(`- **Evidence**: ${o.evidence.windowCurrent}${o.evidence.windowPrevious ? ` (prev ${o.evidence.windowPrevious})` : ""}`);
      if (o.evidence.note) lines.push(`- **Note**: ${o.evidence.note}`);
      lines.push(`- **Action**: ${o.suggestedAction}`);

      if ((o.kind === "high_impressions_low_ctr" || o.kind === "near_page_one") && o.path) {
        const metric: GscPageMetric = {
          path: o.path,
          clicks: Number(o.metrics.clicks ?? 0),
          impressions: Number(o.metrics.impressions ?? 0),
          position:
            typeof (o.metrics as { avgPosition?: unknown }).avgPosition === "number"
              ? (o.metrics as { avgPosition: number }).avgPosition
              : undefined,
        };
        const variants = suggestSerpVariantsForPage(metric);
        if (variants?.length) {
          lines.push("- **CTR / snippet copy lab** (editorial only):");
          for (const v of variants) {
            lines.push(`  - **${v.variant}** title: ${v.title}`);
            lines.push(`    meta: ${v.metaDescription}`);
          }
        } else {
          lines.push(
            "- **Snippet ideas**: add FAQ blocks that mirror top queries; tighten meta to a single promise + one proof point; link to a hub for context.",
          );
        }
      }
      appendEditorialRecommendations(o, lines);
    }
  }

  const ga4Prop = process.env.GA4_PROPERTY_ID?.trim();
  if (!ga4Prop) {
    lines.push("## GA4 join (optional)", "", "_Set **GA4_PROPERTY_ID** (numeric id) to populate weak-engagement rows from `ga4_landing_daily`._", "");
  } else {
    const join = await loadGa4GscJoinLast28d();
    const weak = join.filter(
      (r) =>
        r.ga4OrganicSessions >= 25 &&
        r.gscImpressions >= 120 &&
        r.engagementRate != null &&
        r.engagementRate < 0.42,
    );
    lines.push("## Weak on-site engagement (GA4 joined with GSC, last 28d)", "");
    lines.push(
      "_Sorted by impressions. Low engagement rate with material traffic usually means intent mismatch, slow UX, or content burying the tool._",
      "",
    );
    if (!weak.length) {
      lines.push("_No rows matched the weak-engagement heuristic._", "");
    } else {
      for (const r of weak.slice(0, 25)) {
        lines.push(
          `- \`${r.path}\`: impressions ${r.gscImpressions}, clicks ${r.gscClicks}, sessions ${Math.round(r.ga4OrganicSessions)}, engagement ${r.engagementRate != null ? (r.engagementRate * 100).toFixed(1) : "n/a"}%`,
        );
        lines.push(
          `  - **Try**: move primary CTA/tool link higher; add FAQ for the top query; trim intro; add internal links from a relevant hub.`,
        );
      }
      lines.push("");
    }
  }

  appendExecutionPlaybook(lines);

  writeOut(lines.join("\n"));
  await closeSeoPool().catch(() => {});
}

function writeOut(md: string) {
  writeFileSync(OUT, md, "utf8");
  console.log(`Wrote ${OUT}`);
}

void main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
