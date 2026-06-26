import type { ToolDefinition } from "./types";

export const PHASE2_PRIORITY_TOOL_SLUGS = new Set([
  "profit-margin-calculator",
  "vat-calculator",
  "salary-after-tax-calculator",
  "loan-calculator",
  "roi-calculator",
  "youtube-earnings-calculator",
  "paycheck-calculator-usa",
  "net-worth-calculator",
  "break-even-calculator",
  "compound-interest-calculator",
  "percentage-calculator",
  "bmi-calculator",
  "bmi-for-children-calculator",
  "tip-calculator",
  "tip-calculator-split-bill",
  "currency-converter",
  "age-calculator",
  "word-counter",
  "character-counter",
  "base64-encoder-decoder",
  "json-formatter",
  "password-generator",
]);

type QuickAnswer = {
  title?: string;
  answer: string;
  example: string;
};

type RelatedArticle = {
  title: string;
  url: string;
};

const quickAnswers: Record<string, QuickAnswer> = {
  "profit-margin-calculator": {
    title: "Margin vs Percentage: What's the difference?",
    answer:
      "Profit margin is a specific type of percentage: it measures profit as a percentage of revenue. General percentages can measure any ratio, while margin always uses selling price or revenue as the denominator.",
    example:
      "Selling a GBP 100 item that cost GBP 60 gives a 40% profit margin (GBP 40 / GBP 100). Markup on the same item is 66.7% (GBP 40 / GBP 60), because markup uses cost as the denominator.",
  },
  "vat-calculator": {
    answer: "To add 20% UK VAT, multiply the net price by 1.20. To remove VAT from a gross price, divide by 1.20 instead of subtracting 20%.",
    example: "GBP 480 net + 20% VAT = GBP 576 gross, including GBP 96 VAT.",
  },
  "salary-after-tax-calculator": {
    answer:
      "Salary after tax estimates take-home pay after income tax, National Insurance, and any deductions you model. UK tax years and bands change, so treat this as planning math and confirm with HMRC or payroll.",
    example:
      "A GBP 40,000 UK salary in 2026/27 takes home approximately GBP 31,200 after 20% income tax and 8% National Insurance assumptions.",
  },
  "loan-calculator": {
    answer: "Monthly payment = P x [r(1+r)^n] / [(1+r)^n - 1], where P is principal, r is monthly rate, and n is the number of payments.",
    example: "A GBP 10,000 loan at 6% APR over 3 years is about GBP 304 per month before fees.",
  },
  "roi-calculator": {
    answer: "ROI = ((Gain - Cost) / Cost) x 100. Use net gain, not gross revenue, when you want the return percentage to reflect actual profit.",
    example: "Investing GBP 5,000 and receiving GBP 6,500 back creates GBP 1,500 net gain, which equals 30% ROI.",
  },
  "youtube-earnings-calculator": {
    answer:
      "YouTube earnings depend on RPM, monetized playbacks, niche, geography, and ad demand. UK creators commonly model rough RPM ranges before comparing AdSense with sponsorships.",
    example: "At GBP 0.80-GBP 3.50 RPM, 100,000 monthly views estimate roughly GBP 80-GBP 350 per month.",
  },
  "paycheck-calculator-usa": {
    answer:
      "A US paycheck calculator estimates gross-to-net pay after federal withholding, state assumptions, benefits, and deductions. State tax differences mean two equal salaries can produce different net checks.",
    example: "A USD 78,000 salary paid biweekly with 22% combined withholding gives about USD 2,340 net per paycheck before other deductions.",
  },
  "net-worth-calculator": {
    answer: "Net worth = total assets - total liabilities. Include cash, investments, home equity, debts, loans, and credit card balances for a cleaner financial baseline.",
    example: "USD 420,000 in assets minus USD 96,000 in liabilities gives USD 324,000 net worth.",
  },
  "break-even-calculator": {
    answer: "Break-even units = fixed costs / (price per unit - variable cost per unit). The contribution margin must be positive or the product cannot break even.",
    example: "GBP 6,000 fixed costs with GBP 12 price and GBP 7 variable cost needs 1,200 units to break even.",
  },
  "compound-interest-calculator": {
    answer: "A = P(1 + r/n)^(nt), where compounding frequency changes the final balance. More frequent compounding slightly increases growth when the rate is the same.",
    example: "GBP 10,000 at 5% annual interest compounded monthly for 10 years grows to about GBP 16,470.",
  },
  "percentage-calculator": {
    answer: "To find what percentage X is of Y, divide X by Y and multiply by 100. For percentage change, divide the difference by the original value, not the new value.",
    example: "45 out of 180 = (45 / 180) x 100 = 25%. A price rise from GBP 80 to GBP 96 is ((96 - 80) / 80) x 100 = 20%.",
  },
  "bmi-calculator": {
    answer:
      "BMI = weight in kilograms divided by height in metres squared. It is an adult screening measure, not a complete health assessment.",
    example:
      "A person weighing 75 kg at 175 cm has BMI = 75 / (1.75 x 1.75) = 24.5, which falls in the standard healthy range of 18.5-24.9.",
  },
  "tip-calculator": {
    answer:
      "UK tipping is optional, with 10-15% common in restaurants when service charge is not already included. US restaurants commonly expect 18-22%.",
    example:
      "On a GBP 85 restaurant bill for 4 people, a 12.5% tip is GBP 10.63 total, making the split about GBP 23.91 per person.",
  },
  "currency-converter": {
    answer:
      "Currency conversion multiplies your amount by the exchange rate for the target currency. Live quotes can differ from bank, card, or broker rates because those include spreads and fees.",
    example: "EUR 500 at a 1.08 USD rate converts to USD 540 before any provider fees.",
  },
  "age-calculator": {
    answer: "Exact age is calculated from date of birth to the selected date, counting full years, months, and days. Leap years and birthday boundaries can change the final day count.",
    example: "Someone born on 15 June 1995 is 31 years old on 15 June 2026.",
  },
  "word-counter": {
    answer:
      "A word counter measures word count, characters, and lines so writers can match editorial limits. It is useful for essays, social posts, meta descriptions, and application forms.",
    example: "A 620-word draft may fit a short blog section but exceed a 500-word scholarship response by 120 words.",
  },
  "character-counter": {
    answer:
      "A character counter measures every typed character, including letters, numbers, spaces, punctuation, and line breaks. It is useful when a platform limit is based on characters rather than words.",
    example: "A 155-character meta description can fit Google snippets better than a 230-character draft that may be truncated.",
  },
  "base64-encoder-decoder": {
    answer:
      "Base64 converts binary or text data into ASCII-safe characters for transport in APIs, URLs, and tokens. Decoding reverses the representation but does not decrypt or verify trust.",
    example: "The text 'hello' encodes to 'aGVsbG8=' and decodes back to 'hello'.",
  },
  "json-formatter": {
    answer:
      "A JSON formatter parses raw JSON and prints it with indentation so nested objects are easier to read. Valid JSON must use quoted keys, valid commas, and supported primitive values.",
    example: "{\"name\":\"Toollabz\",\"tools\":238} becomes a multi-line object with readable indentation.",
  },
  "password-generator": {
    answer:
      "A strong password uses enough length and randomness that guessing is impractical. Length usually matters more than swapping letters for symbols in a short password.",
    example: "A 16-character random password with letters, numbers, and symbols is far stronger than an 8-character dictionary word with one symbol.",
  },
  "tip-calculator-split-bill": {
    answer: "Tip per person = (bill x tip percentage) / party size. Total per person = (bill + tip) / party size when everyone splits evenly.",
    example: "A USD 96 bill with an 18% tip split four ways means USD 17.28 tip total and USD 28.32 per person.",
  },
  "bmi-for-children-calculator": {
    answer:
      "BMI = weight(kg) / height(m)^2, but children need age-and-sex percentile context rather than adult BMI bands. Use pediatric guidance for interpretation.",
    example: "A child 140 cm tall weighing 35 kg has BMI 17.9, but the health meaning depends on age and sex percentile charts.",
  },
};

