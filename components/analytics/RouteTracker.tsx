"use client";

/**
 * Sends a GA4 pageview on every client-side route change.
 *
 * The gtag config snippet in GoogleAnalytics.tsx fires one pageview on initial
 * load, but Next.js <Link> navigation swaps content without reloading <head>,
 * so subsequent pages would go uncounted. This component listens to pathname
 * changes and calls gtag('event','page_view', ...) for those transitions.
 *
 * Deliberately avoids useSearchParams(): with the static `output: "export"`
 * build that hook forces a Suspense boundary. The query string is read from
 * window.location instead, which is always current at effect time.
 *
 * Renders nothing; no-op when GA is disabled (gtag is never defined).
 */

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function RouteTracker() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    // Skip the initial render — the inline config snippet already sent a
    // page_view for it. Only count subsequent client-side navigations.
    if (first.current) {
      first.current = false;
      return;
    }

    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    if (!gtag) return;

    const search = window.location.search;
    gtag("event", "page_view", {
      page_path: pathname + (search || ""),
    });
  }, [pathname]);

  return null;
}
