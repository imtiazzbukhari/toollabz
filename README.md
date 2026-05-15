# Toollabz

Free calculators, converters, PDF utilities, and AI drafting tools.

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Yes (production) | Canonical origin for metadata, sitemap, and JSON-LD. |
| `SITE_URL` | Optional | Server-side cron/scripts; defaults may use `VERCEL_URL`. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` or `NEXT_PUBLIC_GA_ID` | Optional | GA4 measurement ID. |
| `NEXT_PUBLIC_GSC_VERIFICATION` or `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional | Google Search Console HTML tag value. |
| `MAILCHIMP_API_KEY`, `MAILCHIMP_LIST_ID`, `MAILCHIMP_SERVER_PREFIX` | Optional | Newsletter API subscription. |
| `REDIS_URL` | Optional | Redis cache for exchange rates, sitemap body, etc.; falls back to LRU in-process. |
| `NEXT_PUBLIC_TRUSTPILOT_BUSINESS_ID` | Optional | Reserved for Trustpilot widget integration. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional | Organization `contactPoint` in schema. |
| `NEXT_PUBLIC_ORG_SAME_AS` | Optional | Comma-separated social profile URLs for `sameAs` in Organization schema. |

See `.env.example` for the full list including content-engine keys.

## Local development

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:3000`. Blog posts are registered via `lib/blog/articles/*.tsx` and `npm run blog:manifest` runs automatically before `dev`, `build`, and `test`.

## Deployment checklist

1. Set `NEXT_PUBLIC_SITE_URL` to the HTTPS apex (no trailing slash).
2. Configure optional analytics, Mailchimp, and Redis as needed.
3. Run `npm run build` and fix any TypeScript or ESLint errors.
4. Run `node scripts/pre-deploy-check.mjs` (set `RUN_BUILD=1` to include a production build).
5. After deploy, verify `robots.txt` and `/sitemap.xml` in production.

## How to add a new tool

1. Add a `ToolDefinition` entry in `lib/tools/data.ts` (slug, category, fields, FAQs via `makeFAQs` or custom).
2. Implement computation in `lib/tools/engine.ts` (or the relevant engine module) and wire the slug in the tool workspace.
3. Run tests and ensure the slug appears in `buildSitemapEntries` output (tools are included automatically).

## How to add a blog post

1. Create `lib/blog/articles/your-slug.tsx` exporting a `BlogPostDefinition` (see existing posts for structure).
2. Run `npm run blog:manifest` to regenerate `articles.manifest.ts` (or rely on `prebuild` / `pretest`).
3. Optional: add the slug to `lib/blog/hub-featured-slugs.ts` for hub “featured guides” sections.

## Scripts

- `npm run images:webp` - convert PNGs under `public/` (see `scripts/convert-png-to-webp.mjs`).
- `node scripts/convert-to-webp.mjs` - create `.webp` alongside `.png`/`.jpg` without deleting sources.
- `npx tsx scripts/audit-internal-links.ts` - crawl sitemap URLs against `BASE_URL` (requires a running server).
- `node scripts/pre-deploy-check.mjs` - env example, robots, sitemap smoke checks.
