import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "Free Online Tool";
  const category = searchParams.get("category") ?? "Calculator";

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
          {category} · Free · No Account Required
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
