import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Who builds NBA Tools, why every calculation runs in your browser, and where the salary, cap and player data comes from.",
  alternates: { canonical: "/about" },
};

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
        League thresholds for 2026-27 — the $164.961M salary cap, $200.428M tax level, $209.015M first apron and $221.686M second apron — are from the <a href="https://www.nba.com/news/nba-salary-cap-2026-27-season" target="_blank" rel="noopener noreferrer" className="text-court hover:underline">NBA&rsquo;s official salary cap release</a>, published July 1, 2026. Player and team salary snapshots were retrieved from <a href="https://hoopshype.com/salaries/teams/" target="_blank" rel="noopener noreferrer" className="text-court hover:underline">HoopsHype&rsquo;s NBA team payrolls</a> on November 19, 2026. Player bios, jersey numbers, awards and season-by-season stats come from <a href="https://www.espn.com/nba/" target="_blank" rel="noopener noreferrer" className="text-court hover:underline">ESPN&rsquo;s public NBA data</a>. Figures are point-in-time snapshots used for estimation — see the <a href="/disclaimer" className="text-court hover:underline">disclaimer</a>.
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
