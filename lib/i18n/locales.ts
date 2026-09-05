/**
 * International SEO locales.
 * English is the default and is unprefixed. All other locales use /{locale}/…
 * Do not treat these as country targets unless the page content is genuinely country-specific.
 */

export const DEFAULT_LOCALE = "en" as const;

export const LOCALES = [
  "en",
  "fr",
  "pt",
  "es",
  "da",
  "sv",
  "fi",
  "cs",
  "ro",
  "hu",
  "el",
  "uk",
  "bg",
  "sk",
  "hr",
  "lt",
  "lv",
  "et",
  "sl",
] as const;

export type Locale = (typeof LOCALES)[number];

export const NON_DEFAULT_LOCALES = LOCALES.filter((l): l is Exclude<Locale, "en"> => l !== DEFAULT_LOCALE);

export const LOCALE_SET = new Set<string>(LOCALES);

export function isLocale(value: string | undefined | null): value is Locale {
  return Boolean(value && LOCALE_SET.has(value));
}

export function isNonDefaultLocale(value: string | undefined | null): value is Exclude<Locale, "en"> {
  return isLocale(value) && value !== DEFAULT_LOCALE;
}

export const LOCALE_META: Record<
  Locale,
  { htmlLang: string; ogLocale: string; englishName: string; nativeName: string; dir: "ltr" | "rtl" }
> = {
  en: { htmlLang: "en", ogLocale: "en_GB", englishName: "English", nativeName: "English", dir: "ltr" },
  fr: { htmlLang: "fr", ogLocale: "fr_FR", englishName: "French", nativeName: "Français", dir: "ltr" },
  pt: { htmlLang: "pt", ogLocale: "pt_PT", englishName: "Portuguese", nativeName: "Português", dir: "ltr" },
  es: { htmlLang: "es", ogLocale: "es_ES", englishName: "Spanish", nativeName: "Español", dir: "ltr" },
  da: { htmlLang: "da", ogLocale: "da_DK", englishName: "Danish", nativeName: "Dansk", dir: "ltr" },
  sv: { htmlLang: "sv", ogLocale: "sv_SE", englishName: "Swedish", nativeName: "Svenska", dir: "ltr" },
  fi: { htmlLang: "fi", ogLocale: "fi_FI", englishName: "Finnish", nativeName: "Suomi", dir: "ltr" },
  cs: { htmlLang: "cs", ogLocale: "cs_CZ", englishName: "Czech", nativeName: "Čeština", dir: "ltr" },
  ro: { htmlLang: "ro", ogLocale: "ro_RO", englishName: "Romanian", nativeName: "Română", dir: "ltr" },
  hu: { htmlLang: "hu", ogLocale: "hu_HU", englishName: "Hungarian", nativeName: "Magyar", dir: "ltr" },
  el: { htmlLang: "el", ogLocale: "el_GR", englishName: "Greek", nativeName: "Ελληνικά", dir: "ltr" },
  uk: { htmlLang: "uk", ogLocale: "uk_UA", englishName: "Ukrainian", nativeName: "Українська", dir: "ltr" },
  bg: { htmlLang: "bg", ogLocale: "bg_BG", englishName: "Bulgarian", nativeName: "Български", dir: "ltr" },
  sk: { htmlLang: "sk", ogLocale: "sk_SK", englishName: "Slovak", nativeName: "Slovenčina", dir: "ltr" },
  hr: { htmlLang: "hr", ogLocale: "hr_HR", englishName: "Croatian", nativeName: "Hrvatski", dir: "ltr" },
  lt: { htmlLang: "lt", ogLocale: "lt_LT", englishName: "Lithuanian", nativeName: "Lietuvių", dir: "ltr" },
  lv: { htmlLang: "lv", ogLocale: "lv_LV", englishName: "Latvian", nativeName: "Latviešu", dir: "ltr" },
  et: { htmlLang: "et", ogLocale: "et_EE", englishName: "Estonian", nativeName: "Eesti", dir: "ltr" },
  sl: { htmlLang: "sl", ogLocale: "sl_SI", englishName: "Slovenian", nativeName: "Slovenščina", dir: "ltr" },
};

export const LOCALE_HEADER = "x-toollabz-locale";
