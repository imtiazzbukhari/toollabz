/**
 * Published UK rates used by the stamp-duty and take-home calculators.
 * Last reviewed: 2026-09-06 against the official pages listed below.
 * Do not invent bands. If a Budget changes a figure, update this file and the tests together.
 */

export const UK_RATES_TAX_YEAR = "2026 to 2027";
export const UK_RATES_LAST_REVIEWED = "2026-09-06";

export const UK_RATE_SOURCES = {
  payeEmployers:
    "https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027",
  incomeTaxRates: "https://www.gov.uk/income-tax-rates",
  scottishIncomeTax: "https://www.gov.uk/scottish-income-tax",
  sdltResidential: "https://www.gov.uk/stamp-duty-land-tax/residential-property-rates",
  lbttBudget: "https://www.gov.scot/publications/scottish-budget-2026-2027/pages/4/",
  lttRates: "https://www.gov.wales/land-transaction-tax-rates-and-bands",
  hmrcSdltCalculator: "https://www.tax.service.gov.uk/calculate-stamp-duty-land-tax/#/intro",
} as const;

export const PERSONAL_ALLOWANCE = 12_570;
export const PERSONAL_ALLOWANCE_TAPER_START = 100_000;
export const ADDITIONAL_RATE_INCOME_THRESHOLD = 125_140;

/** Basic-rate band width after Personal Allowance (England, Northern Ireland, Wales). */
export const RUK_BASIC_RATE_WIDTH = 37_700;
export const RUK_BASIC_RATE = 0.2;
export const RUK_HIGHER_RATE = 0.4;
export const RUK_ADDITIONAL_RATE = 0.45;

/**
 * Scottish taxable-income widths from HMRC employer tables, aligned to
 * https://www.gov.uk/scottish-income-tax income-inclusive bands at a £12,570 allowance.
 */
export const SCOTLAND_TAX_SLICES = [
  { width: 3_967, rate: 0.19, label: "Starter" },
  { width: 12_989, rate: 0.2, label: "Basic" },
  { width: 14_136, rate: 0.21, label: "Intermediate" },
  { width: 31_338, rate: 0.42, label: "Higher" },
] as const;
export const SCOTLAND_ADVANCED_RATE = 0.45;
export const SCOTLAND_TOP_RATE = 0.48;

export const NI_PRIMARY_THRESHOLD = 12_570;
export const NI_UPPER_EARNINGS_LIMIT = 50_270;
export const NI_EMPLOYEE_MAIN_RATE = 0.08;
export const NI_EMPLOYEE_UPPER_RATE = 0.02;
export const NI_EMPLOYER_SECONDARY_THRESHOLD = 5_000;
export const NI_EMPLOYER_RATE = 0.15;

export const STUDENT_LOAN = {
  plan1: { threshold: 26_900, rate: 0.09 },
  plan2: { threshold: 29_385, rate: 0.09 },
  plan4: { threshold: 33_795, rate: 0.09 },
  plan5: { threshold: 25_000, rate: 0.09 },
  postgraduate: { threshold: 21_000, rate: 0.06 },
} as const;

export type StampDutyBand = { upTo: number; rate: number };

export const SDLT_STANDARD_BANDS: StampDutyBand[] = [
  { upTo: 125_000, rate: 0 },
  { upTo: 250_000, rate: 0.02 },
  { upTo: 925_000, rate: 0.05 },
  { upTo: 1_500_000, rate: 0.1 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.12 },
];

export const SDLT_FTB_CAP = 500_000;
export const SDLT_FTB_NIL = 300_000;
export const SDLT_FTB_UPPER_RATE = 0.05;
export const SDLT_ADDITIONAL_SURCHARGE = 0.05;
export const SDLT_ADDITIONAL_MIN_PRICE = 40_000;
export const SDLT_NON_RESIDENT_SURCHARGE = 0.02;

export const LBTT_STANDARD_BANDS: StampDutyBand[] = [
  { upTo: 145_000, rate: 0 },
  { upTo: 250_000, rate: 0.02 },
  { upTo: 325_000, rate: 0.05 },
  { upTo: 750_000, rate: 0.1 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.12 },
];
export const LBTT_FTB_NIL = 175_000;
export const LBTT_ADS_RATE = 0.08;
export const LBTT_ADS_MIN_PRICE = 40_000;

export const LTT_MAIN_BANDS: StampDutyBand[] = [
  { upTo: 225_000, rate: 0 },
  { upTo: 400_000, rate: 0.06 },
  { upTo: 750_000, rate: 0.075 },
  { upTo: 1_500_000, rate: 0.1 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.12 },
];

export const LTT_HIGHER_BANDS: StampDutyBand[] = [
  { upTo: 180_000, rate: 0.05 },
  { upTo: 250_000, rate: 0.085 },
  { upTo: 400_000, rate: 0.1 },
  { upTo: 750_000, rate: 0.125 },
  { upTo: 1_500_000, rate: 0.15 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.17 },
];
