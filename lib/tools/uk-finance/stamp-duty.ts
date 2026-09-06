import {
  LBTT_ADS_MIN_PRICE,
  LBTT_ADS_RATE,
  LBTT_FTB_NIL,
  LBTT_STANDARD_BANDS,
  LTT_HIGHER_BANDS,
  LTT_MAIN_BANDS,
  SDLT_ADDITIONAL_MIN_PRICE,
  SDLT_ADDITIONAL_SURCHARGE,
  SDLT_FTB_CAP,
  SDLT_FTB_NIL,
  SDLT_FTB_UPPER_RATE,
  SDLT_NON_RESIDENT_SURCHARGE,
  SDLT_STANDARD_BANDS,
  UK_RATES_LAST_REVIEWED,
  UK_RATES_TAX_YEAR,
  type StampDutyBand,
} from "./published-rates-2026-27";

export type StampDutyRegion = "england_ni" | "scotland" | "wales";
export type StampDutyBuyerType = "standard" | "first_time" | "additional";

export type StampDutyBreakdownRow = {
  sliceFrom: number;
  sliceTo: number;
  rate: number;
  tax: number;
};

export type StampDutyResult = {
  tax: number;
  surcharge: number;
  totalTax: number;
  cashRequired: number;
  deposit: number;
  effectiveRate: number;
  regime: string;
  notes: string[];
  rows: StampDutyBreakdownRow[];
};

export type StampDutyInput = {
  region: StampDutyRegion;
  buyerType: StampDutyBuyerType;
  propertyPrice: number;
  deposit: number;
  nonUkResident: boolean;
};

