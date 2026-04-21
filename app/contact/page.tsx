import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { siteUrl } from "@/lib/seo";
import { toolGlassPanel } from "@/lib/tool-ui";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Toollabz - questions, feedback, or partnership ideas about our free online tools.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Toollabz",
    description: "Send a message to the Toollabz team.",
    url: `${siteUrl}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="transition hover:text-violet-600">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
        <span className="font-medium text-slate-700">Contact</span>
      </nav>

      <header className={`mb-8 p-6 sm:p-8 ${toolGlassPanel}`}>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 text-balance sm:text-4xl">Contact us</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Have a question, a bug report, or an idea for a new tool? Send us a message - we read every note.
        </p>
      </header>

      <div className="max-w-xl">
        <ContactForm />
      </div>
    </div>
  );
}
