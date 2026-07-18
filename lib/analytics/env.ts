/**
 * Public env reads for third-party scripts (no secrets here).
 * Publisher ID (ca-pub-…) is safe to expose in the browser.
 */

/** Site default; set NEXT_PUBLIC_ADSENSE_CLIENT_ID to override (e.g. staging). */
export const ADSENSE_PUBLISHER_DEFAULT = "ca-pub-7830316671610363";

const fromEnv = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "").trim();

/** Resolved client id for `adsbygoogle.js` and `<ins data-ad-client>`. */
export const ADSENSE_PUBLISHER_ID = fromEnv || ADSENSE_PUBLISHER_DEFAULT;

/**
 * Load AdSense only when explicitly enabled. Keeps calculator pages free of third-party
 * ad JS until real slots ship (avoids unused script cost on LCP/INP).
 */
export const ADSENSE_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

/** @deprecated Prefer ADSENSE_PUBLISHER_ID — kept for any external imports. */
export const ADSENSE_CLIENT_ID = ADSENSE_PUBLISHER_ID;
