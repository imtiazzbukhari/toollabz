import "./globals.css";
import RootDocument from "@/components/layout/RootDocument";
import { rootMetadata, rootViewport } from "@/lib/seo/root-metadata";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";

export const viewport = rootViewport;
export const metadata = rootMetadata;

/** English (unprefixed) routes. Static: no headers()/cookies() in this layout. */
export default function SiteRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootDocument locale={DEFAULT_LOCALE}>{children}</RootDocument>;
}
