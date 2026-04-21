import { describe, expect, it } from "vitest";
import { computeTool } from "../lib/tools/engine";

const validCases: Array<{ slug: string; form: Record<string, string> }> = [
  { slug: "cm-to-feet", form: { cm: "170" } },
  { slug: "kg-to-lbs", form: { kg: "70" } },
  { slug: "km-to-miles", form: { km: "10" } },
  { slug: "celsius-to-fahrenheit", form: { celsius: "30" } },
  { slug: "mb-to-gb", form: { mb: "2048" } },
  { slug: "loan-calculator", form: { principal: "100000", rate: "8", years: "10" } },
  { slug: "emi-calculator", form: { principal: "50000", rate: "10", months: "24" } },
  { slug: "compound-interest-calculator", form: { principal: "10000", rate: "12", years: "5", frequency: "4" } },
  { slug: "salary-after-tax-calculator", form: { salary: "120000", taxRate: "20" } },
  { slug: "stock-profit-calculator", form: { buy: "100", sell: "120", qty: "10", fee: "15" } },
  { slug: "word-counter", form: { text: "hello world from orbital tools" } },
  { slug: "case-converter", form: { text: "hello world", mode: "title" } },
  { slug: "password-generator", form: { length: "16", symbols: "yes" } },
  { slug: "json-formatter", form: { json: '{"a":1}' } },
  { slug: "color-palette-generator", form: { hex: "#7c3aed" } },
  { slug: "rental-yield-calculator", form: { annualRent: "12000", propertyPrice: "200000" } },
  { slug: "property-roi-calculator", form: { gain: "50000", cost: "200000" } },
  { slug: "mortgage-affordability-calculator", form: { income: "5000", debt: "1000", ratio: "36" } },
  { slug: "rent-vs-buy-calculator", form: { rent: "1200", buyCost: "1500", years: "5" } },
  { slug: "roi-calculator", form: { gain: "2500", cost: "10000" } },
  { slug: "break-even-calculator", form: { fixed: "10000", price: "20", variable: "8" } },
  { slug: "profit-margin-calculator", form: { revenue: "100000", cost: "70000" } },
  { slug: "cac-calculator", form: { salesMarketing: "30000", customers: "120" } },
  { slug: "ltv-calculator", form: { arpu: "50", grossMargin: "70", churn: "5" } },
  { slug: "adsense-earnings-calculator", form: { views: "100000", ctr: "2", cpc: "0.3" } },
  { slug: "youtube-earnings-calculator", form: { views: "500000", rpm: "3" } },
  { slug: "conversion-rate-calculator", form: { conversions: "50", visitors: "1000" } },
  { slug: "cpc-calculator", form: { spend: "200", clicks: "400" } },
  { slug: "affiliate-earnings-calculator", form: { clicks: "2000", conv: "3", commission: "25" } },
  { slug: "crypto-tax-calculator", form: { gain: "10000", taxRate: "15" } },
  { slug: "net-worth-calculator", form: { cash: "20000", investments: "30000", realEstate: "250000", retirement: "50000", otherAssets: "10000", creditCards: "4000", loans: "12000", mortgage: "180000", otherDebts: "2500" } },
  { slug: "debt-payoff-calculator-snowball", form: { totalDebt: "18000", avgApr: "18", monthlyPayment: "700", smallestDebt: "900" } },
  { slug: "debt-payoff-calculator-avalanche", form: { totalDebt: "18000", avgApr: "18", monthlyPayment: "700", highestAprDebt: "5000" } },
  { slug: "credit-card-interest-calculator", form: { balance: "4200", apr: "24", monthlyPayment: "180" } },
  { slug: "credit-utilization-calculator", form: { totalBalance: "2600", totalLimit: "12000", cardBalance: "900", cardLimit: "2000" } },
  { slug: "early-loan-payoff-calculator", form: { principal: "25000", apr: "7.5", remainingMonths: "60", extraPayment: "100" } },
  { slug: "refinance-calculator-mortgage", form: { currentBalance: "320000", currentRate: "7", newRate: "6", remainingYears: "25", closingCosts: "6000" } },
  { slug: "emergency-fund-calculator", form: { monthlyExpenses: "3000", monthsCoverage: "6", currentSavings: "5000", monthlyContribution: "500" } },
  { slug: "savings-interest-calculator-usa", form: { initialDeposit: "5000", monthlyDeposit: "300", apy: "4.5", years: "5" } },
  { slug: "paycheck-calculator-usa", form: { annualSalary: "85000", federalTaxRate: "14", stateTaxRate: "5", otherDeductions: "4", payFrequency: "26" } },
  { slug: "hourly-to-salary-converter-usa", form: { hourlyRate: "25", hoursPerWeek: "40", weeksPerYear: "52" } },
  { slug: "paycheck-calculator-california", form: { annualSalary: "95000", federalTaxRate: "14", stateTaxRate: "6", otherDeductions: "4", payFrequency: "26" } },
  { slug: "paycheck-calculator-texas", form: { annualSalary: "95000", federalTaxRate: "14", otherDeductions: "4", payFrequency: "26" } },
  { slug: "salary-to-hourly-converter-usa", form: { annualSalary: "78000", hoursPerWeek: "40", weeksPerYear: "52" } },
  { slug: "overtime-pay-calculator-usa", form: { hourlyRate: "24", regularHours: "40", overtimeHours: "8", overtimeMultiplier: "1.5" } },
  { slug: "car-loan-affordability-calculator", form: { monthlyBudget: "550", apr: "7.9", termMonths: "60", downPayment: "5000" } },
  { slug: "mortgage-affordability-calculator-usa", form: { monthlyIncome: "9000", monthlyDebt: "900", dti: "36", apr: "6.5", termYears: "30", downPayment: "40000" } },
  { slug: "rent-vs-buy-calculator-usa", form: { monthlyRent: "2200", monthlyBuyCost: "2800", years: "7", annualRentIncrease: "4" } },
  { slug: "rental-yield-calculator-uk", form: { monthlyRent: "1450", propertyPrice: "320000", annualCosts: "3600" } },
  { slug: "gas-cost-calculator-road-trip", form: { distance: "680", mpg: "29", fuelPrice: "3.75", roundTrip: "yes" } },
  { slug: "salary-after-tax-calculator-california", form: { annualSalary: "100000", federalTaxRate: "14", stateTaxRate: "6", otherDeductions: "4" } },
  { slug: "salary-after-tax-calculator-texas", form: { annualSalary: "100000", federalTaxRate: "14", otherDeductions: "4" } },
  { slug: "salary-after-tax-calculator-new-york", form: { annualSalary: "100000", federalTaxRate: "14", stateTaxRate: "6", localTaxRate: "3", otherDeductions: "4" } },
  { slug: "salary-after-tax-calculator-florida", form: { annualSalary: "100000", federalTaxRate: "14", otherDeductions: "4" } },
  { slug: "salary-after-tax-calculator-uk", form: { annualSalary: "60000", incomeTaxRate: "20", niRate: "8", pensionRate: "5" } },
  { slug: "roi-calculator-marketing", form: { gain: "48000", cost: "20000" } },
  { slug: "cac-calculator-saas", form: { salesMarketing: "120000", customers: "240" } },
  { slug: "ltv-calculator-saas", form: { arpu: "120", grossMargin: "80", churn: "3" } },
  { slug: "break-even-calculator-business", form: { fixed: "50000", price: "120", variable: "45" } },
  { slug: "profit-margin-calculator-business", form: { revenue: "250000", cost: "175000" } },
  { slug: "ai-email-subject-line-generator", form: { topic: "Q3 launch", audience: "ecommerce founders", tone: "professional" } },
  { slug: "ai-cold-email-generator", form: { offer: "SEO audit", audience: "SaaS marketing teams", cta: "15-minute call", tone: "consultative" } },
  { slug: "ai-linkedin-post-generator", form: { topic: "reducing churn", audience: "B2B founders", goal: "book demos", tone: "practical" } },
  { slug: "ai-resume-summary-generator", form: { role: "Product Manager", experience: "7", skills: "roadmaps, analytics", achievement: "improved activation by 32%" } },
  { slug: "ai-product-description-generator", form: { product: "OrbitDesk Pro", audience: "remote teams", features: "AI notes, sync, dashboards", tone: "premium" } },
  { slug: "api-response-formatter", form: { response: '{"status":"ok","data":{"items":[1,2,3]}}' } },
  { slug: "moving-cost-calculator-usa", form: { distanceMiles: "120", homeSizeRooms: "3", laborHours: "6", hourlyRate: "85", truckCost: "450", packingSupplies: "120" } },
  { slug: "electricity-cost-calculator-usa", form: { watts: "1500", hoursPerDay: "4", daysPerMonth: "30", ratePerKwh: "0.18" } },
  { slug: "internet-speed-requirement-calculator", form: { users: "4", streamingDevices: "2", videoCallUsers: "2", gamingDevices: "1", bufferPercent: "25" } },
  { slug: "budget-planner-monthly-usa", form: { monthlyIncome: "6500", fixedExpenses: "2600", variableExpenses: "1400", debtPayments: "700", savingsGoal: "800" } },
  { slug: "daily-calorie-calculator", form: { age: "30", weightKg: "78", heightCm: "178", sex: "male", activity: "1.55" } },
  { slug: "investment-portfolio-calculator", form: { initial: "15000", final: "18000" } },
  { slug: "retirement-calculator", form: { current: "50000", monthly: "500", rate: "8", years: "20" } },
  { slug: "inflation-calculator", form: { amount: "100", rate: "6", years: "10" } },
  { slug: "accident-compensation-calculator", form: { medical: "5000", incomeLoss: "3000", pain: "1.5" } },
  { slug: "settlement-calculator", form: { claim: "50000", feeRate: "30" } },
  { slug: "legal-fee-estimator", form: { hourly: "200", hours: "12" } },
  { slug: "tiktok-earnings-calculator", form: { views: "100000", cpm: "1.2" } },
  { slug: "instagram-engagement-calculator", form: { likes: "500", comments: "80", followers: "10000" } },
  { slug: "business-name-generator", form: { keyword: "orbit" } },
  { slug: "username-generator", form: { seed: "imtiaz" } },
  { slug: "random-name-generator", form: { count: "5" } },
  { slug: "startup-name-generator", form: { keyword: "fintech" } },
  { slug: "brand-name-generator-ai", form: { keyword: "skincare", style: "premium" } },
  { slug: "time-zone-converter", form: { time: "14:30", fromOffset: "-5", toOffset: "1" } },
  { slug: "date-difference-calculator", form: { startDate: "2026-01-01", endDate: "2026-01-31" } },
  { slug: "age-calculator", form: { birthDate: "1995-08-15", asOfDate: "2026-04-09" } },
  { slug: "unit-price-calculator", form: { totalPrice: "12", quantity: "3" } },
  { slug: "discount-calculator", form: { originalPrice: "100", discountPercent: "20", taxPercent: "10" } },
  { slug: "json-validator", form: { json: '{"valid": true}' } },
  { slug: "base64-encoder-decoder", form: { text: "hello", mode: "encode" } },
  { slug: "url-encoder-decoder", form: { text: "hello world", mode: "encode" } },
  { slug: "regex-tester", form: { pattern: "o", text: "orbital", flags: "g" } },
  { slug: "markup-calculator", form: { unitCost: "40", markupPercent: "50" } },
  { slug: "sales-commission-calculator", form: { grossSales: "10000", commissionRate: "7.5" } },
  { slug: "burn-rate-runway-calculator", form: { cashBalance: "540000", monthlyBurn: "90000" } },
  { slug: "stacked-discount-calculator", form: { listPrice: "200", firstDiscountPercent: "25", secondDiscountPercent: "10" } },
  { slug: "revenue-per-employee-calculator", form: { annualRevenue: "18000000", employeeCount: "42" } },
  { slug: "mulch-volume-calculator", form: { bedAreaSqFt: "400", depthInches: "3" } },
  { slug: "concrete-slab-volume-calculator", form: { slabLengthFt: "12", slabWidthFt: "16", slabThicknessIn: "4" } },
  { slug: "floor-tile-quantity-calculator", form: { roomLengthFt: "10", roomWidthFt: "12", tileSizeInches: "12", wastePercent: "10" } },
  { slug: "lawn-fertilizer-bags-calculator", form: { lawnSqFt: "8000", bagCoverageSqFt: "5000" } },
  { slug: "wallpaper-roll-calculator", form: { wallAreaSqFt: "180", rollCoverageSqFt: "56" } },
];

