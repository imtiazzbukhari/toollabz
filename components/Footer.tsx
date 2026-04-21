import Image from "next/image";
import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";
import NewsletterFormDeferred from "./NewsletterFormDeferred";
import { tools } from "@/lib/tools/data";
import { SITE_LAST_UPDATED_ISO, formatSiteLastUpdatedForDisplay } from "@/lib/site-freshness";

const categoryLinks = [
  { label: "Finance", href: "/finance-tools" },
  { label: "Business", href: "/business-tools" },
  { label: "Real Estate", href: "/real-estate-tools" },
  { label: "Marketing", href: "/marketing-tools" },
  { label: "AI", href: "/ai-tools" },
  { label: "Developer", href: "/developer-tools" },
  { label: "Utility", href: "/utility-tools" },
  { label: "PDF", href: "/pdf-tools" },
];

const topToolSlugs = [
  "salary-after-tax-calculator",
  "loan-calculator",
  "vat-calculator",
  "roi-calculator",
  "paycheck-calculator-usa",
  "net-worth-calculator",
];

const topToolLinks = topToolSlugs
  .map((slug) => tools.find((tool) => tool.slug === slug))
  .filter(Boolean)
  .map((tool) => ({
    label: tool!.name,
    href: `/tools/${tool!.slug}`,
  }));

/** Set true when real social profile URLs are ready. */
const showFooterSocialIcons = false;

const socialLinks = [
  { href: "/contact", label: "Contact Toollabz", Icon: Github },
  { href: "/contact", label: "Toollabz updates", Icon: Twitter },
  { href: "/about", label: "About Toollabz", Icon: Linkedin },
];

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-violet-200/45 bg-gradient-to-b from-[#eef2ff]/40 via-[#e9edff]/30 to-[#e2e8ff]/24 backdrop-blur-xl md:mt-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 pt-6 pb-10 sm:grid-cols-2 sm:gap-12 sm:pt-8 sm:pb-14 md:grid-cols-7 lg:px-8">
        <div className="sm:col-span-2 md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#0a0a12] p-1 shadow-sm ring-1 ring-slate-200/80">
              <Image
                src="/logo-toollabz.webp"
                alt="Toollabz logo"
                width={28}
                height={28}
                className="object-contain"
                sizes="40px"
                aria-hidden
              />
            </span>
            <p className="text-xl font-bold tracking-tight text-slate-900">Toollabz</p>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">Your all-in-one platform for smart, free online tools built for speed, privacy, and simplicity.</p>
          {showFooterSocialIcons ? (
            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map(({ href, label, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="rounded-full border border-violet-200/50 bg-white/45 p-2 text-slate-500 transition duration-300 hover:border-violet-300 hover:bg-white/60 hover:text-violet-600"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li><Link href="/tools" className="transition duration-300 hover:text-violet-600">All Tools</Link></li>
            <li><Link href="/#popular-tools" className="transition duration-300 hover:text-violet-600">Popular Tools</Link></li>
            <li><Link href="/#categories" className="transition duration-300 hover:text-violet-600">Categories</Link></li>
            <li><Link href="/blog" className="transition duration-300 hover:text-violet-600">Blog</Link></li>
            <li><Link href="/about" className="transition duration-300 hover:text-violet-600">About Us</Link></li>
            <li><Link href="/contact" className="transition duration-300 hover:text-violet-600">Contact</Link></li>
            <li><Link href="/privacy" className="transition duration-300 hover:text-violet-600">Privacy Policy</Link></li>
            <li><Link href="/terms" className="transition duration-300 hover:text-violet-600">Terms & Conditions</Link></li>
            <li><Link href="/disclaimer" className="transition duration-300 hover:text-violet-600">Disclaimer</Link></li>
            <li><Link href="/sitemap.xml" className="transition duration-300 hover:text-violet-600">Sitemap</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Categories</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {categoryLinks.map((link) => (
              <li key={link.href}><Link href={link.href} className="transition duration-300 hover:text-violet-600">{link.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Top Tools</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {topToolLinks.map((link) => (
              <li key={link.href}><Link href={link.href} className="transition duration-300 hover:text-violet-600">{link.label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="min-w-0 sm:col-span-2 md:col-span-2">
          <h3 className="font-semibold text-slate-900">Stay Updated</h3>
          <p className="mt-3 text-sm text-slate-600">Get new tools and updates delivered to your inbox.</p>
          <div className="mt-3 w-full min-w-0 max-w-md">
            <NewsletterFormDeferred variant="footer" />
          </div>
        </div>
      </div>
      <div className="border-t border-violet-200/45 bg-white/20 py-4 text-center text-xs text-slate-600 backdrop-blur">
        <p>
          <span className="text-slate-500">Last updated </span>
          <time dateTime={SITE_LAST_UPDATED_ISO} className="font-medium text-slate-700">
            {formatSiteLastUpdatedForDisplay()}
          </time>
        </p>
        <p className="mt-1">© 2026 Toollabz. All rights reserved.</p>
      </div>
    </footer>
  );
}
