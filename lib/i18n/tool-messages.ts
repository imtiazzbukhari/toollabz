import { DEFAULT_LOCALE, LOCALES, type Locale } from "./locales";
import type { LocalizedToolSlug } from "./catalog";

export type ToolCopy = {
  name: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  whatItDoes: string;
  whoItsFor: string;
  howItWorks: string;
  formula: string;
  assumptions: string[];
  limitations: string[];
  example: string;
  howToUse: string[];
  faqs: { question: string; answer: string }[];
  fields: Record<string, string>;
};

const EN: Record<LocalizedToolSlug, ToolCopy> = {
  "loan-calculator": {
    name: "Loan calculator",
    title: "Loan calculator — monthly payment and total interest",
    description:
      "Work out monthly repayments, total interest and a simple amortisation view. Principal and interest only — fees are excluded unless you add them.",
    h1: "Loan calculator",
    intro:
      "Enter principal, annual interest rate and term to see the fixed monthly payment. The same annuity formula is used in every language version of this page.",
    whatItDoes:
      "It solves the standard amortising-loan payment: how much you pay each month if rate and term stay fixed, then shows total interest over the term.",
    whoItsFor:
      "People comparing a personal loan, car finance or a simple mortgage quote who want the maths before they talk to a lender.",
    howItWorks:
      "The monthly rate is the annual rate divided by 12. The payment uses the annuity formula so early instalments are mostly interest and later ones are mostly principal.",
    formula: "M = P × r(1+r)^n / ((1+r)^n − 1), where r is the monthly rate and n is the number of months.",
    assumptions: [
      "Interest is compounded monthly and the rate does not change.",
      "Payments are equal and made at the end of each month.",
      "Fees, insurance, tax and overpayments are not included unless you fold them into the principal.",
    ],
    limitations: [
      "This is not a lender decision or a credit-score model.",
      "Introductory or variable rates need a different schedule.",
      "Currency formatting follows your inputs; the engine does not apply local lending law.",
    ],
    example:
      "A principal of 10,000 at 7.49% APR over 5 years is about 200 per month in principal and interest only (exact figure depends on rounding).",
    howToUse: [
      "Enter the amount you want to borrow.",
      "Enter the annual interest rate from your quote.",
      "Enter the term in years or months, then read the monthly payment and total interest.",
    ],
    faqs: [
      {
        question: "Does this include arrangement fees?",
        answer: "No. Add fees to the principal if you want them in the monthly figure, or treat them separately.",
      },
      {
        question: "Can I use it for a mortgage?",
        answer: "You can estimate principal-and-interest. Taxes, insurance and lender stress tests are not included.",
      },
      {
        question: "Is the formula the same in every language?",
        answer: "Yes. Only the surrounding explanation is translated. The calculation engine is identical.",
      },
    ],
    fields: { principal: "Principal", rate: "Annual interest rate", term: "Term" },
  },
  "salary-after-tax-calculator": {
    name: "Salary after tax calculator",
    title: "UK salary after tax — take-home pay estimate",
    description:
      "Estimate UK take-home pay after income tax and National Insurance. This page explains a UK tax-year model; it is not a local tax engine for other countries.",
    h1: "Salary after tax calculator (UK)",
    intro:
      "This calculator estimates UK take-home pay using the published UK tax-year rules implemented on Toollabz. Other countries have different bands and social charges — do not treat this result as local law outside the UK.",
    whatItDoes:
      "It subtracts modelled UK income tax and National Insurance (and optional student-loan or pension inputs when you fill those fields) from gross pay.",
    whoItsFor:
      "People with UK employment income who want a planning estimate before a formal payroll figure.",
    howItWorks:
      "Gross pay is run through the tax bands and NI thresholds configured for the labelled tax year on the English tool. Rounding follows that model, not your employer’s payroll software.",
    formula: "Take-home ≈ gross − income tax − National Insurance − optional deductions entered on the form.",
    assumptions: [
      "UK resident employee defaults unless you change the optional fields.",
      "Scottish rates, benefits-in-kind and emergency tax codes may differ.",
      "The labelled tax year on the tool is the one that applies.",
    ],
    limitations: [
      "Not a P60 or a personal tax return.",
      "Not valid as a France / Spain / Portugal (or other) income-tax calculator.",
      "Confirm unusual cases with HMRC guidance or a qualified adviser.",
    ],
    example: "A UK salary in the basic-rate band loses income tax at 20% on taxable pay above the personal allowance, plus NI on earnings above the primary threshold.",
    howToUse: [
      "Enter annual or monthly gross pay.",
      "Set the options that apply (pension, student loan) if the form shows them.",
      "Read estimated net pay and the tax / NI split.",
    ],
    faqs: [
      {
        question: "Is this a local tax calculator for my country?",
        answer: "No. It models UK rules. Use a dedicated local tool if you need another country’s withholding.",
      },
      {
        question: "Why might payroll disagree?",
        answer: "Payroll can apply a different tax code, benefits, or year-to-date basis than this planning model.",
      },
      {
        question: "Which year is used?",
        answer: "The tax year labelled on the calculator page. Check that label before you rely on the figure.",
      },
    ],
    fields: { salary: "Gross salary", period: "Pay period" },
  },
  "vat-calculator": {
    name: "VAT calculator",
    title: "UK VAT calculator — add or remove VAT",
    description:
      "Add or remove UK VAT at 20%, 5% or 0%. This is a UK VAT arithmetic tool, not a French TVA or Spanish IVA filing calculator.",
    h1: "VAT calculator (UK rates)",
    intro:
      "Enter a net or gross amount and a UK VAT rate to see the other side and the VAT amount. Rates follow UK VAT categories, not another country’s VAT/GST schedule.",
    whatItDoes: "It multiplies or divides by (1 + rate) to add or strip UK VAT at the rate you select.",
    whoItsFor: "People issuing or checking UK invoices who need the net, VAT and gross split.",
    howItWorks: "Gross = net × (1 + r). VAT = gross − net. Reverse VAT divides the gross by (1 + r).",
    formula: "gross = net × (1 + r); net = gross / (1 + r); VAT = gross − net.",
    assumptions: [
      "You choose the correct UK rate (standard, reduced or zero).",
      "No other duties or discounts are applied unless you include them in the amount.",
    ],
    limitations: [
      "Does not file a VAT return or apply EU OSS rules.",
      "Does not claim to be a France / Spain / other national VAT engine.",
      "Registration thresholds and schemes change — check HMRC for filing.",
    ],
    example: "Net 100 at 20% standard VAT → VAT 20, gross 120.",
    howToUse: ["Enter the amount.", "Choose add or remove VAT and the rate.", "Read net, VAT and gross."],
    faqs: [
      {
        question: "Is 20% the only UK rate?",
        answer: "No. Reduced (5%) and zero-rated supplies exist. Choose the rate that matches the supply.",
      },
      {
        question: "Can I use this for TVA / IVA in another country?",
        answer: "You can do the same arithmetic with a custom rate, but the page does not implement another country’s VAT law.",
      },
    ],
    fields: { amount: "Amount", rate: "VAT rate" },
  },
  "compound-interest-calculator": {
    name: "Compound interest calculator",
    title: "Compound interest — future value",
    description: "See how a balance grows with daily, monthly or annual compounding. Formula: A = P(1+r/n)^(nt).",
    h1: "Compound interest calculator",
    intro: "Enter starting principal, annual rate, years and compounding frequency to see the future value and interest earned.",
    whatItDoes: "It applies compound interest for the frequency you choose and optionally adds regular contributions if the form supports them.",
    whoItsFor: "Savers and students who want the growth path, not a product recommendation.",
    howItWorks: "Each period the rate is r/n. After nt periods the balance is P(1+r/n)^(nt), plus any contribution schedule on the form.",
    formula: "A = P(1 + r/n)^(n t)",
    assumptions: ["The rate stays constant.", "No tax drag unless you model it yourself.", "Deposits occur on the schedule implied by the fields."],
    limitations: ["Not investment advice.", "Inflation and fees are excluded unless you reduce the rate yourself."],
    example: "10,000 at 5% compounded annually for 20 years is about 26,533 before tax and fees.",
    howToUse: ["Enter principal and annual rate.", "Set years and compounding frequency.", "Read future value and interest."],
    faqs: [
      { question: "What is the Rule of 72?", answer: "72 divided by the annual rate roughly estimates years to double. It is an approximation, not this calculator’s output." },
      { question: "Daily vs monthly?", answer: "More frequent compounding earns slightly more at the same nominal annual rate." },
    ],
    fields: { principal: "Principal", rate: "Annual rate", years: "Years" },
  },
  "roi-calculator": {
    name: "ROI calculator",
    title: "ROI calculator — return on investment",
    description: "Calculate simple ROI and, when you enter time, a rough annualised return. Not a market forecast.",
    h1: "ROI calculator",
    intro: "Enter cost and gain (or final value) to see return on investment as a percentage. Optional holding period supports a simple annualised figure.",
    whatItDoes: "It computes (gain − cost) / cost. If you supply a period, it also shows a simple annualised rate.",
    whoItsFor: "Marketers, founders and students comparing a past spend to a past return.",
    howItWorks: "ROI% = ((ending value − cost) / cost) × 100. Annualisation uses a simple power if a duration is provided.",
    formula: "ROI = (gain − cost) / cost",
    assumptions: ["Cash amounts are in the same currency.", "No risk adjustment or tax."],
    limitations: ["Ignores timing of intermediate cash flows unless you net them into cost/gain.", "Not a substitute for IRR on complex projects."],
    example: "Spend 1,000, receive 1,300 → ROI = 30%.",
    howToUse: ["Enter what you spent.", "Enter what you got back.", "Optionally add the holding period."],
    faqs: [
      { question: "Is this IRR?", answer: "No. IRR needs a cash-flow schedule. This page is simple ROI." },
      { question: "Can ROI be negative?", answer: "Yes, if the gain is below cost." },
    ],
    fields: { cost: "Cost", gain: "Gain or final value" },
  },
  "profit-margin-calculator": {
    name: "Profit margin calculator",
    title: "Profit margin and markup",
    description: "Convert between margin and markup. Margin uses revenue in the denominator; markup uses cost.",
    h1: "Profit margin calculator",
    intro: "Enter cost and selling price (or revenue) to see gross margin and markup. The two percentages are not interchangeable.",
    whatItDoes: "It reports margin = (price − cost) / price and markup = (price − cost) / cost.",
    whoItsFor: "Retailers and freelancers setting a price who need both figures on the same page.",
    howItWorks: "Profit is price minus cost. Divide by price for margin, by cost for markup.",
    formula: "margin = (P − C) / P; markup = (P − C) / C",
    assumptions: ["One product or a blended average.", "No VAT unless you decide whether amounts are net or gross."],
    limitations: ["Ignores overhead unless you put it in cost.", "Not a full P&L."],
    example: "Cost 60, price 100 → margin 40%, markup 66.7%.",
    howToUse: ["Enter cost.", "Enter selling price.", "Compare margin and markup."],
    faqs: [
      { question: "Why are margin and markup different?", answer: "They use different denominators. A 40% margin is a 66.7% markup." },
      { question: "Should I include VAT?", answer: "Be consistent: both inputs net or both gross." },
    ],
    fields: { cost: "Cost", price: "Selling price" },
  },
  "percentage-calculator": {
    name: "Percentage calculator",
    title: "Percentage calculator — of, is, and change",
    description: "Find X% of Y, what percent X is of Y, or percentage change. Instant arithmetic, no account.",
    h1: "Percentage calculator",
    intro: "Three common percentage jobs on one page: part of a whole, reverse percentage, and change between two numbers.",
    whatItDoes: "It applies the three school formulas without adding tax, compounding or currency conversion.",
    whoItsFor: "Anyone checking a discount, a grade or a change between two values.",
    howItWorks: "X% of Y = X/100 × Y. ‘X is what % of Y’ = X/Y × 100. Change = (new − old) / old × 100.",
    formula: "part = p/100 × whole; percent = part/whole × 100; change = (new − old)/old × 100",
    assumptions: ["Numbers are exact as entered.", "Change uses the first value as the base."],
    limitations: ["Does not handle successive discounts unless you chain the results yourself."],
    example: "25% of 80 = 20. 20 is 25% of 80. 80 → 100 is a 25% increase.",
    howToUse: ["Pick the mode you need.", "Enter the two numbers.", "Read the result and the short explanation."],
    faqs: [
      { question: "Is percentage change the same as percentage points?", answer: "No. A rate moving from 10% to 12% is 2 percentage points and a 20% relative change." },
    ],
    fields: { value: "Value", percent: "Percent" },
  },
  "currency-converter": {
    name: "Currency converter",
    title: "Currency converter — mid-market style rates",
    description: "Convert between currencies using the live mid-market feed Toollabz loads in the browser. Not a bank quote.",
    h1: "Currency converter",
    intro: "Pick two currencies and an amount. The rate comes from the public mid-market source used by the tool, not from a card issuer or bureau.",
    whatItDoes: "It multiplies the amount by the selected pair’s rate at fetch time.",
    whoItsFor: "Travellers and shoppers who want a mid-market reference before they accept a card or airport rate.",
    howItWorks: "The page requests rates from the configured provider and multiplies. If the feed is down, the tool says so instead of inventing a number.",
    formula: "converted = amount × rate(from → to)",
    assumptions: ["Mid-market, not a retail bid/ask.", "No weekend or bank-spread adjustment unless the feed includes it."],
    limitations: ["Not an FX trade.", "Airport bureaux often charge several percent more than mid-market."],
    example: "If EUR/USD is 1.10, 100 EUR is 110 USD at mid-market before fees.",
    howToUse: ["Choose the source currency.", "Choose the target currency.", "Enter the amount and read the converted figure."],
    faqs: [
      { question: "Why does my bank differ?", answer: "Banks add a spread and sometimes a fee on top of mid-market." },
      { question: "Are rates live?", answer: "They refresh from the provider when the page fetches. They are not guaranteed tick-by-tick." },
    ],
    fields: { amount: "Amount", from: "From", to: "To" },
  },
  "bmi-calculator": {
    name: "BMI calculator",
    title: "BMI calculator — adult body-mass index",
    description: "Adult BMI from height and weight using kg/m². Categories follow common WHO adult bands; they are not a diagnosis.",
    h1: "BMI calculator",
    intro: "Enter height and weight to see adult BMI and the usual category band. BMI does not measure fat, fitness or health on its own.",
    whatItDoes: "It computes weight(kg) / height(m)² and maps the number onto standard adult bands.",
    whoItsFor: "Adults who want the same arithmetic a clinic chart uses, plus the limits of that chart.",
    howItWorks: "Height is converted to metres if you enter centimetres. BMI is mass over height squared.",
    formula: "BMI = kg / m²",
    assumptions: ["Adult interpretation bands.", "Height and weight are accurate."],
    limitations: [
      "Not a medical diagnosis.",
      "Athletes, pregnancy, children and some ethnic groups need different clinical context.",
    ],
    example: "175 cm and 75 kg → BMI ≈ 24.5 (often labelled healthy weight on adult WHO charts).",
    howToUse: ["Enter height.", "Enter weight.", "Read BMI and the category note, including the limitations."],
    faqs: [
      { question: "Is a ‘healthy’ BMI healthy?", answer: "It is only a population screening number. A clinician uses more context." },
      { question: "Can I use it for children?", answer: "Children use age- and sex-specific charts. This page is for adults." },
    ],
    fields: { height: "Height", weight: "Weight" },
  },
  "json-formatter": {
    name: "JSON formatter",
    title: "JSON formatter and validator",
    description: "Format, validate and minify JSON in the browser. Invalid JSON shows a parse error. Nothing is uploaded for formatting.",
    h1: "JSON formatter",
    intro: "Paste JSON to pretty-print or minify it. The parser runs in your browser so the document does not need to leave the device for this task.",
    whatItDoes: "It parses the text as JSON and reprints it with indentation, or compactly, or reports the first syntax error.",
    whoItsFor: "Developers checking API payloads, config files or a copied object.",
    howItWorks: "JSON.parse on the input, then JSON.stringify with a chosen indent. Errors come from the parser, not from a server.",
    formula: "Parse → reprint. No numerical formula.",
    assumptions: ["Input is text you are allowed to process locally.", "Standard JSON, not JSON5, unless the page says otherwise."],
    limitations: ["Very large documents may hit browser memory limits.", "Does not fetch URLs for you."],
    example: '{"a":1} becomes a two-line pretty document with an indented key.',
    howToUse: ["Paste the JSON.", "Choose format or minify.", "Fix the reported line if the parser fails."],
    faqs: [
      { question: "Why did it fail on a trailing comma?", answer: "Standard JSON does not allow trailing commas. Remove them or convert the file." },
      { question: "Is my data sent to Toollabz?", answer: "Formatting runs in the browser. Do not paste secrets into any third-party page if your policy forbids it." },
    ],
    fields: { json: "JSON" },
  },
  "password-generator": {
    name: "Password generator",
    title: "Password generator — random, in-browser",
    description: "Generate a random password with the Web Crypto API in your browser. Characters are not sent to Toollabz to create the password.",
    h1: "Password generator",
    intro: "Choose length and character classes. The generator draws from the browser’s cryptographic random source when available.",
    whatItDoes: "It builds a string from the selected alphabet using secure randomness in the client.",
    whoItsFor: "Anyone creating a new password who wants the generation to stay on-device.",
    howItWorks: "A cryptographically strong RNG picks indices into the allowed character set until the requested length is reached.",
    formula: "Uniform draws from the selected alphabet. No password is derived from your name or the page URL.",
    assumptions: ["The browser provides crypto.getRandomValues or an equivalent.", "You store the result in a password manager."],
    limitations: ["Does not check whether a password has appeared in a public breach.", "A short alphabet reduces strength even at long lengths."],
    example: "16 characters with upper, lower, digits and symbols is a common default; longer is stronger if you can store it.",
    howToUse: ["Set the length.", "Toggle character classes.", "Copy the result into a password manager — not into email."],
    faqs: [
      { question: "Do you store the password?", answer: "Generation is client-side. We do not need the password to render the page." },
      { question: "Is longer always better?", answer: "Length helps, but a tiny character set or a reused password still fails." },
    ],
    fields: { length: "Length" },
  },
  "pdf-merge": {
    name: "PDF merge",
    title: "Merge PDF files in the browser",
    description: "Combine PDF files in your browser where the tool supports on-device merge. Check the page if a file is sent for processing.",
    h1: "Merge PDF files",
    intro: "Add two or more PDFs and download a single file. Prefer on-device merge for confidential documents; read the on-page note for this build.",
    whatItDoes: "It concatenates pages from the selected PDFs in the order you choose.",
    whoItsFor: "People combining scans, statements or slides into one attachment.",
    howItWorks: "Each source PDF is read, pages are copied into a new document, then you download the result.",
    formula: "Page concatenation. No numerical formula.",
    assumptions: ["Files are valid PDFs you are allowed to combine.", "Order is the order shown in the list."],
    limitations: [
      "Encrypted or damaged PDFs may fail.",
      "Very large merges can hit browser memory limits.",
      "This is not an e-sign or OCR product.",
    ],
    example: "File A (2 pages) + File B (3 pages) → one 5-page PDF in that order.",
    howToUse: ["Add the PDF files.", "Reorder if needed.", "Download the merged file."],
    faqs: [
      { question: "Are my files uploaded?", answer: "Use the notice on the tool page for this deployment. Prefer tools that stay on-device for confidential files." },
      { question: "Can I merge scanned images?", answer: "Convert images to PDF first, then merge." },
    ],
    fields: { files: "PDF files" },
  },
};

