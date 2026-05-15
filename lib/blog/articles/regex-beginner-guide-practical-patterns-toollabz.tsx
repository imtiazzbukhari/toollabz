import Link from "next/link";
import type { BlogPostDefinition } from "../types";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        Regular expressions are tiny programs for pattern matching. They shine at “find all invoice numbers that look like
        INV-####-YY” and fail loudly at “parse arbitrary HTML with nested tables.” Your job is knowing which side of that line you
        are standing on before you ship regex to production.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="literals">
        Literals vs metacharacters
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Most characters match themselves. Metacharacters like <code className="rounded bg-violet-100/80 px-1">.</code>{" "}
        <code className="rounded bg-violet-100/80 px-1">*</code> <code className="rounded bg-violet-100/80 px-1">+</code>{" "}
        <code className="rounded bg-violet-100/80 px-1">?</code> <code className="rounded bg-violet-100/80 px-1">[]</code>{" "}
        <code className="rounded bg-violet-100/80 px-1">()</code> <code className="rounded bg-violet-100/80 px-1">|</code> change
        meaning. Escape metacharacters with backslash when you need literal dots in hostnames:{" "}
        <code className="rounded bg-violet-100/80 px-1">toollabz\.com</code>.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="anchors">
        Anchors and boundaries save careers
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        <code className="rounded bg-violet-100/80 px-1">^</code> and <code className="rounded bg-violet-100/80 px-1">$</code> anchor
        to start/end of a line (or string, depending on flags). Word boundaries <code className="rounded bg-violet-100/80 px-1">\b</code>{" "}
        stop “cat” from matching “scatter”. Without anchors, validating an email typed{" "}
        <code className="rounded bg-violet-100/80 px-1">not-an-email</code> might still find a substring that looks like a TLD.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="examples">
        Three practical patterns
      </h2>
      <ul className="mt-3 list-disc space-y-3 pl-6 text-slate-700">
        <li>
          <strong>Hex colors</strong>:{" "}
          <code className="rounded bg-violet-100/80 px-1 text-xs">^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$</code>
        </li>
        <li>
          <strong>ISO-like dates</strong>:{" "}
          <code className="rounded bg-violet-100/80 px-1 text-xs">^\d{4}-\d{2}-\d{2}$</code> (still does not validate February 30 - regex is not a calendar).
        </li>
        <li>
          <strong>Slugs</strong>:{" "}
          <code className="rounded bg-violet-100/80 px-1 text-xs">^[a-z0-9]+(?:-[a-z0-9]+)*$</code>
        </li>
      </ul>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="catastrophic">
        Catastrophic backtracking (the CPU bonfire)
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Nested quantifiers like <code className="rounded bg-violet-100/80 px-1 text-xs">(a+)+$</code> against slightly mismatched
        inputs can explode into exponential trial paths on classic NFA engines. Symptoms: regex that “works in unit tests” but
        wedges production when fed 2 KB of attacker-controlled text. Mitigations: possessive quantifiers where supported, atomic
        groups, explicit character classes instead of <code className="rounded bg-violet-100/80 px-1">.*</code> soup, or refuse the
        job and parse with a real tokenizer.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="flags">
        Flags you should set on purpose
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Case-insensitive search needs <code className="rounded bg-violet-100/80 px-1">i</code>; multiline line anchors need{" "}
        <code className="rounded bg-violet-100/80 px-1">m</code>; dot-all behavior (if available) changes whether{" "}
        <code className="rounded bg-violet-100/80 px-1">.</code> crosses newlines. Document flags beside every stored pattern - future
        you will not remember whether <code className="rounded bg-violet-100/80 px-1">^</code> meant string start or logical line
        start.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="compare">
        Regex vs parser
      </h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm text-slate-800">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Task</th>
              <th className="px-4 py-3">Regex OK?</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-3">Extract order IDs from logs</td>
              <td className="px-4 py-3">Usually yes with anchors + tests</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Parse nested JSON</td>
              <td className="px-4 py-3">No - use JSON.parse + schema</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="json-bridge">
        Bridge to JSON tooling
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        After extracting JSON substrings from logs, validate with{" "}
        <Link href="/tools/json-validator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          JSON validator
        </Link>{" "}
        and pretty-print using{" "}
        <Link href="/tools/json-formatter" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          JSON formatter
        </Link>
        . For conceptual background, read{" "}
        <Link href="/blog/json-formatting-and-validation-explained-developer" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          JSON formatting explained
        </Link>
        .
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="tool">
        Regex tester workflow
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Use the{" "}
        <Link href="/tools/regex-tester" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          regex tester
        </Link>{" "}
        with three fixtures: a matching example, a near-miss, and a malicious counterexample (unicode homoglyphs, extra whitespace).
        Add global vs non-global flags deliberately - global replacements have surprised many a code review.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="hub">
        Developer hub
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        More utilities await on the{" "}
        <Link href="/developer-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          developer tools hub
        </Link>
        .
      </p>
    </>
  );
}

