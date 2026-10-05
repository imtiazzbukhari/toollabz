/**
 * Programmatic URLs that are indexable and listed in the sitemap. The single source of truth is
 * lib/seo/indexing-policy.ts; everything else 301s to the parent tool.
 */
import { CM_TO_FEET_INDEXABLE_VALUES, LOAN_AMOUNT_INDEXABLE_VALUES } from "@/lib/seo/indexing-policy";

export const SITEMAP_CM_TO_FEET_SLUGS = CM_TO_FEET_INDEXABLE_VALUES;

export const SITEMAP_LOAN_PRINCIPALS = LOAN_AMOUNT_INDEXABLE_VALUES;