type PartialTool = Partial<Omit<ToolCopy, "assumptions" | "limitations" | "howToUse" | "faqs" | "fields">> & {
  assumptions?: string[];
  limitations?: string[];
  howToUse?: string[];
  faqs?: { question: string; answer: string }[];
  fields?: Record<string, string>;
};

function mergeTool(base: ToolCopy, over?: PartialTool): ToolCopy {
  if (!over) return base;
  return {
    ...base,
    ...over,
    assumptions: over.assumptions ?? base.assumptions,
    limitations: over.limitations ?? base.limitations,
    howToUse: over.howToUse ?? base.howToUse,
    faqs: over.faqs ?? base.faqs,
    fields: over.fields ? { ...base.fields, ...over.fields } : base.fields,
  };
}

/**
 * Locale-specific user-facing copy. Calculation engine stays English-identical.
 * Country-specific tools (UK VAT / UK salary) stay labelled as UK in every language.
 */
const OVERRIDES: Record<Exclude<Locale, "en">, Partial<Record<LocalizedToolSlug, PartialTool>>> = {
  fr: {
    "loan-calculator": {
      name: "Calculateur de prêt",
      title: "Calculateur de prêt — mensualité et intérêts",
      description: "Calculez la mensualité, le coût des intérêts et un amortissement simple. Hors frais, sauf si vous les ajoutez au capital.",
      h1: "Calculateur de prêt",
      intro: "Saisissez le capital, le taux annuel et la durée pour obtenir une mensualité fixe. La formule d’annuité est la même dans toutes les langues.",
      whatItDoes: "Il calcule la mensualité d’un prêt amortissable à taux et durée fixes, puis le total des intérêts.",
      whoItsFor: "Toute personne qui compare un prêt perso, un crédit auto ou une offre immobilière simple avant de parler au prêteur.",
      howItWorks: "Le taux mensuel est le taux annuel divisé par 12. La formule d’annuité fait que les premières échéances sont surtout des intérêts.",
      formula: "M = P × r(1+r)^n / ((1+r)^n − 1), r = taux mensuel, n = nombre de mois.",
      assumptions: ["Taux constant, composition mensuelle.", "Échéances égales en fin de mois.", "Frais, assurance et impôts exclus sauf s’ils sont dans le capital."],
      limitations: ["Ce n’est pas une décision de crédit.", "Un taux variable demande un autre échéancier.", "Aucune loi locale sur le crédit n’est appliquée."],
      example: "10 000 à 7,49 % sur 5 ans ≈ 200 par mois (capital + intérêts, hors frais).",
      howToUse: ["Saisissez le capital.", "Saisissez le taux annuel de l’offre.", "Saisissez la durée, puis lisez la mensualité et les intérêts."],
      faqs: [
        { question: "Les frais de dossier sont-ils inclus ?", answer: "Non. Ajoutez-les au capital ou traitez-les à part." },
        { question: "Puis-je l’utiliser pour un prêt immobilier ?", answer: "Pour le capital et les intérêts, oui. Taxes, assurance et stress tests du prêteur sont exclus." },
        { question: "La formule change-t-elle selon la langue ?", answer: "Non. Seul le texte autour est traduit." },
      ],
      fields: { principal: "Capital", rate: "Taux annuel", term: "Durée" },
    },
    "salary-after-tax-calculator": {
      name: "Calculateur de salaire net (UK)",
      title: "Salaire net au Royaume-Uni — estimation",
      description: "Estime le salaire net britannique après income tax et National Insurance. Ce n’est pas un moteur fiscal français ou d’un autre pays.",
      h1: "Salaire net après impôt (Royaume-Uni)",
      intro: "Cet outil suit les règles britanniques implémentées sur Toollabz. Ne l’utilisez pas comme calcul d’impôt local hors Royaume-Uni.",
      whatItDoes: "Il retranche un modèle d’impôt sur le revenu UK et de NI (plus options si vous les remplissez) du brut.",
      whoItsFor: "Personnes payées au Royaume-Uni qui veulent une estimation avant la fiche de paie.",
      howItWorks: "Le brut passe par les tranches et seuils NI de l’année fiscale indiquée sur l’outil anglais.",
      limitations: ["Pas une déclaration fiscale.", "Pas un calculateur d’impôt français, espagnol ou portugais.", "Vérifiez les cas particuliers auprès d’HMRC ou d’un conseiller."],
      fields: { salary: "Salaire brut", period: "Période" },
    },
    "vat-calculator": {
      name: "Calculateur de TVA (UK)",
      title: "TVA britannique — ajouter ou retirer",
      description: "Ajoute ou retire la TVA britannique à 20 %, 5 % ou 0 %. Ce n’est pas un outil de déclaration de TVA française.",
      h1: "Calculateur de TVA (taux UK)",
      intro: "Saisissez un montant HT ou TTC et un taux de TVA britannique. Les taux suivent les catégories UK, pas un barème d’un autre pays.",
      whatItDoes: "Il multiplie ou divise par (1 + taux) pour ajouter ou ôter la TVA UK.",
      example: "HT 100 à 20 % → TVA 20, TTC 120.",
      fields: { amount: "Montant", rate: "Taux de TVA" },
    },
    "compound-interest-calculator": {
      name: "Calculateur d’intérêts composés",
      title: "Intérêts composés — valeur future",
      description: "Voyez comment un capital croît avec une composition quotidienne, mensuelle ou annuelle. A = P(1+r/n)^(nt).",
      h1: "Calculateur d’intérêts composés",
      intro: "Saisissez le capital, le taux annuel, la durée et la fréquence de composition.",
      example: "10 000 à 5 % par an pendant 20 ans ≈ 26 533 avant impôts et frais.",
      fields: { principal: "Capital", rate: "Taux annuel", years: "Années" },
    },
    "roi-calculator": {
      name: "Calculateur de ROI",
      title: "ROI — retour sur investissement",
      description: "Calcule le ROI simple et, si vous indiquez une durée, un taux annualisé approximatif.",
      h1: "Calculateur de ROI",
      example: "Dépense 1 000, retour 1 300 → ROI = 30 %.",
      fields: { cost: "Coût", gain: "Gain ou valeur finale" },
    },
    "profit-margin-calculator": {
      name: "Calculateur de marge",
      title: "Marge et coefficient / markup",
      description: "Passez de la marge au markup. La marge divise par le prix ; le markup divise par le coût.",
      h1: "Calculateur de marge bénéficiaire",
      example: "Coût 60, prix 100 → marge 40 %, markup 66,7 %.",
      fields: { cost: "Coût", price: "Prix de vente" },
    },
    "percentage-calculator": {
      name: "Calculateur de pourcentages",
      title: "Pourcentages — de, est, et variation",
      description: "Calcule X % de Y, quel pourcentage représente X, ou la variation entre deux nombres.",
      h1: "Calculateur de pourcentages",
      fields: { value: "Valeur", percent: "Pourcentage" },
    },
    "currency-converter": {
      name: "Convertisseur de devises",
      title: "Convertisseur de devises — cours mid-market",
      description: "Convertit des devises avec le flux mid-market chargé dans le navigateur. Ce n’est pas un cours bancaire.",
      h1: "Convertisseur de devises",
      fields: { amount: "Montant", from: "De", to: "Vers" },
    },
    "bmi-calculator": {
      name: "Calculateur d’IMC",
      title: "IMC adulte — indice de masse corporelle",
      description: "IMC adulte en kg/m². Les catégories suivent des bandes OMS adultes courantes ; ce n’est pas un diagnostic.",
      h1: "Calculateur d’IMC",
      example: "175 cm et 75 kg → IMC ≈ 24,5.",
      fields: { height: "Taille", weight: "Poids" },
    },
    "json-formatter": {
      name: "Formateur JSON",
      title: "Formateur et validateur JSON",
      description: "Formate, valide et minifie du JSON dans le navigateur. Rien n’est envoyé pour le formatage.",
      h1: "Formateur JSON",
      fields: { json: "JSON" },
    },
    "password-generator": {
      name: "Générateur de mot de passe",
      title: "Mot de passe aléatoire — dans le navigateur",
      description: "Génère un mot de passe avec l’API Web Crypto du navigateur. Il n’est pas envoyé à Toollabz pour être créé.",
      h1: "Générateur de mot de passe",
      fields: { length: "Longueur" },
    },
    "pdf-merge": {
      name: "Fusionner des PDF",
      title: "Fusionner des PDF dans le navigateur",
      description: "Combinez des PDF. Lisez la mention sur la page si un fichier est envoyé pour traitement.",
      h1: "Fusionner des fichiers PDF",
      fields: { files: "Fichiers PDF" },
    },
  },
  pt: {
    "loan-calculator": {
      name: "Calculadora de empréstimo",
      title: "Calculadora de empréstimo — prestação e juros",
      description: "Calcule a prestação mensal, os juros totais e uma amortização simples. Sem comissões, salvo se as incluir no capital.",
      h1: "Calculadora de empréstimo",
      intro: "Introduza capital, taxa anual e prazo para ver a prestação fixa. A fórmula de anuidade é a mesma em todos os idiomas.",
      whatItDoes: "Resolve a prestação de um empréstimo amortizável com taxa e prazo fixos e mostra o total de juros.",
      example: "10 000 a 7,49% em 5 anos ≈ 200 por mês (capital e juros, sem comissões).",
      fields: { principal: "Capital", rate: "Taxa anual", term: "Prazo" },
    },
    "salary-after-tax-calculator": {
      name: "Calculadora de salário líquido (UK)",
      title: "Salário líquido no Reino Unido",
      description: "Estima o salário líquido britânico após imposto e National Insurance. Não é um motor fiscal de outro país.",
      h1: "Salário após imposto (Reino Unido)",
      intro: "Este cálculo segue regras do Reino Unido. Não o trate como imposto local fora do UK.",
      fields: { salary: "Salário bruto", period: "Período" },
    },
    "vat-calculator": {
      name: "Calculadora de IVA (UK)",
      title: "IVA britânico — adicionar ou remover",
      description: "Adiciona ou remove IVA do Reino Unido a 20%, 5% ou 0%. Não substitui uma declaração de IVA noutro país.",
      h1: "Calculadora de IVA (taxas UK)",
      fields: { amount: "Montante", rate: "Taxa de IVA" },
    },
    "compound-interest-calculator": {
      name: "Calculadora de juro composto",
      title: "Juro composto — valor futuro",
      h1: "Calculadora de juro composto",
      fields: { principal: "Capital", rate: "Taxa anual", years: "Anos" },
    },
    "roi-calculator": { name: "Calculadora de ROI", title: "ROI — retorno do investimento", h1: "Calculadora de ROI", fields: { cost: "Custo", gain: "Ganho ou valor final" } },
    "profit-margin-calculator": { name: "Calculadora de margem", title: "Margem e markup", h1: "Calculadora de margem de lucro", fields: { cost: "Custo", price: "Preço de venda" } },
    "percentage-calculator": { name: "Calculadora de percentagens", title: "Percentagens — de, é, e variação", h1: "Calculadora de percentagens", fields: { value: "Valor", percent: "Percentagem" } },
    "currency-converter": { name: "Conversor de moedas", title: "Conversor de moedas — câmbio mid-market", h1: "Conversor de moedas", fields: { amount: "Montante", from: "De", to: "Para" } },
    "bmi-calculator": { name: "Calculadora de IMC", title: "IMC adulto", h1: "Calculadora de IMC", fields: { height: "Altura", weight: "Peso" } },
    "json-formatter": { name: "Formatador JSON", title: "Formatar e validar JSON", h1: "Formatador JSON", fields: { json: "JSON" } },
    "password-generator": { name: "Gerador de palavras-passe", title: "Palavra-passe aleatória no browser", h1: "Gerador de palavras-passe", fields: { length: "Comprimento" } },
    "pdf-merge": { name: "Juntar PDF", title: "Juntar ficheiros PDF", h1: "Juntar ficheiros PDF", fields: { files: "Ficheiros PDF" } },
  },
  es: {
    "loan-calculator": {
      name: "Calculadora de préstamos",
      title: "Calculadora de préstamos — cuota e intereses",
      description: "Calcula la cuota mensual, los intereses totales y una amortización simple. Sin comisiones salvo que las sumes al capital.",
      h1: "Calculadora de préstamos",
      intro: "Introduce capital, tipo anual y plazo para ver la cuota fija. La fórmula de anualidad es la misma en todos los idiomas.",
      example: "10 000 al 7,49% en 5 años ≈ 200 al mes (capital e intereses, sin comisiones).",
      fields: { principal: "Capital", rate: "Tipo anual", term: "Plazo" },
    },
    "salary-after-tax-calculator": {
      name: "Calculadora de sueldo neto (UK)",
      title: "Sueldo neto en el Reino Unido",
      description: "Estima el sueldo neto británico tras el impuesto y la National Insurance. No es un motor fiscal de otro país.",
      h1: "Sueldo después de impuestos (Reino Unido)",
      intro: "Este cálculo sigue normas del Reino Unido. No lo uses como IRPF u otro impuesto local.",
      fields: { salary: "Salario bruto", period: "Periodo" },
    },
    "vat-calculator": {
      name: "Calculadora de IVA (UK)",
      title: "IVA británico — añadir o quitar",
      description: "Añade o quita el IVA del Reino Unido al 20%, 5% o 0%. No sustituye una declaración de IVA de otro país.",
      h1: "Calculadora de IVA (tipos UK)",
      fields: { amount: "Importe", rate: "Tipo de IVA" },
    },
    "compound-interest-calculator": { name: "Calculadora de interés compuesto", title: "Interés compuesto — valor futuro", h1: "Calculadora de interés compuesto", fields: { principal: "Capital", rate: "Tipo anual", years: "Años" } },
    "roi-calculator": { name: "Calculadora de ROI", title: "ROI — retorno de la inversión", h1: "Calculadora de ROI", fields: { cost: "Coste", gain: "Ganancia o valor final" } },
    "profit-margin-calculator": { name: "Calculadora de margen", title: "Margen y markup", h1: "Calculadora de margen de beneficio", fields: { cost: "Coste", price: "Precio de venta" } },
    "percentage-calculator": { name: "Calculadora de porcentajes", title: "Porcentajes — de, es, y variación", h1: "Calculadora de porcentajes", fields: { value: "Valor", percent: "Porcentaje" } },
    "currency-converter": { name: "Conversor de divisas", title: "Conversor de divisas — tipo mid-market", h1: "Conversor de divisas", fields: { amount: "Importe", from: "De", to: "A" } },
    "bmi-calculator": { name: "Calculadora de IMC", title: "IMC adulto", h1: "Calculadora de IMC", fields: { height: "Altura", weight: "Peso" } },
    "json-formatter": { name: "Formateador JSON", title: "Formatear y validar JSON", h1: "Formateador JSON", fields: { json: "JSON" } },
    "password-generator": { name: "Generador de contraseñas", title: "Contraseña aleatoria en el navegador", h1: "Generador de contraseñas", fields: { length: "Longitud" } },
    "pdf-merge": { name: "Unir PDF", title: "Unir archivos PDF", h1: "Unir archivos PDF", fields: { files: "Archivos PDF" } },
  },
  da: {
    "loan-calculator": { name: "Låneberegner", title: "Låneberegner — ydelse og renter", h1: "Låneberegner", description: "Beregn månedlig ydelse og samlede renter. Gebyrer er ikke med, medmindre du lægger dem ind i hovedstolen.", fields: { principal: "Hovedstol", rate: "Årlig rente", term: "Løbetid" } },
    "salary-after-tax-calculator": { name: "Nettolønsberegner (UK)", title: "Nettoløn i Storbritannien", h1: "Løn efter skat (Storbritannien)", description: "Estimerer britisk nettoløn. Det er ikke en lokal skatemodel for andre lande.", fields: { salary: "Bruttoløn", period: "Periode" } },
    "vat-calculator": { name: "Momsberegner (UK)", title: "Britisk moms — læg til eller fjern", h1: "Momsberegner (UK-satser)", fields: { amount: "Beløb", rate: "Momssats" } },
    "compound-interest-calculator": { name: "Renters rente-beregner", title: "Renters rente — fremtidig værdi", h1: "Renters rente-beregner", fields: { principal: "Hovedstol", rate: "Årlig rente", years: "År" } },
    "roi-calculator": { name: "ROI-beregner", title: "ROI — afkast", h1: "ROI-beregner", fields: { cost: "Omkostning", gain: "Gevinst eller slutværdi" } },
    "profit-margin-calculator": { name: "Dækningsbidragsberegner", title: "Margin og markup", h1: "Avanceberegner", fields: { cost: "Kostpris", price: "Salgspris" } },
    "percentage-calculator": { name: "Procentberegner", title: "Procent — af, er og ændring", h1: "Procentberegner", fields: { value: "Værdi", percent: "Procent" } },
    "currency-converter": { name: "Valutaomregner", title: "Valutaomregner — mid-market", h1: "Valutaomregner", fields: { amount: "Beløb", from: "Fra", to: "Til" } },
    "bmi-calculator": { name: "BMI-beregner", title: "BMI for voksne", h1: "BMI-beregner", fields: { height: "Højde", weight: "Vægt" } },
    "json-formatter": { name: "JSON-formatter", title: "Formatér og validér JSON", h1: "JSON-formatter", fields: { json: "JSON" } },
    "password-generator": { name: "Adgangskodegenerator", title: "Tilfældig adgangskode i browseren", h1: "Adgangskodegenerator", fields: { length: "Længde" } },
    "pdf-merge": { name: "Flet PDF", title: "Flet PDF-filer", h1: "Flet PDF-filer", fields: { files: "PDF-filer" } },
  },
  sv: {
    "loan-calculator": { name: "Lånekalkylator", title: "Lånekalkylator — månadsbelopp och ränta", h1: "Lånekalkylator", description: "Beräkna månadsbelopp och total ränta. Avgifter ingår inte om du inte lägger dem i beloppet.", fields: { principal: "Belopp", rate: "Årsränta", term: "Löptid" } },
    "salary-after-tax-calculator": { name: "Nettolönekalkylator (UK)", title: "Nettolön i Storbritannien", h1: "Lön efter skatt (Storbritannien)", description: "Uppskattar brittisk nettolön. Inte en lokal skattemodell för andra länder.", fields: { salary: "Bruttolön", period: "Period" } },
    "vat-calculator": { name: "Momsräknare (UK)", title: "Brittisk moms — lägg till eller ta bort", h1: "Momsräknare (UK-satser)", fields: { amount: "Belopp", rate: "Momssats" } },
    "compound-interest-calculator": { name: "Ränta-på-ränta-kalkylator", title: "Ränta på ränta — framtida värde", h1: "Ränta-på-ränta-kalkylator", fields: { principal: "Startbelopp", rate: "Årsränta", years: "År" } },
    "roi-calculator": { name: "ROI-kalkylator", title: "ROI — avkastning", h1: "ROI-kalkylator", fields: { cost: "Kostnad", gain: "Vinst eller slutvärde" } },
    "profit-margin-calculator": { name: "Marginalkalkylator", title: "Marginal och påslag", h1: "Vinstmarginalkalkylator", fields: { cost: "Kostnad", price: "Försäljningspris" } },
    "percentage-calculator": { name: "Procentkalkylator", title: "Procent — av, är och förändring", h1: "Procentkalkylator", fields: { value: "Värde", percent: "Procent" } },
    "currency-converter": { name: "Valutaomvandlare", title: "Valutaomvandlare — mid-market", h1: "Valutaomvandlare", fields: { amount: "Belopp", from: "Från", to: "Till" } },
    "bmi-calculator": { name: "BMI-kalkylator", title: "BMI för vuxna", h1: "BMI-kalkylator", fields: { height: "Längd", weight: "Vikt" } },
    "json-formatter": { name: "JSON-formaterare", title: "Formatera och validera JSON", h1: "JSON-formaterare", fields: { json: "JSON" } },
    "password-generator": { name: "Lösenordsgenerator", title: "Slumpmässigt lösenord i webbläsaren", h1: "Lösenordsgenerator", fields: { length: "Längd" } },
    "pdf-merge": { name: "Slå ihop PDF", title: "Slå ihop PDF-filer", h1: "Slå ihop PDF-filer", fields: { files: "PDF-filer" } },
  },
  fi: {
    "loan-calculator": { name: "Lainalaskuri", title: "Lainalaskuri — kuukausierä ja korot", h1: "Lainalaskuri", fields: { principal: "Pääoma", rate: "Vuosikorko", term: "Laina-aika" } },
    "salary-after-tax-calculator": { name: "Nettopalkkalaskuri (UK)", title: "Nettopalkka Britanniassa", h1: "Palkka verojen jälkeen (Britannia)", fields: { salary: "Bruttopalkka", period: "Jakso" } },
    "vat-calculator": { name: "ALV-laskuri (UK)", title: "Britannian ALV — lisää tai poista", h1: "ALV-laskuri (UK-kannat)", fields: { amount: "Summa", rate: "ALV-kanta" } },
    "compound-interest-calculator": { name: "Korkoa korolle -laskuri", title: "Korkoa korolle — tuleva arvo", h1: "Korkoa korolle -laskuri", fields: { principal: "Pääoma", rate: "Vuosikorko", years: "Vuodet" } },
    "roi-calculator": { name: "ROI-laskuri", title: "ROI — sijoitetun pääoman tuotto", h1: "ROI-laskuri", fields: { cost: "Kustannus", gain: "Tuotto tai loppuarvo" } },
    "profit-margin-calculator": { name: "Kate laskuri", title: "Kate ja myyntikatekerroin", h1: "Voittomarginaalilaskuri", fields: { cost: "Kustannus", price: "Myyntihinta" } },
    "percentage-calculator": { name: "Prosenttilaskuri", title: "Prosentit — osuus ja muutos", h1: "Prosenttilaskuri", fields: { value: "Arvo", percent: "Prosentti" } },
    "currency-converter": { name: "Valuuttamuunnin", title: "Valuuttamuunnin — mid-market", h1: "Valuuttamuunnin", fields: { amount: "Summa", from: "Mistä", to: "Mihin" } },
    "bmi-calculator": { name: "BMI-laskuri", title: "Aikuisten BMI", h1: "BMI-laskuri", fields: { height: "Pituus", weight: "Paino" } },
    "json-formatter": { name: "JSON-muotoilija", title: "Muotoile ja tarkista JSON", h1: "JSON-muotoilija", fields: { json: "JSON" } },
    "password-generator": { name: "Salasanageneraattori", title: "Satunnainen salasana selaimessa", h1: "Salasanageneraattori", fields: { length: "Pituus" } },
    "pdf-merge": { name: "Yhdistä PDF", title: "Yhdistä PDF-tiedostot", h1: "Yhdistä PDF-tiedostot", fields: { files: "PDF-tiedostot" } },
  },
  cs: {
    "loan-calculator": { name: "Kalkulačka půjčky", title: "Kalkulačka půjčky — splátka a úrok", h1: "Kalkulačka půjčky", fields: { principal: "Jistina", rate: "Roční sazba", term: "Splatnost" } },
    "salary-after-tax-calculator": { name: "Kalkulačka čisté mzdy (UK)", title: "Čistá mzda ve Spojeném království", h1: "Mzda po dani (Spojené království)", fields: { salary: "Hrubá mzda", period: "Období" } },
    "vat-calculator": { name: "Kalkulačka DPH (UK)", title: "Britské DPH — přidat nebo odebrat", h1: "Kalkulačka DPH (sazby UK)", fields: { amount: "Částka", rate: "Sazba DPH" } },
    "compound-interest-calculator": { name: "Kalkulačka složeného úroku", title: "Složený úrok — budoucí hodnota", h1: "Kalkulačka složeného úroku", fields: { principal: "Jistina", rate: "Roční sazba", years: "Roky" } },
    "roi-calculator": { name: "Kalkulačka ROI", title: "ROI — návratnost", h1: "Kalkulačka ROI", fields: { cost: "Náklad", gain: "Zisk nebo konečná hodnota" } },
    "profit-margin-calculator": { name: "Kalkulačka marže", title: "Marže a přirážka", h1: "Kalkulačka ziskové marže", fields: { cost: "Náklad", price: "Prodejní cena" } },
    "percentage-calculator": { name: "Procentní kalkulačka", title: "Procenta — z, je a změna", h1: "Procentní kalkulačka", fields: { value: "Hodnota", percent: "Procento" } },
    "currency-converter": { name: "Převodník měn", title: "Převodník měn — mid-market", h1: "Převodník měn", fields: { amount: "Částka", from: "Z", to: "Na" } },
    "bmi-calculator": { name: "Kalkulačka BMI", title: "BMI dospělých", h1: "Kalkulačka BMI", fields: { height: "Výška", weight: "Hmotnost" } },
    "json-formatter": { name: "Formátovač JSON", title: "Formátovat a ověřit JSON", h1: "Formátovač JSON", fields: { json: "JSON" } },
    "password-generator": { name: "Generátor hesel", title: "Náhodné heslo v prohlížeči", h1: "Generátor hesel", fields: { length: "Délka" } },
    "pdf-merge": { name: "Spojit PDF", title: "Spojit soubory PDF", h1: "Spojit soubory PDF", fields: { files: "Soubory PDF" } },
  },
  ro: {
    "loan-calculator": { name: "Calculator de credit", title: "Calculator de credit — rată și dobândă", h1: "Calculator de credit", fields: { principal: "Principal", rate: "Dobândă anuală", term: "Perioadă" } },
    "salary-after-tax-calculator": { name: "Calculator salariu net (UK)", title: "Salariu net în Regatul Unit", h1: "Salariu după taxe (Regatul Unit)", fields: { salary: "Salariu brut", period: "Perioadă" } },
    "vat-calculator": { name: "Calculator TVA (UK)", title: "TVA britanic — adaugă sau scoate", h1: "Calculator TVA (cote UK)", fields: { amount: "Sumă", rate: "Cotă TVA" } },
    "compound-interest-calculator": { name: "Calculator dobândă compusă", title: "Dobândă compusă — valoare viitoare", h1: "Calculator dobândă compusă", fields: { principal: "Principal", rate: "Rată anuală", years: "Ani" } },
    "roi-calculator": { name: "Calculator ROI", title: "ROI — randament", h1: "Calculator ROI", fields: { cost: "Cost", gain: "Câștig sau valoare finală" } },
    "profit-margin-calculator": { name: "Calculator de marjă", title: "Marjă și adaos", h1: "Calculator marjă de profit", fields: { cost: "Cost", price: "Preț de vânzare" } },
    "percentage-calculator": { name: "Calculator de procente", title: "Procente — din, este și variație", h1: "Calculator de procente", fields: { value: "Valoare", percent: "Procent" } },
    "currency-converter": { name: "Convertor valutar", title: "Convertor valutar — mid-market", h1: "Convertor valutar", fields: { amount: "Sumă", from: "Din", to: "În" } },
    "bmi-calculator": { name: "Calculator IMC", title: "IMC adult", h1: "Calculator IMC", fields: { height: "Înălțime", weight: "Greutate" } },
    "json-formatter": { name: "Formatter JSON", title: "Formatare și validare JSON", h1: "Formatter JSON", fields: { json: "JSON" } },
    "password-generator": { name: "Generator de parole", title: "Parolă aleatoare în browser", h1: "Generator de parole", fields: { length: "Lungime" } },
    "pdf-merge": { name: "Unește PDF", title: "Unește fișiere PDF", h1: "Unește fișiere PDF", fields: { files: "Fișiere PDF" } },
  },
  hu: {
    "loan-calculator": { name: "Hitelkalkulátor", title: "Hitelkalkulátor — törlesztő és kamat", h1: "Hitelkalkulátor", fields: { principal: "Tőke", rate: "Éves kamat", term: "Futamidő" } },
    "salary-after-tax-calculator": { name: "Nettó bér kalkulátor (UK)", title: "Nettó bér az Egyesült Királyságban", h1: "Bér adó után (Egyesült Királyság)", fields: { salary: "Bruttó bér", period: "Időszak" } },
    "vat-calculator": { name: "ÁFA-kalkulátor (UK)", title: "Brit ÁFA — hozzáadás vagy levonás", h1: "ÁFA-kalkulátor (UK kulcsok)", fields: { amount: "Összeg", rate: "ÁFA-kulcs" } },
    "compound-interest-calculator": { name: "Kamatos kamat kalkulátor", title: "Kamatos kamat — jövőbeli érték", h1: "Kamatos kamat kalkulátor", fields: { principal: "Tőke", rate: "Éves kamat", years: "Évek" } },
    "roi-calculator": { name: "ROI-kalkulátor", title: "ROI — megtérülés", h1: "ROI-kalkulátor", fields: { cost: "Költség", gain: "Nyereség vagy záróérték" } },
    "profit-margin-calculator": { name: "Árréskalkulátor", title: "Árrés és felár", h1: "Haszonkulcs-kalkulátor", fields: { cost: "Költség", price: "Eladási ár" } },
    "percentage-calculator": { name: "Százalékkalkulátor", title: "Százalék — rész és változás", h1: "Százalékkalkulátor", fields: { value: "Érték", percent: "Százalék" } },
    "currency-converter": { name: "Pénznemváltó", title: "Pénznemváltó — mid-market", h1: "Pénznemváltó", fields: { amount: "Összeg", from: "Erről", to: "Erre" } },
    "bmi-calculator": { name: "BMI-kalkulátor", title: "Felnőtt BMI", h1: "BMI-kalkulátor", fields: { height: "Magasság", weight: "Testsúly" } },
    "json-formatter": { name: "JSON formázó", title: "JSON formázása és ellenőrzése", h1: "JSON formázó", fields: { json: "JSON" } },
    "password-generator": { name: "Jelszógenerátor", title: "Véletlen jelszó a böngészőben", h1: "Jelszógenerátor", fields: { length: "Hossz" } },
    "pdf-merge": { name: "PDF egyesítése", title: "PDF-fájlok egyesítése", h1: "PDF-fájlok egyesítése", fields: { files: "PDF-fájlok" } },
  },
  el: {
    "loan-calculator": { name: "Υπολογιστής δανείου", title: "Υπολογιστής δανείου — δόση και τόκοι", h1: "Υπολογιστής δανείου", fields: { principal: "Κεφάλαιο", rate: "Ετήσιο επιτόκιο", term: "Διάρκεια" } },
    "salary-after-tax-calculator": { name: "Υπολογιστής καθαρού μισθού (UK)", title: "Καθαρός μισθός στο Ηνωμένο Βασίλειο", h1: "Μισθός μετά φόρων (Ηνωμένο Βασίλειο)", fields: { salary: "Μικτός μισθός", period: "Περίοδος" } },
    "vat-calculator": { name: "Υπολογιστής ΦΠΑ (UK)", title: "Βρετανικός ΦΠΑ — προσθήκη ή αφαίρεση", h1: "Υπολογιστής ΦΠΑ (συντελεστές UK)", fields: { amount: "Ποσό", rate: "Συντελεστής ΦΠΑ" } },
    "compound-interest-calculator": { name: "Υπολογιστής ανατοκισμού", title: "Ανατοκισμός — μελλοντική αξία", h1: "Υπολογιστής ανατοκισμού", fields: { principal: "Κεφάλαιο", rate: "Ετήσιο επιτόκιο", years: "Έτη" } },
    "roi-calculator": { name: "Υπολογιστής ROI", title: "ROI — απόδοση επένδυσης", h1: "Υπολογιστής ROI", fields: { cost: "Κόστος", gain: "Όφελος ή τελική αξία" } },
    "profit-margin-calculator": { name: "Υπολογιστής περιθωρίου", title: "Περιθώριο και markup", h1: "Υπολογιστής περιθωρίου κέρδους", fields: { cost: "Κόστος", price: "Τιμή πώλησης" } },
    "percentage-calculator": { name: "Υπολογιστής ποσοστών", title: "Ποσοστά — του, είναι και μεταβολή", h1: "Υπολογιστής ποσοστών", fields: { value: "Τιμή", percent: "Ποσοστό" } },
    "currency-converter": { name: "Μετατροπέας συναλλάγματος", title: "Μετατροπέας συναλλάγματος — mid-market", h1: "Μετατροπέας συναλλάγματος", fields: { amount: "Ποσό", from: "Από", to: "Προς" } },
    "bmi-calculator": { name: "Υπολογιστής ΔΜΣ", title: "ΔΜΣ ενηλίκων", h1: "Υπολογιστής ΔΜΣ", fields: { height: "Ύψος", weight: "Βάρος" } },
    "json-formatter": { name: "Διαστήτης JSON", title: "Μορφοποίηση και έλεγχος JSON", h1: "Διαστήτης JSON", fields: { json: "JSON" } },
    "password-generator": { name: "Γεννήτρια κωδικών", title: "Τυχαίος κωδικός στον φυλλομετρητή", h1: "Γεννήτρια κωδικών", fields: { length: "Μήκος" } },
    "pdf-merge": { name: "Συγχώνευση PDF", title: "Συγχώνευση αρχείων PDF", h1: "Συγχώνευση αρχείων PDF", fields: { files: "Αρχεία PDF" } },
  },
  uk: {
    "loan-calculator": { name: "Калькулятор кредиту", title: "Калькулятор кредиту — платіж і відсотки", h1: "Калькулятор кредиту", fields: { principal: "Сума", rate: "Річна ставка", term: "Строк" } },
    "salary-after-tax-calculator": { name: "Калькулятор чистої зарплати (UK)", title: "Чиста зарплата у Великій Британії", h1: "Зарплата після податків (Велика Британія)", fields: { salary: "Валова зарплата", period: "Період" } },
    "vat-calculator": { name: "Калькулятор ПДВ (UK)", title: "Британський ПДВ — додати або зняти", h1: "Калькулятор ПДВ (ставки UK)", fields: { amount: "Сума", rate: "Ставка ПДВ" } },
    "compound-interest-calculator": { name: "Калькулятор складних відсотків", title: "Складні відсотки — майбутня вартість", h1: "Калькулятор складних відсотків", fields: { principal: "Сума", rate: "Річна ставка", years: "Роки" } },
    "roi-calculator": { name: "Калькулятор ROI", title: "ROI — прибутковість", h1: "Калькулятор ROI", fields: { cost: "Витрата", gain: "Прибуток або кінцева вартість" } },
    "profit-margin-calculator": { name: "Калькулятор маржі", title: "Маржа і націнка", h1: "Калькулятор маржі прибутку", fields: { cost: "Собівартість", price: "Ціна продажу" } },
    "percentage-calculator": { name: "Калькулятор відсотків", title: "Відсотки — від, становить і зміна", h1: "Калькулятор відсотків", fields: { value: "Значення", percent: "Відсоток" } },
    "currency-converter": { name: "Конвертер валют", title: "Конвертер валют — mid-market", h1: "Конвертер валют", fields: { amount: "Сума", from: "З", to: "На" } },
    "bmi-calculator": { name: "Калькулятор ІМТ", title: "ІМТ дорослих", h1: "Калькулятор ІМТ", fields: { height: "Зріст", weight: "Вага" } },
    "json-formatter": { name: "Форматувальник JSON", title: "Форматування і перевірка JSON", h1: "Форматувальник JSON", fields: { json: "JSON" } },
    "password-generator": { name: "Генератор паролів", title: "Випадковий пароль у браузері", h1: "Генератор паролів", fields: { length: "Довжина" } },
    "pdf-merge": { name: "Об’єднати PDF", title: "Об’єднати файли PDF", h1: "Об’єднати файли PDF", fields: { files: "Файли PDF" } },
  },
  bg: {
    "loan-calculator": { name: "Калкулатор за кредит", title: "Калкулатор за кредит — вноска и лихва", h1: "Калкулатор за кредит", fields: { principal: "Главница", rate: "Годишна лихва", term: "Срок" } },
    "salary-after-tax-calculator": { name: "Калкулатор за нетна заплата (UK)", title: "Нетна заплата в Обединеното кралство", h1: "Заплата след данъци (Обединено кралство)", fields: { salary: "Брутна заплата", period: "Период" } },
    "vat-calculator": { name: "ДДС калкулатор (UK)", title: "Британско ДДС — добавяне или премахване", h1: "ДДС калкулатор (ставки UK)", fields: { amount: "Сума", rate: "ДДС ставка" } },
    "compound-interest-calculator": { name: "Калкулатор за сложна лихва", title: "Сложна лихва — бъдеща стойност", h1: "Калкулатор за сложна лихва", fields: { principal: "Главница", rate: "Годишна лихва", years: "Години" } },
    "roi-calculator": { name: "ROI калкулатор", title: "ROI — възвръщаемост", h1: "ROI калкулатор", fields: { cost: "Разход", gain: "Печалба или крайна стойност" } },
    "profit-margin-calculator": { name: "Калкулатор за марж", title: "Марж и надценка", h1: "Калкулатор за печалба", fields: { cost: "Себестойност", price: "Продажна цена" } },
    "percentage-calculator": { name: "Калкулатор за проценти", title: "Проценти — от, е и промяна", h1: "Калкулатор за проценти", fields: { value: "Стойност", percent: "Процент" } },
    "currency-converter": { name: "Валутен калкулатор", title: "Валутен калкулатор — mid-market", h1: "Валутен калкулатор", fields: { amount: "Сума", from: "От", to: "Към" } },
    "bmi-calculator": { name: "ИТМ калкулатор", title: "ИТМ за възрастни", h1: "ИТМ калкулатор", fields: { height: "Ръст", weight: "Тегло" } },
    "json-formatter": { name: "JSON форматер", title: "Форматиране и проверка на JSON", h1: "JSON форматер", fields: { json: "JSON" } },
    "password-generator": { name: "Генератор на пароли", title: "Случайна парола в браузъра", h1: "Генератор на пароли", fields: { length: "Дължина" } },
    "pdf-merge": { name: "Обедини PDF", title: "Обедини PDF файлове", h1: "Обедини PDF файлове", fields: { files: "PDF файлове" } },
  },
  sk: {
    "loan-calculator": { name: "Kalkulačka pôžičky", title: "Kalkulačka pôžičky — splátka a úrok", h1: "Kalkulačka pôžičky", fields: { principal: "Istina", rate: "Ročná sadzba", term: "Splatnosť" } },
    "salary-after-tax-calculator": { name: "Kalkulačka čistej mzdy (UK)", title: "Čistá mzda v Spojenom kráľovstve", h1: "Mzda po dani (Spojené kráľovstvo)", fields: { salary: "Hrubá mzda", period: "Obdobie" } },
    "vat-calculator": { name: "Kalkulačka DPH (UK)", title: "Britské DPH — pridať alebo odobrať", h1: "Kalkulačka DPH (sadzby UK)", fields: { amount: "Suma", rate: "Sadzba DPH" } },
    "compound-interest-calculator": { name: "Kalkulačka zloženého úroku", title: "Zložený úrok — budúca hodnota", h1: "Kalkulačka zloženého úroku", fields: { principal: "Istina", rate: "Ročná sadzba", years: "Roky" } },
    "roi-calculator": { name: "Kalkulačka ROI", title: "ROI — návratnosť", h1: "Kalkulačka ROI", fields: { cost: "Náklad", gain: "Zisk alebo konečná hodnota" } },
    "profit-margin-calculator": { name: "Kalkulačka marže", title: "Marža a prirážka", h1: "Kalkulačka ziskovej marže", fields: { cost: "Náklad", price: "Predajná cena" } },
    "percentage-calculator": { name: "Percentuálna kalkulačka", title: "Percentá — z, je a zmena", h1: "Percentuálna kalkulačka", fields: { value: "Hodnota", percent: "Percento" } },
    "currency-converter": { name: "Prevodník mien", title: "Prevodník mien — mid-market", h1: "Prevodník mien", fields: { amount: "Suma", from: "Z", to: "Na" } },
    "bmi-calculator": { name: "Kalkulačka BMI", title: "BMI dospelých", h1: "Kalkulačka BMI", fields: { height: "Výška", weight: "Hmotnosť" } },
    "json-formatter": { name: "Formátovač JSON", title: "Formátovať a overiť JSON", h1: "Formátovač JSON", fields: { json: "JSON" } },
    "password-generator": { name: "Generátor hesiel", title: "Náhodné heslo v prehliadači", h1: "Generátor hesiel", fields: { length: "Dĺžka" } },
    "pdf-merge": { name: "Spojiť PDF", title: "Spojiť súbory PDF", h1: "Spojiť súbory PDF", fields: { files: "Súbory PDF" } },
  },
  hr: {
    "loan-calculator": { name: "Kalkulator kredita", title: "Kalkulator kredita — anuitet i kamata", h1: "Kalkulator kredita", fields: { principal: "Glavnica", rate: "Godišnja stopa", term: "Rok" } },
    "salary-after-tax-calculator": { name: "Kalkulator neto plaće (UK)", title: "Neto plaća u Ujedinjenom Kraljevstvu", h1: "Plaća nakon poreza (Ujedinjeno Kraljevstvo)", fields: { salary: "Bruto plaća", period: "Razdoblje" } },
    "vat-calculator": { name: "PDV kalkulator (UK)", title: "Britanski PDV — dodaj ili ukloni", h1: "PDV kalkulator (stope UK)", fields: { amount: "Iznos", rate: "PDV stopa" } },
    "compound-interest-calculator": { name: "Kalkulator složene kamate", title: "Složena kamata — buduća vrijednost", h1: "Kalkulator složene kamate", fields: { principal: "Glavnica", rate: "Godišnja stopa", years: "Godine" } },
    "roi-calculator": { name: "ROI kalkulator", title: "ROI — povrat ulaganja", h1: "ROI kalkulator", fields: { cost: "Trošak", gain: "Dobit ili krajnja vrijednost" } },
    "profit-margin-calculator": { name: "Kalkulator marže", title: "Marža i marža na trošak", h1: "Kalkulator profitne marže", fields: { cost: "Trošak", price: "Prodajna cijena" } },
    "percentage-calculator": { name: "Kalkulator postotaka", title: "Postoci — od, jest i promjena", h1: "Kalkulator postotaka", fields: { value: "Vrijednost", percent: "Postotak" } },
    "currency-converter": { name: "Konverter valuta", title: "Konverter valuta — mid-market", h1: "Konverter valuta", fields: { amount: "Iznos", from: "Iz", to: "U" } },
    "bmi-calculator": { name: "BMI kalkulator", title: "BMI za odrasle", h1: "BMI kalkulator", fields: { height: "Visina", weight: "Težina" } },
    "json-formatter": { name: "JSON formatter", title: "Formatiranje i provjera JSON-a", h1: "JSON formatter", fields: { json: "JSON" } },
    "password-generator": { name: "Generator lozinki", title: "Nasumična lozinka u pregledniku", h1: "Generator lozinki", fields: { length: "Duljina" } },
    "pdf-merge": { name: "Spoji PDF", title: "Spoji PDF datoteke", h1: "Spoji PDF datoteke", fields: { files: "PDF datoteke" } },
  },
  lt: {
    "loan-calculator": { name: "Paskolos skaičiuoklė", title: "Paskolos skaičiuoklė — įmoka ir palūkanos", h1: "Paskolos skaičiuoklė", fields: { principal: "Suma", rate: "Metinė palūkanų norma", term: "Terminys" } },
    "salary-after-tax-calculator": { name: "Grynojo atlyginimo skaičiuoklė (UK)", title: "Grynasis atlyginimas Jungtinėje Karalystėje", h1: "Atlyginimas po mokesčių (Jungtinė Karalystė)", fields: { salary: "Bruto atlyginimas", period: "Laikotarpis" } },
    "vat-calculator": { name: "PVM skaičiuoklė (UK)", title: "JK PVM — pridėti arba pašalinti", h1: "PVM skaičiuoklė (JK tarifai)", fields: { amount: "Suma", rate: "PVM tarifas" } },
    "compound-interest-calculator": { name: "Sudėtinių palūkanų skaičiuoklė", title: "Sudėtinės palūkanos — būsimoji vertė", h1: "Sudėtinių palūkanų skaičiuoklė", fields: { principal: "Suma", rate: "Metinė norma", years: "Metai" } },
    "roi-calculator": { name: "ROI skaičiuoklė", title: "ROI — grąža", h1: "ROI skaičiuoklė", fields: { cost: "Sąnaudos", gain: "Pelnas arba galutinė vertė" } },
    "profit-margin-calculator": { name: "Maržos skaičiuoklė", title: "Marža ir antkainis", h1: "Pelno maržos skaičiuoklė", fields: { cost: "Sąnaudos", price: "Pardavimo kaina" } },
    "percentage-calculator": { name: "Procentų skaičiuoklė", title: "Procentai — nuo, yra ir pokytis", h1: "Procentų skaičiuoklė", fields: { value: "Reikšmė", percent: "Procentas" } },
    "currency-converter": { name: "Valiutos keitiklis", title: "Valiutos keitiklis — mid-market", h1: "Valiutos keitiklis", fields: { amount: "Suma", from: "Iš", to: "Į" } },
    "bmi-calculator": { name: "KMI skaičiuoklė", title: "Suaugusiųjų KMI", h1: "KMI skaičiuoklė", fields: { height: "Ūgis", weight: "Svoris" } },
    "json-formatter": { name: "JSON formatuotojas", title: "JSON formatavimas ir tikrinimas", h1: "JSON formatuotojas", fields: { json: "JSON" } },
    "password-generator": { name: "Slaptažodžių generatorius", title: "Atsitiktinis slaptažodis naršyklėje", h1: "Slaptažodžių generatorius", fields: { length: "Ilgis" } },
    "pdf-merge": { name: "Sujungti PDF", title: "Sujungti PDF failus", h1: "Sujungti PDF failus", fields: { files: "PDF failai" } },
  },
  lv: {
    "loan-calculator": { name: "Aizdevuma kalkulators", title: "Aizdevuma kalkulators — maksājums un procenti", h1: "Aizdevuma kalkulators", fields: { principal: "Pamatsumma", rate: "Gada likme", term: "Termiņš" } },
    "salary-after-tax-calculator": { name: "Neto algas kalkulators (UK)", title: "Neto alga Apvienotajā Karalistē", h1: "Alga pēc nodokļiem (Apvienotā Karaliste)", fields: { salary: "Bruto alga", period: "Periods" } },
    "vat-calculator": { name: "PVN kalkulators (UK)", title: "AK PVN — pievienot vai noņemt", h1: "PVN kalkulators (AK likmes)", fields: { amount: "Summa", rate: "PVN likme" } },
    "compound-interest-calculator": { name: "Salikto procentu kalkulators", title: "Saliktie procenti — nākotnes vērtība", h1: "Salikto procentu kalkulators", fields: { principal: "Pamatsumma", rate: "Gada likme", years: "Gadi" } },
    "roi-calculator": { name: "ROI kalkulators", title: "ROI — atdeves rādītājs", h1: "ROI kalkulators", fields: { cost: "Izmaksas", gain: "Peļņa vai beigu vērtība" } },
    "profit-margin-calculator": { name: "Maržas kalkulators", title: "Marža un uzcenojums", h1: "Peļņas maržas kalkulators", fields: { cost: "Izmaksas", price: "Pārdošanas cena" } },
    "percentage-calculator": { name: "Procentu kalkulators", title: "Procenti — no, ir un izmaiņa", h1: "Procentu kalkulators", fields: { value: "Vērtība", percent: "Procenti" } },
    "currency-converter": { name: "Valūtas pārveidotājs", title: "Valūtas pārveidotājs — mid-market", h1: "Valūtas pārveidotājs", fields: { amount: "Summa", from: "No", to: "Uz" } },
    "bmi-calculator": { name: "ĶMI kalkulators", title: "Pieaugušo ĶMI", h1: "ĶMI kalkulators", fields: { height: "Augums", weight: "Svars" } },
    "json-formatter": { name: "JSON formatētājs", title: "JSON formatēšana un pārbaude", h1: "JSON formatētājs", fields: { json: "JSON" } },
    "password-generator": { name: "Paroļu ģenerators", title: "Nejauša parole pārlūkā", h1: "Paroļu ģenerators", fields: { length: "Garums" } },
    "pdf-merge": { name: "Apvienot PDF", title: "Apvienot PDF failus", h1: "Apvienot PDF failus", fields: { files: "PDF faili" } },
  },
  et: {
    "loan-calculator": { name: "Laenukalkulaator", title: "Laenukalkulaator — makse ja intress", h1: "Laenukalkulaator", fields: { principal: "Põhisumma", rate: "Aastaintress", term: "Tähtaeg" } },
    "salary-after-tax-calculator": { name: "Netopalga kalkulaator (UK)", title: "Netopalk Ühendkuningriigis", h1: "Palk pärast makse (Ühendkuningriik)", fields: { salary: "Brutopalk", period: "Periood" } },
    "vat-calculator": { name: "Käibemaksu kalkulaator (UK)", title: "ÜK käibemaks — lisa või eemalda", h1: "Käibemaksu kalkulaator (ÜK määrad)", fields: { amount: "Summa", rate: "KM määr" } },
    "compound-interest-calculator": { name: "Liitintressi kalkulaator", title: "Liitintress — tulevane väärtus", h1: "Liitintressi kalkulaator", fields: { principal: "Põhisumma", rate: "Aastamäär", years: "Aastad" } },
    "roi-calculator": { name: "ROI kalkulaator", title: "ROI — tootlus", h1: "ROI kalkulaator", fields: { cost: "Kulu", gain: "Tulu või lõppväärtus" } },
    "profit-margin-calculator": { name: "Marginaali kalkulaator", title: "Marginaal ja juurdehindlus", h1: "Kasumimarginaali kalkulaator", fields: { cost: "Kulu", price: "Müügihind" } },
    "percentage-calculator": { name: "Protsendikalkulaator", title: "Protsendid — osakaal ja muutus", h1: "Protsendikalkulaator", fields: { value: "Väärtus", percent: "Protsent" } },
    "currency-converter": { name: "Valuutakalkulaator", title: "Valuutakalkulaator — mid-market", h1: "Valuutakalkulaator", fields: { amount: "Summa", from: "Kust", to: "Kuhu" } },
    "bmi-calculator": { name: "KMI kalkulaator", title: "Täiskasvanute KMI", h1: "KMI kalkulaator", fields: { height: "Pikkus", weight: "Kaal" } },
    "json-formatter": { name: "JSON vormindaja", title: "JSON-i vormindamine ja kontroll", h1: "JSON vormindaja", fields: { json: "JSON" } },
    "password-generator": { name: "Parooligeneraator", title: "Juhuslik parool brauseris", h1: "Parooligeneraator", fields: { length: "Pikkus" } },
    "pdf-merge": { name: "Ühenda PDF", title: "Ühenda PDF-failid", h1: "Ühenda PDF-failid", fields: { files: "PDF-failid" } },
  },
  sl: {
    "loan-calculator": { name: "Kalkulator kredita", title: "Kalkulator kredita — anuiteta in obresti", h1: "Kalkulator kredita", fields: { principal: "Glavnica", rate: "Letna obrestna mera", term: "Doba" } },
    "salary-after-tax-calculator": { name: "Kalkulator neto plače (UK)", title: "Neto plača v Združenem kraljestvu", h1: "Plača po davkih (Združeno kraljestvo)", fields: { salary: "Bruto plača", period: "Obdobje" } },
    "vat-calculator": { name: "Kalkulator DDV (UK)", title: "Britanski DDV — dodaj ali odstrani", h1: "Kalkulator DDV (stopnje UK)", fields: { amount: "Znesek", rate: "Stopnja DDV" } },
    "compound-interest-calculator": { name: "Kalkulator obrestnih obresti", title: "Obrestne obresti — prihodnja vrednost", h1: "Kalkulator obrestnih obresti", fields: { principal: "Glavnica", rate: "Letna mera", years: "Leta" } },
    "roi-calculator": { name: "Kalkulator ROI", title: "ROI — donosnost", h1: "Kalkulator ROI", fields: { cost: "Strošek", gain: "Dobitek ali končna vrednost" } },
    "profit-margin-calculator": { name: "Kalkulator marže", title: "Marža in pribitek", h1: "Kalkulator dobičkonosnosti", fields: { cost: "Strošek", price: "Prodajna cena" } },
    "percentage-calculator": { name: "Kalkulator odstotkov", title: "Odstotki — od, je in sprememba", h1: "Kalkulator odstotkov", fields: { value: "Vrednost", percent: "Odstotek" } },
    "currency-converter": { name: "Pretvornik valut", title: "Pretvornik valut — mid-market", h1: "Pretvornik valut", fields: { amount: "Znesek", from: "Iz", to: "V" } },
    "bmi-calculator": { name: "Kalkulator ITM", title: "ITM za odrasle", h1: "Kalkulator ITM", fields: { height: "Višina", weight: "Teža" } },
    "json-formatter": { name: "Oblikovalnik JSON", title: "Oblikovanje in preverjanje JSON", h1: "Oblikovalnik JSON", fields: { json: "JSON" } },
    "password-generator": { name: "Generator gesel", title: "Naključno geslo v brskalniku", h1: "Generator gesel", fields: { length: "Dolžina" } },
    "pdf-merge": { name: "Združi PDF", title: "Združi datoteke PDF", h1: "Združi datoteke PDF", fields: { files: "Datoteke PDF" } },
  },
};

const TOOL_SLUGS = Object.keys(EN) as LocalizedToolSlug[];

export function getToolCopy(locale: Locale | string | undefined, slug: LocalizedToolSlug): ToolCopy {
  const base = EN[slug];
  if (!locale || locale === DEFAULT_LOCALE || !(locale in OVERRIDES)) return base;
  return mergeTool(base, OVERRIDES[locale as Exclude<Locale, "en">][slug]);
}

export function hasToolCopy(slug: string): slug is LocalizedToolSlug {
  return slug in EN;
}

export function assertToolCoverage(): Array<{ locale: Locale; slug: LocalizedToolSlug }> {
  const missing: Array<{ locale: Locale; slug: LocalizedToolSlug }> = [];
  for (const locale of LOCALES) {
    for (const slug of TOOL_SLUGS) {
      const copy = getToolCopy(locale, slug);
      if (!copy.name || !copy.h1 || !copy.title || !copy.description) missing.push({ locale, slug });
    }
  }
  return missing;
}
