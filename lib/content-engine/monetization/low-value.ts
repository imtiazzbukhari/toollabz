/**
 * Deprioritize generic / low-commercial-intent angles (RPM protection).
 */

const UTILITY_SLUG_HINTS =
  /\b(cm-to-feet|kg-to-lbs|km-to-miles|celsius-to-fahrenheit|mb-to-gb|case-converter|word-counter|json-formatter|password-generator|color-palette|username-generator|random-name|url-encoder|base64)\b/i;

const GENERIC_SHORT_QUERY = /^[a-z0-9\s-]{1,18}$/;

/** Money / decision terms — if absent on short queries, treat as low commercial intent. */
const VALUE_HINT =
  /\b(money|pay|cost|price|save|debt|loan|tax|salary|mortgage|insurance|invest|roi|profit|budget|credit|rate|apr|payment|refinance|rent|buy|sell|business|invoice|revenue|fee|premium|deductible)\b/i;

export function lowValueKeywordPenalty(keyword: string, sourceHints = ""): number {
  const k = keyword.toLowerCase();
  const combined = `${k} ${sourceHints}`.toLowerCase();
  let penalty = 0;

  if (UTILITY_SLUG_HINTS.test(combined)) penalty += 18;

  if (k.split(/\s+/).length <= 2 && GENERIC_SHORT_QUERY.test(k) && !VALUE_HINT.test(k)) {
    penalty += 12;
  }

  if (/\b(free online converter|random generator|word count only)\b/i.test(k)) penalty += 10;

  return Math.min(35, penalty);
}
