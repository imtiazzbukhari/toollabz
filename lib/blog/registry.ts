import type { BlogPostDefinition } from "./types";
import { salaryAfterTaxUsaPost } from "./articles/salary-after-tax-usa";
import { emiLoanPost } from "./articles/emi-loan";
import { emiExplainedPost } from "./articles/emi-explained";
import { rentVsBuyUsaPost } from "./articles/rent-vs-buy-usa";
import { roiSimplePost } from "./articles/roi-simple";
import { roiBusinessPost } from "./articles/roi-business";
import { hourlyVsSalaryPost } from "./articles/hourly-vs-salary";
import { mortgagePaymentUsaPitiPost } from "./articles/mortgage-payment-usa-piti";
import { refinanceBreakEvenUsaPost } from "./articles/refinance-break-even-usa";
import { creditCardPayoffStrategiesPost } from "./articles/credit-card-payoff-strategies";
import { personalInjurySettlementRealityPost } from "./articles/personal-injury-settlement-reality";
import { medicalMalpracticeBasicsPost } from "./articles/medical-malpractice-basics";
import { businessLoanLenderScanPost } from "./articles/business-loan-lender-scan";
import { homeEquityUsaBorrowPost } from "./articles/home-equity-usa-borrow";
import { studentLoanForgivenessRoadmapPost } from "./articles/student-loan-forgiveness-roadmap";
import { toolSeoExpansionPosts } from "./articles/tool-seo-expansion";

export const blogPosts: BlogPostDefinition[] = [
  ...toolSeoExpansionPosts,
  mortgagePaymentUsaPitiPost,
  refinanceBreakEvenUsaPost,
  creditCardPayoffStrategiesPost,
  personalInjurySettlementRealityPost,
  medicalMalpracticeBasicsPost,
  businessLoanLenderScanPost,
  homeEquityUsaBorrowPost,
  studentLoanForgivenessRoadmapPost,
  hourlyVsSalaryPost,
  roiBusinessPost,
  roiSimplePost,
  rentVsBuyUsaPost,
  emiExplainedPost,
  emiLoanPost,
  salaryAfterTaxUsaPost,
].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

export function blogPostBySlug(slug: string): BlogPostDefinition | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export const blogPostSlugs = blogPosts.map((p) => p.slug);
