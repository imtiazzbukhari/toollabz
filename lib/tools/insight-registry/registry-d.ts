import type { ToolPageInsight } from "../tool-insights-types";

export const TOOL_INSIGHTS_D: Record<string, ToolPageInsight> = {
  "domain-value-estimator": {
    quickAnswer:
      "Multiply estimated monthly profit (from RPM × pageviews minus opex) by a defensible months-of-profit multiple range.",
    explain:
      "Buyers rarely pay on raw traffic - they pay on durable profit after content and ops costs. Multiples move with niche, concentration risk, and transferability of monetization.",
    example:
      "120k PV/mo at $12 RPM → $1,440 gross; minus $400 opex → $1,040/mo profit; 24–42× → roughly $25k–$44k directional band before diligence.",
    insights: [
      "If one affiliate program is 70% of revenue, haircut the multiple, not just the RPM.",
      "Seasonality should use trailing-twelve averages, not last month.",
      "Addbacks for owner salary need to be explicit or buyers will ignore them.",
    ],
  },
  "mortgage-refinance-calculator": {
    quickAnswer: "Compare old vs new P&I, then divide closing costs by monthly savings to see break-even months.",
    explain:
      "Refinance math is amortization twice: what you pay now on the remaining balance vs a fresh note at a lower rate. Break-even ignores time value of money but is the quick gut check.",
    example:
      "$320k balance, 7% → ~$2,132/mo; same term at 6% → ~$1,919/mo; $6k costs ÷ $213 ≈ 28 months to recover closing.",
    insights: [
      "Cash-out refis change LTV risk and total interest paid - don’t only stare at payment.",
      "If you reset to 30 years, payment can drop while lifetime interest rises.",
      "Lender credits vs points flip the break-even - model both scenarios.",
    ],
  },
  "business-insurance-calculator": {
    quickAnswer: "Blend a revenue-based rate with a per-employee load to approximate GL/workers’ comp bundles.",
    explain:
      "Carriers price on class codes, claims, limits, and state filings - this is a planning band to compare quotes, not a bindable premium.",
    example:
      "$850k revenue, medium risk band, 12 employees → revenue slice ~$4.25k + employee load ~$8.6k → mid-teens thousand ballpark before deductibles.",
    insights: [
      "Cyber and E&O are often separate policies - don’t assume they’re in a GL quote.",
      "Subs vs 1099 roles change workers’ comp exposure materially.",
      "Renewals jump after losses; keep loss runs clean and documented.",
    ],
  },
  "google-ads-roi-calculator": {
    quickAnswer: "ROAS is revenue divided by spend; ROI is percent profit on spend after you net out costs.",
    explain:
      "Attribution windows and modeled conversions inflate ROAS - use this for directional pacing, then validate with incrementality tests or geo holdouts when budgets grow.",
    example:
      "$5k spend, $18k attributed revenue → 3.6× ROAS; profit $13k → 260% ROI before COGS and refunds.",
    insights: [
      "Blended account ROAS hides bleeding search terms - slice by campaign and SKU.",
      "New customer revenue deserves different targets than repeat purchases.",
      "Include returns and payment failures when judging true ROAS.",
    ],
  },
  "refund-policy-generator": {
    quickAnswer: "Ship a structured policy with scope, eligibility, timelines, and a support path - then localize with counsel.",
    explain:
      "Chargebacks and marketplaces punish vague policies. Clear timelines reduce disputes and set expectations for digital vs physical goods.",
    example:
      "14-day window, email help@brand.com with order ID, exclusions for downloaded digital goods once accessed - matches many SaaS + template shops.",
    insights: [
      "EU/UK cooling-off rules differ for digital - don’t copy US text blindly.",
      "Link the policy in checkout, email receipts, and help center footers.",
      "Subscriptions need cancellation plus refund sections separate from one-time purchases.",
    ],
  },
  "freelance-contract-generator": {
    quickAnswer: "Capture scope, rate, payment cadence, IP transfer timing, confidentiality, and termination in one short agreement skeleton.",
    explain:
      "Courts care about mutual consideration, clear deliverables, and who owns work before/after payment. This template is a starting point for counsel review.",
    example:
      "Design sprint: $120/hr, net-15, IP transfers on paid invoice, NY law, mutual confidentiality - typical marketing retainer shape.",
    insights: [
      "Misclassification risk is real - contracts don’t replace ABC tests or local labor rules.",
      "Late payment: define interest or pause rights, not just vibes.",
      "Add liability caps and indemnity when touching customer PII or ad accounts.",
    ],
  },
  "invoice-generator": {
    quickAnswer: "Turn `description | qty | rate` rows into a subtotal, optional tax line, and total due with parties and dates.",
    explain:
      "Invoices are part AR artifact, part legal timestamp. Line-item clarity beats prose paragraphs when clients dispute scope.",
    example:
      "`Sprint build | 40 | 150` → $6,000 subtotal; 8% tax → $480; total $6,480 with invoice #1001 dated today.",
    insights: [
      "VAT/GST IDs and reverse-charge language belong in international variants.",
      "Sequential invoice numbers matter more than clever prefixes for audits.",
      "Attach SOW references in the header to reduce “what was included” debates.",
    ],
  },
  "utm-link-builder": {
    quickAnswer: "Normalize campaign tracking by appending utm_* query params without hand-editing ampersands.",
    explain:
      "Analytics tools key off consistent naming. Building URLs with a builder avoids broken encoding and mixed-case chaos in Looker Studio.",
    example:
      "https://example.com/pricing?utm_source=newsletter&utm_medium=email&utm_campaign=spring_push keeps source/medium/campaign aligned.",
    insights: [
      "Never UTMs on internal nav links - session attribution will skew.",
      "Stick to lowercase keys and hyphenated values as a team convention.",
      "Shorten links only after UTMs are final so you don’t cache the wrong params.",
    ],
  },
  "domain-age-checker": {
    quickAnswer: "Compute years/months/days since registration to reason about trust signals and brand tenure.",
    explain:
      "WHOIS creation dates can differ from first-indexed dates; use this for directional storytelling, not legal proof of ownership.",
    example:
      "Registered 2018-05-01 → ~8 years of age in 2026; handy when comparing dropped vs aged domains.",
    insights: [
      "Privacy WHOIS can hide dates - verify with registrar panels when accuracy matters.",
      "Transfers don’t always reset SEO history, but spam baggage can persist.",
      "Pair age checks with backlink and trademark screens before buying.",
    ],
  },
  "meta-tag-analyzer": {
    quickAnswer: "Extract title length, description presence, Open Graph basics, and a quick inventory of meta tags from raw HTML.",
    explain:
      "View-source checks beat rendered DOM when debugging SSR vs client hydration mismatches for SEO and social previews.",
    example:
      "Title 58 chars, meta description 148 chars, og:title present → likely eligible for rich previews if images are valid.",
    insights: [
      "Duplicate robots directives happen when SEO plugins stack - search for two robots tags.",
      "Twitter cards may still read OG fallbacks - verify both if CTR matters.",
      "Inline JSON-LD isn’t shown here - pair with schema tests for completeness.",
    ],
  },
  "qr-code-generator-with-logo": {
    quickAnswer: "Produce a high-error-correction QR image URL, then overlay a logo in design tools and re-scan.",
    explain:
      "ECC H buys quiet-zone tolerance so a centered logo doesn’t brick scans; always test on mid-tier Android, not just the newest iPhone.",
    example:
      "Encode https://yourdomain.com/signup at 240px ECC H, drop a 48px logo over center, export PNG for print.",
    insights: [
      "Contrast beats aesthetics - dark modules on light background win outdoors.",
      "Short URLs reduce module count and improve reliability.",
      "Self-host final assets for campaigns; don’t depend on transient CDNs in production.",
    ],
  },
  "image-background-remover": {
    quickAnswer: "Follow capture, masking, edge cleanup, and export guidance instead of trusting one-click magic for hair and glass.",
    explain:
      "Matte quality is a workflow: good lighting beats brute-force sliders; alpha halos show up on both white and black comps.",
    example:
      "Product on gray seamless → color sample background → refine edges → export PNG-24 alpha → WebP @80% for web.",
    insights: [
      "Frequency separation helps with frizzy hair more than global decontaminate.",
      "Premultiplied alpha avoids gray fringes in game/UI pipelines.",
      "Batch similar SKUs with the same mask recipe to save time.",
    ],
  },
  "ai-social-bio-generator": {
    quickAnswer: "Generate multiple platform-aware bios with different hooks, then edit claims so nothing invents credentials.",
    explain:
      "Bios should compress positioning + proof + CTA. AI gives angles; you supply the specifics reviewers can verify.",
    example:
      "B2B SaaS marketing niche → “Helping B2B SaaS skip guesswork | systems > motivation | newsletter ↓” style variants.",
    insights: [
      "One emoji max unless brand voice is explicitly playful.",
      "Link-in-bio should match the CTA verb you used in the bio.",
      "Refresh quarterly when offers or ICPs shift.",
    ],
  },
  "youtube-tag-extractor": {
    quickAnswer: "Pull hashtags and comma chunks from descriptions into a deduped tag list for planning uploads.",
    explain:
      "YouTube relevance rewards specificity; dumping 50 tags won’t fix a misaligned title/thumbnail. Use this to audit competitor language patterns.",
    example:
      "Description with #seo #marketing plus “tutorial, analytics” lines → merged unique list for ideation.",
    insights: [
      "First 48 hours CTR matters more than tag spam - prioritize title alignment.",
      "Shorts vs long-form may need different keyword clusters.",
      "Refresh tags after major algorithm updates or topic pivots.",
    ],
  },
  "password-generator-advanced": {
    quickAnswer: "Emit several passwords at once with charset toggles and optional ambiguous-character stripping.",
    explain:
      "Entropy comes from length and independent random choices. Excluding `0/O` helps humans, but length still does the heavy lifting.",
    example:
      "Three 16-character passwords without ambiguous chars → distinct samples for email, bank, and vault backup codes.",
    insights: [
      "Never reuse across sites - password managers make length cheap.",
      "If a site caps length, use max allowed with full charset.",
      "Rotate after breaches, not arbitrary 90-day calendars unless required.",
    ],
  },
  "robots-txt-generator": {
    quickAnswer: "Draft Allow/Disallow groups per user-agent plus optional sitemap declarations for crawler hints.",
    explain:
      "Robots.txt is cooperative, not secure - sensitive routes should be auth-gated, not merely disallowed.",
    example:
      "User-agent * disallow /admin/ and /api/private/ while allowing /blog/; sitemap https://example.com/sitemap.xml appended.",
    insights: [
      "Wildcards and crawl-delay aren’t honored uniformly - test in GSC.",
      "Staging hosts need their own robots rules before accidental indexing.",
      "Don’t block CSS/JS needed for rendering if you care about modern SEO.",
    ],
  },
  "broken-link-checker": {
    quickAnswer: "Static scan for risky href schemes and malformed URLs before you pay for a full crawl.",
    explain:
      "javascript: and odd protocols break accessibility and SEO flows; this flags obvious foot-guns, not remote 404s.",
    example:
      "Paste landing HTML → flag `javascript:void(0)` CTA, OK relative `/pricing` paths, OK `mailto:` support links.",
    insights: [
      "Trackers sometimes rewrite URLs - inspect final HTML, not just CMS preview.",
      "Empty hrefs are clickable traps - use buttons for actions instead.",
      "Pair with log-based 404 monitoring after launches.",
    ],
  },
  "html-to-json-converter": {
    quickAnswer: "Summarize headings, links, images, and title text into JSON for quick audits without DOM APIs.",
    explain:
      "Useful when you only have static HTML exports from crawlers or email templates and need a fast structural read.",
    example:
      "Marketing page export → counts 1 H1, 6 H2s, 42 hrefs, 11 imgs, title “Orbital – Analytics”.",
    insights: [
      "Malformed HTML may parse differently across engines - treat counts as approximate.",
      "Strip scripts before sharing HTML externally.",
      "Pair with schema generators when building structured data plans.",
    ],
  },
  "json-to-html-converter": {
    quickAnswer: "Render JSON into nested `<dl>` / `<ul>` HTML for docs previews and quick human reading.",
    explain:
      "Great for internal snippets - not a substitute for sanitization if user JSON is untrusted in production apps.",
    example:
      '{"sku":"A12","price":49,"tags":["sale","new"]} becomes nested lists you can paste into CMS HTML blocks.',
    insights: [
      "Pretty-print JSON first for stable diffs in reviews.",
      "Very deep trees need collapsible UI - flatten for giant payloads.",
      "Escape rules here are basic - never pipe raw user JSON to innerHTML live.",
    ],
  },
  "ai-search-appearance-checker": {
    quickAnswer: "Generate entity, snippet, FAQ, and content-gap prompts to stress-test AI-overview readiness.",
    explain:
      "Generative answers favor clear primary entities, consistent facts, and citeable sentences - this tool outputs angles to audit, not guarantees of ranking.",
    example:
      "Brand Orbital + topics analytics, budgeting → add FAQ “What is Orbital?” with verifiable facts and stats-led meta ideas.",
    insights: [
      "Align on-site copy with Wikipedia-style neutral facts where appropriate.",
      "Author bylines and visible dates improve trust for YMYL adjacency.",
      "Refresh quarterly as model sourcing behavior shifts.",
    ],
  },
  "gas-fee-calculator-multichain": {
    quickAnswer: "Convert gasLimit × gwei into native token units, then multiply by a USD price assumption for a quick fee estimate.",
    explain:
      "Wallets include base fee + priority fee + L2 data costs - this is directional math for comparisons, not mempool-perfect quotes.",
    example:
      "21,000 gas at 35 gwei → 0.000735 ETH; at $3,200/ETH → ~$2.35 before any L2 batching nuances.",
    insights: [
      "Congestion spikes invalidate static gwei inputs - always confirm in-wallet.",
      "Batch approvals and swaps with multicall patterns when protocols allow.",
      "Stablecoin routes may add bridge risk - fee is only one variable.",
    ],
  },
  "nft-royalty-calculator": {
    quickAnswer: "Subtract marketplace fee and creator royalty from sale price to approximate seller proceeds.",
    explain:
      "Royalty enforcement varies by marketplace and chain; treat numbers as deal-structure math, not on-chain guarantees.",
    example:
      "$2,500 sale, 7.5% royalty, 2.5% marketplace fee → $187.50 royalty, $62.50 fee, seller about $2,250 before gas/taxes.",
    insights: [
      "Some venues honor optional royalties - disclose that to collectors.",
      "Primary vs secondary splits belong in the minting terms, not just tweets.",
      "Gas for listings and transfers can eat thin-margin flips.",
    ],
  },
};
