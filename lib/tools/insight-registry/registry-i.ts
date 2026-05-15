import type { ToolPageInsight } from "../tool-insights-types";

/** Phase 1 expansion tools - aside “Quick answer” panel (unique quickAnswer strings project-wide). */
export const TOOL_INSIGHTS_I: Record<string, ToolPageInsight> = {
  "jwt-decoder": {
    quickAnswer: "JWT decoder: split three Base64URL segments, JSON-print header and payload, and translate exp/nbf to UTC without claiming signature validity.",
    explain:
      "Use this when you need to read alg, kid, iss, and audience claims during OAuth debugging. Anything about trust still belongs to your verifier with the right keys and algorithms.",
    example: "Paste a staging access token → see HS256 vs RS256 in header plus exp minutes from now in the payload block.",
    insights: [
      "JWE tokens encrypt payload bytes; this path targets common JWS JSON layouts.",
      "Rotating signing keys can make old tokens fail even when payload still looks fine.",
      "Never paste long-lived refresh tokens on shared kiosks even if decode is local.",
    ],
  },
  "uuid-generator": {
    quickAnswer: "UUID generator: emit RFC 4122 v4 random IDs in batches up to fifty using crypto.randomUUID when the browser supports it.",
    explain:
      "Great for fixtures, correlation IDs, and ephemeral resource names before you wire a database default. Collisions are astronomically rare but uniqueness constraints still belong in storage.",
    example: "Ask for twelve lowercase UUIDs → copy lines straight into a seed script or Postman collection variables.",
    insights: [
      "ULIDs sort by time; UUIDv4 does not - pick the format your observability stack prefers.",
      "Uppercase vs lowercase is cosmetic for most systems but keep one convention per repo.",
      "Regenerate if an upstream system rejects a reserved pattern even if collision was unlikely.",
    ],
  },
  "sql-formatter": {
    quickAnswer: "SQL formatter: insert line breaks before major keywords so a one-line log query becomes reviewable without touching semantics.",
    explain:
      "Dialect quirks, string literals with reserved words, and dollar-quoted bodies can still surprise naive formatters - treat output as a draft you eyeball before execution.",
    example: "SELECT id,name FROM users WHERE active=1 ORDER BY name → stacked SELECT / FROM / WHERE / ORDER BY lines for Slack snippets.",
    insights: [
      "CTEs and window clauses may need manual indentation after the first pass.",
      "Never auto-run formatted SQL against prod without the same guardrails as the original.",
      "Pair with your SQL client’s explain plan, not this whitespace layer, for performance tuning.",
    ],
  },
  "cron-expression-generator": {
    quickAnswer: "Cron helper: split five classic fields and narrate each token so a crontab line is easier to document in runbooks.",
    explain:
      "Kubernetes, systemd timers, and Quartz all bend cron rules differently - this stays at portable Unix-style five fields without pretending to know your host timezone table.",
    example: "0 9 * * 1-5 → minute zero, hour nine, every month/day, weekdays only, for a morning job sketch.",
    insights: [
      "DST jumps can skip or double-fire hour=2 windows depending on zone database.",
      "Macros like @daily are not expanded here - normalize to digits first.",
      "Day-of-month vs day-of-week interactions remain scheduler-specific edge cases.",
    ],
  },
  "markdown-to-html-converter": {
    quickAnswer: "Markdown→HTML: convert a practical subset (headings, lists, emphasis, links, fenced code) to escaped HTML suitable for preview pipelines.",
    explain:
      "Authoring tools still need a sanitizer before rendering user Markdown on the public web - this page returns string output you can paste into CMS previews or tests.",
    example: "A README with H1, bullet list, and ```js fence becomes semantic HTML with escaped code innards.",
    insights: [
      "GitHub tables and footnotes are intentionally out of scope for this lightweight build.",
      "Raw HTML inside Markdown is discouraged; treat unknown input as hostile until cleaned.",
      "Very large files may feel sluggish - split chapters for iterative editing.",
    ],
  },
  "unix-timestamp-converter": {
    quickAnswer: "Unix timestamp tool: map epoch seconds or thirteen-digit milliseconds to UTC ISO strings, or parse ISO back to integer seconds.",
    explain:
      "Log triage often bounces between JSON numeric epochs and human-readable GMT; this keeps both directions deterministic without guessing your laptop’s local zone for output.",
    example: "1735689600 → 2025-01-01T00:00:00.000Z style line plus a GMT string echo for older dashboards.",
    insights: [
      "Always label whether logs store seconds or milliseconds before sharing converted values.",
      "Leap seconds and historical offsets are handled by the JS engine, not reimplemented here.",
      "Negative epochs cover pre-1970 archives when numeric input is intentional.",
    ],
  },
  "gst-calculator-australia": {
    quickAnswer: "Australia GST helper: model ten percent add/remove on AUD amounts with explicit inclusive vs exclusive input modes for invoice splits.",
    explain:
      "Dividing by one point one removes GST from inclusive totals; multiplying net by zero point one adds the component - still classify supplies with your advisor before filing.",
    example: "One hundred ten inclusive → one hundred net plus ten GST when rounding matches your billing engine.",
    insights: [
      "Per-line vs invoice-total rounding can differ by cents on large carts.",
      "GST-free and input-taxed supplies are not enumerated here.",
      "Cross-border digital services may follow different rules than domestic B2B.",
    ],
  },
  "zakat-calculator": {
    quickAnswer: "Zakat estimator: subtract your chosen nisab threshold from typed zakatable wealth, then apply the percentage when wealth clears that line.",
    explain:
      "You supply nisab in the same currency units as wealth so different schools’ bullion equivalents can be honored without Toollabz hard-coding a price feed.",
    example: "Wealth twelve thousand, nisab six thousand, two point five percent → one fifty on the six thousand surplus.",
    insights: [
      "Business inventory and receivables belong in the wealth figure before running the surplus line.",
      "This is arithmetic assistance only, not a substitute for qualified religious guidance.",
      "Multi-currency holdings should be converted with a consistent FX policy first.",
    ],
  },
  "freelance-day-rate-calculator": {
    quickAnswer: "Freelance day-rate floor: gross-up an annual after-tax target using your tax and reserve margin, then divide by realistic billable days per year.",
    explain:
      "Unlike hourly amortization tools, this answers “what must each booked day earn” when your calendar has far fewer sellable days than workdays on a calendar grid.",
    example: "One twenty after-tax target, one twenty billable days, thirty percent margin → a four-digit-plus day rate before scope buffers.",
    insights: [
      "If admin and sales eat more time next year, lower billable days before you lower the rate.",
      "VAT or GST quoting layers on top of this professional-fee baseline.",
      "Compare against the hourly freelance calculator when projects mix half-days.",
    ],
  },
  "employee-cost-calculator": {
    quickAnswer: "Loaded employee cost: multiply base salary by one plus benefits burden and again by one plus overhead allocation for a directional annual seat estimate.",
    explain:
      "Useful when pricing SaaS or services work where payroll, benefits, IT, and management load must be felt in margin math - not a GAAP payroll journal.",
    example: "Ninety-five thousand salary with twenty-five percent benefits and fifteen percent overhead → a six-figure loaded ballpark in one multiply chain.",
    insights: [
      "Equity-based comp is excluded unless you fold an annualized expense manually.",
      "Contractor invoices already embed overhead-avoid double-loading those seats.",
      "Split multi-country teams with country-specific burden rates before summing.",
    ],
  },
  "invoice-late-fee-calculator": {
    quickAnswer: "Invoice late fee: multiply outstanding principal by annual contractual percent times days late divided by three sixty-five for simple interest style fees.",
    explain:
      "Handy when a contract spells a statutory-safe annual rate and you need a quick fee line before finance applies their rounding policy in the ledger.",
    example: "Five thousand principal, twenty-two days, twelve percent → a few dozen dollars fee plus updated total due snapshot.",
    insights: [
      "Consumer-facing agreements may cap permissible late rates-validate with counsel.",
      "Compound interest policies need a different recurrence model than this single window.",
      "Partial payments should reduce principal before applying late windows in real AR systems.",
    ],
  },
  "stone-to-kg-converter": {
    quickAnswer: "Stone↔kg: one stone equals fourteen pounds at standard international kilogram definitions, so multiply or divide by six point three five zero two nine three one eight.",
    explain:
      "UK and Ireland still discuss body weight in stone; medical and shipping forms often want kilograms - carry extra decimals then round for display per intake rules.",
    example: "Eleven stone → just under seventy kilograms when you keep four decimal places before rounding to one.",
    insights: [
      "Combine leftover pounds into decimal stone before converting when someone says twelve stone seven.",
      "US contexts rarely use stone; pounds-only tools may read more naturally there.",
      "Gym scales differ slightly from clinical scales-this is pure unit math, not device calibration.",
    ],
  },
  "feet-inches-to-cm-converter": {
    quickAnswer: "Feet and inches to centimeters: total inches equals feet times twelve plus inches, then multiply by two point five four for centimeters with a reverse path for visa forms.",
    explain:
      "Height questions on international paperwork often want centimeters while people still think in feet; the reverse mode splits total inches back into feet plus fractional inches.",
    example: "Five feet ten inches → about one hundred seventy-eight centimeters depending on rounding policy on the form.",
    insights: [
      "Normalize inches under twelve before sharing human-readable heights when possible.",
      "Decimal inches (ten point five) are supported for fractional shoe or clinical measurements.",
      "Pediatric growth charts need percentiles beyond raw conversion-this page is unit math only.",
    ],
  },
  "acres-to-hectares-converter": {
    quickAnswer: "Acres↔hectares: one international acre equals zero point four zero four six eight five six four two two four hectares for farmland and listing comparisons.",
    explain:
      "GIS polygons need geodesic area, but flat conversions still help when skimming UK/EU/US land marketing materials that hop between acre and hectare labels.",
    example: "Forty acres → about sixteen point one nine hectares under the international acre definition used here.",
    insights: [
      "Some US legal descriptions reference survey acres which differ slightly-read deeds carefully.",
      "One hectare is ten thousand square meters if you need a third unit in the same memo.",
      "Environmental models may still want meters squared from GIS rather than this shortcut.",
    ],
  },
};
