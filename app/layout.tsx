import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { AdSenseLoader } from "@/components/ads/AdSense";
import { SITE_NAME, SITE_URL } from "@/lib/tools";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Free NBA & Fantasy Basketball Tools`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "A growing collection of free basketball tools for fans and fantasy managers: salary cap, luxury tax, trade analyzer, advanced stats, and more. No signup, runs in your browser.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
  },
  robots: { index: true, follow: true },
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
        <AdSenseLoader />
      </head>
      <body className="min-h-screen">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
