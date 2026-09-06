import {
  ADDITIONAL_RATE_INCOME_THRESHOLD,
  NI_EMPLOYEE_MAIN_RATE,
  NI_EMPLOYEE_UPPER_RATE,
  NI_EMPLOYER_RATE,
  NI_EMPLOYER_SECONDARY_THRESHOLD,
  NI_PRIMARY_THRESHOLD,
  NI_UPPER_EARNINGS_LIMIT,
  PERSONAL_ALLOWANCE,
  PERSONAL_ALLOWANCE_TAPER_START,
  RUK_ADDITIONAL_RATE,
  RUK_BASIC_RATE,
  RUK_BASIC_RATE_WIDTH,
  RUK_HIGHER_RATE,
  SCOTLAND_ADVANCED_RATE,
  SCOTLAND_TAX_SLICES,
  SCOTLAND_TOP_RATE,
  STUDENT_LOAN,
  UK_RATES_LAST_REVIEWED,
  UK_RATES_TAX_YEAR,
} from "./published-rates-2026-27";
import { gbp } from "./stamp-duty";

export type TakeHomeRegion = "england_ni" | "scotland" | "wales";
export type StudentLoanPlan = "none" | "plan1" | "plan2" | "plan4" | "plan5" | "plan2_pgl";

export type TakeHomeInput = {
  annualSalary: number;
  region: TakeHomeRegion;
  pensionPercent: number;
  salarySacrificePercent: number;
  studentLoan: StudentLoanPlan;
};

export type TakeHomeResult = {
  gross: number;
  salarySacrifice: number;
  pension: number;
  personalAllowance: number;
  taxablePay: number;
  incomeTax: number;
  employeeNi: number;
  studentLoan: number;
  net: number;
  monthlyNet: number;
  weeklyNet: number;
  employerNi: number;
  employerCost: number;
  notes: string[];
};

export function personalAllowanceForIncome(adjustedNetIncome: number): number {
  if (adjustedNetIncome <= PERSONAL_ALLOWANCE_TAPER_START) return PERSONAL_ALLOWANCE;
  const reduction = Math.floor((adjustedNetIncome - PERSONAL_ALLOWANCE_TAPER_START) / 2);
  return Math.max(0, PERSONAL_ALLOWANCE - reduction);
}

function sliceTax(amount: number, width: number, rate: number): { tax: number; remaining: number } {
  const used = Math.min(amount, Math.max(0, width));
  return { tax: used * rate, remaining: amount - used };
}

export function incomeTaxRestOfUk(taxable: number, personalAllowance: number): number {
  if (taxable <= 0) return 0;
  const basic = sliceTax(taxable, RUK_BASIC_RATE_WIDTH, RUK_BASIC_RATE);
  const additionalStartsAtTaxable = Math.max(0, ADDITIONAL_RATE_INCOME_THRESHOLD - personalAllowance);
  const higherWidth = Math.max(0, additionalStartsAtTaxable - RUK_BASIC_RATE_WIDTH);
  const higher = sliceTax(basic.remaining, higherWidth, RUK_HIGHER_RATE);
  return basic.tax + higher.tax + higher.remaining * RUK_ADDITIONAL_RATE;
}

export function incomeTaxScotland(taxable: number, personalAllowance: number): number {
  if (taxable <= 0) return 0;
  let remaining = taxable;
  let tax = 0;
  for (const slice of SCOTLAND_TAX_SLICES) {
    const part = sliceTax(remaining, slice.width, slice.rate);
    tax += part.tax;
    remaining = part.remaining;
  }
  const advancedWidth = Math.max(0, ADDITIONAL_RATE_INCOME_THRESHOLD - personalAllowance - (taxable - remaining));
  const advanced = sliceTax(remaining, advancedWidth, SCOTLAND_ADVANCED_RATE);
  return tax + advanced.tax + advanced.remaining * SCOTLAND_TOP_RATE;
}

export function employeeNationalInsurance(niablePay: number): number {
  if (niablePay <= NI_PRIMARY_THRESHOLD) return 0;
  const main = Math.min(niablePay, NI_UPPER_EARNINGS_LIMIT) - NI_PRIMARY_THRESHOLD;
  const upper = Math.max(0, niablePay - NI_UPPER_EARNINGS_LIMIT);
  return Math.max(0, main) * NI_EMPLOYEE_MAIN_RATE + upper * NI_EMPLOYEE_UPPER_RATE;
}

export function employerNationalInsurance(niablePay: number): number {
  if (niablePay <= NI_EMPLOYER_SECONDARY_THRESHOLD) return 0;
  return (niablePay - NI_EMPLOYER_SECONDARY_THRESHOLD) * NI_EMPLOYER_RATE;
}

export function studentLoanRepayment(earnings: number, plan: StudentLoanPlan): number {
  if (plan === "none") return 0;
  if (plan === "plan2_pgl") {
    const undergrad = Math.max(0, earnings - STUDENT_LOAN.plan2.threshold) * STUDENT_LOAN.plan2.rate;
    const pgl = Math.max(0, earnings - STUDENT_LOAN.postgraduate.threshold) * STUDENT_LOAN.postgraduate.rate;
    return undergrad + pgl;
  }
  const spec = STUDENT_LOAN[plan];
  return Math.max(0, earnings - spec.threshold) * spec.rate;
}

