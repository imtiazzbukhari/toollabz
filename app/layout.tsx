import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkipToMainLink from "@/components/SkipToMainLink";
import DeferredClientObservers from "@/components/DeferredClientObservers";
import { GA_TRACKING_ID } from "@/lib/analytics/gtag";
import { ADSENSE_PUBLISHER_ID } from "@/lib/analytics/env";
import { organizationSchema, websiteSearchActionSchema } from "@/lib/seo";

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
const gscSiteVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION?.trim();
const mergedGoogleSiteVerification = gscSiteVerification || googleSiteVerification;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#7c3aed",
};

export const metadata: Metadata = {
  title: {
    default: "Toollabz - Free Online Tools: Calculators, Converters & PDF Hub",
    template: "%s | Toollabz",
  },
  alternates: {
    canonical: "/",
  },
  description:
    "Free calculators, converters, and PDF tools in one secure hub. Fast results, clear guides, and 238+ utilities on Toollabz - no signup.",
  metadataBase: new URL("https://toollabz.com"),
  applicationName: "Toollabz",
  authors: [{ name: "Toollabz", url: "https://toollabz.com" }],
  creator: "Toollabz",
  publisher: "Toollabz",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  ...(mergedGoogleSiteVerification
    ? {
        verification: {
          google: mergedGoogleSiteVerification,
        },
      }
    : {}),
  openGraph: {
    title: "Toollabz - Free Online Tools: Calculators, Converters & PDF Hub",
    description:
      "Free calculators, converters, and PDF utilities with SEO-friendly guides. Built for speed and privacy on Toollabz.",
    type: "website",
    url: "https://toollabz.com",
    siteName: "Toollabz",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toollabz - Free Online Tools: Calculators, Converters & PDF Hub",
    description:
      "Free calculators, converters, and PDF utilities with clear FAQs and internal links on Toollabz.",
  },
  icons: {
    icon: [{ url: "/logo-toollabz.webp", type: "image/webp" }],
    shortcut: ["/logo-toollabz.webp"],
    apple: [{ url: "/logo-toollabz.webp" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteJsonLd = JSON.stringify(websiteSearchActionSchema());
  const orgJsonLd = JSON.stringify(organizationSchema());

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col overflow-x-hidden">
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
        {/* AdSense: warm connection before the main script (afterInteractive). */}
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        {GA_TRACKING_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              strategy="lazyOnload"
            />
            <Script id="ga4-gtag-init" strategy="lazyOnload">
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
          Global AdSense loader (single instance — do not add adsbygoogle.js elsewhere).
          Future display units: place <AdsenseUnit adSlot="…" variant="…" /> in page bodies
          (e.g. app/page.tsx between sections, tool pages sidebar, blog article mid-content).
        */}
        <Script
          id="adsense-global-loader"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: websiteJsonLd }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: orgJsonLd }} />
        <DeferredClientObservers />
        <SkipToMainLink />
        <Header />
        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
