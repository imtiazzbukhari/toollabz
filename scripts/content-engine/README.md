# Content engine — safe PR pipelines

These scripts automate **pull requests only**. Nothing is pushed to `main` without review.

## Blog PR (`create-blog-pr.mjs`)

1. Calls `GET {SITE_URL}/api/content-engine/cron-daily` (auth: `x-toollabz-secret`).
2. Takes the top `stats.prioritized[0]` opportunity.
3. Calls `POST {SITE_URL}/api/generate-blog` with `topic` / `primaryKeyword`.
4. If `result.quality.passed !== true`, exits **without** a PR (exit code 0).
5. Otherwise writes `lib/blog/articles/{slug}.tsx`, runs `scripts/generate-blog-manifest.mjs`, commits on a new branch, pushes, opens a PR via GitHub API.

### GitHub Actions secrets (repository)

| Secret | Purpose |
|--------|---------|
| `SITE_URL` | Production origin, e.g. `https://toollabz.com` (no trailing slash) |
| `CONTENT_ENGINE_SECRET` | Same value as server `CONTENT_ENGINE_SECRET` / `CRON_SECRET` |

The production app must have **`GEMINI_API_KEY`** set so `POST /api/generate-blog` can run the Gemini-backed pipeline.

Workflow: `.github/workflows/content-engine-blog-pr.yml` (daily + manual).

### Optional env

| Variable | Purpose |
|----------|---------|
| `CONTENT_ENGINE_DRY_RUN=1` | Log only; no file write / git / PR |
| `CONTENT_ENGINE_BASE_BRANCH` | Base branch (default `main`) |

### Local run

```bash
export GITHUB_TOKEN=...   # PAT or gh auth token with repo + workflow
export GITHUB_REPOSITORY=owner/repo
export SITE_URL=https://toollabz.com
export CONTENT_ENGINE_SECRET=...
npm run content-engine:blog-pr
```

## Post-merge sitemap ping

Workflow: `.github/workflows/content-engine-post-merge-ping.yml`  
On push to `main` when blog articles, manifest, or `lib/tools/data.ts` change, calls `POST /api/content-engine/ping-sitemap` on `SITE_URL`.

## Tool proposal PR (`create-tool-proposal-pr.ts`)

Creates `lib/content-engine/tool-proposals/{slug}/` with `SPEC.json` + `README.md` only — **no** `data.ts` or live routes.

When `GROQ_API_KEY` is set, `SPEC.json` is enriched with a fast Groq JSON pass (optional).

Workflow: `.github/workflows/content-engine-tool-proposal.yml` (manual).

```bash
export GITHUB_TOKEN=...
export GITHUB_REPOSITORY=owner/repo
export TOOL_SLUG=my-new-tool
export TOOL_NAME="My New Tool"
export TOOL_CATEGORY=finance
npm run content-engine:tool-proposal-pr
```

Dry run (writes files locally, no git or GitHub; **no** `GITHUB_TOKEN` required):

```bash
export TOOL_SLUG=my-new-tool
export TOOL_NAME="My New Tool"
export CONTENT_ENGINE_DRY_RUN=1
npm run content-engine:tool-proposal-pr
```

## Vercel cron (optional)

GitHub Actions schedule is the default. To trigger from Vercel instead, add a secured route or `repository_dispatch` with a stored GitHub PAT; not bundled here to avoid accidental secret exposure.

## Performance-driven SEO (optional)

1. **Search Console feedback** — Export “Pages” CSV from Google Search Console, then:

   ```bash
   npm run search-console:import-pages -- path/to/Pages.csv lib/content-engine/performance/aggregates.json
   ```

   Commit `aggregates.json` or deploy with `CONTENT_ENGINE_PERFORMANCE_JSON` pointing at the file. Cron + `prioritizeForPipeline` boost keywords that overlap high-traffic `/blog/...` paths.

2. **Dynamic quality weights** — Copy `lib/content-engine/performance/weights.example.json` to `weights.json`, tune, commit. Override path with `CONTENT_ENGINE_WEIGHTS_JSON`. Suggested starting point from outcomes: `suggestDimensionWeightsFromOutcomes` in `lib/content-engine/performance/suggest-weights.ts` (apply manually after review).

3. **PR human assist** — After each automated blog PR, `scripts/content-engine/lib/pr-comment.mjs` posts a checklist comment (intro / examples / tone).

4. **Topic clusters** — Defined in `lib/content-engine/topic-clusters.ts`; cron JSON includes `topicClusters` samples for editorial planning.

5. **Content variation** — `POST /api/generate-blog` accepts optional `variationSeed`; the pipeline maps it to tone + intro + example instructions for the model.

## Revenue / AdSense optimization (optional)

- **CPC proxy** — `lib/content-engine/monetization/cpc-scoring.ts` boosts finance, loans, insurance, business, SaaS metrics (MRR, CAC, LTV, churn, etc.) in discovery + queue ranking.
- **RPM protection** — `low-value.ts` + `revenue-merge.ts` deprioritize generic utilities and high-impression / near-zero CTR paths when `aggregates.json` is present.
- **Cron JSON** — `stats.monetizationLeaders` + `hints.adsensePlacement` for editors.
- **PR checklist** — includes AdSense placement reminders (no scripts injected by automation).
