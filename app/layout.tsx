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