export const regexBeginnerGuidePost: BlogPostDefinition = {
  slug: "regex-beginner-guide-practical-patterns-toollabz",
  title: "Regex beginner guide: practical patterns (without catastrophic backtracking)",
  description:
    "Teach literals, anchors, three copy-ready patterns, when regex beats parsers, and link to Toollabz regex tester plus JSON formatter/validator companion guides.",
  excerpt:
    "Regex is unbeatable for bounded patterns in logs and forms - and the wrong tool for nested languages - use anchors, fixtures, and the regex tester before you ship.",
  publishedAt: "2026-05-14",
  dateModified: "2026-05-14T12:00:00.000Z",
  category: "Developer",
  tags: ["regex", "patterns", "validation", "logs"],
  readingTimeMinutes: 13,
  relatedToolSlugs: ["regex-tester", "json-validator", "json-formatter", "url-encoder-decoder", "word-counter"],
  relatedPostsSlugs: [
    "json-formatting-and-validation-explained-developer",
    "developer-text-json-yaml-html-csv-pipeline-toollabz",
    "jwt-expiry-api-healthchecks-curl-playbook-toollabz",
    "sql-cron-readability-schedulers-developer-guide-toollabz",
  ],
  tableOfContents: [
    { id: "literals", label: "Literals vs meta" },
    { id: "anchors", label: "Anchors" },
    { id: "examples", label: "Three patterns" },
    { id: "catastrophic", label: "Backtracking risk" },
    { id: "flags", label: "Flags" },
    { id: "compare", label: "Regex vs parser" },
    { id: "json-bridge", label: "JSON bridge" },
    { id: "tool", label: "Tester workflow" },
    { id: "hub", label: "Developer hub" },
  ],
  keyTakeaways: [
    "Anchors and boundaries prevent substring false positives on validation tasks.",
    "Regex validates shape, not semantics - calendar dates and HTML structure need real parsers.",
    "Test with malicious near-misses, not only happy paths.",
  ],
  editorialNote: [
    "Regex engines differ slightly (PCRE vs JavaScript); confirm the runtime you deploy matches what you tested.",
  ],
  whenToUseTools: [
    "Use regex tester while authoring patterns; move to JSON tools once structured payloads appear.",
  ],
  commonMistakes: [
    {
      title: "Greedy .* everywhere",
      body: "Prefer explicit character classes or possessive/reluctant quantifiers when performance matters on large logs.",
    },
    {
      title: "Validating email solely with regex",
      body: "Use pragmatic checks plus server-side verification; email grammar is surprisingly hostile to small patterns.",
    },
  ],
  sources: [{ label: "MDN Regular Expressions guide (developer reference)", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions" }],
  faqSchema: [
    {
      question: "What flavor does Toollabz regex tester use?",
      answer:
        "It targets common JavaScript-style flags for interactive testing - confirm against your production engine if you are not on JS.",
    },
    {
      question: "When should I refuse regex entirely?",
      answer:
        "When parsing nested or context-sensitive languages - reach for parsers, AST libraries, or dedicated validators instead.",
    },
  ],
  Article,
};
