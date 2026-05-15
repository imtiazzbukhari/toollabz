import Link from "next/link";
import type { BlogPostDefinition } from "../types";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        JSON is the internet’s duct tape: configuration files, logs, API payloads, and ad-hoc spreadsheets exported as text. When
        someone says “just format the JSON,” they might mean prettify whitespace, validate against a schema, escape strings for
        transport, or normalize duplicate keys - different jobs that share one file extension.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="anatomy">
        Anatomy that trips beginners
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
        <li>
          <strong>Strings need quotes</strong>; single quotes are not JSON-native even if JavaScript tolerates them elsewhere.
        </li>
        <li>
          <strong>Trailing commas</strong> are invalid in strict JSON even if your build tooling allows them in supersets.
        </li>
        <li>
          <strong>Numbers</strong> are not quoted; leading zeros (except <code className="rounded bg-violet-100/80 px-1">0.</code>) are
          invalid - watch copied Excel IDs.
        </li>
      </ul>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="minify">
        Minify vs pretty-print: when each wins
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Minified JSON saves bytes on the wire; pretty JSON saves neurons in code review. CI logs often minify; docs should
        pretty-print with stable key ordering when humans diff them. Toollabz{" "}
        <Link href="/tools/json-formatter" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          JSON formatter
        </Link>{" "}
        handles the readability half; pair with{" "}
        <Link href="/tools/json-validator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          JSON validator
        </Link>{" "}
        when you need a hard pass/fail before pasting into Terraform, GitHub Actions, or Postman collections.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="unicode">
        Unicode escapes and base64 blobs
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        APIs sometimes embed binary as base64 inside strings - great for transport, awful for eyeballs. Decode in a dedicated tool
        rather than hand-editing escapes. For URL contexts, JSON strings may travel inside query parameters where{" "}
        <Link href="/tools/url-encoder-decoder" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          URL encoding
        </Link>{" "}
        is a separate layer from JSON string escaping - apply both consciously.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="streaming">
        NDJSON, logs, and “JSON lines”
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Strict JSON documents are one tree per file, but observability stacks often emit newline-delimited JSON - one minified object
        per line - so tailing a file stays stream-friendly. Parsers differ: `JSON.parse` on the whole file fails, while line iterators
        succeed. If you are debugging agents emitting partial chunks, know whether your pipeline expects framed WebSocket messages,
        SSE, or raw line logs before you blame “invalid JSON.”
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="security">
        Secrets and paste hygiene
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        API keys inside JSON attributes belong in secret managers, not Slack snippets. If you must redact, replace values with
        equal-length placeholders only when you also scrub derived logs - attackers correlate across fields. For local debugging,
        prefer ephemeral tokens and rotate after screen shares.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="compare">
        Formatter vs validator vs schema
      </h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm text-slate-800">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Tool</th>
              <th className="px-4 py-3">Answers</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-3 font-medium">Formatter</td>
              <td className="px-4 py-3">“Make this readable / consistent whitespace”</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Validator</td>
              <td className="px-4 py-3">“Is this syntactically JSON at all?”</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Schema (JSON Schema)</td>
              <td className="px-4 py-3">“Does this match allowed shapes and types?”</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="regex-bridge">
        Regex bridge for logs
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        When grepping logs for JSON fragments, start with literal anchors then graduate to{" "}
        <Link href="/blog/regex-beginner-guide-practical-patterns-toollabz" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          practical regex patterns
        </Link>{" "}
        and the{" "}
        <Link href="/tools/regex-tester" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          regex tester
        </Link>
        .
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="hub">
        Developer hub
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Explore encoding and API helpers on the{" "}
        <Link href="/developer-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          developer tools hub
        </Link>
        , including{" "}
        <Link href="/tools/base64-encoder-decoder" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          Base64 encoder/decoder
        </Link>{" "}
        when payloads hop between binary and text contexts.
      </p>
    </>
  );
}

export const jsonFormattingExplainedPost: BlogPostDefinition = {
  slug: "json-formatting-and-validation-explained-developer",
  title: "JSON formatting and validation explained for developers",
  description:
    "Cover JSON syntax footguns, minify vs pretty-print trade-offs, formatter vs validator vs schema roles, and link to Toollabz JSON formatter/validator, URL encoding, regex guide, and developer hub.",
  excerpt:
    "Formatting, validation, and schema are different jobs that happen to share the same three-letter file extension - pick the tool that matches the failure you saw in prod.",
  publishedAt: "2026-05-14",
  dateModified: "2026-05-14T12:00:00.000Z",
  category: "Developer",
  tags: ["JSON", "validation", "API", "encoding"],
  readingTimeMinutes: 14,
  relatedToolSlugs: ["json-formatter", "json-validator", "jwt-decoder", "sql-formatter", "url-encoder-decoder", "base64-encoder-decoder", "regex-tester", "json-minifier", "yaml-validator", "csv-to-json-converter"],
  relatedPostsSlugs: ["regex-beginner-guide-practical-patterns-toollabz", "developer-text-json-yaml-html-csv-pipeline-toollabz", "jwt-expiry-api-healthchecks-curl-playbook-toollabz"],
  tableOfContents: [
    { id: "anatomy", label: "Syntax footguns" },
    { id: "minify", label: "Minify vs pretty" },
    { id: "unicode", label: "Unicode & binary" },
    { id: "streaming", label: "NDJSON & logs" },
    { id: "security", label: "Secrets hygiene" },
    { id: "compare", label: "Formatter vs validator" },
    { id: "regex-bridge", label: "Regex bridge" },
    { id: "hub", label: "Developer hub" },
  ],
  keyTakeaways: [
    "Strict JSON rejects trailing commas and unquoted keys - editors may still highlight ‘almost JSON’ from other supersets.",
    "Pretty-print for humans, minify for bandwidth - do not mix the concerns accidentally in CI.",
    "Validation tells you syntax; schemas tell you intent - both matter before shipping configs.",
  ],
  editorialNote: [
    "Security note: redact tokens before pasting JSON into any online formatter, including Toollabz.",
  ],
  whenToUseTools: [
    "Use JSON formatter when diffing configs or teaching teammates.",
    "Use JSON validator when pipelines fail with opaque parse errors.",
  ],
  commonMistakes: [
    {
      title: "Double-encoding JSON as a string",
      body: "API gateways sometimes stringify already serialized bodies - each layer needs its own unescape pass.",
    },
    {
      title: "Treating JSON5 as JSON",
      body: "Comments and trailing commas are great for humans but invalid for strict parsers - know which runtime consumes the file.",
    },
  ],
  sources: [{ label: "ECMA-404 JSON standard (specification)", href: "https://www.ecma-international.org/publications-and-standards/standards/ecma-404/" }],
  faqSchema: [
    {
      question: "Why does valid JavaScript object literal fail JSON.parse?",
      answer:
        "JavaScript object literals allow unquoted keys and trailing commas; JSON.parse follows stricter grammar.",
    },
    {
      question: "Can I validate schema in-browser on Toollabz?",
      answer:
        "Use JSON validator for syntax; pair with your own schema tooling or API gateway for semantic validation beyond syntax.",
    },
  ],
  Article,
};
