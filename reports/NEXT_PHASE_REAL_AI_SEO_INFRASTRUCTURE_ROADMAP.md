# Next Phase - Real AI + Real SEO Infrastructure

**Audience:** Engineering + product. **Not** marketing copy.  
**Baseline:** Current stack documented in `reports/AI_SYSTEM_FLOW_AUDIT.md` and `reports/GROWTH_CONSOLE_ENGINEERING_AUDIT.md`.  
**Principle:** No new “AI” labels on regex/templates. Every dashboard insight must **trace to stored facts** + **explainable scoring**.

---

## Current anchors in repo (extend, don’t ignore)

| Area | Today | Extend toward |
|------|--------|----------------|
| GSC | Service account JWT + `webmasters/v3/.../searchAnalytics/query` in `seo-ranking-engine.ts`; narrow `dimensions: ["query","page"]`, `rowLimit: 2500`, **writes `gsc-data.json`** | Full-site ingestion, time series, Postgres, anomaly detection |
| Performance aggregates | `loadPerformanceAggregates()` reads optional JSON (`CONTENT_ENGINE_PERFORMANCE_JSON` or default path) | Same schema fed by **ETL job** from APIs, not hand export |
| GA4 | Client `GaRouteTracker` + `gtag` events (`lib/analytics/gtag.ts`) | **Server** GA4 Data API for landing-page/query joins (different from client events) |
| LLM | Gemini blog (`llm-blog.ts`), Groq tool spec (`llm-groq.ts`), Claude backlinks (`anthropic-generate.ts`) | Same providers inside **reviewed workflows** + eval harness |
| Clusters | `TOPIC_CLUSTERS` static | Embeddings + vector retrieval + optional LLM labels |
| Internal links | Token overlap (`internal-linking.ts`, `authority-links.ts`) | Embedding similarity + graph constraints |
| Storage | JSON files under `lib/content-engine/**`, SQLite backlinks | Postgres + pgvector + queue |

---

## Part 1 - Real GSC + GA4 + Bing intelligence

### 1.1 Google Search Console (extend existing path)

**Already real API:** `fetchGoogleAccessToken()` + `refreshGscDataForSlugs` → Search Analytics `query`.

**Gaps vs “real OS”:**

- Only runs when caller passes `slugs[]`; merges to **file** `gsc-data.json`; **dimension pair** fixed; **14-day** window only; **no** historical snapshots for decay/growth.
- No **URL inspection** / indexing status API in this path (separate endpoint: `searchconsole.googleapis.com/v1/urlInspection.index:inspect`).

**Target architecture:**

1. **Ingestion jobs** (daily + optional hourly for high-traffic):

   - Job A: `dimensions: ["page"]`, `startDate/endDate` rolling 28d + 7d + previous period → store **page-level** impressions, clicks, CTR, position (weighted).
   - Job B: `dimensions: ["query","page"]` with pagination (`startRow`) until cap or stable - store **query–page** facts.
   - Job C (weekly): `dimensions: ["page","country"]` or device if needed for internationalization strategy.

2. **Postgres tables (minimal):**

   - `gsc_page_daily(site, date, page, impressions, clicks, ctr, position)`
   - `gsc_query_page_daily(site, date, query, page, impressions, clicks, ctr, position)`
   - Unique constraints + indexes on `(site, date, page)` and `(site, date, query, page)`.

3. **Opportunity detection (SQL + small TS layer):**

   | Signal | Rule (example) |
   |--------|----------------|
   | Near page 1 | `position` between **8–15** and impressions > N |
   | High impressions + low CTR | impressions > P90 site-wide **and** CTR < median for same intent bucket |
   | Declining | 28d vs prior 28d **delta** on clicks/impressions at page level |
   | Rising | inverse |
   | Cannibalization | same **query** maps to **≥2 URLs** with material clicks; or multiple URLs same intent cluster (after Part 2) |
   | Indexing anomaly | URL Inspection batch for URLs that lost impressions week-over-week (cost/limit aware) |

4. **Replace / complement** `aggregates.json` import: ETL writes the **same shape** `loadPerformanceAggregates()` expects **or** change loader to read from DB view - single migration step.

**Env:** reuse `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`, `GSC_SITE_URL`; add `GSC_SITE_PROPERTY` if you use Domain property URL form consistently.

