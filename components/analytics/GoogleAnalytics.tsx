/**
 * Google Analytics 4 (gtag.js) integration, gated by a single environment
 * variable — the same pattern used by components/ads/AdSense.tsx.
 *
 * Set NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX in .env.production and rebuild
 * to activate. While the variable is empty or malformed this component renders
 * literally nothing: no script tag, no dataLayer pollution, no network request.
 *
 * The measurement id is public by design (it ships in the HTML), so it lives in
 * the committed .env.production — Vercel builds from Git and needs the value at
 * build time.
 */

const MEASUREMENT_ID = (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "").trim();
export const GA_ENABLED = /^G-[A-Z0-9]+$/.test(MEASUREMENT_ID);

/** Put this once in the root layout <head>. */
export function GoogleAnalytics() {
  if (!GA_ENABLED) return null;

  // Standard GA4 snippet: loader + inline config. Kept as plain <script> tags
  // (not next/script) so it works with the static `output: "export"` build and
  // is emitted directly into the prerendered <head>.
  const inline = [
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){dataLayer.push(arguments);}",
    "gtag('js',new Date());",
    `gtag('config','${MEASUREMENT_ID}');`,
  ].join("");

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
      />
      <script dangerouslySetInnerHTML={{ __html: inline }} />
    </>
  );
}
