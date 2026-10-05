import type { Metadata, Viewport } from "next";

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
const gscSiteVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION?.trim();
const mergedGoogleSiteVerification = gscSiteVerification || googleSiteVerification;

export const rootViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#7c3aed",
};

export const rootMetadata: Metadata = {
  title: {
    default: "Toollabz - Free Online Tools: Calculators, Converters & PDF Hub",
    template: "%s | Toollabz",
  },
  // Do not set a root canonical here — child pages that omit alternates.canonical
  // would inherit the homepage URL and create "Google chose different canonical" issues.
  description:
    "Free calculators, converters, and PDF tools in one secure hub. Fast results, clear guides, and practical utilities on Toollabz.",
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
