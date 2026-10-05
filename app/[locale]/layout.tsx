import { notFound } from "next/navigation";
import "../(site)/globals.css";
import RootDocument from "@/components/layout/RootDocument";
import { rootMetadata, rootViewport } from "@/lib/seo/root-metadata";
import { isActiveLocale, ACTIVE_NON_DEFAULT_LOCALES } from "@/lib/i18n/locales";

export const dynamicParams = false;
export const viewport = rootViewport;
export const metadata = rootMetadata;

export function generateStaticParams() {
  return ACTIVE_NON_DEFAULT_LOCALES.map((locale) => ({ locale }));
}

/** Locale root layout: `<html lang>` is derived from the route param, not a request header. */
export default async function LocaleRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isActiveLocale(locale) || locale === "en") notFound();
  return <RootDocument locale={locale}>{children}</RootDocument>;
}
