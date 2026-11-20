import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Contact" };

export default function Contact() {
  return (
    <LegalPage title="Contact Us" updated="November 2026">
      <p>
        Have a suggestion, found a bug, or want a new tool added? We&rsquo;d love to hear from you.
      </p>
      <h2 className="pt-2 text-xl font-bold text-ink">Get in touch</h2>
      <p>
        The fastest way to reach us is to <a href="https://github.com/xushoulin/nba-tools/issues" target="_blank" rel="noopener noreferrer" className="text-court hover:underline">open an issue on GitHub</a>. Bug reports, data corrections and feature requests all go there, and we try to reply to every message.
      </p>
      <h2 className="pt-2 text-xl font-bold text-ink">Feature requests</h2>
      <p>
        Tools are added based on community demand. If there&rsquo;s a basketball calculator or simulator you wish existed, tell us and we&rsquo;ll consider building it.
      </p>
    </LegalPage>
  );
}
