import type { MetadataRoute } from "next";
import { blogPostSlugs } from "@/lib/blog/registry";
import { categories, tools } from "@/lib/tools/data";
import { PROGRAMMATIC_LOAN_PRINCIPALS, PROGRAMMATIC_SALARY_GROSS } from "@/lib/programmatic-seo/amount-routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 🔥 HARD FIX — no dependency on env mistakes
  const siteUrl = "https://toollabz.com";

  const staticPages = [
    "",
    "/tools",
    "/blog",
    "/pricing",
    "/about",
    "/privacy",
    "/terms",
    "/disclaimer",
    "/contact",
  ].map((url) => ({
    url: `${siteUrl}${url}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: url === "" ? 1 : 0.8,
  }));

  const categoryLandingPages = [
    "/finance-tools",
    "/business-tools",
    "/real-estate-tools",
    "/ai-tools",
    "/utility-tools",
    "/pdf-tools",
    "/developer-tools",
    "/marketing-tools",
  ].map((url) => ({
    url: `${siteUrl}${url}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.82,
  }));

  const categoryPages = categories.map((category) => ({
    url: `${siteUrl}/category/${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const toolPages = tools.map((tool) => ({
    url: `${siteUrl}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const cmProgrammatic = [1, 10, 25, 50, 100, 170, 180, 200, 500, 1000].map((cm) => ({
    url: `${siteUrl}/cm-to-feet/${cm}-cm-to-feet`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const loanCountries = ["usa", "uk", "canada", "india", "pakistan"].map((country) => ({
    url: `${siteUrl}/loan-calculator/${country}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const salaryCountries = ["pakistan", "usa", "uk", "uae", "india"].map((country) => ({
    url: `${siteUrl}/salary-tax-calculator/${country}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const salaryAfterTaxProgrammatic = ["usa", "uk", "california", "texas", "new-york", "florida"]
    .flatMap((country) =>
      [30000, 50000, 70000, 85000, 100000, 120000, 150000, 200000].map((amount) => ({
        url: `${siteUrl}/salary-after-tax-calculator/${country}/${amount}-salary-after-tax-${country}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.72,
      }))
    );

  const loanPrincipalProgrammatic = PROGRAMMATIC_LOAN_PRINCIPALS.map((amount) => ({
    url: `${siteUrl}/loan-calculator/p/${amount}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.71,
  }));

  const salaryGrossProgrammatic = PROGRAMMATIC_SALARY_GROSS.map((amount) => ({
    url: `${siteUrl}/salary-after-tax/p/${amount}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.71,
  }));

  const blogArticles = blogPostSlugs.map((slug) => ({
    url: `${siteUrl}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [
    ...staticPages,
    ...categoryLandingPages,
    ...categoryPages,
    ...toolPages,
    ...cmProgrammatic,
    ...loanCountries,
    ...salaryCountries,
    ...salaryAfterTaxProgrammatic,
    ...loanPrincipalProgrammatic,
    ...salaryGrossProgrammatic,
    ...blogArticles,
  ];
}
