import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Contact" };

export default function Contact() {
  return (
    <LegalPage title="Contact Us" updated="November 2026">
      <p>
        Have a suggestion, found a bug, or want a new tool added? We&rsquo;d love to hear from you.
      </p>
      <h2 className="pt-2 text-xl font-bold text-ink">Email</h2>
      <p>
        Reach us at <a href="mailto:hello@nbatools.example.com" className="text-court hover:underline">hello@nbatools.example.com</a>. We try to reply to every message, though it may take a few days.
      </p>
      <h2 className="pt-2 text-xl font-bold text-ink">Feature requests</h2>
      <p>
        Tools are added based on community demand. If there&rsquo;s a basketball calculator or simulator you wish existed, tell us and we&rsquo;ll consider building it.
      </p>
    </LegalPage>
  );
}
