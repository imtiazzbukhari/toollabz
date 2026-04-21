import type { ToolPageInsight } from "../tool-insights-types";

export const TOOL_INSIGHTS_E: Record<string, ToolPageInsight> = {
  "ai-citation-checker": {
    quickAnswer: "Pattern-scan drafts for links, DOI-like ids, and fuzzy attribution - not live fact checking.",
    explain:
      "Models and humans both skip citations under deadline. This tool surfaces where numbers and authority claims lack obvious references so you can fix before publish.",
    example:
      "A paragraph with “studies show 73%…” but zero URLs scores weak; add the primary paper or dataset link beside each stat.",
    insights: [
      "Treat every surprising digit as guilty until linked to a primary source.",
      "Prefer DOI or official docs over SEO blogs that summarize summaries.",
      "Run again after edits - scores should climb as vague phrases disappear.",
    ],
  },
  "geo-score-calculator": {
    quickAnswer: "Self-graded checklist for excerpt-friendly entity depth, FAQs, schema, sources, comparisons, and freshness.",
    explain:
      "Generative answers favor pages that clearly say who you are, cite originals, and update visibly. Honest self-scoring beats chasing mythical ‘AI rank’ hacks.",
    example:
      "Six YES answers with strong About + FAQ + JSON-LD + dated reviews might land high 80s; missing primary links drags you down fastest.",
    insights: [
      "If models misquote you, tighten first-party wording and add disambiguation on your About page.",
      "Comparison tables should include cons - balanced copy gets excerpted more credibly.",
      "Re-score after each major content release, not monthly calendar noise.",
    ],
  },
  "reddit-keyword-opportunity-finder": {
    quickAnswer: "Turn seeds into four discussion-native angles without pretending to know subreddit volumes.",
    explain:
      "Reddit rewards specificity, humility, and rule literacy. The angles push story, resource, and question formats instead of landing-page spam.",
    example:
      "Seeds “churn, onboarding, PLG” in r/SaaS → resource list thread + failed experiment story + framework ask.",
    insights: [
      "Lurk ten threads before posting - tone mimicry matters more than keyword density.",
      "Put links only where mods allow; sometimes comments > body.",
      "Save modmail clarifications when promos are ambiguous.",
    ],
  },
  "x-viral-hook-generator": {
    quickAnswer: "Batch several hook shapes - lesson, contrarian, hot take - then edit for truth and fit.",
    explain:
      "Scroll stoppers are pattern + specificity. These templates force audience + topic in line one so you aren’t tweeting into the void.",
    example:
      "Audience “indie hackers”, topic “pricing experiments” → thread opener promising three counter-intuitive tests.",
    insights: [
      "If you cannot defend a number, delete it from the hook.",
      "Thread hooks should promise a finite count of tweets.",
      "Regenerate until one variant feels speakable aloud in <5 seconds.",
    ],
  },
  "metadata-stripper-tool": {
    quickAnswer: "Redact common GPS/serial-style keys from pasted metadata text before sharing exports.",
    explain:
      "Exif dumps leak location and device identifiers. Line-based stripping is a quick sanity pass before you paste logs into tickets or docs.",
    example:
      "Drop a text export with GPSLatitude lines - tool removes them while leaving benign copyright notes if they don’t match risky keys.",
    insights: [
      "Always re-open the output - custom vendor tags may still hide PII.",
      "For photos, re-export without metadata in Lightroom/mobile OS tools too.",
      "Don’t rely on this for legal discovery - use forensics-grade workflows when required.",
    ],
  },
  "tiktok-hook-analyzer": {
    quickAnswer: "Measure first-line density and hook cues you can feel in preview - then confirm with retention graphs.",
    explain:
      "TikTok decisions happen in a thumb stop. Character count and question/urgency heuristics approximate whether you gave a reason to stay.",
    example:
      "First line 22 words → likely crowded on screen; tighten to 8 words + on-screen keyword.",
    insights: [
      "Pair spoken hook with text overlay - audio-only viewers need both.",
      "If you tease “3 mistakes”, show mistake #1 before second three.",
      "Use analytics 3s/6s drops to judge real performance, not just this text score.",
    ],
  },
  "youtube-shorts-scene-planner": {
    quickAnswer: "Map hook, payoff, CTA into proportional timestamps you can read aloud to validate pacing.",
    explain:
      "Shorts punish slow reveals. A three-beat sheet keeps you from spending twenty seconds on intros.",
    example:
      "45s short → ~5s hook, ~25s demo, ~15s CTA/loop tie-back after rehearsal tweaks.",
    insights: [
      "Loop the last line visually to the first frame to lift replays.",
      "If midsection drags, cut b-roll, not hook time.",
      "Export vertical safe zones before final text overlays.",
    ],
  },
  "retention-hook-analyzer": {
    quickAnswer: "Spot opening clarity, mid-script pattern language, and list beats that aid skim retention.",
    explain:
      "Retention is part script, part edit. Text heuristics catch missing pattern breaks before you shoot another flat talking head.",
    example:
      "Script with bullets but zero “here’s the twist” language → add a mid-point camera move or on-screen counter.",
    insights: [
      "Verbalize numbers on lists - “number three hits hardest” keeps audio listeners engaged.",
      "Open loops only work if you close them with real value, not filler.",
      "Compare against last video’s average view duration, not vanity impressions.",
    ],
  },
  "tiktok-trend-predictor": {
    quickAnswer: "A disciplined observation matrix - explicitly not live trend scraping or virality guarantees.",
    explain:
      "Trend chasing without logging outcomes is superstition. This frames cadence-aware tests and signals you can actually measure inside TikTok analytics.",
    example:
      "Weekly finance creator → test two hooks × talking head vs VO b-roll weekly; track saves and comment questions.",
    insights: [
      "Creative Center plus your own top 10 posts beat any third-party ‘prediction’.",
      "Seasonal content needs lead time - film early, publish on the upswing.",
      "When a format fatigues, pivot pillar before you blame the algorithm.",
    ],
  },
};