**Complexity:** **M–L** (3–6 eng-weeks) for ingestion + schema + basic detectors + dashboard wiring.

---

### 1.2 GA4 (new server path)

**Today:** Client-side GA4 via gtag - good for **product analytics**, weak for **SEO operating system** (sampling, client blockers, no query dimension).

**Add:** **Google Analytics Data API** (`analyticsdata.googleapis.com/v1beta:runReport`):

- Property ID `GA4_PROPERTY_ID`.
- Auth: same service account if GA4 has **Viewer** on property, or OAuth for internal tools.
- Reports: `landingPage+sessionMedium` or `pagePath` + `sessionGoogleOrganicSearch` filter; metrics `sessions`, `engagedSessions`, `averageSessionDuration`, `conversions` (if configured).

**Join model:**

- Join **GSC page** ↔ **GA4 pagePath** on normalized path (strip host, handle trailing slash).
- Store `ga4_page_daily` parallel to GSC for “SEO sessions vs GSC clicks” divergence (indexing vs engagement).

**Complexity:** **M** (2–4 eng-weeks) including path normalization + backfill job.

---

### 1.3 Bing Webmaster API

**New:** Bing Webmaster **Submit / Query** APIs (Microsoft):

- Typical flow: API key from Bing Webmaster → query stats and/or keyword research endpoints (Microsoft documents change; implement against current **GetQueryStats** / traffic APIs).
- Store `bing_page_daily` / `bing_query_page_daily` analogous to GSC.

**Value:** Second search engine signal; useful when Google-only pipeline blinds you to Bing crawl/index issues.

**Complexity:** **S–M** (1–3 eng-weeks) depending on API surface and auth method.

---

## Part 2 - Real cluster engine

**Replace:** static `TOPIC_CLUSTERS` as the **sole** definition of “cluster.”

**Keep:** `TOPIC_CLUSTERS` as **seed labels** or “editorial pillars” merged with learned clusters (humans still override).

### 2.1 Recommended stack (opinionated)

| Option | When to use | Notes |
|--------|-------------|--------|
| **Postgres + pgvector** | You already plan Postgres (Part 8); one DB for facts + vectors | Operational simplicity; tune IVFFlat/HNSW per pg version |
| **Qdrant / Pinecone** | Very large vector corpora or separate ML team | Extra infra cost + sync from Postgres |
| **Chroma** | Prototyping only | Easy locally; weaker ops story at scale |

**Recommendation:** **Postgres + pgvector** for Toollabz unless document count explodes past comfortable single-DB scale.

### 2.2 Embedding pipeline

1. **Corpus:** canonical text per entity - tool: `name + description + keywords + FAQ text`; blog: title + excerpt + H2 outline if stored; query: from GSC `gsc_query_page_daily`.
2. **Model:** text-embedding-3-small (OpenAI) **or** `text-embedding-004` (Google) **or** open `nomic-embed` via self-host - pick one and **version** the model id in DB.
3. **Store:** `content_embedding(entity_type, entity_id, model, vector, text_hash, updated_at)`.
4. **Clustering:**

   - **Online:** assign new page to nearest **pillar** centroid (k seeded from editorial pillars + k-means on tools).
   - **Batch:** weekly HDBSCAN / agglomerative on sample for “topic discovery” - output `cluster_id` + confidence.

5. **Intent:** separate classifier - lightweight **LLM batch** (Gemini) with strict JSON schema **or** fine-tuned small model; store `intent_label` per query cluster.

**Complexity:** **L** (6–12 eng-weeks) for v1 vectors + retrieval API + dashboard cluster view + migration from static scoring.

---

## Part 3 - Real internal link engine

**Today:** `suggestInternalLinks` token overlap + `authority-links` pillar/cluster string match.

**Target:**

1. **Candidate generation:** top-k similar entities by **cosine** in pgvector (same embedding model as Part 2).
2. **Constraints:** same-site only; exclude already-linked URLs in body if HTML parse available; **anchor diversity** cap per target page.
3. **Authority flow:** PageRank-style on internal graph **or** simpler: boost targets with high GSC clicks + low internal in-degree (true orphans).
4. **Output:** structured rows `{ source_path, target_path, suggested_anchor, score, reason_codes[] }` - `reason_codes` must be machine-readable (e.g. `SIMILARITY`, `SAME_CLUSTER`, `ORPHAN_RESCUE`).

