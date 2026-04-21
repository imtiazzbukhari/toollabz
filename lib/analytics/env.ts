/**
 * Public env reads for third-party scripts (no secrets here).
 */

export const ADSENSE_CLIENT_ID = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "").trim();
