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

function b64UrlToAscii(b64url: string): string {
  let t = b64url.replace(/-/g, "+").replace(/_/g, "/");
  while (t.length % 4) t += "=";
  const bin = atob(t);
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

function describeCronField(label: string, part: string): string {
  const p = part.trim();
  if (!p) return `${label}: (empty)`;
  if (p === "*") return `${label}: every value`;
  if (/^\*\/\d+$/.test(p)) return `${label}: every ${p.slice(2)} ${label}`;
  if (p.includes(",")) return `${label}: list ${p}`;
  if (p.includes("-")) return `${label}: range ${p}`;
  return `${label}: ${p}`;
}

function basicFormatSql(sql: string): string {
  const s = sql.replace(/\s+/g, " ").trim();
  if (!s) return "";
  const pairs: [RegExp, string][] = [
    [/\bselect\b/gi, "\nSELECT"],
    [/\bfrom\b/gi, "\nFROM"],
    [/\bwhere\b/gi, "\nWHERE"],
    [/\band\b/gi, "\n  AND"],
    [/\bor\b/gi, "\n  OR"],
    [/\border by\b/gi, "\nORDER BY"],
    [/\bgroup by\b/gi, "\nGROUP BY"],
    [/\bhaving\b/gi, "\nHAVING"],
    [/\blimit\b/gi, "\nLIMIT"],
    [/\bleft join\b/gi, "\nLEFT JOIN"],
    [/\bright join\b/gi, "\nRIGHT JOIN"],
    [/\binner join\b/gi, "\nINNER JOIN"],
    [/\bjoin\b/gi, "\nJOIN"],
    [/\bon\b/gi, "\n  ON"],
    [/\binsert into\b/gi, "\nINSERT INTO"],
    [/\bvalues\b/gi, "\nVALUES"],
    [/\bupdate\b/gi, "\nUPDATE"],
    [/\bset\b/gi, "\nSET"],
    [/\bdelete from\b/gi, "\nDELETE FROM"],
  ];
  let out = s;
  for (const [re, rep] of pairs) {
    out = out.replace(re, rep);
  }
  return out.replace(/^\s+/, "").trim();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Minimal Markdown → HTML: headings, lists, paragraphs, **bold**, *italic*, `code`, [text](url), ``` fences ``` */
function markdownSubsetToHtml(src: string): string {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;
  let inCode = false;
  let codeBuf: string[] = [];

  const flushParagraph = (buf: string[]) => {
    if (!buf.length) return;
    const raw = buf.join(" ");
    if (!raw.trim()) return;
    out.push(`<p>${inlineMd(raw)}</p>`);
    buf.length = 0;
  };

  const inlineMd = (text: string): string => {
    let t = escapeHtml(text);
    t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
    t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    t = t.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>');
    return t;
  };

  while (i < lines.length) {
    const line = lines[i] ?? "";
    if (line.trim().startsWith("```")) {
      if (!inCode) {
        inCode = true;
        codeBuf = [];
        i += 1;
        continue;
      }
      inCode = false;
      out.push(`<pre><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`);
      i += 1;
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      i += 1;
      continue;
    }

    const ul = /^(\s*)-\s+(.*)$/.exec(line);
    const ol = /^(\s*)\d+\.\s+(.*)$/.exec(line);
    if (ul || ol) {
      const isOl = Boolean(ol);
      const item = (ul?.[2] ?? ol?.[2] ?? "").trim();
      const type: "ul" | "ol" = isOl ? "ol" : "ul";
      const items: string[] = [item];
      i += 1;
      while (i < lines.length) {
        const L = lines[i] ?? "";
        const u2 = /^(\s*)-\s+(.*)$/.exec(L);
        const o2 = /^(\s*)\d+\.\s+(.*)$/.exec(L);
        if (isOl && o2) {
          items.push(o2[2]!.trim());
          i += 1;
          continue;
        }
        if (!isOl && u2) {
          items.push(u2[2]!.trim());
          i += 1;
          continue;
        }
        break;
      }
      const inner = items.map((it) => `<li>${inlineMd(it)}</li>`).join("");
      out.push(`<${type}>${inner}</${type}>`);
      continue;
    }

    const h3 = /^###\s+(.*)$/.exec(line);
    const h2 = /^##\s+(.*)$/.exec(line);
    const h1 = /^#\s+(.*)$/.exec(line);
    if (h3 || h2 || h1) {
      const content = (h3?.[1] ?? h2?.[1] ?? h1?.[1] ?? "").trim();
      const tag = h3 ? "h3" : h2 ? "h2" : "h1";
      out.push(`<${tag}>${inlineMd(content)}</${tag}>`);
      i += 1;
      continue;
    }

    if (!line.trim()) {
      i += 1;
      continue;
    }

    const para: string[] = [line.trim()];
    i += 1;
    while (i < lines.length && (lines[i] ?? "").trim() && !/^(#|\s*-\s|\s*\d+\.\s|```)/.test((lines[i] ?? "").trim())) {
      para.push((lines[i] ?? "").trim());
      i += 1;
    }
    flushParagraph(para);
  }
  if (inCode && codeBuf.length) {
    out.push(`<pre><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`);
  }
  return out.join("\n");
}

export function computeExpansionPhase1(slug: string, form: Record<string, string>): ToolComputationResult | null {
  switch (slug) {
    case "jwt-decoder": {
      const raw = (form.jwt || "").trim();
      if (!raw) return invalid("Paste a JWT token.");
      const parts = raw.split(".");
      if (parts.length < 2) return invalid("JWT must contain at least header and payload segments.");
      try {
        const headerJson = b64UrlToAscii(parts[0]!);
        const payloadJson = b64UrlToAscii(parts[1]!);
        const header = JSON.parse(headerJson) as Record<string, unknown>;
        const payload = JSON.parse(payloadJson) as Record<string, unknown>;
        const extra: string[] = [];
        const readExp = (v: unknown) => {
          if (typeof v === "number" && Number.isFinite(v)) return v;
          if (typeof v === "string" && /^\d+$/.test(v)) return Number(v);
          return null;
        };
        const exp = readExp(payload.exp);
        const nbf = readExp(payload.nbf);
        const iat = readExp(payload.iat);
        if (typeof exp === "number") {
          extra.push(`exp → ${new Date(exp * 1000).toISOString()} (UTC)`);
        }
        if (typeof nbf === "number") {
          extra.push(`nbf → ${new Date(nbf * 1000).toISOString()} (UTC)`);
        }
        if (typeof iat === "number") {
          extra.push(`iat → ${new Date(iat * 1000).toISOString()} (UTC)`);
        }
        extra.push("Signature segment not verified; treat claims as untrusted until verified server-side.");
        return {
          title: "Decoded JWT",
          value: JSON.stringify({ header, payload }, null, 2),
          extra,
        };
      } catch (e) {
        return invalid(`Could not decode JWT: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    case "uuid-generator": {
      const count = Math.min(50, Math.max(1, Math.floor(n(form.count, 1))));
      const upper = (form.uppercase || "lower") === "upper";
      const ids: string[] = [];
      for (let i = 0; i < count; i += 1) {
        let id =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, (c) => {
                const r = (Math.random() * 16) | 0;
                const v = c === "x" ? r : (r & 0x3) | 0x8;
                return v.toString(16);
              });
        if (upper) id = id.toUpperCase();
        ids.push(id);
      }
      return { title: "UUIDs (v4)", value: ids[0]!, extra: ids.slice(1) };
    }
    case "sql-formatter": {
      const sql = (form.sql || "").trim();
      if (!sql) return invalid("SQL input is required.");
      return { title: "Formatted SQL", value: basicFormatSql(sql) };
    }
    case "cron-expression-generator": {
      const cron = (form.cron || "").trim().replace(/\s+/g, " ");
      if (!cron) return invalid("Enter a cron expression.");
      const fields = cron.split(" ");
      if (fields.length !== 5) {
        return invalid("Provide exactly five fields: minute hour day-of-month month day-of-week.");
      }
      const [min, hour, dom, month, dow] = fields as [string, string, string, string, string];
      const extra = [
        describeCronField("Minute", min),
        describeCronField("Hour", hour),
        describeCronField("Day of month", dom),
        describeCronField("Month", month),
        describeCronField("Day of week", dow),
        "Verify semantics in your scheduler; holidays, timezones, and macros are not expanded here.",
      ];
      return { title: "Cron summary", value: cron, extra };
    }
    case "markdown-to-html-converter": {
      const md = form.md || "";
      if (!md.trim()) return invalid("Paste Markdown content.");
      const html = markdownSubsetToHtml(md);
      return {
        title: "HTML output",
        value: html,
        extra: ["Review with your sanitizer before publishing user-supplied Markdown.", "Subset: headings, lists, paragraphs, bold, italic, inline code, links, fenced code."],
      };
    }
    case "unix-timestamp-converter": {
      const mode = form.mode || "epoch_to_iso";
      const input = (form.input || "").trim();
      if (!input) return invalid("Enter a value to convert.");
      if (mode === "epoch_to_iso") {
        const sec = /^\d{13}$/.test(input) ? Math.floor(Number(input) / 1000) : Number(input);
        if (!Number.isFinite(sec)) return invalid("Epoch must be numeric seconds or 13-digit milliseconds.");
        const d = new Date(sec * 1000);
        if (Number.isNaN(d.getTime())) return invalid("Invalid epoch for Date.");
        return {
          title: "UTC ISO from epoch",
          value: d.toISOString(),
          extra: [`Unix seconds: ${Math.floor(sec)}`, `GMT string: ${d.toUTCString()}`],
        };
      }
      const d = new Date(input);
      if (Number.isNaN(d.getTime())) return invalid("Could not parse datetime; include timezone (Z or ±hh:mm).");
      const sec = Math.floor(d.getTime() / 1000);
      return {
        title: "Epoch seconds",
        value: String(sec),
        extra: [`ISO normalized: ${d.toISOString()}`],
      };
    }
    case "gst-calculator-australia": {
      const amount = n(form.amount);
      if (amount < 0) return invalid("Amount must be non-negative.");
      const mode = form.mode || "exclusive";
      const GST = 0.1;
      if (mode === "inclusive") {
        const net = amount / (1 + GST);
        const gst = amount - net;
        return {
          title: "GST-inclusive → split",
          value: `Net: ${net.toFixed(2)} AUD | GST: ${gst.toFixed(2)} AUD | Gross in: ${amount.toFixed(2)} AUD`,
          extra: ["Rate modeled at 10% standard Australian GST.", "Not tax advice; confirm supply type and rounding with your accountant."],
        };
      }
      const gst = amount * GST;
      const gross = amount + gst;
      return {
        title: "GST-exclusive → add GST",
        value: `Net: ${amount.toFixed(2)} AUD | GST: ${gst.toFixed(2)} AUD | Gross: ${gross.toFixed(2)} AUD`,
        extra: ["Rate modeled at 10% standard Australian GST.", "Not tax advice."],
      };
    }
    case "zakat-calculator": {
      const wealth = n(form.wealth);
      const nisab = n(form.nisab);
      const rate = form.rate?.trim() === "" ? 2.5 : n(form.rate, 2.5);
      if (wealth < 0 || nisab < 0) return invalid("Wealth and nisab must be non-negative.");
      if (rate <= 0 || rate > 100) return invalid("Rate must be between 0 and 100.");
      if (wealth <= nisab) {
        return {
          title: "Zakat estimate",
          value: "No Zakat due on this line; zakatable wealth does not exceed nisab.",
          extra: ["Confirm nisab and eligibility with qualified guidance."],
        };
      }
      const due = (wealth - nisab) * (rate / 100);
      return {
        title: "Estimated Zakat",
        value: `${due.toFixed(2)} (same units as wealth input)`,
        extra: [
          `Surplus above nisab: ${(wealth - nisab).toFixed(2)}`,
          `Applied rate: ${rate}%`,
          "Educational arithmetic only; not a religious ruling.",
        ],
      };
    }
    case "freelance-day-rate-calculator": {
      const target = n(form.annualTarget);
      const days = n(form.billableDays);
      const tax = n(form.taxRate);
      if (target < 0 || days <= 0) return invalid("Target must be >= 0 and billable days must be > 0.");
      if (tax < 0 || tax >= 100) return invalid("Tax/reserve margin must be between 0 and 99%.");
      const grossed = target / (1 - tax / 100);
      const day = grossed / days;
      return {
        title: "Floor day rate (before discounts)",
        value: `${day.toFixed(2)} per billable day`,
        extra: [
          `Gross-up annual need: ${grossed.toFixed(2)} (after ${tax}% margin)`,
          `Billable days/year: ${days}`,
          "Add overhead, bench time, and sales cycles outside this baseline.",
        ],
      };
    }
    case "employee-cost-calculator": {
      const salary = n(form.salary);
      const ben = n(form.benefitsPct);
      const oh = n(form.overheadPct);
      if (salary < 0 || ben < 0 || oh < 0) return invalid("Salary and percentages must be non-negative.");
      const loaded = salary * (1 + ben / 100) * (1 + oh / 100);
      return {
        title: "Loaded annual cost (estimate)",
        value: `${loaded.toFixed(2)}`,
        extra: [
          `Benefits-adjusted subtotal: ${(salary * (1 + ben / 100)).toFixed(2)}`,
          `Overhead factor applied: ${(1 + oh / 100).toFixed(4)}×`,
          "Directional for staffing models; not audited accounting.",
        ],
      };
    }
    case "invoice-late-fee-calculator": {
      const principal = n(form.principal);
      const days = n(form.daysLate);
      const rate = n(form.annualRate);
      if (principal < 0 || days < 0 || rate < 0) return invalid("Principal, days, and rate must be non-negative.");
      const fee = principal * (rate / 100) * (days / 365);
      return {
        title: "Late fee (simple interest)",
        value: `${fee.toFixed(2)} fee → ${(principal + fee).toFixed(2)} total`,
        extra: ["Basis: principal × annual rate × (days ÷ 365).", "Verify legal caps and contract compounding rules."],
      };
    }
    case "stone-to-kg-converter": {
      const v = n(form.value);
      if (v < 0) return invalid("Amount must be non-negative.");
      const STONE_KG = 6.35029318;
      const dir = form.direction || "st_to_kg";
      if (dir === "st_to_kg") {
        return { title: "Kilograms", value: `${(v * STONE_KG).toFixed(6)} kg`, extra: [`${v} st × ${STONE_KG} kg/st`] };
      }
      return { title: "Stone", value: `${(v / STONE_KG).toFixed(6)} st`, extra: [`${v} kg ÷ ${STONE_KG} kg/st`] };
    }
    case "feet-inches-to-cm-converter": {
      const dir = form.direction || "ftin_to_cm";
      if (dir === "cm_to_ftin") {
        const cm = n(form.cm);
        if (cm < 0) return invalid("Centimeters must be non-negative.");
        const totalIn = cm / 2.54;
        const ft = Math.floor(totalIn / 12);
        const inch = totalIn - ft * 12;
        return {
          title: "Feet + inches",
          value: `${ft} ft ${inch.toFixed(3)} in`,
          extra: [`Total inches: ${totalIn.toFixed(4)}`, `Centimeters in: ${cm}`],
        };
      }
      const feet = n(form.feet);
      const inches = n(form.inches);
      if (feet < 0 || inches < 0) return invalid("Feet and inches must be non-negative.");
      const totalIn = feet * 12 + inches;
      const cm = totalIn * 2.54;
      const extra = [`${feet} ft + ${inches} in = ${totalIn.toFixed(4)} total inches`];
      if (inches >= 12) {
        extra.push("Note: inches ≥ 12; consider normalizing to the next foot for familiar height notation.");
      }
      return {
        title: "Centimeters",
        value: `${cm.toFixed(4)} cm`,
        extra,
      };
    }
    case "acres-to-hectares-converter": {
      const v = n(form.value);
      if (v < 0) return invalid("Area must be non-negative.");
      const AC_TO_HA = 0.40468564224;
      const dir = form.direction || "ac_to_ha";
      if (dir === "ac_to_ha") {
        return { title: "Hectares", value: `${(v * AC_TO_HA).toFixed(8)} ha`, extra: [`${v} ac × ${AC_TO_HA} ha/ac`] };
      }
      return { title: "Acres", value: `${(v / AC_TO_HA).toFixed(8)} ac`, extra: [`${v} ha ÷ ${AC_TO_HA} ha/ac`] };
    }
    default:
      return null;
  }
}