const whoUses: Record<string, string> = {
  "profit-margin-calculator":
    "Retail business owners use this to price products, Amazon FBA sellers check net margins after fees, restaurant owners monitor food cost ratios, and finance students use it to learn unit economics. The key audience is anyone who needs to separate margin from markup before making a pricing decision.",
  "vat-calculator":
    "UK freelancers use this before quarterly VAT checks, small business owners use it when creating invoices, accountants use it for client bookkeeping, and ecommerce sellers use it when setting Shopify or Etsy prices. It is most useful when you need net, VAT, and gross figures to agree before a receipt or return is prepared.",
  "salary-after-tax-calculator":
    "Job seekers use this to compare offers, employees use it to understand pay rises, contractors use it to compare employment types, and households use it for monthly budgeting. It is a planning tool for turning headline salary into a practical take-home estimate.",
  "loan-calculator":
    "Borrowers use this before speaking to lenders, car buyers use it to compare terms, homeowners model refinancing scenarios, and finance students use it to understand amortization. It is built for checking monthly payment and total interest before a loan feels affordable on paper.",
  "roi-calculator":
    "Marketers use this for campaign returns, founders use it for software purchases, investors use it for simple project comparisons, and managers use it in budget proposals. It works best when the cost and gain definitions are agreed before the percentage is quoted.",
  "youtube-earnings-calculator":
    "Creators use this to forecast AdSense income, agencies use it for sponsorship floors, editors use it for production budgets, and niche-site owners use it to compare RPM assumptions. The estimate is directional because RPM changes by country, topic, and season.",
  "paycheck-calculator-usa":
    "US employees use this to estimate take-home pay, new graduates use it to compare offers, HR teams use it for rough explanations, and households use it before changing benefits or retirement deductions. It is especially useful when pay frequency and state assumptions differ.",
  "net-worth-calculator":
    "Households use this for quarterly financial checkups, loan applicants use it for worksheets, founders separate personal and business finances, and students use it to understand assets versus liabilities. The result is a snapshot, not a forecast.",
  "break-even-calculator":
    "Cafe owners, course creators, ecommerce sellers, and startup teams use this to estimate how many sales cover fixed costs. It is strongest when you know both fixed costs and unit-level variable costs.",
  "compound-interest-calculator":
    "Savers use this to project deposits, students use it to learn exponential growth, investors test rate assumptions, and writers use it for verified examples. It helps make compounding frequency visible instead of treating all annual rates as identical.",
  "percentage-calculator":
    "Students use this for grades and exam scores, retailers use it for discounts, HR teams use it for pay rises, and investors use it for gains and losses. It is especially useful when the base value changes and the wording of the percentage question matters.",
  "bmi-calculator":
    "Adults use this for routine health checks, personal trainers use it for baseline screening, clinicians use it as an initial measure, and insurers may use it during underwriting. It should be read alongside waist circumference, health history, and professional advice.",
  "tip-calculator":
    "Diners use this to split restaurant bills, travellers use it to handle different UK and US tipping norms, business travellers use it for expenses, and groups use it to avoid awkward mental arithmetic at the table.",
  "currency-converter":
    "Travellers, online shoppers, importers, freelancers, and finance teams use currency converters before real transactions. The result gives a mid-market planning number before card fees, bank spreads, and transfer charges are applied.",
  "age-calculator":
    "HR departments, parents, schools, medical administrators, and legal teams use exact age calculations when eligibility depends on a date. It is useful for school year placement, screening windows, retirement planning, and deadline checks.",
  "word-counter":
    "Students use this for essay limits, bloggers use it for SEO drafts, social media managers use it for platform limits, and freelance writers use it for word-based billing. It helps separate the actual body text from references, appendices, and notes.",
  "base64-encoder-decoder":
    "Developers, DevOps engineers, API testers, and security researchers use Base64 tools to inspect or transport text-safe encoded data. It is common in JWTs, HTTP Basic Auth, Kubernetes secrets, data URIs, and email attachments.",
  "json-formatter":
    "Backend developers, frontend developers, QA engineers, DevOps teams, and data engineers use JSON formatters to read API payloads and configuration files. It is most useful when a minified response needs to be debugged or pasted into a ticket.",
  "password-generator":
    "IT administrators, security teams, developers, and individuals use password generators when replacing weak or reused credentials. The safest workflow is to generate a unique random password for every account and store it in a password manager.",
};

