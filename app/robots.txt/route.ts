export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const body = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /embed/
Disallow: /admin/

# AI Crawlers - all allowed
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Gemini-User
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: YouBot
Allow: /

Sitemap: https://toollabz.com/sitemap.xml
Sitemap: https://toollabz.com/tools/sitemap/0.xml
Sitemap: https://toollabz.com/tools/sitemap/1.xml
Sitemap: https://toollabz.com/blog/sitemap.xml
`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
