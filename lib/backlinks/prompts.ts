import { pickToolForCategory } from "@/lib/backlinks/tool-picks";

export function guestPostPrompt(opts: {
  prospectDomain: string;
  category: string;
  audience: string;
  tone: string;
  toolUrl: string;
  toolName: string;
}): string {
  return `Write a complete guest post article for ${opts.prospectDomain}.

Context about the target blog:
- Blog name: ${opts.prospectDomain}
- Their focus: ${opts.category}
- Their audience: ${opts.audience}
- Their writing style: ${opts.tone}

Requirements:
- Word count: 1,200-1,800 words
- Title: compelling, includes primary keyword
- Structure: H1 > H2 > H3 hierarchy (use markdown ## and ###)
- Include: introduction, 3-5 main sections, conclusion
- Include: 1 natural contextual link to toollabz.com using this specific tool URL: ${opts.toolUrl}
  Tool name context: ${opts.toolName}
  Anchor text must be natural — brand name or generic. Good: "this free salary calculator", "Toollabz", "a free online tool"
  NEVER use: "best free tools" or keyword-stuffed anchors
- Include: 3-5 relevant statistics with sources (name the source in text)
- Tone: helpful, expert, non-promotional
- Add a FAQ section at the end (3 questions) as markdown H2 "FAQ"

Output ONLY valid JSON (no markdown fence), shape:
{
  "title": "...",
  "meta_description": "...",
  "article_body": "...",
  "suggested_tags": ["..."],
  "toollabz_link_url": "...",
  "toollabz_anchor_text": "...",
  "word_count": 0,
  "estimated_read_time": "X min"
}`;
}

export function resourcePitchPrompt(opts: {
  prospectUrl: string;
  pageFocus: string;
  toolName: string;
  toolUrl: string;
  toolDescription: string;
}): string {
  return `Write a personalized outreach email to get toollabz.com listed on a resource page.

Target resource page: ${opts.prospectUrl}
Page focus: ${opts.pageFocus}
Most relevant toollabz tool: ${opts.toolName} — ${opts.toolUrl}
Tool description: ${opts.toolDescription}

Requirements:
- Subject line: specific, references their page focus
- Email length: 80-120 words maximum
- Tone: genuine, not salesy
- Mention ONE specific thing you noticed about their resource hub (plausible if unknown: "your curated list format")
- Describe the tool in 1-2 sentences
- Clear but soft CTA
- No: "I hope this email finds you well"
- No: keyword stuffing
- No: multiple links (only one tool URL)

Output ONLY valid JSON:
{
  "subject_line": "...",
  "email_body": "...",
  "tool_url": "...",
  "tool_description": "..."
}`;
}

export function directoryListingPrompt(opts: { directoryName: string; categories: string[] }): string {
  return `Write optimized tool listing content for toollabz.com to submit to ${opts.directoryName}.

Requirements:
- Tool name: "Toollabz — Free Online Tools"
- Tagline: max 10 words, benefit-focused
- Short description: 50-80 words
- Long description: 150-200 words
- Categories to tag: ${opts.categories.join(", ")}
- Key features: 5 bullet points (strings)
- Screenshots needed: yes — list which tool pages to screenshot (paths like /tools/emi-calculator)
- Website: https://toollabz.com
- Pricing: Free

Tone: clear, benefit-driven, no hype

Output ONLY valid JSON:
{
  "tagline": "...",
  "short_description": "...",
  "long_description": "...",
  "features": ["..."],
  "categories": ["..."],
  "screenshot_suggestions": ["..."]
}`;
}

export function followUpPrompt(opts: { domain: string; originalSubject: string; snippet: string }): string {
  return `Write a single short follow-up email (max 70 words) referencing prior note about Toollabz for ${opts.domain}.
Original subject was: ${opts.originalSubject}
Prior email snippet: ${opts.snippet}
Friendly, no guilt. Output JSON: {"subject_line":"...","email_body":"..."}`;
}

export function audienceForCategory(category: string): string {
  const map: Record<string, string> = {
    finance: "Consumers and small business owners comparing loans, taxes, and savings.",
    pdf: "Knowledge workers handling documents, contracts, and PDF workflows.",
    ai: "Creators and operators evaluating AI writing and productivity assistants.",
    business: "Founders and operators modeling ROI, margins, and growth.",
    marketing: "Growth marketers measuring campaigns and conversions.",
    "real-estate": "Home buyers, landlords, and agents comparing scenarios.",
    developer: "Engineers validating payloads, encoding, and APIs.",
    utility: "General productivity users converting units and formatting text.",
    tools: "Software buyers and power users comparing tools.",
  };
  return map[category] ?? map.tools;
}

export function toneFromSignals(hasWriteForUs: boolean): string {
  return hasWriteForUs ? "Editorial, formal but approachable" : "Practical, concise, product-adjacent";
}

export { pickToolForCategory };
