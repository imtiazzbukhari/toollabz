import Link from "next/link";
import type { BlogPostDefinition } from "../types";
import BlogToolCallout from "@/components/BlogToolCallout";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        Two different teams can both say “the token is fine” and still be correct on their own terms. One team decoded the JWT
        payload and read <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm">exp</code>. The other team verified the
        signature with issuer keys and revocation rules. Expiry is only trustworthy after verification, but expiry is still useful
        for debugging when you already trust the transport or you are chasing clock skew.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="exp">
        What JWT expiry actually means in UTC
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Most web stacks store <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm">exp</code> as numeric seconds since epoch. That
        is the same time axis logs use, which is why pairing JWT work with the{" "}
        <Link href="/tools/unix-timestamp-converter" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          Unix timestamp converter
        </Link>{" "}
        keeps postmortems honest. The{" "}
        <Link href="/tools/jwt-expiry-checker" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          JWT expiry checker
        </Link>{" "}
        reads <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm">exp</code> and compares it to “now” in the browser so you can answer
        “should this still be valid?” without opening three tabs. It does not verify signatures. Verification still belongs to your
        auth service and your keys.
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        Skew matters. A laptop set five minutes fast makes good tokens look expired. A container set to UTC while humans think in
        local wall time creates “ghost expiries” in screenshots. Write down the clock source when you file incidents.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="decode">
        Decode vs verify: keep the vocabulary strict
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Decoding answers “what JSON claims are inside?” Verifying answers “did the issuer I trust actually sign this?” Anyone can
        Base64URL-decode a blob. Only your platform can validate signatures and policies. Read the full mental model in the{" "}
        <Link href="/blog/jwt-token-decode-vs-verify-security-guide-toollabz" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          JWT decode vs verify guide
        </Link>{" "}
        and use the{" "}
        <Link href="/tools/jwt-decoder" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          JWT decoder
        </Link>{" "}
        when you need header and payload JSON, not only the expiry line.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="curl">
        API health checks: curl beats the browser for internal URLs
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Browsers enforce CORS. Terminals usually do not. When you paste a staging health URL, you want a command you can run from
        a bastion or CI debug shell. The{" "}
        <Link href="/tools/api-status-checker" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          API URL checker
        </Link>{" "}
        validates scheme and host and prints a suggested <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm">curl -I</code> line.
        It intentionally avoids async fetches inside the synchronous calculator so results stay deterministic in tests. Treat
        live status codes as a second step, not a missing feature.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="compare">
        Comparison: which question each tool answers
      </h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm text-slate-800">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Question</th>
              <th className="px-4 py-3">Tool</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-3">What claims are inside?</td>
              <td className="px-4 py-3">JWT decoder</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Is exp in the past relative to this laptop clock?</td>
              <td className="px-4 py-3">JWT expiry checker</td>
            </tr>
            <tr>
              <td className="px-4 py-3">What is 1735689600 in UTC?</td>
              <td className="px-4 py-3">Unix timestamp converter</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Is this URL well formed for a probe?</td>
              <td className="px-4 py-3">API URL checker</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="mistakes">
        Common mistakes in JWT incidents
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
        <li>Treating decoded payloads as proof of authenticity.</li>
        <li>Ignoring leeway configuration on verification while reading raw exp.</li>
        <li>Pasting refresh tokens into public threads.</li>
        <li>Mixing milliseconds and seconds without checking digit length.</li>
        <li>Assuming browser network panels show the same TLS path as server-to-server calls.</li>
      </ul>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="when">
        When to use these tools on Toollabz
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
        <li>When support asks “did this session expire yet?” and you need a fast clock-relative answer.</li>
        <li>When writing runbooks that should include copy-pasteable curl probes.</li>
        <li>When correlating webhook logs with token issuance timelines.</li>
      </ul>

      <BlogToolCallout
        href="/tools/jwt-expiry-checker"
        title="JWT expiry checker"
        body="Paste a JWT to read exp/iat against the current time. Signature verification stays on your auth service."
      />

      <p className="mt-3 leading-7 text-slate-700">
        Continue with encoding topics in{" "}
        <Link href="/blog/base64-encoding-url-apis-jwt-fragments-developer" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          Base64, URLs, and JWT fragments
        </Link>{" "}
        and keep JSON hygiene in{" "}
        <Link href="/blog/json-formatting-and-validation-explained-developer" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          JSON formatting and validation explained
        </Link>
        .
      </p>
    </>
  );
}

