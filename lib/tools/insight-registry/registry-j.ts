import type { ToolPageInsight } from "../tool-insights-types";

export const TOOL_INSIGHTS_J: Record<string, ToolPageInsight> = {
  "html-formatter": {
    quickAnswer: "Splits adjacent HTML tags onto new lines for quick readability checks.",
    explain:
      "This formatter never claims to validate HTML5; it is a whitespace helper for logs, snippets, and Slack pastes. Pair it with your IDE formatter when you need balanced-tree fixes.",
    example: "`<nav><a href='/'>Home</a></nav>` becomes readable multi-line markup you can diff in PRs.",
    insights: [
      "Sanitize user HTML before rendering on public pages - formatting does not remove XSS.",
      "Large inline SVG may stay wide; break manually if reviewers need smaller diffs.",
    ],
  },
  "css-minifier": {
    quickAnswer: "Strips block comments and collapses CSS whitespace for smaller handoff bundles.",
    explain:
      "Minification targets deployment artifacts. Keep authored CSS in git with comments; run this when you need a quick one-off bundle without spinning up PostCSS.",
    example: "A 6 KB theme snippet often shrinks materially once comments and double spaces disappear.",
    insights: [
      "Verify animations after minification - rare spacing edge cases can change parsing in older engines.",
      "Re-append license banners in CI if legal requires visible third-party headers.",
    ],
  },
  "json-minifier": {
    quickAnswer: "JSON.parse + JSON.stringify for a single-line wire payload.",
    explain:
      "Great for cache keys, curl bodies, and log redaction previews. Schema validation still belongs in your API gateway.",
    example: "Pretty config objects compress to one line before signing with HMAC in repro scripts.",
    insights: [
      "BigInt-bearing JSON will throw - stringify those values manually in app code.",
      "Very large documents can block the main thread; split payloads when profiling.",
    ],
  },
  "xml-formatter": {
    quickAnswer: "Inserts line breaks between XML tags for SOAP and Android resource skims.",
    explain:
      "Does not fetch XSDs or expand entities - treat as a reading aid before your XML editor validates structure.",
    example: "`<Envelope><Body><m>1</m></Body></Envelope>` becomes easier to eyeball in incident bridges.",
    insights: [
      "CDATA blocks stay intact unless inner `><` pairs exist - rare but worth noting.",
      "Huge responses should be chunked server-side; browsers have memory ceilings.",
    ],
  },
  "yaml-validator": {
    quickAnswer: "YAML 1.2 parse check with root type echo for Helm and Actions drafts.",
    explain:
      "Catches indentation and anchor mistakes early. Kubernetes safety still needs schema checks and cluster dry runs.",
    example: "A mis-indented values.yaml line surfaces with parser line/column instead of a vague deploy timeout.",
    insights: [
      "Tabs vs spaces still trip teams up - align with editorconfig defaults.",
      "Paste production secrets only on trusted devices even if parsing is local.",
    ],
  },
  "csv-to-json-converter": {
    quickAnswer: "Header row drives object keys; quoted commas survive per-line parsing.",
    explain:
      "Use for quick API mocks from spreadsheet exports. Cast types in application code - output cells are strings.",
    example: "`sku,price\\nA1,9.99` becomes `[{sku:A1,price:9.99}]` for Postman collections.",
    insights: [
      "Semicolon-separated European CSV should be converted to commas first.",
      "Merged Excel cells should be flattened before export to avoid blank headers.",
    ],
  },
  "jwt-expiry-checker": {
    quickAnswer: "Reads exp/iat in UTC and compares to now without verifying signatures.",
    explain:
      "Ideal when correlating support tickets with session middleware logs. Signature trust stays on your auth service.",
    example: "A token showing exp two minutes ago explains the 401 without guessing clock skew yet.",
    insights: [
      "Always confirm skew between IdP and app servers before blaming users.",
      "Opaque refresh tokens are not JWT-shaped - route those questions to your token vendor.",
    ],
  },
  "api-status-checker": {
    quickAnswer: "Validates URL structure and prints a curl -I probe you can run locally.",
    explain:
      "Synchronous Toollabz calculators do not perform live fetches - this tool stays honest while still accelerating runbooks.",
    example: "Paste `https://api.staging.example/health` and copy the suggested curl into a bastion shell.",
    insights: [
      "Browser CORS differs from curl - prefer curl for internal APIs.",
      "Add Authorization headers manually; never commit secrets into tickets.",
    ],
  },
  "self-employed-tax-calculator-uk": {
    quickAnswer: "Applies your own effective income tax and NI percents to annual profit.",
    explain:
      "HMRC banding, dividends, and payments on account are intentionally manual - this is a planning scratchpad, not a filing engine.",
    example: "£48k profit at 18% tax and 6% NI sketches how much to reserve before January balancing.",
    insights: [
      "Blend Class 2/4 and any voluntary contributions into the NI % you type.",
      "Move finalized numbers into certified software after accountant review.",
    ],
  },
  "dividend-tax-calculator-uk": {
    quickAnswer: "Multiplies gross dividends by an effective tax percent you supply.",
    explain:
      "Use when the board already has a blended rate from tax forecasts. Allowances and band stacking stay outside the tool.",
    example: "£10k gross at 25% effective yields £7.5k net for slide-deck planning.",
    insights: [
      "Scottish tax codes still flow through the effective % you choose.",
      "Exclude ISA dividends - they are typically out of scope for this sketch.",
    ],
  },
  "stripe-fee-calculator": {
    quickAnswer: "Percent plus fixed fee subtraction on card-present or online charges.",
    explain:
      "Stripe’s real statements include Radar, Billing, currency conversion, and tax on fees - fold those into the % when reconciling.",
    example: "£120 charge with 1.5% + £0.20 shows how much net hits the payout CSV.",
    insights: [
      "International cards often carry higher % - update monthly from dashboard exports.",
      "ACH and card pricing differ; swap inputs when modeling bank debits.",
    ],
  },
  "paypal-fee-calculator": {
    quickAnswer: "Mirrors common domestic goods-and-services percent plus fixed model.",
    explain:
      "Micropayment pricing tiers differ - if your statement shows lower % on small tickets, lower the inputs accordingly.",
    example: "£80 sale at 2.9% + £0.30 is a quick sanity check before updating price lists.",
    insights: [
      "Friends & family transfers are usually excluded from commercial fee math.",
      "Chargebacks and disputes carry separate fees - reserve outside this calculator.",
    ],
  },
  "etsy-fee-calculator": {
    quickAnswer: "Adds listing flat fee plus transaction and payment percents on item price.",
    explain:
      "Regulatory, advertising, and VAT-on-fees lines change - treat percents as living inputs from your Etsy CSV.",
    example: "£40 item with 6.5% transaction and 4% processing plus listing fee shows net craft fair pricing headroom.",
    insights: [
      "Mandatory offsite ads can dominate margin - increase % when enrolled.",
      "Multi-quantity carts may change fee bases; run per SKU if needed.",
    ],
  },
  "ebay-fee-calculator": {
    quickAnswer: "Final value percent plus fixed closing fee on sold price.",
    explain:
      "Promoted listings, insertion fees, and category caps are manual overlays - still faster than retyping spreadsheets each night.",
    example: "£150 sold with 12.8% + £0.30 sketches payout before promoted listing spend.",
    insights: [
      "Managed payments FX can differ from PayPal-era memories - read the CSV.",
      "Refunded FVF credits lag - cash planning should include timing buffers.",
    ],
  },
  "churn-calculator": {
    quickAnswer: "Compound monthly churn across a horizon for classroom retention curves.",
    explain:
      "Uses exponential decay on starting customers - great for intuition, not for replacing cohort/NRR dashboards.",
    example: "1000 logos at 3% monthly churn for 12 months shows how fast logos decay without expansion.",
    insights: [
      "Annual churn inputs should be converted to monthly before typing.",
      "Pair with LTV when asking whether CAC payback still works at higher churn.",
    ],
  },
  "roas-calculator": {
    quickAnswer: "ROAS = attributed revenue ÷ ad spend with ROI% on spend alongside.",
    explain:
      "Keeps paid social, search, and affiliate math consistent when everyone agrees on the attribution window.",
    example: "£24k revenue on £6k spend is 4× ROAS with 300% ROI on cash outlay.",
    insights: [
      "Blended channel ROAS should sum revenue and spend first, then divide.",
      "Contribution ROAS needs COGS removed upstream - not built into this field set.",
    ],
  },
  "working-days-calculator-uk": {
    quickAnswer: "Weekday Mon–Fri count between ISO dates minus bank holidays you enter.",
    explain:
      "Does not embed the UK bank holiday calendar - payroll leads subtract only the holidays their contracts observe.",
    example: "January month-end minus two weekday bank holidays tightens accrual math quickly.",
    insights: [
      "Scotland-specific holidays differ - adjust the subtract field accordingly.",
      "Dates use UTC anchors for reproducibility across machines.",
    ],
  },
  "business-days-calculator": {
    quickAnswer: "Pure Mon–Fri counting for SLA timers without holiday logic baked in.",
    explain:
      "Helpful for international teams that attach holiday tables separately in Notion or Jira automation.",
    example: "March window counts weekdays for shipping estimates before subtracting public closures manually.",
    insights: [
      "Inclusive semantics match many finance calendars - confirm with legal if exclusive is required.",
      "Half-day SLAs still need human rounding policies.",
    ],
  },
  "random-team-generator": {
    quickAnswer: "Fisher–Yates shuffle splits roster into balanced random teams.",
    explain:
      "Great for workshops and stand-up rotations. Not audited for prize drawings - use regulated RNG when law requires.",
    example: "18 attendees into four teams yields four lines you can paste back into Zoom chat.",
    insights: [
      "Team sizes differ by at most one when counts do not divide evenly.",
      "Re-roll fairness by clicking calculate again if someone swaps in last minute.",
    ],
  },
  "lbs-to-kg-converter": {
    quickAnswer: "International avoirdupois pound × 0.45359237 for kilograms.",
    explain:
      "Pairs with the existing kg-to-lbs tool for round-trip QA on shipping labels and gym logs.",
    example: "170 lb displays as 77.110703 kg before you round for airline baggage displays.",
    insights: [
      "Stone measurements should use the dedicated stone converter for UK norms.",
      "Keep extra decimals until the final customer-facing rounding rule.",
    ],
  },
  "feet-to-cm-converter": {
    quickAnswer: "Decimal international foot × 30.48 for centimeters.",
    explain:
      "Best when CAD files already store engineering feet instead of feet+inch pairs.",
    example: "12.5 ft becomes 381 cm for laser cutting kerf notes.",
    insights: [
      "Survey foot differs slightly - verify deeds before legal conversions.",
      "Human heights often feel easier in the feet+inches converter variant.",
    ],
  },
  "pace-calculator": {
    quickAnswer: "Elapsed time ÷ distance yields min/km plus km/h and mph context.",
    explain:
      "Supports km or mile race distances so marathon and 5K pacing share one form.",
    example: "10 km in 52:00 lands near 5:12 per km with ~11.5 km/h average.",
    insights: [
      "GPS distance drift means race-certified distance is safer for PR pacing.",
      "Walk breaks slow average speed - elapsed time should include them.",
    ],
  },
  "mph-to-kmh-converter": {
    quickAnswer: "Statute mph times 1.609344 for exact km/h.",
    explain:
      "Useful for automotive specs, weather gusts, and rental car dashboards when EU signage is km/h only.",
    example: "70 mph sticker matches ~112.6 km/h for mental translation on motorways.",
    insights: [
      "Knots and mach speeds need different tools - do not reuse this factor.",
      "Electric vehicle displays still benefit from the same conversion factor.",
    ],
  },
  "square-feet-to-square-meters-converter": {
    quickAnswer: "International square foot × 0.09290304 for square metres.",
    explain:
      "Bridges US floor plans to EU listing portals where m² is mandatory.",
    example: "1,200 ft² becomes ~111.48 m² before marketing rounding rules clip decimals.",
    insights: [
      "Gross living area definitions differ - numbers here are pure unit math.",
      "Large parcels often switch to acres ↔ hectares for land context.",
    ],
  },
};
