import Image from "next/image";
import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";
import NewsletterFormDeferred from "./NewsletterFormDeferred";
import { tools } from "@/lib/tools/data";
import { SITE_LAST_UPDATED_ISO, formatSiteLastUpdatedForDisplay } from "@/lib/site-freshness";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales";
import { getUiMessages } from "@/lib/i18n/ui-messages";
import { getPageCopy } from "@/lib/i18n/page-messages";
import { getToolCopy, hasToolCopy } from "@/lib/i18n/tool-messages";
import { isLocalizedEnglishPath } from "@/lib/i18n/catalog";
import { localizePath } from "@/lib/i18n/paths";

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

const ENGLISH_TOP_TOOL_SLUGS = [
  "salary-after-tax-calculator",
  "loan-calculator",
  "vat-calculator",
  "roi-calculator",
  "paycheck-calculator-usa",
  "net-worth-calculator",
];

/** Locale footers must point at catalog tools so names and URLs stay in-language. */
const LOCALIZED_TOP_TOOL_SLUGS = [
  "salary-after-tax-calculator",
  "loan-calculator",
  "vat-calculator",
  "profit-margin-calculator",
  "compound-interest-calculator",
  "roi-calculator",
];

/** Set true when real social profile URLs are ready. */
const showFooterSocialIcons = false;

const socialLinks = [
  { href: "/contact", label: "Contact Toollabz", Icon: Github },
  { href: "/contact", label: "Toollabz updates", Icon: Twitter },
  { href: "/about", label: "About Toollabz", Icon: Linkedin },
];

function hrefFor(path: string, locale: Locale): string {
  return isLocalizedEnglishPath(path) ? localizePath(path, locale) : path;
}

export default function Footer({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const ui = getUiMessages(locale);
  const L = (path: string) => hrefFor(path, locale);
  const localizedCategoryLinks = categoryLinks.map((link) => ({
    ...link,
    href: L(link.href),
    label: getPageCopy(
      locale,
      link.href === "/finance-tools"
        ? "finance"
        : link.href === "/business-tools"
          ? "business"
          : link.href === "/real-estate-tools"
            ? "realEstate"
            : link.href === "/marketing-tools"
              ? "marketing"
              : link.href === "/ai-tools"
                ? "ai"
                : link.href === "/developer-tools"
                  ? "developer"
                  : link.href === "/utility-tools"
                    ? "utility"
                    : "pdf",
    ).h1,
  }));
  const localizedTopTools = (locale === DEFAULT_LOCALE ? ENGLISH_TOP_TOOL_SLUGS : LOCALIZED_TOP_TOOL_SLUGS)
    .map((slug) => {
      const tool = tools.find((t) => t.slug === slug);
      if (!tool) return null;
      const name = hasToolCopy(slug) ? getToolCopy(locale, slug).name : tool.name;
      const href = hasToolCopy(slug) ? localizePath(`/tools/${slug}`, locale) : `/tools/${slug}`;
      return { label: name, href };
    })
    .filter(Boolean) as Array<{ label: string; href: string }>;

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
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">{ui.footer.blurb}</p>
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
          <h3 className="font-semibold text-slate-900">{ui.footer.quickLinks}</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li><Link href={L("/tools")} className="transition duration-300 hover:text-violet-600">{ui.footer.allTools}</Link></li>
            <li><Link href={locale === "en" ? "/#popular-tools" : `${L("/")}#popular-tools`} className="transition duration-300 hover:text-violet-600">{ui.footer.popularTools}</Link></li>
            <li><Link href={locale === "en" ? "/#categories" : `${L("/")}#categories`} className="transition duration-300 hover:text-violet-600">{ui.nav.categories}</Link></li>
            <li><Link href={L("/blog")} className="transition duration-300 hover:text-violet-600">{ui.nav.blog}</Link></li>
            <li><Link href={L("/about")} className="transition duration-300 hover:text-violet-600">{ui.footer.about}</Link></li>
            <li><Link href={L("/contact")} className="transition duration-300 hover:text-violet-600">{ui.footer.contact}</Link></li>
            <li><Link href={L("/privacy")} className="transition duration-300 hover:text-violet-600">{ui.footer.privacy}</Link></li>
            <li><Link href={L("/terms")} className="transition duration-300 hover:text-violet-600">{ui.footer.terms}</Link></li>
            <li><Link href={L("/disclaimer")} className="transition duration-300 hover:text-violet-600">{ui.footer.disclaimer}</Link></li>
            <li><Link href={L("/methodology")} className="transition duration-300 hover:text-violet-600">{ui.footer.methodology}</Link></li>
            <li><Link href={L("/editorial-policy")} className="transition duration-300 hover:text-violet-600">{ui.footer.editorial}</Link></li>
            <li><Link href={L("/glossary")} className="transition duration-300 hover:text-violet-600">{ui.footer.glossary}</Link></li>
            <li><Link href={L("/research")} className="transition duration-300 hover:text-violet-600">{ui.footer.research}</Link></li>
            <li><Link href={locale === "en" ? "/sitemap.xml" : `/${locale}/sitemap.xml`} className="transition duration-300 hover:text-violet-600">{ui.footer.sitemap}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">{ui.footer.categories}</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {localizedCategoryLinks.map((link) => (
              <li key={link.href}><Link href={link.href} className="transition duration-300 hover:text-violet-600">{link.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">{ui.footer.topTools}</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {localizedTopTools.map((link) => (
              <li key={link.href}><Link href={link.href} className="transition duration-300 hover:text-violet-600">{link.label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="min-w-0 sm:col-span-2 md:col-span-2">
          <h3 className="font-semibold text-slate-900">{ui.footer.stayUpdated}</h3>
          <p className="mt-3 text-sm text-slate-600">{ui.footer.stayUpdatedBody}</p>
          <div className="mt-3 w-full min-w-0 max-w-md">
            <NewsletterFormDeferred variant="footer" />
          </div>
        </div>
      </div>
      <div className="border-t border-violet-200/45 bg-white/20 py-4 text-center text-xs text-slate-600 backdrop-blur">
        <p>
          <span className="text-slate-500">{ui.footer.lastUpdated} </span>
          <time dateTime={SITE_LAST_UPDATED_ISO} className="font-medium text-slate-700">
            {formatSiteLastUpdatedForDisplay()}
          </time>
        </p>
        <p className="mt-1">{ui.footer.rights}</p>
      </div>
    </footer>
  );
}