const relatedArticles: Record<string, RelatedArticle[]> = {
  "vat-calculator": [
    { title: "UK VAT Guide 2026: Rates, Registration & Returns", url: "/blog/vat-calculator-guide-small-businesses" },
  ],
  "profit-margin-calculator": [
    { title: "Margin vs Percentage: Key Differences (2026)", url: "/blog/margin-vs-percentage-difference" },
  ],
  "compound-interest-calculator": [
    { title: "Compound Interest Explained (2026)", url: "/blog/compound-interest-calculator-guide" },
  ],
  "loan-calculator": [
    { title: "Loan Calculator Guide 2026", url: "/blog/loan-calculator-guide" },
  ],
  "salary-after-tax-calculator": [
    { title: "UK Salary After Tax: Complete Guide (2026)", url: "/blog/salary-after-tax-explained-withholdings-deductions-net-pay" },
  ],
};

export function getPriorityQuickAnswer(tool: ToolDefinition): QuickAnswer | null {
  return quickAnswers[tool.slug] ?? null;
}

export function getPriorityWhoUses(tool: ToolDefinition): string | null {
  return whoUses[tool.slug] ?? null;
}

export function getRelatedArticlesForTool(tool: ToolDefinition): RelatedArticle[] {
  return relatedArticles[tool.slug] ?? [];
}

