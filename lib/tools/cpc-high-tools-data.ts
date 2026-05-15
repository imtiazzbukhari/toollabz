/** Reference-style constants for high-CPC estimator tools - illustrative only, not insurer/legal advice. */

export const US_STATE_OPTIONS = [
  { label: "AL", value: "AL" }, { label: "AK", value: "AK" }, { label: "AZ", value: "AZ" }, { label: "AR", value: "AR" },
  { label: "CA", value: "CA" }, { label: "CO", value: "CO" }, { label: "CT", value: "CT" }, { label: "DE", value: "DE" },
  { label: "FL", value: "FL" }, { label: "GA", value: "GA" }, { label: "HI", value: "HI" }, { label: "ID", value: "ID" },
  { label: "IL", value: "IL" }, { label: "IN", value: "IN" }, { label: "IA", value: "IA" }, { label: "KS", value: "KS" },
  { label: "KY", value: "KY" }, { label: "LA", value: "LA" }, { label: "ME", value: "ME" }, { label: "MD", value: "MD" },
  { label: "MA", value: "MA" }, { label: "MI", value: "MI" }, { label: "MN", value: "MN" }, { label: "MS", value: "MS" },
  { label: "MO", value: "MO" }, { label: "MT", value: "MT" }, { label: "NE", value: "NE" }, { label: "NV", value: "NV" },
  { label: "NH", value: "NH" }, { label: "NJ", value: "NJ" }, { label: "NM", value: "NM" }, { label: "NY", value: "NY" },
  { label: "NC", value: "NC" }, { label: "ND", value: "ND" }, { label: "OH", value: "OH" }, { label: "OK", value: "OK" },
  { label: "OR", value: "OR" }, { label: "PA", value: "PA" }, { label: "RI", value: "RI" }, { label: "SC", value: "SC" },
  { label: "SD", value: "SD" }, { label: "TN", value: "TN" }, { label: "TX", value: "TX" }, { label: "UT", value: "UT" },
  { label: "VT", value: "VT" }, { label: "VA", value: "VA" }, { label: "WA", value: "WA" }, { label: "WV", value: "WV" },
  { label: "WI", value: "WI" }, { label: "WY", value: "WY" }, { label: "DC", value: "DC" },
] as const;

export const AUTO_INSURANCE_STATE_BASE_MONTHLY: Record<string, number> = {
  AL: 142, AK: 148, AZ: 168, AR: 162, CA: 185, CO: 172, CT: 178, DE: 188, FL: 210, GA: 168,
  HI: 152, ID: 128, IL: 158, IN: 132, IA: 122, KS: 138, KY: 168, LA: 232, ME: 118, MD: 172,
  MA: 165, MI: 225, MN: 148, MS: 158, MO: 152, MT: 138, NE: 142, NV: 192, NH: 125, NJ: 188,
  NM: 152, NY: 195, NC: 118, ND: 118, OH: 125, OK: 168, OR: 142, PA: 162, RI: 185, SC: 158,
  SD: 132, TN: 148, TX: 155, UT: 138, VT: 122, VA: 132, WA: 138, WV: 158, WI: 132, WY: 128,
  DC: 175,
};

/** Approximate total DUI-related cost band midpoints (USD) for first offense - varies by case. */
export const DUI_STATE_COST_MIDPOINT: Record<string, number> = {
  AL: 12000, AK: 14000, AZ: 15000, AR: 11000, CA: 18000, CO: 13000, CT: 14000, DE: 12000,
  FL: 15000, GA: 12500, HI: 13000, ID: 10000, IL: 16000, IN: 11000, IA: 10500, KS: 11000,
  KY: 13000, LA: 14000, ME: 11000, MD: 14000, MA: 15000, MI: 13500, MN: 12000, MS: 10000,
  MO: 11500, MT: 11500, NE: 11000, NV: 14500, NH: 12500, NJ: 15500, NM: 12000, NY: 16000,
  NC: 12000, ND: 9500, OH: 12500, OK: 11500, OR: 12500, PA: 13500, RI: 13000, SC: 11500,
  SD: 10000, TN: 12500, TX: 14000, UT: 11500, VT: 12000, VA: 13000, WA: 13500, WV: 11000,
  WI: 12500, WY: 10500, DC: 15000,
};

/** 2025 FPL annual (approximate) for household size 1–8 - used for subsidy eligibility math. */
export const FPL_2025_ANNUAL: Record<number, number> = {
  1: 15060, 2: 20440, 3: 25820, 4: 31200, 5: 36580, 6: 41960, 7: 47340, 8: 52720,
};

/** Monthly benchmark Silver premium anchor by state (USD) - simplified modeling input. */
export const ACA_SILVER_BENCHMARK_MONTHLY: Record<string, number> = {
  AL: 520, AK: 720, AZ: 480, AR: 450, CA: 410, CO: 395, CT: 540, DE: 505, FL: 490, GA: 455,
  HI: 510, ID: 425, IL: 465, IN: 430, IA: 445, KS: 455, KY: 465, LA: 520, ME: 495, MD: 445,
  MA: 425, MN: 385, MS: 505, MO: 455, MT: 520, NE: 540, NV: 455, NH: 455, NJ: 520, NM: 430,
  NY: 580, NC: 560, ND: 515, OH: 440, OK: 505, OR: 415, PA: 495, RI: 455, SC: 520, SD: 595,
  TN: 455, TX: 455, UT: 405, VT: 640, VA: 455, WA: 395, WV: 720, WI: 545, WY: 720, DC: 420,
};

/** 2025 VA monthly compensation - veteran alone, no dependents (USD). */
export const VA_COMPENSATION_2025_MONTHLY: Record<number, number> = {
  10: 175.51, 20: 346.95, 30: 537.42, 40: 774.01, 50: 1102.04, 60: 1395.93, 70: 1759.19,
  80: 2044.89, 90: 2297.96, 100: 3794.59,
};

/** Workers' comp illustrative max TTD weekly caps (USD, rounded) - varies by year; not legal advice. */
export const WORKERS_COMP_TTD_WEEKLY_CAP: Record<string, number> = {
  AL: 1063, AK: 1280, AZ: 1085, AR: 920, CA: 1356, CO: 1217, CT: 1500, DE: 864, FL: 1155, GA: 800,
  HI: 1163, ID: 915, IL: 1720, IN: 1170, IA: 1063, KS: 1048, KY: 1156, LA: 786, ME: 1047, MD: 1200,
  MA: 1720, MI: 1085, MN: 1365, MS: 582, MO: 1216, MT: 1035, NE: 1039, NV: 1132, NH: 1719, NJ: 1063,
  NM: 917, NY: 1200, NC: 1162, ND: 1155, OH: 1085, OK: 953, OR: 1683, PA: 1200, RI: 1216, SC: 1003,
  SD: 1015, TN: 1216, TX: 1125, UT: 923, VT: 1155, VA: 1216, WA: 1683, WV: 963, WI: 1162, WY: 1035,
  DC: 1719,
};
