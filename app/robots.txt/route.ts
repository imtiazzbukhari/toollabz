import { tools } from "@/lib/tools/data";
import { NON_DEFAULT_LOCALES } from "@/lib/i18n/locales";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BASE_URL = "https://toollabz.com";
const TOOLS_PER_SITEMAP = 200;

function toolSitemapLines(): string {
  const toolCount = tools.filter((tool) => !tool.slug.startsWith("embed")).length;
  const shardCount = Math.max(1, Math.ceil(toolCount / TOOLS_PER_SITEMAP));
  return Array.from({ length: shardCount }, (_, id) => `Sitemap: ${BASE_URL}/tools/sitemap/${id}.xml`).join(
    "\n",
  );
}

export async function GET() {
  // Do NOT Disallow /_next/ — Google needs CSS/JS to render Next.js pages correctly.
  // Blocking /_next is a common cause of "Crawled - currently not indexed" and resource warnings in GSC.
  const body = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /embed/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /seo-growth-console/
Disallow: /login
Disallow: /signup

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

Sitemap: ${BASE_URL}/sitemap.xml
${toolSitemapLines()}
Sitemap: ${BASE_URL}/blog/sitemap.xml
${NON_DEFAULT_LOCALES.map((locale) => `Sitemap: ${BASE_URL}/${locale}/sitemap.xml`).join("\n")}
`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
