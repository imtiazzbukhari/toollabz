import { computeCpcHighTools } from "./cpc-high-tools-compute";
import { computeExpansionPhase1 } from "./expansion-phase1-compute";
import { computeExpansionPhase2 } from "./expansion-phase2-compute";
import { SMALL_CLAIMS_BY_STATE } from "./small-claims-data";
import type { ToolComputationResult } from "./computation-result";

export type { ToolComputationResult } from "./computation-result";

const n = (value: string | undefined, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const requiredNumber = (value: string | undefined, label: string) => {
  if (value === undefined || value.trim() === "") return `${label} is required.`;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return `${label} must be a valid number.`;
  return null;
};

const validateNonNegative = (value: number, label: string) =>
  value < 0 ? `${label} cannot be negative.` : null;

const invalid = (message: string): ToolComputationResult => ({
  title: "Invalid Input",
  value: message,
  error: true,
});

const money = (value: number) => `$${value.toFixed(2)}`;

const moneyLocale = (value: number) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Typical lifespan ranges (years) - population averages; individual dogs vary widely. */
const DOG_BREED_LIFE_YEARS: Record<string, { min: number; max: number }> = {
  "labrador-retriever": { min: 11, max: 13 },
  "golden-retriever": { min: 10, max: 12 },
  "german-shepherd": { min: 9, max: 13 },
  "french-bulldog": { min: 10, max: 12 },
  "english-bulldog": { min: 8, max: 10 },
  "beagle": { min: 12, max: 15 },
  "standard-poodle": { min: 12, max: 15 },
  "toy-poodle": { min: 14, max: 16 },
  "chihuahua": { min: 14, max: 16 },
  "border-collie": { min: 12, max: 15 },
  "rottweiler": { min: 9, max: 10 },
  "dachshund": { min: 12, max: 16 },
  "siberian-husky": { min: 12, max: 14 },
  "boxer": { min: 10, max: 12 },
  "shih-tzu": { min: 10, max: 16 },
  "yorkshire-terrier": { min: 13, max: 16 },
  "great-dane": { min: 8, max: 10 },
  "doberman-pinscher": { min: 10, max: 12 },
  "australian-shepherd": { min: 12, max: 15 },
  "cavalier-king-charles": { min: 9, max: 14 },
  "jack-russell-terrier": { min: 13, max: 16 },
  "maltese": { min: 12, max: 15 },
  "mixed-small": { min: 12, max: 15 },
  "mixed-medium": { min: 10, max: 13 },
  "mixed-large": { min: 9, max: 12 },
};

function parseISODateLocal(s: string): Date | null {
  const t = s.trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(y, mo - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
  return dt;
}

/** Minutes from midnight for "HH:MM" or "H:MM" (24h). */
function parseHHMM(s: string): number | null {
  const t = s.trim();
  const m = /^(\d{1,2}):(\d{2})$/.exec(t);
  if (!m) return null;
  const h = Number(m[1]);
  const mi = Number(m[2]);
  if (!Number.isInteger(h) || !Number.isInteger(mi) || h < 0 || h > 23 || mi < 0 || mi > 59) return null;
  return h * 60 + mi;
}

function formatDurationMinutes(totalMins: number): string {
  const m = Math.max(0, Math.round(totalMins));
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (h <= 0) return `${r.toLocaleString("en-US")} min`;
  return `${h.toLocaleString("en-US")} hr ${r.toLocaleString("en-US")} min`;
}

const titleCase = (text: string) =>
  text
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export function computeTool(slug: string, form: Record<string, string>): ToolComputationResult {
  const cpc = computeCpcHighTools(slug, form);
  if (cpc) return cpc;
  const phase1 = computeExpansionPhase1(slug, form);
  if (phase1) return phase1;
  const phase2 = computeExpansionPhase2(slug, form);
  if (phase2) return phase2;
  switch (slug) {
    case "cm-to-feet": {
      const err = requiredNumber(form.cm, "Centimeters");
      if (err) return invalid(err);
      const cm = n(form.cm);
      const neg = validateNonNegative(cm, "Centimeters");
      if (neg) return invalid(neg);
      const feet = cm / 30.48;
      return { title: "Converted Value", value: `${feet.toFixed(4)} ft` };
    }
    case "kg-to-lbs": {
      const err = requiredNumber(form.kg, "Kilograms");
      if (err) return invalid(err);
      const kg = n(form.kg);
      const neg = validateNonNegative(kg, "Kilograms");
      if (neg) return invalid(neg);
      return { title: "Converted Value", value: `${(kg * 2.20462).toFixed(4)} lbs` };
    }
    case "km-to-miles": {
      const err = requiredNumber(form.km, "Kilometers");
      if (err) return invalid(err);
      const km = n(form.km);
      const neg = validateNonNegative(km, "Kilometers");
      if (neg) return invalid(neg);
      return { title: "Converted Value", value: `${(km * 0.621371).toFixed(4)} miles` };
    }
    case "celsius-to-fahrenheit": {
      const err = requiredNumber(form.celsius, "Celsius");
      if (err) return invalid(err);
      const celsius = n(form.celsius);
      return { title: "Converted Value", value: `${((celsius * 9) / 5 + 32).toFixed(2)} °F` };
    }
    case "mb-to-gb": {
      const err = requiredNumber(form.mb, "Megabytes");
      if (err) return invalid(err);
      const mb = n(form.mb);
      const neg = validateNonNegative(mb, "Megabytes");
      if (neg) return invalid(neg);
      return { title: "Converted Value", value: `${(mb / 1024).toFixed(4)} GB` };
    }
    case "loan-calculator": {
      const errs = [
        requiredNumber(form.principal, "Loan Amount"),
        requiredNumber(form.rate, "Annual Interest"),
        requiredNumber(form.years, "Tenure"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const p = n(form.principal), r = n(form.rate) / 1200, m = n(form.years) * 12;
      if (p <= 0 || m <= 0) return invalid("Loan amount and tenure must be greater than zero.");
      if (r < 0) return invalid("Interest rate cannot be negative.");
      const emi = r === 0 ? p / m : (p * r * (1 + r) ** m) / ((1 + r) ** m - 1);
      return { title: "Monthly Payment", value: money(emi), extra: [ `Total Payable: ${money(emi * m)}`, `Total Interest: ${money(emi * m - p)}` ] };
    }
    case "emi-calculator": {
      const errs = [
        requiredNumber(form.principal, "Principal"),
        requiredNumber(form.rate, "Interest"),
        requiredNumber(form.months, "Months"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const p = n(form.principal), r = n(form.rate) / 1200, m = n(form.months);
      if (p <= 0 || m <= 0) return invalid("Principal and months must be greater than zero.");
      if (r < 0) return invalid("Interest rate cannot be negative.");
      const emi = r === 0 ? p / m : (p * r * (1 + r) ** m) / ((1 + r) ** m - 1);
      return { title: "EMI", value: money(emi), extra: [ `Interest: ${money(emi * m - p)}` ] };
    }
    case "compound-interest-calculator": {
      const errs = [
        requiredNumber(form.principal, "Principal"),
        requiredNumber(form.rate, "Annual Rate"),
        requiredNumber(form.years, "Years"),
        requiredNumber(form.frequency, "Compounds per Year"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const p = n(form.principal), r = n(form.rate) / 100, t = n(form.years), f = n(form.frequency, 1);
      if (p < 0 || r < 0 || t < 0 || f <= 0) return invalid("Principal/Rate/Years must be non-negative and frequency must be > 0.");
      const a = p * (1 + r / f) ** (f * t);
      return { title: "Future Value", value: money(a), extra: [ `Interest Earned: ${money(a - p)}` ] };
    }
    case "salary-after-tax-calculator": {
      const errs = [
        requiredNumber(form.salary, "Gross Salary"),
        requiredNumber(form.taxRate, "Tax Rate"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const gross = n(form.salary), taxRate = n(form.taxRate) / 100;
      if (gross < 0) return invalid("Gross salary cannot be negative.");
      if (taxRate < 0 || taxRate > 1) return invalid("Tax rate must be between 0 and 100.");
      const net = gross * (1 - taxRate);
      return { title: "Net Salary", value: money(net), extra: [ `Tax: ${money(gross - net)}` ] };
    }
    case "stock-profit-calculator": {
      const errs = [
        requiredNumber(form.buy, "Buy Price"),
        requiredNumber(form.sell, "Sell Price"),
        requiredNumber(form.qty, "Quantity"),
        requiredNumber(form.fee, "Fees"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const profit = (n(form.sell) - n(form.buy)) * n(form.qty) - n(form.fee);
      if (n(form.buy) < 0 || n(form.sell) < 0 || n(form.qty) <= 0 || n(form.fee) < 0) return invalid("Prices/fees must be non-negative and quantity must be > 0.");
      return { title: "Profit / Loss", value: money(profit) };
    }
    case "word-counter": {
      const text = form.text || "";
      if (!text.trim()) return invalid("Please enter text to count.");
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      return { title: "Word Count", value: String(words), extra: [ `Characters: ${text.length}`, `Lines: ${text ? text.split(/\n/).length : 0}` ] };
    }
    case "case-converter": {
      const text = form.text || ""; const mode = form.mode || "upper";
      const value = mode === "upper" ? text.toUpperCase() : mode === "lower" ? text.toLowerCase() : mode === "title" ? titleCase(text) : text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      return { title: "Converted Text", value };
    }
    case "password-generator": {
      const length = Math.max(6, n(form.length, 12));
      if (!Number.isFinite(length) || length > 256) return invalid("Length must be between 6 and 256.");
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" + ((form.symbols || "yes") === "yes" ? "!@#$%^&*()_+" : "");
      let pwd = "";
      for (let i = 0; i < length; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
      return { title: "Generated Password", value: pwd };
    }
    case "json-formatter": {
      if (!(form.json || "").trim()) return invalid("JSON input is required.");
      try {
        const parsed = JSON.parse(form.json || "{}");
        return { title: "Formatted JSON", value: JSON.stringify(parsed, null, 2) };
      } catch (error) {
        return { title: "JSON Error", value: `Invalid JSON: ${(error as Error).message}`, error: true };
      }
    }
    case "json-validator": {
      if (!(form.json || "").trim()) return invalid("JSON input is required.");
      try {
        const parsed = JSON.parse(form.json || "{}");
        const formatted = JSON.stringify(parsed, null, 2);
        return {
          title: "Valid JSON",
          value: formatted,
          extra: [
            "Status: parsed successfully (syntax OK).",
            `Root type: ${Array.isArray(parsed) ? "array" : parsed !== null && typeof parsed === "object" ? "object" : typeof parsed}`,
            "This tool does not validate schemas (JSON Schema) - only parseability.",
          ],
        };
      } catch (error) {
        return { title: "Invalid JSON", value: (error as Error).message, error: true };
      }
    }
    case "color-palette-generator": {
      const base = (form.hex || "#7c3aed").replace("#", "").padEnd(6, "0").slice(0, 6);
      if (!/^[0-9a-fA-F]{6}$/.test(base)) return invalid("Color must be a valid hex value like #7C3AED.");
      const r = parseInt(base.slice(0, 2), 16), g = parseInt(base.slice(2, 4), 16), b = parseInt(base.slice(4, 6), 16);
      const shades = [0.15, 0.35, 0.55, 0.75].map((f) => `#${[r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v * f))).toString(16).padStart(2, "0")).join("")}`);
      return { title: "Generated Palette", value: `#${base}`, extra: shades };
    }
    case "rental-yield-calculator": {
      const rent = n(form.annualRent), price = n(form.propertyPrice);
      if (rent < 0 || price <= 0) return invalid("Annual rent must be >= 0 and property price must be > 0.");
      return { title: "Rental Yield", value: `${((rent / price) * 100).toFixed(2)}%` };
    }
    case "property-roi-calculator":
    case "roi-calculator":
    case "roi-calculator-marketing":
      if (n(form.cost) <= 0) return invalid("Cost must be greater than zero.");
      return { title: "ROI", value: `${((n(form.gain) / n(form.cost)) * 100).toFixed(2)}%` };
    case "mortgage-affordability-calculator": {
      if (n(form.income) < 0 || n(form.debt) < 0 || n(form.ratio) <= 0 || n(form.ratio) > 100) return invalid("Income/debt must be non-negative and DTI ratio must be between 0 and 100.");
      const affordable = (n(form.income) * (n(form.ratio, 36) / 100) - n(form.debt)) * 12 * 25;
      return { title: "Estimated Mortgage", value: money(Math.max(0, affordable)) };
    }
    case "rent-vs-buy-calculator": {
      if (n(form.rent) < 0 || n(form.buyCost) < 0 || n(form.years) <= 0) return invalid("Rent/buy cost must be non-negative and years must be > 0.");
      const rentTotal = n(form.rent) * 12 * n(form.years);
      const buyTotal = n(form.buyCost) * 12 * n(form.years);
      return { title: "Comparison", value: rentTotal < buyTotal ? `Rent saves ${money(buyTotal - rentTotal)}` : `Buy saves ${money(rentTotal - buyTotal)}` };
    }
    case "break-even-calculator":
    case "break-even-calculator-business": {
      const contribution = n(form.price) - n(form.variable);
      if (n(form.fixed) < 0 || contribution <= 0) return invalid("Fixed cost must be >= 0 and price must be greater than variable cost.");
      const units = n(form.fixed) / contribution;
      return { title: "Break-even Units", value: units.toFixed(2), extra: [ `Break-even Revenue: ${money(units * n(form.price))}` ] };
    }
    case "profit-margin-calculator":
    case "profit-margin-calculator-business":
      if (n(form.revenue) <= 0 || n(form.cost) < 0) return invalid("Revenue must be > 0 and cost must be >= 0.");
      return { title: "Profit Margin", value: `${(((n(form.revenue) - n(form.cost)) / n(form.revenue, 1)) * 100).toFixed(2)}%` };
    case "cac-calculator":
    case "cac-calculator-saas":
      if (n(form.customers) <= 0 || n(form.salesMarketing) < 0) return invalid("Spend must be >= 0 and new customers must be > 0.");
      return { title: "CAC", value: money(n(form.salesMarketing) / n(form.customers)) };
    case "ltv-calculator":
    case "ltv-calculator-saas": {
      const churn = n(form.churn);
      if (n(form.arpu) < 0 || churn <= 0 || churn >= 100 || n(form.grossMargin) <= 0 || n(form.grossMargin) > 100) return invalid("ARPU must be >= 0, gross margin in (0,100], churn in (0,100).");
      const ltv = n(form.arpu) * (n(form.grossMargin) / 100) / (churn / 100);
      return { title: "LTV", value: money(ltv) };
    }
    case "adsense-earnings-calculator":
      if (n(form.views) < 0 || n(form.ctr) < 0 || n(form.cpc) < 0) return invalid("Views, CTR, and CPC must be non-negative.");
      return { title: "Estimated Earnings", value: money((n(form.views) * (n(form.ctr) / 100) * n(form.cpc))) };
    case "youtube-earnings-calculator":
      if (n(form.views) < 0 || n(form.rpm) < 0) return invalid("Views and RPM must be non-negative.");
      return { title: "Estimated Earnings", value: money((n(form.views) / 1000) * n(form.rpm)) };
    case "conversion-rate-calculator":
      if (n(form.conversions) < 0 || n(form.visitors) <= 0 || n(form.conversions) > n(form.visitors)) return invalid("Visitors must be > 0 and conversions must be between 0 and visitors.");
      return { title: "Conversion Rate", value: `${((n(form.conversions) / n(form.visitors, 1)) * 100).toFixed(2)}%` };
    case "cpc-calculator":
      if (n(form.spend) < 0 || n(form.clicks) <= 0) return invalid("Spend must be >= 0 and clicks must be > 0.");
      return { title: "CPC", value: money(n(form.spend) / n(form.clicks)) };
    case "affiliate-earnings-calculator":
      if (n(form.clicks) < 0 || n(form.conv) < 0 || n(form.conv) > 100 || n(form.commission) < 0) return invalid("Clicks/commission must be non-negative and conversion rate must be 0-100.");
      return { title: "Affiliate Earnings", value: money(n(form.clicks) * (n(form.conv) / 100) * n(form.commission)) };
    case "crypto-tax-calculator":
      if (n(form.gain) < 0 || n(form.taxRate) < 0 || n(form.taxRate) > 100) return invalid("Gain must be non-negative and tax rate must be 0-100.");
      return { title: "Estimated Tax", value: money(n(form.gain) * (n(form.taxRate) / 100)) };
    case "debt-payoff-calculator-snowball": {
      const errs = [
        requiredNumber(form.totalDebt, "Total Debt Balance"),
        requiredNumber(form.avgApr, "Average APR"),
        requiredNumber(form.monthlyPayment, "Monthly Debt Budget"),
        requiredNumber(form.smallestDebt, "Smallest Debt Balance"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);

      const debt = n(form.totalDebt);
      const apr = n(form.avgApr);
      const payment = n(form.monthlyPayment);
      const smallestDebt = n(form.smallestDebt);
      if (debt <= 0 || payment <= 0) return invalid("Total debt and monthly payment must be greater than zero.");
      if (apr < 0 || smallestDebt < 0) return invalid("APR and smallest debt cannot be negative.");
      if (smallestDebt > debt) return invalid("Smallest debt cannot be greater than total debt.");

      const monthlyRate = apr / 1200;
      if (monthlyRate > 0 && payment <= debt * monthlyRate) {
        return invalid("Monthly payment is too low to cover interest. Increase payment to reduce debt.");
      }

      const payoffMonths = monthlyRate === 0
        ? debt / payment
        : -Math.log(1 - (debt * monthlyRate) / payment) / Math.log(1 + monthlyRate);
      const roundedMonths = Math.max(1, Math.ceil(payoffMonths));
      const totalPaid = roundedMonths * payment;
      const interestPaid = Math.max(0, totalPaid - debt);
      const firstDebtPayoffMonths = Math.max(1, Math.ceil(smallestDebt / payment));

      const debtFreeDate = new Date();
      debtFreeDate.setMonth(debtFreeDate.getMonth() + roundedMonths);

      return {
        title: "Estimated Debt-Free Timeline (Snowball)",
        value: `${roundedMonths} months`,
        extra: [
          `Estimated Debt-Free Date: ${debtFreeDate.toLocaleDateString()}`,
          `Estimated Total Interest: ${money(interestPaid)}`,
          `First Debt Payoff (Smallest Balance): ~${firstDebtPayoffMonths} month(s)`,
        ],
      };
    }
    case "debt-payoff-calculator-avalanche": {
      const errs = [
        requiredNumber(form.totalDebt, "Total Debt Balance"),
        requiredNumber(form.avgApr, "Average APR"),
        requiredNumber(form.monthlyPayment, "Monthly Debt Budget"),
        requiredNumber(form.highestAprDebt, "Highest APR Debt Balance"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);

      const debt = n(form.totalDebt);
      const apr = n(form.avgApr);
      const payment = n(form.monthlyPayment);
      const highestAprDebt = n(form.highestAprDebt);
      if (debt <= 0 || payment <= 0) return invalid("Total debt and monthly payment must be greater than zero.");
      if (apr < 0 || highestAprDebt < 0) return invalid("APR and highest APR debt cannot be negative.");
      if (highestAprDebt > debt) return invalid("Highest APR debt cannot be greater than total debt.");

      const monthlyRate = apr / 1200;
      if (monthlyRate > 0 && payment <= debt * monthlyRate) {
        return invalid("Monthly payment is too low to cover interest. Increase payment to reduce debt.");
      }

      const payoffMonths = monthlyRate === 0
        ? debt / payment
        : -Math.log(1 - (debt * monthlyRate) / payment) / Math.log(1 + monthlyRate);
      const roundedMonths = Math.max(1, Math.ceil(payoffMonths));
      const totalPaid = roundedMonths * payment;
      const baseInterest = Math.max(0, totalPaid - debt);
      const weightedSaving = highestAprDebt > 0 && apr > 0 ? highestAprDebt * (apr / 100) * 0.015 : 0;
      const estimatedInterest = Math.max(0, baseInterest - weightedSaving);

      const debtFreeDate = new Date();
      debtFreeDate.setMonth(debtFreeDate.getMonth() + roundedMonths);

      return {
        title: "Estimated Debt-Free Timeline (Avalanche)",
        value: `${roundedMonths} months`,
        extra: [
          `Estimated Debt-Free Date: ${debtFreeDate.toLocaleDateString()}`,
          `Estimated Total Interest: ${money(estimatedInterest)}`,
          "Strategy Focus: Highest APR balances first",
        ],
      };
    }
    case "credit-card-interest-calculator": {
      const errs = [
        requiredNumber(form.balance, "Current Credit Card Balance"),
        requiredNumber(form.apr, "Card APR"),
        requiredNumber(form.monthlyPayment, "Monthly Payment"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);

      const balance = n(form.balance);
      const apr = n(form.apr);
      const payment = n(form.monthlyPayment);
      if (balance < 0 || apr < 0 || payment <= 0) return invalid("Balance and APR must be non-negative and payment must be greater than zero.");

      const monthlyRate = apr / 1200;
      const monthlyInterest = balance * monthlyRate;
      const annualInterest = monthlyInterest * 12;
      if (balance > 0 && payment <= monthlyInterest) {
        return invalid("Monthly payment must be higher than monthly interest to reduce balance.");
      }
      const payoffMonths = monthlyRate === 0
        ? balance / payment
        : -Math.log(1 - (balance * monthlyRate) / payment) / Math.log(1 + monthlyRate);

      return {
        title: "Estimated Monthly Interest",
        value: money(monthlyInterest),
        extra: [
          `Estimated Annual Interest: ${money(annualInterest)}`,
          `Estimated Payoff Time: ${Math.max(1, Math.ceil(payoffMonths))} months`,
          `Interest Share of Payment: ${payment > 0 ? ((monthlyInterest / payment) * 100).toFixed(2) : "0.00"}%`,
        ],
      };
    }
    case "credit-utilization-calculator": {
      const errs = [
        requiredNumber(form.totalBalance, "Total Card Balances"),
        requiredNumber(form.totalLimit, "Total Credit Limit"),
        requiredNumber(form.cardBalance, "Single Card Balance"),
        requiredNumber(form.cardLimit, "Single Card Limit"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);

      const totalBalance = n(form.totalBalance);
      const totalLimit = n(form.totalLimit);
      const cardBalance = n(form.cardBalance);
      const cardLimit = n(form.cardLimit);

      if (totalBalance < 0 || cardBalance < 0) return invalid("Balances cannot be negative.");
      if (totalLimit <= 0 || cardLimit <= 0) return invalid("Credit limits must be greater than zero.");
      if (totalBalance > totalLimit) return invalid("Total balances cannot exceed total credit limit.");
      if (cardBalance > cardLimit) return invalid("Single card balance cannot exceed card limit.");

      const totalUtilization = (totalBalance / totalLimit) * 100;
      const cardUtilization = (cardBalance / cardLimit) * 100;
      const band = totalUtilization <= 10 ? "Excellent" : totalUtilization <= 30 ? "Good" : totalUtilization <= 50 ? "Fair" : "High";

      return {
        title: "Total Credit Utilization",
        value: `${totalUtilization.toFixed(2)}%`,
        extra: [
          `Single Card Utilization: ${cardUtilization.toFixed(2)}%`,
          `Utilization Band: ${band}`,
          `Target Balance for 30% Total Utilization: ${money(totalLimit * 0.3)}`,
        ],
      };
    }
    case "early-loan-payoff-calculator": {
      const errs = [
        requiredNumber(form.principal, "Current Loan Balance"),
        requiredNumber(form.apr, "Loan APR"),
        requiredNumber(form.remainingMonths, "Remaining Term"),
        requiredNumber(form.extraPayment, "Extra Monthly Payment"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);

      const principal = n(form.principal);
      const apr = n(form.apr);
      const remainingMonths = n(form.remainingMonths);
      const extraPayment = n(form.extraPayment);
      if (principal <= 0 || remainingMonths <= 0) return invalid("Loan balance and remaining term must be greater than zero.");
      if (apr < 0 || extraPayment < 0) return invalid("APR and extra payment cannot be negative.");

      const monthlyRate = apr / 1200;
      const basePayment = monthlyRate === 0
        ? principal / remainingMonths
        : (principal * monthlyRate * (1 + monthlyRate) ** remainingMonths) / ((1 + monthlyRate) ** remainingMonths - 1);
      const acceleratedPayment = basePayment + extraPayment;
      if (monthlyRate > 0 && acceleratedPayment <= principal * monthlyRate) {
        return invalid("Total monthly payment must be above monthly interest to reduce principal.");
      }
      const acceleratedMonths = monthlyRate === 0
        ? principal / Math.max(acceleratedPayment, 0.0001)
        : -Math.log(1 - (principal * monthlyRate) / acceleratedPayment) / Math.log(1 + monthlyRate);
      const roundedAcceleratedMonths = Math.max(1, Math.ceil(acceleratedMonths));

      const baseTotalPaid = basePayment * remainingMonths;
      const acceleratedTotalPaid = acceleratedPayment * roundedAcceleratedMonths;
      const interestSaved = Math.max(0, (baseTotalPaid - principal) - (acceleratedTotalPaid - principal));
      const monthsSaved = Math.max(0, Math.ceil(remainingMonths - roundedAcceleratedMonths));

      return {
        title: "Accelerated Payoff Timeline",
        value: `${roundedAcceleratedMonths} months`,
        extra: [
          `Estimated Months Saved: ${monthsSaved}`,
          `Estimated Interest Saved: ${money(interestSaved)}`,
          `New Monthly Payment: ${money(acceleratedPayment)}`,
        ],
      };
    }
    case "refinance-calculator-mortgage":
    case "mortgage-refinance-calculator": {
      const errs = [
        requiredNumber(form.currentBalance, "Current Mortgage Balance"),
        requiredNumber(form.currentRate, "Current Interest Rate"),
        requiredNumber(form.newRate, "New Interest Rate"),
        requiredNumber(form.remainingYears, "Remaining Term"),
        requiredNumber(form.closingCosts, "Refinance Closing Costs"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);

      const balance = n(form.currentBalance);
      const currentRate = n(form.currentRate);
      const newRate = n(form.newRate);
      const years = n(form.remainingYears);
      const closingCosts = n(form.closingCosts);
      if (balance <= 0 || years <= 0) return invalid("Balance and remaining term must be greater than zero.");
      if (currentRate < 0 || newRate < 0 || closingCosts < 0) return invalid("Rates and closing costs cannot be negative.");

      const months = years * 12;
      const currentMonthlyRate = currentRate / 1200;
      const newMonthlyRate = newRate / 1200;

      const currentPayment = currentMonthlyRate === 0
        ? balance / months
        : (balance * currentMonthlyRate * (1 + currentMonthlyRate) ** months) / ((1 + currentMonthlyRate) ** months - 1);
      const newPayment = newMonthlyRate === 0
        ? balance / months
        : (balance * newMonthlyRate * (1 + newMonthlyRate) ** months) / ((1 + newMonthlyRate) ** months - 1);
      const monthlySavings = currentPayment - newPayment;
      const breakEvenMonths = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : 0;
      const totalSavings = monthlySavings > 0 ? monthlySavings * months - closingCosts : -closingCosts;

      return {
        title: "Estimated New Mortgage Payment",
        value: money(newPayment),
        extra: [
          `Current Monthly Payment: ${money(currentPayment)}`,
          `Monthly Savings: ${money(monthlySavings)}`,
          `Break-even: ${breakEvenMonths > 0 ? `${breakEvenMonths} month(s)` : "No break-even with current assumptions"}`,
          `Projected Net Savings Over Term: ${money(totalSavings)}`,
        ],
      };
    }
    case "emergency-fund-calculator": {
      const errs = [
        requiredNumber(form.monthlyExpenses, "Monthly Essential Expenses"),
        requiredNumber(form.monthsCoverage, "Target Coverage"),
        requiredNumber(form.currentSavings, "Current Emergency Savings"),
        requiredNumber(form.monthlyContribution, "Monthly Contribution"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);

      const monthlyExpenses = n(form.monthlyExpenses);
      const monthsCoverage = n(form.monthsCoverage);
      const currentSavings = n(form.currentSavings);
      const monthlyContribution = n(form.monthlyContribution);
      if (monthlyExpenses <= 0 || monthsCoverage <= 0 || monthlyContribution <= 0) {
        return invalid("Expenses, coverage months, and monthly contribution must be greater than zero.");
      }
      if (currentSavings < 0) return invalid("Current savings cannot be negative.");

      const target = monthlyExpenses * monthsCoverage;
      const shortfall = Math.max(0, target - currentSavings);
      const monthsToGoal = shortfall === 0 ? 0 : Math.ceil(shortfall / monthlyContribution);

      return {
        title: "Emergency Fund Target",
        value: money(target),
        extra: [
          `Current Saved: ${money(currentSavings)}`,
          `Remaining to Goal: ${money(shortfall)}`,
          `Estimated Time to Goal: ${monthsToGoal} month(s)`,
        ],
      };
    }
    case "savings-interest-calculator-usa": {
      const errs = [
        requiredNumber(form.initialDeposit, "Initial Deposit"),
        requiredNumber(form.monthlyDeposit, "Monthly Deposit"),
        requiredNumber(form.apy, "APY"),
        requiredNumber(form.years, "Saving Period"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);

      const initialDeposit = n(form.initialDeposit);
      const monthlyDeposit = n(form.monthlyDeposit);
      const apy = n(form.apy);
      const years = n(form.years);
      if (initialDeposit < 0 || monthlyDeposit < 0 || apy < 0 || years <= 0) {
        return invalid("Initial deposit/monthly deposit/APY must be non-negative and years must be greater than zero.");
      }

      const months = years * 12;
      const monthlyRate = apy / 1200;
      const growth = monthlyRate === 0
        ? initialDeposit + monthlyDeposit * months
        : initialDeposit * (1 + monthlyRate) ** months + monthlyDeposit * (((1 + monthlyRate) ** months - 1) / monthlyRate);
      const contributions = initialDeposit + monthlyDeposit * months;
      const interest = growth - contributions;

      return {
        title: "Projected Savings Balance",
        value: money(growth),
        extra: [
          `Total Contributions: ${money(contributions)}`,
          `Estimated Interest Earned: ${money(interest)}`,
          `Savings Period: ${months} months`,
        ],
      };
    }
    case "paycheck-calculator-usa": {
      const errs = [
        requiredNumber(form.annualSalary, "Annual Salary"),
        requiredNumber(form.federalTaxRate, "Federal Tax Rate"),
        requiredNumber(form.stateTaxRate, "State Tax Rate"),
        requiredNumber(form.otherDeductions, "Other Deductions"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);

      const annualSalary = n(form.annualSalary);
      const federalTaxRate = n(form.federalTaxRate);
      const stateTaxRate = n(form.stateTaxRate);
      const otherDeductions = n(form.otherDeductions);
      const frequency = n(form.payFrequency, 26);
      if (annualSalary <= 0 || frequency <= 0) return invalid("Annual salary and pay frequency must be greater than zero.");
      if (federalTaxRate < 0 || stateTaxRate < 0 || otherDeductions < 0) return invalid("Deduction rates cannot be negative.");

      const totalRate = (federalTaxRate + stateTaxRate + otherDeductions) / 100;
      if (totalRate >= 1) return invalid("Combined deduction rate must be less than 100%.");

      const grossPerPaycheck = annualSalary / frequency;
      const netPerPaycheck = grossPerPaycheck * (1 - totalRate);
      const annualTakeHome = annualSalary * (1 - totalRate);

      return {
        title: "Estimated Net Paycheck (USA)",
        value: money(netPerPaycheck),
        extra: [
          `Gross Per Paycheck: ${money(grossPerPaycheck)}`,
          `Estimated Annual Take-home: ${money(annualTakeHome)}`,
          `Total Deduction Rate: ${(totalRate * 100).toFixed(2)}%`,
        ],
      };
    }
    case "hourly-to-salary-converter-usa": {
      const errs = [
        requiredNumber(form.hourlyRate, "Hourly Rate"),
        requiredNumber(form.hoursPerWeek, "Hours per Week"),
        requiredNumber(form.weeksPerYear, "Weeks per Year"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);

      const hourlyRate = n(form.hourlyRate);
      const hoursPerWeek = n(form.hoursPerWeek);
      const weeksPerYear = n(form.weeksPerYear);
      if (hourlyRate <= 0 || hoursPerWeek <= 0 || weeksPerYear <= 0) {
        return invalid("Hourly rate, hours per week, and weeks per year must be greater than zero.");
      }

      const annual = hourlyRate * hoursPerWeek * weeksPerYear;
      const monthly = annual / 12;
      const weekly = hourlyRate * hoursPerWeek;

      return {
        title: "Estimated Annual Salary (USA)",
        value: money(annual),
        extra: [
          `Estimated Monthly Salary: ${money(monthly)}`,
          `Estimated Weekly Pay: ${money(weekly)}`,
          `Hourly Rate Used: ${money(hourlyRate)}`,
        ],
      };
    }
    case "paycheck-calculator-california": {
      const errs = [
        requiredNumber(form.annualSalary, "Annual Salary"),
        requiredNumber(form.federalTaxRate, "Federal Tax Rate"),
        requiredNumber(form.stateTaxRate, "California State Tax Rate"),
        requiredNumber(form.otherDeductions, "Other Deductions"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const annualSalary = n(form.annualSalary);
      const federalTaxRate = n(form.federalTaxRate);
      const stateTaxRate = n(form.stateTaxRate);
      const otherDeductions = n(form.otherDeductions);
      const frequency = n(form.payFrequency, 26);
      if (annualSalary <= 0 || frequency <= 0) return invalid("Annual salary and pay frequency must be greater than zero.");
      if (federalTaxRate < 0 || stateTaxRate < 0 || otherDeductions < 0) return invalid("Tax and deduction rates cannot be negative.");
      const totalRate = (federalTaxRate + stateTaxRate + otherDeductions) / 100;
      if (totalRate >= 1) return invalid("Combined deduction rate must be less than 100%.");

      const grossPerPaycheck = annualSalary / frequency;
      const netPerPaycheck = grossPerPaycheck * (1 - totalRate);
      const annualTakeHome = annualSalary * (1 - totalRate);
      return {
        title: "Estimated Net Paycheck (California)",
        value: money(netPerPaycheck),
        extra: [
          `Gross Per Paycheck: ${money(grossPerPaycheck)}`,
          `Estimated Annual Take-home: ${money(annualTakeHome)}`,
          `Combined Deduction Rate: ${(totalRate * 100).toFixed(2)}%`,
        ],
      };
    }
    case "paycheck-calculator-texas": {
      const errs = [
        requiredNumber(form.annualSalary, "Annual Salary"),
        requiredNumber(form.federalTaxRate, "Federal Tax Rate"),
        requiredNumber(form.otherDeductions, "Other Deductions"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const annualSalary = n(form.annualSalary);
      const federalTaxRate = n(form.federalTaxRate);
      const otherDeductions = n(form.otherDeductions);
      const frequency = n(form.payFrequency, 26);
      if (annualSalary <= 0 || frequency <= 0) return invalid("Annual salary and pay frequency must be greater than zero.");
      if (federalTaxRate < 0 || otherDeductions < 0) return invalid("Tax and deduction rates cannot be negative.");
      const totalRate = (federalTaxRate + otherDeductions) / 100;
      if (totalRate >= 1) return invalid("Combined deduction rate must be less than 100%.");

      const grossPerPaycheck = annualSalary / frequency;
      const netPerPaycheck = grossPerPaycheck * (1 - totalRate);
      const annualTakeHome = annualSalary * (1 - totalRate);
      return {
        title: "Estimated Net Paycheck (Texas)",
        value: money(netPerPaycheck),
        extra: [
          `Gross Per Paycheck: ${money(grossPerPaycheck)}`,
          `Estimated Annual Take-home: ${money(annualTakeHome)}`,
          "State Income Tax Assumption: 0%",
        ],
      };
    }
    case "salary-to-hourly-converter-usa": {
      const errs = [
        requiredNumber(form.annualSalary, "Annual Salary"),
        requiredNumber(form.hoursPerWeek, "Hours per Week"),
        requiredNumber(form.weeksPerYear, "Weeks per Year"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const annualSalary = n(form.annualSalary);
      const hoursPerWeek = n(form.hoursPerWeek);
      const weeksPerYear = n(form.weeksPerYear);
      if (annualSalary <= 0 || hoursPerWeek <= 0 || weeksPerYear <= 0) {
        return invalid("Annual salary, hours per week, and weeks per year must be greater than zero.");
      }
      const annualHours = hoursPerWeek * weeksPerYear;
      const hourlyRate = annualSalary / annualHours;
      const weekly = annualSalary / weeksPerYear;
      const monthly = annualSalary / 12;

      return {
        title: "Estimated Hourly Rate (USA)",
        value: money(hourlyRate),
        extra: [
          `Estimated Weekly Pay: ${money(weekly)}`,
          `Estimated Monthly Salary: ${money(monthly)}`,
          `Annual Hours Assumed: ${annualHours.toFixed(1)}`,
        ],
      };
    }
    case "overtime-pay-calculator-usa": {
      const errs = [
        requiredNumber(form.hourlyRate, "Hourly Rate"),
        requiredNumber(form.regularHours, "Regular Hours Worked"),
        requiredNumber(form.overtimeHours, "Overtime Hours Worked"),
        requiredNumber(form.overtimeMultiplier, "Overtime Multiplier"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const hourlyRate = n(form.hourlyRate);
      const regularHours = n(form.regularHours);
      const overtimeHours = n(form.overtimeHours);
      const overtimeMultiplier = n(form.overtimeMultiplier);
      if (hourlyRate <= 0 || regularHours < 0 || overtimeHours < 0 || overtimeMultiplier < 1) {
        return invalid("Hourly rate must be > 0, hours must be non-negative, and overtime multiplier must be at least 1.");
      }
      const regularPay = hourlyRate * regularHours;
      const overtimePay = hourlyRate * overtimeMultiplier * overtimeHours;
      const totalPay = regularPay + overtimePay;

      return {
        title: "Total Gross Pay (Including Overtime)",
        value: money(totalPay),
        extra: [
          `Regular Pay: ${money(regularPay)}`,
          `Overtime Pay: ${money(overtimePay)}`,
          `Overtime Rate: ${money(hourlyRate * overtimeMultiplier)}/hour`,
        ],
      };
    }
    case "car-loan-affordability-calculator": {
      const errs = [
        requiredNumber(form.monthlyBudget, "Monthly Car Payment Budget"),
        requiredNumber(form.apr, "Loan APR"),
        requiredNumber(form.termMonths, "Loan Term"),
        requiredNumber(form.downPayment, "Down Payment"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const monthlyBudget = n(form.monthlyBudget);
      const apr = n(form.apr);
      const termMonths = n(form.termMonths);
      const downPayment = n(form.downPayment);
      if (monthlyBudget <= 0 || termMonths <= 0) return invalid("Monthly budget and term months must be greater than zero.");
      if (apr < 0 || downPayment < 0) return invalid("APR and down payment cannot be negative.");

      const r = apr / 1200;
      const affordableLoanPrincipal = r === 0
        ? monthlyBudget * termMonths
        : monthlyBudget * ((1 + r) ** termMonths - 1) / (r * (1 + r) ** termMonths);
      const totalAffordableCarPrice = affordableLoanPrincipal + downPayment;
      const totalPaid = monthlyBudget * termMonths + downPayment;
      const totalInterest = Math.max(0, totalPaid - totalAffordableCarPrice);

      return {
        title: "Estimated Affordable Loan Amount",
        value: money(affordableLoanPrincipal),
        extra: [
          `Estimated Total Car Price Target: ${money(totalAffordableCarPrice)}`,
          `Monthly Budget Used: ${money(monthlyBudget)}`,
          `Estimated Total Interest: ${money(totalInterest)}`,
        ],
      };
    }
    case "mortgage-affordability-calculator-usa": {
      const errs = [
        requiredNumber(form.monthlyIncome, "Monthly Gross Income"),
        requiredNumber(form.monthlyDebt, "Monthly Debt Payments"),
        requiredNumber(form.dti, "Target DTI"),
        requiredNumber(form.apr, "Mortgage APR"),
        requiredNumber(form.termYears, "Loan Term"),
        requiredNumber(form.downPayment, "Down Payment"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const monthlyIncome = n(form.monthlyIncome);
      const monthlyDebt = n(form.monthlyDebt);
      const dti = n(form.dti);
      const apr = n(form.apr);
      const termYears = n(form.termYears);
      const downPayment = n(form.downPayment);
      if (monthlyIncome <= 0 || termYears <= 0) return invalid("Monthly income and loan term must be greater than zero.");
      if (monthlyDebt < 0 || dti <= 0 || dti > 100 || apr < 0 || downPayment < 0) return invalid("Debt must be non-negative, DTI in 0-100, APR non-negative, and down payment non-negative.");

      const maxHousingPayment = monthlyIncome * (dti / 100) - monthlyDebt;
      if (maxHousingPayment <= 0) return invalid("With current debt and DTI, no mortgage payment budget remains.");
      const r = apr / 1200;
      const nMonths = termYears * 12;
      const affordableLoan = r === 0
        ? maxHousingPayment * nMonths
        : maxHousingPayment * (((1 + r) ** nMonths - 1) / (r * (1 + r) ** nMonths));
      const affordableHomePrice = affordableLoan + downPayment;

      return {
        title: "Estimated Affordable Mortgage (USA)",
        value: money(affordableLoan),
        extra: [
          `Estimated Home Price Target: ${money(affordableHomePrice)}`,
          `Max Monthly Housing Payment: ${money(maxHousingPayment)}`,
          `Assumed DTI: ${dti.toFixed(1)}%`,
        ],
      };
    }
    case "rent-vs-buy-calculator-usa": {
      const errs = [
        requiredNumber(form.monthlyRent, "Monthly Rent"),
        requiredNumber(form.monthlyBuyCost, "Monthly Buy Cost"),
        requiredNumber(form.years, "Comparison Period"),
        requiredNumber(form.annualRentIncrease, "Annual Rent Increase"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const monthlyRent = n(form.monthlyRent);
      const monthlyBuyCost = n(form.monthlyBuyCost);
      const years = n(form.years);
      const annualRentIncrease = n(form.annualRentIncrease);
      if (monthlyRent <= 0 || monthlyBuyCost <= 0 || years <= 0) return invalid("Monthly rent, buy cost, and years must be greater than zero.");
      if (annualRentIncrease < 0) return invalid("Annual rent increase cannot be negative.");

      let totalRent = 0;
      let currentRent = monthlyRent;
      for (let y = 0; y < years; y++) {
        totalRent += currentRent * 12;
        currentRent *= 1 + annualRentIncrease / 100;
      }
      const totalBuy = monthlyBuyCost * 12 * years;
      const difference = Math.abs(totalRent - totalBuy);
      const verdict = totalRent < totalBuy ? "Renting is lower cost in this scenario" : "Buying is lower cost in this scenario";

      return {
        title: "Cost Comparison (USA)",
        value: verdict,
        extra: [
          `Total Rent Cost: ${money(totalRent)}`,
          `Total Buy Cost: ${money(totalBuy)}`,
          `Difference: ${money(difference)}`,
        ],
      };
    }
    case "rental-yield-calculator-uk": {
      const errs = [
        requiredNumber(form.monthlyRent, "Monthly Rent"),
        requiredNumber(form.propertyPrice, "Property Price"),
        requiredNumber(form.annualCosts, "Annual Property Costs"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const monthlyRent = n(form.monthlyRent);
      const propertyPrice = n(form.propertyPrice);
      const annualCosts = n(form.annualCosts);
      if (monthlyRent <= 0 || propertyPrice <= 0) return invalid("Monthly rent and property price must be greater than zero.");
      if (annualCosts < 0) return invalid("Annual costs cannot be negative.");

      const annualRent = monthlyRent * 12;
      const grossYield = (annualRent / propertyPrice) * 100;
      const netYield = ((annualRent - annualCosts) / propertyPrice) * 100;
      return {
        title: "Gross Rental Yield (UK)",
        value: `${grossYield.toFixed(2)}%`,
        extra: [
          `Net Rental Yield: ${netYield.toFixed(2)}%`,
          `Annual Rent: ${money(annualRent)}`,
          `Annual Costs: ${money(annualCosts)}`,
        ],
      };
    }
    case "gas-cost-calculator-road-trip": {
      const errs = [
        requiredNumber(form.distance, "Trip Distance"),
        requiredNumber(form.mpg, "Vehicle Fuel Economy"),
        requiredNumber(form.fuelPrice, "Fuel Price per Gallon"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const distance = n(form.distance);
      const mpg = n(form.mpg);
      const fuelPrice = n(form.fuelPrice);
      if (distance <= 0 || mpg <= 0) return invalid("Distance and MPG must be greater than zero.");
      if (fuelPrice < 0) return invalid("Fuel price cannot be negative.");
      const totalDistance = (form.roundTrip || "no") === "yes" ? distance * 2 : distance;
      const gallonsNeeded = totalDistance / mpg;
      const totalFuelCost = gallonsNeeded * fuelPrice;
      return {
        title: "Estimated Road Trip Fuel Cost",
        value: money(totalFuelCost),
        extra: [
          `Estimated Fuel Needed: ${gallonsNeeded.toFixed(2)} gallons`,
          `Distance Used: ${totalDistance.toFixed(2)} miles`,
          `Trip Type: ${(form.roundTrip || "no") === "yes" ? "Round Trip" : "One Way"}`,
        ],
      };
    }
    case "salary-after-tax-calculator-california": {
      const errs = [
        requiredNumber(form.annualSalary, "Annual Salary"),
        requiredNumber(form.federalTaxRate, "Federal Tax Rate"),
        requiredNumber(form.stateTaxRate, "California State Tax Rate"),
        requiredNumber(form.otherDeductions, "Other Deductions"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const annualSalary = n(form.annualSalary);
      const totalRate = (n(form.federalTaxRate) + n(form.stateTaxRate) + n(form.otherDeductions)) / 100;
      if (annualSalary <= 0) return invalid("Annual salary must be greater than zero.");
      if (totalRate < 0 || totalRate >= 1) return invalid("Combined deduction rate must be between 0 and 100%.");
      const annualNet = annualSalary * (1 - totalRate);
      return {
        title: "Estimated Net Salary (California)",
        value: money(annualNet),
        extra: [
          `Estimated Monthly Net Salary: ${money(annualNet / 12)}`,
          `Estimated Total Deductions: ${money(annualSalary - annualNet)}`,
          `Combined Deduction Rate: ${(totalRate * 100).toFixed(2)}%`,
        ],
      };
    }
    case "salary-after-tax-calculator-texas": {
      const errs = [
        requiredNumber(form.annualSalary, "Annual Salary"),
        requiredNumber(form.federalTaxRate, "Federal Tax Rate"),
        requiredNumber(form.otherDeductions, "Other Deductions"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const annualSalary = n(form.annualSalary);
      const totalRate = (n(form.federalTaxRate) + n(form.otherDeductions)) / 100;
      if (annualSalary <= 0) return invalid("Annual salary must be greater than zero.");
      if (totalRate < 0 || totalRate >= 1) return invalid("Combined deduction rate must be between 0 and 100%.");
      const annualNet = annualSalary * (1 - totalRate);
      return {
        title: "Estimated Net Salary (Texas)",
        value: money(annualNet),
        extra: [
          `Estimated Monthly Net Salary: ${money(annualNet / 12)}`,
          `Estimated Total Deductions: ${money(annualSalary - annualNet)}`,
          "State Income Tax Assumption: 0%",
        ],
      };
    }
    case "salary-after-tax-calculator-new-york": {
      const errs = [
        requiredNumber(form.annualSalary, "Annual Salary"),
        requiredNumber(form.federalTaxRate, "Federal Tax Rate"),
        requiredNumber(form.stateTaxRate, "New York State Tax Rate"),
        requiredNumber(form.localTaxRate, "Local Tax Rate"),
        requiredNumber(form.otherDeductions, "Other Deductions"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const annualSalary = n(form.annualSalary);
      const totalRate = (n(form.federalTaxRate) + n(form.stateTaxRate) + n(form.localTaxRate) + n(form.otherDeductions)) / 100;
      if (annualSalary <= 0) return invalid("Annual salary must be greater than zero.");
      if (totalRate < 0 || totalRate >= 1) return invalid("Combined deduction rate must be between 0 and 100%.");
      const annualNet = annualSalary * (1 - totalRate);
      return {
        title: "Estimated Net Salary (New York)",
        value: money(annualNet),
        extra: [
          `Estimated Monthly Net Salary: ${money(annualNet / 12)}`,
          `Estimated Total Deductions: ${money(annualSalary - annualNet)}`,
          `Combined Deduction Rate: ${(totalRate * 100).toFixed(2)}%`,
        ],
      };
    }
    case "salary-after-tax-calculator-florida": {
      const errs = [
        requiredNumber(form.annualSalary, "Annual Salary"),
        requiredNumber(form.federalTaxRate, "Federal Tax Rate"),
        requiredNumber(form.otherDeductions, "Other Deductions"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const annualSalary = n(form.annualSalary);
      const totalRate = (n(form.federalTaxRate) + n(form.otherDeductions)) / 100;
      if (annualSalary <= 0) return invalid("Annual salary must be greater than zero.");
      if (totalRate < 0 || totalRate >= 1) return invalid("Combined deduction rate must be between 0 and 100%.");
      const annualNet = annualSalary * (1 - totalRate);
      return {
        title: "Estimated Net Salary (Florida)",
        value: money(annualNet),
        extra: [
          `Estimated Monthly Net Salary: ${money(annualNet / 12)}`,
          `Estimated Total Deductions: ${money(annualSalary - annualNet)}`,
          "State Income Tax Assumption: 0%",
        ],
      };
    }
    case "salary-after-tax-calculator-uk": {
      const errs = [
        requiredNumber(form.annualSalary, "Annual Salary"),
        requiredNumber(form.incomeTaxRate, "Income Tax Rate"),
        requiredNumber(form.niRate, "National Insurance Rate"),
        requiredNumber(form.pensionRate, "Pension Contribution"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const annualSalary = n(form.annualSalary);
      const totalRate = (n(form.incomeTaxRate) + n(form.niRate) + n(form.pensionRate)) / 100;
      if (annualSalary <= 0) return invalid("Annual salary must be greater than zero.");
      if (totalRate < 0 || totalRate >= 1) return invalid("Combined deduction rate must be between 0 and 100%.");
      const annualNet = annualSalary * (1 - totalRate);
      return {
        title: "Estimated Net Salary (UK)",
        value: money(annualNet),
        extra: [
          `Estimated Monthly Net Salary: ${money(annualNet / 12)}`,
          `Estimated Total Deductions: ${money(annualSalary - annualNet)}`,
          `Combined Deduction Rate: ${(totalRate * 100).toFixed(2)}%`,
        ],
      };
    }
    case "net-worth-calculator": {
      const fields = [
        { key: "cash", label: "Cash & Bank Balances" },
        { key: "investments", label: "Investments" },
        { key: "realEstate", label: "Real Estate Value" },
        { key: "retirement", label: "Retirement Accounts" },
        { key: "otherAssets", label: "Other Assets" },
        { key: "creditCards", label: "Credit Card Debt" },
        { key: "loans", label: "Loans" },
        { key: "mortgage", label: "Mortgage Balance" },
        { key: "otherDebts", label: "Other Debts" },
      ];

      for (const field of fields) {
        const err = requiredNumber(form[field.key], field.label);
        if (err) return invalid(err);
        if (n(form[field.key]) < 0) return invalid(`${field.label} cannot be negative.`);
      }

      const totalAssets =
        n(form.cash) +
        n(form.investments) +
        n(form.realEstate) +
        n(form.retirement) +
        n(form.otherAssets);
      const totalLiabilities =
        n(form.creditCards) + n(form.loans) + n(form.mortgage) + n(form.otherDebts);
      const netWorth = totalAssets - totalLiabilities;
      const debtToAssetRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;

      return {
        title: "Estimated Net Worth",
        value: money(netWorth),
        extra: [
          `Total Assets: ${money(totalAssets)}`,
          `Total Liabilities: ${money(totalLiabilities)}`,
          `Debt-to-Asset Ratio: ${debtToAssetRatio.toFixed(2)}%`,
        ],
      };
    }
    case "investment-portfolio-calculator":
      if (n(form.initial) <= 0) return invalid("Initial value must be greater than zero.");
      return { title: "Portfolio Return", value: `${(((n(form.final) - n(form.initial)) / n(form.initial)) * 100).toFixed(2)}%` };
    case "retirement-calculator": {
      const r = n(form.rate) / 1200, months = n(form.years) * 12;
      if (n(form.current) < 0 || n(form.monthly) < 0 || n(form.years) < 0 || n(form.rate) < 0) return invalid("All inputs must be non-negative.");
      const future = n(form.current) * (1 + r) ** months + n(form.monthly) * (((1 + r) ** months - 1) / Math.max(r, 0.0001));
      return { title: "Estimated Corpus", value: money(future) };
    }
    case "inflation-calculator":
      if (n(form.amount) < 0 || n(form.years) < 0 || n(form.rate) < -100) return invalid("Amount/Years must be non-negative and rate must be above -100.");
      return { title: "Future Cost", value: money(n(form.amount) * (1 + n(form.rate) / 100) ** n(form.years)) };
    case "accident-compensation-calculator": {
      if (n(form.medical) < 0 || n(form.incomeLoss) < 0 || n(form.pain) < 1) return invalid("Medical/income loss must be non-negative and pain multiplier must be >= 1.");
      const compensation = (n(form.medical) + n(form.incomeLoss)) * Math.max(1, n(form.pain, 1));
      return { title: "Estimated Compensation", value: money(compensation) };
    }
    case "settlement-calculator": {
      const claim = n(form.claim);
      if (claim < 0 || n(form.feeRate) < 0 || n(form.feeRate) > 100) return invalid("Claim must be non-negative and fee rate must be 0-100.");
      return { title: "Net Settlement", value: money(claim * (1 - n(form.feeRate) / 100)) };
    }
    case "legal-fee-estimator":
      if (n(form.hourly) < 0 || n(form.hours) < 0) return invalid("Hourly rate and hours must be non-negative.");
      return { title: "Estimated Fee", value: money(n(form.hourly) * n(form.hours)) };
    case "tiktok-earnings-calculator":
      if (n(form.views) < 0 || n(form.cpm) < 0) return invalid("Views and CPM must be non-negative.");
      return { title: "Estimated Earnings", value: money((n(form.views) / 1000) * n(form.cpm)) };
    case "instagram-engagement-calculator":
      if (n(form.likes) < 0 || n(form.comments) < 0 || n(form.followers) <= 0) return invalid("Likes/comments must be non-negative and followers must be > 0.");
      return { title: "Engagement Rate", value: `${(((n(form.likes) + n(form.comments)) / n(form.followers, 1)) * 100).toFixed(2)}%` };
    case "business-name-generator": {
      const seed = (form.keyword || "orbital").trim();
      if (!seed) return invalid("Keyword is required.");
      const prefixes = ["Nova", "Prime", "Cloud", "Bright", "Quantum", "Urban", "Summit", "Pulse", "River", "Atlas"];
      const suffixes = ["Labs", "Flow", "Forge", "Nest", "Pilot", "Works", "HQ", "Studio", "Collective", "Logic"];
      const count = 8;
      const options = Array.from({ length: count }, () =>
        `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${titleCase(seed)} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`
      );
      return { title: "Business Name Ideas", value: options[0], extra: options.slice(1) };
    }
    case "username-generator": {
      const seed = (form.seed || "user").replace(/\s+/g, "").toLowerCase();
      if (!seed) return invalid("Seed word is required.");
      const tails = ["official", "hq", "studio", "daily", "labs", "hub", "world", "live", "co", "now"];
      const picks = Array.from({ length: 8 }, (_, i) => {
        const tail = tails[i % tails.length];
        const n1 = Math.floor(Math.random() * 9999);
        const n2 = Math.floor(Math.random() * 999);
        return [`${seed}_${n1}`, `${seed}.${tail}`, `${seed}${n2}`][i % 3];
      });
      return { title: "Username Ideas", value: picks[0], extra: picks.slice(1) };
    }
    case "random-name-generator": {
      const list = ["Ava", "Noah", "Mia", "Liam", "Zara", "Ayaan", "Nora", "Ethan", "Lina", "Aria"];
      const requested = Math.round(n(form.count, 8));
      const count = Math.min(10, Math.max(5, requested));
      const picks = Array.from({ length: count }, () => list[Math.floor(Math.random() * list.length)]);
      return { title: "Random Names", value: picks[0], extra: picks.slice(1) };
    }
    case "startup-name-generator": {
      const seed = (form.keyword || "startup").trim();
      if (!seed) return invalid("Startup niche keyword is required.");
      const first = ["Launch", "Scale", "Venture", "Spark", "Orbit", "Vertex", "Summit", "Momentum", "Nimble", "Foundry"];
      const second = ["AI", "Stack", "Labs", "Ops", "Flow", "Base", "Pilot", "Grid", "Works", "Forge"];
      const options = Array.from({ length: 8 }, () =>
        `${first[Math.floor(Math.random() * first.length)]} ${titleCase(seed)} ${second[Math.floor(Math.random() * second.length)]}`
      );
      return { title: "Startup Name Ideas", value: options[0], extra: options.slice(1) };
    }
    case "brand-name-generator-ai": {
      const seed = (form.keyword || "brand").trim();
      const style = (form.style || "modern").trim();
      if (!seed) return invalid("Brand keyword is required.");
      const styleMap: Record<string, string[]> = {
        premium: ["Collective", "Atelier", "House", "Reserve", "Signature", "Studio", "Prime", "Select", "Vault", "Edition"],
        modern: ["Labs", "Flow", "Grid", "Pulse", "Nexus", "Hub", "Works", "Loop", "Forge", "Stack"],
        minimal: ["One", "Core", "Form", "Nook", "Arc", "Line", "Mint", "Root", "Nova", "Peak"],
      };
      const endings = styleMap[style] ?? styleMap.modern;
      const stems = ["Echo", "Luma", "Verve", "Astra", "Kite", "Mono", "Axis", "Sora", "Nori", "Vela"];
      const options = Array.from({ length: 8 }, () =>
        `${stems[Math.floor(Math.random() * stems.length)]} ${titleCase(seed)} ${endings[Math.floor(Math.random() * endings.length)]}`
      );
      return { title: "AI Brand Name Ideas", value: options[0], extra: options.slice(1) };
    }
    case "base64-encoder-decoder": {
      try {
        const input = form.text || "";
        const value = (form.mode || "encode") === "decode" ? atob(input) : btoa(input);
        return { title: "Result", value };
      } catch {
        return { title: "Result", value: "Invalid Base64 input." };
      }
    }
    case "url-encoder-decoder": {
      const input = form.text || "";
      try {
        return { title: "Result", value: (form.mode || "encode") === "decode" ? decodeURIComponent(input) : encodeURIComponent(input) };
      } catch {
        return invalid("Invalid URL-encoded input.");
      }
    }
    case "regex-tester": {
      try {
        const re = new RegExp(form.pattern || "", form.flags || "g");
        const matches = (form.text || "").match(re) || [];
        return { title: "Matches", value: `${matches.length} match(es)`, extra: matches.slice(0, 8) };
      } catch (error) {
        return { title: "Regex Error", value: (error as Error).message };
      }
    }
    case "api-response-formatter": {
      if (!(form.response || "").trim()) return invalid("API response JSON is required.");
      try {
        const parsed = JSON.parse(form.response || "{}");
        const formatted = JSON.stringify(parsed, null, 2);
        const topLevelKeys = parsed && typeof parsed === "object" ? Object.keys(parsed as Record<string, unknown>) : [];
        return {
          title: "Formatted API Response",
          value: formatted,
          extra: [
            `Top-level keys: ${topLevelKeys.length}`,
            topLevelKeys.length ? `Key preview: ${topLevelKeys.slice(0, 8).join(", ")}` : "Key preview: none",
          ],
        };
      } catch (error) {
        return { title: "Formatting Error", value: `Invalid JSON: ${(error as Error).message}`, error: true };
      }
    }
    case "moving-cost-calculator-usa": {
      const errs = [
        requiredNumber(form.distanceMiles, "Distance"),
        requiredNumber(form.homeSizeRooms, "Home Size"),
        requiredNumber(form.laborHours, "Labor Hours"),
        requiredNumber(form.hourlyRate, "Labor Hourly Rate"),
        requiredNumber(form.truckCost, "Truck Cost"),
        requiredNumber(form.packingSupplies, "Packing Supplies"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const distanceMiles = n(form.distanceMiles);
      const homeSizeRooms = n(form.homeSizeRooms);
      const laborHours = n(form.laborHours);
      const hourlyRate = n(form.hourlyRate);
      const truckCost = n(form.truckCost);
      const packingSupplies = n(form.packingSupplies);
      if (distanceMiles < 0 || homeSizeRooms <= 0 || laborHours < 0 || hourlyRate < 0 || truckCost < 0 || packingSupplies < 0) {
        return invalid("Please enter valid non-negative values (rooms must be greater than zero).");
      }
      const laborCost = laborHours * hourlyRate;
      const distanceLoad = distanceMiles * 0.65 * Math.max(1, homeSizeRooms / 2);
      const total = laborCost + truckCost + packingSupplies + distanceLoad;
      return {
        title: "Estimated Moving Cost (USA)",
        value: money(total),
        extra: [
          `Labor Cost: ${money(laborCost)}`,
          `Distance Load Factor: ${money(distanceLoad)}`,
          `Direct Costs (Truck + Supplies): ${money(truckCost + packingSupplies)}`,
        ],
      };
    }
    case "electricity-cost-calculator-usa": {
      const errs = [
        requiredNumber(form.watts, "Appliance Power"),
        requiredNumber(form.hoursPerDay, "Hours per Day"),
        requiredNumber(form.daysPerMonth, "Days per Month"),
        requiredNumber(form.ratePerKwh, "Rate per kWh"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const watts = n(form.watts);
      const hoursPerDay = n(form.hoursPerDay);
      const daysPerMonth = n(form.daysPerMonth);
      const ratePerKwh = n(form.ratePerKwh);
      if (watts <= 0 || hoursPerDay < 0 || daysPerMonth <= 0 || ratePerKwh < 0) {
        return invalid("Power and days must be > 0, with non-negative hours and rate.");
      }
      const monthlyKwh = (watts / 1000) * hoursPerDay * daysPerMonth;
      const monthlyCost = monthlyKwh * ratePerKwh;
      return {
        title: "Estimated Monthly Electricity Cost",
        value: money(monthlyCost),
        extra: [
          `Estimated Monthly Usage: ${monthlyKwh.toFixed(2)} kWh`,
          `Estimated Daily Cost: ${money(monthlyCost / daysPerMonth)}`,
          `Rate Used: ${money(ratePerKwh)} per kWh`,
        ],
      };
    }
    case "internet-speed-requirement-calculator": {
      const errs = [
        requiredNumber(form.users, "Active Users"),
        requiredNumber(form.streamingDevices, "Streaming Devices"),
        requiredNumber(form.videoCallUsers, "Video Call Users"),
        requiredNumber(form.gamingDevices, "Gaming Devices"),
        requiredNumber(form.bufferPercent, "Performance Buffer"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const users = n(form.users);
      const streamingDevices = n(form.streamingDevices);
      const videoCallUsers = n(form.videoCallUsers);
      const gamingDevices = n(form.gamingDevices);
      const bufferPercent = n(form.bufferPercent);
      if (users <= 0 || streamingDevices < 0 || videoCallUsers < 0 || gamingDevices < 0 || bufferPercent < 0) {
        return invalid("Users must be > 0 and other values cannot be negative.");
      }
      const baseMbps = users * 5 + streamingDevices * 15 + videoCallUsers * 4 + gamingDevices * 10;
      const recommendedMbps = baseMbps * (1 + bufferPercent / 100);
      return {
        title: "Recommended Download Speed",
        value: `${Math.ceil(recommendedMbps)} Mbps`,
        extra: [
          `Base Requirement: ${baseMbps.toFixed(1)} Mbps`,
          `Buffer Applied: ${bufferPercent.toFixed(1)}%`,
          `Suggested Plan Tier: ${recommendedMbps <= 100 ? "100 Mbps" : recommendedMbps <= 300 ? "300 Mbps" : recommendedMbps <= 500 ? "500 Mbps" : "1 Gbps+"}`,
        ],
      };
    }
    case "budget-planner-monthly-usa": {
      const errs = [
        requiredNumber(form.monthlyIncome, "Monthly Income"),
        requiredNumber(form.fixedExpenses, "Fixed Expenses"),
        requiredNumber(form.variableExpenses, "Variable Expenses"),
        requiredNumber(form.debtPayments, "Debt Payments"),
        requiredNumber(form.savingsGoal, "Savings Goal"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const monthlyIncome = n(form.monthlyIncome);
      const fixedExpenses = n(form.fixedExpenses);
      const variableExpenses = n(form.variableExpenses);
      const debtPayments = n(form.debtPayments);
      const savingsGoal = n(form.savingsGoal);
      if (monthlyIncome < 0 || fixedExpenses < 0 || variableExpenses < 0 || debtPayments < 0 || savingsGoal < 0) {
        return invalid("Please use non-negative values for all budget fields.");
      }
      const totalOutflow = fixedExpenses + variableExpenses + debtPayments + savingsGoal;
      const balance = monthlyIncome - totalOutflow;
      return {
        title: "Monthly Budget Balance",
        value: money(balance),
        extra: [
          `Total Planned Outflow: ${money(totalOutflow)}`,
          `Needs + Debt Ratio: ${monthlyIncome > 0 ? (((fixedExpenses + debtPayments) / monthlyIncome) * 100).toFixed(2) : "0.00"}%`,
          balance >= 0 ? "Status: Surplus budget ✅" : "Status: Deficit budget ⚠️",
        ],
      };
    }
    case "daily-calorie-calculator": {
      const errs = [
        requiredNumber(form.age, "Age"),
        requiredNumber(form.weightKg, "Weight"),
        requiredNumber(form.heightCm, "Height"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const age = n(form.age);
      const weightKg = n(form.weightKg);
      const heightCm = n(form.heightCm);
      const sex = form.sex || "male";
      const activity = n(form.activity, 1.2);
      if (age <= 0 || weightKg <= 0 || heightCm <= 0 || activity <= 0) {
        return invalid("Age, weight, height, and activity level must be greater than zero.");
      }
      const bmr = sex === "female"
        ? 10 * weightKg + 6.25 * heightCm - 5 * age - 161
        : 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
      const maintenance = bmr * activity;
      return {
        title: "Estimated Daily Maintenance Calories",
        value: `${Math.round(maintenance)} kcal/day`,
        extra: [
          `Estimated BMR: ${Math.round(bmr)} kcal/day`,
          `Fat Loss Target (~15% deficit): ${Math.round(maintenance * 0.85)} kcal/day`,
          `Muscle Gain Target (~10% surplus): ${Math.round(maintenance * 1.1)} kcal/day`,
        ],
      };
    }
    case "time-zone-converter": {
      const time = (form.time || "").trim();
      const timeMatch = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(time);
      if (!timeMatch) return invalid("Time must be in HH:MM 24-hour format.");
      const errs = [
        requiredNumber(form.fromOffset, "From UTC Offset"),
        requiredNumber(form.toOffset, "To UTC Offset"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const fromOffset = n(form.fromOffset);
      const toOffset = n(form.toOffset);
      if (fromOffset < -12 || fromOffset > 14 || toOffset < -12 || toOffset > 14) {
        return invalid("UTC offsets should typically be between -12 and +14.");
      }

      const hours = Number(timeMatch[1]);
      const minutes = Number(timeMatch[2]);
      const totalMinutes = hours * 60 + minutes;
      const deltaMinutes = Math.round((toOffset - fromOffset) * 60);
      const converted = ((totalMinutes + deltaMinutes) % (24 * 60) + (24 * 60)) % (24 * 60);
      const outHours = Math.floor(converted / 60);
      const outMinutes = converted % 60;
      const out = `${String(outHours).padStart(2, "0")}:${String(outMinutes).padStart(2, "0")}`;
      return {
        title: "Converted Time",
        value: out,
        extra: [
          `From UTC${fromOffset >= 0 ? "+" : ""}${fromOffset}`,
          `To UTC${toOffset >= 0 ? "+" : ""}${toOffset}`,
          `Offset Difference: ${(toOffset - fromOffset).toFixed(1)} hour(s)`,
        ],
      };
    }
    case "date-difference-calculator": {
      const startDate = (form.startDate || "").trim();
      const endDate = (form.endDate || "").trim();
      const start = new Date(`${startDate}T00:00:00Z`);
      const end = new Date(`${endDate}T00:00:00Z`);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return invalid("Dates must be valid and in YYYY-MM-DD format.");
      }
      const msDiff = Math.abs(end.getTime() - start.getTime());
      const days = Math.floor(msDiff / (1000 * 60 * 60 * 24));
      const weeks = days / 7;
      const monthsApprox = days / 30.4375;
      return {
        title: "Date Difference",
        value: `${days} day(s)`,
        extra: [
          `Weeks: ${weeks.toFixed(2)}`,
          `Months (approx): ${monthsApprox.toFixed(2)}`,
          `Years (approx): ${(days / 365.25).toFixed(2)}`,
        ],
      };
    }
    case "age-calculator": {
      const birthDate = (form.birthDate || "").trim();
      const asOfRaw = (form.asOfDate || "").trim();
      const birth = new Date(`${birthDate}T00:00:00Z`);
      const asOf = asOfRaw ? new Date(`${asOfRaw}T00:00:00Z`) : new Date();
      if (Number.isNaN(birth.getTime()) || Number.isNaN(asOf.getTime())) {
        return invalid("Birth date and as-of date must be valid YYYY-MM-DD values.");
      }
      const asOfMidnight = new Date(Date.UTC(asOf.getUTCFullYear(), asOf.getUTCMonth(), asOf.getUTCDate()));
      if (asOfMidnight.getTime() < birth.getTime()) return invalid("As-of date cannot be earlier than birth date.");

      let years = asOfMidnight.getUTCFullYear() - birth.getUTCFullYear();
      let months = asOfMidnight.getUTCMonth() - birth.getUTCMonth();
      let days = asOfMidnight.getUTCDate() - birth.getUTCDate();

      if (days < 0) {
        months -= 1;
        const prevMonth = new Date(Date.UTC(asOfMidnight.getUTCFullYear(), asOfMidnight.getUTCMonth(), 0)).getUTCDate();
        days += prevMonth;
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      return {
        title: "Calculated Age",
        value: `${years} year(s), ${months} month(s), ${days} day(s)`,
        extra: [
          `Total Days Lived: ${Math.floor((asOfMidnight.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))}`,
          `As Of: ${asOfMidnight.toISOString().slice(0, 10)}`,
        ],
      };
    }
    case "unit-price-calculator": {
      const errs = [
        requiredNumber(form.totalPrice, "Total Price"),
        requiredNumber(form.quantity, "Quantity"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const totalPrice = n(form.totalPrice);
      const quantity = n(form.quantity);
      if (totalPrice < 0 || quantity <= 0) return invalid("Total price must be non-negative and quantity must be greater than zero.");
      const unitPrice = totalPrice / quantity;
      return {
        title: "Unit Price",
        value: money(unitPrice),
        extra: [
          `Total Price: ${money(totalPrice)}`,
          `Quantity: ${quantity}`,
        ],
      };
    }
    case "discount-calculator": {
      const errs = [
        requiredNumber(form.originalPrice, "Original Price"),
        requiredNumber(form.discountPercent, "Discount"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const originalPrice = n(form.originalPrice);
      const discountPercent = n(form.discountPercent);
      const taxPercent = n(form.taxPercent, 0);
      if (originalPrice < 0) return invalid("Original price must be non-negative.");
      if (discountPercent < 0 || discountPercent > 100) return invalid("Discount must be between 0 and 100.");
      if (taxPercent < 0 || taxPercent > 100) return invalid("Tax must be between 0 and 100.");
      const discountAmount = originalPrice * (discountPercent / 100);
      const discountedPrice = originalPrice - discountAmount;
      const taxAmount = discountedPrice * (taxPercent / 100);
      const finalPrice = discountedPrice + taxAmount;
      return {
        title: "Final Price After Discount",
        value: money(finalPrice),
        extra: [
          `Discount Amount: ${money(discountAmount)}`,
          `Price After Discount: ${money(discountedPrice)}`,
          `Tax Amount: ${money(taxAmount)}`,
        ],
      };
    }
    case "ai-email-subject-line-generator": {
      const topic = (form.topic || "").trim();
      const audience = (form.audience || "").trim();
      const tone = (form.tone || "professional").trim();
      if (!topic || !audience) return invalid("Email topic and target audience are required.");
      const lead = tone === "urgent" ? "Last chance:" : tone === "friendly" ? "Quick idea for" : "A practical update for";
      const value = `${lead} ${audience}  -  ${topic}`;
      return {
        title: "Subject Line Suggestion",
        value,
        extra: [
          `${audience}: a smarter way to handle ${topic}`,
          `${topic} insights for ${audience}`,
          `Can we improve ${topic} this week?`,
        ],
      };
    }
    case "ai-cold-email-generator": {
      const offer = (form.offer || "").trim();
      const audience = (form.audience || "").trim();
      const cta = (form.cta || "").trim();
      const tone = (form.tone || "professional").trim();
      if (!offer || !audience || !cta) return invalid("Offer, target prospect, and CTA are required.");
      const opener = tone === "direct"
        ? `I help ${audience} improve results with ${offer}.`
        : tone === "consultative"
          ? `I work with ${audience} who want better outcomes from ${offer}.`
          : `I am reaching out because ${offer} may be relevant for ${audience}.`;
      return {
        title: "Cold Email Draft",
        value: `${opener} One practical idea: map your current bottleneck, test a focused improvement, and measure lift in 14 days. If helpful, are you open to ${cta}?`,
        extra: [
          `P.S. Happy to share a quick benchmark for ${audience} before you decide.`,
        ],
      };
    }
    case "ai-linkedin-post-generator": {
      const topic = (form.topic || "").trim();
      const audience = (form.audience || "").trim();
      const goal = (form.goal || "").trim();
      const tone = (form.tone || "practical").trim();
      if (!topic || !audience || !goal) return invalid("Post topic, audience, and goal are required.");
      const hook = tone === "thoughtful"
        ? `Most ${audience} underestimate one thing about ${topic}.`
        : tone === "conversational"
          ? `Quick thought for ${audience}: ${topic}.`
          : `If your goal is ${goal}, start with ${topic}.`;
      return {
        title: "LinkedIn Post Draft",
        value: `${hook}\n\nHere is what works:\n1) Define the current baseline.\n2) Test one focused change.\n3) Share outcome metrics with context.\n\nIf you are working on ${goal}, what is one experiment you are running this week?`,
      };
    }
    case "ai-resume-summary-generator": {
      const role = (form.role || "").trim();
      const experienceRaw = form.experience;
      const skills = (form.skills || "").trim();
      const achievement = (form.achievement || "").trim();
      const experience = n(experienceRaw);
      if (!role || !skills || !achievement || !Number.isFinite(experience)) {
        return invalid("Target role, experience, top skills, and key achievement are required.");
      }
      return {
        title: "Resume Summary Draft",
        value: `${Math.max(0, Math.round(experience))}+ years of experience as a ${role} with strengths in ${skills}. Known for delivering measurable outcomes, including ${achievement}. Combines strategic thinking with execution discipline to drive business impact.`,
      };
    }
    case "ai-product-description-generator": {
      const product = (form.product || "").trim();
      const audience = (form.audience || "").trim();
      const features = (form.features || "").trim();
      const tone = (form.tone || "premium").trim();
      if (!product || !audience || !features) return invalid("Product name, audience, and key features are required.");
      const styleLead = tone === "technical"
        ? `${product} is engineered for ${audience}, combining`
        : tone === "friendly"
          ? `Meet ${product}, built for ${audience} with`
          : `${product} helps ${audience} perform at a higher level with`;
      return {
        title: "Product Description Draft",
        value: `${styleLead} ${features}. The result is a smoother workflow, faster execution, and clearer outcomes from day one. If you want reliable performance without complexity, ${product} is designed to fit directly into your team routine.`,
      };
    }
    case "ai-content-humanizer": {
      const text = (form.text || "").trim();
      const tone = (form.tone || "conversational").trim();
      const audience = (form.audience || "general readers").trim();
      if (!text) return invalid("Original text is required.");
      const normalized = text.replace(/\s+/g, " ").trim();
      const leadByTone: Record<string, string[]> = {
        conversational: ["Here is the plain-English version:", "In normal human wording:", "If you said this naturally:"],
        professional: ["Professionally reframed:", "Polished business version:", "Executive-ready rewrite:"],
        confident: ["Stronger, direct rewrite:", "Confident version:", "Sharper statement:"],
      };
      const closers = [
        `This keeps the message clear for ${audience}.`,
        `The tone is tuned for ${audience} without sounding robotic.`,
        `It stays specific and readable for ${audience}.`,
      ];
      const leads = leadByTone[tone] ?? leadByTone.conversational;
      const variants = Array.from({ length: 4 }, (_, i) => {
        const lead = leads[i % leads.length];
        const closer = closers[(i + Math.floor(Math.random() * 3)) % closers.length];
        return `${lead} ${normalized} ${closer}`;
      });
      return {
        title: "Humanized Content Variants",
        value: variants[0],
        extra: variants.slice(1),
      };
    }
    case "privacy-policy-generator": {
      const companyName = (form.companyName || "").trim();
      const websiteUrl = (form.websiteUrl || "").trim();
      const contactEmail = (form.contactEmail || "").trim();
      const country = (form.country || "").trim();
      const dataTypes = (form.dataTypes || "").trim();
      if (!companyName || !websiteUrl || !contactEmail || !country || !dataTypes) {
        return invalid("Company, URL, contact email, country, and data types are required.");
      }
      const output = [
        `Privacy Policy for ${companyName}`,
        "",
        "1) Information We Collect",
        `We may collect: [${dataTypes}] and related technical usage information when you use ${websiteUrl}.`,
        "",
        "2) How We Use Data",
        "We use data to operate the service, improve performance, communicate support updates, and maintain security.",
        "",
        "3) Cookies and Tracking",
        "We may use cookies/analytics to understand traffic and improve experience. Users can control cookies in browser settings.",
        "",
        "4) Data Sharing",
        "We do not sell personal data. We may share data with service providers under contractual confidentiality obligations.",
        "",
        "5) User Rights",
        `Users in ${country} may request access, correction, deletion, or restriction of personal data where legally applicable.`,
        "",
        "6) Contact",
        `For privacy requests, contact: ${contactEmail}`,
        "",
        "7) Placeholder To Edit",
        "Replace this section with your retention period, lawful basis, and child privacy disclosures.",
      ].join("\n");
      return { title: "Generated Privacy Policy Draft", value: output };
    }
    case "terms-and-conditions-generator": {
      const companyName = (form.companyName || "").trim();
      const websiteUrl = (form.websiteUrl || "").trim();
      const governingLaw = (form.governingLaw || "").trim();
      const contactEmail = (form.contactEmail || "").trim();
      const serviceType = (form.serviceType || "service").trim();
      if (!companyName || !websiteUrl || !governingLaw || !contactEmail) {
        return invalid("Company, URL, governing law, and legal email are required.");
      }
      const output = [
        `Terms and Conditions for ${companyName}`,
        "",
        "1) Acceptance of Terms",
        `By using ${websiteUrl}, you agree to these terms for our ${serviceType}.`,
        "",
        "2) Permitted Use",
        "You agree not to abuse, scrape, reverse-engineer, or disrupt the service.",
        "",
        "3) Intellectual Property",
        "All trademarks, branding, and platform content remain the property of the company unless stated otherwise.",
        "",
        "4) Service Availability",
        "We may update, suspend, or discontinue parts of the service at any time without guaranteeing uninterrupted access.",
        "",
        "5) Limitation of Liability",
        "Service is provided as-is without warranties; liability is limited to the extent allowed by law.",
        "",
        "6) Governing Law",
        `These terms are governed by the laws of ${governingLaw}.`,
        "",
        "7) Contact",
        `Questions about terms: ${contactEmail}`,
        "",
        "8) Placeholder To Edit",
        "Add account termination policy, refund terms, and arbitration details if applicable.",
      ].join("\n");
      return { title: "Generated Terms Draft", value: output };
    }
    case "disclaimer-generator": {
      const companyName = (form.companyName || "").trim();
      const websiteUrl = (form.websiteUrl || "").trim();
      const disclaimerType = (form.disclaimerType || "general").trim();
      const contactEmail = (form.contactEmail || "").trim();
      if (!companyName || !websiteUrl || !contactEmail) {
        return invalid("Business name, website URL, and contact email are required.");
      }
      const clauseByType: Record<string, string> = {
        general: "The information on this website is for general informational purposes only and should not be treated as professional advice.",
        affiliate: "Some links may be affiliate links. We may earn a commission at no extra cost to you.",
        financial: "Nothing on this website constitutes financial, investment, tax, or legal advice. Consult a qualified professional.",
        health: "Content is educational and not medical advice. Always consult a licensed healthcare professional for personal decisions.",
      };
      const clause = clauseByType[disclaimerType] ?? clauseByType.general;
      const output = [
        `Disclaimer for ${companyName}`,
        "",
        `Website: ${websiteUrl}`,
        "",
        "1) Core Disclaimer",
        clause,
        "",
        "2) Accuracy and Liability",
        "While we aim to keep information current, we make no guarantees of completeness or accuracy and disclaim liability where permitted.",
        "",
        "3) External Links",
        "Third-party links are provided for convenience; we are not responsible for their content or policies.",
        "",
        "4) Contact",
        `Questions: ${contactEmail}`,
        "",
        "5) Placeholder To Edit",
        "Add industry-specific disclosures required by your jurisdiction.",
      ].join("\n");
      return { title: "Generated Disclaimer Draft", value: output };
    }
    case "freelance-rate-calculator": {
      const errs = [
        requiredNumber(form.annualIncomeGoal, "Annual Income Goal"),
        requiredNumber(form.annualBusinessCosts, "Annual Business Costs"),
        requiredNumber(form.taxRate, "Tax Rate"),
        requiredNumber(form.billableHoursPerYear, "Billable Hours per Year"),
        requiredNumber(form.projectHours, "Project Hours"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const annualIncomeGoal = n(form.annualIncomeGoal);
      const annualBusinessCosts = n(form.annualBusinessCosts);
      const taxRate = n(form.taxRate);
      const billableHoursPerYear = n(form.billableHoursPerYear);
      const projectHours = n(form.projectHours);
      if (annualIncomeGoal <= 0 || billableHoursPerYear <= 0 || projectHours <= 0) {
        return invalid("Income goal, billable hours, and project hours must be greater than zero.");
      }
      if (annualBusinessCosts < 0 || taxRate < 0 || taxRate >= 100) {
        return invalid("Costs must be non-negative and tax rate must be between 0 and 100.");
      }
      const preTaxTarget = (annualIncomeGoal + annualBusinessCosts) / (1 - taxRate / 100);
      const hourlyRate = preTaxTarget / billableHoursPerYear;
      const projectQuote = hourlyRate * projectHours;
      return {
        title: "Suggested Freelance Hourly Rate",
        value: money(hourlyRate),
        extra: [
          `Suggested Project Quote: ${money(projectQuote)}`,
          `Pre-tax Revenue Target: ${money(preTaxTarget)}`,
          `Assumed Billable Hours: ${billableHoursPerYear.toFixed(0)}/year`,
        ],
      };
    }
    case "adsense-revenue-calculator": {
      const errs = [
        requiredNumber(form.monthlyPageviews, "Monthly Pageviews"),
        requiredNumber(form.monetizedPercent, "Monetized Percent"),
        requiredNumber(form.rpm, "RPM"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const pageviews = n(form.monthlyPageviews);
      const monetizedPercent = n(form.monetizedPercent);
      const rpm = n(form.rpm);
      if (pageviews < 0 || rpm < 0 || monetizedPercent < 0 || monetizedPercent > 100) {
        return invalid("Pageviews/RPM must be non-negative and monetized percent must be 0-100.");
      }
      const monetizedViews = pageviews * (monetizedPercent / 100);
      const monthly = (monetizedViews / 1000) * rpm;
      return {
        title: "Estimated Monthly AdSense Revenue",
        value: money(monthly),
        extra: [
          `Estimated Daily Revenue: ${money(monthly / 30)}`,
          `Monetized Pageviews: ${Math.round(monetizedViews).toLocaleString()}`,
          `RPM Used: ${money(rpm)}`,
        ],
      };
    }
    case "tiktok-script-generator": {
      const topic = (form.topic || "").trim();
      const audience = (form.audience || "").trim();
      const goal = (form.goal || "views").trim();
      if (!topic || !audience) return invalid("Topic and audience are required.");
      const hooks = [
        `If you're ${audience}, stop scrolling for 15 seconds.`,
        `Most people get ${topic} wrong. Here's the fast fix.`,
        `Before you try ${topic}, watch this first.`,
        `3 mistakes with ${topic} that cost you results.`,
      ];
      const ctas = {
        views: "Follow for part 2 and save this.",
        saves: "Save this and test it later tonight.",
        leads: "Comment \"plan\" and I'll share the full framework.",
        sales: "DM \"start\" if you want the exact setup.",
      };
      const variants = Array.from({ length: 4 }, (_, i) =>
        `${hooks[(i + Math.floor(Math.random() * hooks.length)) % hooks.length]}\nBeat 1: show the before state around ${topic}.\nBeat 2: give one tactical step ${audience} can execute today.\nBeat 3: show expected outcome in plain numbers.\nCTA: ${ctas[goal as keyof typeof ctas] ?? ctas.views}`
      );
      return { title: "TikTok Script Variants", value: variants[0], extra: variants.slice(1) };
    }
    case "youtube-metadata-generator": {
      const videoTopic = (form.videoTopic || "").trim();
      const targetKeyword = (form.targetKeyword || "").trim();
      const audience = (form.audience || "").trim();
      if (!videoTopic || !targetKeyword || !audience) {
        return invalid("Video topic, target keyword, and audience are required.");
      }
      const outputs = Array.from({ length: 4 }, (_, i) => {
        const angle = ["Beginner Guide", "Step-by-Step", "Mistakes to Avoid", "Case Study"][i % 4];
        return `Title: ${targetKeyword} ${angle} (${new Date().getFullYear()})\nDescription: This video helps ${audience} master ${videoTopic} with practical examples and a repeatable workflow.\nTags: ${targetKeyword}, ${videoTopic}, tutorial, how to, ${audience.replace(/\s+/g, " ")}\nChapters: 00:00 Intro | 00:42 Context | 02:15 Walkthrough | 05:40 Common errors | 07:10 Recap`;
      });
      return { title: "YouTube Metadata Variants", value: outputs[0], extra: outputs.slice(1) };
    }
    case "ai-prompt-optimizer": {
      const prompt = (form.prompt || "").trim();
      const taskType = (form.taskType || "writing").trim();
      const constraints = (form.constraints || "be concise").trim();
      if (!prompt) return invalid("Original prompt is required.");
      const roleByTask: Record<string, string> = {
        writing: "You are a senior content strategist.",
        coding: "You are a senior software engineer.",
        research: "You are a market research analyst.",
        marketing: "You are a growth marketing lead.",
      };
      const structures = [
        `Context: ${prompt}\nTask: Produce a high-quality ${taskType} output.\nConstraints: ${constraints}.\nOutput format: bullet list + short final recommendation.`,
        `Objective: Improve this request -> ${prompt}\nAudience: specify implied end user.\nRequirements: ${constraints}.\nReturn 3 alternative responses with pros/cons.`,
        `${roleByTask[taskType] ?? roleByTask.writing}\nInput: ${prompt}\nDo: clarify assumptions, ask missing questions, then deliver final answer.\nBoundaries: ${constraints}.`,
        `Rewrite and execute this prompt: ${prompt}\nUse a step-by-step approach and include a final QA checklist.\nHard constraints: ${constraints}.`,
      ];
      return { title: "Optimized Prompt Variants", value: structures[0], extra: structures.slice(1) };
    }
    case "saas-valuation-calculator": {
      const errs = [
        requiredNumber(form.arr, "ARR"),
        requiredNumber(form.growthRate, "Growth Rate"),
        requiredNumber(form.multipleLow, "Low Multiple"),
        requiredNumber(form.multipleHigh, "High Multiple"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const arr = n(form.arr);
      const growthRate = n(form.growthRate);
      const multipleLow = n(form.multipleLow);
      const multipleHigh = n(form.multipleHigh);
      if (arr < 0 || growthRate < 0 || multipleLow < 0 || multipleHigh < 0) {
        return invalid("ARR, growth rate, and multiples must be non-negative.");
      }
      if (multipleHigh < multipleLow) return invalid("High multiple must be greater than or equal to low multiple.");
      const lowValuation = arr * multipleLow;
      const highValuation = arr * multipleHigh;
      const midpoint = (lowValuation + highValuation) / 2;
      return {
        title: "Estimated SaaS Valuation Range",
        value: `${money(lowValuation)} - ${money(highValuation)}`,
        extra: [
          `Midpoint Valuation: ${money(midpoint)}`,
          `ARR Used: ${money(arr)}`,
          `Growth Rate Signal: ${growthRate.toFixed(2)}% YoY`,
        ],
      };
    }
    case "crypto-tax-calculator-basic": {
      if (n(form.gain) < 0 || n(form.taxRate) < 0 || n(form.taxRate) > 100) {
        return invalid("Gain must be non-negative and tax rate must be between 0 and 100.");
      }
      const tax = n(form.gain) * (n(form.taxRate) / 100);
      return {
        title: "Estimated Crypto Tax (Basic)",
        value: money(tax),
        extra: [
          `Taxable Gain: ${money(n(form.gain))}`,
          `Effective Tax Rate: ${n(form.taxRate).toFixed(2)}%`,
        ],
      };
    }
    case "schema-markup-generator": {
      const schemaType = (form.schemaType || "WebPage").trim();
      const name = (form.name || "").trim();
      const url = (form.url || "").trim();
      const description = (form.description || "").trim();
      if (!name || !url || !description) return invalid("Name, URL, and description are required.");
      const baseSchema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": schemaType,
        name,
        url,
        description,
      };
      const withType =
        schemaType === "Article"
          ? { ...baseSchema, headline: name, author: { "@type": "Organization", name: "[Your Brand]" } }
          : schemaType === "Organization"
            ? { ...baseSchema, logo: "[https://example.com/logo.png]" }
            : schemaType === "FAQPage"
              ? {
                  ...baseSchema,
                  mainEntity: [
                    { "@type": "Question", name: "[Question 1]", acceptedAnswer: { "@type": "Answer", text: "[Answer 1]" } },
                    { "@type": "Question", name: "[Question 2]", acceptedAnswer: { "@type": "Answer", text: "[Answer 2]" } },
                  ],
                }
              : baseSchema;
      return { title: "Generated JSON-LD Schema", value: JSON.stringify(withType, null, 2) };
    }
    case "json-to-php-array-converter": {
      const input = (form.json || "").trim();
      if (!input) return invalid("JSON input is required.");
      const syntax = (form.arraySyntax || "short").trim();
      const toPhp = (value: unknown): string => {
        if (value === null) return "null";
        if (typeof value === "string") return `'${value.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
        if (typeof value === "number" || typeof value === "boolean") return String(value);
        if (Array.isArray(value)) {
          const items = value.map((v) => toPhp(v)).join(", ");
          return syntax === "long" ? `array(${items})` : `[${items}]`;
        }
        if (typeof value === "object") {
          const entries = Object.entries(value as Record<string, unknown>)
            .map(([k, v]) => `${toPhp(k)} => ${toPhp(v)}`)
            .join(", ");
          return syntax === "long" ? `array(${entries})` : `[${entries}]`;
        }
        return "null";
      };
      try {
        const parsed = JSON.parse(input) as unknown;
        return { title: "Converted PHP Array", value: toPhp(parsed) };
      } catch (error) {
        return invalid(`Invalid JSON: ${(error as Error).message}`);
      }
    }
    case "htaccess-redirect-generator": {
      const fromPath = (form.fromPath || "").trim();
      const toUrl = (form.toUrl || "").trim();
      const redirectType = (form.redirectType || "301").trim();
      const patternMode = (form.patternMode || "simple").trim();
      if (!fromPath || !toUrl) return invalid("From path and destination URL are required.");
      if (!/^https?:\/\//i.test(toUrl)) return invalid("Destination URL must start with http:// or https://.");
      const rule =
        patternMode === "regex"
          ? `RewriteEngine On\nRewriteRule ^${fromPath.replace(/^\//, "")}$ ${toUrl} [R=${redirectType},L]`
          : `Redirect ${redirectType} ${fromPath} ${toUrl}`;
      return { title: "Generated .htaccess Rule", value: rule };
    }
    case "core-web-vitals-suggestion-tool": {
      const errs = [
        requiredNumber(form.lcp, "LCP"),
        requiredNumber(form.cls, "CLS"),
        requiredNumber(form.inp, "INP"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const lcp = n(form.lcp);
      const cls = n(form.cls);
      const inp = n(form.inp);
      const platform = (form.platform || "nextjs").trim();
      if (lcp < 0 || cls < 0 || inp < 0) return invalid("LCP, CLS, and INP must be non-negative.");
      const lcpStatus = lcp <= 2.5 ? "Good" : lcp <= 4 ? "Needs Improvement" : "Poor";
      const clsStatus = cls <= 0.1 ? "Good" : cls <= 0.25 ? "Needs Improvement" : "Poor";
      const inpStatus = inp <= 200 ? "Good" : inp <= 500 ? "Needs Improvement" : "Poor";
      const suggestions: string[] = [];
      if (lcp > 2.5) suggestions.push("Improve LCP: preload hero assets, reduce render-blocking CSS/JS, and optimize server response time.");
      if (cls > 0.1) suggestions.push("Improve CLS: reserve image/video dimensions and avoid injecting content above existing layout.");
      if (inp > 200) suggestions.push("Improve INP: split long tasks, defer heavy scripts, and reduce synchronous work on user input.");
      if (!suggestions.length) suggestions.push("Vitals look healthy. Keep monitoring field data and guard against regressions in new releases.");
      if (platform === "nextjs") suggestions.push("Next.js tip: use dynamic imports for heavy widgets and verify image priority only on true LCP elements.");
      if (platform === "wordpress") suggestions.push("WordPress tip: audit plugin bloat, lazy-load media, and optimize theme scripts.");
      if (platform === "spa") suggestions.push("SPA tip: minimize hydration cost and virtual DOM work on initial route.");
      return {
        title: "Core Web Vitals Assessment",
        value: `LCP: ${lcpStatus} | CLS: ${clsStatus} | INP: ${inpStatus}`,
        extra: suggestions.slice(0, 5),
      };
    }
    case "domain-value-estimator": {
      const errs = [
        requiredNumber(form.monthlyPageviews, "Monthly Pageviews"),
        requiredNumber(form.rpmUsd, "RPM (USD)"),
        requiredNumber(form.monthlyOperatingCosts, "Monthly Operating Costs"),
        requiredNumber(form.monthsMultipleLow, "Low Multiple (months of profit)"),
        requiredNumber(form.monthsMultipleHigh, "High Multiple (months of profit)"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const pv = n(form.monthlyPageviews);
      const rpm = n(form.rpmUsd);
      const opex = n(form.monthlyOperatingCosts);
      const mLow = n(form.monthsMultipleLow);
      const mHigh = n(form.monthsMultipleHigh);
      if (pv < 0 || rpm < 0 || opex < 0 || mLow <= 0 || mHigh < mLow) {
        return invalid("Pageviews and RPM must be non-negative, opex non-negative, and high multiple ≥ low multiple.");
      }
      const monthlyProfit = (pv / 1000) * rpm - opex;
      if (monthlyProfit <= 0) return invalid("Estimated monthly profit must be positive for this valuation model.");
      return {
        title: "Estimated Domain Value Range",
        value: `${money(monthlyProfit * mLow)} – ${money(monthlyProfit * mHigh)}`,
        extra: [
          `Estimated Monthly Profit: ${money(monthlyProfit)}`,
          `Multiples Used: ${mLow}–${mHigh}× monthly profit`,
          "Model assumes monetization via display RPM; adjust multiples for SaaS, ecommerce, or lead gen.",
        ],
      };
    }
    case "business-insurance-calculator": {
      const errs = [
        requiredNumber(form.annualRevenue, "Annual Revenue"),
        requiredNumber(form.employeeCount, "Employee Count"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const revenue = n(form.annualRevenue);
      const employees = n(form.employeeCount);
      const risk = (form.riskBand || "medium").trim();
      if (revenue < 0 || employees < 0 || !Number.isInteger(employees)) {
        return invalid("Revenue must be non-negative and employee count must be a whole number.");
      }
      const rate = risk === "low" ? 0.0025 : risk === "high" ? 0.0085 : 0.005;
      const premium = revenue * rate + employees * 720;
      return {
        title: "Estimated Annual Premium (Ballpark)",
        value: money(premium),
        extra: [
          `Risk band: ${risk}`,
          `Revenue-based component: ${money(revenue * rate)}`,
          `Per-employee load (est.): ${money(employees * 720)}`,
        ],
      };
    }
    case "google-ads-roi-calculator": {
      const errs = [requiredNumber(form.adSpend, "Ad Spend"), requiredNumber(form.conversionRevenue, "Conversion Revenue")].filter(
        Boolean,
      );
      if (errs.length) return invalid(errs[0] as string);
      const spend = n(form.adSpend);
      const revenue = n(form.conversionRevenue);
      if (spend <= 0 || revenue < 0) return invalid("Spend must be > 0 and revenue must be non-negative.");
      const roas = revenue / spend;
      const roi = ((revenue - spend) / spend) * 100;
      return {
        title: "Google Ads ROAS",
        value: `${roas.toFixed(2)}×`,
        extra: [`ROI: ${roi.toFixed(2)}%`, `Net Profit: ${money(revenue - spend)}`, `Spend: ${money(spend)}`, `Attributed Revenue: ${money(revenue)}`],
      };
    }
    case "refund-policy-generator": {
      const brand = (form.brandName || "").trim();
      const url = (form.websiteUrl || "").trim();
      const email = (form.supportEmail || "").trim();
      const windowDays = (form.refundWindowDays || "").trim();
      if (!brand || !url || !email || !windowDays) return invalid("Brand, website, support email, and refund window are required.");
      const days = Number(windowDays);
      if (!Number.isFinite(days) || days < 0) return invalid("Refund window must be a valid non-negative number of days.");
      const output = [
        `Refund & Return Policy  -  ${brand}`,
        "",
        "1) Scope",
        `This policy applies to purchases made through ${url} unless a separate written agreement states otherwise.`,
        "",
        "2) Eligibility",
        `Customers may request a refund within ${days} day(s) of purchase/delivery, subject to the conditions below.`,
        "",
        "3) Non-refundable items",
        "Digital goods after download/access, custom work after approval, and services already rendered may be excluded. [Edit to match your catalog.]",
        "",
        "4) Process",
        `Email ${email} with order ID, reason, and proof of purchase. Refunds are issued to the original payment method when possible.`,
        "",
        "5) Chargebacks",
        "Please contact support before initiating a chargeback so we can resolve the issue faster.",
        "",
        "6) Placeholder",
        "Add jurisdiction-specific consumer rights, subscription cancellation rules, and restocking fees if applicable.",
      ].join("\n");
      return { title: "Refund Policy Draft", value: output };
    }
    case "freelance-contract-generator": {
      const freelancer = (form.freelancerName || "").trim();
      const client = (form.clientName || "").trim();
      const scope = (form.scopeSummary || "").trim();
      const rate = (form.rateTerms || "").trim();
      const payment = (form.paymentTerms || "").trim();
      const law = (form.governingLaw || "").trim();
      if (!freelancer || !client || !scope || !rate || !payment || !law) {
        return invalid("Freelancer, client, scope, rate, payment terms, and governing law are required.");
      }
      const output = [
        `Independent Contractor Agreement`,
        "",
        `Between: ${freelancer} (“Contractor”) and ${client} (“Client”).`,
        "",
        "1) Services",
        scope,
        "",
        "2) Compensation",
        rate,
        "",
        "3) Payment",
        payment,
        "",
        "4) IP & Confidentiality",
        "Deliverables are owned by Client upon full payment unless otherwise agreed in writing. Both parties will protect confidential information.",
        "",
        "5) Term & Termination",
        "Either party may terminate with written notice. Client pays for work completed through termination date.",
        "",
        "6) Independent Relationship",
        "Contractor is not an employee; responsible for own taxes and insurance.",
        "",
        "7) Governing Law",
        law,
        "",
        "8) Signatures",
        "_________________________   Date: __________  Contractor",
        "_________________________   Date: __________  Client",
        "",
        "[Placeholder] Add liability cap, indemnity, non-solicit, and dispute resolution with counsel.",
      ].join("\n");
      return { title: "Freelance Contract Draft", value: output };
    }
    case "invoice-generator": {
      const from = (form.fromName || "").trim();
      const to = (form.toName || "").trim();
      const inv = (form.invoiceNumber || "").trim();
      const date = (form.invoiceDate || "").trim();
      const taxPct = n(form.taxPercent, 0);
      const linesRaw = (form.lineItems || "").trim();
      if (!from || !to || !inv || !date || !linesRaw) return invalid("From, to, invoice #, date, and line items are required.");
      if (taxPct < 0 || taxPct > 100) return invalid("Tax percent must be between 0 and 100.");
      const lines = linesRaw.split(/\n+/).map((l) => l.trim()).filter(Boolean);
      let subtotal = 0;
      const rows: string[] = [];
      for (const line of lines) {
        const parts = line.split("|").map((p) => p.trim());
        if (parts.length < 3) return invalid(`Line must be "description | qty | rate": ${line}`);
        const desc = parts[0];
        const qty = Number(parts[1]);
        const rate = Number(parts[2]);
        if (!Number.isFinite(qty) || !Number.isFinite(rate) || qty < 0 || rate < 0) return invalid(`Invalid qty/rate in line: ${line}`);
        const lineTotal = qty * rate;
        subtotal += lineTotal;
        rows.push(`${desc}  ×${qty} @ ${money(rate)} = ${money(lineTotal)}`);
      }
      const tax = subtotal * (taxPct / 100);
      const total = subtotal + tax;
      const output = [
        `INVOICE ${inv}`,
        `Date: ${date}`,
        "",
        `From: ${from}`,
        `Bill To: ${to}`,
        "",
        "Line Items:",
        ...rows,
        "",
        `Subtotal: ${money(subtotal)}`,
        `Tax (${taxPct}%): ${money(tax)}`,
        `Total Due: ${money(total)}`,
        "",
        "Payment instructions: [Add bank / PayPal / Stripe link]",
      ].join("\n");
      return { title: "Generated Invoice", value: output };
    }
    case "utm-link-builder": {
      const base = (form.baseUrl || "").trim();
      const source = (form.utmSource || "").trim();
      const medium = (form.utmMedium || "").trim();
      const campaign = (form.utmCampaign || "").trim();
      const content = (form.utmContent || "").trim();
      const term = (form.utmTerm || "").trim();
      if (!base || !source || !medium || !campaign) return invalid("Base URL, utm_source, utm_medium, and utm_campaign are required.");
      try {
        const u = new URL(base);
        u.searchParams.set("utm_source", source);
        u.searchParams.set("utm_medium", medium);
        u.searchParams.set("utm_campaign", campaign);
        if (content) u.searchParams.set("utm_content", content);
        if (term) u.searchParams.set("utm_term", term);
        return { title: "Campaign URL", value: u.toString() };
      } catch {
        return invalid("Base URL must be a valid absolute URL (include https://).");
      }
    }
    case "domain-age-checker": {
      const reg = (form.registrationDate || "").trim();
      if (!reg) return invalid("Registration date is required (YYYY-MM-DD).");
      const start = new Date(`${reg}T00:00:00Z`);
      if (Number.isNaN(start.getTime())) return invalid("Use a valid registration date in YYYY-MM-DD format.");
      const end = new Date();
      if (start.getTime() > end.getTime()) return invalid("Registration date cannot be in the future.");
      let years = end.getUTCFullYear() - start.getUTCFullYear();
      let months = end.getUTCMonth() - start.getUTCMonth();
      let days = end.getUTCDate() - start.getUTCDate();
      if (days < 0) {
        months -= 1;
        const prev = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 0)).getUTCDate();
        days += prev;
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }
      const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return {
        title: "Domain Age",
        value: `${years}y ${months}m ${days}d`,
        extra: [`Total days since registration: ${totalDays}`, "Tip: pair with WHOIS records for official creation dates."],
      };
    }
    case "meta-tag-analyzer": {
      const html = (form.html || "").trim();
      if (!html) return invalid("Paste HTML source to analyze.");
      const titleMatch = /<title[^>]*>([^<]*)<\/title>/i.exec(html);
      const title = titleMatch?.[1]?.trim() ?? "(not found)";
      const metas: string[] = [];
      const metaRe = /<meta\s+[^>]*>/gi;
      let m: RegExpExecArray | null;
      while ((m = metaRe.exec(html)) !== null) {
        const tag = m[0];
        const name =
          /name=["']([^"']+)["']/i.exec(tag)?.[1] ?? /property=["']([^"']+)["']/i.exec(tag)?.[1] ?? "";
        const content = /content=["']([^"']*)["']/i.exec(tag)?.[1] ?? "";
        if (name) metas.push(`${name}: ${content || "(empty)"}`);
      }
      const desc =
        /name=["']description["'][^>]*content=["']([^"']*)["']/i.exec(html)?.[1] ??
        /property=["']og:description["'][^>]*content=["']([^"']*)["']/i.exec(html)?.[1] ??
        "";
      const ogTitle = /property=["']og:title["'][^>]*content=["']([^"']*)["']/i.exec(html)?.[1] ?? "";
      const summary = [
        `Title (${title.length} chars): ${title || "(none)"}`,
        `Meta description (${desc.length} chars): ${desc || "(none)"}`,
        `og:title: ${ogTitle || "(none)"}`,
        `Meta tags detected: ${metas.length}`,
      ].join("\n");
      return {
        title: "Meta Tag Summary",
        value: summary,
        extra: metas.length ? metas.slice(0, 12) : ["No name/property meta tags matched common patterns."],
      };
    }
    case "qr-code-generator-with-logo": {
      const text = (form.qrContent || "").trim();
      const size = Math.min(400, Math.max(120, Math.round(n(form.sizePx, 220))));
      if (!text) return invalid("Content to encode is required (URL or text).");
      const encoded = encodeURIComponent(text);
      const imgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&ecc=H&data=${encoded}`;
      return {
        title: "QR Code Image URL",
        value: imgUrl,
        extra: [
          "High ECC (H) leaves quiet zone for a centered logo (~22–25% of code width).",
          "Overlay logo in Figma/Canva, export PNG, and test scan before print.",
          "Do not rely on third-party hosts for permanent assets - download and self-host in production.",
        ],
      };
    }
    case "image-background-remover": {
      const subject = (form.subjectType || "product").trim();
      const bg = (form.backgroundType || "solid").trim();
      const output = [
        `Background removal playbook  -  ${subject} on ${bg} background`,
        "",
        "1) Capture / export",
        "Use highest-resolution source; avoid heavy JPEG compression on edges.",
        "",
        "2) Masking strategy",
        bg === "solid"
          ? "Solid colors: use color-based selection or AI matte; refine hair/fur with edge-aware brush."
          : "Complex scenes: segment subject first, then refine edges; duplicate layer for non-destructive edits.",
        "",
        "3) Export",
        "Save PNG-24 with alpha; for web, consider WebP with transparency at ~80% quality.",
        "",
        "4) QA",
        "Zoom 200% on edges; check halos against both light and dark preview backgrounds.",
        "",
        "Note: This tool outputs a professional checklist. For pixel-level removal, use a dedicated editor or API service.",
      ].join("\n");
      return { title: "Background Removal Workflow", value: output };
    }
    case "ai-social-bio-generator": {
      const platform = (form.platform || "instagram").trim();
      const niche = (form.niche || "").trim();
      const tone = (form.tone || "witty").trim();
      if (!niche) return invalid("Niche or focus is required.");
      const hooks = [
        `${niche} • building in public`,
        `Helping ${niche} skip guesswork`,
        `${tone === "bold" ? "Unfiltered" : "Practical"} ${niche} tips + experiments`,
        `${niche} | systems > motivation`,
      ];
      const variants = hooks.map(
        (h, i) =>
          `${platform} bio ${i + 1}: ${h} | CTA: link below for [free checklist / newsletter] | emoji: optional 1 max`,
      );
      return { title: "Social Bio Ideas", value: variants[0], extra: variants.slice(1) };
    }
    case "youtube-tag-extractor": {
      const blob = (form.text || "").trim();
      if (!blob) return invalid("Paste video description or tag string.");
      const hashTags = [...blob.matchAll(/#([\p{L}\p{N}_-]+)/gu)].map((x) => x[1]);
      const commaChunk = blob.split(/[\n,]+/).map((t) => t.trim()).filter(Boolean);
      const merged = [...new Set([...hashTags, ...commaChunk.map((t) => t.replace(/^#/, ""))])].filter((t) => t.length > 1 && t.length < 80);
      const tags = merged.slice(0, 40);
      if (!tags.length) return invalid("No tags or hashtags detected.");
      return {
        title: "Extracted Tags",
        value: tags.slice(0, 12).join(", "),
        extra: [`Total unique: ${tags.length}`, tags.length > 12 ? `More: ${tags.slice(12).join(", ")}` : ""].filter(Boolean),
      };
    }
    case "password-generator-advanced": {
      const length = Math.round(n(form.length, 16));
      const count = Math.min(8, Math.max(1, Math.round(n(form.count, 3))));
      if (length < 8 || length > 128) return invalid("Length must be between 8 and 128.");
      const upper = (form.includeUpper || "yes") === "yes";
      const lower = (form.includeLower || "yes") === "yes";
      const nums = (form.includeNumbers || "yes") === "yes";
      const sym = (form.includeSymbols || "yes") === "yes";
      const exclude = (form.excludeAmbiguous || "yes") === "yes";
      let upperPool = "ABCDEFGHJKLMNPQRSTUVWXYZ";
      let lowerPool = "abcdefghijkmnopqrstuvwxyz";
      if (!exclude) {
        upperPool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        lowerPool = "abcdefghijklmnopqrstuvwxyz";
      }
      const numPool = exclude ? "23456789" : "0123456789";
      const symPool = exclude ? "!@#$%^&*-_+=" : "!@#$%^&*()_+-=[]{}|;:,.<>?";
      let pool = "";
      if (upper) pool += upperPool;
      if (lower) pool += lowerPool;
      if (nums) pool += numPool;
      if (sym) pool += symPool;
      if (!pool) return invalid("Select at least one character set.");
      const pick = () => pool[Math.floor(Math.random() * pool.length)];
      const passwords = Array.from({ length: count }, () => Array.from({ length }, pick).join(""));
      return { title: "Generated Passwords", value: passwords[0], extra: passwords.slice(1) };
    }
    case "robots-txt-generator": {
      const agent = (form.userAgent || "*").trim() || "*";
      const allow = (form.allowPaths || "").trim();
      const disallow = (form.disallowPaths || "").trim();
      const sitemap = (form.sitemapUrl || "").trim();
      const lines = ["User-agent: " + agent];
      for (const p of allow.split(/\n+/).map((s) => s.trim()).filter(Boolean)) lines.push(`Allow: ${p}`);
      for (const p of disallow.split(/\n+/).map((s) => s.trim()).filter(Boolean)) lines.push(`Disallow: ${p}`);
      if (!disallow && !allow) lines.push("Disallow:");
      if (sitemap) {
        if (!/^https?:\/\//i.test(sitemap)) return invalid("Sitemap URL must start with http:// or https://.");
        lines.push(`Sitemap: ${sitemap}`);
      }
      return { title: "robots.txt", value: lines.join("\n") };
    }
    case "broken-link-checker": {
      const html = (form.html || "").trim();
      const extraUrls = (form.extraUrls || "").trim();
      const hrefs = new Set<string>();
      if (html) {
        const re = /href\s*=\s*["']([^"']+)["']/gi;
        let hm: RegExpExecArray | null;
        while ((hm = re.exec(html)) !== null) hrefs.add(hm[1].trim());
      }
      for (const line of extraUrls.split(/\n+/).map((l) => l.trim()).filter(Boolean)) hrefs.add(line);
      if (!hrefs.size) return invalid("Paste HTML with links and/or enter URLs (one per line).");
      const bad: string[] = [];
      const ok: string[] = [];
      for (const h of hrefs) {
        if (h.toLowerCase().startsWith("javascript:")) {
          bad.push(`${h.slice(0, 60)}… (javascript: pseudo-link)`);
          continue;
        }
        const fine =
          /^https?:\/\//i.test(h) ||
          /^mailto:/i.test(h) ||
          /^tel:/i.test(h) ||
          h.startsWith("/") ||
          h.startsWith("./") ||
          h.startsWith("../") ||
          h.startsWith("#") ||
          h === "";
        if (fine) ok.push(h);
        else bad.push(`${h} (check scheme / relative path)`);
      }
      return {
        title: "Link Format Check",
        value: `${hrefs.size} URL(s) scanned  -  ${bad.length} flagged`,
        extra: [
          ...bad.slice(0, 10),
          ok.length ? `Sample OK: ${ok.slice(0, 5).join(" | ")}` : "",
          "Pattern-only check; live 404 detection needs server-side crawling.",
        ].filter(Boolean),
      };
    }
    case "html-to-json-converter": {
      const html = (form.html || "").trim();
      if (!html) return invalid("HTML input is required.");
      const title = /<title[^>]*>([^<]*)<\/title>/i.exec(html)?.[1]?.trim() ?? null;
      const h1 = (html.match(/<h1[^>]*>/gi) || []).length;
      const h2 = (html.match(/<h2[^>]*>/gi) || []).length;
      const h3 = (html.match(/<h3[^>]*>/gi) || []).length;
      const links = (html.match(/href\s*=\s*["'][^"']+["']/gi) || []).length;
      const images = (html.match(/<img[^>]*>/gi) || []).length;
      const obj = { title, headingCounts: { h1, h2, h3 }, approximateLinks: links, approximateImages: images };
      return { title: "HTML Summary (JSON)", value: JSON.stringify(obj, null, 2) };
    }
    case "json-to-html-converter": {
      const raw = (form.json || "").trim();
      if (!raw) return invalid("JSON input is required.");
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        return invalid(`Invalid JSON: ${(e as Error).message}`);
      }
      const esc = (s: string) =>
        s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
      const toHtml = (val: unknown, depth: number): string => {
        const pad = "  ".repeat(depth);
        if (val === null || val === undefined) return `${pad}<span class="json-null">null</span>\n`;
        if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
          return `${pad}<span>${esc(String(val))}</span>\n`;
        }
        if (Array.isArray(val)) {
          if (!val.length) return `${pad}<ul></ul>\n`;
          return `${pad}<ul>\n${val.map((item) => `${pad}  <li>\n${toHtml(item, depth + 2)}${pad}  </li>\n`).join("")}${pad}</ul>\n`;
        }
        const entries = Object.entries(val as Record<string, unknown>);
        if (!entries.length) return `${pad}<dl></dl>\n`;
        return (
          `${pad}<dl>\n` +
          entries
            .map(([k, v]) => `${pad}  <dt>${esc(k)}</dt>\n${pad}  <dd>\n${toHtml(v, depth + 2)}${pad}  </dd>\n`)
            .join("") +
          `${pad}</dl>\n`
        );
      };
      return { title: "HTML Fragment", value: `<div class="json-to-html-root">\n${toHtml(parsed, 0)}</div>`.trim() };
    }
    case "ai-search-appearance-checker": {
      const brand = (form.brandName || "").trim();
      const topics = (form.coreTopics || "").trim();
      const geo = (form.market || "").trim();
      if (!brand || !topics) return invalid("Brand and core topics are required.");
      const packs = [
        `SERP snippet plan: lead title with “${brand} + ${topics.split(",")[0]?.trim() || "solution"}” and a stat-led meta under 155 chars.`,
        `AI-overview readiness: add a concise FAQ block answering “what is ${brand}”, “how pricing works”, and “who it’s for” using ${geo || "your"} context.`,
        `Entity signals: ensure Organization schema, consistent NAP on About/Contact, and branded anchor internal links from pillar pages.`,
        `Content gap: publish one comparison + one tutorial featuring ${topics} with first-hand screenshots to earn cite-worthy excerpts.`,
      ];
      return { title: "Search & AI Visibility Ideas", value: packs[0], extra: packs.slice(1) };
    }
    case "gas-fee-calculator-multichain": {
      const errs = [
        requiredNumber(form.gasLimit, "Gas Limit (units)"),
        requiredNumber(form.gweiPrice, "Gas Price (gwei)"),
        requiredNumber(form.ethUsd, "Native Coin USD Price"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const gasLimit = n(form.gasLimit);
      const gwei = n(form.gweiPrice);
      const coinUsd = n(form.ethUsd);
      const chain = (form.chain || "ethereum").trim();
      if (gasLimit <= 0 || gwei < 0 || coinUsd < 0) return invalid("Gas limit must be > 0; gwei and coin price must be non-negative.");
      const feeEth = (gasLimit * gwei) / 1e9;
      const feeUsd = feeEth * coinUsd;
      const chainHint =
        chain === "polygon"
          ? "Polygon: wallet often shows lower gwei - compare to Polygonscan gas tracker."
          : chain === "arbitrum" || chain === "optimism" || chain === "base"
            ? `${chain}: L2 fees include batch data costs - wallet estimates beat manual math.`
            : "Ethereum L1: use base fee + priority fee from your wallet for precision.";
      return {
        title: "Estimated Transaction Fee",
        value: `${feeEth.toFixed(6)} native ≈ ${money(feeUsd)}`,
        extra: [`Chain context: ${chain}`, chainHint, "Directional estimate only - not a live quote."],
      };
    }
    case "nft-royalty-calculator": {
      const errs = [
        requiredNumber(form.salePrice, "Sale Price"),
        requiredNumber(form.royaltyPercent, "Royalty (%)"),
        requiredNumber(form.marketplaceFeePercent, "Marketplace Fee (%)"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const price = n(form.salePrice);
      const roy = n(form.royaltyPercent);
      const fee = n(form.marketplaceFeePercent);
      if (price < 0 || roy < 0 || fee < 0 || roy > 100 || fee > 100) return invalid("Use non-negative price and percents between 0 and 100.");
      const royalty = price * (roy / 100);
      const mpFee = price * (fee / 100);
      const seller = price - mpFee - royalty;
      return {
        title: "Creator Royalty (Estimate)",
        value: money(royalty),
        extra: [`Marketplace fee: ${money(mpFee)}`, `Approx. seller proceeds after fee+royalty: ${money(seller)}`, "Enforcement depends on marketplace and chain; numbers are pre-tax."],
      };
    }
    case "ai-citation-checker": {
      const text = (form.pastedText || "").trim();
      if (text.length < 50) return invalid("Paste at least ~50 characters of draft text to analyze.");
      const lower = text.toLowerCase();
      const urls = text.match(/https?:\/\/[^\s)\]>"']+/gi) ?? [];
      const doiLike = (text.match(/\b10\.\d{4,9}\/[-._;()/:a-z0-9]+/gi) ?? []).length;
      const parenYear = /\([12]\d{3}\)/.test(text);
      const vague = ["studies show", "research suggests", "experts say", "science says", "it is well known", "many believe", "according to experts"]
        .filter((p) => lower.includes(p));
      const pct = text.match(/\d+(?:\.\d+)?%/g) ?? [];
      const bigNums = text.match(/\b\d{3,}(?:,\d{3})*(?:\.\d+)?\b|\b\d+\.\d+\b/g) ?? [];
      let score = 25;
      score += Math.min(35, urls.length * 12);
      score += doiLike > 0 ? 15 : 0;
      score += parenYear ? 8 : 0;
      if (vague.length) score -= Math.min(20, vague.length * 7);
      if (pct.length > 0 && urls.length === 0 && doiLike === 0) score -= 12;
      if (bigNums.length > 2 && urls.length === 0 && doiLike === 0) score -= 8;
      score = Math.max(0, Math.min(100, Math.round(score)));
      const band = score >= 72 ? "Stronger citation signals" : score >= 45 ? "Mixed - tighten sources" : "Weak - add verifiable references";
      const tips = [
        urls.length ? `Linked sources detected: ${urls.length}. Prefer primary studies or official docs over tertiary blogs.` : "No URLs found - add links to primary sources, datasets, or official documentation where claims are factual.",
        vague.length ? `Replace vague attributions (${vague.length}) with named institutions, paper titles, or dated reports.` : "Good: few generic “studies show” phrases in this sample.",
        pct.length && !urls.length && !doiLike
          ? "Percent or stat-heavy passage without links - add one source per non-obvious quantitative claim."
          : "Keep a 1:1 habit: each surprising number maps to a checkable reference.",
        "This is a heuristic draft review only - it cannot verify truth or detect model hallucinations.",
      ];
      return {
        title: `Citation readiness: ${score}/100 (${band})`,
        value: `URLs: ${urls.length} | DOI-like ids: ${doiLike} | Vague attribution phrases: ${vague.length} | % mentions: ${pct.length}`,
        extra: tips,
      };
    }
    case "geo-score-calculator": {
      const yn = (v: string | undefined) => ((v || "").trim().toLowerCase() === "yes" ? 1 : 0) as 0 | 1;
      const wAbout = yn(form.clearAboutPage);
      const wFaq = yn(form.faqBlock);
      const wSchema = yn(form.structuredData);
      const wPrimary = yn(form.primarySources);
      const wCompare = yn(form.comparisonContent);
      const wFresh = yn(form.visibleFreshness);
      const raw = wAbout * 17 + wFaq * 17 + wSchema * 17 + wPrimary * 17 + wCompare * 16 + wFresh * 16;
      const score = Math.min(100, raw);
      const label =
        score >= 83 ? "High GEO alignment (self-reported)" : score >= 50 ? "Partial - close the gaps below" : "Foundational work needed";
      const missing: string[] = [];
      if (!wAbout) missing.push("Publish a crisp About/Authority page: who you are, credentials, and what you sell.");
      if (!wFaq) missing.push("Add an on-page FAQ that answers verbatim questions people ask models and search.");
      if (!wSchema) missing.push("Ship JSON-LD (Organization, FAQ, or Article) that matches visible content.");
      if (!wPrimary) missing.push("Link to primary sources for stats, regulations, and product specs.");
      if (!wCompare) missing.push("Add comparison or how-to depth models can excerpt - not only landing copy.");
      if (!wFresh) missing.push("Show freshness: dates, changelogs, or “last reviewed” for YMYL-adjacent topics.");
      return {
        title: `GEO readiness score: ${score}/100`,
        value: `${label}. Based only on the checklist you selected - tune weights in your own rubric.`,
        extra: [
          ...missing,
          "GEO (generative engine optimization) is evolving; re-audit quarterly as surfaces and policies change.",
        ],
      };
    }
    case "reddit-keyword-opportunity-finder": {
      const theme = (form.subredditTheme || "").trim();
      const seeds = (form.seedKeywords || "").trim();
      const goal = (form.postGoal || "discussion").trim();
      if (!theme || !seeds) return invalid("Subreddit/theme focus and seed keywords are required.");
      const tokens = seeds
        .split(/[\n,]+/)
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 24);
      const angles = [
        `Angle 1  -  “Explain like I’m new”: a balanced post that defines ${tokens[0] || theme} without promo, invites corrections in comments.`,
        `Angle 2  -  “What failed for me”: story-led thread on ${theme} with specific constraints; Reddit rewards specificity over buzzwords.`,
        `Angle 3  -  Resource thread: curated list (tools, readings, communities) tied to ${tokens.slice(0, 3).join(", ") || theme} - one comment per item.`,
        `Angle 4  -  Ask for frameworks: “How do you decide X when Y?” referencing ${theme} - signals discussion, not spam.`,
      ];
      const goalNote =
        goal === "traffic"
          ? "Traffic goal: lead with value in the text body; put any link in a follow-up comment after engagement starts (follow sub rules)."
          : goal === "research"
            ? "Research goal: ask one focused question, offer what you already tried, and request contrasting experiences."
            : "Discussion goal: avoid bare links; write so the post stands alone if the preview strips URLs.";
      return {
        title: "Reddit content angles (manual research still required)",
        value: `Theme: ${theme} | Seeds: ${tokens.length} keyword(s). ${goalNote}`,
        extra: [...angles, "No search volumes here - validate demand by reading weekly threads, wiki, and pinned rules before posting."],
      };
    }
    case "x-viral-hook-generator": {
      const topic = (form.hookTopic || "").trim();
      const audience = (form.hookAudience || "").trim();
      const format = (form.hookFormat || "lesson").trim();
      const tone = (form.hookTone || "direct").trim();
      if (!topic || !audience) return invalid("Topic and audience are required.");
      const hooks = [
        `${tone === "bold" ? "Hot take: " : ""}${topic} is costing ${audience} more than they think - here’s the 1-line fix ↓`,
        `I studied ${topic} for 90 days (${audience}). 3 patterns kept showing up:`,
        format === "contrarian"
          ? `Unpopular opinion: the usual advice on ${topic} breaks for ${audience}. Thread.`
          : format === "take"
            ? `Stop scrolling - if you’re ${audience}, ${topic} boils down to this one move:`
            : `Mini-playbook: ${topic} for ${audience} (steal this structure for your next post)`,
        `Stop guessing on ${topic}. If you’re ${audience}, start with these 5 checks:`,
        `If I had to explain ${topic} to a smart ${audience} in one post, I’d open with this hook…`,
      ];
      return { title: "Hook variants for X", value: hooks[0], extra: hooks.slice(1) };
    }
    case "metadata-stripper-tool": {
      const raw = (form.metadataBlock || "").trim();
      if (!raw.length) return invalid("Paste metadata text (EXIF-style lines, JSON, or key: value blocks).");
      const sensitiveKey =
        /^(GPS|GPSLatitude|GPSLongitude|GPSPosition|BodySerial|LensSerial|ImageUniqueID|CameraOwner|HostComputer|Thumbnail|XMPToolkit|MetadataDate)/i;
      const lines = raw.split(/\r?\n/);
      const stripped: string[] = [];
      const removed: string[] = [];
      for (const line of lines) {
        const m = /^([^:=\t]{1,80})[\t:=]\s*(.*)$/.exec(line.trim());
        if (m) {
          const key = m[1].trim();
          if (sensitiveKey.test(key) || /latitude|longitude|serial|unique\s*id/i.test(key)) {
            removed.push(key);
            continue;
          }
        }
        stripped.push(line);
      }
      const out = stripped.join("\n").trim();
      if (!out.length) return invalid("After stripping sensitive keys, nothing remained - review patterns or paste a fuller dump.");
      return {
        title: "Stripped metadata (review before sharing files)",
        value: out.slice(0, 4000) + (out.length > 4000 ? "\n…[truncated for display; copy from full output in your editor if needed]" : ""),
        extra: [
          removed.length ? `Removed or skipped ${removed.length} sensitive-looking field(s): ${removed.slice(0, 12).join(", ")}${removed.length > 12 ? "…" : ""}` : "No high-risk keys matched common EXIF/GPS/serial patterns - still manually verify.",
          "Binary files are not parsed here - export metadata as text from your OS or exiftool, then paste.",
          "For images, prefer stripping in an editor or dedicated privacy tool before publishing originals.",
        ],
      };
    }
    case "tiktok-hook-analyzer": {
      const script = (form.openingScript || "").trim();
      if (!script.length) return invalid("Paste your opening lines or on-screen script.");
      const firstLine = script.split(/\n/)[0]?.trim() ?? script;
      const words = script.split(/\s+/).filter(Boolean).length;
      const charsFirst = firstLine.length;
      const hasQ = /\?/.test(firstLine);
      const hasNum = /\d/.test(firstLine);
      const urgency = /\b(now|today|stop|don’t|do not|secret|mistake|actually)\b/i.test(firstLine);
      const grade =
        charsFirst > 0 && charsFirst <= 90 && (hasQ || hasNum || urgency) ? "Strong opening density" : charsFirst > 120 ? "First line may be too long for mobile preview" : "Room to sharpen the hook";
      const tips = [
        `First line: ${charsFirst} characters, ${firstLine.split(/\s+/).length} words - aim for instant context in ~6–12 words when possible.`,
        hasQ ? "Question hook detected - answer the promise fast in the next 2 seconds of video." : "Try a question or bold claim in line one to lift watch-through.",
        hasNum ? "Numeric hook present - make sure the payoff appears before users scroll." : "Consider a concrete number or time-bound claim if accurate.",
        `Total words in paste: ${words}. Match spoken pace to your target length (${n(form.targetLengthSec, 15)}s field is advisory only).`,
        "Heuristic only - pair with TikTok analytics on 3s/6s retention for real performance data.",
      ];
      return { title: `Hook heuristics: ${grade}`, value: `Preview: “${firstLine.slice(0, 140)}${firstLine.length > 140 ? "…" : ""}”`, extra: tips };
    }
    case "youtube-shorts-scene-planner": {
      const hook = (form.shortHook || "").trim();
      const body = (form.mainBeat || "").trim();
      const cta = (form.shortCta || "").trim();
      const secs = Math.round(n(form.totalSeconds, 30));
      if (!hook || !body || !cta) return invalid("Hook, main beat, and CTA are required.");
      if (secs < 15 || secs > 180) return invalid("Target length: 15–180 seconds for this planner.");
      const t1 = Math.max(2, Math.round(secs * 0.12));
      const t2 = Math.max(3, Math.round(secs * 0.55));
      const fmtT = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${String(s).padStart(2, "0")}`;
      };
      const s0 = 0;
      const s1 = t1;
      const s2 = t1 + t2;
      const s3 = secs;
      const scenes = [
        `${fmtT(s0)}–${fmtT(s1)}  -  Hook on-screen: ${hook.slice(0, 120)}${hook.length > 120 ? "…" : ""} | Visual: tight face or bold text card.`,
        `${fmtT(s1)}–${fmtT(s2)}  -  Payoff / demo: ${body.slice(0, 160)}${body.length > 160 ? "…" : ""} | Visual: b-roll or screen record.`,
        `${fmtT(s2)}–${fmtT(s3)}  -  CTA + loop cue: ${cta.slice(0, 120)}${cta.length > 120 ? "…" : ""} | Visual: subscribe reminder + first-frame callback.`,
      ];
      return {
        title: `Shorts beat sheet (~${secs}s)`,
        value: scenes[0],
        extra: [...scenes.slice(1), "Adjust timestamps after you read voice-over aloud - padding beats beats rushing.", "Keep on-screen text under ~42 characters per card when possible."],
      };
    }
    case "retention-hook-analyzer": {
      const script = (form.fullScript || "").trim();
      if (script.length < 30) return invalid("Paste a fuller script or bullet outline (30+ characters).");
      const lines = script.split(/\n/).map((l) => l.trim()).filter(Boolean);
      const first = lines[0] ?? script.slice(0, 200);
      const words = first.split(/\s+/).filter(Boolean);
      const openSnippet = words.slice(0, 12).join(" ");
      const openTruncated = words.length > 12;
      const patternBreaks = ["but", "however", "here’s", "here is", "watch this", "number", "step", "secret", "mistake"].filter((w) => script.toLowerCase().includes(w));
      const bullets = script.split(/\n/).filter((l) => /^[-*•\d.]/.test(l.trim())).length;
      return {
        title: "Retention pattern notes (heuristic)",
        value: `Open: “${openSnippet}${openTruncated ? "…" : ""}”  -  ${patternBreaks.length ? `${patternBreaks.length} potential pattern-shift word(s) in script` : "Add a mid-video pattern interrupt (new angle, prop, or on-screen text)."}`,
        extra: [
          bullets >= 2 ? `List-style beats detected (${bullets}) - good for skim retention; verbally number them on camera.` : "Try 2–3 numbered beats so viewers sense progress.",
          "Place the strongest payoff before the midpoint; replays often drop after perceived ‘answer revealed’.",
          "Add one open loop early (“at the end I’ll share…”) only if you actually close it - avoid clickbait fatigue.",
          "No platform API here - validate with YouTube/TikTok retention curves, not this text alone.",
        ],
      };
    }
    case "tiktok-trend-predictor": {
      const niche = (form.contentNiche || "").trim();
      const cadence = (form.postingCadence || "weekly").trim();
      const pillar = (form.contentPillar || "").trim();
      const notes = (form.marketNotes || "").trim();
      if (!niche || !pillar) return invalid("Niche and main content pillar are required.");
      const cadenceTip =
        cadence === "daily"
          ? "High cadence: prioritize low-production hooks + batch film; watch for creative fatigue in comments."
          : cadence === "weekly"
            ? "Weekly cadence: each post should carry a clearer standalone arc; test 2 thumbnails/text overlays per idea."
            : "Sparse cadence: lean into evergreen hooks and SEO-style captions so discovery isn’t only For You timing.";
      return {
        title: "Trend readiness framework (not a live forecast)",
        value: `${cadenceTip} Niche: ${niche} | Pillar: ${pillar}${notes ? ` | Notes folded in: yes` : ""}.`,
        extra: [
          "Signals to monitor yourself: save rate vs views, comment themes, stitch/duet uptake, and which sounds you outperform on.",
          "Creative matrix: cross 3 hooks × 2 formats (talking head vs b-roll) × 2 first-frame styles; log outcomes in a spreadsheet.",
          "Seasonality: map your niche to calendar events 4–6 weeks out - lead time matters more than guessing daily spikes.",
          "This tool does not pull TikTok data or predict virality; it structures how you observe and test responsibly.",
        ],
      };
    }
    case "child-support-calculator": {
      const errs = [
        requiredNumber(form.parentAIncome, "Parent A income"),
        requiredNumber(form.parentBIncome, "Parent B income"),
        requiredNumber(form.numChildren, "Number of children"),
        requiredNumber(form.custodyWithA, "Custody % with Parent A"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const A = n(form.parentAIncome);
      const B = n(form.parentBIncome);
      const kids = Math.floor(n(form.numChildren));
      const custA = n(form.custodyWithA);
      if (A < 0 || B < 0) return invalid("Incomes cannot be negative.");
      if (kids < 1 || kids > 20) return invalid("Number of children must be between 1 and 20.");
      if (custA < 0 || custA > 100) return invalid("Custody % must be between 0 and 100.");
      const combined = A + B;
      if (combined <= 0) return invalid("Combined income must be greater than zero.");
      const pctByN = [0, 0.2, 0.28, 0.32, 0.35];
      const basePct = kids >= 5 ? 0.37 : pctByN[Math.min(kids, 4)];
      const obligation = combined * basePct;
      const shareA = A / combined;
      const shareB = B / combined;
      const pA = custA / 100;
      const pB = 1 - pA;
      let monthly = 0;
      if (Math.abs(pA - 0.5) < 0.001) {
        monthly = obligation * Math.abs(shareA - shareB) * 0.5;
      } else if (pA > 0.5) {
        const ncpShare = shareB;
        const ncpCustody = pB;
        monthly = obligation * ncpShare * Math.max(0.15, 1 - 0.85 * Math.min(1, ncpCustody / 0.5));
      } else {
        const ncpShare = shareA;
        const ncpCustody = pA;
        monthly = obligation * ncpShare * Math.max(0.15, 1 - 0.85 * Math.min(1, ncpCustody / 0.5));
      }
      return {
        title: "Estimated monthly transfer",
        value: moneyLocale(monthly),
        extra: [
          `Combined income: ${moneyLocale(combined)}/mo`,
          `Simplified total child-support obligation (both parents): ~${moneyLocale(obligation)}/mo`,
          "This is an estimate only. Consult a family law attorney and your official state guidelines.",
        ],
      };
    }
    case "alimony-estimator": {
      const errs = [
        requiredNumber(form.marriageYears, "Marriage length"),
        requiredNumber(form.higherIncome, "Higher earner income"),
        requiredNumber(form.lowerIncome, "Lower earner income"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const years = n(form.marriageYears);
      const hi = n(form.higherIncome);
      const lo = n(form.lowerIncome);
      if (years < 0) return invalid("Marriage length cannot be negative.");
      if (hi < 0 || lo < 0) return invalid("Incomes cannot be negative.");
      const gap = hi - lo;
      if (gap <= 0) return invalid("Higher earner income must be greater than lower earner income.");
      const gapPct = n(form.gapPercent, 35) / 100;
      if (gapPct < 0.3 || gapPct > 0.4) return invalid("Select a valid percentage of the income gap.");
      const monthly = gap * gapPct;
      const durMult = n(form.durationFactor, 0.75);
      if (![0.5, 0.75, 1].includes(durMult)) return invalid("Select a valid duration multiplier.");
      const durationMonths = Math.max(0, Math.round(years * 12 * durMult));
      return {
        title: "Estimated monthly alimony",
        value: moneyLocale(monthly),
        extra: [
          `Estimated duration: ${durationMonths.toLocaleString("en-US")} months (~${(durationMonths / 12).toFixed(1)} yrs)`,
          `Income gap: ${moneyLocale(gap)}/mo at ${(gapPct * 100).toFixed(0)}%`,
          "This is not legal advice. Courts use need, ability to pay, and local statute - verify with an attorney.",
        ],
      };
    }
    case "small-claims-court-calculator": {
      const err = requiredNumber(form.claimAmount, "Claim amount");
      if (err) return invalid(err);
      const claim = n(form.claimAmount);
      const state = (form.state || "").trim().toUpperCase();
      const row = SMALL_CLAIMS_BY_STATE[state];
      if (!row) return invalid("Select a valid US state.");
      if (claim < 0) return invalid("Claim amount cannot be negative.");
      const qualifies = claim <= row.limit;
      return {
        title: qualifies ? "Fits typical small claims limit" : "Above typical small claims limit",
        value: qualifies ? `Yes  -  within $${row.limit.toLocaleString("en-US")} cap` : `No  -  over $${row.limit.toLocaleString("en-US")} cap`,
        extra: [
          `Representative court limit: $${row.limit.toLocaleString("en-US")}`,
          `Typical filing fee (estimate): $${row.filingFee.toLocaleString("en-US")}`,
          `Your claim: $${claim.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          "Limits and fees vary by county and court - confirm on the official court site before filing.",
        ],
      };
    }
    case "notice-period-calculator": {
      const startRaw = (form.startDate || "").trim();
      if (!startRaw) return invalid("Employment start date is required (YYYY-MM-DD).");
      const start = parseISODateLocal(startRaw);
      if (!start) return invalid("Use a valid start date in YYYY-MM-DD format.");
      const country = (form.country || "UK").trim();
      const end = new Date();
      end.setHours(0, 0, 0, 0);
      if (start.getTime() > end.getTime()) return invalid("Start date cannot be in the future.");
      const msDay = 86400000;
      const tenureDays = Math.floor((end.getTime() - start.getTime()) / msDay);
      const fullYears = tenureDays / 365.25;
      let weeks = 0;
      if (country === "UK") {
        if (tenureDays < 28) weeks = 0;
        else if (fullYears < 2) weeks = 1;
        else weeks = Math.min(12, Math.floor(fullYears));
      } else if (country === "AU") {
        if (fullYears < 1) weeks = 1;
        else if (fullYears < 3) weeks = 2;
        else if (fullYears < 5) weeks = 3;
        else weeks = 4;
      } else if (country === "CA") {
        if (fullYears < 0.25) weeks = 0;
        else if (fullYears < 3) weeks = 1;
        else if (fullYears < 8) weeks = 2;
        else weeks = 3;
      } else if (country === "IE") {
        if (tenureDays < 91) weeks = 0;
        else if (fullYears < 2) weeks = 1;
        else if (fullYears < 5) weeks = 2;
        else if (fullYears < 10) weeks = 4;
        else if (fullYears < 15) weeks = 6;
        else weeks = 8;
      } else return invalid("Select a supported country.");
      const emp = (form.employmentType || "ft").trim();
      const extra: string[] = [
        `Approx. tenure: ${tenureDays.toLocaleString("en-US")} days (${fullYears.toFixed(1)} yrs)`,
        emp === "pt"
          ? "Part-time: many jurisdictions use the same statutory minima - confirm locally."
          : "Full-time: figures are general planning estimates only.",
        "Not legal advice - verify with official guidance or an employment lawyer.",
      ];
      const resRaw = (form.resignationDate || "").trim();
      if (resRaw) {
        const res = parseISODateLocal(resRaw);
        if (!res) return invalid("Resignation date must be YYYY-MM-DD or left blank.");
        const last = new Date(res);
        last.setDate(last.getDate() + weeks * 7);
        const iso = last.toISOString().slice(0, 10);
        extra.unshift(`If notice starts ${resRaw}: last working day ≈ ${iso} (+${weeks.toLocaleString("en-US")} calendar weeks)`);
      }
      return {
        title: "Statutory-style minimum notice",
        value: `${weeks.toLocaleString("en-US")} week${weeks === 1 ? "" : "s"}`,
        extra,
      };
    }
    case "severance-pay-calculator": {
      const errs = [requiredNumber(form.yearsService, "Years of service"), requiredNumber(form.weeklySalary, "Weekly salary")].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const years = n(form.yearsService);
      const weekly = n(form.weeklySalary);
      if (years < 0) return invalid("Years of service cannot be negative.");
      if (weekly < 0) return invalid("Weekly salary cannot be negative.");
      const country = (form.country || "US").trim();
      let estWeeks = 0;
      if (country === "US") {
        estWeeks = Math.min(52, Math.max(0, years));
      } else if (country === "UK") {
        estWeeks = Math.min(30, Math.max(0, years * 1));
      } else if (country === "CA") {
        estWeeks = Math.min(40, Math.max(0, years * 1.25));
      } else if (country === "AU") {
        if (years < 1) estWeeks = 0;
        else estWeeks = Math.min(16, 4 + 2 * (Math.floor(years) - 1));
      } else return invalid("Select a valid country.");
      const total = estWeeks * weekly;
      return {
        title: "Estimated severance",
        value: moneyLocale(total),
        extra: [
          `Estimated weeks of pay: ${estWeeks.toLocaleString("en-US")}`,
          `Weekly salary: ${moneyLocale(weekly)}`,
          "Planning estimate only - statutory redundancy, contracts, and caps vary widely.",
        ],
      };
    }
    case "recipe-scaling-calculator": {
      const oErr = requiredNumber(form.originalServings, "Original servings");
      const dErr = requiredNumber(form.desiredServings, "Desired servings");
      if (oErr) return invalid(oErr);
      if (dErr) return invalid(dErr);
      const orig = n(form.originalServings);
      const des = n(form.desiredServings);
      if (orig <= 0) return invalid("Original servings must be greater than zero.");
      if (des < 0) return invalid("Desired servings cannot be negative.");
      const raw = (form.ingredientLines || "").trim();
      if (!raw) return invalid("Add at least one ingredient line (name|amount|unit).");
      const factor = des / orig;
      const lines = raw.split(/\n/).map((l) => l.trim()).filter(Boolean);
      if (lines.length > 24) return invalid("Use at most 24 ingredient lines.");
      const scaled: string[] = [];
      for (let i = 0; i < lines.length; i++) {
        const parts = lines[i].split("|").map((p) => p.trim());
        let name = `Ingredient ${i + 1}`;
        let amtStr: string;
        let unit: string;
        if (parts.length >= 3) {
          name = parts[0] || name;
          amtStr = parts[1] ?? "";
          unit = parts[2] ?? "";
        } else if (parts.length === 2) {
          amtStr = parts[0] ?? "";
          unit = parts[1] ?? "";
        } else return invalid(`Line ${i + 1}: use name|amount|unit or amount|unit.`);
        const amt = Number(amtStr.replace(/,/g, ""));
        if (!Number.isFinite(amt)) return invalid(`Line ${i + 1}: amount must be a number.`);
        const scaledAmt = amt * factor;
        const dec = scaledAmt >= 10 || Number.isInteger(scaledAmt) ? 2 : 3;
        scaled.push(`${name}: ${scaledAmt.toLocaleString("en-US", { maximumFractionDigits: dec })} ${unit}`.trim());
      }
      return {
        title: `Scaled × ${factor.toLocaleString("en-US", { maximumFractionDigits: 4 })} (${des.toLocaleString("en-US")}/${orig.toLocaleString("en-US")} servings)`,
        value: scaled[0] ?? "",
        extra: [...scaled.slice(1), "Round to practical measures (e.g. nearest tsp) before baking."],
      };
    }
    case "baking-ingredient-substitution-calculator": {
      const err = requiredNumber(form.amount, "Amount");
      if (err) return invalid(err);
      const amt = n(form.amount);
      const unit = (form.unit || "g").trim();
      const ing = (form.ingredient || "").trim();
      if (amt <= 0) return invalid("Amount must be greater than zero.");
      if (ing === "eggs" && unit !== "whole") return invalid('For eggs, choose the unit "Whole eggs".');
      const toGrams = (): number => {
        if (ing === "eggs" && unit === "whole") return amt * 50;
        const perCup: Record<string, number> = {
          butter: 227,
          flour: 120,
          sugar: 200,
          milk: 245,
          buttermilk: 245,
          oil: 218,
          cream: 238,
          honey: 340,
        };
        const perTbsp: Record<string, number> = {
          butter: 14.2,
          flour: 7.8,
          sugar: 12.5,
          milk: 15.2,
          buttermilk: 15.2,
          oil: 14,
          cream: 15,
          honey: 21,
          "baking-powder": 4.2,
        };
        const perTsp: Record<string, number> = { "baking-powder": 1.4, flour: 2.6, sugar: 4.2 };
        if (unit === "g") return amt;
        if (unit === "ml" && ["milk", "buttermilk", "cream", "oil", "honey"].includes(ing)) return amt;
        if (unit === "cup") return (perCup[ing] ?? 0) * amt;
        if (unit === "tbsp") return (perTbsp[ing] ?? 0) * amt;
        if (unit === "tsp") {
          const t = perTsp[ing];
          if (t !== undefined) return t * amt;
          const tb = perTbsp[ing];
          return tb !== undefined ? (tb / 3) * amt : NaN;
        }
        if (unit === "whole" && ing === "eggs") return amt * 50;
        return NaN;
      };
      const g = toGrams();
      if (!Number.isFinite(g) || g <= 0) return invalid("Pick a unit that matches the ingredient (e.g. whole eggs, or g/cup/tbsp/tsp).");
      const opt: string[] = [];
      const fmt = (v: number) => v.toLocaleString("en-US", { maximumFractionDigits: 2 });
      if (ing === "eggs") {
        const nEg = amt;
        opt.push(`Flax egg: ${fmt(nEg)} tbsp ground flax + ${fmt(nEg * 3)} tbsp water  -  rest 5 min.`);
        opt.push(`Applesauce: ~${fmt(nEg * 60)} g unsweetened applesauce (moisture-heavy).`);
        opt.push(`Mashed banana: ~${fmt(nEg * 50)} g (adds sweetness; may brown faster).`);
      } else if (ing === "butter") {
        opt.push(`Vegetable oil: ~${fmt(g * 0.75)} g (less for cookies; more moisture in cakes).`);
        opt.push(`Applesauce: ~${fmt(g * 0.8)} g (reduce other liquids slightly).`);
        opt.push(`Shortening / margarine (baking): ~${fmt(g)} g 1:1 by weight.`);
      } else if (ing === "milk") {
        opt.push(`Water + dry milk: use ${fmt(g)} ml water + powdered milk per package directions.`);
        opt.push(`Unsweetened soy/oat milk: ~${fmt(g)} ml 1:1 in most batters.`);
        opt.push(`Evaporated milk + water: half evaporated + half water to match ~${fmt(g)} ml total (adjust to taste).`);
      } else if (ing === "flour") {
        opt.push(`Gluten-free 1:1 blend: ~${fmt(g)} g by weight (brand blends vary).`);
        opt.push(`Whole wheat: ~${fmt(g * 0.85)} g + a little extra liquid (absorbs more).`);
        opt.push(`Cornstarch (for partial sub, sauces): up to ~${fmt(g * 0.25)} g of flour replaced by cornstarch for tenderness - not 1:1 for all flour.`);
      } else if (ing === "sugar") {
        opt.push(`Honey: ~${fmt(g * 0.75)} g + reduce other liquids ~${fmt(g * 0.25)} ml (honey is sweeter & wet).`);
        opt.push(`Maple syrup: ~${fmt(g * 0.75)} g + reduce liquids slightly.`);
        opt.push(`Coconut sugar: ~${fmt(g)} g by weight (deeper flavor, may spread differently).`);
      } else if (ing === "baking-powder") {
        opt.push(`1 tsp baking powder ≈ ¼ tsp baking soda + ½ tsp cream of tartar  -  for ~${fmt(g)} g BP, scale that ratio.`);
        opt.push(`If recipe also has acid (yogurt, lemon), you may use a little less powder - test rise.`);
        opt.push(`Self-raising flour already contains leavener - do not double up without adjusting recipe.`);
      } else if (ing === "buttermilk") {
        opt.push(`Milk + acid: ${fmt(g)} ml milk + ${fmt(Math.max(1, g / 250 * 15))} ml lemon juice or vinegar  -  rest 5 min.`);
        opt.push(`Plain yogurt thinned: ~${fmt(g * 0.75)} g yogurt + ${fmt(g * 0.25)} ml water/milk.`);
        opt.push(`Kefir: ~${fmt(g)} ml as 1:1 substitute.`);
      } else if (ing === "oil") {
        opt.push(`Melted butter: ~${fmt(g * 1.1)} g (richer flavor; solidifies when cold).`);
        opt.push(`Applesauce (oil reduction in cakes): up to ~${fmt(g * 0.5)} g swap - keep some fat for texture.`);
        opt.push(`Greek yogurt: ~${fmt(g * 0.75)} g in some muffin/cake recipes (denser crumb).`);
      } else if (ing === "cream") {
        opt.push(`Milk + butter: ~${fmt(g * 0.7)} ml milk + ${fmt(g * 0.3 * 0.9)} g melted butter blended (rough heavy-cream mimic).`);
        opt.push(`Evaporated milk: ~${fmt(g)} ml in sauces/soups (less fat than cream).`);
        opt.push(`Coconut cream: ~${fmt(g)} g (distinct flavor; whips if chilled).`);
      } else if (ing === "honey") {
        opt.push(`Maple syrup: ~${fmt(g * 1.1)} g (adjust sweetness).`);
        opt.push(`Granulated sugar + water: ~${fmt(g * 1.25)} g sugar + ${fmt(g * 0.25)} ml warm water (dissolve).`);
        opt.push(`Agave: ~${fmt(g)} g (sweeter - use ~10–20% less).`);
      } else {
        return invalid("Select a supported ingredient.");
      }
      return {
        title: "Substitution options",
        value: opt[0] ?? "",
        extra: [...opt.slice(1), `Based on ~${g.toLocaleString("en-US", { maximumFractionDigits: 1 })} g equivalent for your input.`],
      };
    }
    case "cooking-time-temperature-calculator": {
      const wErr = requiredNumber(form.weight, "Weight");
      if (wErr) return invalid(wErr);
      let kg = n(form.weight);
      const wu = (form.weightUnit || "kg").trim();
      if (kg <= 0) return invalid("Weight must be greater than zero.");
      if (wu === "lb") kg *= 0.453592;
      const meat = (form.meatType || "").trim();
      const done = (form.doneness || "medium").trim();
      let tempC = 180;
      let tempF = 356;
      let internalC = 63;
      let mins = 60;
      const poultry = meat === "chicken-whole" || meat === "chicken-breast" || meat === "turkey";
      if (poultry) {
        internalC = 74;
        if (meat === "chicken-whole") {
          tempC = 180;
          mins = 45 * kg + 20;
        } else if (meat === "chicken-breast") {
          tempC = 200;
          mins = 24 * kg + 12;
        } else {
          tempC = 160;
          mins = 35 * kg + 25;
        }
      } else if (meat === "beef-roast") {
        tempC = 200;
        if (done === "rare") {
          internalC = 52;
          mins = 28 * kg + 18;
        } else if (done === "medium") {
          internalC = 63;
          mins = 32 * kg + 22;
        } else {
          internalC = 71;
          mins = 38 * kg + 28;
        }
      } else if (meat === "lamb-leg") {
        tempC = 180;
        internalC = done === "rare" ? 55 : done === "medium" ? 63 : 71;
        mins = 50 * kg + 25;
      } else if (meat === "pork-loin") {
        tempC = 180;
        internalC = 63;
        mins = 45 * kg + 25;
      } else return invalid("Select a meat type.");
      tempF = Math.round((tempC * 9) / 5 + 32);
      const internalF = Math.round((internalC * 9) / 5 + 32);
      const note =
        poultry
          ? "Poultry: use well-done internal temperature; doneness menu applies mainly to red-meat roasts here."
          : "Rest meat covered before carving; internal temp rises slightly while resting.";
      return {
        title: "Estimated roast time",
        value: formatDurationMinutes(mins),
        extra: [
          `Oven: ~${tempC.toLocaleString("en-US")} °C (~${tempF.toLocaleString("en-US")} °F)`,
          `Target internal: ~${internalC.toLocaleString("en-US")} °C (~${internalF.toLocaleString("en-US")} °F)`,
          `Weight used: ${kg.toLocaleString("en-US", { maximumFractionDigits: 2 })} kg`,
          note,
          "Always confirm with a food thermometer - ovens and cuts vary.",
        ],
      };
    }
    case "calorie-burn-by-food-calculator": {
      const food = (form.foodItem || "").trim();
      const ex = (form.exerciseType || "walking").trim();
      const calMap: Record<string, number> = {
        pizza: 285,
        burger: 350,
        chocolate: 230,
        coke: 140,
        fries: 400,
        wine: 125,
        beer: 180,
        donut: 260,
        cheesecake: 400,
      };
      const burnPerMin: Record<string, number> = {
        walking: 4.2,
        running: 11,
        cycling: 8,
        swimming: 9,
        gym: 6.5,
      };
      const cals = calMap[food];
      const bpm = burnPerMin[ex];
      if (cals === undefined) return invalid("Select a food item.");
      if (bpm === undefined) return invalid("Select an exercise type.");
      const minutes = cals / bpm;
      const milesWalkEquiv = cals / 100;
      const kmWalkEquiv = milesWalkEquiv * 1.60934;
      return {
        title: "Approx. time to burn it off",
        value: `${minutes.toLocaleString("en-US", { maximumFractionDigits: 0 })} min (${ex.replace(/^\w/, (x) => x.toUpperCase())})`,
        extra: [
          `Food energy (typical portion): ~${cals.toLocaleString("en-US")} kcal`,
          `Equivalent easy walking distance (rough): ~${milesWalkEquiv.toLocaleString("en-US", { maximumFractionDigits: 1 })} mi (~${kmWalkEquiv.toLocaleString("en-US", { maximumFractionDigits: 1 })} km)`,
          "Estimates assume a mid-weight adult; metabolism and intensity vary.",
        ],
      };
    }
    case "alcohol-unit-calculator": {
      const abvErr = requiredNumber(form.abv, "ABV %");
      const qErr = requiredNumber(form.quantity, "Quantity");
      if (abvErr) return invalid(abvErr);
      if (qErr) return invalid(qErr);
      const abv = n(form.abv);
      const qty = n(form.quantity);
      if (abv < 0 || abv > 100) return invalid("ABV must be between 0 and 100.");
      if (qty <= 0) return invalid("Quantity must be greater than zero.");
      const mlPer: Record<string, number> = {
        "pint-beer": 568,
        "glass-wine": 175,
        shot: 25,
        "bottle-wine": 750,
        "can-cider": 440,
      };
      const dt = (form.drinkType || "pint-beer").trim();
      const baseMl = mlPer[dt];
      if (!baseMl) return invalid("Select a drink type.");
      const totalMl = baseMl * qty;
      const pureMl = totalMl * (abv / 100);
      const units = pureMl / 10;
      const kcal = pureMl * 0.789 * 7;
      const hoursClear = units * 1;
      const vsNhs = units / 14;
      return {
        title: "Total UK alcohol units",
        value: `${units.toLocaleString("en-US", { maximumFractionDigits: 2 })} units`,
        extra: [
          `Pure alcohol: ~${pureMl.toLocaleString("en-US", { maximumFractionDigits: 1 })} ml`,
          `Approx. calories (ethanol only): ~${kcal.toLocaleString("en-US", { maximumFractionDigits: 0 })} kcal`,
          `Rough clearance: ~${hoursClear.toLocaleString("en-US", { maximumFractionDigits: 1 })} h (~1 h per unit, average)`,
          `vs NHS low-risk benchmark (14 units/week): ~${(vsNhs * 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}% of that weekly total in this entry alone`,
          "Drinking less is safer; this is not medical advice.",
        ],
      };
    }
    case "anxiety-level-self-assessment": {
      const keys = ["gad1", "gad2", "gad3", "gad4", "gad5", "gad6", "gad7"] as const;
      let total = 0;
      for (const k of keys) {
        const v = n(form[k], -1);
        if (![0, 1, 2, 3].includes(v)) return invalid("Answer every question using the 0–3 scale.");
        total += v;
      }
      let band: string;
      let rec: string;
      if (total <= 4) {
        band = "Minimal";
        rec = "Keep routines that support sleep, movement, and social connection.";
      } else if (total <= 9) {
        band = "Mild";
        rec = "Try brief daily relaxation (breathing, walks) and limit caffeine if jittery.";
      } else if (total <= 14) {
        band = "Moderate";
        rec = "Consider structured stress skills (CBT self-help, counseling) and discuss with a clinician.";
      } else {
        band = "Severe";
        rec = "Strongly consider speaking with a mental health professional for evaluation and support.";
      }
      return {
        title: `Total score: ${total.toLocaleString("en-US")} / 21  -  ${band}`,
        value: `Severity band: ${band}`,
        extra: [
          `Score breakdown: sum of seven items (0–3 each) = ${total.toLocaleString("en-US")}`,
          `Suggestion: ${rec}`,
          "This is not a medical diagnosis. Please consult a healthcare professional.",
        ],
      };
    }
    case "burnout-score-calculator": {
      const dims: { name: string; keys: string[] }[] = [
        { name: "Exhaustion", keys: ["b1", "b2", "b3", "b4"] },
        { name: "Cynicism", keys: ["b5", "b6", "b7", "b8"] },
        { name: "Inefficacy", keys: ["b9", "b10", "b11", "b12"] },
        { name: "Overload", keys: ["b13", "b14", "b15", "b16"] },
      ];
      const avgs: number[] = [];
      for (const d of dims) {
        let s = 0;
        for (const k of d.keys) {
          const err = requiredNumber(form[k], d.name);
          if (err) return invalid(err);
          const v = Math.round(n(form[k]));
          if (v < 1 || v > 5) return invalid(`Each item must be a whole number 1–5 (${k}).`);
          s += v;
        }
        avgs.push(s / 4);
      }
      const overall = avgs.reduce((a, b) => a + b, 0) / 4;
      let risk: string;
      if (overall < 2.2) risk = "Low";
      else if (overall < 2.9) risk = "Moderate";
      else if (overall < 3.6) risk = "High";
      else risk = "Critical";
      const tips: Record<string, string> = {
        Exhaustion: "Prioritize recovery blocks, sleep consistency, and sustainable workload boundaries.",
        Cynicism: "Reconnect to purpose in small wins; reduce chronic overload before expecting motivation to return.",
        Inefficacy: "Break tasks smaller, seek feedback early, and note completed work to rebuild mastery cues.",
        Overload: "Cut multitasking, negotiate deadlines, and use time-boxing for shallow work.",
      };
      const hi = avgs.indexOf(Math.max(...avgs));
      const hiName = dims[hi]?.name ?? "Exhaustion";
      const extra = dims.map((d, i) => `${d.name} avg: ${avgs[i].toFixed(2)} / 5 (${(avgs[i] * 4).toFixed(1)} / 20 sum)`);
      extra.push(`Overall risk: ${risk} (mean item ≈ ${overall.toFixed(2)} / 5)`);
      extra.push(`Strongest dimension: ${hiName}  -  ${tips[hiName] ?? tips.Exhaustion}`);
      extra.push("Not a clinical test. Seek professional help if you feel overwhelmed or unsafe.");
      return {
        title: `Burnout risk: ${risk}`,
        value: `Overall mean (1–5): ${overall.toFixed(2)}`,
        extra,
      };
    }
    case "sleep-quality-score-calculator": {
      const bed = parseHHMM(form.bedtime || "");
      const wake = parseHHMM(form.wakeTime || "");
      if (bed === null) return invalid("Bedtime must be HH:MM (24h), e.g. 22:30.");
      if (wake === null) return invalid("Wake time must be HH:MM (24h), e.g. 07:00.");
      const fa = requiredNumber(form.fallAsleepMins, "Minutes to fall asleep");
      const nw = requiredNumber(form.nightWakings, "Night wakings");
      const rs = requiredNumber(form.rested, "Rested rating");
      if (fa) return invalid(fa);
      if (nw) return invalid(nw);
      if (rs) return invalid(rs);
      const fallM = n(form.fallAsleepMins);
      const wakings = Math.floor(n(form.nightWakings));
      const rested = n(form.rested);
      if (fallM < 0 || wakings < 0 || wakings > 30) return invalid("Check sleep latency and wakings (0–30).");
      if (rested < 1 || rested > 10) return invalid("Rested rating must be 1–10.");
      let wakeM = wake;
      if (wakeM <= bed) wakeM += 24 * 60;
      const timeInBed = wakeM - bed;
      if (timeInBed < 30) return invalid("Time in bed seems too short - check times (wake after bed).");
      const lostWaking = wakings * 15;
      const sleepM = Math.max(0, timeInBed - fallM - lostWaking);
      const efficiency = Math.min(100, (sleepM / timeInBed) * 100);
      const sleepH = sleepM / 60;
      let quality = efficiency * 0.45 + rested * 5;
      if ((form.caffeineAfter2pm || "") === "yes") quality -= 8;
      if ((form.screenBeforeBed || "") === "yes") quality -= 8;
      quality -= wakings * 1.5;
      quality = Math.max(0, Math.min(100, quality));
      const targetH = 8;
      const debtWeek = Math.max(0, (targetH - sleepH) * 7);
      const tips: string[] = [];
      if (efficiency < 75) tips.push("Keep a fixed wake time and wind-down routine to protect time actually asleep.");
      if (wakings >= 2) tips.push("Limit fluids late evening; review bedroom light and temperature for fewer awakenings.");
      if ((form.caffeineAfter2pm || "") === "yes") tips.push("Shift caffeine earlier; half-life can still affect deep sleep.");
      if ((form.screenBeforeBed || "") === "yes") tips.push("Try 30–60 minutes screen-free before bed or use night modes and lower brightness.");
      if (tips.length === 0) tips.push("Maintain consistent schedule; daytime light exposure supports night sleep pressure.");
      return {
        title: `Sleep quality score: ${quality.toFixed(0)} / 100`,
        value: `Sleep efficiency ≈ ${efficiency.toFixed(1)}%`,
        extra: [
          `Approx. sleep: ${sleepH.toFixed(1)} h; time in bed: ${(timeInBed / 60).toFixed(1)} h`,
          `Rough weekly sleep debt vs 8 h/night: ${debtWeek.toFixed(1)} h`,
          ...tips,
          "For chronic insomnia or snoring/pauses in breathing, speak with a healthcare provider.",
        ],
      };
    }
    case "stress-score-quiz": {
      const raw: number[] = [];
      for (let i = 1; i <= 10; i++) {
        const k = `pss${i}`;
        const v = n(form[k], -1);
        if (![0, 1, 2, 3, 4].includes(v)) return invalid("Answer every item on the 0–4 scale.");
        raw.push(v);
      }
      const rev = (x: number) => 4 - x;
      const scored = [
        raw[0],
        raw[1],
        raw[2],
        rev(raw[3]),
        rev(raw[4]),
        raw[5],
        rev(raw[6]),
        rev(raw[7]),
        raw[8],
        raw[9],
      ];
      const total = scored.reduce((a, b) => a + b, 0);
      let cat: string;
      let compare: string;
      if (total <= 13) {
        cat = "Low perceived stress";
        compare = "Often below typical means in published community samples for PSS-10.";
      } else if (total <= 26) {
        cat = "Moderate perceived stress";
        compare = "Near the broad middle of many adult community samples.";
      } else {
        cat = "High perceived stress";
        compare = "Above many community averages - worth reviewing stressors and professional support.";
      }
      const tips = [
        "Name one controllable step for your top stressor this week.",
        "Pair social support with problem-solving rather than rumination alone.",
        "Short movement breaks lower physiological arousal during heavy workloads.",
        "Reference: Cohen, S., Kamarck, T., & Mermelstein, R. (1983). Journal of Health and Social Behavior, 24(4), 385–396.",
      ];
      return {
        title: `PSS-style total: ${total.toLocaleString("en-US")} / 40`,
        value: cat,
        extra: [`Comparison (informal): ${compare}`, ...tips, "Educational tool - not a substitute for clinical assessment."],
      };
    }
    case "screen-time-health-calculator": {
      const pErr = requiredNumber(form.phoneHours, "Phone hours");
      const cErr = requiredNumber(form.computerHours, "Computer hours");
      if (pErr) return invalid(pErr);
      if (cErr) return invalid(cErr);
      const phone = n(form.phoneHours);
      const comp = n(form.computerHours);
      if (phone < 0 || comp < 0) return invalid("Hours cannot be negative.");
      if (phone > 24 || comp > 24) return invalid("Each device is capped at 24 h/day for this estimate.");
      const daily = phone + comp;
      const weekly = daily * 7;
      const yearlyH = weekly * 52;
      const yearlyD = yearlyH / 24;
      const age = (form.ageGroup || "adult").trim();
      const use = (form.primaryUse || "mixed").trim();
      const ageFactor = age === "child" ? 1.25 : age === "teen" ? 1.12 : age === "senior" ? 1.08 : 1;
      const sleepScore = Math.max(0, Math.min(100, 100 - daily * 8 * ageFactor - (use === "social" ? 8 : use === "entertainment" ? 5 : 0)));
      let prod: string;
      if (use === "work") prod = daily > 10 ? "Moderate  -  long work screen days need deliberate breaks." : "Lower  -  mostly structured work use.";
      else if (use === "social") prod = "Higher distraction risk  -  batch notifications and time limits help.";
      else if (use === "entertainment") prod = "Moderate  -  leisure screens can crowd deep work unless bounded.";
      else prod = "Mixed  -  clarity on work vs leisure blocks reduces switching cost.";
      let eye: string;
      const eyeRaw = daily * ageFactor;
      if (eyeRaw >= 12) eye = "High";
      else if (eyeRaw >= 8) eye = "Moderate–high";
      else if (eyeRaw >= 5) eye = "Moderate";
      else eye = "Lower (still use the 20-20-20 rule)";
      const reduce = [
        "Try app timers + grayscale evenings to lower pull-to-scroll.",
        "Replace 15 minutes of phone time with a walk or chores most days.",
        age === "child" || age === "teen" ? "Co-create screen-free meals and a charging zone outside the bedroom." : "Keep bedrooms device-light to protect melatonin timing.",
      ];
      return {
        title: `About ${weekly.toFixed(1)} h screen time / week`,
        value: `~${yearlyH.toLocaleString("en-US", { maximumFractionDigits: 0 })} h / year (~${yearlyD.toFixed(1)} full days)`,
        extra: [
          `Daily total: ${daily.toFixed(1)} h (phone ${phone.toFixed(1)} + computer ${comp.toFixed(1)})`,
          `Sleep impact score (0–100, higher = better sleep odds): ${sleepScore.toFixed(0)}`,
          `Productivity impact (qualitative): ${prod}`,
          `Eye strain risk (heuristic): ${eye}`,
          ...reduce,
          "Educational estimate only - not medical advice.",
        ],
      };
    }
    case "carbon-footprint-calculator": {
      const eErr = requiredNumber(form.elecKwhMonth, "Electricity kWh/month");
      const gErr = requiredNumber(form.gasThermsMonth, "Gas therms/month");
      const rErr = requiredNumber(form.renewablePct, "Renewable %");
      const mErr = requiredNumber(form.carMilesWeek, "Car miles/week");
      const fErr = requiredNumber(form.flightsYear, "Flights/year");
      const cErr = requiredNumber(form.clothesMonth, "Clothing items/month");
      const oErr = requiredNumber(form.onlineOrdersWeek, "Online orders/week");
      if (eErr || gErr || rErr || mErr || fErr || cErr || oErr) return invalid((eErr || gErr || rErr || mErr || fErr || cErr || oErr) as string);
      const elec = n(form.elecKwhMonth);
      const gas = n(form.gasThermsMonth);
      const ren = Math.min(100, Math.max(0, n(form.renewablePct)));
      const milesW = n(form.carMilesWeek);
      const flights = Math.max(0, Math.floor(n(form.flightsYear)));
      const clothes = n(form.clothesMonth);
      const orders = n(form.onlineOrdersWeek);
      if (elec < 0 || gas < 0 || milesW < 0 || clothes < 0 || orders < 0) return invalid("Inputs cannot be negative.");
      const gridKgPerKwh = 0.41;
      const homeElecT = ((elec * 12 * gridKgPerKwh) / 1000) * (1 - ren / 100);
      const homeGasT = (gas * 12 * 5.3) / 1000;
      const homeT = homeElecT + homeGasT;
      const carFactor: Record<string, number> = {
        economy: 0.28,
        family: 0.35,
        luxury: 0.45,
        sports: 0.42,
        suv: 0.55,
        electric: 0.12,
      };
      const ct = (form.carType || "family").trim();
      const kgPerMi = carFactor[ct] ?? 0.35;
      const carMiY = milesW * 52;
      const transportCarT = (carMiY * kgPerMi) / 1000;
      const transportFlightT = flights * 0.35;
      const transportT = transportCarT + transportFlightT;
      const dietKey = (form.diet || "meat").trim();
      const dietT = dietKey === "vegan" ? 1.8 : dietKey === "vegetarian" ? 2.4 : 3.8;
      const shopT = clothes * 12 * 0.012 + orders * 52 * 0.003;
      const total = homeT + transportT + dietT + shopT;
      const pct = (x: number) => (total > 0 ? (x / total) * 100 : 0);
      const trees = total > 0 ? Math.ceil(total / 0.022) : 0;
      return {
        title: "Estimated annual footprint",
        value: `${total.toLocaleString("en-US", { maximumFractionDigits: 2 })} tonnes CO₂e / year`,
        extra: [
          `Home energy: ${homeT.toFixed(2)} t (${pct(homeT).toFixed(0)}%)  -  elec ${homeElecT.toFixed(2)} t, gas ${homeGasT.toFixed(2)} t`,
          `Travel: ${transportT.toFixed(2)} t (${pct(transportT).toFixed(0)}%)  -  car ${transportCarT.toFixed(2)} t, flights ${transportFlightT.toFixed(2)} t`,
          `Diet (rough): ${dietT.toFixed(2)} t (${pct(dietT).toFixed(0)}%)`,
          `Shopping (rough): ${shopT.toFixed(2)} t (${pct(shopT).toFixed(0)}%)`,
          "Text breakdown (not a chart): compare shares above to see your largest buckets.",
          `Rough offset: ~${trees.toLocaleString("en-US")} young trees absorbing ~22 kg CO₂/yr each (order-of-magnitude only).`,
          "UK personal totals often ~8–12 t; US often higher - local grid and travel dominate differences.",
        ],
      };
    }
    case "solar-panel-savings-calculator": {
      const bErr = requiredNumber(form.monthlyBillUsd, "Monthly bill");
      const aErr = requiredNumber(form.roofArea, "Roof area");
      const rErr = requiredNumber(form.rateCentsKwh, "Rate ¢/kWh");
      if (bErr || aErr || rErr) return invalid((bErr || aErr || rErr) as string);
      const bill = n(form.monthlyBillUsd);
      let roof = n(form.roofArea);
      const rateC = n(form.rateCentsKwh);
      if (bill < 0 || roof < 0 || rateC <= 0) return invalid("Bill, roof area, and rate must be valid (rate > 0).");
      if ((form.roofUnit || "m2") === "ft2") roof *= 0.092903;
      const sunH: Record<string, number> = { high: 5.5, mid: 4.5, moderate: 3.5, low: 3.0 };
      const band = (form.sunBand || "mid").trim();
      const sun = sunH[band] ?? 4.5;
      const monthlyKwh = bill / (rateC / 100);
      if (!Number.isFinite(monthlyKwh) || monthlyKwh <= 0) return invalid("Could not derive kWh from bill and rate - check inputs.");
      const annualKwhNeed = monthlyKwh * 12;
      const maxPanels = Math.max(0, Math.floor((roof * 0.85) / 2));
      const kwhPerPanelYear = 0.4 * sun * 365 * 0.75;
      if (kwhPerPanelYear <= 0) return invalid("Invalid yield model.");
      let panels = Math.min(maxPanels, Math.ceil((annualKwhNeed * 0.8) / kwhPerPanelYear));
      if (maxPanels === 0) panels = 0;
      const annualGen = panels * kwhPerPanelYear;
      const annualSave = annualGen * (rateC / 100);
      const installCost = panels * 380 + 2500;
      const payback = annualSave > 0 ? installCost / annualSave : Infinity;
      const save25 = annualSave * 25 - installCost;
      const co2T = (annualGen * 0.4) / 1000;
      return {
        title: `~${panels.toLocaleString("en-US")} panels (usable roof cap)`,
        value: `~${annualGen.toLocaleString("en-US", { maximumFractionDigits: 0 })} kWh/year generation`,
        extra: [
          `Estimated annual savings: $${annualSave.toLocaleString("en-US", { maximumFractionDigits: 0 })} at ${rateC.toFixed(1)}¢/kWh`,
          `Rule-of-thumb install: ~$${installCost.toLocaleString("en-US", { maximumFractionDigits: 0 })} (before incentives)`,
          `Simple payback: ${payback === Infinity ? "n/a" : `${payback.toFixed(1)} years`}`,
          `25-year net savings (crude): $${save25.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
          `Grid CO₂ avoided (rough @ 0.4 kg/kWh): ~${co2T.toFixed(2)} tonnes/year`,
          "Shading, tariffs, and rebates change everything - get multiple quotes.",
        ],
      };
    }
    case "ev-vs-petrol-cost-calculator": {
      const keys = ["annualDistance", "fuelEffValue", "fuelPrice", "elecPerKwh", "evKwhPer100", "evPremium"] as const;
      for (const k of keys) {
        const er = requiredNumber(form[k], k);
        if (er) return invalid(er);
      }
      const dist = n(form.annualDistance);
      const isMiles = (form.distanceUnit || "miles") === "miles";
      const distMi = isMiles ? dist : dist * 0.621371;
      const distKm = isMiles ? dist * 1.60934 : dist;
      if (dist < 0) return invalid("Distance cannot be negative.");
      const effType = (form.fuelEffType || "us-mpg").trim();
      const eff = n(form.fuelEffValue);
      if (eff <= 0) return invalid("Efficiency must be greater than zero.");
      let litersPetrol = 0;
      if (effType === "l100km") litersPetrol = distKm * (eff / 100);
      else if (effType === "us-mpg") litersPetrol = (distMi / eff) * 3.78541;
      else if (effType === "uk-mpg") litersPetrol = (distMi / eff) * 4.54609;
      else return invalid("Select a fuel efficiency type.");
      const priceUnit = (form.fuelPriceUnit || "gal").trim();
      const fp = n(form.fuelPrice);
      if (fp < 0) return invalid("Fuel price cannot be negative.");
      const pricePerLiter = priceUnit === "gal" ? fp / 3.78541 : fp;
      const petrolYear = litersPetrol * pricePerLiter;
      const elec = n(form.elecPerKwh);
      const evK = n(form.evKwhPer100);
      const prem = n(form.evPremium);
      if (elec < 0 || evK < 0 || prem < 0) return invalid("Electricity rate, EV kWh/100mi, and premium must be non-negative.");
      const evKwhYear = distMi * (evK / 100);
      const evYear = evKwhYear * elec;
      const saveY = petrolYear - evYear;
      const petrol5 = petrolYear * 5;
      const ev5 = evYear * 5 + prem;
      const petrol10 = petrolYear * 10;
      const ev10 = evYear * 10 + prem;
      let breakEven = "Never (EV energy costs more per year than petrol in this model)";
      if (saveY > 0) {
        const yrs = prem / saveY;
        breakEven = yrs <= 50 ? `~${yrs.toFixed(1)} years to recover $${prem.toLocaleString("en-US", { maximumFractionDigits: 0 })} premium` : "Beyond 50 years in this scenario";
      }
      const co2PetrolT = (litersPetrol * 2.31) / 1000;
      const co2EvT = (evKwhYear * 0.4) / 1000;
      const co2Save = co2PetrolT - co2EvT;
      return {
        title: "5-year total (fuel + EV premium once)",
        value: `Petrol ~$${petrol5.toLocaleString("en-US", { maximumFractionDigits: 0 })} vs EV ~$${ev5.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
        extra: [
          `10-year: petrol ~$${petrol10.toLocaleString("en-US", { maximumFractionDigits: 0 })} vs EV ~$${ev10.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
          `Annual fuel/power: petrol ~$${petrolYear.toLocaleString("en-US", { maximumFractionDigits: 0 })}, EV ~$${evYear.toLocaleString("en-US", { maximumFractionDigits: 0 })} (${saveY >= 0 ? "save" : "extra"} ~$${Math.abs(saveY).toLocaleString("en-US", { maximumFractionDigits: 0 })}/yr)`,
          `Break-even on premium: ${breakEven}`,
          `Rough tailpipe vs grid CO₂ (litres×2.31 kg vs kWh×0.4 kg): petrol ~${co2PetrolT.toFixed(2)} t/yr, EV ~${co2EvT.toFixed(2)} t/yr (~${co2Save.toFixed(2)} t/yr difference)`,
          "Ignores maintenance, insurance, taxes, incentives, and real-world charging losses.",
        ],
      };
    }
    case "water-footprint-calculator": {
      const errs = [
        requiredNumber(form.showerMins, "Shower minutes"),
        requiredNumber(form.bathsWeek, "Baths/week"),
        requiredNumber(form.flushesDay, "Flushes/day"),
        requiredNumber(form.laundryWeek, "Laundry/week"),
        requiredNumber(form.carWashMonth, "Car washes/month"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const sh = n(form.showerMins);
      const ba = n(form.bathsWeek);
      const fl = n(form.flushesDay);
      const la = n(form.laundryWeek);
      const cw = n(form.carWashMonth);
      if (sh < 0 || ba < 0 || fl < 0 || la < 0 || cw < 0) return invalid("Inputs cannot be negative.");
      const direct = sh * 9 + (ba * 80) / 7 + fl * 6 + (la * 55) / 7 + (cw * 150) / 30;
      const diet = (form.diet || "meat").trim();
      const dietBand = diet === "vegan" ? 2200 : diet === "vegetarian" ? 3000 : 4200;
      const totalDaily = direct + dietBand;
      const annualL = totalDaily * 365;
      const bench: Record<string, number> = { UK: 140, US: 300, AU: 200 };
      const cty = (form.benchmarkCountry || "UK").trim();
      const b = bench[cty] ?? 140;
      const vs = totalDaily - b;
      const tips: string[] = [];
      if (sh * 9 > 40) tips.push("Biggest direct use looks like showers - try shorter or lower-flow heads.");
      else if (fl * 6 > 50) tips.push("Toilet use adds up - efficient fixtures or dual-flush cut flushes’ share.");
      if (diet === "meat") tips.push("Meat-heavy diets carry large virtual-water footprints - one meat-free day/week adds up.");
      if (tips.length === 0) tips.push("Laundry full loads and fixing drips are easy wins for most homes.");
      return {
        title: "Estimated total water footprint",
        value: `~${totalDaily.toLocaleString("en-US", { maximumFractionDigits: 0 })} L/day`,
        extra: [
          `Direct home uses (shower, bath, toilet, laundry, washes): ~${direct.toFixed(0)} L/day`,
          `Diet-related band (very rough): ~${dietBand.toLocaleString("en-US")} L/day`,
          `Yearly: ~${annualL.toLocaleString("en-US", { maximumFractionDigits: 0 })} L (~${(annualL / 1000).toFixed(1)} m³)`,
          `vs ~${b} L/day direct benchmark (${cty})  -  your model total is ${vs >= 0 ? "above" : "below"} that by ~${Math.abs(vs).toFixed(0)} L/day (methods differ)`,
          ...tips,
          "Figures are educational; metering and full LCAs give precise answers.",
        ],
      };
    }
    case "food-waste-cost-calculator": {
      const hErr = requiredNumber(form.householdSize, "Household size");
      const wErr = requiredNumber(form.weeklyGroceryUsd, "Weekly grocery spend");
      const pErr = requiredNumber(form.wastePct, "Waste %");
      if (hErr || wErr || pErr) return invalid((hErr || wErr || pErr) as string);
      const hh = Math.floor(n(form.householdSize));
      const weekly = n(form.weeklyGroceryUsd);
      const pct = n(form.wastePct);
      if (hh < 1) return invalid("Household size must be at least 1.");
      if (weekly < 0) return invalid("Grocery spend cannot be negative.");
      if (pct < 0 || pct > 50) return invalid("Waste % must be between 0 and 50.");
      const weeklyWaste = weekly * (pct / 100);
      const monthly = (weeklyWaste * 52) / 12;
      const annual = weeklyWaste * 52;
      const five = annual * 5;
      const pricePerKg = 5.5;
      const kgYear = annual / pricePerKg;
      const co2e = (kgYear * 2.5) / 1000;
      const country = (form.country || "US").trim();
      const note =
        country === "UK"
          ? "UK: check Love Food Hate Waste for local tips."
          : country === "CA"
            ? "Canada: many municipalities offer organic waste streams - use them if available."
            : country === "AU"
              ? "Australia: composting cuts landfill methane from food scraps."
              : "US: EPA-style estimates show food is a large landfill fraction - plan meals to cut waste.";
      return {
        title: "Estimated cost of wasted food",
        value: `~$${annual.toLocaleString("en-US", { maximumFractionDigits: 0 })} / year`,
        extra: [
          `~$${monthly.toLocaleString("en-US", { maximumFractionDigits: 0 })} / month from ~${pct.toFixed(1)}% of $${weekly.toLocaleString("en-US", { maximumFractionDigits: 0 })}/week spend`,
          `5-year: ~$${five.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
          `Rough food mass wasted: ~${kgYear.toLocaleString("en-US", { maximumFractionDigits: 0 })} kg/year (using ~$${pricePerKg}/kg placeholder)`,
          `Rough CO₂e from that waste: ~${co2e.toFixed(2)} tonnes/year (generic factor ~2.5 kg CO₂e/kg)`,
          `Household (${hh} people): per-person waste cost ~$${(annual / hh).toLocaleString("en-US", { maximumFractionDigits: 0 })}/yr`,
          note,
        ],
      };
    }
    case "paint-calculator": {
      const errs = [
        requiredNumber(form.roomLength, "Room length"),
        requiredNumber(form.roomWidth, "Room width"),
        requiredNumber(form.ceilingHeight, "Ceiling height"),
        requiredNumber(form.numDoors, "Doors"),
        requiredNumber(form.numWindows, "Windows"),
        requiredNumber(form.coats, "Coats"),
        requiredNumber(form.pricePerLitre, "Price per litre"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      let L = n(form.roomLength);
      let W = n(form.roomWidth);
      let H = n(form.ceilingHeight);
      if ((form.dimUnit || "m") === "ft") {
        L *= 0.3048;
        W *= 0.3048;
        H *= 0.3048;
      }
      const doors = n(form.numDoors);
      const wins = n(form.numWindows);
      const coats = n(form.coats);
      const ppl = n(form.pricePerLitre);
      if (L <= 0 || W <= 0 || H <= 0 || coats < 1 || ppl < 0 || doors < 0 || wins < 0) return invalid("Check dimensions, coats, and counts.");
      let wall = 2 * (L + W) * H - doors * 2 - wins * 1.5;
      wall = Math.max(0, wall);
      const litres = (wall * coats) / 10;
      const cost = litres * ppl;
      let rem = litres;
      const t10 = Math.floor(rem / 10);
      rem -= t10 * 10;
      const t5 = Math.floor(rem / 5);
      rem -= t5 * 5;
      const t25 = Math.ceil(rem / 2.5);
      return {
        title: "Paint estimate",
        value: `${litres.toLocaleString("en-US", { maximumFractionDigits: 2 })} L (≈10 m²/L rule)`,
        extra: [
          `Wall area (after openings): ${wall.toFixed(2)} m²`,
          `Estimated cost @ $${ppl.toFixed(2)}/L: $${cost.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
          `Tin mix (10L / 5L / 2.5L): ${t10} × 10L, ${t5} × 5L, ${t25} × 2.5L (rounded up on smallest)`,
        ],
      };
    }
    case "flooring-cost-calculator": {
      for (const k of ["len1", "wid1", "len2", "wid2"] as const) {
        const e = requiredNumber(form[k], k);
        if (e) return invalid(e);
      }
      let a1 = n(form.len1) * n(form.wid1);
      let a2 = n(form.len2) * n(form.wid2);
      if ((form.dimUnit || "m") === "ft") {
        a1 *= 0.092903;
        a2 *= 0.092903;
      }
      const area = a1 + a2;
      if (area <= 0) return invalid("Total area must be greater than zero.");
      const ft = (form.floorType || "laminate").trim();
      const tier = (form.tier || "mid").trim();
      const base: Record<string, Record<string, number>> = {
        hardwood: { budget: 45, mid: 75, premium: 120 },
        laminate: { budget: 15, mid: 28, premium: 45 },
        tile: { budget: 25, mid: 45, premium: 85 },
        carpet: { budget: 18, mid: 32, premium: 55 },
        vinyl: { budget: 20, mid: 35, premium: 60 },
      };
      const midM = base[ft]?.[tier] ?? 35;
      const materialMid = area * midM;
      const under = (form.underlay || "no") === "yes" ? area * 8 : 0;
      const fit = (form.fitting || "no") === "yes" ? area * 22 : 0;
      const low = materialMid * 0.85 + under + fit * 0.9;
      const high = materialMid * 1.15 + under * 1.1 + fit * 1.1;
      return {
        title: "Flooring budget (mid estimate)",
        value: moneyLocale(materialMid + under + fit),
        extra: [
          `Area: ${area.toFixed(2)} m²`,
          `Range (rough): ${moneyLocale(low)} – ${moneyLocale(high)}`,
          `Material mid: ${moneyLocale(materialMid)}, underlay: ${moneyLocale(under)}, fitting: ${moneyLocale(fit)}`,
        ],
      };
    }
    case "fence-cost-calculator": {
      const e = requiredNumber(form.fenceLength, "Fence length");
      if (e) return invalid(e);
      let lf = n(form.fenceLength);
      if ((form.lenUnit || "ft") === "m") lf /= 0.3048;
      if (lf <= 0) return invalid("Length must be positive.");
      const h = n(form.heightFt, 6);
      const mat = (form.material || "wood").trim();
      const baseLf: Record<string, number> = { wood: 22, vinyl: 28, chain: 12, metal: 35, composite: 40 };
      const mult = h >= 8 ? 1.25 : h <= 4 ? 0.85 : 1;
      const matCost = lf * (baseLf[mat] ?? 22) * mult;
      const gates = n(form.numGates) * 350;
      const rem = (form.removeOld || "no") === "yes" ? lf * 4 : 0;
      const labour = lf * 12;
      const low = matCost + gates + rem + labour * 0.85;
      const high = matCost * 1.15 + gates + rem + labour * 1.15;
      return {
        title: "Fence project estimate",
        value: moneyLocale(matCost + gates + rem + labour),
        extra: [
          `Length: ${lf.toFixed(1)} ft`,
          `Materials ~${moneyLocale(matCost)}, gates ~${moneyLocale(gates)}, removal ~${moneyLocale(rem)}, labour ~${moneyLocale(labour)}`,
          `Range ~${moneyLocale(low)} – ${moneyLocale(high)}`,
        ],
      };
    }
    case "roof-replacement-cost-estimator": {
      const e = requiredNumber(form.roofArea, "Roof area");
      if (e) return invalid(e);
      let m2 = n(form.roofArea);
      if ((form.areaUnit || "m2") === "ft2") m2 *= 0.092903;
      if (m2 <= 0) return invalid("Area must be positive.");
      const mat = (form.roofMaterial || "asphalt").trim();
      const perM2: Record<string, number> = { asphalt: 85, metal: 140, tile: 120, slate: 220 };
      const country = (form.country || "US").trim();
      const cMult = country === "UK" ? 1.08 : country === "AU" ? 1.05 : 1;
      const flat = (form.roofShape || "pitched") === "flat" ? 0.92 : 1;
      const storeys = Math.min(3, Math.max(1, Math.floor(n(form.storeys, 2))));
      const storyMult = 1 + (storeys - 1) * 0.06;
      const unit = (perM2[mat] ?? 85) * cMult * flat * storyMult;
      const tear = (form.tearOff || "no") === "yes" ? 18 * m2 : 0;
      const mid = m2 * unit + tear;
      return {
        title: "Roof replacement (mid)",
        value: moneyLocale(mid),
        extra: [
          `Low ≈ ${moneyLocale(mid * 0.82)}, mid ≈ ${moneyLocale(mid)}, high ≈ ${moneyLocale(mid * 1.18)}`,
          `~$${(mid / m2).toFixed(2)}/m² effective (incl. tear-off portion)`,
          `Typical ${mat} life note: asphalt ~20–25 yrs, metal 40–70, tile/slate 50+ (varies).`,
        ],
      };
    }
    case "deck-building-cost-calculator": {
      const e1 = requiredNumber(form.deckLength, "Length");
      const e2 = requiredNumber(form.deckWidth, "Width");
      if (e1 || e2) return invalid((e1 || e2) as string);
      let Lf = n(form.deckLength);
      let Wf = n(form.deckWidth);
      if ((form.deckUnit || "ft") === "m") {
        Lf /= 0.3048;
        Wf /= 0.3048;
      }
      const sqft = Lf * Wf;
      if (sqft <= 0) return invalid("Area must be positive.");
      const mat = (form.deckMaterial || "pt").trim();
      const psf: Record<string, number> = { pt: 18, cedar: 28, composite: 45, hardwood: 55 };
      const st = (form.usState || "US").trim();
      const lab = st === "high" ? 1.2 : st === "low" ? 0.9 : 1;
      let material = sqft * (psf[mat] ?? 18);
      let labour = sqft * 12 * lab;
      if ((form.heightType || "low") === "high") {
        material *= 1.12;
        labour *= 1.15;
      }
      if ((form.railing || "no") === "yes") material += sqft * 8;
      if ((form.stairs || "no") === "yes") labour += 650;
      const total = material + labour;
      const maint = mat === "composite" ? total * 0.01 : total * 0.025;
      return {
        title: "Deck estimate",
        value: moneyLocale(total),
        extra: [
          `~${sqft.toFixed(0)} sq ft @ ~$${(total / sqft).toFixed(2)}/sq ft all-in (rough)`,
          `Materials ~${moneyLocale(material)}, labour ~${moneyLocale(labour)}`,
          `Annual maintenance guess: ~${moneyLocale(maint)}`,
        ],
      };
    }
    case "habit-cost-calculator": {
      const name = (form.habitName || "Habit").trim() || "Habit";
      const ce = requiredNumber(form.costEach, "Cost each");
      const me = requiredNumber(form.monthsTracked, "Months");
      if (ce || me) return invalid((ce || me) as string);
      const c = n(form.costEach);
      if (c < 0) return invalid("Cost cannot be negative.");
      const freq = (form.frequency || "daily").trim();
      const perYear = freq === "daily" ? c * 365 : freq === "weekly" ? c * 52 : c * 12;
      const weekly = perYear / 52;
      const monthly = perYear / 12;
      const yearly = perYear;
      const y5 = yearly * 5;
      const y10 = yearly * 10;
      const netflixMo = 15;
      const equiv = yearly / netflixMo;
      return {
        title: `${name}  -  yearly run-rate`,
        value: moneyLocale(yearly),
        extra: [
          `Weekly ≈ ${moneyLocale(weekly)}, monthly ≈ ${moneyLocale(monthly)}`,
          `5-yr run-rate ≈ ${moneyLocale(y5)}, 10-yr ≈ ${moneyLocale(y10)} (if habit stays constant)`,
          `Fun compare: ≈ ${equiv.toFixed(1)} months of a $${netflixMo}/mo subscription per year at this habit’s run-rate`,
        ],
      };
    }
    case "pomodoro-focus-planner": {
      const we = requiredNumber(form.workMinutes, "Work minutes");
      const se = requiredNumber(form.shortBreak, "Short break");
      const le = requiredNumber(form.longBreak, "Long break");
      const ce = requiredNumber(form.cyclesBeforeLong, "Cycles before long");
      const te = requiredNumber(form.totalFocusBlocks, "Focus blocks");
      if (we || se || le || ce || te) return invalid((we || se || le || ce || te) as string);
      const w = n(form.workMinutes);
      const s = n(form.shortBreak);
      const l = n(form.longBreak);
      const cbl = Math.max(1, Math.floor(n(form.cyclesBeforeLong)));
      const nblk = Math.min(48, Math.max(1, Math.floor(n(form.totalFocusBlocks))));
      if (w < 1 || s < 1 || l < 1) return invalid("Durations must be at least 1 minute.");
      const seq: string[] = [];
      let cycleInBlock = 0;
      for (let i = 1; i <= nblk; i++) {
        seq.push(`Block ${i}: focus ${w} min`);
        cycleInBlock++;
        if (i < nblk) {
          if (cycleInBlock >= cbl) {
            seq.push(`Long break ${l} min`);
            cycleInBlock = 0;
          } else seq.push(`Short break ${s} min`);
        }
      }
      const totalFocus = nblk * w;
      return {
        title: "Pomodoro-style plan",
        value: `${nblk} focus blocks × ${w} min = ${totalFocus} min deep work`,
        extra: [...seq.slice(0, 12), seq.length > 12 ? `…+${seq.length - 12} more lines` : "", "Use any timer app alongside this sequence."].filter(Boolean),
      };
    }
    case "hourly-rate-to-annual-salary-calculator": {
      const ae = requiredNumber(form.amount, "Amount");
      if (ae) return invalid(ae);
      const amt = n(form.amount);
      const rt = (form.rateType || "hourly").trim();
      const hw = n(form.hoursPerWeek, 40);
      const wy = n(form.weeksPerYear, 52);
      const hol = n(form.paidHolidayDays, 0);
      if (amt < 0 || hw < 0 || wy <= 0 || hol < 0) return invalid("Check hours, weeks, and holidays.");
      const effWeeks = Math.max(0, wy - hol / 5);
      const annualHours = hw * effWeeks;
      let annual = 0;
      if (rt === "hourly") annual = amt * annualHours;
      else if (rt === "daily") annual = amt * 5 * effWeeks;
      else if (rt === "weekly") annual = amt * effWeeks;
      else if (rt === "monthly") annual = amt * 12;
      else if (rt === "annual") annual = amt;
      else return invalid("Select rate type.");
      const hourly = annual / Math.max(1, annualHours);
      const daily = annual / Math.max(1, 5 * effWeeks);
      const weekly = annual / Math.max(1, effWeeks);
      const monthly = annual / 12;
      const tc = (form.taxCountry || "none").trim();
      const tr = tc === "US" ? 0.22 : tc === "UK" ? 0.25 : tc === "CA" || tc === "AU" ? 0.24 : 0;
      const after = annual * (1 - tr);
      return {
        title: "Equivalent rates",
        value: `Annual ≈ ${moneyLocale(annual)}`,
        extra: [
          `Hourly ≈ ${moneyLocale(hourly)}, daily (per workday) ≈ ${moneyLocale(daily)}`,
          `Weekly ≈ ${moneyLocale(weekly)}, monthly ≈ ${moneyLocale(monthly)}`,
          tr > 0 ? `Illustrative after-tax (~${(tr * 100).toFixed(0)}% eff.): ${moneyLocale(after)}` : "After-tax skipped.",
        ],
      };
    }
    case "meeting-cost-calculator": {
      const errs = [requiredNumber(form.attendees, "Attendees"), requiredNumber(form.avgSalary, "Salary"), requiredNumber(form.durationMin, "Duration")].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const att = Math.floor(n(form.attendees));
      const sal = n(form.avgSalary);
      const dm = n(form.durationMin);
      if (att < 1 || sal < 0 || dm < 1) return invalid("Check attendees, salary, and duration.");
      const hrly = sal / 2080;
      const perMin = att * hrly * (1 / 60);
      const once = perMin * dm;
      const rec = (form.recurring || "once").trim();
      const mult = rec === "daily" ? 252 : rec === "weekly" ? 50 : rec === "monthly" ? 12 : 1;
      return {
        title: "Meeting cost",
        value: moneyLocale(once),
        extra: [
          `~${moneyLocale(perMin)}/minute (loaded salary estimate)`,
          rec !== "once" ? `If ${rec}: ~${moneyLocale(once * mult)}/year` : "One-off meeting.",
        ],
      };
    }
    case "life-expectancy-calculator": {
      const ag = requiredNumber(form.currentAge, "Age");
      if (ag) return invalid(ag);
      const age = n(form.currentAge);
      if (age < 0 || age > 110) return invalid("Enter a realistic age.");
      const sex = (form.sex || "M").trim();
      const c = (form.country || "US").trim();
      const baseTable: Record<string, { M: number; F: number }> = {
        US: { M: 76, F: 81 },
        UK: { M: 79, F: 83 },
        CA: { M: 80, F: 84 },
        AU: { M: 81, F: 85 },
        DE: { M: 79, F: 83 },
        FR: { M: 80, F: 86 },
        JP: { M: 81, F: 87 },
        IN: { M: 71, F: 74 },
        BR: { M: 73, F: 79 },
        XX: { M: 74, F: 78 },
      };
      let exp = sex === "F" ? baseTable[c]?.F ?? 78 : baseTable[c]?.M ?? 74;
      const sm = (form.smoker || "no").trim();
      if (sm === "yes") exp -= 10;
      else if (sm === "ex") exp -= 3;
      const ex = (form.exercise || "never").trim();
      exp += ex === "daily" ? 4 : ex === "regular" ? 3 : ex === "sometimes" ? 1 : 0;
      const di = (form.diet || "average").trim();
      exp += di === "excellent" ? 3 : di === "good" ? 2 : di === "poor" ? -2 : 0;
      const h = n(form.heightCm, 170);
      const w = n(form.weightKg, 70);
      const bmi = w / (h / 100) ** 2;
      if (bmi >= 30) exp -= 3;
      else if (bmi >= 25) exp -= 1;
      else if (bmi < 18.5) exp -= 2;
      const alc = n(form.alcoholUnitsWeek);
      if (alc > 14) exp -= 2;
      else if (alc > 21) exp -= 4;
      exp = Math.max(age + 1, Math.min(105, exp));
      const remain = exp - age;
      const healthy = remain * 0.85;
      return {
        title: "Heuristic life expectancy",
        value: `${exp.toFixed(1)} years (population-style baseline + adjustments)`,
        extra: [
          `Years remaining ≈ ${remain.toFixed(1)}; “healthy” years guess ≈ ${healthy.toFixed(1)}`,
          "Top factors in this model: smoking, exercise, diet, BMI band, alcohol.",
          "Not a medical forecast - consult healthcare providers about risk reduction.",
        ],
      };
    }
    case "car-depreciation-calculator": {
      const pe = requiredNumber(form.purchasePrice, "Purchase price");
      const ae = requiredNumber(form.carAgeYears, "Age");
      const me = requiredNumber(form.mileage, "Mileage");
      if (pe || ae || me) return invalid((pe || ae || me) as string);
      const price = n(form.purchasePrice);
      const yrs = n(form.carAgeYears);
      let mi = n(form.mileage);
      if ((form.odoUnit || "mi") === "km") mi *= 0.621371;
      if (price <= 0 || yrs < 0 || mi < 0) return invalid("Check inputs.");
      const seg = (form.segment || "family").trim();
      const depRate: Record<string, number> = { economy: 0.12, family: 0.14, luxury: 0.18, sports: 0.16, suv: 0.15, electric: 0.2 };
      const r = depRate[seg] ?? 0.14;
      let value = price;
      for (let y = 1; y <= Math.min(10, Math.floor(yrs)); y++) value *= 1 - r * (y === 1 ? 1 : 0.85);
      value *= Math.max(0.5, 1 - (mi / 100000) * 0.08);
      const dep = price - value;
      const annPct = yrs > 0 ? (dep / price / yrs) * 100 : 0;
      const curve: string[] = [];
      let v = price;
      for (let y = 0; y <= Math.min(10, Math.ceil(yrs)); y++) {
        if (y > 0) v *= 1 - r * 0.9;
        curve.push(`Year ${y}: ~$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`);
      }
      return {
        title: "Estimated current value",
        value: moneyLocale(value),
        extra: [
          `Total depreciation to date ≈ ${moneyLocale(dep)} (~${annPct.toFixed(1)}%/yr avg)`,
          ...curve.slice(0, 6),
          curve.length > 6 ? "…" : "",
          "Sell/replace timing is personal - steep loss often slows after year 3–5 in this model.",
        ].filter(Boolean),
      };
    }
    case "car-running-cost-calculator": {
      const keys = ["annualDistance", "efficiency", "energyPrice", "insuranceYear", "serviceYear", "roadTaxYear"] as const;
      for (const k of keys) {
        const er = requiredNumber(form[k], k);
        if (er) return invalid(er);
      }
      const dist = n(form.annualDistance);
      const isMi = (form.distUnit || "mi") === "mi";
      const distMi = isMi ? dist : dist * 0.621371;
      const distKm = isMi ? dist * 1.60934 : dist;
      const ft = (form.fuelType || "petrol").trim();
      const eu = (form.effUnit || "mpg").trim();
      const eff = n(form.efficiency);
      const ep = n(form.energyPrice);
      const epu = (form.energyPriceUnit || "gal").trim();
      if (eff <= 0 || dist < 0 || ep < 0) return invalid("Check distance, efficiency, and price.");
      let energyCost = 0;
      if (ft === "electric" || eu === "kwh100km") {
        if (epu !== "kwh") return invalid("For EV / kWh/100km select $/kWh as energy price unit.");
        const kwh = distKm * (eff / 100);
        energyCost = kwh * ep;
      } else if (eu === "l100") {
        const L = distKm * (eff / 100);
        const pricePerL = epu === "liter" ? ep : ep / 3.78541;
        energyCost = L * pricePerL;
      } else {
        const gal = distMi / eff;
        const pricePerGal = epu === "gal" ? ep : ep * 3.78541;
        energyCost = gal * pricePerGal;
      }
      const ins = n(form.insuranceYear);
      const svc = n(form.serviceYear);
      const tax = n(form.roadTaxYear);
      const annual = energyCost + ins + svc + tax;
      const perMi = distMi > 0 ? annual / distMi : 0;
      return {
        title: "Annual running cost (excl. depreciation)",
        value: moneyLocale(annual),
        extra: [
          `Energy/fuel ≈ ${moneyLocale(energyCost)}, insurance ${moneyLocale(ins)}, service ${moneyLocale(svc)}, tax ${moneyLocale(tax)}`,
          `~${moneyLocale(perMi)}/mile (~${moneyLocale(perMi / 1.60934)}/km)`,
          `Monthly ≈ ${moneyLocale(annual / 12)}`,
        ],
      };
    }
    case "mpg-l100km-converter": {
      const ve = requiredNumber(form.value, "Value");
      if (ve) return invalid(ve);
      const v = n(form.value);
      if (v <= 0) return invalid("Value must be positive.");
      const fu = (form.fromUnit || "us-mpg").trim();
      let usMpg = 0;
      let ukMpg = 0;
      let l100 = 0;
      let kml = 0;
      if (fu === "us-mpg") {
        usMpg = v;
        ukMpg = v * 1.20095;
        l100 = 235.214583 / v;
        kml = v * 0.425144;
      } else if (fu === "uk-mpg") {
        ukMpg = v;
        usMpg = v / 1.20095;
        l100 = 282.481 / v;
        kml = v * 0.354006;
      } else if (fu === "l100") {
        l100 = v;
        usMpg = 235.214583 / v;
        ukMpg = 282.481 / v;
        kml = 100 / v;
      } else {
        kml = v;
        l100 = 100 / v;
        usMpg = v * 2.35215;
        ukMpg = v * 2.82481;
      }
      const tank = n(form.tankSize);
      const tu = (form.tankUnit || "L").trim();
      let L = tank;
      if (tu === "gal") L = tank * 3.78541;
      const fp = n(form.fuelPrice);
      const fpu = (form.fuelPriceUnit || "gal").trim();
      const extra: string[] = [];
      if (tank > 0 && fp > 0) {
        const rangeMi = usMpg * (tu === "gal" ? tank : L / 3.78541);
        const rangeKm = rangeMi * 1.60934;
        const cost100mi = (fp / (fpu === "gal" ? usMpg : usMpg / 2.35215)) * 100;
        extra.push(`Tank range ≈ ${rangeMi.toFixed(0)} mi (~${rangeKm.toFixed(0)} km)`);
        extra.push(`Rough cost/100 mi ≈ $${cost100mi.toFixed(2)} (using US MPG + price)`);
      }
      return {
        title: "Fuel economy equivalents",
        value: `${usMpg.toFixed(2)} US MPG`,
        extra: [
          `${ukMpg.toFixed(2)} UK MPG (imperial)`,
          `${l100.toFixed(2)} L/100km`,
          `${kml.toFixed(2)} km/L`,
          ...extra,
        ],
      };
    }
    case "uk-road-tax-calculator": {
      const ye = requiredNumber(form.regYear, "Registration year");
      const ce = requiredNumber(form.co2, "CO2");
      if (ye || ce) return invalid((ye || ce) as string);
      const year = Math.floor(n(form.regYear));
      const co2 = n(form.co2);
      const fuel = (form.fuelType || "petrol").trim();
      if (year < 1980 || year > 2030) return invalid("Enter a plausible registration year.");
      if (fuel === "electric") {
        return {
          title: "VED-style estimate (EV)",
          value: "£0 standard (exempt in this model - verify GOV.UK)",
          extra: ["First year often £0 for zero tailpipe CO₂; luxury car supplement may still apply.", "Check official VED for list price rules."],
        };
      }
      let first = 200;
      let std = 190;
      if (year >= 2017 && co2 > 0) {
        if (co2 <= 50) {
          first = 10;
          std = 180;
        } else if (co2 <= 100) {
          first = 160;
          std = 190;
        } else if (co2 <= 110) {
          first = 210;
          std = 190;
        } else if (co2 <= 130) {
          first = 270;
          std = 190;
        } else if (co2 <= 150) {
          first = 680;
          std = 190;
        } else {
          first = Math.min(2500, 1000 + (co2 - 150) * 5);
          std = 190;
        }
        if (fuel === "diesel" && co2 > 1) std += 20;
      } else {
        std = 180 + Math.min(300, co2 * 2);
        first = std;
      }
      const six = std * 0.55;
      const five = first + std * 4;
      return {
        title: "Illustrative UK VED",
        value: `Standard year ≈ £${std.toLocaleString("en-US")}`,
        extra: [
          `First year (if new regs) ≈ £${first.toLocaleString("en-US")}`,
          `6-month (≈55% of annual) ≈ £${six.toFixed(0)}`,
          `5-year total (1× first + 4× standard, rough) ≈ £${five.toLocaleString("en-US")}`,
          "Simplified - always use GOV.UK for the exact vehicle.",
        ],
      };
    }
    case "tyre-size-calculator": {
      const parseTyre = (s: string): { w: number; a: number; r: number } | null => {
        const m = s.trim().replace(/\s/g, "").match(/^(\d+)\/(\d+)r?(\d+(\.\d+)?)$/i);
        if (!m) return null;
        return { w: Number(m[1]), a: Number(m[2]), r: Number(m[3]) };
      };
      const a = parseTyre(form.currentTyre || "");
      const b = parseTyre(form.newTyre || "");
      if (!a || !b) return invalid('Use format like 205/55R16 (width/aspect/Rim").');
      const dia = (t: { w: number; a: number; r: number }) => 2 * t.w * (t.a / 100) + t.r * 25.4;
      const da = dia(a);
      const db = dia(b);
      const errPct = da > 0 ? ((db - da) / da) * 100 : 0;
      const circ = (d: number) => Math.PI * d;
      return {
        title: "Tyre overall diameter",
        value: `Old ≈ ${da.toFixed(1)} mm, new ≈ ${db.toFixed(1)} mm`,
        extra: [
          `Speedometer error ≈ ${errPct.toFixed(2)}% (if speedo calibrated to old rolling radius)`,
          `Circumference old ≈ ${circ(da).toFixed(0)} mm, new ≈ ${circ(db).toFixed(0)} mm`,
          Math.abs(errPct) > 3 ? "Change >3% diameter - check clearance, gearing, and legality." : "Diameter change modest - still verify rubbing and load index.",
        ],
      };
    }
    case "vo2-max-calculator": {
      const method = (form.method || "cooper").trim();
      const age = n(form.age, 30);
      let vo2 = 0;
      if (method === "cooper") {
        const d = n(form.cooperMeters);
        if (d <= 0) return invalid("Enter Cooper test distance in metres.");
        vo2 = (d - 504.9) / 44.73;
      } else if (method === "mile") {
        const sec = n(form.mileSeconds);
        if (sec <= 0) return invalid("Enter 1.5-mile time in seconds.");
        vo2 = 88.02 + 3.716 * (1345 / sec);
      } else {
        const r = n(form.restHr);
        const x = n(form.maxHr);
        if (r <= 0 || x <= r) return invalid("Enter valid resting and max HR.");
        vo2 = 15.3 * (x / r);
      }
      vo2 = Math.max(15, Math.min(85, vo2));
      const cat = vo2 < 35 ? "Beginner/low" : vo2 < 45 ? "Fair" : vo2 < 55 ? "Good" : vo2 < 65 ? "Very good" : "Excellent";
      const maxHR = 220 - age;
      const z = (lo: number, hi: number) => `${Math.round(maxHR * lo)}–${Math.round(maxHR * hi)} bpm`;
      return {
        title: "Estimated VO₂ max",
        value: `${vo2.toFixed(1)} ml/kg/min (${cat})`,
        extra: [
          `HR zones (rough % of maxHR ${maxHR}): Z1 ${z(0.5, 0.6)}, Z2 ${z(0.6, 0.7)}, Z3 ${z(0.7, 0.8)}, Z4 ${z(0.8, 0.9)}, Z5 ${z(0.9, 1)}`,
          "Lab/field testing beats any single formula.",
        ],
      };
    }
    case "one-rep-max-calculator": {
      const we = requiredNumber(form.weight, "Weight");
      const re = requiredNumber(form.reps, "Reps");
      if (we || re) return invalid((we || re) as string);
      const w = n(form.weight);
      const r = Math.floor(n(form.reps));
      if (w <= 0 || r < 1 || r > 10) return invalid("Weight > 0 and reps 1–10.");
      if (r >= 37) return invalid("Brzycki formula needs reps < 37.");
      const epley = w * (1 + r / 30);
      const brzycki = w * (36 / (37 - r));
      const lombardi = w * 4 ** (1 / r);
      const avg = (epley + brzycki + lombardi) / 3;
      const pct = [0.6, 0.7, 0.8, 0.85, 0.9, 0.95];
      const rows = pct.map((p) => `${(p * 100).toFixed(0)}% ≈ ${(avg * p).toFixed(1)}`);
      return {
        title: "Estimated 1RM (average of formulas)",
        value: `${avg.toFixed(1)} (Epley ${epley.toFixed(1)}, Brzycki ${brzycki.toFixed(1)}, Lombardi ${lombardi.toFixed(1)})`,
        extra: [...rows, "Warm up well; avoid true maxes without a spotter."],
      };
    }
    case "race-pace-calculator": {
      const mode = (form.mode || "pace-time").trim();
      const preset = form.presetDist || "5";
      const distKm = preset === "custom" ? n(form.customKm) : Number(preset);
      if (!Number.isFinite(distKm) || distKm <= 0) return invalid("Set a positive distance in km.");
      const fmtPace = (secPerKm: number) => {
        const m = Math.floor(secPerKm / 60);
        const s = Math.round(secPerKm % 60);
        return `${m}:${String(s).padStart(2, "0")}/km`;
      };
      let secPerKm = 0;
      let finishSec = 0;
      if (mode === "pace-time") {
        const pm = requiredNumber(form.paceMinPerKm, "Pace min/km");
        if (pm) return invalid(pm);
        secPerKm = n(form.paceMinPerKm) * 60;
        finishSec = secPerKm * distKm;
      } else if (mode === "time-pace") {
        const te = requiredNumber(form.finishSeconds, "Finish time");
        if (te) return invalid(te);
        finishSec = n(form.finishSeconds);
        secPerKm = finishSec / distKm;
      } else {
        const te = requiredNumber(form.finishSeconds, "Target time");
        if (te) return invalid(te);
        finishSec = n(form.finishSeconds);
        secPerKm = finishSec / distKm;
      }
      const secPerMi = secPerKm * 1.60934;
      const splits: string[] = [];
      for (let d = 5; d < distKm; d += 5) splits.push(`${d} km @ ${fmtPace(secPerKm)} → ${(secPerKm * d).toFixed(0)}s elapsed`);
      const fm = Math.floor(finishSec / 60);
      const fs = Math.round(finishSec % 60);
      return {
        title: "Pace & time",
        value: `${fmtPace(secPerKm)} (${Math.floor(secPerMi / 60)}:${String(Math.round(secPerMi % 60)).padStart(2, "0")}/mi)`,
        extra: [
          `Finish time ≈ ${fm}:${String(fs).padStart(2, "0")} for ${distKm} km`,
          ...splits.slice(0, 6),
          "Even split is simplest; negative splits can help late-race fatigue on hot days.",
        ],
      };
    }
    case "swimming-pace-calculator": {
      const pe = requiredNumber(form.pace100Sec, "Pace per 100m");
      if (pe) return invalid(pe);
      const p100 = n(form.pace100Sec);
      const pool = Number(form.poolLen || 25);
      const race = Number(form.raceDist || 100);
      if (p100 <= 0 || race <= 0) return invalid("Check pace and race distance.");
      const totalSec = (race / 100) * p100;
      const perLen = (pool / 100) * p100;
      const m = Math.floor(totalSec / 60);
      const s = Math.round(totalSec % 60);
      return {
        title: "Race time estimate",
        value: `${m}:${String(s).padStart(2, "0")} for ${race} m`,
        extra: [
          `Time per ${pool} m length ≈ ${perLen.toFixed(1)} s`,
          "Stroke rate: try ~60–80 rpm freestyle sprint, lower for distance - coach video helps more than averages.",
          "Age-group standards vary by federation; this is pacing math only.",
        ],
      };
    }
    case "cycling-power-to-weight-calculator": {
      const fe = requiredNumber(form.ftp, "FTP");
      const we = requiredNumber(form.weight, "Weight");
      if (fe || we) return invalid((fe || we) as string);
      let kg = n(form.weight);
      if ((form.wUnit || "kg") === "lb") kg *= 0.453592;
      const ftp = n(form.ftp);
      if (kg <= 0 || ftp < 0) return invalid("Positive weight and non-negative FTP.");
      const wr = ftp / kg;
      const cat = wr < 2 ? "Untrained/low" : wr < 2.5 ? "Fair" : wr < 3.2 ? "Moderate" : wr < 4 ? "Good" : wr < 5 ? "Very good" : wr < 6.5 ? "Excellent" : wr < 7.5 ? "Exceptional" : "World-class band";
      const p20 = ftp * 1.05;
      const zones = [0.55, 0.75, 0.9, 1.05, 1.2, 1.5].map((m, i) => `Z${i + 1}: ~${Math.round(ftp * m)} W`);
      return {
        title: "Power-to-weight",
        value: `${wr.toFixed(2)} W/kg (${cat})`,
        extra: [`20-min power (≈105% FTP): ~${p20.toFixed(0)} W`, ...zones],
      };
    }
    case "baby-sleep-schedule-calculator": {
      const ae = requiredNumber(form.ageWeeks, "Age weeks");
      if (ae) return invalid(ae);
      const w = Math.min(52, Math.max(0, Math.floor(n(form.ageWeeks))));
      let totalH = 15;
      let naps = 4;
      let wake = "45–60 min";
      if (w >= 12) {
        totalH = 14;
        naps = 3;
        wake = "75–90 min";
      }
      if (w >= 24) {
        totalH = 13;
        naps = 2;
        wake = "2.5–3.5 h";
      }
      if (w >= 40) {
        totalH = 12.5;
        naps = 1;
        wake = "3.5–4 h";
      }
      return {
        title: "Sleep planning bands",
        value: `~${totalH} h total sleep / 24 h`,
        extra: [
          `Naps: ~${naps} (ranges vary)`,
          `Wake windows (rough): ${wake}`,
          "Sample: Wake 7:00 → nap 9:00–10:00 → nap 13:00–15:00 → bed 19:00 (adjust to baby).",
          "Pediatrician should guide feeding and any concerns.",
        ],
      };
    }
    case "child-height-predictor": {
      const fe = requiredNumber(form.fatherCm, "Father cm");
      const me = requiredNumber(form.motherCm, "Mother cm");
      if (fe || me) return invalid((fe || me) as string);
      const f = n(form.fatherCm);
      const m = n(form.motherCm);
      const sx = (form.childSex || "M").trim();
      const mid = (f + m + (sx === "M" ? 13 : -13)) / 2;
      const low = mid - 8.5;
      const high = mid + 8.5;
      const ca = n(form.childAgeYears);
      const ch = n(form.childHeightCm);
      const extra: string[] = [];
      if (ca > 0 && ch > 0) {
        const expectForAge = mid * (0.55 + 0.02 * Math.min(12, ca));
        const diff = ch - expectForAge;
        extra.push(`Very rough vs model for age ${ca}y: ${diff >= 0 ? "above" : "below"} mid-parental trend (~${Math.abs(diff).toFixed(1)} cm)  -  not clinical percentile.`);
      }
      return {
        title: "Mid-parental target height",
        value: `${mid.toFixed(1)} cm (typical range ${low.toFixed(1)}–${high.toFixed(1)} cm)`,
        extra: [...extra, "Genetics + environment; pediatric growth charts are authoritative."],
      };
    }
    case "school-year-age-calculator": {
      const raw = (form.dob || "").trim();
      const d = parseISODateLocal(raw);
      if (!d) return invalid("DOB must be YYYY-MM-DD.");
      const c = (form.country || "US").trim();
      const septYear = new Date().getFullYear();
      const sept1 = new Date(septYear, 8, 1);
      let ageYears = sept1.getFullYear() - d.getFullYear();
      const m = sept1.getMonth() - d.getMonth();
      if (m < 0 || (m === 0 && sept1.getDate() < d.getDate())) ageYears--;
      const cut = c === "UK" || c === "IE" ? 8 : c === "US" || c === "CA" ? 5 : c === "AU" || c === "NZ" ? 5 : 5;
      const grade = Math.max(0, ageYears - cut);
      const label =
        c === "UK" || c === "IE"
          ? `Year ${Math.min(13, grade + 1)} (England-style label, verify locally)`
          : c === "US" || c === "CA"
            ? `Approx grade ${Math.min(12, grade)} (K = 5yo cut-off varies by state/province)`
            : c === "AU"
              ? `Approx primary/secondary year index ${grade + 1} (state rules vary)`
              : `Approx year group +${grade + 1}`;
      return {
        title: "September intake snapshot",
        value: label,
        extra: [
          `Age on 1 Sept ${septYear}: ${ageYears} years`,
          ageYears === cut ? "Often among youngest in cohort for this cut-off model." : ageYears === cut + 1 ? "Often mid cohort." : "Oldest/youngest labels are heuristic - verify with school.",
          `Assumed start: 1 September ${septYear} (simplified).`,
        ],
      };
    }
    case "childcare-cost-calculator": {
      const he = requiredNumber(form.hoursWeek, "Hours/week");
      if (he) return invalid(he);
      const hrs = n(form.hoursWeek);
      const reg = (form.region || "us-mid").trim();
      const type = (form.careType || "nursery-ft").trim();
      const mult = reg.includes("high") ? 1.25 : reg.includes("mid") ? 1 : 0.9;
      const hourly: Record<string, number> = {
        "nursery-ft": 12,
        "nursery-pt": 14,
        minder: 10,
        aupair: 8,
        nanny: 22,
      };
      const wk = hrs * (hourly[type] ?? 12) * mult;
      const mo = (wk * 52) / 12;
      const yr = wk * 52;
      return {
        title: "Childcare cost (illustrative)",
        value: moneyLocale(mo) + " / month",
        extra: [
          `Weekly ~${moneyLocale(wk)}, annual ~${moneyLocale(yr)}`,
          "Check government sites for funded hours, tax credits, or FSA rules.",
        ],
      };
    }
    case "family-budget-calculator": {
      const inc = ["income1", "income2", "income3", "income4"].reduce((s, k) => s + n(form[k]), 0);
      const keys = ["rent", "utilities", "groceries", "childcare", "transport", "insurance", "subscriptions", "debt", "other"] as const;
      let exp = 0;
      for (const k of keys) exp += n(form[k]);
      const net = inc - exp;
      const saveRate = inc > 0 ? (net / inc) * 100 : 0;
      const needs = n(form.rent) + n(form.utilities) + n(form.groceries) + n(form.transport) + n(form.insurance) + n(form.debt) + n(form.other);
      const wants = n(form.subscriptions) + n(form.childcare);
      const p50 = inc > 0 ? (needs / inc) * 100 : 0;
      const p30 = inc > 0 ? (wants / inc) * 100 : 0;
      const p20 = 100 - p50 - p30;
      return {
        title: net >= 0 ? "Monthly surplus" : "Monthly deficit",
        value: moneyLocale(net),
        extra: [
          `Income ${moneyLocale(inc)} vs expenses ${moneyLocale(exp)}`,
          `Savings rate ≈ ${saveRate.toFixed(1)}%`,
          `50/30/20 style split (rough): needs ~${p50.toFixed(0)}%, wants ~${p30.toFixed(0)}%, remainder ~${p20.toFixed(0)}%`,
          saveRate < 20 ? "Tip: trim subscriptions and grocery waste first, then revisit transport." : "Strong savings buffer - keep an emergency fund separate.",
        ],
      };
    }
    case "crypto-capital-gains-tax-calculator": {
      const errs = [requiredNumber(form.buyPrice, "Buy"), requiredNumber(form.sellPrice, "Sell"), requiredNumber(form.amount, "Amount")].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const buy = n(form.buyPrice);
      const sell = n(form.sellPrice);
      const amt = n(form.amount);
      if (buy < 0 || sell < 0 || amt <= 0) return invalid("Invalid prices or amount.");
      const gain = (sell - buy) * amt;
      const cr = (form.country || "US").trim();
      const hold = (form.holding || "short").trim();
      let rate = hold === "long" ? 0.15 : 0.24;
      if (cr === "UK") rate = hold === "long" ? 0.1 : 0.2;
      if (cr === "CA" || cr === "AU") rate = hold === "long" ? 0.12 : 0.22;
      const cust = n(form.customRate);
      if (cust > 0) rate = cust / 100;
      const tax = Math.max(0, gain) * rate;
      const net = gain - tax;
      const be = buy + tax / Math.max(amt, 1e-9);
      return {
        title: gain >= 0 ? "Capital gain" : "Capital loss",
        value: moneyLocale(gain),
        extra: [
          `Tax @ ~${(rate * 100).toFixed(1)}% on gain: ${moneyLocale(tax)}`,
          `Net after tax: ${moneyLocale(net)}`,
          `Rough break-even sell (recover tax on gain only): ~$${be.toFixed(4)}/coin`,
          "This is not tax advice. Consult a qualified tax professional.",
        ],
      };
    }
    case "dividend-reinvestment-calculator": {
      const ie = requiredNumber(form.initial, "Initial");
      const ye = requiredNumber(form.years, "Years");
      if (ie || ye) return invalid((ie || ye) as string);
      const init = n(form.initial);
      const yld = n(form.divYield) / 100;
      const gr = n(form.priceGrowth) / 100;
      const yrs = Math.min(40, Math.max(1, Math.floor(n(form.years))));
      const drip = (form.drip || "yes") === "yes";
      let vDrip = init;
      let vStock = init;
      let cash = 0;
      let totalDivNoDrip = 0;
      const lines: string[] = [];
      for (let y = 1; y <= yrs; y++) {
        const dD = vDrip * yld;
        vDrip = (vDrip + dD) * (1 + gr);
        const dN = vStock * yld;
        totalDivNoDrip += dN;
        vStock *= 1 + gr;
        cash += dN;
        const showV = drip ? vDrip : vStock + cash;
        if (y % 5 === 0 || y === yrs) lines.push(`Year ${y}: ${drip ? "DRIP portfolio" : "total wealth (stock + cash)"} ~$${showV.toLocaleString("en-US", { maximumFractionDigits: 0 })}`);
      }
      const totalNoDripWealth = vStock + cash;
      const mainVal = drip ? vDrip : totalNoDripWealth;
      return {
        title: drip ? "DRIP projection" : "Cash-dividend projection",
        value: moneyLocale(mainVal),
        extra: [
          `Dividends paid on no-DRIP track (same yield %): ~$${totalDivNoDrip.toLocaleString("en-US", { maximumFractionDigits: 0 })} (cash idle, 0% return in this model)`,
          drip
            ? `Same inputs without DRIP: stock ~$${vStock.toLocaleString("en-US", { maximumFractionDigits: 0 })} + cash ~$${cash.toLocaleString("en-US", { maximumFractionDigits: 0 })} = ~$${totalNoDripWealth.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
            : `With DRIP (same model): ~$${vDrip.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
          ...lines,
        ],
      };
    }
    case "options-profit-calculator": {
      const errs = ["strike", "premium", "contracts", "spotAtExpiry"].map((k) => requiredNumber(form[k], k)).filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const K = n(form.strike);
      const prem = n(form.premium);
      const nct = Math.floor(n(form.contracts));
      const S = n(form.spotAtExpiry);
      const mult = 100 * nct;
      const isCall = (form.optType || "call") === "call";
      const long = (form.side || "long") === "long";
      const intrinsic = isCall ? Math.max(0, S - K) : Math.max(0, K - S);
      const plPerShare = long ? intrinsic - prem : prem - intrinsic;
      const pl = plPerShare * mult;
      const be = isCall ? K + prem : K - prem;
      return {
        title: "P/L at expiry (before fees)",
        value: moneyLocale(pl),
        extra: [
          `Breakeven at expiry ≈ $${be.toFixed(2)}/share`,
          `Max profit (theoretical): ${long ? (isCall ? "unlimited call" : moneyLocale((K - prem) * mult)) : moneyLocale(prem * mult)}`,
          `Max loss (buyer): ${moneyLocale(-prem * mult)}`,
          "Educational - real fills, IV, and assignment matter.",
        ],
      };
    }
    case "inflation-impact-calculator": {
      const ae = requiredNumber(form.amount, "Amount");
      const ye = requiredNumber(form.yearsAhead, "Years");
      if (ae || ye) return invalid((ae || ye) as string);
      const amt = n(form.amount);
      const yrs = Math.min(30, Math.max(1, Math.floor(n(form.yearsAhead))));
      const manual = n(form.manualInflation);
      const cr = (form.country || "US").trim();
      const inf = manual > 0 ? manual / 100 : cr === "UK" ? 0.03 : cr === "EU" ? 0.025 : 0.03;
      const fv = amt * (1 + inf) ** yrs;
      const loss = (1 - 1 / (1 + inf) ** yrs) * 100;
      const lines: string[] = [];
      for (let y = 0; y <= yrs; y += Math.max(1, Math.floor(yrs / 5))) {
        const v = amt * (1 + inf) ** y;
        lines.push(`Year ${y}: $100 today ≈ $${((100 / amt) * v).toFixed(2)} in then-dollars of this model`);
      }
      return {
        title: "Future nominal equivalent",
        value: moneyLocale(fv),
        extra: [
          `Purchasing power retained ≈ ${(100 - loss).toFixed(1)}% of today’s bundle after ${yrs}y @ ${(inf * 100).toFixed(1)}%/yr`,
          ...lines,
          "Use official CPI for serious planning.",
        ],
      };
    }
    case "vat-calculator": {
      const ne = requiredNumber(form.netAmount, "Amount (excluding VAT)");
      const ve = requiredNumber(form.vatRate, "VAT rate (%)");
      if (ne || ve) return invalid((ne || ve) as string);
      const net = n(form.netAmount);
      const rate = n(form.vatRate);
      if (net < 0) return invalid("Net amount cannot be negative.");
      if (rate < 0) return invalid("VAT rate cannot be negative.");
      const vat = net * (rate / 100);
      const gross = net + vat;
      return {
        title: "VAT summary",
        value: moneyLocale(gross),
        extra: [
          `VAT (${rate.toLocaleString("en-US")}%): ${moneyLocale(vat)}`,
          `Net (excluding VAT): ${moneyLocale(net)}`,
          `Gross (including VAT): ${moneyLocale(gross)}`,
        ],
      };
    }
    case "tip-calculator-split-bill": {
      const be = requiredNumber(form.billAmount, "Bill amount");
      const te = requiredNumber(form.tipPercent, "Tip (%)");
      const pe = requiredNumber(form.partySize, "People splitting");
      if (be || te || pe) return invalid((be || te || pe) as string);
      const bill = n(form.billAmount);
      const tipPct = n(form.tipPercent);
      const people = Math.floor(n(form.partySize));
      if (bill <= 0) return invalid("Bill amount must be greater than zero.");
      if (people < 1) return invalid("Party size must be at least 1.");
      if (tipPct < 0) return invalid("Tip percent cannot be negative.");
      const tip = bill * (tipPct / 100);
      const total = bill + tip;
      const perPerson = total / people;
      const tipEach = tip / people;
      return {
        title: "Per person (bill + tip)",
        value: moneyLocale(perPerson),
        extra: [
          `Tip total: ${moneyLocale(tip)} (${tipPct.toLocaleString("en-US")}% of bill)`,
          `Tip per person: ${moneyLocale(tipEach)}`,
          `Bill share before tip: ${moneyLocale(bill / people)}`,
          `Total for table: ${moneyLocale(total)}`,
        ],
      };
    }
    case "net-worth-tracker": {
      const ce = requiredNumber(form.currentNetWorth, "Current net worth");
      const me = requiredNumber(form.monthlyChange, "Average monthly change");
      const xe = requiredNumber(form.monthsAhead, "Months ahead");
      if (ce || me || xe) return invalid((ce || me || xe) as string);
      const nw = n(form.currentNetWorth);
      const delta = n(form.monthlyChange);
      const mo = Math.floor(n(form.monthsAhead));
      if (mo < 1) return invalid("Months ahead must be at least 1.");
      if (mo > 600) return invalid("Enter 600 months or fewer for this projection.");
      const projected = nw + delta * mo;
      return {
        title: `Projected net worth (${mo} mo)`,
        value: moneyLocale(projected),
        extra: [
          `Starting net worth: ${moneyLocale(nw)}`,
          `Monthly change assumed: ${moneyLocale(delta)}`,
          `Linear total change: ${moneyLocale(delta * mo)}`,
          "Illustration only - real wealth paths are not perfectly linear.",
        ],
      };
    }
    case "retirement-age-calculator": {
      const fields = [
        ["currentAge", "Current age"],
        ["currentSavings", "Current retirement savings"],
        ["monthlyContribution", "Monthly contribution"],
        ["annualReturn", "Expected annual return (%)"],
        ["targetSavings", "Target savings balance"],
      ] as const;
      for (const [k, lab] of fields) {
        const err = requiredNumber(form[k], lab);
        if (err) return invalid(err);
      }
      const age = Math.floor(n(form.currentAge));
      const bal0 = n(form.currentSavings);
      const contrib = n(form.monthlyContribution);
      const ann = n(form.annualReturn);
      const target = n(form.targetSavings);
      if (age < 1 || age > 120) return invalid("Enter a realistic current age.");
      if (bal0 < 0) return invalid("Current savings cannot be negative.");
      if (contrib < 0) return invalid("Monthly contribution cannot be negative.");
      if (ann < 0 || ann > 50) return invalid("Use an annual return between 0% and 50%.");
      if (target <= 0) return invalid("Target must be greater than zero.");
      if (bal0 >= target) {
        return {
          title: "Target already reached",
          value: `Age ${age}`,
          extra: [
            `Current balance ${moneyLocale(bal0)} meets or exceeds target ${moneyLocale(target)}.`,
            "Adjust target higher to project a future age.",
          ],
        };
      }
      const mr = ann / 100 / 12;
      let bal = bal0;
      let months = 0;
      const maxMonths = 1200;
      while (bal < target && months < maxMonths) {
        bal = bal * (1 + mr) + contrib;
        months += 1;
      }
      if (bal < target) {
        return {
          title: "Target not reached in 100 years",
          value: moneyLocale(bal),
          extra: [
            `After ${maxMonths} months of contributions at ${ann.toFixed(2)}%/yr, balance ≈ ${moneyLocale(bal)}.`,
            "Increase contributions, return assumption, or lower the target for a reachable timeline.",
          ],
        };
      }
      const yearsAdd = months / 12;
      const estAge = age + yearsAdd;
      return {
        title: "Estimated age at target",
        value: `${estAge.toFixed(1)} years old`,
        extra: [
          `About ${months.toLocaleString("en-US")} months (${yearsAdd.toFixed(1)} years) to reach ≈ ${moneyLocale(bal)}.`,
          `Assumes ${contrib.toLocaleString("en-US", { maximumFractionDigits: 2 })} contributed monthly and ${ann.toFixed(2)}% annual return, compounded monthly.`,
        ],
      };
    }
    case "currency-converter": {
      const from = String(form.fromCurrency ?? "USD")
        .trim()
        .toUpperCase();
      const to = String(form.toCurrency ?? "EUR")
        .trim()
        .toUpperCase();
      const ae = requiredNumber(form.amount, "Amount to convert");
      if (ae) return invalid(ae);
      const amt = n(form.amount);
      if (amt < 0) return invalid("Amount cannot be negative.");
      let rate: number;
      if (from === to) {
        rate = 1;
      } else {
        const re = requiredNumber(form.rate, "Exchange rate");
        if (re) return invalid(re);
        rate = n(form.rate);
        if (rate <= 0) return invalid("Exchange rate must be greater than zero.");
      }
      const out = amt * rate;
      return {
        title: "Converted amount",
        value: out.toLocaleString("en-US", { maximumFractionDigits: 6 }),
        extra: [
          `${from} → ${to}`,
          `Source amount: ${amt.toLocaleString("en-US", { maximumFractionDigits: 6 })}`,
          `Rate applied: ${rate.toLocaleString("en-US", { maximumFractionDigits: 8 })} (target per 1 source)`,
          "Verify live rates with your bank or broker before sending money.",
        ],
      };
    }
    case "lease-vs-buy-car-calculator": {
      const labels: [string, string][] = [
        ["horizonMonths", "Comparison period (months)"],
        ["leaseMonthly", "Lease payment (per month)"],
        ["leaseUpfront", "Lease due at signing"],
        ["buyPrice", "Vehicle purchase price"],
        ["buyDown", "Down payment"],
        ["buyApr", "Loan APR (%)"],
        ["resaleValue", "Estimated resale value"],
      ];
      for (const [k, lab] of labels) {
        const err = requiredNumber(form[k], lab);
        if (err) return invalid(err);
      }
      const h = Math.floor(n(form.horizonMonths));
      const leaseMo = n(form.leaseMonthly);
      const leaseUp = n(form.leaseUpfront);
      const price = n(form.buyPrice);
      const down = n(form.buyDown);
      const aprPct = n(form.buyApr);
      const resale = n(form.resaleValue);
      if (h < 1 || h > 120) return invalid("Use a comparison period between 1 and 120 months.");
      if (leaseMo < 0 || leaseUp < 0 || price <= 0 || down < 0 || aprPct < 0 || resale < 0) return invalid("Check that amounts are valid (purchase price must be > 0).");
      if (down > price) return invalid("Down payment cannot exceed purchase price.");
      const principal = price - down;
      const r = aprPct / 1200;
      const emi =
        principal <= 0
          ? 0
          : r === 0
            ? principal / h
            : (principal * r * (1 + r) ** h) / ((1 + r) ** h - 1);
      const buyNetCash = down + emi * h - resale;
      const leaseTotal = leaseUp + leaseMo * h;
      const diff = buyNetCash - leaseTotal;
      const lean =
        diff < 0
          ? "Buying (this model) shows lower net cash cost."
          : diff > 0
            ? "Leasing (this model) shows lower net cash cost."
            : "Roughly similar net cash cost in this model.";
      return {
        title: "Net cash comparison",
        value: lean,
        extra: [
          `Lease total (signing + payments): ${moneyLocale(leaseTotal)}`,
          `Buy net (down + loan payments − resale): ${moneyLocale(buyNetCash)}`,
          `Difference (buy − lease): ${moneyLocale(diff)}`,
          `Loan payment (monthly est.): ${principal > 0 ? moneyLocale(emi) : "$0.00"}`,
          "Ignores tax, insurance, maintenance, mileage limits, and disposition fees.",
        ],
      };
    }
    case "fuel-efficiency-calculator": {
      const de = requiredNumber(form.distance, "Distance driven");
      const fe = requiredNumber(form.fuelUsed, "Fuel used");
      if (de || fe) return invalid((de || fe) as string);
      const dist = n(form.distance);
      const fuel = n(form.fuelUsed);
      if (dist <= 0 || fuel <= 0) return invalid("Distance and fuel must be greater than zero.");
      const mode = (form.mode || "us").trim();
      if (mode === "metric") {
        const l100 = (fuel / dist) * 100;
        const kmL = dist / fuel;
        const usMpg = l100 > 0 ? 235.214583 / l100 : 0;
        return {
          title: "Fuel economy (metric)",
          value: `${l100.toLocaleString("en-US", { maximumFractionDigits: 2 })} L/100 km`,
          extra: [
            `${kmL.toLocaleString("en-US", { maximumFractionDigits: 2 })} km/L`,
            `≈ ${usMpg.toLocaleString("en-US", { maximumFractionDigits: 2 })} US MPG (converted)`,
            `From ${dist.toLocaleString("en-US", { maximumFractionDigits: 2 })} km using ${fuel.toLocaleString("en-US", { maximumFractionDigits: 3 })} L`,
          ],
        };
      }
      const mpg = dist / fuel;
      const l100 = mpg > 0 ? 235.214583 / mpg : 0;
      const kmL = l100 > 0 ? 100 / l100 : 0;
      return {
        title: "Fuel economy (US)",
        value: `${mpg.toLocaleString("en-US", { maximumFractionDigits: 2 })} US MPG`,
        extra: [
          `≈ ${l100.toLocaleString("en-US", { maximumFractionDigits: 2 })} L/100 km`,
          `≈ ${kmL.toLocaleString("en-US", { maximumFractionDigits: 2 })} km/L`,
          `From ${dist.toLocaleString("en-US", { maximumFractionDigits: 2 })} mi using ${fuel.toLocaleString("en-US", { maximumFractionDigits: 3 })} gal`,
        ],
      };
    }
    case "parking-cost-calculator": {
      const reqs = [
        requiredNumber(form.dailyRate, "Parking cost per day"),
        requiredNumber(form.daysPerMonth, "Days parked per month"),
        requiredNumber(form.months, "Number of months"),
      ].filter(Boolean);
      if (reqs.length) return invalid(reqs[0] as string);
      const daily = n(form.dailyRate);
      const days = n(form.daysPerMonth);
      const mo = Math.floor(n(form.months));
      if (daily < 0 || days < 0) return invalid("Rate and days cannot be negative.");
      if (mo < 1) return invalid("Months must be at least 1.");
      const monthly = daily * days;
      const total = monthly * mo;
      return {
        title: `Total (${mo} mo)`,
        value: moneyLocale(total),
        extra: [
          `Monthly parking estimate: ${moneyLocale(monthly)}`,
          `${days.toLocaleString("en-US", { maximumFractionDigits: 1 })} days/mo × ${moneyLocale(daily)}/day`,
          mo === 12 ? `Annualized ≈ ${moneyLocale(monthly * 12)}` : `Scaled to ${mo} month(s)`,
        ],
      };
    }
    case "dog-breed-life-expectancy": {
      const breed = (form.breed || "").trim();
      if (!breed || !DOG_BREED_LIFE_YEARS[breed]) return invalid("Select a breed from the list.");
      const { min, max } = DOG_BREED_LIFE_YEARS[breed];
      const ageRaw = (form.currentAge ?? "").trim();
      const extra: string[] = [
        `Typical range (population): ${min}–${max} years`,
        "Genetics, diet, weight, exercise, and veterinary care change outcomes for any individual dog.",
        "Not a medical prognosis - ask your veterinarian about your pet’s health.",
      ];
      if (ageRaw !== "") {
        const cae = requiredNumber(form.currentAge, "Dog’s current age (years)");
        if (cae) return invalid(cae);
        const ca = n(form.currentAge);
        if (ca < 0 || ca > 30) return invalid("Enter a realistic current age in years (0–30).");
        const remLo = Math.max(0, min - ca);
        const remHi = Math.max(0, max - ca);
        const midLife = (min + max) / 2;
        const remMid = Math.max(0, midLife - ca);
        extra.unshift(
          `Rough years remaining (midpoint ${midLife.toFixed(1)} y): about ${remMid.toFixed(1)} years (illustrative only)`,
          `If range holds: about ${remLo.toFixed(1)}–${remHi.toFixed(1)} years remaining from today’s age (${ca.toLocaleString("en-US")} y)`,
        );
      }
      return {
        title: "Typical lifespan (years)",
        value: `${min}–${max} years`,
        extra,
      };
    }
    case "pet-food-cost-calculator": {
      const pe = requiredNumber(form.petCount, "Number of pets");
      const de = requiredNumber(form.dailyCostPerPet, "Daily food cost per pet");
      const me = requiredNumber(form.months, "Months");
      if (pe || de || me) return invalid((pe || de || me) as string);
      const pets = Math.floor(n(form.petCount));
      const daily = n(form.dailyCostPerPet);
      const mo = Math.floor(n(form.months));
      if (pets < 1) return invalid("Number of pets must be at least 1.");
      if (daily <= 0) return invalid("Daily cost per pet must be greater than zero.");
      if (mo < 1 || mo > 240) return invalid("Use between 1 and 240 months.");
      const avgDaysPerMonth = 30.437;
      const monthlyHousehold = pets * daily * avgDaysPerMonth;
      const total = monthlyHousehold * mo;
      return {
        title: `Household total (${mo} mo)`,
        value: moneyLocale(total),
        extra: [
          `Estimated monthly (all pets): ${moneyLocale(monthlyHousehold)}`,
          `${pets.toLocaleString("en-US")} pet(s) × ${moneyLocale(daily)}/pet/day × ~${avgDaysPerMonth.toFixed(3)} days/mo`,
          "Excludes treats, supplements, prescription diets, and vet-prescribed foods unless you fold them into the daily number.",
        ],
      };
    }
    case "nursing-shift-pay-calculator": {
      const labs: [string, string][] = [
        ["hourlyRate", "Base hourly rate"],
        ["regularHoursPerShift", "Regular hours per shift"],
        ["overtimeHoursPerShift", "Overtime hours per shift"],
        ["overtimeMultiplier", "Overtime pay multiplier"],
        ["shiftsInPeriod", "Shifts in this period"],
      ];
      for (const [k, lab] of labs) {
        const err = requiredNumber(form[k], lab);
        if (err) return invalid(err);
      }
      const rate = n(form.hourlyRate);
      const regH = n(form.regularHoursPerShift);
      const otH = n(form.overtimeHoursPerShift);
      const mult = n(form.overtimeMultiplier);
      const shifts = Math.floor(n(form.shiftsInPeriod));
      if (rate <= 0) return invalid("Hourly rate must be greater than zero.");
      if (regH < 0 || otH < 0) return invalid("Hours cannot be negative.");
      if (mult < 1) return invalid("Overtime multiplier is usually at least 1.");
      if (shifts < 1) return invalid("Shifts in period must be at least 1.");
      const perShift = rate * regH + rate * mult * otH;
      const total = perShift * shifts;
      return {
        title: "Estimated gross for period",
        value: moneyLocale(total),
        extra: [
          `Per shift (before tax): ${moneyLocale(perShift)}`,
          `${shifts.toLocaleString("en-US")} shift(s) × ${moneyLocale(perShift)}`,
          `Components: ${regH.toLocaleString("en-US", { maximumFractionDigits: 2 })} reg h @ ${moneyLocale(rate)} + ${otH.toLocaleString("en-US", { maximumFractionDigits: 2 })} OT h @ ${mult.toLocaleString("en-US", { maximumFractionDigits: 2 })}×`,
          "Excludes shift differentials, PTO, bonuses, and deductions.",
        ],
      };
    }
    case "bmi-for-children-calculator": {
      const we = requiredNumber(form.weightKg, "Weight (kg)");
      const he = requiredNumber(form.heightCm, "Height (cm)");
      if (we || he) return invalid((we || he) as string);
      const w = n(form.weightKg);
      const hCm = n(form.heightCm);
      if (w <= 0 || hCm <= 0) return invalid("Weight and height must be greater than zero.");
      const hm = hCm / 100;
      const bmi = w / (hm * hm);
      const ageStr = (form.ageYears ?? "").trim();
      const sex = (form.sex || "X").trim();
      const extra: string[] = [
        `BMI = weight (kg) ÷ height (m)²`,
        "Pediatric interpretation requires CDC/WHO growth charts by age and sex - not included here.",
        "Clinicians assess trend, puberty, and health - not a single number alone.",
      ];
      if (ageStr !== "") {
        const ae = requiredNumber(form.ageYears, "Age (years)");
        if (ae) return invalid(ae);
        const ag = n(form.ageYears);
        if (ag < 0 || ag > 19) extra.unshift("Age outside 0–19: pediatric chart rules may not apply - discuss with a clinician.");
        else if (ag < 2) extra.unshift("Under 2 years: BMI is often misleading - use WHO length-for-age/weight-for-length with your pediatrician.");
        else extra.unshift(`Age entered: ${ag.toLocaleString("en-US", { maximumFractionDigits: 1 })} y - use the ${sex === "M" ? "boys" : sex === "F" ? "girls" : "sex-appropriate"} CDC or local chart with a nurse or doctor.`);
      }
      return {
        title: "Body mass index (kg/m²)",
        value: bmi.toLocaleString("en-US", { maximumFractionDigits: 1 }),
        extra,
      };
    }
    case "medication-dosage-calculator": {
      const dErr = requiredNumber(form.doseMgPerKg, "Prescribed dose (mg per kg)");
      const wErr = requiredNumber(form.weightKg, "Body weight (kg)");
      const cErr = requiredNumber(form.concentrationMgPerMl, "Liquid concentration (mg per mL)");
      if (dErr || wErr || cErr) return invalid((dErr || wErr || cErr) as string);
      const dPk = n(form.doseMgPerKg);
      const wKg = n(form.weightKg);
      const conc = n(form.concentrationMgPerMl);
      if (dPk <= 0 || wKg <= 0) return invalid("Dose per kg and weight must be greater than zero.");
      if (conc < 0) return invalid("Concentration cannot be negative.");
      const totalMg = dPk * wKg;
      const extra: string[] = [
        `Total dose: ${totalMg.toLocaleString("en-US", { maximumFractionDigits: 4 })} mg (arithmetic check only)`,
        "Verify against the written prescription, label, and pharmacist instructions.",
      ];
      if (conc > 0) {
        const ml = totalMg / conc;
        extra.unshift(`Approx liquid volume: ${ml.toLocaleString("en-US", { maximumFractionDigits: 3 })} mL at ${conc.toLocaleString("en-US", { maximumFractionDigits: 6 })} mg/mL`);
      } else {
        extra.push("Concentration set to 0 - volume line skipped (tablets or unknown liquid).");
      }
      return {
        title: "Educational dose check",
        value: `${totalMg.toLocaleString("en-US", { maximumFractionDigits: 4 })} mg`,
        extra,
      };
    }
    case "due-date-calculator": {
      const raw = (form.lastMenstrualPeriod || "").trim();
      const d = parseISODateLocal(raw);
      if (!d) return invalid("Enter LMP as YYYY-MM-DD.");
      const edd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 280);
      const y = edd.getFullYear();
      const mo = String(edd.getMonth() + 1).padStart(2, "0");
      const da = String(edd.getDate()).padStart(2, "0");
      const iso = `${y}-${mo}-${da}`;
      return {
        title: "Estimated due date (LMP rule)",
        value: iso,
        extra: [
          "Based on first day of LMP + 280 days (40 weeks) - common rule of thumb.",
          "Ultrasound dating and clinical judgment may change your official EDD.",
          "Seek prenatal care promptly; this is not a substitute for medical follow-up.",
        ],
      };
    }
    case "markup-calculator": {
      const cErr = requiredNumber(form.unitCost, "Unit cost");
      const mErr = requiredNumber(form.markupPercent, "Markup on cost (%)");
      if (cErr || mErr) return invalid((cErr || mErr) as string);
      const cost = n(form.unitCost);
      const markupPct = n(form.markupPercent);
      const negC = validateNonNegative(cost, "Unit cost");
      const negM = validateNonNegative(markupPct, "Markup on cost (%)");
      if (negC || negM) return invalid((negC || negM) as string);
      const price = cost * (1 + markupPct / 100);
      const marginPct = price > 0 ? ((price - cost) / price) * 100 : 0;
      return {
        title: "Selling price (cost + markup)",
        value: money(price),
        extra: [
          `Implied gross margin on revenue: ${marginPct.toLocaleString("en-US", { maximumFractionDigits: 2 })}%`,
          `Markup on cost: ${markupPct.toLocaleString("en-US", { maximumFractionDigits: 2 })}%`,
        ],
      };
    }
    case "sales-commission-calculator": {
      const sErr = requiredNumber(form.grossSales, "Gross sales amount");
      const rErr = requiredNumber(form.commissionRate, "Commission rate (%)");
      if (sErr || rErr) return invalid((sErr || rErr) as string);
      const sales = n(form.grossSales);
      const rate = n(form.commissionRate);
      const negS = validateNonNegative(sales, "Gross sales amount");
      const negR = validateNonNegative(rate, "Commission rate (%)");
      if (negS || negR) return invalid((negS || negR) as string);
      const commission = sales * (rate / 100);
      return {
        title: "Estimated commission",
        value: money(commission),
        extra: [
          `On ${moneyLocale(sales)} at ${rate.toLocaleString("en-US", { maximumFractionDigits: 2 })}%`,
          "Confirm plan rules for returns, splits, caps, and taxable treatment.",
        ],
      };
    }
    case "burn-rate-runway-calculator": {
      const cashErr = requiredNumber(form.cashBalance, "Cash on hand");
      const burnErr = requiredNumber(form.monthlyBurn, "Average monthly net burn");
      if (cashErr || burnErr) return invalid((cashErr || burnErr) as string);
      const cash = n(form.cashBalance);
      const burn = n(form.monthlyBurn);
      const negCash = validateNonNegative(cash, "Cash on hand");
      const negBurn = validateNonNegative(burn, "Average monthly net burn");
      if (negCash || negBurn) return invalid((negCash || negBurn) as string);
      if (burn === 0) {
        return {
          title: "Runway (simple cash model)",
          value: "Not finite at zero burn",
          extra: [
            `Cash on hand: ${moneyLocale(cash)}`,
            "With zero average net burn you are not depleting cash on this assumption-reforecast if growth spend restarts burn.",
          ],
        };
      }
      const months = cash / burn;
      return {
        title: "Approximate runway",
        value: `${months.toLocaleString("en-US", { maximumFractionDigits: 2 })} months`,
        extra: [
          `Cash: ${moneyLocale(cash)}; avg net burn: ${moneyLocale(burn)}/mo`,
          "Linear model only-excludes fundraising, revenue ramps, and lumpy expenses.",
        ],
      };
    }
    case "stacked-discount-calculator": {
      const pErr = requiredNumber(form.listPrice, "List price");
      const d1Err = requiredNumber(form.firstDiscountPercent, "First discount (%)");
      const d2Err = requiredNumber(form.secondDiscountPercent, "Second discount (%)");
      if (pErr || d1Err || d2Err) return invalid((pErr || d1Err || d2Err) as string);
      const list = n(form.listPrice);
      const d1 = n(form.firstDiscountPercent);
      const d2 = n(form.secondDiscountPercent);
      const negP = validateNonNegative(list, "List price");
      if (negP) return invalid(negP);
      if (d1 < 0 || d1 > 100 || d2 < 0 || d2 > 100) {
        return invalid("Each discount must be between 0 and 100%.");
      }
      const afterFirst = list * (1 - d1 / 100);
      const finalPrice = afterFirst * (1 - d2 / 100);
      const totalOff = list > 0 ? (1 - finalPrice / list) * 100 : 0;
      return {
        title: "Price after stacked discounts",
        value: money(finalPrice),
        extra: [
          `After first discount (${d1}%): ${money(afterFirst)}`,
          `Total effective discount vs list: ${totalOff.toLocaleString("en-US", { maximumFractionDigits: 2 })}%`,
        ],
      };
    }
    case "revenue-per-employee-calculator": {
      const revErr = requiredNumber(form.annualRevenue, "Annual revenue");
      const headErr = requiredNumber(form.employeeCount, "Employees (or FTEs)");
      if (revErr || headErr) return invalid((revErr || headErr) as string);
      const rev = n(form.annualRevenue);
      const heads = n(form.employeeCount);
      const negRev = validateNonNegative(rev, "Annual revenue");
      if (negRev) return invalid(negRev);
      if (heads <= 0) return invalid("Employee count must be greater than zero.");
      const rpe = rev / heads;
      return {
        title: "Revenue per employee",
        value: moneyLocale(rpe),
        extra: [
          `${moneyLocale(rev)} ÷ ${heads.toLocaleString("en-US", { maximumFractionDigits: 2 })} FTEs`,
          "Match revenue basis and headcount definition to any external benchmark.",
        ],
      };
    }
    case "mulch-volume-calculator": {
      const aErr = requiredNumber(form.bedAreaSqFt, "Bed area (sq ft)");
      const dErr = requiredNumber(form.depthInches, "Depth (inches)");
      if (aErr || dErr) return invalid((aErr || dErr) as string);
      const area = n(form.bedAreaSqFt);
      const depthIn = n(form.depthInches);
      if (area <= 0) return invalid("Bed area must be greater than zero.");
      if (depthIn <= 0) return invalid("Depth must be greater than zero.");
      const cuFt = area * (depthIn / 12);
      const cuYd = cuFt / 27;
      return {
        title: "Estimated mulch volume",
        value: `${cuYd.toLocaleString("en-US", { maximumFractionDigits: 3 })} cu yd`,
        extra: [
          `≈ ${cuFt.toLocaleString("en-US", { maximumFractionDigits: 2 })} cu ft (${area.toLocaleString("en-US", { maximumFractionDigits: 2 })} sq ft × ${depthIn.toLocaleString("en-US", { maximumFractionDigits: 2 })} in deep)`,
          "Compaction and settling not modeled-round up for bag counts and supplier minimums.",
        ],
      };
    }
    case "concrete-slab-volume-calculator": {
      const lErr = requiredNumber(form.slabLengthFt, "Slab length (ft)");
      const wErr = requiredNumber(form.slabWidthFt, "Slab width (ft)");
      const tErr = requiredNumber(form.slabThicknessIn, "Thickness (inches)");
      if (lErr || wErr || tErr) return invalid((lErr || wErr || tErr) as string);
      const len = n(form.slabLengthFt);
      const wid = n(form.slabWidthFt);
      const th = n(form.slabThicknessIn);
      if (len <= 0 || wid <= 0 || th <= 0) return invalid("Length, width, and thickness must be greater than zero.");
      const cuFt = len * wid * (th / 12);
      const cuYd = cuFt / 27;
      return {
        title: "Estimated concrete volume",
        value: `${cuYd.toLocaleString("en-US", { maximumFractionDigits: 3 })} cu yd`,
        extra: [
          `≈ ${cuFt.toLocaleString("en-US", { maximumFractionDigits: 2 })} cu ft for ${len.toLocaleString("en-US", { maximumFractionDigits: 2 })} × ${wid.toLocaleString("en-US", { maximumFractionDigits: 2 })} ft × ${th.toLocaleString("en-US", { maximumFractionDigits: 2 })} in`,
          "Add site-specific waste and confirm short-load fees with your ready-mix supplier.",
        ],
      };
    }
    case "floor-tile-quantity-calculator": {
      const rlErr = requiredNumber(form.roomLengthFt, "Room length (ft)");
      const rwErr = requiredNumber(form.roomWidthFt, "Room width (ft)");
      const tsErr = requiredNumber(form.tileSizeInches, "Tile side (inches, square)");
      const waErr = requiredNumber(form.wastePercent, "Extra for cuts & waste (%)");
      if (rlErr || rwErr || tsErr || waErr) return invalid((rlErr || rwErr || tsErr || waErr) as string);
      const rl = n(form.roomLengthFt);
      const rw = n(form.roomWidthFt);
      const ts = n(form.tileSizeInches);
      const waste = n(form.wastePercent);
      if (rl <= 0 || rw <= 0) return invalid("Room dimensions must be greater than zero.");
      if (ts <= 0) return invalid("Tile size must be greater than zero.");
      if (waste < 0 || waste > 200) return invalid("Waste percent should be between 0 and 200.");
      const roomArea = rl * rw;
      const tileArea = (ts / 12) * (ts / 12);
      const tiles = Math.ceil((roomArea * (1 + waste / 100)) / tileArea);
      return {
        title: "Estimated tile count",
        value: `${tiles.toLocaleString("en-US")} tiles`,
        extra: [
          `Room ≈ ${roomArea.toLocaleString("en-US", { maximumFractionDigits: 2 })} sq ft; ${ts.toLocaleString("en-US", { maximumFractionDigits: 2 })} in square tiles (incl. ${waste.toLocaleString("en-US", { maximumFractionDigits: 2 })}% waste)`,
          "Diagonal layouts, niches, and large-format planks often need a higher waste percentage.",
        ],
      };
    }
    case "lawn-fertilizer-bags-calculator": {
      const lErr = requiredNumber(form.lawnSqFt, "Lawn area (sq ft)");
      const cErr = requiredNumber(form.bagCoverageSqFt, "Coverage per bag (sq ft)");
      if (lErr || cErr) return invalid((lErr || cErr) as string);
      const lawn = n(form.lawnSqFt);
      const cov = n(form.bagCoverageSqFt);
      if (lawn <= 0) return invalid("Lawn area must be greater than zero.");
      if (cov <= 0) return invalid("Coverage per bag must be greater than zero.");
      const bags = Math.ceil(lawn / cov);
      return {
        title: "Bags to purchase (rounded up)",
        value: `${bags.toLocaleString("en-US")} bag(s)`,
        extra: [
          `${lawn.toLocaleString("en-US", { maximumFractionDigits: 2 })} sq ft ÷ ${cov.toLocaleString("en-US", { maximumFractionDigits: 2 })} sq ft per bag`,
          "Verify spreader calibration and label limits for your grass type and season.",
        ],
      };
    }
    case "wallpaper-roll-calculator": {
      const wErr = requiredNumber(form.wallAreaSqFt, "Total wall area (sq ft)");
      const rErr = requiredNumber(form.rollCoverageSqFt, "Usable coverage per roll (sq ft)");
      if (wErr || rErr) return invalid((wErr || rErr) as string);
      const wall = n(form.wallAreaSqFt);
      const roll = n(form.rollCoverageSqFt);
      if (wall <= 0) return invalid("Wall area must be greater than zero.");
      if (roll <= 0) return invalid("Roll coverage must be greater than zero.");
      const rolls = Math.ceil(wall / roll);
      return {
        title: "Rolls to purchase (rounded up)",
        value: `${rolls.toLocaleString("en-US")} roll(s)`,
        extra: [
          `${wall.toLocaleString("en-US", { maximumFractionDigits: 2 })} sq ft ÷ ${roll.toLocaleString("en-US", { maximumFractionDigits: 2 })} sq ft per roll`,
          "Pattern repeat and stair drops often need an extra roll beyond this flat ratio.",
        ],
      };
    }
    case "blood-type-compatibility": {
      const rA = (form.recipientAbo || "").trim();
      const rRh = (form.recipientRh || "").trim();
      const dA = (form.donorAbo || "").trim();
      const dRh = (form.donorRh || "").trim();
      const abos = new Set(["O", "A", "B", "AB"]);
      if (!abos.has(rA) || !abos.has(dA)) return invalid("Select ABO types for recipient and donor.");
      if (rRh !== "pos" && rRh !== "neg") return invalid("Select Rh for recipient.");
      if (dRh !== "pos" && dRh !== "neg") return invalid("Select Rh for donor.");
      const aboOk =
        rA === "AB" ||
        (rA === "O" && dA === "O") ||
        (rA === "A" && (dA === "A" || dA === "O")) ||
        (rA === "B" && (dA === "B" || dA === "O"));
      const rhOk = rRh !== "neg" || dRh === "neg";
      const ok = aboOk && rhOk;
      return {
        title: "Red cell compatibility (simplified)",
        value: ok ? "Compatible (classical ABO/Rh model)" : "Not compatible (classical ABO/Rh model)",
        extra: [
          `Recipient: ${rA} Rh${rRh === "pos" ? "+" : rRh === "neg" ? "−" : "?"}`,
          `Donor: ${dA} Rh${dRh === "pos" ? "+" : dRh === "neg" ? "−" : "?"}`,
          "Real transfusions require blood bank testing, antibody screens, and medical orders.",
          "Rare antigens, emergency release, neonatal exchange, and plasma rules are not modeled.",
        ],
      };
    }
    default:
      return invalid(`No computation logic found for tool: ${slug}`);
  }
}
