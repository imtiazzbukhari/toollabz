import Link from "next/link";
import { LOCALE_META, type Locale } from "@/lib/i18n/locales";
import { localesForEnglishPath } from "@/lib/i18n/catalog";
import { localizePath, parseLocalizedPathname } from "@/lib/i18n/paths";
import { getUiMessages } from "@/lib/i18n/ui-messages";

export default function LanguageSwitcher({ pathname }: { pathname: string }) {
  const { locale: current, englishPath } = parseLocalizedPathname(pathname);
  const list = localesForEnglishPath(englishPath);
  const ui = getUiMessages(current);

  return (
    <nav aria-label={ui.nav.language}>
      <details className="group relative">
        <summary className="cursor-pointer list-none rounded-full border border-slate-200 bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-violet-300 hover:text-violet-700">
          {LOCALE_META[current].nativeName}
        </summary>
        <ul className="absolute right-0 z-50 mt-1 max-h-72 min-w-[10rem] overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
          {list.map((locale: Locale) => {
            const href = localizePath(englishPath, locale);
            const active = locale === current;
            return (
              <li key={locale}>
                <Link
                  href={href}
                  hrefLang={locale}
                  lang={locale}
                  className={`block px-3 py-1.5 text-sm ${active ? "font-semibold text-violet-700" : "text-slate-700 hover:bg-violet-50"}`}
                >
                  {LOCALE_META[locale].nativeName}
                </Link>
              </li>
            );
          })}
        </ul>
      </details>
    </nav>
  );
}
