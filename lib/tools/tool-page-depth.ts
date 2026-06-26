import type { ToolDefinition } from "./types";
import { getToolFormula } from "./content";

/** Approximate word count for SEO depth checks (plain text). */
export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function fieldLabels(tool: ToolDefinition): string {
  return tool.fields.map((f) => f.label).join(", ");
}

const priorityMistakes: Record<string, string[]> = {
  "profit-margin-calculator": [
    "Confusing margin with markup is the classic pricing mistake: 40% margin is not 40% markup. Margin divides profit by revenue; markup divides profit by cost, so the same GBP 40 profit can produce very different percentages.",
    "Leaving indirect costs out of the cost field can make a weak product look healthy. Rent, staff time, payment fees, packaging, returns, and marketplace commissions may belong in cost when you are checking real business margin.",
    "Comparing VAT-exclusive revenue with VAT-inclusive costs creates a false margin. Keep all inputs on the same VAT basis before you quote the percentage.",
  ],
  "vat-calculator": [
    "Removing VAT from a VAT-inclusive price by subtracting 20% is wrong. For standard UK VAT, divide the gross price by 1.20, then subtract the net amount to get VAT.",
    "Applying the 20% standard rate to reduced-rate or zero-rated goods can overcharge customers and distort records. Food, children's clothing, books, and some energy items may use different UK VAT treatment.",
    "Calculating VAT before applying a discount can overstate the invoice total. VAT is usually calculated on the discounted taxable amount, not the original shelf price.",
  ],
  "salary-after-tax-calculator": [
    "Using a single flat tax rate for a progressive tax system can understate or overstate take-home pay. UK and US salary calculations often involve bands, allowances, payroll frequency, and deductions.",
    "Ignoring pension, benefits, student loans, or local taxes makes the estimate too optimistic. Add those deductions separately when they affect your payslip.",
    "Comparing annual gross salary with monthly net rent without converting periods leads to bad budgeting. Convert both to the same monthly or yearly basis before deciding affordability.",
  ],
  "loan-calculator": [
    "Entering APR as a monthly rate instead of annual APR can inflate the payment dramatically. Use the annual percentage rate in the rate field unless the page explicitly asks for monthly rate.",
    "Forgetting origination fees or points can make two loans look equal when they are not. Compare total cost as well as monthly payment before choosing the lower-looking option.",
    "Extending the term lowers the payment but often increases total interest. Check both monthly affordability and lifetime cost.",
  ],
  "roi-calculator": [
    "Using revenue as gain instead of net gain makes ROI look better than it is. Subtract the original cost and any direct expenses before calculating return.",
    "Mixing time periods creates misleading comparisons. A 30% return over one month and a 30% return over three years are not equivalent decisions.",
    "Comparing ROI with ROAS can confuse finance and marketing teams. ROI uses profit relative to cost; ROAS uses revenue relative to ad spend.",
  ],
  "compound-interest-calculator": [
    "Entering 5 as 0.05 or 0.05 as 5 changes the rate by a factor of 100. Use the format requested by the field label.",
    "Ignoring compounding frequency can cause small but real differences over long periods. Monthly and annual compounding do not produce identical outcomes.",
    "Treating the projection as guaranteed is risky. Rates can change, fees can apply, and taxes can reduce the actual amount you keep.",
  ],
  "percentage-calculator": [
    "Percentage points and percentage changes are not the same. A rate moving from 2% to 3% is a 1 percentage point increase, but a 50% relative increase.",
    "Reversing a percentage decrease by adding the same percentage back gives the wrong answer. If GBP 100 drops 20% to GBP 80, adding 20% to GBP 80 gives GBP 96, not GBP 100.",
    "Using the new value as the base for percentage change changes the result. Percentage change should divide by the original value unless you are calculating percentage difference.",
  ],
  "bmi-calculator": [
    "Entering height in the wrong format is a common error. Five feet ten inches is about 1.78 metres, not 5.10 metres.",
    "Using BMI alone to judge health can mislead athletes, older adults, and people with different body compositions. BMI does not separate muscle, fat, bone density, or fat distribution.",
    "Applying adult BMI categories to children is wrong. Children and teenagers need age-and-sex percentile charts rather than the adult 18.5-24.9 healthy range.",
  ],
  "tip-calculator": [
    "Adding a tip on top of an included service charge can double-tip accidentally. Check the bill for service charge or discretionary gratuity before adding more.",
    "Assuming UK and US tipping norms are the same can create awkward totals. UK tipping is optional in many settings, while US restaurant tipping is expected at a higher percentage.",
    "Splitting the bill before adding the tip can understate each person's share. Add tip to the full bill first, then divide by the number of people.",
  ],
  "break-even-calculator": [
    "Putting fixed costs into variable cost double-counts expenses. Rent and salaried overhead usually belong in fixed costs; materials and per-sale processing fees usually belong in variable costs.",
    "Forgetting variable costs makes break-even look too easy. A product with a GBP 20 price and GBP 12 unit cost contributes only GBP 8 toward fixed costs.",
    "Using average price while running heavy discounts can understate the units needed. Model the actual net selling price after discounts and platform fees.",
  ],
  "net-worth-calculator": [
    "Counting the full property value but also counting the mortgage as zero overstates net worth. Include asset value and the outstanding loan together.",
    "Ignoring credit card balances, tax bills, or personal loans gives a cleaner-looking but incomplete picture. Net worth needs all liabilities, not only bank loans.",
    "Mixing business and personal assets can make household planning confusing. Run separate versions if company debt or inventory should not be included.",
  ],
  "paycheck-calculator-usa": [
    "Using federal tax only misses state income tax, local tax, Social Security, Medicare, and benefit deductions. US paycheck estimates need all relevant withholding assumptions.",
    "Comparing weekly and biweekly pay without annualizing causes confusion. A biweekly paycheck happens 26 times per year, not 24.",
    "Ignoring pre-tax deductions changes taxable wages. Retirement contributions, health insurance, and HSA deductions can change the net amount.",
  ],
  "currency-converter": [
    "Using a mid-market rate and expecting the same bank charge is a common mistake. Banks, cards, and brokers often add spreads or fixed fees.",
    "Converting stale rates for volatile currencies can mislead invoices or travel budgets. Refresh the rate when the decision depends on current pricing.",
    "Mixing source and target direction reverses the answer. Confirm whether the rate means target per one source unit before multiplying.",
  ],
  "json-formatter": [
    "Pasting JavaScript objects instead of valid JSON causes parse errors. JSON requires double-quoted keys and strings, and does not allow trailing commas.",
    "Assuming formatting validates business rules is risky. Pretty JSON can still contain the wrong fields, invalid IDs, or unexpected types.",
    "Sharing formatted secrets can leak API keys or tokens. Remove credentials before pasting JSON from production logs.",
  ],
  "base64-encoder-decoder": [
    "Treating Base64 as encryption is unsafe. Encoding makes data transport-safe, but anyone can decode it if they have the string.",
    "Decoding JWT payloads without verifying signatures can lead to false trust. Base64 decoding only reveals the claims; it does not prove authenticity.",
    "Forgetting URL-safe Base64 variants can break API integrations. Some tokens replace plus and slash characters for URL compatibility.",
  ],
  "password-generator": [
    "Choosing a short password with symbols is weaker than a long random password. Length and randomness matter more than cosmetic complexity.",
    "Reusing a generated password across sites defeats the point. Use a unique password for every important account.",
    "Storing generated passwords in plain notes or screenshots creates a new risk. Save them in a reputable password manager.",
  ],
  "word-counter": [
    "Counting words in one editor and submitting in another can differ because of hyphens, emojis, or pasted formatting. Use the same counting rule near the final submission.",
    "Ignoring character limits can break meta descriptions, social posts, and application fields even when word count looks fine. Check both values.",
    "Leaving boilerplate or notes in the pasted text inflates the count. Paste only the final body you intend to measure.",
  ],
  "character-counter": [
    "Counting words when the platform limit is characters can make the text too long. Meta descriptions, SMS messages, and social posts often care about characters, not words.",
    "Forgetting spaces can change whether text fits a limit. Some systems count spaces and line breaks; others only count visible non-space characters.",
    "Pasting hidden line breaks or copied formatting can inflate the count. Paste plain text when you need a clean character measurement.",
  ],
};

