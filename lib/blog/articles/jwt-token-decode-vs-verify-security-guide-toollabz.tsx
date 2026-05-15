import Link from "next/link";
import type { BlogPostDefinition } from "../types";
import BlogToolCallout from "@/components/BlogToolCallout";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        If you have ever pasted a JWT into a debugger, watched the JSON pop out, and felt a false sense of safety, you are not
        alone. Decoding shows you what someone <em>claims</em>. Verification proves what you should <em>believe</em>. The gap
        between those two verbs is where production incidents and security reviews spend their weekends.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="what-jwt-is">
        What a JWT actually is (without the hand-waving)
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        A JSON Web Token is usually three Base64URL-encoded pieces separated by dots: a header, a payload, and a signature
        segment. The header names algorithms and key hints; the payload carries claims like <code className="rounded bg-violet-100/80 px-1">sub</code>,{" "}
        <code className="rounded bg-violet-100/80 px-1">iss</code>, <code className="rounded bg-violet-100/80 px-1">aud</code>, and time boxes such as{" "}
        <code className="rounded bg-violet-100/80 px-1">exp</code>. The signature binds header+payload to a secret or asymmetric key - when verification is
        implemented correctly, tampering breaks the math.
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        Toollabz <Link href="/tools/jwt-decoder" className="font-medium text-violet-700 underline-offset-2 hover:underline">JWT decoder</Link> focuses on
        the first two segments: it decodes header and payload JSON and surfaces <code className="rounded bg-violet-100/80 px-1">exp</code> /{" "}
        <code className="rounded bg-violet-100/80 px-1">nbf</code> / <code className="rounded bg-violet-100/80 px-1">iat</code> as UTC timestamps when they
        are numeric. It does <strong>not</strong> verify signatures - because your browser tab should not be the trust anchor for your auth deployment.
      </p>

      <h3 className="mt-8 text-lg font-semibold text-slate-900" id="claims-not-contracts">
        Claims are hints, not contracts
      </h3>
      <p className="mt-3 leading-7 text-slate-700">
        Even a perfectly signed token can be <em>wrong for your app</em>: wrong audience, wrong issuer, wrong clock skew policy, or a token issued before
        you rotated keys. Decoding helps you read the story; policy code decides whether the story is acceptable. Treat decoded output like reading an
        envelope address - it might be legible and still not yours.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="decode-vs-verify">
        Decode vs verify: the comparison that saves incidents
      </h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm text-slate-800">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Question</th>
              <th className="px-4 py-3">Decode (read-only)</th>
              <th className="px-4 py-3">Verify (trust gate)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-3 font-medium">What it proves</td>
              <td className="px-4 py-3">Base64URL parsed to JSON</td>
              <td className="px-4 py-3">Integrity + authenticity under your key material</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Tampered payload?</td>
              <td className="px-4 py-3">You might still “see” JSON if someone forged two segments</td>
              <td className="px-4 py-3">Signature check fails; reject</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Where it belongs</td>
              <td className="px-4 py-3">Engineer laptops, support triage, docs</td>
              <td className="px-4 py-3">API gateway, service mesh, app middleware</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Clock skew</td>
              <td className="px-4 py-3">You can read <code className="rounded bg-violet-100/80 px-1">exp</code></td>
              <td className="px-4 py-3">Policy chooses leeway (e.g., ±60s) before rejecting</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="time-claims">
        Reading <code className="rounded bg-violet-100/80 px-1 text-base">exp</code> without inventing timezone drama
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Most JWTs store <code className="rounded bg-violet-100/80 px-1">exp</code> as Unix seconds. Humans argue in time zones; logs argue in UTC. When you
        decode locally, compare the ISO line against your server clock in the <em>same</em> reference frame. If you are chasing “token expired” bugs,
        pair decoding with the{" "}
        <Link href="/tools/unix-timestamp-converter" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          Unix timestamp converter
        </Link>{" "}
        so you can bounce between raw seconds and ISO strings without mental arithmetic under incident stress.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="alg-madness">
        Algorithm confusion and why <code className="rounded bg-violet-100/80 px-1 text-base">none</code> is a red flag
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Older “alg:none” vulnerabilities are textbook now, but teams still ship permissive verifiers that accept unexpected algorithms when rotating keys.
        Your decode view should make <code className="rounded bg-violet-100/80 px-1">alg</code> obvious early. If the header says HS256 but your resource server
        expects RS256, stop and reconcile configuration before you chase payload fields.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="jwe">
        Encrypted JWT (JWE) vs signed JWT (JWS)
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        When the middle segment is not JSON but an encrypted blob, you are in JWE territory. A decoder that expects JWS layout will fail loudly - that is
        good. Do not “fix” encryption by disabling validation elsewhere. Use the client library your IdP documents for that token profile.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="base64-layer">
        Base64URL is not secrecy
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Transport encoding is not encryption. Anyone can Base64-decode a JWT payload with a napkin and a website. If you need to move binary safely inside
        JSON, use{" "}
        <Link href="/tools/base64-encoder-decoder" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          Base64 tools
        </Link>{" "}
        intentionally - then still encrypt at rest and in transit where the threat model demands it.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="logs-regex">
        Logs, redaction, and regex that survives audits
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        When scrubbing tokens from logs, remember structured logs repeat the same bearer string across fields. Regex that only strips{" "}
        <code className="rounded bg-violet-100/80 px-1">Authorization</code> headers misses copied JWTs in message bodies. Build allowlists for fields, then
        apply pattern tests using the{" "}
        <Link href="/tools/regex-tester" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          regex tester
        </Link>{" "}
        and the patterns from our{" "}
        <Link href="/blog/regex-beginner-guide-practical-patterns-toollabz" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          practical regex guide
        </Link>
        .
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="json-bridge">
        JSON hygiene next to JWT work
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Mis-copied claims or trailing commas show up constantly when people paste “almost JSON” from Slack. Run payloads through{" "}
        <Link href="/tools/json-validator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          JSON validator
        </Link>{" "}
        before you blame auth middleware. For readability,{" "}
        <Link href="/tools/json-formatter" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          JSON formatter
        </Link>{" "}
        helps when you diff two decoded payloads side by side.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="when-use">
        When to use the decoder vs when to stop and fix infra
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
        <li>
          <strong>Use decode</strong> when you need to confirm which tenant ID leaked into a staging token, or whether <code className="rounded bg-violet-100/80 px-1">aud</code> matches your API registration.
        </li>
        <li>
          <strong>Stop at decode</strong> when the question is “should this request be authorized?” - that answer requires verification keys, revocation, and audience checks.
        </li>
        <li>
          <strong>Escalate beyond tools</strong> when you see key rotation without matching JWKS publish, or asymmetric tokens suddenly behaving like symmetric ones - those are config incidents, not parser bugs.
        </li>
      </ul>

      <BlogToolCallout
        href="/tools/jwt-decoder"
        title="JWT Decoder (header & payload)"
        description="Paste a three-segment token, read JSON claims, and see exp/nbf in UTC - without claiming the signature was verified."
      />

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="hub">
        Developer hub and next clicks
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Browse the full{" "}
        <Link href="/developer-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          developer tools hub
        </Link>{" "}
        for encoding, URL helpers, and API utilities. If you are also documenting cron schedules beside token lifetimes, the{" "}
        <Link href="/blog/sql-cron-readability-schedulers-developer-guide-toollabz" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          SQL &amp; cron readability guide
        </Link>{" "}
        pairs operational literacy with auth literacy.
      </p>
    </>
  );
}