**Human gate:** suggestions never auto-insert into production TSX/MDX without PR.

**Complexity:** **M** (3–5 eng-weeks) after embeddings exist; **S** more if only “similarity only” without graph.

---

## Part 4 - Real content quality system

**Today:** `quality-score.ts` = regex, length, headings, robotic phrases - useful **gate**, not “semantic quality.”

**Target layered scorer:**

| Layer | Mechanism | Cost |
|-------|-----------|------|
| L0 | Keep current heuristics as **fast fail / hygiene** | Low |
| L1 | **Embeddings:** coverage vs target cluster centroid + “missing section” = cosine gap to best-in-class exemplar set | Medium |
| L2 | **NLP:** language-specific readability (syllable-based or `readability` lib), duplication (MinHash simhash vs corpus) | Medium |
| L3 | **LLM judge** (Gemini): rubric-scored JSON `{ topical_depth, intent_match, snippet_fit, entity_coverage, repetition_risk }` with **temperature 0** + **fixed schema**; run on PR only or nightly on drafts | $ + latency |

**Storage:** `content_quality_report(entity_id, version, scores jsonb, model, created_at)`.

**Complexity:** **M–L** (4–8 eng-weeks) for L1–L3 with eval set and regression tests.

---

## Part 5 - Real content workflows

**Today:** artifacts in `generated/`, SEO console keyword modal, no formal state machine.

**Target:**

1. **States:** `draft` → `llm_review` → `editor_review` → `approved` → `published` (terminal).
2. **Queue table:** `content_jobs(id, type, payload, status, quality_flags, assignee, created_at, …)`.
3. **Workers:** dequeue → call Gemini/Groq → write versioned artifact → attach `quality_report` → set flags.
4. **Publish pipeline:** still **Git PR** for static site (safest) **or** headless CMS later - avoid silent prod writes from serverless.

**Complexity:** **L** (6–10 eng-weeks) with UI in SEO console + notifications.

---

## Part 6 - Remove / relabel fake AI

**Scope:** `lib/tools/engine.ts` cases for `ai-*` slugs (see AI audit).

**Policy:**

| Tier | Action |
|------|--------|
| A - Keep name, **upgrade** | Wire to **Groq or Gemini** with strict JSON + moderation + rate limit; cache by input hash; show “Generated with {model} - verify facts.” |
| B - **Relabel UI** only | Rename to “Template assistant” / “Pattern-based draft” in `data.ts` `name` / `shortDescription` + tool page copy; **no** API spend. |
| C - **Deprecate** | Redirect slug to blog guide or merge into one honest “writing assistants” tool |

**Minimum compliance (fast):** Tier B for all `ai-*` that remain template-only **before** any model spend.

**Complexity:** **S** (days) for copy + metadata; **M** per tool for real LLM upgrade.

---

## Part 7 - Backlink intelligence

**Today:** SerpAPI seeds (`serp-search.ts`), SQLite prospects, Claude content generation - **no** Majestic/Ahrefs-style graph.

**Add (API-backed where budget allows):**

| Capability | Typical provider class | Notes |
|------------|------------------------|--------|
| Link index / competitor gap | Moz, Ahrefs, Semrush, DataForSEO | Contract + compliance; store raw links in Postgres |
| Domain authority proxy | Same APIs or **Tranco** lists for relative rank | Cheaper than full index |
| Prioritization score | `w1*relevance(embed) + w2*authority + w3*traffic_potential - w4*spam` | Explainable |

**Complexity:** **M–L** depending on vendor + ingestion volume.

---

## Part 8 - Data infrastructure

### 8.1 Migration phases (JSON → Postgres)

| Phase | Scope | Risk |
|-------|--------|------|
| P0 | New DB + **read replicas** of metrics only; dashboard reads DB **fallback** JSON | Low |
| P1 | Move `gsc_*`, `ga4_*`, `bing_*`, `content_jobs`, `content_embedding` | Medium |
| P2 | Move outreach + execution logs from SQLite/JSON **or** sync SQLite → PG | Medium |
| P3 | Retire multi-instance JSON writes for console config; use PG row + optimistic locking | High (needs migration script) |

### 8.2 Job queue

