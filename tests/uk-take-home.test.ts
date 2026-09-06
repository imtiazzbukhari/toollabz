import { describe, expect, it } from "vitest";
import {
  computeUkTakeHome,
  employeeNationalInsurance,
  incomeTaxRestOfUk,
  personalAllowanceForIncome,
  studentLoanRepayment,
} from "../lib/tools/uk-finance/take-home";
import { computeTool } from "../lib/tools/engine";
import { tools } from "../lib/tools/data";
import { LOCALIZED_TOOL_SLUGS } from "../lib/i18n/catalog";

function roundPence(value: number): number {
  return Math.round(value * 100) / 100;
}

describe("UK take-home PAYE 2026/27", () => {
  it("tapers Personal Allowance to zero at £125,140", () => {
    expect(personalAllowanceForIncome(100_000)).toBe(12_570);
    expect(personalAllowanceForIncome(110_000)).toBe(7_570);
    expect(personalAllowanceForIncome(125_140)).toBe(0);
  });

  it("matches the £60,000 England worked example", () => {
    const result = computeUkTakeHome({
      annualSalary: 60_000,
      region: "england_ni",
      pensionPercent: 0,
      salarySacrificePercent: 0,
      studentLoan: "none",
    });
    expect(roundPence(result.incomeTax)).toBe(11_432);
    expect(roundPence(result.employeeNi)).toBe(3_210.6);
    expect(roundPence(result.net)).toBe(45_357.4);
    expect(roundPence(result.monthlyNet)).toBe(roundPence(45_357.4 / 12));
    expect(roundPence(result.weeklyNet)).toBe(roundPence(45_357.4 / 52));
  });

  it("uses the same Income Tax bands for Wales as for England", () => {
    const england = computeUkTakeHome({
      annualSalary: 60_000,
      region: "england_ni",
      pensionPercent: 0,
      salarySacrificePercent: 0,
      studentLoan: "none",
    });
    const wales = computeUkTakeHome({
      annualSalary: 60_000,
      region: "wales",
      pensionPercent: 0,
      salarySacrificePercent: 0,
      studentLoan: "none",
    });
    expect(wales.incomeTax).toBe(england.incomeTax);
  });

  it("charges more Income Tax in Scotland on £60,000 than in England", () => {
    const england = computeUkTakeHome({
      annualSalary: 60_000,
      region: "england_ni",
      pensionPercent: 0,
      salarySacrificePercent: 0,
      studentLoan: "none",
    });
    const scotland = computeUkTakeHome({
      annualSalary: 60_000,
      region: "scotland",
      pensionPercent: 0,
      salarySacrificePercent: 0,
      studentLoan: "none",
    });
    expect(scotland.incomeTax).toBeGreaterThan(england.incomeTax);
    expect(scotland.employeeNi).toBe(england.employeeNi);
  });

  it("treats salary sacrifice as reducing both tax and NI", () => {
    const base = computeUkTakeHome({
      annualSalary: 60_000,
      region: "england_ni",
      pensionPercent: 0,
      salarySacrificePercent: 0,
      studentLoan: "none",
    });
    const sacrifice = computeUkTakeHome({
      annualSalary: 60_000,
      region: "england_ni",
      pensionPercent: 0,
      salarySacrificePercent: 5,
      studentLoan: "none",
    });
    expect(sacrifice.incomeTax).toBeLessThan(base.incomeTax);
    expect(sacrifice.employeeNi).toBeLessThan(base.employeeNi);
  });

  it("treats employee pension as reducing tax but not NI", () => {
    const base = computeUkTakeHome({
      annualSalary: 60_000,
      region: "england_ni",
      pensionPercent: 0,
      salarySacrificePercent: 0,
      studentLoan: "none",
    });
    const pension = computeUkTakeHome({
      annualSalary: 60_000,
      region: "england_ni",
      pensionPercent: 5,
      salarySacrificePercent: 0,
      studentLoan: "none",
    });
    expect(pension.incomeTax).toBeLessThan(base.incomeTax);
    expect(pension.employeeNi).toBe(base.employeeNi);
    expect(pension.pension).toBe(3_000);
  });

  it("applies Plan 2 student loan above £29,385", () => {
    expect(studentLoanRepayment(29_385, "plan2")).toBe(0);
    expect(roundPence(studentLoanRepayment(39_385, "plan2"))).toBe(900);
  });

  it("shows employer NI at 15% above £5,000", () => {
    const result = computeUkTakeHome({
      annualSalary: 35_000,
      region: "england_ni",
      pensionPercent: 0,
      salarySacrificePercent: 0,
      studentLoan: "none",
    });
    expect(result.employerNi).toBe(4_500);
    expect(result.employerCost).toBe(39_500);
  });

  it("does not charge employee NI at the primary threshold", () => {
    expect(employeeNationalInsurance(12_570)).toBe(0);
    expect(roundPence(employeeNationalInsurance(13_570))).toBe(80);
  });

  it("keeps additional-rate Income Tax starting at £125,140 of income", () => {
    const atThreshold = incomeTaxRestOfUk(125_140, 0);
    const above = incomeTaxRestOfUk(126_140, 0);
    expect(roundPence(above - atThreshold)).toBe(450);
  });

  it("upgrades the existing UK salary slug instead of adding a twin", () => {
    const ukSalary = tools.filter((item) => item.slug.includes("salary-after-tax") && item.slug.includes("uk"));
    expect(ukSalary.map((item) => item.slug)).toEqual(["salary-after-tax-calculator-uk"]);
    expect(LOCALIZED_TOOL_SLUGS).not.toContain("salary-after-tax-calculator-uk");
    expect(LOCALIZED_TOOL_SLUGS).not.toContain("stamp-duty-calculator-uk");
    const result = computeTool("salary-after-tax-calculator-uk", {
      annualSalary: "60000",
      region: "england_ni",
      pensionPercent: "0",
      salarySacrificePercent: "0",
      studentLoan: "none",
    });
    expect(result.error).toBeFalsy();
    expect(result.value).toBe("£45,357.40");
  });
});
