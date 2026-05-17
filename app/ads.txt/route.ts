import { NextResponse } from "next/server";

/**
 * ads.txt for authorized digital sellers (Google AdSense / programmatic).
 * Served as plain text at `/ads.txt` (App Router — no HTML shell).
 *
 * @see https://support.google.com/adsense/answer/7532444
 */
export const dynamic = "force-static";

const ADS_TXT_BODY = "google.com, pub-7830316671610363, DIRECT, f08c47fec0942fa0\n";

export function GET() {
  return new NextResponse(ADS_TXT_BODY, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