export function computeUkTakeHome(input: TakeHomeInput): TakeHomeResult {
  const gross = input.annualSalary;
  const salarySacrifice = gross * (input.salarySacrificePercent / 100);
  const pension = gross * (input.pensionPercent / 100);
  const payAfterSacrifice = gross - salarySacrifice;
  const taxBase = Math.max(0, payAfterSacrifice - pension);
  const niable = payAfterSacrifice;
  const allowance = personalAllowanceForIncome(taxBase);
  const taxable = Math.max(0, taxBase - allowance);
  const useScotland = input.region === "scotland";
  const incomeTax = useScotland ? incomeTaxScotland(taxable, allowance) : incomeTaxRestOfUk(taxable, allowance);
  const employeeNi = employeeNationalInsurance(niable);
  const loan = studentLoanRepayment(niable, input.studentLoan);
  const net = payAfterSacrifice - incomeTax - employeeNi - pension - loan;
  const employerNi = employerNationalInsurance(niable);

  const notes = [
    `Tax year ${UK_RATES_TAX_YEAR}. Rates reviewed ${UK_RATES_LAST_REVIEWED} from GOV.UK employer and Income Tax pages.`,
    useScotland
      ? "Scottish Income Tax bands applied to non-savings employment income."
      : "England, Northern Ireland and Wales use the same main Income Tax bands in this model.",
    "Pension % is treated as an employee contribution that reduces taxable pay (net-pay / relief style) but not National Insurance.",
    "Salary sacrifice reduces both taxable pay and National Insurance-able pay before other deductions.",
    "Assumes tax code 1257L, Category A NI, no benefits in kind, and no Marriage Allowance or Blind Person’s Allowance.",
    "Not a substitute for HMRC payroll software or a payslip.",
  ];

  return {
    gross,
    salarySacrifice,
    pension,
    personalAllowance: allowance,
    taxablePay: taxable,
    incomeTax,
    employeeNi,
    studentLoan: loan,
    net,
    monthlyNet: net / 12,
    weeklyNet: net / 52,
    employerNi,
    employerCost: gross + employerNi,
    notes,
  };
}

function parseRegion(value: string | undefined): TakeHomeRegion | null {
  if (value === "england_ni" || value === "scotland" || value === "wales") return value;
  return null;
}

function parseLoan(value: string | undefined): StudentLoanPlan | null {
  if (
    value === "none" ||
    value === "plan1" ||
    value === "plan2" ||
    value === "plan4" ||
    value === "plan5" ||
    value === "plan2_pgl"
  ) {
    return value;
  }
  return null;
}

export function computeUkTakeHomeFromForm(form: Record<string, string>): {
  title: string;
  value: string;
  extra?: string[];
  error?: boolean;
} {
  const annualSalary = Number(form.annualSalary);
  const pensionPercent = form.pensionPercent === undefined || form.pensionPercent === "" ? 0 : Number(form.pensionPercent);
  const salarySacrificePercent =
    form.salarySacrificePercent === undefined || form.salarySacrificePercent === "" ? 0 : Number(form.salarySacrificePercent);
  const region = parseRegion(form.region || "england_ni");
  const studentLoan = parseLoan(form.studentLoan || "none");

  if (!Number.isFinite(annualSalary) || annualSalary <= 0) {
    return { title: "Invalid Input", value: "Annual salary must be greater than zero.", error: true };
  }
  if (!region) return { title: "Invalid Input", value: "Choose England & Northern Ireland, Scotland, or Wales.", error: true };
  if (!studentLoan) return { title: "Invalid Input", value: "Choose a student loan option.", error: true };
  if (!Number.isFinite(pensionPercent) || pensionPercent < 0 || pensionPercent >= 100) {
    return { title: "Invalid Input", value: "Pension contribution must be between 0 and 100%.", error: true };
  }
  if (!Number.isFinite(salarySacrificePercent) || salarySacrificePercent < 0 || salarySacrificePercent >= 100) {
    return { title: "Invalid Input", value: "Salary sacrifice must be between 0 and 100%.", error: true };
  }
  if (pensionPercent + salarySacrificePercent >= 100) {
    return { title: "Invalid Input", value: "Pension plus salary sacrifice must stay below 100% of salary.", error: true };
  }

  const result = computeUkTakeHome({
    annualSalary,
    region,
    pensionPercent,
    salarySacrificePercent,
    studentLoan,
  });

  return {
    title: "Estimated take-home pay (annual)",
    value: gbp(result.net),
    extra: [
      `Monthly net: ${gbp(result.monthlyNet)}`,
      `Weekly net: ${gbp(result.weeklyNet)}`,
      `Income Tax: ${gbp(result.incomeTax)}`,
      `Employee National Insurance: ${gbp(result.employeeNi)}`,
      `Pension contribution: ${gbp(result.pension)}`,
      `Salary sacrifice: ${gbp(result.salarySacrifice)}`,
      `Student loan: ${gbp(result.studentLoan)}`,
      `Personal Allowance used: ${gbp(result.personalAllowance)}`,
      `Employer NI (Category A): ${gbp(result.employerNi)}`,
      `Estimated employer cost (gross + employer NI): ${gbp(result.employerCost)}`,
      ...result.notes,
    ],
  };
}
