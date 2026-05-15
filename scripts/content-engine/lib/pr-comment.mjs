/**
 * @param {string} owner
 * @param {string} repo
 * @param {number} issueNumber PR number doubles as issue number for comments API
 * @param {string} token
 * @param {{ slug: string; qualityScore: number; primaryKeyword: string }} meta
 */
export async function postHumanReviewAssistComment(owner, repo, issueNumber, token, meta) {
  const body = [
    "## Human review assist (automation)",
    "",
    "This PR was opened by the content engine. Before merge, please work through:",
    "",
    "### Uniqueness",
    "- [ ] **Intro** is not interchangeable with another post on a nearby keyword (read two intros side by side).",
    "- [ ] **Headings** are specific to this topic, not generic SEO shells.",
    "",
    "### Examples",
    "- [ ] **Numbers** in examples are plausible and internally consistent (rates, timelines, totals).",
    "- [ ] **Scenarios** read like something a reader could actually encounter, not filler vignettes.",
    "",
    "### Human tone",
    "- [ ] **Voice** matches Toollabz (plain, precise, non-hypey); trim any template-y cadence.",
    "- [ ] **Second pass**: read aloud the first 3 paragraphs - if it sounds like generic AI, rewrite the opener.",
    "",
    "### AdSense / RPM (UX-safe)",
    "- [ ] **After intro**: at most one display unit after the first substantive section (not inside the lede).",
    "- [ ] **Mid content**: optional single unit between major H2 blocks (not mid-sentence).",
    "- [ ] **Before FAQ**: one unit max above FAQ; avoid stacking 3+ units on mobile.",
    "- [ ] **UX**: primary CTA to relevant tools stays visible without excessive scroll on mobile.",
    "",
    "---",
    "",
    `Meta: slug \`${meta.slug}\` · keyword \`${meta.primaryKeyword}\` · automated quality score **${meta.qualityScore}** (heuristic, not a substitute for editorial judgment).`,
  ].join("\n");

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`GitHub issue comment failed ${res.status}: ${text.slice(0, 600)}`);
  }
  return JSON.parse(text);
}
