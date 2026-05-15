import { parse as parseYaml } from "yaml";
import type { ToolComputationResult } from "./computation-result";

const invalid = (message: string): ToolComputationResult => ({
  title: "Invalid Input",
  value: message,
  error: true,
});

const n = (value: string | undefined, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

function breakTags(s: string): string {
  const t = s.trim().replace(/>\s*</g, "><");
  if (!t) return "";
  return t.split("><").join(">\n<");
}

function minifyCss(css: string): string {
  let s = css.replace(/\/\*[\s\S]*?\*\//g, " ");
  s = s.replace(/\s+/g, " ").replace(/\s*([{}:;,>+~])\s*/g, "$1").replace(/;\s*}/g, "}").trim();
  return s;
}

/** Line-based CSV with quoted commas supported per row. */
function parseCsvRows(text: string): string[][] {
  return text
    .trim()
    .split(/\r?\n/)
    .filter((line) => line.length > 0)
    .map((line) => {
      const cells: string[] = [];
      let cur = "";
      let q = false;
      for (let i = 0; i < line.length; i += 1) {
        const c = line[i]!;
        if (c === '"') {
          if (q && line[i + 1] === '"') {
            cur += '"';
            i += 1;
            continue;
          }
          q = !q;
          continue;
        }
        if (c === "," && !q) {
          cells.push(cur.trim());
          cur = "";
          continue;
        }
        cur += c;
      }
      cells.push(cur.trim());
      return cells;
    });
}

function b64UrlToAscii(b64url: string): string {
  let t = b64url.replace(/-/g, "+").replace(/_/g, "/");
  while (t.length % 4) t += "=";
  const bin = typeof atob === "function" ? atob(t) : Buffer.from(t, "base64").toString("binary");
  try {
    return decodeURIComponent(
      bin
        .split("")
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join(""),
    );
  } catch {
    return bin;
  }
}

function parseIsoUtcDay(iso: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(d)) return null;
  const t = Date.UTC(y, mo - 1, d);
  const back = new Date(t);
  if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d) return null;
  return t;
}

function weekdaysInclusiveUtc(startIso: string, endIso: string): number {
  const t0 = parseIsoUtcDay(startIso);
  const t1 = parseIsoUtcDay(endIso);
  if (t0 === null || t1 === null) return -1;
  if (t1 < t0) return -1;
  let count = 0;
  for (let t = t0; t <= t1; t += 86400000) {
    const wd = new Date(t).getUTCDay();
    if (wd !== 0 && wd !== 6) count += 1;
  }
  return count;
}

function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
}