/**
 * Extra long-form blocks so every tool page clears ~450+ words in main editorial
 * (excluding nav/footer/aside chrome). Merges with existing getToolSeoContent + FAQs.
 */
export function getToolDepthIntroParagraphs(tool: ToolDefinition): string[] {
  const kw = tool.keywords[0] ?? tool.name.toLowerCase();
  return [
    `What is ${tool.name}? It is a focused, browser-based utility on Toollabz that helps you work with "${kw}" without installing desktop software. You open the HTTPS page, enter the fields that matter (${fieldLabels(tool)}), and read a structured result you can copy into email, tickets, or spreadsheets.`,
    `Who needs ${tool.name}? Anyone who touches ${kw} in real work: operators sanity-checking a number before a meeting, students rehearsing a formula, founders comparing two scenarios, or support teams reproducing a customer's math. The interface stays calm on purpose so you can return weekly without relearning hidden controls.`,
    `A concrete use case: imagine you need a defensible baseline for ${kw} before you commit to a vendor, lender, or client. You plug conservative inputs, capture the output with the date in your notes, then iterate with optimistic and pessimistic cases. ${tool.name} keeps the arithmetic consistent so the discussion stays on assumptions, not mysteriously drifting totals.`,
    `Use the formula and example sections below as the reference point for this page. They show which fields drive the result, what assumptions still belong to you, and when a follow-up calculator is useful.`,
  ];
}