- **BullMQ + Redis** or **Cloud Tasks** (GCP) / **SQS** (AWS) - match your host.
- Workers: separate process from Next server; idempotent job keys.

### 8.3 Caching

- Redis for **API response cache** (GSC/GA4 quotas) with TTL keyed by `(api, date_range, dimensions_hash)`.

**Technical debt warning:** `execSync` PR scripts from SEO console **do not** belong on serverless workers long-term - replace with queue job that runs in CI runner with git credentials.

---

## Part 9 - Real SEO operating system (dashboard contract)

Every widget must satisfy:

1. **Trace:** `insight_id` → SQL row(s) or job log with `source_ref` (e.g. `gsc_page_daily:2026-05-10:/tools/loan-calculator`).
2. **Explain:** `reason_codes[]` + human sentence template filled from numbers.
3. **Act:** button → creates `content_job` or opens GitHub issue / PR template - **no** no-op `run_audit` mapping.

**Refactor order:** wire **GSC page facts** first (highest trust), then **opportunities**, then **semantic** layers.

---

## Part 10 - Deliverables requested

### 10.1 Migration roadmap (phased)

| Quarter | Milestone |
|---------|-----------|
| **Q1** | Postgres + nightly GSC full-page + query-page ETL; GA4 daily landing report; dashboard reads DB; relabel fake `ai-*` copy |
| **Q2** | pgvector + embeddings for tools/blogs; semantic link suggestions v1; quality L1 |
| **Q3** | Content job queue + review states; LLM judge L3 on PR; Bing ingest |
| **Q4** | Backlink vendor integration + gap analysis; optional URL Inspection batch; retire JSON hot paths |

### 10.2 Infrastructure plan (minimal production)

- **Postgres 15+** with `pgvector`
- **Redis** (queue + cache)
- **Worker service** (Node or Python) - same repo monorepo `apps/worker` optional
- **Secrets:** GCP Secret Manager / AWS Secrets Manager - not `.env` on multi-instance
- **Observability:** OpenTelemetry traces on API jobs; job failure alerts

### 10.3 Estimated complexity (T-shirt)

| Initiative | T-shirt | Eng-weeks (indicative) |
|------------|---------|-------------------------|
| GSC ETL + detectors + DB | L | 4–8 |
| GA4 join | M | 2–4 |
| Bing | S–M | 1–3 |
| Embeddings + pgvector + cluster v1 | L | 6–12 |
| Semantic internal links | M | 3–6 |
| Quality L1–L3 | L | 4–10 |
| Workflow queue + UI | L | 6–12 |
| Relabel `ai-*` | S | 0.5–2 |
| Upgrade selected `ai-*` to LLM | M each | 2–4 each |
| Backlink API intelligence | L | 6–12 |
| Retire JSON race paths | M | 3–6 |

### 10.4 Feature priority matrix (impact × feasibility)

**Rank 1 - Do first (high SEO impact, builds foundation):**

1. GSC full ingestion + time series + **near-page-1** + **high imp / low CTR** (extends existing API code).
2. Postgres for metrics + dashboard traceability.
3. Relabel template `ai-*` (trust + legal clarity).

**Rank 2:**

4. GA4 join for landing engagement vs GSC clicks.  
5. Content job queue + draft states (unlocks safe LLM scale).  
6. pgvector + embeddings for tools + blogs.

**Rank 3:**

7. Semantic internal links + orphan detection.  
8. LLM-assisted quality judge on PR.  
9. Bing.

**Rank 4 (expensive / vendor):**

10. Commercial backlink index APIs + gap analysis.

### 10.5 Technical debt warnings

- **Serverless + filesystem JSON** = lost updates under concurrency - **must** exit for any collaborative workflow.
- **LLM without eval harness** = quality regression you cannot detect - add golden set + diff tests before scaling auto-gen.
- **Auto-publish to production** from dashboard = security + SEO catastrophe - keep PR-based publish until CMS exists.
- **Embedding model changes** invalidate clusters - store `model_version` per vector row and re-embed batch jobs.

---

## Summary sentence

Ship **measurable ingestion (GSC + GA4 + DB)** and **honest labeling** first; then **vectors** for clusters and links; then **workflow + LLM judges** - that order maximizes real SEO leverage and avoids another layer of decorative “AI.”

---

*Document version: 1.0 - roadmap only; no runtime behavior changed by this file.*
