# Homepage authority upgrade - execution report

**Date:** 2026-05-15  
**Scope:** Homepage copy, cluster surfacing, featured showcase grid, SEO deep section, curated major-tool slugs. No full-site redesign, no new heavy client JS.

## Homepage improvement summary

- **Hero + metadata** already emphasize developer utilities, UK finance, SaaS metrics, GST, guides, and HTTPS (see `app/page.tsx` metadata and hero).
- **Major showcase section** fixed to use `majorShowcaseTools` from `HOMEPAGE_MAJOR_SHOWCASE_SLUGS` (was broken: referenced removed `authorityTools`). Section retitled **“Featured across strongest clusters”** with hub links to `/developer-tools`, `/uk-finance-tax`, `/business-tools`, directory CTA, and cluster-focused intro copy.
- **`HOMEPAGE_MAJOR_SHOWCASE_SLUGS`** now lists **12** cluster representatives, including **`working-days-calculator-uk`** for UK topical depth (`lib/tools/popular-tools.ts`).
- **`HomeSeoDeepSection`** rewritten away from generic “free online tools” toward niches, hubs, and `{guideCount}+` articles (`components/HomeSeoDeepSection.tsx`).

## Strongest homepage clusters (after pass)

1. **Developer** - JWT, JSON, SQL in the major grid + `/developer-tools`.  
2. **UK finance & tax** - UK salary, self-employed, working days + `/uk-finance-tax`.  
3. **Business & SaaS** - ROAS, Stripe fees, break-even + `/business-tools`.  
4. **GST (Australia)** - dedicated tool in showcase.  
5. **Core finance** - loan, VAT, currency converter bridging global intent.

## Weakest discoverability areas (remaining)

- **Hub vs. tool parity:** Some clusters are strong in `/tools` but could use one more above-the-fold link from homepage into **comparison / ultimate-guide** URLs if those routes exist as dedicated pages.  
- **“Recently updated”** is algorithmic; consider occasional **manual pin** for launches (content/config, not code-heavy).  
- **Featured guides** pill set is fixed; rotating 2–4 seasonally can improve crawl signals to new posts.

## Strongest backlink-ready assets (outreach / PR)

- **UK finance hub** (`/uk-finance-tax`) and flagship UK calculators (salary, self-employed, working days).  
- **Developer utilities** with reproducible “how to verify JWT / JSON / SQL” framing (link from blog JWT/JSON guides).  
- **SaaS metric explainers** paired with ROAS, Stripe fee, break-even tools.  
- **Long-form blog** (`/blog`) - cite specific pillar URLs in outreach, not only the homepage.

## Cluster visibility improvements (implemented)

- Major grid is **curated and scannable** (12 cards) instead of a long authority dump.  
- Deep section paragraphs **name hubs** and verticals explicitly for semantic relevance.

## CTR + engagement

- Clearer **H2** and **hub row** on the major section.  
- **“Browse the full directory”** line under the grid supports multi-page journeys.

## Keyword / positioning

- Homepage long copy stresses **UK finance**, **developer utilities**, **SaaS/business**, **GST Australia**, **PDF**, **AI as drafting**, and **article depth** without keyword stuffing.

## Authority flow

- Homepage → **hubs** (`/developer-tools`, `/uk-finance-tax`, `/business-tools`) → **tools** → **blog** is stated in both visible sections and `HomeSeoDeepSection`.

## Performance / UX

- No new animation libraries; layout is existing Tailwind patterns. **`npm test`** and **`npm run build`** completed successfully after changes.

## Strategic SEO gaps (qualitative - validate in SEMrush)

| Gap | Opportunity |
|-----|----------------|
| Low referring domains | Prioritize **linkable references** (tables, formulas, UK tax “sketch” disclaimers + methodology footers). |
| Thin keyword spread | **Cluster pillar pages** + internal links from homepage to **2–3 guides per cluster**. |
| Generic SERP for brand | Consistent title patterns: **Tool \| use case \| geography** on money pages. |
| Weak homepage authority | Keep **curated** homepage; push depth to **hubs + blogs** (avoid homepage bloat). |

## Quickest ranking-win hypotheses

- UK trio already on homepage: reinforce with **FAQ schema** and **internal links from blog** into the same three tools.  
- **GST vs VAT** style articles linking to `gst-calculator-australia` and UK tools.  
- **Developer** pages: capture “validator / decoder / formatter” long-tail with concise intros.

## Highest RPM (directional)

- Finance and **UK tax** calculators typically monetize well; surface them in **featured** and newsletter without crowding the hero.

## Next recommended SEO priorities

1. **Measurement:** Track homepage section CTR (Search Console + analytics events if available).  
2. **Content:** One **pillar update per month** per cluster (UK, dev, SaaS, GST).  
3. **Links:** Target **finance/dev newsletters** and **comparison roundups** with hub URLs.  
4. **Technical:** Ensure new hub URLs are in **sitemap** with stable `lastmod` where applicable (existing tests cover sitemap presence broadly).

## Files touched

- `app/page.tsx` - major showcase section completion.  
- `lib/tools/popular-tools.ts` - `HOMEPAGE_MAJOR_SHOWCASE_SLUGS` (12 slugs).  
- `components/HomeSeoDeepSection.tsx` - authority-aligned long copy.
