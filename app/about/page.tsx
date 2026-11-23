import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "About Us" };

export default function About() {
  return (
    <LegalPage title="About NBA Tools" updated="November 2026">
      <p>
        NBA Tools is a collection of free, browser-based tools built for basketball fans and fantasy managers. Our goal is simple: make the math behind the game — salary caps, luxury tax, fantasy scoring, advanced stats — fast and free for everyone.
      </p>
      <h2 className="pt-2 text-xl font-bold text-ink">Our approach</h2>
      <p>
        Every tool runs entirely in your browser. That means instant results, no account to create, and no personal data collected. We believe useful tools should just work.
      </p>
      <h2 className="pt-2 text-xl font-bold text-ink">Who builds this</h2>
      <p>
        NBA Tools is designed and maintained by an independent developer. The full source code is public on <a href="https://github.com/xushoulin/nba-tools" target="_blank" rel="noopener noreferrer" className="text-court hover:underline">GitHub</a>, where you can review the calculations, report bugs and suggest tools. This page was last updated in November 2026.
      </p>
      <h2 className="pt-2 text-xl font-bold text-ink">Where the data comes from</h2>
      <p>
        Salary and contract figures are 2026-27 figures from HoopsHype together with official NBA league thresholds. Player bios, jersey numbers, awards and season-by-season stats come from ESPN&rsquo;s public athlete data. Figures are point-in-time snapshots used for estimation — see the <a href="/disclaimer" className="text-court hover:underline">disclaimer</a>.
      </p>
      <h2 className="pt-2 text-xl font-bold text-ink">Independence</h2>
      <p>
        NBA Tools is independently operated and is not endorsed by, affiliated with, or sponsored by the National Basketball Association or any of its teams. All team names, logos, and trademarks belong to their respective owners. We use statistics as factual data for calculation tools only.
      </p>
      <h2 className="pt-2 text-xl font-bold text-ink">Get in touch</h2>
      <p>
        Have an idea for a tool or spotted a bug? Visit our <a href="/contact" className="text-court hover:underline">contact page</a>. We read every message.
      </p>
    </LegalPage>
  );
}