/** Typical pitfalls when using this tool or interpreting its output. */
export function getToolCommonMistakesParagraphs(tool: ToolDefinition): string[] {
  const kw = tool.keywords[0] ?? tool.name.toLowerCase();
  const labels = tool.fields.map((f) => f.label).join(", ");
  const priority = priorityMistakes[tool.slug];
  if (priority) return priority;
  return [
    `Mixing units is the fastest way to get a believable-but-wrong ${kw} answer. Double-check whether each field expects a percent as 7.5 versus 0.075, whether money is monthly or annual, and whether distances or weights use the same system throughout (${labels}).`,
    `Cherry-picking one scenario and treating it as guaranteed is another common slip. Run a conservative and an aggressive case, write down both, and only then share a single headline number-especially if someone else will rely on it for pricing, payroll, or compliance.`,
    `Stale inputs quietly compound: tax brackets, posted rates, rent assumptions, and utility fees change. If your ${tool.name} output is more than a few weeks old for a volatile input, refresh the numbers instead of defending the earlier screenshot.`,
  ];
}

/** Numbered-style steps expanded to prose (100+ words total). */
export function getToolDepthHowToNarrative(tool: ToolDefinition): string[] {
  const steps = tool.howToUse;
  const labels = fieldLabels(tool);
  const lines: string[] = [
    `Here is the recommended flow in five beats so you never miss a field. Step 1: enter each value carefully for ${labels} - use plain numbers unless the label asks for symbols. Step 2: if the tool offers selectors (dropdowns, toggles, or modes), pick the option that matches your jurisdiction or pricing model; mismatched mode is the top source of "wrong" outputs.`,
    `Step 3: click Calculate, Convert, or Generate (the primary action button). The page validates obvious mistakes before running so you do not get silent garbage. Step 4: read the headline result first, then scan any bullet breakdowns or secondary lines that explain how the total was composed.`,
    `Step 5: copy the result block or screenshot the section for your notes, then bookmark the URL if ${tool.keywords[0] ?? "this workflow"} shows up often. When the answer feeds another tool, open a related card from the bottom of the page instead of retyping assumptions from memory.`,
  ];
  if (steps.length) {
    lines.unshift(
      `Your official checklist from the product team: ${steps.map((s, i) => `${i + 1}) ${s}`).join(" ")} - treat those as the minimum happy path, then use the five beats above when you want a disciplined review habit.`,
    );
  }
  return lines;
}

/** Formula + variables + numeric toy example (50–120 words). */
export function getToolDepthFormulaSection(tool: ToolDefinition): string[] {
  const f = getToolFormula(tool.slug);
  const kw = tool.keywords[0] ?? "output";
  return [
    `Method and formula: ${f} Variables map directly to the labeled fields on this page; if a percentage is required, enter it as a number such as 7.5 for 7.5% unless the label states otherwise.`,
    `Illustrative numbers (not advice): suppose a toy input set produces an intermediate value of 120 and a rate multiplier of 1.08 - the tool would surface the composed ${kw} so you can trace how the pieces combine. Swap in your own figures to mirror a contract, payslip, or invoice you are allowed to model.`,
  ];
}
