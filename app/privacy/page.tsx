import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated="November 2026">
      <p>
        This Privacy Policy explains how NBA Tools (&ldquo;we,&rdquo; &ldquo;us&rdquo;) handles information when you use our website. The short version: our tools run in your browser and we do not ask you to create an account or submit personal information to use them.
      </p>
      <h2 className="pt-2 text-xl font-bold text-ink">Information we collect</h2>
      <p>
        The numbers and text you enter into our calculators are processed locally in your browser and are not transmitted to our servers. We do not store your inputs.
      </p>
      <h2 className="pt-2 text-xl font-bold text-ink">Cookies and advertising</h2>
      <p>
        When ads are enabled, Google AdSense may set cookies on your device to serve ads and to measure their performance. Google uses these cookies to show ads that may be more relevant to you, based on your browsing history and the content of this site. These are third-party cookies controlled by Google, not by us.
      </p>
      <p>
        You can opt out of personalized advertising at any time via <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-court hover:underline">Google Ads Settings</a>, or through the <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-court hover:underline">Digital Advertising Alliance</a>. You can also block or delete cookies in your browser settings; the tools on this site will still work.
      </p>
      <p>
        Google&rsquo;s use of data is governed by its <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-court hover:underline">Privacy Policy</a>. We do not sell your personal information.
      </p>
      <h2 className="pt-2 text-xl font-bold text-ink">Live scores</h2>
      <p>
        The &ldquo;Today&rsquo;s NBA games&rdquo; section on our homepage reads scores from ESPN&rsquo;s public scoreboard feed. That request is made directly by your browser, so ESPN receives your IP address and basic request details in the same way as visiting espn.com directly. We do not proxy, store or log that data. If you block the request, the rest of the site continues to work normally.
      </p>
      <h2 className="pt-2 text-xl font-bold text-ink">Analytics</h2>
      <p>
        We may use privacy-friendly analytics to understand aggregate traffic, such as which pages are visited most. This data is not used to identify individuals.
      </p>
      <h2 className="pt-2 text-xl font-bold text-ink">Children&rsquo;s privacy</h2>
      <p>
        Our site is not directed at children under 13, and we do not knowingly collect personal information from them.
      </p>
      <h2 className="pt-2 text-xl font-bold text-ink">Contact</h2>
      <p>
        Questions about this policy? Reach out through our <a href="/contact" className="text-court hover:underline">contact page</a>.
      </p>
    </LegalPage>
  );
}
