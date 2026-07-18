import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { buildPublicHttpsUrl, requestIsHttps } from "../middleware";

describe("middleware public URL helpers (SSL outage regression)", () => {
  it("strips Node listen port so Location never becomes https://host:3000/", () => {
    const req = new NextRequest("http://toollabz.com:3000/", {
      headers: {
        host: "toollabz.com",
        "x-forwarded-proto": "https",
      },
    });
    const url = buildPublicHttpsUrl(req, "toollabz.com");
    expect(url.toString()).toBe("https://toollabz.com/");
    expect(url.port).toBe("");
    expect(url.href).not.toContain(":3000");
  });

  it("detects https from X-Forwarded-Proto even when nextUrl is http://…:3000", () => {
    const req = new NextRequest("http://toollabz.com:3000/tools/loan-calculator", {
      headers: {
        host: "toollabz.com",
        "x-forwarded-proto": "https",
      },
    });
    expect(requestIsHttps(req)).toBe(true);
    expect(req.nextUrl.protocol).toBe("http:");
    expect(req.nextUrl.port).toBe("3000");
  });

  it("treats missing forwarded proto as non-https on internal http URL", () => {
    const req = new NextRequest("http://toollabz.com:3000/", {
      headers: { host: "toollabz.com" },
    });
    expect(requestIsHttps(req)).toBe(false);
  });
});
