import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

/**
 * Satori (ImageResponse) throws mid-stream when a <div> has several child nodes without
 * `display: flex`. The category line used to interpolate three text children, which aborted the
 * response and surfaced as a 502 behind the proxy (audit M-07). Each text node is now a single
 * string. Node runtime keeps the renderer off the edge wasm bundle used by self-hosted builds.
 */
export const runtime = "nodejs";

const MAX_TITLE = 90;
const MAX_CATEGORY = 40;

function clean(value: string | null, fallback: string, max: number): string {
  const text = (value ?? "").replace(/[\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return fallback;
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = clean(searchParams.get("title"), "Free Online Tool", MAX_TITLE);
  const category = clean(searchParams.get("category"), "Calculator", MAX_CATEGORY);

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "60px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 20, color: "#93c5fd", marginBottom: 24, fontWeight: 500 }}>
          toollabz.com - Free Online Tools
        </div>
        <div
          style={{
            fontSize: title.length > 30 ? 52 : 64,
            color: "white",
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: "900px",
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 26, color: "#bfdbfe", marginTop: 32 }}>
          {`${category} · Free · No Account Required`}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400" },
    },
  );
}
