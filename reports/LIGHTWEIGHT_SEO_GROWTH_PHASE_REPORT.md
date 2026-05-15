# Lightweight SEO growth + content operations

**Date:** 2026-05-15  
**Scope:** Homepage “strategic picks” logic, rotating featured guides pin pool, breadcrumb blog link, CTR copy tweaks, operational checklist. No new AI systems, no homepage redesign, no heavy JS.

## Part 1 — Recently updated (implemented)

- **Before:** Tools sorted only by `freshnessRankForSlug` (pseudo-random hash), no cluster priority, duplicated slugs already shown in Popular / Major showcase.
- **After:** `getHomepageRecentlyUpdatedTools()` in `lib/homepage-content-surface.ts`:
  - Fills from **`RECENT_STRATEGIC_SLUG_ORDER`** (UK, Zakat, dev utilities, SaaS metrics, high-intent finance).
  - **Excludes** every slug in `POPULAR_TOOL_SLUGS` and `HOMEPAGE_MAJOR_SHOWCASE_SLUGS` so the same tool is not visible twice on the homepage.
  - **Backfill** uses `categoryStrategicScore` minus `freshnessRankForSlug` so ties and tail order shift when **`NEXT_PUBLIC_SITE_LAST_UPDATED` / default site stamp** changes (deterministic, not random per hit).

## Part 2 — Featured guide pins (implemented)

- **Pool:** `HOMEPAGE_FEATURED_GUIDE_PIN_POOL` (16 entries): UK pay, GST, JWT/JSON/SQL, ROAS/churn, fees, break-even/margin, developer pipelines.
- **Surface:** `getHomepageFeaturedGuidePins(6)` returns six articles sorted by `freshnessRankForSlug('blogpin:' + href)` so the **visible six changes when the site stamp changes** (same ops lever as tool rotation).
- **UI:** Section title **“Picked guides”** + one-line explanation; still pill links only (no carousel).

## Part 3 — Internal link freshness (implemented)

- Breadcrumb row: **Home > All tools > Categories > Blog** with `/blog` link for crawl and discovery.
- Strategic recent strip and guide pool bias **UK, developer, SaaS** URLs already aligned with hubs.

## Part 4 — CTR micro-copy (implemented)

- **Cluster section:** clearer hub benefit (UK tax, dev, SaaS, PDF).
- **Popular:** “High-intent” + explicit “related tools and matching guides.”
- **Strategic picks:** renamed from generic “Recently updated tools”; body explains dedupe vs Popular/Major and stamp-based rotation.
- **Major showcase:** shorter, FAQ/related-forward line.

## Part 5 — Content freshness workflow (operations)

### Weekly homepage refresh checklist

1. Bump **`NEXT_PUBLIC_SITE_LAST_UPDATED`** (or default in `lib/site-freshness.ts` when deploying) so **strategic tool strip** and **picked guides** re-rank.
2. Add any **new flagship slug** near the top of `RECENT_STRATEGIC_SLUG_ORDER` in `lib/homepage-content-surface.ts` (one-line edit).
3. Add **new pillar posts** to `HOMEPAGE_FEATURED_GUIDE_PIN_POOL` (keep pool 12–20 items).
4. In GSC: export **queries with rising impressions**; if a URL is a tool or blog you own, add an internal link from the matching hub or a related blog within the week.
5. Skim **Popular vs Major vs Strategic** on `/` in mobile view; ensure no accidental duplicate if slugs move between `popular-tools.ts` lists.

### Strategic rotation guidance

- Prefer **one hub per week** for editorial emphasis (e.g. UK week: add UK blog + move a UK tool up the strategic order list).
- **Stale replacement:** If a guide’s CTR collapses in GSC for 90 days, remove from pin pool or rewrite title/H2 on the article page first; do not stack competing guides on the same intent in the same six pills.

### Promoting rising GSC pages

- If a URL gains impressions with position **6–15**, add **one contextual link** from homepage-adjacent surfaces: hub page, related tool “Related” array, or a single sentence in an existing blog (avoid orphan link blocks).

## Part 6 — Search demand expansion (priorities only)

| Opportunity type | Example direction |
|------------------|-------------------|
| Long-tail FAQ | Add 1–2 FAQs on tools that already rank on page 2 for “calculator + jurisdiction”. |
| Supporting blog | One **comparison** (ROI vs ROAS, salary vs dividend) linking to 2–3 tools each. |
| Cluster reinforcement | `/uk-finance-tax` and `/developer-tools` intros linking to **new** tools within 7 days of launch. |

Focus on **high-intent** money and **UK/dev** where RPM and differentiation are strongest.

## Part 7 — Final growth summary

| Area | Strongest promoted pages (examples) |
|------|-------------------------------------|
| Tools | UK dividend/road tax, Zakat, CAC/LTV/churn, dev formatters, fee/marketing calculators (via strategic order + backfill). |
| Guides | GST vs VAT, UK pay mix, JWT playbooks, marketplace fees, break-even/margin, SQL/cron. |

**Stale areas:** Any slug removed from the codebase but left in `RECENT_STRATEGIC_SLUG_ORDER` is skipped silently; trim the list quarterly.

**CTR:** Strategic section naming + dedupe reduce “directory fatigue” and clarify why the row differs from Popular.

**Long-tail:** Tool pages with thin intros; add **one numeric example** + internal link to a guide.

**Clusters:** UK finance + developer + SaaS remain the highest-potential homepage-adjacent bets.

**Next blogs (ideas):** “Stripe Dashboard vs calculator sketch”, “UK dividend allowance snapshot”, “JSON Schema vs syntax validation” (only if gaps exist in current library).

**Next SEO priorities:** (1) Weekly stamp bump in deploy pipeline, (2) GSC rising-query → one internal link, (3) hub page H2 alignment with strategic slugs, (4) avoid increasing homepage card count.

## Files touched

- `lib/homepage-content-surface.ts` (new)
- `app/page.tsx`
- `tests/homepage-content-surface.test.ts` (new)