export function computeExpansionPhase2(slug: string, form: Record<string, string>): ToolComputationResult | null {
  switch (slug) {
    case "html-formatter": {
      const raw = form.html || "";
      if (!raw.trim()) return invalid("Paste HTML to format.");
      return {
        title: "Formatted HTML",
        value: breakTags(raw),
        extra: ["Inserts line breaks between tags for readability; does not validate HTML5 semantics.", "Review script/style blocks manually after formatting."],
      };
    }
    case "css-minifier": {
      const raw = form.css || "";
      if (!raw.trim()) return invalid("Paste CSS to minify.");
      return { title: "Minified CSS", value: minifyCss(raw), extra: ["Removes most whitespace and block comments; keep a non-minified copy in source control."] };
    }
    case "json-minifier": {
      const raw = (form.json || "").trim();
      if (!raw) return invalid("JSON input is required.");
      try {
        const parsed = JSON.parse(raw) as unknown;
        return { title: "Minified JSON", value: JSON.stringify(parsed), extra: ["No spaces; safe for wire payloads and cache keys."] };
      } catch (e) {
        return invalid(`Invalid JSON: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    case "xml-formatter": {
      const raw = form.xml || "";
      if (!raw.trim()) return invalid("Paste XML to format.");
      return {
        title: "Formatted XML",
        value: breakTags(raw),
        extra: ["Line breaks between tags only; large CDATA blocks stay as single lines.", "Validate against your XSD/schema separately."],
      };
    }
    case "yaml-validator": {
      const raw = form.yaml || "";
      if (!raw.trim()) return invalid("Paste YAML to validate.");
      try {
        const doc = parseYaml(raw) as unknown;
        const kind = doc === null ? "null" : Array.isArray(doc) ? "array" : typeof doc;
        return {
          title: "Valid YAML",
          value: `Parsed OK; root type: ${kind}`,
          extra: ["This checks syntax only, not custom business rules or JSON Schema equivalents."],
        };
      } catch (e) {
        return { title: "YAML error", value: e instanceof Error ? e.message : String(e), error: true };
      }
    }
    case "csv-to-json-converter": {
      const raw = (form.csv || "").trim();
      if (!raw) return invalid("Paste CSV with a header row.");
      const rows = parseCsvRows(raw);
      if (rows.length < 2) return invalid("Need at least a header row and one data row.");
      const headers = rows[0]!.map((h) => h.trim());
      if (headers.some((h) => !h)) return invalid("Header cells must be non-empty.");
      const objects = rows.slice(1).map((r) => {
        const o: Record<string, string> = {};
        headers.forEach((h, idx) => {
          o[h] = r[idx]?.trim() ?? "";
        });
        return o;
      });
      return { title: "JSON rows", value: JSON.stringify(objects, null, 2), extra: [`Rows converted: ${objects.length}`] };
    }
    case "jwt-expiry-checker": {
      const raw = (form.jwt || "").trim();
      if (!raw) return invalid("Paste a JWT.");
      const parts = raw.split(".");
      if (parts.length < 2) return invalid("JWT must have header and payload segments.");
      try {
        const payloadJson = b64UrlToAscii(parts[1]!);
        const payload = JSON.parse(payloadJson) as Record<string, unknown>;
        const readExp = (v: unknown) => {
          if (typeof v === "number" && Number.isFinite(v)) return v;
          if (typeof v === "string" && /^\d+$/.test(v)) return Number(v);
          return null;
        };
        const exp = readExp(payload.exp);
        const nowSec = Math.floor(Date.now() / 1000);
        const lines: string[] = [];
        if (typeof exp === "number") {
          const d = new Date(exp * 1000);
          lines.push(`exp (UTC): ${d.toISOString()}`);
          const delta = exp - nowSec;
          if (delta > 0) lines.push(`Time remaining: ${Math.floor(delta / 60)} minutes (${delta} seconds).`);
          else lines.push(`Expired ${Math.floor(-delta / 60)} minutes ago (${-delta} seconds).`);
        } else {
          lines.push("No numeric exp claim found; cannot judge expiry from payload alone.");
        }
        const iat = readExp(payload.iat);
        if (typeof iat === "number") lines.push(`iat (UTC): ${new Date(iat * 1000).toISOString()}`);
        return {
          title: "JWT expiry summary",
          value: typeof exp === "number" && exp > nowSec ? "Token not yet expired (by exp)" : typeof exp === "number" ? "Token expired (by exp)" : "Unknown expiry",
          extra: [...lines, "Signature not verified; only diagnostics."],
        };
      } catch (e) {
        return invalid(`Could not read JWT: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    case "api-status-checker": {
      const urlRaw = (form.url || "").trim();
      if (!urlRaw) return invalid("Enter a full http(s) URL.");
      let u: URL;
      try {
        u = new URL(urlRaw);
      } catch {
        return invalid("Could not parse URL; include scheme, e.g. https://api.example.com/health");
      }
      if (u.protocol !== "http:" && u.protocol !== "https:") return invalid("Only http and https URLs are supported.");
      const esc = JSON.stringify(u.toString());
      return {
        title: "Connectivity note",
        value: "URL structure is valid; live HTTP status is not fetched here (sync tool limit).",
        extra: [
          `Host: ${u.host}`,
          `Suggested probe: curl -sI ${esc}`,
          "Browsers block many cross-origin HEAD requests (CORS); use curl, Postman, or your monitor for real status codes.",
        ],
      };
    }
    case "self-employed-tax-calculator-uk": {
      const profit = n(form.annualProfit);
      const tax = n(form.incomeTaxPercent);
      const ni = n(form.niPercent);
      if (profit < 0 || tax < 0 || ni < 0 || tax + ni >= 100) {
        return invalid("Profit and rates must be non-negative; income tax + NI must stay below 100%.");
      }
      const takeHome = profit * (1 - tax / 100 - ni / 100);
      const total = profit - takeHome;
      return {
        title: "Estimated take-home (illustrative)",
        value: `£${takeHome.toFixed(2)} after £${total.toFixed(2)} combined tax + NI sketch`,
        extra: [
          `Inputs: profit £${profit.toFixed(2)}, income tax ${tax}%, NI ${ni}%`,
          "Class 2/4/High Income Band rules are not modeled line-by-line; enter effective percentages from your accountant.",
        ],
      };
    }
    case "dividend-tax-calculator-uk": {
      const gross = n(form.dividendGross);
      const rate = n(form.dividendTaxPercent);
      if (gross < 0 || rate < 0 || rate > 100) return invalid("Dividend gross must be >= 0 and tax rate between 0 and 100.");
      const tax = gross * (rate / 100);
      const net = gross - tax;
      return {
        title: "Dividend after tax (sketch)",
        value: `Net £${net.toFixed(2)} (tax £${tax.toFixed(2)})`,
        extra: [
          "Dividend allowance, personal allowance stacking, and banding are not auto-applied; supply an effective % from your forecast.",
          "Not HMRC advice.",
        ],
      };
    }
    case "stripe-fee-calculator": {
      const amount = n(form.chargeAmount);
      const pct = n(form.feePercent);
      const fixed = n(form.fixedFee);
      if (amount < 0 || pct < 0 || fixed < 0) return invalid("Amount and fees must be non-negative.");
      const fee = amount * (pct / 100) + fixed;
      const net = Math.max(0, amount - fee);
      return {
        title: "Stripe fee estimate",
        value: `Fee ≈ ${fee.toFixed(2)} → Net ${net.toFixed(2)}`,
        extra: ["International cards, FX, Radar, or Billing add-ons are not included unless you fold them into the %."],
      };
    }
    case "paypal-fee-calculator": {
      const amount = n(form.saleAmount);
      const pct = n(form.feePercent);
      const fixed = n(form.fixedFee);
      if (amount < 0 || pct < 0 || fixed < 0) return invalid("Amount and fees must be non-negative.");
      const fee = amount * (pct / 100) + fixed;
      return {
        title: "PayPal fee estimate",
        value: `Fee ≈ ${fee.toFixed(2)} → You keep ${(amount - fee).toFixed(2)}`,
        extra: ["Micropayments, charity, and cross-border tables differ; adjust % and fixed to match your account tier."],
      };
    }
    case "etsy-fee-calculator": {
      const price = n(form.salePrice);
      const txPct = n(form.transactionPercent);
      const payPct = n(form.paymentPercent);
      const listing = n(form.listingFee);
      if (price < 0 || txPct < 0 || payPct < 0 || listing < 0) return invalid("All amounts must be non-negative.");
      const fee = listing + price * (txPct / 100) + price * (payPct / 100);
      return {
        title: "Etsy-style fee sketch",
        value: `Total fees ≈ ${fee.toFixed(2)} → Net ${(price - fee).toFixed(2)}`,
        extra: ["Regulatory operating fee, offsite ads, and VAT on fees are not auto-modeled."],
      };
    }
    case "ebay-fee-calculator": {
      const price = n(form.soldPrice);
      const fv = n(form.finalValuePercent);
      const fixed = n(form.fixedPerOrder);
      if (price < 0 || fv < 0 || fixed < 0) return invalid("Inputs must be non-negative.");
      const fee = price * (fv / 100) + fixed;
      return {
        title: "eBay fee estimate",
        value: `Fees ≈ ${fee.toFixed(2)} → Net ${(price - fee).toFixed(2)}`,
        extra: ["Promoted listings, managed payments FX, and category-specific caps are not enumerated here."],
      };
    }
    case "churn-calculator": {
      const start = n(form.startingCustomers);
      const churn = n(form.monthlyChurnPercent);
      const months = Math.floor(n(form.months));
      if (start < 0 || churn < 0 || churn >= 100 || months < 0) {
        return invalid("Starting customers ≥ 0, churn in [0,100), months ≥ 0.");
      }
      const remaining = start * (1 - churn / 100) ** months;
      const lost = start - remaining;
      return {
        title: "Projected active customers",
        value: `${remaining.toFixed(2)} still active after ${months} month(s)`,
        extra: [
          `Compound model: start ${start}, monthly churn ${churn}%`,
          `Approx customers lost: ${lost.toFixed(2)}`,
          "Reality uses cohort curves, expansion revenue, and reactivation; this is a teaching shortcut.",
        ],
      };
    }
    case "roas-calculator": {
      const spend = n(form.adSpend);
      const revenue = n(form.conversionRevenue);
      if (spend <= 0 || revenue < 0) return invalid("Ad spend must be > 0 and revenue must be ≥ 0.");
      const roas = revenue / spend;
      const roi = spend > 0 ? ((revenue - spend) / spend) * 100 : 0;
      return {
        title: "ROAS & ROI",
        value: `ROAS ${roas.toFixed(2)}×`,
        extra: [`ROI on ad spend: ${roi.toFixed(2)}%`, `Attributed revenue: ${revenue.toFixed(2)}`, `Spend: ${spend.toFixed(2)}`],
      };
    }
    case "working-days-calculator-uk": {
      const start = form.startDate || "";
      const end = form.endDate || "";
      const sub = Math.max(0, Math.floor(n(form.bankHolidayDays)));
      const base = weekdaysInclusiveUtc(start, end);
      if (base < 0) return invalid("Use YYYY-MM-DD for both dates with end on or after start.");
      const net = Math.max(0, base - sub);
      return {
        title: "UK-style working day count",
        value: `${net} weekday day(s) (Mon–Fri in UTC calendar)`,
        extra: [
          `Raw weekdays: ${base}`,
          `Minus bank-holiday adjustment you entered: ${sub}`,
          "Does not embed the UK bank holiday calendar; subtract the holidays that apply to your payroll period.",
        ],
      };
    }
    case "business-days-calculator": {
      const start = form.startDate || "";
      const end = form.endDate || "";
      const base = weekdaysInclusiveUtc(start, end);
      if (base < 0) return invalid("Use YYYY-MM-DD for both dates with end on or after start.");
      return {
        title: "Business days (Mon–Fri)",
        value: `${base} day(s)`,
        extra: ["Counts Monday–Friday inclusive on a UTC calendar date axis; align with your org’s holiday calendar separately."],
      };
    }
    case "random-team-generator": {
      const raw = (form.names || "").trim();
      const teams = Math.max(1, Math.floor(n(form.teamCount, 2)));
      if (!raw) return invalid("Enter at least two names (comma or newline separated).");
      const names = raw
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (names.length < 2) return invalid("Need at least two names to split.");
      shuffleInPlace(names);
      const buckets: string[][] = Array.from({ length: teams }, () => []);
      names.forEach((nm, idx) => {
        buckets[idx % teams]!.push(nm);
      });
      const text = buckets.map((b, i) => `Team ${i + 1}: ${b.join(", ")}`).join("\n");
      return { title: "Random teams", value: text, extra: [`${names.length} people across ${teams} teams`, "Run again for a new shuffle; tie-break fairly in person."] };
    }
    case "lbs-to-kg-converter": {
      const lbs = n(form.lbs);
      if (lbs < 0) return invalid("Pounds must be non-negative.");
      const kg = lbs * 0.45359237;
      return { title: "Kilograms", value: `${kg.toFixed(6)} kg`, extra: [`${lbs} lb × 0.45359237 kg/lb`] };
    }
    case "feet-to-cm-converter": {
      const ft = n(form.feet);
      if (ft < 0) return invalid("Feet must be non-negative.");
      const cm = ft * 30.48;
      return { title: "Centimeters", value: `${cm.toFixed(4)} cm`, extra: [`Decimal feet input: ${ft}`] };
    }
    case "pace-calculator": {
      const dist = n(form.distance);
      const h = Math.max(0, Math.floor(n(form.hours)));
      const m = Math.max(0, Math.min(59, Math.floor(n(form.minutes))));
      const s = Math.max(0, Math.min(59, Math.floor(n(form.seconds))));
      const unit = (form.distanceUnit || "km").trim();
      if (dist <= 0) return invalid("Distance must be > 0.");
      const totalSec = h * 3600 + m * 60 + s;
      if (totalSec <= 0) return invalid("Total time must be > 0.");
      const secPerKm = unit === "mi" ? totalSec / (dist * 1.609344) : totalSec / dist;
      const paceMin = Math.floor(secPerKm / 60);
      const paceSec = Math.round(secPerKm - paceMin * 60);
      const mph = unit === "mi" ? dist / (totalSec / 3600) : dist * 1.609344 / (totalSec / 3600);
      const kmh = unit === "km" ? dist / (totalSec / 3600) : dist * 1.609344 / (totalSec / 3600);
      return {
        title: "Pace & speed",
        value: `${paceMin}:${String(paceSec).padStart(2, "0")} per km`,
        extra: [
          `Speed ≈ ${kmh.toFixed(3)} km/h (${mph.toFixed(3)} mph)`,
          unit === "mi" ? `Input distance: ${dist} miles` : `Input distance: ${dist} km`,
        ],
      };
    }
    case "mph-to-kmh-converter": {
      const mph = n(form.mph);
      if (mph < 0) return invalid("MPH must be non-negative.");
      const kmh = mph * 1.609344;
      return { title: "Kilometres per hour", value: `${kmh.toFixed(4)} km/h`, extra: [`${mph} mph × 1.609344`] };
    }
    case "square-feet-to-square-meters-converter": {
      const sqft = n(form.squareFeet);
      if (sqft < 0) return invalid("Square feet must be non-negative.");
      const sqm = sqft * 0.09290304;
      return { title: "Square metres", value: `${sqm.toFixed(6)} m²`, extra: [`${sqft} sq ft × 0.09290304 m²/sq ft`] };
    }
    default:
      return null;
  }
}
