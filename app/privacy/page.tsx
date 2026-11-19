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
      <h2 className="pt-2 text-xl font-bold text-ink">Advertising</h2>
      <p>
        We may display third-party advertisements (including Google AdSense). These providers may use cookies or similar technologies to serve ads based on your interests. You can opt out of personalized advertising through your browser or the provider&rsquo;s settings.
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
