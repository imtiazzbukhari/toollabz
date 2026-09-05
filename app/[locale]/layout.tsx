import { notFound } from "next/navigation";
import { isNonDefaultLocale, NON_DEFAULT_LOCALES } from "@/lib/i18n/locales";

export const dynamicParams = false;

export function generateStaticParams() {
  return NON_DEFAULT_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isNonDefaultLocale(locale)) notFound();
  return children;
}
