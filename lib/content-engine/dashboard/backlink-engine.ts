export type OutreachTemplate = {
  id: string;
  subject: string;
  body: string;
  safetyNotes: string[];
};

const DAILY_CAP = 8;

/**
 * Safe, human-in-the-loop outreach templates. No auto-send; cap 8/day when wired to a mailer.
 */
export function buildOutreachTemplates(siteName = "Toollabz", siteUrl = "https://toollabz.com"): OutreachTemplate[] {
  return [
    {
      id: "guest-value-first",
      subject: `Quick idea for readers of {{their_site}} ({{topic}})`,
      body: `Hi {{name}},

I’ve been putting together practical, citation-friendly resources on {{topic}} and thought a short collaboration might fit your audience.

If you’re open to it, I can share a draft outline that adds a net-new angle (no fluff) and links to primary sources only.

Either way, thanks for the great work on {{their_site}}.

Thanks,
{{sender}}
${siteName} · ${siteUrl}`,
      safetyNotes: [
        "Send max 8/day per domain pool; never mail scraped lists without verification.",
        "Personalize {{topic}} from a real page you read; skip generic merge fields.",
        "Do not buy links; decline sites with obvious PBN patterns.",
      ],
    },
    {
      id: "broken-link-help",
      subject: `Noticed a broken reference on {{page_title}}`,
      body: `Hi {{name}},

While reading {{page_url}}, I hit a broken link to {{dead_url}}.

We published an updated explainer that covers the same intent: {{our_url}}

No pressure. I am only sharing in case it saves you a 404.

Thanks,
{{sender}}
${siteName}`,
      safetyNotes: [
        "Use only genuinely broken links you verified manually.",
        "One page per email; no blast templates.",
      ],
    },
  ];
}

export function backlinkEngineSummary() {
  return {
    dailyOutreachCap: DAILY_CAP,
    approvalRequired: true,
    trackingFields: ["sent_at", "replied_at", "link_live_url", "domain_rating_optional"],
    templates: buildOutreachTemplates(),
  };
}