export function gbp(value: number): string {
  return `£${value.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function taxOnBands(price: number, bands: StampDutyBand[]): { tax: number; rows: StampDutyBreakdownRow[] } {
  const rows: StampDutyBreakdownRow[] = [];
  let tax = 0;
  let prev = 0;
  for (const band of bands) {
    if (price <= prev) break;
    const sliceTo = Math.min(price, band.upTo);
    const slice = sliceTo - prev;
    if (slice > 0) {
      const sliceTax = slice * band.rate;
      tax += sliceTax;
      rows.push({ sliceFrom: prev, sliceTo, rate: band.rate, tax: sliceTax });
    }
    prev = band.upTo;
  }
  return { tax, rows };
}

function withSurcharge(bands: StampDutyBand[], extra: number): StampDutyBand[] {
  return bands.map((band) => ({ ...band, rate: band.rate + extra }));
}

function sdltBands(buyerType: StampDutyBuyerType, price: number): { bands: StampDutyBand[]; notes: string[] } {
  const notes: string[] = [];
  if (buyerType === "first_time") {
    if (price > SDLT_FTB_CAP) {
      notes.push(
        "First-time buyer relief is withdrawn in full above £500,000, so standard residential SDLT rates apply to the whole price.",
      );
      return { bands: SDLT_STANDARD_BANDS, notes };
    }
    notes.push("First-time buyer relief: 0% up to £300,000 and 5% on the portion from £300,001 to £500,000.");
    return {
      bands: [
        { upTo: SDLT_FTB_NIL, rate: 0 },
        { upTo: SDLT_FTB_CAP, rate: SDLT_FTB_UPPER_RATE },
      ],
      notes,
    };
  }
  if (buyerType === "additional") {
    notes.push("Additional residential property: 5 percentage points on each SDLT band when the price is £40,000 or more.");
    if (price < SDLT_ADDITIONAL_MIN_PRICE) {
      notes.push("Price is below £40,000, so the additional-property surcharge is not applied.");
      return { bands: SDLT_STANDARD_BANDS, notes };
    }
    return { bands: withSurcharge(SDLT_STANDARD_BANDS, SDLT_ADDITIONAL_SURCHARGE), notes };
  }
  return { bands: SDLT_STANDARD_BANDS, notes };
}

function lbttBands(buyerType: StampDutyBuyerType): StampDutyBand[] {
  if (buyerType === "first_time") {
    return LBTT_STANDARD_BANDS.map((band, index) => (index === 0 ? { ...band, upTo: LBTT_FTB_NIL } : band));
  }
  return LBTT_STANDARD_BANDS;
}

export function computeStampDuty(input: StampDutyInput): StampDutyResult {
  const { region, buyerType, propertyPrice, deposit, nonUkResident } = input;
  const notes: string[] = [
    `Rates reviewed ${UK_RATES_LAST_REVIEWED} for completions in the ${UK_RATES_TAX_YEAR} window unless a nation published a later change.`,
  ];

  let regime = "";
  let rows: StampDutyBreakdownRow[] = [];
  let tax = 0;
  let surcharge = 0;

  if (region === "england_ni") {
    regime = "Stamp Duty Land Tax (England and Northern Ireland)";
    const resolved = sdltBands(buyerType, propertyPrice);
    notes.push(...resolved.notes);
    const sliced = taxOnBands(propertyPrice, resolved.bands);
    tax = sliced.tax;
    rows = sliced.rows;
    if (nonUkResident) {
      surcharge = propertyPrice * SDLT_NON_RESIDENT_SURCHARGE;
      notes.push("Non-UK resident surcharge: 2% of the purchase price, added on top of the SDLT that already applies.");
    }
  } else if (region === "scotland") {
    regime = "Land and Buildings Transaction Tax (Scotland)";
    const effectiveBuyer = buyerType === "additional" ? "standard" : buyerType;
    if (buyerType === "first_time") {
      notes.push("Scottish first-time buyer relief raises the nil-rate band from £145,000 to £175,000.");
    }
    const sliced = taxOnBands(propertyPrice, lbttBands(effectiveBuyer));
    tax = sliced.tax;
    rows = sliced.rows;
    if (buyerType === "additional" && propertyPrice >= LBTT_ADS_MIN_PRICE) {
      surcharge = propertyPrice * LBTT_ADS_RATE;
      notes.push("Additional Dwelling Supplement: 8% of the whole price on relevant purchases of £40,000 or more. First-time buyer relief does not apply.");
    }
    if (nonUkResident) {
      notes.push("Scotland does not apply the English/NI 2% non-resident SDLT surcharge in this model.");
    }
  } else {
    regime = "Land Transaction Tax (Wales)";
    if (buyerType === "first_time") {
      notes.push("Wales has no separate first-time buyer relief. Main residential LTT rates are used.");
    }
    const bands = buyerType === "additional" ? LTT_HIGHER_BANDS : LTT_MAIN_BANDS;
    if (buyerType === "additional") {
      notes.push("Higher residential LTT rates apply (additional property), using the bands in force from 11 December 2024.");
    }
    const sliced = taxOnBands(propertyPrice, bands);
    tax = sliced.tax;
    rows = sliced.rows;
    if (nonUkResident) {
      notes.push("Wales does not apply the English/NI 2% non-resident SDLT surcharge in this model.");
    }
  }

  const totalTax = tax + surcharge;
  const cashRequired = deposit + totalTax;
  const effectiveRate = propertyPrice > 0 ? totalTax / propertyPrice : 0;

  notes.push(
    "Residential freehold/lease-premium only. Shared ownership, linked purchases, companies, 6+ dwellings, and lease NPV rent are out of scope.",
  );

  return {
    tax,
    surcharge,
    totalTax,
    cashRequired,
    deposit,
    effectiveRate,
    regime,
    notes,
    rows,
  };
}

function parseRegion(value: string | undefined): StampDutyRegion | null {
  if (value === "england_ni" || value === "scotland" || value === "wales") return value;
  return null;
}

function parseBuyer(value: string | undefined): StampDutyBuyerType | null {
  if (value === "standard" || value === "first_time" || value === "additional") return value;
  return null;
}

export function computeUkStampDutyFromForm(form: Record<string, string>): {
  title: string;
  value: string;
  extra?: string[];
  error?: boolean;
} {
  const price = Number(form.propertyPrice);
  const deposit = form.deposit === undefined || form.deposit === "" ? 0 : Number(form.deposit);
  const region = parseRegion(form.region || "england_ni");
  const buyerType = parseBuyer(form.buyerType || "standard");
  const nonUkResident = form.nonUkResident === "yes";

  if (!region) return { title: "Invalid Input", value: "Choose England & Northern Ireland, Scotland, or Wales.", error: true };
  if (!buyerType) return { title: "Invalid Input", value: "Choose a buyer type.", error: true };
  if (!Number.isFinite(price) || price <= 0) {
    return { title: "Invalid Input", value: "Property price must be greater than zero.", error: true };
  }
  if (!Number.isFinite(deposit) || deposit < 0) {
    return { title: "Invalid Input", value: "Deposit cannot be negative.", error: true };
  }
  if (deposit > price) {
    return { title: "Invalid Input", value: "Deposit cannot be larger than the property price.", error: true };
  }

  const result = computeStampDuty({ region, buyerType, propertyPrice: price, deposit, nonUkResident });
  const extra = [
    `Regime: ${result.regime}`,
    `Tax on bands: ${gbp(result.tax)}`,
    result.surcharge > 0 ? `Surcharge: ${gbp(result.surcharge)}` : "Surcharge: £0.00",
    `Effective rate: ${(result.effectiveRate * 100).toFixed(2)}%`,
    `Deposit entered: ${gbp(result.deposit)}`,
    `Cash required (deposit + tax): ${gbp(result.cashRequired)}`,
    ...result.rows.map(
      (row) =>
        `${gbp(row.sliceFrom)}–${row.sliceTo === Number.POSITIVE_INFINITY ? "above" : gbp(row.sliceTo)} @ ${(row.rate * 100).toFixed(1)}% = ${gbp(row.tax)}`,
    ),
    ...result.notes,
  ];

  return {
    title: "Estimated stamp duty",
    value: gbp(result.totalTax),
    extra,
  };
}
