import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkipToMainLink from "@/components/SkipToMainLink";
import DeferredClientObservers from "@/components/DeferredClientObservers";
import { GA_TRACKING_ID } from "@/lib/analytics/gtag";
import { ADSENSE_ENABLED, ADSENSE_PUBLISHER_ID } from "@/lib/analytics/env";
import { organizationSchema, websiteSearchActionSchema } from "@/lib/seo";
import { LOCALE_META, type Locale } from "@/lib/i18n/locales";

/**
 * Shared <html>/<body> document for both root layouts: `(site)` (English) and `[locale]`.
 *
 * `lang` comes from the route (never from a request header), so no root layout reads
 * `headers()`/`cookies()`. A dynamic root layout makes Next.js 15 stream title, canonical,
 * robots and hreflang into <body> for crawlers that are not on its htmlLimitedBots list.
 */
export default function RootDocument({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const websiteJsonLd = JSON.stringify(websiteSearchActionSchema());
  const orgJsonLd = JSON.stringify(organizationSchema());

  return (
    <html lang={LOCALE_META[locale].htmlLang} dir={LOCALE_META[locale].dir}>
      <body className="flex min-h-screen flex-col overflow-x-hidden">
        {/* System font stack in globals.css — no Google Fonts stylesheet (avoids extra LCP/connection work). */}
        <link rel="preload" href="/logo-toollabz.webp" as="image" />
        <link rel="dns-prefetch" href="https://api.frankfurter.app" />
        <link rel="preconnect" href="https://api.frankfurter.app" crossOrigin="anonymous" />
        {GA_TRACKING_ID ? (
          <>
            <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
            <link rel="dns-prefetch" href="https://www.google-analytics.com" />
            <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
          </>
        ) : null}
        {ADSENSE_ENABLED ? (
          <>
            <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
            <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
          </>
        ) : null}
        {GA_TRACKING_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-gtag-init" strategy="afterInteractive">
              {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_TRACKING_ID}', { send_page_view: false });
`}
            </Script>
          </>
        ) : null}
        {/*
          AdSense loader only when NEXT_PUBLIC_ADSENSE_ENABLED=true and slots are live.
          Place <AdsenseUnit adSlot="…" /> in page bodies before enabling.
        */}
        {ADSENSE_ENABLED ? (
          <Script
            id="adsense-global-loader"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: websiteJsonLd }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: orgJsonLd }} />
        <DeferredClientObservers />
        <SkipToMainLink />
        <Header />
        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 outline-none">
          {children}
        </main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
