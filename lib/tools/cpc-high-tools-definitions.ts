import type { ToolDefinition } from "./types";
export const cpcHighToolDefinitions: ToolDefinition[] = [
{
  "slug": "mortgage-payment-calculator",
  "name": "Mortgage Payment Calculator",
  "shortDescription": "Monthly mortgage with P&I, taxes, insurance, PMI, HOA.",
  "description": "Computes amortizing principal and interest plus modeled property tax, homeowner insurance, PMI when down payment is under 20%, and optional HOA. Figures are deterministic; escrow and lender rules vary.",
  "category": "finance",
  "fields": [
    {
      "name": "homePrice",
      "label": "Home price ($)",
      "type": "number",
      "min": 1,
      "step": 1
    },
    {
      "name": "downPaymentPercent",
      "label": "Down payment (%)",
      "type": "number",
      "min": 0,
      "step": 0.1
    },
    {
      "name": "loanTermYears",
      "label": "Loan term (years)",
      "type": "select",
      "options": [
        {
          "label": "10",
          "value": "10"
        },
        {
          "label": "15",
          "value": "15"
        },
        {
          "label": "20",
          "value": "20"
        },
        {
          "label": "25",
          "value": "25"
        },
        {
          "label": "30",
          "value": "30"
        }
      ]
    },
    {
      "name": "annualInterestRate",
      "label": "Annual interest rate (%)",
      "type": "number",
      "min": 0,
      "step": 0.001
    },
    {
      "name": "propertyTaxRateAnnual",
      "label": "Property tax (% of value / year)",
      "type": "number",
      "min": 0,
      "step": 0.01
    },
    {
      "name": "homeownersInsuranceAnnual",
      "label": "Homeowner's insurance ($/year)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "pmiAnnualRatePercent",
      "label": "PMI annual rate (% of loan, if <20% down)",
      "type": "number",
      "min": 0,
      "step": 0.01
    },
    {
      "name": "hoaMonthly",
      "label": "HOA ($/month)",
      "type": "number",
      "min": 0,
      "step": 1
    }
  ],
  "keywords": [
    "mortgage payment calculator",
    "mortgage calculator with taxes and insurance",
    "monthly mortgage payment",
    "home loan calculator",
    "PITI calculator"
  ],
  "howToUse": [
    "Enter home price, down payment percent, term, and rate.",
    "Add tax, insurance, PMI, and HOA assumptions.",
    "Calculate for total monthly housing cash flow."
  ],
  "faqs": [
    {
      "question": "How is monthly mortgage payment calculated?",
      "answer": "Principal and interest use standard amortization on loan amount after down payment. Taxes and insurance are spread monthly from your annual inputs."
    },
    {
      "question": "What is PMI?",
      "answer": "Private mortgage insurance protects the lender when equity is thin; cancellation rules depend on loan program and paydown."
    },
    {
      "question": "15-year vs 30-year?",
      "answer": "Shorter terms raise monthly P&I but reduce lifetime interest on the loan amount."
    },
    {
      "question": "What is PITI?",
      "answer": "Principal, interest, taxes, and insurance—the recurring housing payment bucket lenders stress-test."
    },
    {
      "question": "How much down payment do I need?",
      "answer": "Programs vary; under 20% often triggers PMI or pricing adjustments."
    },
    {
      "question": "Are extra payments modeled?",
      "answer": "No; this version uses level scheduled P&I only."
    }
  ],
  "related": [
    "refinance-break-even-calculator",
    "home-equity-loan-calculator",
    "loan-calculator",
    "mortgage-affordability-calculator-usa",
    "rent-vs-buy-calculator-usa"
  ]
} as unknown as ToolDefinition,
{
  "slug": "auto-insurance-quote-estimator",
  "name": "Auto Insurance Quote Estimator",
  "shortDescription": "Illustrative monthly premium from state baseline and risk factors.",
  "description": "Multiplies a state reference monthly premium by age, driving record, credit tier, vehicle type, coverage level, and a small loyalty discount. Not an insurance quote.",
  "category": "finance",
  "fields": [
    {
      "name": "driverAge",
      "label": "Driver age",
      "type": "number",
      "min": 16,
      "max": 90,
      "step": 1
    },
    {
      "name": "usState",
      "label": "State",
      "type": "select",
      "options": [
        {
          "label": "AL",
          "value": "AL"
        },
        {
          "label": "AK",
          "value": "AK"
        },
        {
          "label": "AZ",
          "value": "AZ"
        },
        {
          "label": "AR",
          "value": "AR"
        },
        {
          "label": "CA",
          "value": "CA"
        },
        {
          "label": "CO",
          "value": "CO"
        },
        {
          "label": "CT",
          "value": "CT"
        },
        {
          "label": "DE",
          "value": "DE"
        },
        {
          "label": "FL",
          "value": "FL"
        },
        {
          "label": "GA",
          "value": "GA"
        },
        {
          "label": "HI",
          "value": "HI"
        },
        {
          "label": "ID",
          "value": "ID"
        },
        {
          "label": "IL",
          "value": "IL"
        },
        {
          "label": "IN",
          "value": "IN"
        },
        {
          "label": "IA",
          "value": "IA"
        },
        {
          "label": "KS",
          "value": "KS"
        },
        {
          "label": "KY",
          "value": "KY"
        },
        {
          "label": "LA",
          "value": "LA"
        },
        {
          "label": "ME",
          "value": "ME"
        },
        {
          "label": "MD",
          "value": "MD"
        },
        {
          "label": "MA",
          "value": "MA"
        },
        {
          "label": "MI",
          "value": "MI"
        },
        {
          "label": "MN",
          "value": "MN"
        },
        {
          "label": "MS",
          "value": "MS"
        },
        {
          "label": "MO",
          "value": "MO"
        },
        {
          "label": "MT",
          "value": "MT"
        },
        {
          "label": "NE",
          "value": "NE"
        },
        {
          "label": "NV",
          "value": "NV"
        },
        {
          "label": "NH",
          "value": "NH"
        },
        {
          "label": "NJ",
          "value": "NJ"
        },
        {
          "label": "NM",
          "value": "NM"
        },
        {
          "label": "NY",
          "value": "NY"
        },
        {
          "label": "NC",
          "value": "NC"
        },
        {
          "label": "ND",
          "value": "ND"
        },
        {
          "label": "OH",
          "value": "OH"
        },
        {
          "label": "OK",
          "value": "OK"
        },
        {
          "label": "OR",
          "value": "OR"
        },
        {
          "label": "PA",
          "value": "PA"
        },
        {
          "label": "RI",
          "value": "RI"
        },
        {
          "label": "SC",
          "value": "SC"
        },
        {
          "label": "SD",
          "value": "SD"
        },
        {
          "label": "TN",
          "value": "TN"
        },
        {
          "label": "TX",
          "value": "TX"
        },
        {
          "label": "UT",
          "value": "UT"
        },
        {
          "label": "VT",
          "value": "VT"
        },
        {
          "label": "VA",
          "value": "VA"
        },
        {
          "label": "WA",
          "value": "WA"
        },
        {
          "label": "WV",
          "value": "WV"
        },
        {
          "label": "WI",
          "value": "WI"
        },
        {
          "label": "WY",
          "value": "WY"
        },
        {
          "label": "DC",
          "value": "DC"
        }
      ]
    },
    {
      "name": "vehicleType",
      "label": "Vehicle type",
      "type": "select",
      "options": [
        {
          "label": "Sedan",
          "value": "sedan"
        },
        {
          "label": "SUV",
          "value": "suv"
        },
        {
          "label": "Truck",
          "value": "truck"
        },
        {
          "label": "Sports car",
          "value": "sports"
        },
        {
          "label": "Luxury",
          "value": "luxury"
        },
        {
          "label": "Minivan",
          "value": "minivan"
        },
        {
          "label": "Electric",
          "value": "electric"
        }
      ]
    },
    {
      "name": "drivingRecord",
      "label": "Driving record",
      "type": "select",
      "options": [
        {
          "label": "Clean",
          "value": "clean"
        },
        {
          "label": "1 minor violation",
          "value": "minor"
        },
        {
          "label": "2+ violations",
          "value": "multiple"
        },
        {
          "label": "1 at-fault accident",
          "value": "accident"
        },
        {
          "label": "DUI",
          "value": "dui"
        }
      ]
    },
    {
      "name": "creditTier",
      "label": "Credit tier",
      "type": "select",
      "options": [
        {
          "label": "Excellent (750+)",
          "value": "excellent"
        },
        {
          "label": "Good (670–749)",
          "value": "good"
        },
        {
          "label": "Fair (580–669)",
          "value": "fair"
        },
        {
          "label": "Poor (<580)",
          "value": "poor"
        }
      ]
    },
    {
      "name": "coverageLevel",
      "label": "Coverage level",
      "type": "select",
      "options": [
        {
          "label": "Liability-focused",
          "value": "liability"
        },
        {
          "label": "Standard",
          "value": "standard"
        },
        {
          "label": "Full coverage",
          "value": "full"
        }
      ]
    },
    {
      "name": "currentInsurance",
      "label": "Currently insured?",
      "type": "select",
      "options": [
        {
          "label": "Yes",
          "value": "yes"
        },
        {
          "label": "No",
          "value": "no"
        }
      ]
    }
  ],
  "keywords": [
    "car insurance calculator",
    "auto insurance quote estimator",
    "how much is car insurance",
    "auto insurance cost calculator"
  ],
  "howToUse": [
    "Enter your scenario details.",
    "Click calculate.",
    "Review figures as planning estimates only."
  ],
  "faqs": [
    {
      "question": "What affects car insurance rates most?",
      "answer": "State, driving history, credit tier in many states, vehicle type, mileage, and coverage selections all move price."
    },
    {
      "question": "Why is my premium higher than average?",
      "answer": "Underwriting uses more variables than this page—youthful operators, territory, and prior claims matter."
    },
    {
      "question": "Does credit score affect rates?",
      "answer": "In many states insurers use credit-based insurance scores; rules vary."
    },
    {
      "question": "Liability vs full coverage?",
      "answer": "Liability pays others; full adds physical damage coverages for your vehicle subject to deductibles."
    },
    {
      "question": "Is this a binding quote?",
      "answer": "No. Contact licensed agents or carriers for official offers."
    },
    {
      "question": "Can good driving lower premiums?",
      "answer": "Telematics and clean renewals can help—carrier programs differ."
    }
  ],
  "related": [
    "health-insurance-cost-estimator",
    "life-insurance-coverage-calculator",
    "disability-insurance-calculator",
    "dui-cost-calculator",
    "loan-calculator"
  ]
} as unknown as ToolDefinition,
{
  "slug": "life-insurance-coverage-calculator",
  "name": "Life Insurance Coverage Calculator",
  "shortDescription": "Needs-based coverage sketch (debts, income, education offsets).",
  "description": "Combines debts, income replacement, education funding, then subtracts savings, existing coverage, and partial spouse income offset. Premium band is a crude term-life scale—not a quote.",
  "category": "finance",
  "fields": [
    {
      "name": "annualIncome",
      "label": "Annual income ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "yearsIncomeReplacement",
      "label": "Years of income replacement",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "mortgageBalance",
      "label": "Mortgage balance ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "otherDebts",
      "label": "Other debts ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "finalExpenses",
      "label": "Final expenses ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "educationPerChild",
      "label": "Education fund per child ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "numChildren",
      "label": "Number of children",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "existingSavings",
      "label": "Existing savings/investments ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "existingLifeInsurance",
      "label": "Existing life insurance ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "spouseIncomeAnnual",
      "label": "Spouse annual income ($, 0 if none)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "insuredAge",
      "label": "Insured age (for premium band)",
      "type": "number",
      "min": 18,
      "max": 80,
      "step": 1
    }
  ],
  "keywords": [
    "life insurance calculator",
    "how much life insurance do I need",
    "life insurance coverage calculator",
    "DIME method calculator"
  ],
  "howToUse": [
    "Enter your scenario details.",
    "Click calculate.",
    "Review figures as planning estimates only."
  ],
  "faqs": [
    {
      "question": "Is this a recommendation to buy?",
      "answer": "No. It is arithmetic on the inputs you supply; underwriting and goals need a licensed agent or planner."
    },
    {
      "question": "What is the DIME approach?",
      "answer": "Debts, income replacement, mortgage-related needs, and education—common planning shorthand."
    },
    {
      "question": "Does it model whole life?",
      "answer": "No. The crude premium band assumes term-style pricing per $500k."
    },
    {
      "question": "Should I count group coverage?",
      "answer": "Include employer plans you could lose if you change jobs."
    },
    {
      "question": "What about stay-at-home parents?",
      "answer": "Replace services with dollar estimates outside this simple form."
    },
    {
      "question": "Inflation?",
      "answer": "Long horizons need higher face amounts—this tool does not auto-escalate."
    }
  ],
  "related": [
    "disability-insurance-calculator",
    "health-insurance-cost-estimator",
    "mortgage-payment-calculator",
    "student-loan-forgiveness-calculator",
    "net-worth-tracker"
  ]
} as unknown as ToolDefinition,
{
  "slug": "personal-injury-settlement-calculator",
  "name": "Personal Injury Settlement Calculator",
  "shortDescription": "Economic + multiplier pain/suffering sketch after fault.",
  "description": "Adds economic damages and a severity-based non-economic multiplier, scales by other-party fault percentage, and shows a broad band. Not legal advice.",
  "category": "legal",
  "fields": [
    {
      "name": "medicalBills",
      "label": "Medical bills ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "futureMedical",
      "label": "Future medical ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "lostWages",
      "label": "Lost wages ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "futureLostEarnings",
      "label": "Future lost earning capacity ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "injurySeverity",
      "label": "Injury severity",
      "type": "select",
      "options": [
        {
          "label": "Minor",
          "value": "minor"
        },
        {
          "label": "Moderate",
          "value": "moderate"
        },
        {
          "label": "Severe",
          "value": "severe"
        },
        {
          "label": "Catastrophic",
          "value": "catastrophic"
        }
      ]
    },
    {
      "name": "permanentDisability",
      "label": "Permanent disability?",
      "type": "select",
      "options": [
        {
          "label": "No",
          "value": "no"
        },
        {
          "label": "Yes",
          "value": "yes"
        }
      ]
    },
    {
      "name": "atFaultOtherPercent",
      "label": "Other party at fault (%)",
      "type": "number",
      "min": 0,
      "max": 100,
      "step": 0.1
    }
  ],
  "keywords": [
    "personal injury settlement calculator",
    "car accident settlement calculator",
    "pain and suffering calculator",
    "injury claim estimate"
  ],
  "howToUse": [
    "Enter your scenario details.",
    "Click calculate.",
    "Review figures as planning estimates only."
  ],
  "faqs": [
    {
      "question": "Is this legal advice?",
      "answer": "No. Only a licensed attorney can advise on your matter."
    },
    {
      "question": "Why a range?",
      "answer": "Litigation outcomes vary with evidence, insurance limits, and venue."
    },
    {
      "question": "Comparative fault?",
      "answer": "Your recovery may be reduced by your share of fault where applicable."
    },
    {
      "question": "Attorney fees?",
      "answer": "A 33% illustration is shown; fee agreements differ."
    },
    {
      "question": "Economic vs non-economic?",
      "answer": "Economic covers bills and wages; non-economic covers pain and suffering multipliers here."
    },
    {
      "question": "Structured settlements?",
      "answer": "Tax and payout timing are not modeled."
    }
  ],
  "related": [
    "slip-and-fall-settlement-calculator",
    "truck-accident-settlement-calculator",
    "workers-compensation-calculator",
    "medical-malpractice-settlement-estimator",
    "dui-cost-calculator"
  ]
} as unknown as ToolDefinition,
{
  "slug": "health-insurance-cost-estimator",
  "name": "Health Insurance Cost Estimator",
  "shortDescription": "ACA-style benchmark, FPL band, modeled subsidy.",
  "description": "Uses household size FPL ratio, a simplified applicable contribution percentage, state Silver benchmark, age factor, and metal tier load. Not Healthcare.gov.",
  "category": "finance",
  "fields": [
    {
      "name": "usState",
      "label": "State",
      "type": "select",
      "options": [
        {
          "label": "AL",
          "value": "AL"
        },
        {
          "label": "AK",
          "value": "AK"
        },
        {
          "label": "AZ",
          "value": "AZ"
        },
        {
          "label": "AR",
          "value": "AR"
        },
        {
          "label": "CA",
          "value": "CA"
        },
        {
          "label": "CO",
          "value": "CO"
        },
        {
          "label": "CT",
          "value": "CT"
        },
        {
          "label": "DE",
          "value": "DE"
        },
        {
          "label": "FL",
          "value": "FL"
        },
        {
          "label": "GA",
          "value": "GA"
        },
        {
          "label": "HI",
          "value": "HI"
        },
        {
          "label": "ID",
          "value": "ID"
        },
        {
          "label": "IL",
          "value": "IL"
        },
        {
          "label": "IN",
          "value": "IN"
        },
        {
          "label": "IA",
          "value": "IA"
        },
        {
          "label": "KS",
          "value": "KS"
        },
        {
          "label": "KY",
          "value": "KY"
        },
        {
          "label": "LA",
          "value": "LA"
        },
        {
          "label": "ME",
          "value": "ME"
        },
        {
          "label": "MD",
          "value": "MD"
        },
        {
          "label": "MA",
          "value": "MA"
        },
        {
          "label": "MI",
          "value": "MI"
        },
        {
          "label": "MN",
          "value": "MN"
        },
        {
          "label": "MS",
          "value": "MS"
        },
        {
          "label": "MO",
          "value": "MO"
        },
        {
          "label": "MT",
          "value": "MT"
        },
        {
          "label": "NE",
          "value": "NE"
        },
        {
          "label": "NV",
          "value": "NV"
        },
        {
          "label": "NH",
          "value": "NH"
        },
        {
          "label": "NJ",
          "value": "NJ"
        },
        {
          "label": "NM",
          "value": "NM"
        },
        {
          "label": "NY",
          "value": "NY"
        },
        {
          "label": "NC",
          "value": "NC"
        },
        {
          "label": "ND",
          "value": "ND"
        },
        {
          "label": "OH",
          "value": "OH"
        },
        {
          "label": "OK",
          "value": "OK"
        },
        {
          "label": "OR",
          "value": "OR"
        },
        {
          "label": "PA",
          "value": "PA"
        },
        {
          "label": "RI",
          "value": "RI"
        },
        {
          "label": "SC",
          "value": "SC"
        },
        {
          "label": "SD",
          "value": "SD"
        },
        {
          "label": "TN",
          "value": "TN"
        },
        {
          "label": "TX",
          "value": "TX"
        },
        {
          "label": "UT",
          "value": "UT"
        },
        {
          "label": "VT",
          "value": "VT"
        },
        {
          "label": "VA",
          "value": "VA"
        },
        {
          "label": "WA",
          "value": "WA"
        },
        {
          "label": "WV",
          "value": "WV"
        },
        {
          "label": "WI",
          "value": "WI"
        },
        {
          "label": "WY",
          "value": "WY"
        },
        {
          "label": "DC",
          "value": "DC"
        }
      ]
    },
    {
      "name": "personAge",
      "label": "Age (18–64)",
      "type": "number",
      "min": 18,
      "max": 64,
      "step": 1
    },
    {
      "name": "householdSize",
      "label": "Household size",
      "type": "number",
      "min": 1,
      "max": 8,
      "step": 1
    },
    {
      "name": "annualHouseholdIncome",
      "label": "Annual household income ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "tobacco",
      "label": "Tobacco use",
      "type": "select",
      "options": [
        {
          "label": "No",
          "value": "no"
        },
        {
          "label": "Yes",
          "value": "yes"
        }
      ]
    },
    {
      "name": "coverageTier",
      "label": "Metal tier",
      "type": "select",
      "options": [
        {
          "label": "Bronze",
          "value": "bronze"
        },
        {
          "label": "Silver",
          "value": "silver"
        },
        {
          "label": "Gold",
          "value": "gold"
        },
        {
          "label": "Platinum",
          "value": "platinum"
        }
      ]
    }
  ],
  "keywords": [
    "health insurance calculator",
    "ACA subsidy calculator",
    "marketplace premium estimate",
    "health insurance cost estimator"
  ],
  "howToUse": [
    "Enter your scenario details.",
    "Click calculate.",
    "Review figures as planning estimates only."
  ],
  "faqs": [
    {
      "question": "Is this an eligibility determination?",
      "answer": "No. Medicaid, CSR, and employer coverage rules are simplified or omitted."
    },
    {
      "question": "What is FPL?",
      "answer": "Federal poverty level; subsidy cliffs reference it."
    },
    {
      "question": "Silver benchmark?",
      "answer": "Subsidies tie to the second-lowest-cost Silver plan in your area—here we use a state anchor only."
    },
    {
      "question": "Family glitch?",
      "answer": "Not modeled."
    },
    {
      "question": "Open enrollment?",
      "answer": "Dates vary; check your marketplace."
    },
    {
      "question": "1095-A?",
      "answer": "Actual tax credits reconcile on your return."
    }
  ],
  "related": [
    "auto-insurance-quote-estimator",
    "life-insurance-coverage-calculator",
    "disability-insurance-calculator",
    "w4-tax-withholding-calculator",
    "paycheck-calculator-usa"
  ]
} as unknown as ToolDefinition,
{
  "slug": "refinance-break-even-calculator",
  "name": "Refinance Break-Even Calculator",
  "shortDescription": "Payment savings vs closing costs timeline.",
  "description": "Compares amortizing payments on current balance and term against a new loan on balance plus optional cash-out, then divides closing costs by monthly savings.",
  "category": "finance",
  "fields": [
    {
      "name": "currentLoanBalance",
      "label": "Current loan balance ($)",
      "type": "number",
      "min": 1,
      "step": 1
    },
    {
      "name": "currentAnnualRate",
      "label": "Current annual rate (%)",
      "type": "number",
      "min": 0,
      "step": 0.001
    },
    {
      "name": "remainingYears",
      "label": "Remaining years",
      "type": "number",
      "min": 0.25,
      "step": 0.25
    },
    {
      "name": "newAnnualRate",
      "label": "New annual rate (%)",
      "type": "number",
      "min": 0,
      "step": 0.001
    },
    {
      "name": "newLoanTermYears",
      "label": "New loan term (years)",
      "type": "number",
      "min": 1,
      "step": 1
    },
    {
      "name": "closingCosts",
      "label": "Closing costs ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "cashOut",
      "label": "Cash-out amount ($)",
      "type": "number",
      "min": 0,
      "step": 1
    }
  ],
  "keywords": [
    "refinance calculator",
    "refinance break even",
    "mortgage refinance savings",
    "when to refinance"
  ],
  "howToUse": [
    "Enter your scenario details.",
    "Click calculate.",
    "Review figures as planning estimates only."
  ],
  "faqs": [
    {
      "question": "What is break-even?",
      "answer": "Months until cumulative payment savings recover closing costs."
    },
    {
      "question": "Does it include escrow?",
      "answer": "No; compare P&I only here."
    },
    {
      "question": "Resetting the clock?",
      "answer": "A longer new term can increase lifetime interest even with a lower rate."
    },
    {
      "question": "APR vs rate?",
      "answer": "Closing costs belong in APR comparisons for a fuller picture."
    },
    {
      "question": "ARM products?",
      "answer": "Not modeled separately."
    },
    {
      "question": "No closing cost loans?",
      "answer": "Costs are often baked into rate—enter them as you see fit."
    }
  ],
  "related": [
    "mortgage-payment-calculator",
    "refinance-calculator-mortgage",
    "mortgage-refinance-calculator",
    "home-equity-loan-calculator",
    "loan-calculator"
  ]
} as unknown as ToolDefinition,
{
  "slug": "workers-compensation-calculator",
  "name": "Workers Compensation Calculator",
  "shortDescription": "TTD + PPD sketch with state weekly cap.",
  "description": "Applies two-thirds wage replacement capped by an illustrative state maximum, multiplies by disability weeks, and layers medical bills. Not legal advice.",
  "category": "legal",
  "fields": [
    {
      "name": "usState",
      "label": "State",
      "type": "select",
      "options": [
        {
          "label": "AL",
          "value": "AL"
        },
        {
          "label": "AK",
          "value": "AK"
        },
        {
          "label": "AZ",
          "value": "AZ"
        },
        {
          "label": "AR",
          "value": "AR"
        },
        {
          "label": "CA",
          "value": "CA"
        },
        {
          "label": "CO",
          "value": "CO"
        },
        {
          "label": "CT",
          "value": "CT"
        },
        {
          "label": "DE",
          "value": "DE"
        },
        {
          "label": "FL",
          "value": "FL"
        },
        {
          "label": "GA",
          "value": "GA"
        },
        {
          "label": "HI",
          "value": "HI"
        },
        {
          "label": "ID",
          "value": "ID"
        },
        {
          "label": "IL",
          "value": "IL"
        },
        {
          "label": "IN",
          "value": "IN"
        },
        {
          "label": "IA",
          "value": "IA"
        },
        {
          "label": "KS",
          "value": "KS"
        },
        {
          "label": "KY",
          "value": "KY"
        },
        {
          "label": "LA",
          "value": "LA"
        },
        {
          "label": "ME",
          "value": "ME"
        },
        {
          "label": "MD",
          "value": "MD"
        },
        {
          "label": "MA",
          "value": "MA"
        },
        {
          "label": "MI",
          "value": "MI"
        },
        {
          "label": "MN",
          "value": "MN"
        },
        {
          "label": "MS",
          "value": "MS"
        },
        {
          "label": "MO",
          "value": "MO"
        },
        {
          "label": "MT",
          "value": "MT"
        },
        {
          "label": "NE",
          "value": "NE"
        },
        {
          "label": "NV",
          "value": "NV"
        },
        {
          "label": "NH",
          "value": "NH"
        },
        {
          "label": "NJ",
          "value": "NJ"
        },
        {
          "label": "NM",
          "value": "NM"
        },
        {
          "label": "NY",
          "value": "NY"
        },
        {
          "label": "NC",
          "value": "NC"
        },
        {
          "label": "ND",
          "value": "ND"
        },
        {
          "label": "OH",
          "value": "OH"
        },
        {
          "label": "OK",
          "value": "OK"
        },
        {
          "label": "OR",
          "value": "OR"
        },
        {
          "label": "PA",
          "value": "PA"
        },
        {
          "label": "RI",
          "value": "RI"
        },
        {
          "label": "SC",
          "value": "SC"
        },
        {
          "label": "SD",
          "value": "SD"
        },
        {
          "label": "TN",
          "value": "TN"
        },
        {
          "label": "TX",
          "value": "TX"
        },
        {
          "label": "UT",
          "value": "UT"
        },
        {
          "label": "VT",
          "value": "VT"
        },
        {
          "label": "VA",
          "value": "VA"
        },
        {
          "label": "WA",
          "value": "WA"
        },
        {
          "label": "WV",
          "value": "WV"
        },
        {
          "label": "WI",
          "value": "WI"
        },
        {
          "label": "WY",
          "value": "WY"
        },
        {
          "label": "DC",
          "value": "DC"
        }
      ]
    },
    {
      "name": "weeklyWage",
      "label": "Average weekly wage ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "weeksDisabled",
      "label": "Weeks of temporary disability",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "disabilityRatingPercent",
      "label": "Permanent partial disability (%)",
      "type": "number",
      "min": 0,
      "max": 100,
      "step": 1
    },
    {
      "name": "medicalBills",
      "label": "Medical bills paid ($)",
      "type": "number",
      "min": 0,
      "step": 1
    }
  ],
  "keywords": [
    "workers compensation calculator",
    "workers comp settlement estimate",
    "TTD calculator",
    "PPD benefits"
  ],
  "howToUse": [
    "Enter your scenario details.",
    "Click calculate.",
    "Review figures as planning estimates only."
  ],
  "faqs": [
    {
      "question": "Is this my award?",
      "answer": "No. States use schedules, IMEs, and different caps."
    },
    {
      "question": "Medical benefits?",
      "answer": "Entered medical is additive in this sketch only."
    },
    {
      "question": "MMI?",
      "answer": "Permanent ratings usually follow maximum medical improvement."
    },
    {
      "question": "Attorney fees?",
      "answer": "Not deducted here."
    },
    {
      "question": "Third-party liens?",
      "answer": "Not modeled."
    },
    {
      "question": "Return-to-work?",
      "answer": "Wage differential benefits are not modeled."
    }
  ],
  "related": [
    "personal-injury-settlement-calculator",
    "disability-insurance-calculator",
    "paycheck-calculator-usa",
    "hourly-to-salary-converter-usa",
    "overtime-pay-calculator-usa"
  ]
} as unknown as ToolDefinition,
{
  "slug": "credit-card-payoff-calculator",
  "name": "Credit Card Payoff Calculator",
  "shortDescription": "Up to three balances: avalanche, snowball, or minimums.",
  "description": "Accrues monthly interest, pays minimums, then applies remaining cash to the target card by strategy until balances clear. Deterministic month-by-month loop.",
  "category": "finance",
  "fields": [
    {
      "name": "balance1",
      "label": "Card 1 balance ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "apr1",
      "label": "Card 1 APR (%)",
      "type": "number",
      "min": 0,
      "step": 0.01
    },
    {
      "name": "minPayment1",
      "label": "Card 1 minimum ($/mo)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "balance2",
      "label": "Card 2 balance ($, 0 if unused)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "apr2",
      "label": "Card 2 APR (%)",
      "type": "number",
      "min": 0,
      "step": 0.01
    },
    {
      "name": "minPayment2",
      "label": "Card 2 minimum ($/mo)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "balance3",
      "label": "Card 3 balance ($, 0 if unused)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "apr3",
      "label": "Card 3 APR (%)",
      "type": "number",
      "min": 0,
      "step": 0.01
    },
    {
      "name": "minPayment3",
      "label": "Card 3 minimum ($/mo)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "monthlyPaymentTotal",
      "label": "Total you pay per month ($)",
      "type": "number",
      "min": 1,
      "step": 1
    },
    {
      "name": "payoffStrategy",
      "label": "Strategy",
      "type": "select",
      "options": [
        {
          "label": "Avalanche (highest APR first)",
          "value": "avalanche"
        },
        {
          "label": "Snowball (lowest balance first)",
          "value": "snowball"
        },
        {
          "label": "Minimum payments only",
          "value": "minimum_only"
        }
      ]
    }
  ],
  "keywords": [
    "credit card payoff calculator",
    "debt avalanche calculator",
    "snowball calculator",
    "credit card interest"
  ],
  "howToUse": [
    "Enter your scenario details.",
    "Click calculate.",
    "Review figures as planning estimates only."
  ],
  "faqs": [
    {
      "question": "Why 600 month cap?",
      "answer": "Very small payments may never amortize; we stop to flag unrealistic inputs."
    },
    {
      "question": "New charges?",
      "answer": "Assumes no new purchases."
    },
    {
      "question": "Promotional APRs?",
      "answer": "Single APR per card only."
    },
    {
      "question": "Biweekly payments?",
      "answer": "Convert to an equivalent monthly total."
    },
    {
      "question": "Balance transfer fees?",
      "answer": "Not modeled."
    },
    {
      "question": "Credit score impact?",
      "answer": "Utilization improves as balances drop—not quantified here."
    }
  ],
  "related": [
    "credit-card-interest-calculator",
    "debt-payoff-calculator-avalanche",
    "debt-payoff-calculator-snowball",
    "loan-calculator",
    "budget-planner-monthly-usa"
  ]
} as unknown as ToolDefinition,
{
  "slug": "dui-cost-calculator",
  "name": "DUI Cost Calculator",
  "shortDescription": "Illustrative total DUI-related cost band by state.",
  "description": "Scales a state midpoint by prior offenses and adds lost wages and impound fees. Not legal advice.",
  "category": "legal",
  "fields": [
    {
      "name": "usState",
      "label": "State",
      "type": "select",
      "options": [
        {
          "label": "AL",
          "value": "AL"
        },
        {
          "label": "AK",
          "value": "AK"
        },
        {
          "label": "AZ",
          "value": "AZ"
        },
        {
          "label": "AR",
          "value": "AR"
        },
        {
          "label": "CA",
          "value": "CA"
        },
        {
          "label": "CO",
          "value": "CO"
        },
        {
          "label": "CT",
          "value": "CT"
        },
        {
          "label": "DE",
          "value": "DE"
        },
        {
          "label": "FL",
          "value": "FL"
        },
        {
          "label": "GA",
          "value": "GA"
        },
        {
          "label": "HI",
          "value": "HI"
        },
        {
          "label": "ID",
          "value": "ID"
        },
        {
          "label": "IL",
          "value": "IL"
        },
        {
          "label": "IN",
          "value": "IN"
        },
        {
          "label": "IA",
          "value": "IA"
        },
        {
          "label": "KS",
          "value": "KS"
        },
        {
          "label": "KY",
          "value": "KY"
        },
        {
          "label": "LA",
          "value": "LA"
        },
        {
          "label": "ME",
          "value": "ME"
        },
        {
          "label": "MD",
          "value": "MD"
        },
        {
          "label": "MA",
          "value": "MA"
        },
        {
          "label": "MI",
          "value": "MI"
        },
        {
          "label": "MN",
          "value": "MN"
        },
        {
          "label": "MS",
          "value": "MS"
        },
        {
          "label": "MO",
          "value": "MO"
        },
        {
          "label": "MT",
          "value": "MT"
        },
        {
          "label": "NE",
          "value": "NE"
        },
        {
          "label": "NV",
          "value": "NV"
        },
        {
          "label": "NH",
          "value": "NH"
        },
        {
          "label": "NJ",
          "value": "NJ"
        },
        {
          "label": "NM",
          "value": "NM"
        },
        {
          "label": "NY",
          "value": "NY"
        },
        {
          "label": "NC",
          "value": "NC"
        },
        {
          "label": "ND",
          "value": "ND"
        },
        {
          "label": "OH",
          "value": "OH"
        },
        {
          "label": "OK",
          "value": "OK"
        },
        {
          "label": "OR",
          "value": "OR"
        },
        {
          "label": "PA",
          "value": "PA"
        },
        {
          "label": "RI",
          "value": "RI"
        },
        {
          "label": "SC",
          "value": "SC"
        },
        {
          "label": "SD",
          "value": "SD"
        },
        {
          "label": "TN",
          "value": "TN"
        },
        {
          "label": "TX",
          "value": "TX"
        },
        {
          "label": "UT",
          "value": "UT"
        },
        {
          "label": "VT",
          "value": "VT"
        },
        {
          "label": "VA",
          "value": "VA"
        },
        {
          "label": "WA",
          "value": "WA"
        },
        {
          "label": "WV",
          "value": "WV"
        },
        {
          "label": "WI",
          "value": "WI"
        },
        {
          "label": "WY",
          "value": "WY"
        },
        {
          "label": "DC",
          "value": "DC"
        }
      ]
    },
    {
      "name": "priorDuiCount",
      "label": "Prior DUI convictions (0+)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "licenseSuspensionWeeks",
      "label": "License suspension (weeks, 0 if none)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "weeklySalary",
      "label": "Weekly salary ($, for lost wage sketch)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "vehicleImpounded",
      "label": "Vehicle impounded?",
      "type": "select",
      "options": [
        {
          "label": "No",
          "value": "no"
        },
        {
          "label": "Yes",
          "value": "yes"
        }
      ]
    },
    {
      "name": "impoundDays",
      "label": "Impound days (if yes)",
      "type": "number",
      "min": 0,
      "step": 1
    }
  ],
  "keywords": [
    "DUI cost calculator",
    "cost of DUI",
    "DUI fines by state",
    "DUI financial impact"
  ],
  "howToUse": [
    "Enter your scenario details.",
    "Click calculate.",
    "Review figures as planning estimates only."
  ],
  "faqs": [
    {
      "question": "Is this what I will pay?",
      "answer": "No. Courts, attorneys, and insurers vary widely."
    },
    {
      "question": "Insurance surcharges?",
      "answer": "Only crudely reflected in the state midpoint—not year-by-year."
    },
    {
      "question": "SR-22?",
      "answer": "Not itemized."
    },
    {
      "question": "IID costs?",
      "answer": "Fold into your attorney or state fee research."
    },
    {
      "question": "Felony DUIs?",
      "answer": "Not separately modeled."
    },
    {
      "question": "Out-of-state?",
      "answer": "Home state rules may differ."
    }
  ],
  "related": [
    "auto-insurance-quote-estimator",
    "personal-injury-settlement-calculator",
    "legal-fee-estimator",
    "hourly-to-salary-converter-usa",
    "paycheck-calculator-usa"
  ]
} as unknown as ToolDefinition,
{
  "slug": "medical-malpractice-settlement-estimator",
  "name": "Medical Malpractice Settlement Estimator",
  "shortDescription": "Economic + severity-based non-economic band.",
  "description": "Multiplies economic damages by a severity factor and optional disability bump; optional damage-cap toggle scales down. Not legal advice.",
  "category": "legal",
  "fields": [
    {
      "name": "medicalCosts",
      "label": "Medical costs ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "lostWagesMalp",
      "label": "Lost wages ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "malpSeverity",
      "label": "Injury severity",
      "type": "select",
      "options": [
        {
          "label": "Minor",
          "value": "minor"
        },
        {
          "label": "Moderate",
          "value": "moderate"
        },
        {
          "label": "Severe",
          "value": "severe"
        },
        {
          "label": "Catastrophic",
          "value": "catastrophic"
        }
      ]
    },
    {
      "name": "malpPermanentDisability",
      "label": "Permanent disability?",
      "type": "select",
      "options": [
        {
          "label": "No",
          "value": "no"
        },
        {
          "label": "Yes",
          "value": "yes"
        }
      ]
    },
    {
      "name": "stateDamageCap",
      "label": "Apply non-economic cap haircut?",
      "type": "select",
      "options": [
        {
          "label": "No",
          "value": "no"
        },
        {
          "label": "Yes (25% reduction sketch)",
          "value": "yes"
        }
      ]
    }
  ],
  "keywords": [
    "medical malpractice settlement calculator",
    "malpractice compensation estimate",
    "medical negligence calculator"
  ],
  "howToUse": [
    "Enter your scenario details.",
    "Click calculate.",
    "Review figures as planning estimates only."
  ],
  "faqs": [
    {
      "question": "Is this legal advice?",
      "answer": "No."
    },
    {
      "question": "Damage caps?",
      "answer": "States differ; this is a coarse toggle only."
    },
    {
      "question": "Certificate of merit?",
      "answer": "Not addressed."
    },
    {
      "question": "MICRA / tort reform?",
      "answer": "Consult counsel in your state."
    },
    {
      "question": "Insurance limits?",
      "answer": "Policy limits may cap recovery regardless of verdicts."
    },
    {
      "question": "Structured payouts?",
      "answer": "Not modeled."
    }
  ],
  "related": [
    "personal-injury-settlement-calculator",
    "slip-and-fall-settlement-calculator",
    "workers-compensation-calculator",
    "legal-fee-estimator",
    "settlement-calculator"
  ]
} as unknown as ToolDefinition,
{
  "slug": "business-loan-eligibility-calculator",
  "name": "Business Loan Eligibility Calculator",
  "shortDescription": "Heuristic eligibility + illustrative term payment.",
  "description": "Scores time in business, credit score, revenue vs loan size, and a crude DSCR-style cushion against a modeled five-year payment. Not a lender decision.",
  "category": "business",
  "fields": [
    {
      "name": "annualRevenue",
      "label": "Annual revenue ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "yearsInBusiness",
      "label": "Years in business",
      "type": "number",
      "min": 0,
      "step": 0.25
    },
    {
      "name": "creditScore",
      "label": "Personal credit score",
      "type": "number",
      "min": 300,
      "max": 850,
      "step": 1
    },
    {
      "name": "loanAmountRequested",
      "label": "Loan amount requested ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "monthlyExpenses",
      "label": "Average monthly operating expenses ($)",
      "type": "number",
      "min": 0,
      "step": 1
    }
  ],
  "keywords": [
    "business loan calculator",
    "SBA loan eligibility",
    "small business loan estimate",
    "business loan payment"
  ],
  "howToUse": [
    "Enter your scenario details.",
    "Click calculate.",
    "Review figures as planning estimates only."
  ],
  "faqs": [
    {
      "question": "Is this underwriting?",
      "answer": "No."
    },
    {
      "question": "SBA 7(a)?",
      "answer": "Not separated from other term products here."
    },
    {
      "question": "Collateral?",
      "answer": "Not modeled."
    },
    {
      "question": "Industry risk?",
      "answer": "Not modeled."
    },
    {
      "question": "Financial statements?",
      "answer": "Lenders require real filings."
    },
    {
      "question": "MCA factor rates?",
      "answer": "Not modeled."
    }
  ],
  "related": [
    "profit-margin-calculator-business",
    "break-even-calculator-business",
    "roi-calculator",
    "loan-calculator",
    "markup-calculator"
  ]
} as unknown as ToolDefinition,
{
  "slug": "disability-insurance-calculator",
  "name": "Disability Insurance Calculator",
  "shortDescription": "Target monthly benefit and crude premium magnitude.",
  "description": "Multiplies income by replacement percent for a monthly benefit target and shows a rough premium band. Not a quote.",
  "category": "finance",
  "fields": [
    {
      "name": "annualIncome",
      "label": "Annual gross income ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "replacePercent",
      "label": "Income to replace (%)",
      "type": "number",
      "min": 1,
      "max": 100,
      "step": 1
    }
  ],
  "keywords": [
    "disability insurance calculator",
    "long term disability needs",
    "income protection calculator"
  ],
  "howToUse": [
    "Enter your scenario details.",
    "Click calculate.",
    "Review figures as planning estimates only."
  ],
  "faqs": [
    {
      "question": "Own-occupation vs any?",
      "answer": "Definition changes price and claim odds—not modeled."
    },
    {
      "question": "Elimination period?",
      "answer": "Not modeled."
    },
    {
      "question": "Taxation of benefits?",
      "answer": "Depends on how premiums were paid."
    },
    {
      "question": "Group LTD?",
      "answer": "Often caps at 60% of salary with offsets."
    },
    {
      "question": "SSDI offset?",
      "answer": "Not modeled."
    },
    {
      "question": "Occupation class?",
      "answer": "Manual jobs price higher."
    }
  ],
  "related": [
    "life-insurance-coverage-calculator",
    "health-insurance-cost-estimator",
    "paycheck-calculator-usa",
    "w4-tax-withholding-calculator",
    "hourly-to-salary-converter-usa"
  ]
} as unknown as ToolDefinition,
{
  "slug": "home-equity-loan-calculator",
  "name": "Home Equity Loan Calculator",
  "shortDescription": "85% CLTV cap sketch vs requested amount + payment.",
  "description": "Computes max borrow at 85% combined LTV minus mortgage, approves the lesser of that and your request, then amortizes. Not a lender offer.",
  "category": "finance",
  "fields": [
    {
      "name": "homeValue",
      "label": "Home value ($)",
      "type": "number",
      "min": 1,
      "step": 1
    },
    {
      "name": "mortgageBalance",
      "label": "Current mortgage balance ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "desiredLoanAmount",
      "label": "Desired loan ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "helocAnnualRate",
      "label": "Annual interest rate (%)",
      "type": "number",
      "min": 0,
      "step": 0.001
    },
    {
      "name": "helocTermYears",
      "label": "Term (years)",
      "type": "number",
      "min": 1,
      "step": 1
    }
  ],
  "keywords": [
    "home equity loan calculator",
    "HELOC calculator",
    "how much equity can I borrow",
    "second mortgage payment"
  ],
  "howToUse": [
    "Enter your scenario details.",
    "Click calculate.",
    "Review figures as planning estimates only."
  ],
  "faqs": [
    {
      "question": "Is 85% guaranteed?",
      "answer": "No. Lenders use different caps and credit overlays."
    },
    {
      "question": "HELOC IO phase?",
      "answer": "This models fully amortizing payment only."
    },
    {
      "question": "Appraisal?",
      "answer": "Value is your input, not an appraisal."
    },
    {
      "question": "Closing costs?",
      "answer": "Not deducted from proceeds here."
    },
    {
      "question": "Rate type?",
      "answer": "Single fixed rate assumption."
    },
    {
      "question": "Tax deductibility?",
      "answer": "Depends on use of funds and current law—consult a tax pro."
    }
  ],
  "related": [
    "mortgage-payment-calculator",
    "refinance-break-even-calculator",
    "mortgage-affordability-calculator-usa",
    "loan-calculator",
    "rent-vs-buy-calculator-usa"
  ]
} as unknown as ToolDefinition,
{
  "slug": "w4-tax-withholding-calculator",
  "name": "W-4 Withholding Estimator",
  "shortDescription": "Very rough per-paycheck federal sketch.",
  "description": "Applies a coarse bracket-style rate to taxable wages after placeholder standard deduction and dependent credits. Not IRS-compliant withholding.",
  "category": "finance",
  "fields": [
    {
      "name": "filingStatus",
      "label": "Filing status",
      "type": "select",
      "options": [
        {
          "label": "Single / MFS",
          "value": "single"
        },
        {
          "label": "Married filing jointly",
          "value": "married"
        }
      ]
    },
    {
      "name": "annualSalary",
      "label": "Annual wages ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "dependentsCount",
      "label": "Dependents (W-4 Step 3 count)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "otherAnnualIncome",
      "label": "Other annual income ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "paychecksPerYear",
      "label": "Paychecks per year",
      "type": "number",
      "min": 1,
      "max": 52,
      "step": 1
    }
  ],
  "keywords": [
    "W-4 calculator",
    "tax withholding calculator",
    "federal withholding estimate",
    "paycheck tax calculator"
  ],
  "howToUse": [
    "Enter your scenario details.",
    "Click calculate.",
    "Review figures as planning estimates only."
  ],
  "faqs": [
    {
      "question": "Use this for my W-4?",
      "answer": "No. Use the IRS Tax Withholding Estimator for compliance."
    },
    {
      "question": "State taxes?",
      "answer": "Not modeled."
    },
    {
      "question": "Two earners?",
      "answer": "Not modeled."
    },
    {
      "question": "401k pre-tax?",
      "answer": "Reduce salary input accordingly."
    },
    {
      "question": "Bonuses?",
      "answer": "Supplemental withholding rules differ."
    },
    {
      "question": "2025 brackets?",
      "answer": "Illustrative flat rates only—placeholder."
    }
  ],
  "related": [
    "paycheck-calculator-usa",
    "paycheck-calculator-california",
    "paycheck-calculator-texas",
    "salary-after-tax-calculator",
    "hourly-to-salary-converter-usa"
  ]
} as unknown as ToolDefinition,
{
  "slug": "slip-and-fall-settlement-calculator",
  "name": "Slip and Fall Settlement Calculator",
  "shortDescription": "Premises liability economic + multiplier band.",
  "description": "Adds medical and wages, applies a lower multiplier than auto PI for many soft-tissue patterns. Not legal advice.",
  "category": "legal",
  "fields": [
    {
      "name": "slipMedical",
      "label": "Medical bills ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "slipLostWages",
      "label": "Lost wages ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "slipSeverity",
      "label": "Injury severity",
      "type": "select",
      "options": [
        {
          "label": "Minor",
          "value": "minor"
        },
        {
          "label": "Moderate",
          "value": "moderate"
        },
        {
          "label": "Severe",
          "value": "severe"
        },
        {
          "label": "Catastrophic",
          "value": "catastrophic"
        }
      ]
    }
  ],
  "keywords": [
    "slip and fall settlement calculator",
    "premises liability estimate",
    "slip and fall compensation"
  ],
  "howToUse": [
    "Enter your scenario details.",
    "Click calculate.",
    "Review figures as planning estimates only."
  ],
  "faqs": [
    {
      "question": "Notice requirements?",
      "answer": "Jurisdictions differ for commercial hosts."
    },
    {
      "question": "Comparative negligence?",
      "answer": "Not explicitly modeled."
    },
    {
      "question": "Insurance limits?",
      "answer": "Not modeled."
    },
    {
      "question": "Photos and incident reports?",
      "answer": "Evidence drives real outcomes."
    },
    {
      "question": "Governmental immunity?",
      "answer": "Not addressed."
    },
    {
      "question": "Mediation?",
      "answer": "Many cases settle informally."
    }
  ],
  "related": [
    "personal-injury-settlement-calculator",
    "truck-accident-settlement-calculator",
    "workers-compensation-calculator",
    "legal-fee-estimator",
    "settlement-calculator"
  ]
} as unknown as ToolDefinition,
{
  "slug": "truck-accident-settlement-calculator",
  "name": "Truck Accident Settlement Calculator",
  "shortDescription": "Higher multiplier on economic damages for commercial context.",
  "description": "Applies an elevated multiplier when commercial policy context is selected. Not legal advice.",
  "category": "legal",
  "fields": [
    {
      "name": "truckEconomicDamages",
      "label": "Economic damages ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "commercialPolicy",
      "label": "Commercial motor carrier context?",
      "type": "select",
      "options": [
        {
          "label": "Yes",
          "value": "yes"
        },
        {
          "label": "No",
          "value": "no"
        }
      ]
    }
  ],
  "keywords": [
    "truck accident settlement calculator",
    "commercial truck accident claim",
    "18 wheeler settlement"
  ],
  "howToUse": [
    "Enter your scenario details.",
    "Click calculate.",
    "Review figures as planning estimates only."
  ],
  "faqs": [
    {
      "question": "FMCSA violations?",
      "answer": "Not priced line-by-line."
    },
    {
      "question": "Multiple defendants?",
      "answer": "Not modeled."
    },
    {
      "question": "Wrongful death?",
      "answer": "Use careful counsel; this is arithmetic only."
    },
    {
      "question": "UM/UIM?",
      "answer": "Not modeled."
    },
    {
      "question": "Spoliation?",
      "answer": "Black box data matters in real cases."
    },
    {
      "question": "Policy limits?",
      "answer": "May cap recovery regardless of damages."
    }
  ],
  "related": [
    "personal-injury-settlement-calculator",
    "slip-and-fall-settlement-calculator",
    "auto-insurance-quote-estimator",
    "workers-compensation-calculator",
    "legal-fee-estimator"
  ]
} as unknown as ToolDefinition,
{
  "slug": "mesothelioma-compensation-estimator",
  "name": "Mesothelioma Compensation Estimator",
  "shortDescription": "Trust and litigation band sketch.",
  "description": "Builds a trust fund style estimate from medical and exposure inputs and a higher litigation band. Not legal advice; statutes of limitation are strict.",
  "category": "legal",
  "fields": [
    {
      "name": "mesoMedicalCosts",
      "label": "Annual medical costs ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "exposureYears",
      "label": "Years of asbestos exposure (approx)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "mesoVeteran",
      "label": "Veteran (Navy shipyard etc.)?",
      "type": "select",
      "options": [
        {
          "label": "No",
          "value": "no"
        },
        {
          "label": "Yes",
          "value": "yes"
        }
      ]
    }
  ],
  "keywords": [
    "mesothelioma compensation calculator",
    "asbestos settlement estimate",
    "mesothelioma trust fund estimate"
  ],
  "howToUse": [
    "Enter your scenario details.",
    "Click calculate.",
    "Review figures as planning estimates only."
  ],
  "faqs": [
    {
      "question": "Is this legal advice?",
      "answer": "No. Contact asbestos litigation counsel immediately."
    },
    {
      "question": "Trust payments?",
      "answer": "Paid over time; not a lump sum guarantee."
    },
    {
      "question": "VA benefits?",
      "answer": "Separate from tort recoveries—work with a VSO."
    },
    {
      "question": "SOL?",
      "answer": "Deadlines bar claims—do not delay."
    },
    {
      "question": "Bankrupt defendants?",
      "answer": "Trust systems exist because of insolvencies."
    },
    {
      "question": "Secondary exposure?",
      "answer": "Fact patterns vary widely."
    }
  ],
  "related": [
    "personal-injury-settlement-calculator",
    "workers-compensation-calculator",
    "legal-fee-estimator",
    "va-disability-rating-calculator",
    "medical-malpractice-settlement-estimator"
  ]
} as unknown as ToolDefinition,
{
  "slug": "divorce-settlement-calculator",
  "name": "Divorce Settlement Calculator",
  "shortDescription": "Equal split pool + crude alimony gap sketch.",
  "description": "Net marital assets split 50/50 in this illustration and a simple income-gap alimony percentage is shown. Not legal advice.",
  "category": "legal",
  "fields": [
    {
      "name": "homeEquity",
      "label": "Home net equity ($)",
      "type": "number",
      "step": 1
    },
    {
      "name": "retirementTotal",
      "label": "Retirement account balances ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "otherMaritalAssets",
      "label": "Other marital assets ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "maritalDebts",
      "label": "Marital debts ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "incomeSpouseA",
      "label": "Annual income spouse A ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "incomeSpouseB",
      "label": "Annual income spouse B ($)",
      "type": "number",
      "min": 0,
      "step": 1
    }
  ],
  "keywords": [
    "divorce settlement calculator",
    "asset division estimate",
    "alimony calculator sketch",
    "marital property estimate"
  ],
  "howToUse": [
    "Enter your scenario details.",
    "Click calculate.",
    "Review figures as planning estimates only."
  ],
  "faqs": [
    {
      "question": "Community vs equitable?",
      "answer": "This uses a 50/50 illustration only."
    },
    {
      "question": "Child support?",
      "answer": "Not modeled."
    },
    {
      "question": "Separate property?",
      "answer": "Tracing not modeled."
    },
    {
      "question": "Prenup?",
      "answer": "Not modeled."
    },
    {
      "question": "QDROs?",
      "answer": "Retirement splits need court orders."
    },
    {
      "question": "Tax basis?",
      "answer": "Not modeled."
    }
  ],
  "related": [
    "mortgage-payment-calculator",
    "home-equity-loan-calculator",
    "net-worth-tracker",
    "legal-fee-estimator",
    "retirement-calculator"
  ]
} as unknown as ToolDefinition,
{
  "slug": "va-disability-rating-calculator",
  "name": "VA Disability Rating Calculator",
  "shortDescription": "Sequential combine + 2025 pay bracket.",
  "description": "Combines up to five ratings using sequential whole-person math, rounds to nearest 10%, and maps to 2025 monthly compensation for a veteran alone. Not official VA math.",
  "category": "finance",
  "fields": [
    {
      "name": "rating1",
      "label": "Disability rating 1 (%)",
      "type": "number",
      "min": 0,
      "max": 100,
      "step": 1
    },
    {
      "name": "rating2",
      "label": "Disability rating 2 (%)",
      "type": "number",
      "min": 0,
      "max": 100,
      "step": 1
    },
    {
      "name": "rating3",
      "label": "Disability rating 3 (%)",
      "type": "number",
      "min": 0,
      "max": 100,
      "step": 1
    },
    {
      "name": "rating4",
      "label": "Disability rating 4 (%)",
      "type": "number",
      "min": 0,
      "max": 100,
      "step": 1
    },
    {
      "name": "rating5",
      "label": "Disability rating 5 (%)",
      "type": "number",
      "min": 0,
      "max": 100,
      "step": 1
    }
  ],
  "keywords": [
    "VA disability calculator",
    "combined VA rating",
    "VA disability pay 2025",
    "VA bilateral calculator"
  ],
  "howToUse": [
    "Enter your scenario details.",
    "Click calculate.",
    "Review figures as planning estimates only."
  ],
  "faqs": [
    {
      "question": "Is this official?",
      "answer": "No. Use VA combined tables and eBenefits."
    },
    {
      "question": "Bilateral factor?",
      "answer": "Not applied here."
    },
    {
      "question": "SMC?",
      "answer": "Not modeled."
    },
    {
      "question": "Dependents?",
      "answer": "Pay tables add amounts for spouse/children."
    },
    {
      "question": "TDIU?",
      "answer": "Separate from scheduler ratings."
    },
    {
      "question": "Appeals?",
      "answer": "Use accredited representatives."
    }
  ],
  "related": [
    "mesothelioma-compensation-estimator",
    "disability-insurance-calculator",
    "paycheck-calculator-usa",
    "workers-compensation-calculator",
    "retirement-calculator"
  ]
} as unknown as ToolDefinition,
{
  "slug": "student-loan-forgiveness-calculator",
  "name": "Student Loan Forgiveness Calculator",
  "shortDescription": "PSLF vs long IDR horizon sketch.",
  "description": "Flags PSLF if employer type is public and years reach ten; otherwise shows a crude IDR horizon in months. Not Federal Student Aid advice.",
  "category": "finance",
  "fields": [
    {
      "name": "studentLoanBalance",
      "label": "Loan balance ($)",
      "type": "number",
      "min": 0,
      "step": 1
    },
    {
      "name": "employerType",
      "label": "Employer type",
      "type": "select",
      "options": [
        {
          "label": "Private sector",
          "value": "private"
        },
        {
          "label": "Government",
          "value": "government"
        },
        {
          "label": "501(c)(3) nonprofit",
          "value": "nonprofit"
        }
      ]
    },
    {
      "name": "yearsQualifyingPayments",
      "label": "Years of qualifying payments (estimate)",
      "type": "number",
      "min": 0,
      "step": 0.25
    }
  ],
  "keywords": [
    "student loan forgiveness calculator",
    "PSLF calculator",
    "IDR forgiveness timeline",
    "student loan eligibility"
  ],
  "howToUse": [
    "Enter your scenario details.",
    "Click calculate.",
    "Review figures as planning estimates only."
  ],
  "faqs": [
    {
      "question": "Loan type matters?",
      "answer": "Only Direct loans qualify for PSLF without consolidation in many cases."
    },
    {
      "question": "IDR plans?",
      "answer": "SAVE, PAYE, IBR differ—this does not pick one."
    },
    {
      "question": "Teacher forgiveness?",
      "answer": "Not separately modeled."
    },
    {
      "question": "Borrower defense?",
      "answer": "Fact-specific."
    },
    {
      "question": "Tax on forgiveness?",
      "answer": "IDR forgiveness may be taxable federally depending on year/law."
    },
    {
      "question": "Payment counts?",
      "answer": "Must be full, on-time, while employed eligible."
    }
  ],
  "related": [
    "loan-calculator",
    "early-loan-payoff-calculator",
    "w4-tax-withholding-calculator",
    "paycheck-calculator-usa",
    "budget-planner-monthly-usa"
  ]
} as unknown as ToolDefinition,

];
