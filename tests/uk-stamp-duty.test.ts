import { describe, expect, it } from "vitest";
import { computeStampDuty, computeUkStampDutyFromForm, taxOnBands } from "../lib/tools/uk-finance/stamp-duty";
import { SDLT_STANDARD_BANDS } from "../lib/tools/uk-finance/published-rates-2026-27";
import { computeTool } from "../lib/tools/engine";
import { tools } from "../lib/tools/data";

describe("UK stamp duty", () => {
  it("matches the GOV.UK £295,000 standard SDLT example (£4,750)", () => {
    const result = computeStampDuty({
      region: "england_ni",
      buyerType: "standard",
      propertyPrice: 295_000,
      deposit: 0,
      nonUkResident: false,
    });
    expect(result.totalTax).toBe(4_750);
  });

  it("matches the GOV.UK first-time buyer £500,000 example (£10,000)", () => {
    const result = computeStampDuty({
      region: "england_ni",
      buyerType: "first_time",
      propertyPrice: 500_000,
      deposit: 0,
      nonUkResident: false,
    });
    expect(result.totalTax).toBe(10_000);
  });

  it("withdraws first-time buyer relief above £500,000", () => {
    const ftb = computeStampDuty({
      region: "england_ni",
      buyerType: "first_time",
      propertyPrice: 500_001,
      deposit: 0,
      nonUkResident: false,
    });
    const standard = computeStampDuty({
      region: "england_ni",
      buyerType: "standard",
      propertyPrice: 500_001,
      deposit: 0,
      nonUkResident: false,
    });
    expect(ftb.totalTax).toBe(standard.totalTax);
    expect(ftb.notes.some((note) => /withdrawn/i.test(note))).toBe(true);
  });

  it("adds 5% on each SDLT band for an additional £350,000 purchase", () => {
    const result = computeStampDuty({
      region: "england_ni",
      buyerType: "additional",
      propertyPrice: 350_000,
      deposit: 0,
      nonUkResident: false,
    });
    expect(result.totalTax).toBe(25_000);
  });

  it("adds the 2% non-resident surcharge on top of SDLT", () => {
    const result = computeStampDuty({
      region: "england_ni",
      buyerType: "standard",
      propertyPrice: 295_000,
      deposit: 0,
      nonUkResident: true,
    });
    expect(result.tax).toBe(4_750);
    expect(result.surcharge).toBe(5_900);
    expect(result.totalTax).toBe(10_650);
  });

  it("matches the GOV.WALES £280,000 main LTT example (£3,300)", () => {
    const result = computeStampDuty({
      region: "wales",
      buyerType: "standard",
      propertyPrice: 280_000,
      deposit: 0,
      nonUkResident: false,
    });
    expect(result.totalTax).toBe(3_300);
  });

  it("matches the GOV.WALES £260,000 higher-rate LTT example (£15,950)", () => {
    const result = computeStampDuty({
      region: "wales",
      buyerType: "additional",
      propertyPrice: 260_000,
      deposit: 0,
      nonUkResident: false,
    });
    expect(result.totalTax).toBe(15_950);
  });

  it("raises the Scottish nil-rate band to £175,000 for first-time buyers", () => {
    const standard = computeStampDuty({
      region: "scotland",
      buyerType: "standard",
      propertyPrice: 175_000,
      deposit: 0,
      nonUkResident: false,
    });
    const ftb = computeStampDuty({
      region: "scotland",
      buyerType: "first_time",
      propertyPrice: 175_000,
      deposit: 0,
      nonUkResident: false,
    });
    expect(standard.totalTax).toBe(600);
    expect(ftb.totalTax).toBe(0);
  });

  it("applies 8% ADS on a Scottish additional dwelling", () => {
    const result = computeStampDuty({
      region: "scotland",
      buyerType: "additional",
      propertyPrice: 200_000,
      deposit: 0,
      nonUkResident: false,
    });
    expect(result.tax).toBe(1_100);
    expect(result.surcharge).toBe(16_000);
    expect(result.totalTax).toBe(17_100);
  });

  it("adds deposit to cash required", () => {
    const result = computeStampDuty({
      region: "england_ni",
      buyerType: "standard",
      propertyPrice: 295_000,
      deposit: 29_500,
      nonUkResident: false,
    });
    expect(result.cashRequired).toBe(34_250);
  });

  it("does not invent tax on a zero-width slice", () => {
    expect(taxOnBands(0, SDLT_STANDARD_BANDS).tax).toBe(0);
  });

  it("is registered once and stays English-only", () => {
    const tool = tools.find((item) => item.slug === "stamp-duty-calculator-uk");
    expect(tool).toBeTruthy();
    expect(tools.filter((item) => item.slug.includes("stamp-duty")).map((item) => item.slug)).toEqual([
      "stamp-duty-calculator-uk",
    ]);
    const viaEngine = computeTool("stamp-duty-calculator-uk", {
      region: "england_ni",
      buyerType: "standard",
      propertyPrice: "295000",
      deposit: "0",
      nonUkResident: "no",
    });
    expect(viaEngine.error).toBeFalsy();
    expect(viaEngine.value).toBe("£4,750.00");
  });

  it("rejects a deposit larger than the price", () => {
    const result = computeUkStampDutyFromForm({
      region: "england_ni",
      buyerType: "standard",
      propertyPrice: "100000",
      deposit: "120000",
      nonUkResident: "no",
    });
    expect(result.error).toBe(true);
  });
});