describe("computeTool valid cases", () => {
  it("returns non-error results for all supported non-PDF tools", () => {
    for (const testCase of validCases) {
      const result = computeTool(testCase.slug, testCase.form);
      expect(result.error).not.toBe(true);
      expect(result.value).toBeTruthy();
    }
  });

  it("uses accurate baseline formulas for key finance tools", () => {
    const loan = computeTool("loan-calculator", { principal: "100000", rate: "12", years: "1" });
    expect(loan.value).toMatch(/^\$\d+\.\d{2}$/);

    const roi = computeTool("roi-calculator", { gain: "200", cost: "1000" });
    expect(roi.value).toBe("20.00%");

    const cpc = computeTool("cpc-calculator", { spend: "120", clicks: "30" });
    expect(cpc.value).toBe("$4.00");

    const inflation = computeTool("inflation-calculator", { amount: "100", rate: "10", years: "1" });
    expect(inflation.value).toBe("$110.00");

    const utilization = computeTool("credit-utilization-calculator", {
      totalBalance: "3000",
      totalLimit: "10000",
      cardBalance: "500",
      cardLimit: "2000",
    });
    expect(utilization.value).toBe("30.00%");

    const hourly = computeTool("hourly-to-salary-converter-usa", {
      hourlyRate: "25",
      hoursPerWeek: "40",
      weeksPerYear: "52",
    });
    expect(hourly.value).toBe("$52000.00");

    const salaryToHourly = computeTool("salary-to-hourly-converter-usa", {
      annualSalary: "52000",
      hoursPerWeek: "40",
      weeksPerYear: "52",
    });
    expect(salaryToHourly.value).toBe("$25.00");

    const gas = computeTool("gas-cost-calculator-road-trip", {
      distance: "290",
      mpg: "29",
      fuelPrice: "3.50",
      roundTrip: "no",
    });
    expect(gas.value).toBe("$35.00");

    const salaryTexas = computeTool("salary-after-tax-calculator-texas", {
      annualSalary: "100000",
      federalTaxRate: "10",
      otherDeductions: "5",
    });
    expect(salaryTexas.value).toBe("$85000.00");

    const marketingRoi = computeTool("roi-calculator-marketing", {
      gain: "200",
      cost: "1000",
    });
    expect(marketingRoi.value).toBe("20.00%");

    const aiSubject = computeTool("ai-email-subject-line-generator", {
      topic: "Q3 launch",
      audience: "ecommerce founders",
      tone: "professional",
    });
    expect(aiSubject.value.toLowerCase()).toContain("q3 launch");
    expect(aiSubject.value.toLowerCase()).toContain("ecommerce founders");

    const aiResume = computeTool("ai-resume-summary-generator", {
      role: "Product Manager",
      experience: "7",
      skills: "roadmaps, analytics",
      achievement: "improved activation by 32%",
    });
    expect(aiResume.value).toContain("Product Manager");
    expect(aiResume.value).toContain("improved activation by 32%");

    const apiFormatted = computeTool("api-response-formatter", {
      response: '{"status":"ok","data":{"items":[1,2]}}',
    });
    expect(apiFormatted.value).toContain('\n  "status": "ok"');
    expect(apiFormatted.extra?.[0]).toContain("Top-level keys");

    const base64Decoded = computeTool("base64-encoder-decoder", {
      text: "aGVsbG8=",
      mode: "decode",
    });
    expect(base64Decoded.value).toBe("hello");

    const urlEncoded = computeTool("url-encoder-decoder", {
      text: "hello world",
      mode: "encode",
    });
    expect(urlEncoded.value).toBe("hello%20world");

    const electricity = computeTool("electricity-cost-calculator-usa", {
      watts: "1000",
      hoursPerDay: "1",
      daysPerMonth: "30",
      ratePerKwh: "0.1",
    });
    expect(electricity.value).toBe("$3.00");

    const budget = computeTool("budget-planner-monthly-usa", {
      monthlyIncome: "5000",
      fixedExpenses: "2000",
      variableExpenses: "1000",
      debtPayments: "500",
      savingsGoal: "500",
    });
    expect(budget.value).toBe("$1000.00");

    const businessNames = computeTool("business-name-generator", { keyword: "orbit" });
    expect((businessNames.extra?.length ?? 0) + 1).toBeGreaterThanOrEqual(5);
    expect((businessNames.extra?.length ?? 0) + 1).toBeLessThanOrEqual(10);

    const usernames = computeTool("username-generator", { seed: "imtiaz" });
    expect((usernames.extra?.length ?? 0) + 1).toBeGreaterThanOrEqual(5);
    expect((usernames.extra?.length ?? 0) + 1).toBeLessThanOrEqual(10);

    const randomNames = computeTool("random-name-generator", { count: "8" });
    expect((randomNames.extra?.length ?? 0) + 1).toBeGreaterThanOrEqual(5);
    expect((randomNames.extra?.length ?? 0) + 1).toBeLessThanOrEqual(10);

    const startupNames = computeTool("startup-name-generator", { keyword: "fintech" });
    expect((startupNames.extra?.length ?? 0) + 1).toBeGreaterThanOrEqual(5);
    expect((startupNames.extra?.length ?? 0) + 1).toBeLessThanOrEqual(10);

    const brandNames = computeTool("brand-name-generator-ai", { keyword: "skincare", style: "premium" });
    expect((brandNames.extra?.length ?? 0) + 1).toBeGreaterThanOrEqual(5);
    expect((brandNames.extra?.length ?? 0) + 1).toBeLessThanOrEqual(10);

    const tz = computeTool("time-zone-converter", { time: "14:30", fromOffset: "-5", toOffset: "1" });
    expect(tz.value).toBe("20:30");

    const dd = computeTool("date-difference-calculator", { startDate: "2026-01-01", endDate: "2026-01-31" });
    expect(dd.value).toBe("30 day(s)");

    const unit = computeTool("unit-price-calculator", { totalPrice: "12", quantity: "3" });
    expect(unit.value).toBe("$4.00");

    const discount = computeTool("discount-calculator", { originalPrice: "100", discountPercent: "20", taxPercent: "10" });
    expect(discount.value).toBe("$88.00");
  });
});

describe("computeTool invalid input handling", () => {
  it("rejects empty required numeric inputs", () => {
    const result = computeTool("loan-calculator", { principal: "", rate: "", years: "" });
    expect(result.error).toBe(true);
  });

  it("rejects invalid JSON", () => {
    const result = computeTool("json-validator", { json: "{ bad json" });
    expect(result.error).toBe(true);
  });

  it("rejects invalid URL decode input", () => {
    const result = computeTool("url-encoder-decoder", { text: "%E0%A4%A", mode: "decode" });
    expect(result.error).toBe(true);
  });

  it("rejects impossible conversion constraints", () => {
    const result = computeTool("conversion-rate-calculator", { conversions: "10", visitors: "0" });
    expect(result.error).toBe(true);
  });
});
