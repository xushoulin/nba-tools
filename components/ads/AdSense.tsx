/**
 * Google AdSense integration, gated by a single environment variable.
 *
 * Set NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX in .env.local and
 * rebuild to activate. While the variable is empty or invalid these components
 * render literally nothing — no script tag, no empty container, no layout shift.
 *
 * Auto ads is used by default: one loader script in the layout is enough for
 * Google to place ads, so no manual ad slots need to be managed.
 */

const CLIENT = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "").trim();
export const ADSENSE_ENABLED = /^ca-pub-\d{16}$/.test(CLIENT);

/** Put this once in the root layout. Loads the Auto ads script only when configured. */
export function AdSenseLoader() {
  if (!ADSENSE_ENABLED) return null;
  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}

/**
 * Optional manual ad unit for pages that need a fixed placement.
 * Pass the slot id created in the AdSense dashboard; renders nothing if absent.
 */
export function AdSenseAd({
  slot,
  format = "auto",
  className = "",
}: {
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}) {
  if (!ADSENSE_ENABLED || !slot) return null;
  const push = `(adsbygoogle=window.adsbygoogle||[]).push({});`;
  return (
    <div className={`my-8 overflow-hidden ${className}`} data-ad-unit={slot}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      <script dangerouslySetInnerHTML={{ __html: push }} />
    </div>
  );
}
