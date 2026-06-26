/**
 * Human-style “example usage” bullets for high-intent tools (replaces templated rotation).
 */
export const PRIORITY_EXAMPLE_BULLETS: Record<string, readonly string[]> = {
  "profit-margin-calculator": [
    "A candle shop sells a gift box for $48 and the materials plus packaging cost $29. The gross profit is $19, so margin is 39.6%.",
    "A SaaS add-on brings in $12,000 of monthly revenue and costs $3,900 to serve. The margin is 67.5%, while markup would be higher because it uses cost as the base.",
    "You are checking whether a 15% discount still leaves room for payment fees and shipping before approving a promotion.",
    "You are standardizing a sales report where one teammate used markup and another used margin, so every product line uses revenue as the denominator.",
  ],
  "vat-calculator": [
    "A UK bakery sells £480 of net goods at 20% VAT. VAT is £96 and the gross invoice total is £576.",
    "A contractor receives a £1,200 VAT-inclusive bill at 20%. The net amount is £1,000 and VAT is £200.",
    "A shop comparing zero-rated and standard-rated items can run each VAT rate separately before preparing the customer receipt.",
    "A freelancer near a quarterly submission can check VAT-exclusive and VAT-inclusive figures before reconciling against HMRC records.",
  ],
  "youtube-earnings-calculator": [
    "A channel with 250,000 monthly views, 55% monetized playbacks, and a $4.80 RPM would estimate about $660 monthly revenue.",
    "A creator comparing two niches can model 80,000 views at $2.20 RPM versus 30,000 views at $9.50 RPM before planning content.",
    "You are checking whether a sponsorship floor makes sense by comparing expected AdSense revenue with the sponsor fee.",
    "You are budgeting editing costs and need to know how many views are required to cover a $450 monthly software stack.",
  ],
  "net-worth-calculator": [
    "A household has $42,000 cash, $310,000 home equity, $68,000 retirement savings, and $24,000 debt. Net worth is $396,000.",
    "A founder separating personal and business finances can run assets and liabilities twice so company debt does not pollute household numbers.",
    "You are preparing a lender worksheet and need one clean total after subtracting credit cards, loans, and other obligations.",
    "You are tracking progress each quarter and want the change in net worth, not just the balance of one investment account.",
  ],
  "break-even-calculator": [
    "A cafe has $6,000 fixed monthly costs, sells lunch boxes for $12, and spends $7 in variable cost per box. Break-even is 1,200 boxes.",
    "A course creator spending $2,400 on production with a $79 price and $9 platform cost needs about 35 sales to break even.",
    "You are deciding whether a paid ad test needs 40, 400, or 4,000 orders before the campaign makes sense.",
    "You are checking if a price cut still covers fixed costs once variable costs rise with every extra sale.",
  ],
  "loan-calculator": [
    "You are quoted 6.4% on a $385k refi over 28 years and want the payment in dollars before you call the loan officer back.",
    "Two banks show the same rate but different fees-you model principal net of points to see which monthly payment actually wins.",
    "You are helping a parent understand why a 7-year car note costs more in interest than a 5-year note even at a similar APR.",
    "You are sanity-checking a mailer that claims “$899/mo” on a sticker price that does not match any amortization you recognize.",
  ],
  "salary-after-tax-calculator": [
    "You just got a $92k offer in Oregon and want a rough monthly number before you negotiate moving expenses.",
    "You are a contractor comparing a W-2 role at $110k versus 1099 at $130k and need a quick after-tax feel, not a CPA packet.",
    "HR quoted “competitive” gross bands-you translate each to take-home so rent stays under one-third of net.",
    "You are updating a household budget after a raise and want to see net delta when you bump the effective rate a point or two.",
  ],
  "emi-calculator": [
    "You are choosing between a 60-month and 72-month auto loan and want to see how much extra interest buys you $80 a month breathing room.",
    "Your credit union pre-approved ₹45L at 8.6%-you plug tenure options before you lock the sanction letter.",
    "You are building a wedding spreadsheet and someone floated a personal loan-you model EMI against fixed savings contributions.",
    "You are comparing flat EMI versus reducing balance language in two PDFs and need one consistent payment number to compare.",
  ],
  "compound-interest-calculator": [
    "You inherited $18k and want a straight answer on what 5.1% compounded monthly looks like in eight years if you never add another dime.",
    "You are arguing with a friend about whether “10% a year” doubles in seven years or ten-you settle it with their compounding assumption.",
    "You are modeling a CD ladder versus one rollover and want the maturity gap in dollars, not vibes.",
    "You are writing a blog post and need a verifiable future value for a fixed principal with monthly compounding.",
  ],
  "paycheck-calculator-usa": [
    "You are biweekly at $78k gross, 22% combined withholding in your last stub, and want to see if a 3% 401(k) change moves rent money.",
    "You got promoted from $68k to $74k and want a per-check bump estimate before benefits open enrollment skews the picture.",
    "You are comparing offers in Austin versus Chicago and plug different state withholding assumptions side by side.",
    "You are teaching a new grad to read a paystub-you reverse-engineer net from gross using their actual percentages.",
  ],
  "rent-vs-buy-calculator-usa": [
    "You pay $2,350 rent with 3.5% annual increases and are eyeing a $3,100 PITI buy scenario over a seven-year horizon you might actually hold.",
    "You are relocating for two years and want a cash-outflow comparison without pretending you will own for thirty.",
    "Your partner wants a townhouse; you want to stay liquid-you stress-test buy costs with maintenance reserves included.",
    "You are writing an offer letter deadline extension and need defensible numbers for the “rent another year” path.",
  ],
  "mortgage-payment-calculator": [
    "You found a listing at $512k with 10% down and want P&I plus a realistic tax/insurance/PMI stack before you tour on Saturday.",
    "Your escrow analysis sheet looks off-you rebuild principal and interest at the note rate to compare against the servicer line.",
    "You are deciding between 15- and 30-year at the same rate and want the payment gap in dollars, not just APR talk.",
    "You are helping a sibling budget the first year of ownership beyond the Zillow estimate-HOA and PMI were missing there.",
  ],
  "credit-card-payoff-calculator": [
    "You have $6,200 at 26.9%, $2,100 at 19.9%, and $900 at 0% promo ending in four months-you want an avalanche plan with dates.",
    "You can throw $450 a month at debt but want to see how many months shift if you snowball the smallest card first for motivation.",
    "You are deciding whether to pause investing to clear cards-you model payoff months versus minimum-only drag.",
    "You are non-judgmentally showing a roommate why paying only minimums on the big card is the expensive option.",
  ],
  "refinance-break-even-calculator": [
    "Closing costs are $4,800, you save $118 a month on P&I, and you might move in three years-you want break-even months in plain English.",
    "You are offered “no closing cost” with a higher rate versus paying points-you compare months-to-recover on each path.",
    "You extended term to drop payment and want to see how long it takes for the refi to pay for itself on cash flow, not feelings.",
    "You are writing an email to your spouse with one screenshot-friendly number: months until refi fees are paid back.",
  ],
  "roi-calculator": [
    "You spent $3,400 on a course launch stack and cleared $9,800-you want ROI without confusing revenue with profit.",
    "You are pitching a tool purchase to your manager: $14k annual license versus 22 hours a week saved at a loaded hourly rate.",
    "You are comparing two ad creatives on small spend and want ROI on net gain after platform fees, not gross sales.",
    "You are cleaning up a board slide where someone mixed “200% ROI” with “2x return”-you standardize on one definition.",
  ],
};
