import Link from "next/link";
import type { BlogPostDefinition } from "../types";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        Malpractice conversations online get theatrical fast. Courthouses care about charts, expert reports, causation, and whether your state makes non-economic damages cry in a corner. Money follows liability first; multipliers second. Anyone promising a “typical” number without your file is selling vibes.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Economic vs non-economic in plain language</h2>
      <p className="mt-3 leading-7 text-slate-700">
        Economic stacks are bills, rehab, lost income—things with receipts. Non-economic is the human wreckage category that statutes sometimes cap, especially in reform states. A calculator can show how sensitive totals are to those knobs; it cannot read your MRI or depose a defendant.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Using the estimator without fooling yourself</h2>
      <p className="mt-3 leading-7 text-slate-700">
        Enter defensible economic numbers, pick a severity band you can actually support with facts, and toggle the crude “cap haircut” option to remember reform exists in some jurisdictions. If the output feels huge, ask whether insurance limits or indemnity structures would clamp it anyway.
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        Open the{" "}
        <Link href="/tools/medical-malpractice-settlement-estimator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          medical malpractice settlement estimator
        </Link>{" "}
        when you want a structured thought experiment—not when you need a second opinion on medicine or law.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">FAQ</h2>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">Do I have a case because the number looks big?</h3>
      <p className="mt-2 leading-7 text-slate-700">No. Viability is for counsel after records review—not a form field.</p>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">Why caps?</h3>
      <p className="mt-2 leading-7 text-slate-700">
        State law. The toggle here is a blunt reminder, not a statute lookup for your venue.
      </p>
    </>
  );
}

export const medicalMalpracticeBasicsPost: BlogPostDefinition = {
  slug: "medical-malpractice-settlement-basics-usa",
  seoTitle: "Medical Malpractice Settlements (USA): Economics, Caps, and Reality Checks",
  description:
    "How economic and non-economic damages interact in malpractice talks, why state caps matter, and how to use Toollabz’s malpractice estimator as a sketch—not legal advice.",
  title: "Medical malpractice settlements: receipts first, drama second",
  excerpt:
    "Before you trust a giant multiplier, understand bills, wages, reform caps, and why liability still drives everything.",
  publishedAt: "2026-04-11",
  relatedToolSlugs: ["medical-malpractice-settlement-estimator", "personal-injury-settlement-calculator", "legal-fee-estimator", "settlement-calculator"],
  Article,
};
