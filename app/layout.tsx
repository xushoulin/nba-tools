import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { AdSenseLoader } from "@/components/ads/AdSense";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { RouteTracker } from "@/components/analytics/RouteTracker";
import { SITE_NAME, SITE_URL } from "@/lib/tools";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Free NBA & Fantasy Basketball Tools`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Free NBA salary cap, tax, trade and fantasy calculators for fans. No signup, runs in your browser, no data stored.",
  authors: [{ name: "xushoulin", url: "https://github.com/xushoulin" }],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    images: [{ url: "/logo-512.png", width: 512, height: 512, alt: `${SITE_NAME} basketball logo` }],
  },
  twitter: {
    card: "summary",
    images: ["/logo-512.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
  },
  // Search-engine ownership proofs. Emitted as <meta name="...-site-verification">
  // in the head of every page, which is what the consoles check.
  // Google issues one token per account+property, so keep every token that is
  // still in use. Old tokens are left in place: removing them can silently
  // un-verify a property that was proven with them.
  verification: {
    google: [
      "H3OtcTypZvJU3mKaMhIGoh0tQb9tTtjt8rZGDOTo0LA",
      "NJdBBhKDI2T5qlaOpVOV3muaDTAuMsLbPUaELl8wRvo",
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
        <AdSenseLoader />
      </head>
      <body className="min-h-screen">
        <RouteTracker />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
