export type BlogPhase3Upgrade = {
  quickAnswer: string;
  source: { label: string; href: string };
  table: { headers: string[]; rows: string[][] };
  takeaway: string;
};

export const BLOG_PHASE3_UPGRADES: Record<string, BlogPhase3Upgrade> = {
  "markup-vs-margin-formulas-pricing-mistakes": {
    quickAnswer: "Margin divides profit by revenue; markup divides profit by cost. A GBP 100 sale with GBP 60 cost is 40% margin but 66.7% markup.",
    source: { label: "GOV.UK VAT rates and business guidance", href: "https://www.gov.uk/vat-rates" },
    table: {
      headers: ["Scenario", "Margin", "Markup"],
      rows: [["GBP 20 profit on GBP 100 sale", "20%", "25%"], ["GBP 40 profit on GBP 100 sale", "40%", "66.7%"], ["GBP 50 profit on GBP 100 sale", "50%", "100%"]],
    },
    takeaway: "Pricing mistakes usually come from using the wrong denominator. Check both margin and markup before changing prices.",
  },
  "roi-calculator-measure-return-on-investment": {
    quickAnswer: "ROI measures net gain divided by cost. A GBP 5,000 investment returning GBP 6,500 has GBP 1,500 gain and 30% ROI.",
    source: { label: "SEC investor return guidance", href: "https://www.investor.gov/introduction-investing" },
    table: {
      headers: ["Metric", "Formula", "Best use"],
      rows: [["Simple ROI", "Gain / Cost", "Quick project comparison"], ["Annualized ROI", "Compounded yearly return", "Different holding periods"], ["IRR", "Discounted cash flows", "Multi-period investments"]],
    },
    takeaway: "Simple ROI is useful for quick comparison, but annualized returns are better when time periods differ.",
  },
  "loan-calculator-how-banks-calculate-your-emi": {
    quickAnswer: "Loan payments are based on principal, monthly rate, and number of payments. A lower monthly payment can still cost more if the term is longer.",
    source: { label: "FCA consumer credit information", href: "https://www.fca.org.uk/consumers" },
    table: {
      headers: ["Term", "Monthly payment effect", "Total interest effect"],
      rows: [["Shorter term", "Higher monthly payment", "Lower total interest"], ["Longer term", "Lower monthly payment", "Higher total interest"], ["Overpayment", "Higher current cash outflow", "Lower future interest"]],
    },
    takeaway: "Always compare total interest as well as the headline monthly payment.",
  },
  "vat-calculator-guide-small-businesses": {
    quickAnswer: "Standard UK VAT is 20%, but reduced and zero rates apply to some goods. To remove 20% VAT from a gross price, divide by 1.20.",
    source: { label: "HMRC VAT rates", href: "https://www.gov.uk/vat-rates" },
    table: {
      headers: ["VAT rate", "Example use", "Calculation"],
      rows: [["20%", "Standard-rated goods", "Net x 1.20"], ["5%", "Reduced-rate items", "Net x 1.05"], ["0%", "Zero-rated items", "No VAT added"]],
    },
    takeaway: "VAT mistakes usually happen when a gross price is treated like a net price or the wrong VAT rate is applied.",
  },
  "break-even-analysis-formula-examples-calculator": {
    quickAnswer: "Break-even units equal fixed costs divided by contribution per unit. If fixed costs are GBP 6,000 and contribution is GBP 5, break-even is 1,200 units.",
    source: { label: "British Business Bank finance guidance", href: "https://www.british-business-bank.co.uk/finance-options" },
    table: {
      headers: ["Input", "Meaning", "Example"],
      rows: [["Fixed cost", "Cost before sales", "Rent, salaries"], ["Variable cost", "Cost per sale", "Materials, fees"], ["Contribution", "Price minus variable cost", "GBP 12 - GBP 7 = GBP 5"]],
    },
    takeaway: "Break-even is only reliable when fixed and variable costs are separated correctly.",
  },
  "net-worth-calculator-five-minute-guide": {
    quickAnswer: "Net worth equals assets minus liabilities. If assets are GBP 420,000 and debts are GBP 96,000, net worth is GBP 324,000.",
    source: { label: "MoneyHelper budgeting guidance", href: "https://www.moneyhelper.org.uk/en/everyday-money/budgeting" },
    table: {
      headers: ["Include as asset", "Include as liability", "Why it matters"],
      rows: [["Cash and investments", "Credit cards", "Shows liquid position"], ["Property value", "Mortgage balance", "Captures home equity"], ["Pension estimate", "Loans", "Shows long-term balance sheet"]],
    },
    takeaway: "A useful net worth figure includes all debts, not just large loans.",
  },
  "salary-after-tax-explained-withholdings-deductions-net-pay": {
    quickAnswer: "Take-home pay is gross salary minus tax, National Insurance, pensions, student loan, and other deductions. UK tax is banded, not a single flat rate.",
    source: { label: "HMRC income tax rates", href: "https://www.gov.uk/income-tax-rates" },
    table: {
      headers: ["Deduction", "Typical basis", "Planning note"],
      rows: [["Income tax", "Bands and allowance", "Marginal rates"], ["National Insurance", "Earnings thresholds", "Payroll deduction"], ["Pension", "Contribution choice", "Can reduce taxable pay"]],
    },
    takeaway: "Compare jobs on estimated net monthly pay, not headline salary alone.",
  },
  "gross-profit-vs-net-profit-explained-for-operators": {
    quickAnswer: "Gross profit subtracts direct costs; net profit subtracts all operating costs. A business can have healthy gross margin and still weak net profit.",
    source: { label: "Companies House accounts guidance", href: "https://www.gov.uk/government/organisations/companies-house" },
    table: {
      headers: ["Profit type", "Costs included", "Decision use"],
      rows: [["Gross profit", "Direct product/service costs", "Pricing and production"], ["Operating profit", "Operating expenses", "Business operations"], ["Net profit", "All costs after tax/finance", "Final profitability"]],
    },
    takeaway: "Do not use gross profit as proof the whole business is profitable.",
  },
  "roi-calculator-explained-for-marketing-campaigns": {
    quickAnswer: "Marketing ROI uses profit relative to campaign cost, while ROAS uses revenue relative to ad spend. They answer different budget questions.",
    source: { label: "Google Ads measurement guidance", href: "https://support.google.com/google-ads/answer/1722066" },
    table: {
      headers: ["Metric", "Formula", "Use"],
      rows: [["ROI", "Profit / cost", "Finance reporting"], ["ROAS", "Revenue / ad spend", "Ad platform optimization"], ["CAC", "Spend / new customers", "Acquisition efficiency"]],
    },
    takeaway: "A campaign can have strong ROAS but weak ROI if margins are low.",
  },
  "rental-yield-vs-monthly-cash-flow-investment-property": {
    quickAnswer: "Rental yield measures rent against property value; cash flow measures money left each month after costs. A high yield property can still have poor cash flow.",
    source: { label: "GOV.UK renting out property guidance", href: "https://www.gov.uk/renting-out-a-property" },
    table: {
      headers: ["Metric", "Formula", "Best use"],
      rows: [["Gross yield", "Annual rent / value", "Market comparison"], ["Net yield", "Rent after costs / value", "Investment quality"], ["Cash flow", "Income - expenses", "Monthly affordability"]],
    },
    takeaway: "Use yield for comparison and cash flow for monthly survival.",
  },
};

export function expandBlogFaqAnswer(slug: string, answer: string): string {
  if (!BLOG_PHASE3_UPGRADES[slug]) return answer;
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  if (words >= 50) return answer;
  return `${answer} For this guide, check the formulas, examples, and source links on the page before relying on the result. The main risk is using the right calculation with the wrong base, date, tax rule, or cost definition, which can produce a confident but misleading number.`;
}