export const jwtExpiryApiHealthPost: BlogPostDefinition = {
  slug: "jwt-expiry-api-healthchecks-curl-playbook-toollabz",
  seoTitle: "JWT expiry explained: clocks, curl probes, and decode vs verify",
  title: "JWT expiry, timestamps, and honest API health probes",
  description:
    "Explain JWT exp and clock skew, pair expiry checks with Unix timestamps, clarify decode vs verify, and show how Toollabz API URL checker suggests curl probes without fake live HTTP inside sync tools.",
  excerpt:
    "Expiry is useful for debugging only when you say which clock you mean. Pair JWT expiry checks with UTC timestamps and curl for real HTTP status.",
  publishedAt: "2026-05-16",
  dateModified: "2026-05-16T12:00:00.000Z",
  category: "Developer",
  tags: ["JWT", "API", "curl", "timestamps"],
  readingTimeMinutes: 17,
  relatedToolSlugs: ["jwt-expiry-checker", "jwt-decoder", "unix-timestamp-converter", "api-status-checker", "json-validator", "url-encoder-decoder"],
  relatedPostsSlugs: [
    "jwt-token-decode-vs-verify-security-guide-toollabz",
    "base64-encoding-url-apis-jwt-fragments-developer",
    "developer-text-json-yaml-html-csv-pipeline-toollabz",
    "json-formatting-and-validation-explained-developer",
  ],
  tableOfContents: [
    { id: "exp", label: "JWT expiry in UTC" },
    { id: "decode", label: "Decode vs verify" },
    { id: "curl", label: "curl vs browser" },
    { id: "compare", label: "Comparison table" },
    { id: "mistakes", label: "Common mistakes" },
    { id: "when", label: "When to use" },
  ],
  keyTakeaways: [
    "exp is only meaningful next to a stated clock source and verification policy.",
    "curl probes belong in runbooks because browsers hit CORS limits on internal APIs.",
    "Decode tools never replace signature verification.",
  ],
  whenToUseTools: [
    "Use JWT expiry checker when answering skew and timeout questions quickly.",
    "Use API URL checker when you need a normalized URL plus a curl template.",
  ],
  commonMistakes: [
    { title: "Confusing decode with trust", body: "Anyone can mint bytes. Only your verifier establishes trust." },
    { title: "Ignoring leeway", body: "Many libraries allow small exp skew; raw timestamps may look stricter than production." },
  ],
  faqSchema: [
    {
      question: "Does the JWT expiry checker verify signatures?",
      answer: "No. It reads payload time claims for diagnostics. Verification requires issuer keys and your auth stack.",
    },
    {
      question: "Why does the API checker not fetch status codes?",
      answer: "Synchronous calculators avoid async network calls. Use curl or your monitor for authoritative HTTP results.",
    },
    {
      question: "What if exp uses milliseconds?",
      answer: "Non-integer exp is uncommon. Normalize with your IdP docs; many stacks still use seconds.",
    },
    {
      question: "Should I paste refresh tokens?",
      answer: "Avoid pasting long-lived secrets on shared devices even when processing is local.",
    },
    {
      question: "How do I convert exp to a readable time?",
      answer: "Use the Unix timestamp converter for epoch seconds and keep notes in UTC for incident writeups.",
    },
  ],
  Article,
};