export const jwtTokenDecodeVsVerifySecurityGuideToollabzPost: BlogPostDefinition = {
  slug: "jwt-token-decode-vs-verify-security-guide-toollabz",
  seoTitle: "JWT Decode vs Verify: Security Mistakes Developers Still Make | Toollabz",
  title: "JWT decode vs verify: what you are actually proving in the browser",
  description:
    "Plain-language guide to JWT structure, decode vs verify, exp/nbf reading, algorithm confusion, JWE vs JWS, and safe workflows with Toollabz JWT decoder, JSON validator, Unix timestamps, Base64, and regex testing.",
  excerpt:
    "Decoding a JWT shows claims; verifying proves integrity. Learn the comparison, time-claim pitfalls, and when to stop using browser tools and fix your auth stack.",
  publishedAt: "2026-05-15",
  dateModified: "2026-05-15T18:00:00.000Z",
  category: "Developer",
  tags: ["JWT", "OAuth", "security", "API"],
  readingTimeMinutes: 18,
  relatedToolSlugs: ["jwt-decoder", "json-validator", "unix-timestamp-converter", "base64-encoder-decoder", "regex-tester", "jwt-expiry-checker", "api-status-checker"],
  relatedPostsSlugs: [
    "json-formatting-and-validation-explained-developer",
    "regex-beginner-guide-practical-patterns-toollabz",
    "base64-encoding-url-apis-jwt-fragments-developer",
    "sql-cron-readability-schedulers-developer-guide-toollabz",
    "developer-text-json-yaml-html-csv-pipeline-toollabz",
    "jwt-expiry-api-healthchecks-curl-playbook-toollabz",
  ],
  tableOfContents: [
    { id: "what-jwt-is", label: "What a JWT is" },
    { id: "decode-vs-verify", label: "Decode vs verify" },
    { id: "time-claims", label: "exp and UTC" },
    { id: "alg-madness", label: "Algorithm headers" },
    { id: "jwe", label: "JWE vs JWS" },
    { id: "base64-layer", label: "Base64 is not secrecy" },
    { id: "logs-regex", label: "Logs & regex" },
    { id: "json-bridge", label: "JSON hygiene" },
    { id: "when-use", label: "When to use decoder" },
    { id: "hub", label: "Developer hub" },
  ],
  keyTakeaways: [
    "Decode answers readability; verify answers trust - never substitute one for the other in authorization decisions.",
    "Compare exp/nbf in UTC against the same clock reference your servers use; skew policies belong in middleware.",
    "Algorithm headers are part of the threat model - unexpected alg values should trigger config review, not silent acceptance.",
  ],
  editorialNote: [
    "Paste hygiene: avoid production refresh tokens on shared machines even when processing is local.",
  ],
  whenToUseTools: [
    "Use JWT decoder for incident triage, claim inspection, and teaching - not as a verifier.",
    "Use Unix timestamp converter when correlating exp with log lines.",
  ],
  commonMistakes: [
    {
      title: "Treating decoded JSON as proof of identity",
      body: "Attackers can craft unsigned or wrongly signed bytes; only your verifier with correct keys and audience checks establishes trust.",
    },
    {
      title: "Ignoring audience and issuer while staring at sub",
      body: "Subject alone does not scope access; pair with aud/iss checks that match your resource server configuration.",
    },
    {
      title: "Debugging in production with live tokens",
      body: "Use short-lived staging tokens, rotate after screen shares, and prefer structured redaction in logs over regex-only hope.",
    },
  ],
  faqSchema: [
    {
      question: "Does decoding a JWT verify it?",
      answer:
        "No. Decoding parses Base64URL segments. Verification uses cryptographic checks with your issuer keys and should happen in trusted server components.",
    },
    {
      question: "Why does my token look valid but APIs reject it?",
      answer:
        "Clock skew, wrong audience, revoked sessions, or mismatched signing keys are common. Decode to read claims, then inspect verification logs and key rotation state.",
    },
    {
      question: "What is the difference between JWT and opaque tokens?",
      answer:
        "JWTs carry self-describing claims; opaque tokens are random handles resolved server-side. Debugging workflows differ - do not assume the same decoder applies.",
    },
    {
      question: "Can I verify HS256 tokens in the browser?",
      answer:
        "You should not embed shared secrets in client code to do so. Use your API or gateway for HMAC verification with protected key material.",
    },
    {
      question: "What if my token has three segments but payload is gibberish?",
      answer:
        "You may have JWE encryption, compression, or a non-JWT profile. Confirm token type with your identity provider documentation.",
    },
    {
      question: "Where does JSON validation fit?",
      answer:
        "When claims are copy-pasted or generated as JSON sidecars, validate syntax separately from JWT crypto - both layers fail independently.",
    },
  ],
  sources: [{ label: "RFC 7519 JSON Web Token (JWT)", href: "https://datatracker.ietf.org/doc/html/rfc7519" }],
  Article,
};
