import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SITE_URL } from "@/lib/tools";
import { SOURCE_URLS } from "@/lib/salary-data";

export const metadata: Metadata = {
  title: "Editorial standards and data policy",
  description:
    "Who builds NBA Tools, where every number comes from, how often each page is updated, and how to report a correction.",
  alternates: { canonical: "/editorial" },
};

export default function Editorial() {
  return (
    <LegalPage title="Editorial standards and data policy" updated="November 26, 2026">
      <p>
        <strong className="text-ink">
          NBA Tools is built and maintained by an independent developer (GitHub: xushoulin), not by the NBA or any team.
        </strong>{" "}
        This page records where the numbers come from, how often they change and how to report an error. It applies to
        every tool, team page, player page and news story on this site.
      </p>

      <h2 className="pt-2 text-xl font-bold text-ink">Author and accountability</h2>
      <p>
        All calculations and explanatory guides are written by the site&apos;s maintainer. The full source code is public
        at{" "}
        <a href="https://github.com/xushoulin/nba-tools" target="_blank" rel="noopener noreferrer" className="text-court hover:underline">
          github.com/xushoulin/nba-tools
        </a>
        , so any formula can be audited. There is no editorial team and no anonymous contributor: one developer is
        responsible for every page, and corrections are handled through the public issue tracker.
      </p>

      <h2 className="pt-2 text-xl font-bold text-ink">Where the data comes from</h2>
      <p>
        League thresholds for 2026-27 — the $164.961M salary cap, $200.428M tax line, $148.465M minimum payroll,
        $209.015M first apron and $221.686M second apron — come from the{" "}
        <a href={SOURCE_URLS.nbaCapRelease} target="_blank" rel="noopener noreferrer" className="text-court hover:underline">
          NBA&apos;s official salary cap release
        </a>{" "}
        of July 1, 2026. Player and team salary snapshots were retrieved on November 19, 2026 from{" "}
        <a href={SOURCE_URLS.hoopshypeTeams} target="_blank" rel="noopener noreferrer" className="text-court hover:underline">
          HoopsHype team payrolls
        </a>
        . Player biographies, jersey numbers, honours and season statistics come from{" "}
        <a href={SOURCE_URLS.espnNba} target="_blank" rel="noopener noreferrer" className="text-court hover:underline">
          ESPN public NBA data
        </a>
        . Homepage scores and the news desk also read ESPN&apos;s public feeds. Every page that uses these figures links
        back to the original source.
      </p>

      <h2 className="pt-2 text-xl font-bold text-ink">How we handle third-party news</h2>
      <p>
        The news desk rebuilds once a day from ESPN&apos;s public feed. A story is only published when its headline,
        summary, timestamp and original ESPN URL can all be verified; if the feed is unavailable, the last verified
        snapshot stays online instead of an invented headline. Each story credits ESPN and links to the original
        report — no third-party headline is presented as an NBA Tools original.
      </p>

      <h2 className="pt-2 text-xl font-bold text-ink">Update cadence</h2>
      <p>
        The news snapshot refreshes daily, and its index says when it was built. Live scores are read in the browser and
        refresh every 20 seconds during games and every 60 seconds otherwise. Salary snapshots are point-in-time and
        change with transactions; they are re-pulled manually rather than on a schedule, and each page names the date it
        was retrieved. Rule guides are updated when the league publishes a new CBA figure or threshold.
      </p>

      <h2 className="pt-2 text-xl font-bold text-ink">Corrections</h2>
      <p>
        If a number is wrong or a source link is broken, open an issue at{" "}
        <a href="https://github.com/xushoulin/nba-tools/issues" target="_blank" rel="noopener noreferrer" className="text-court hover:underline">
          github.com/xushoulin/nba-tools/issues
        </a>{" "}
        with the page URL, the figure in question and the source you believe is correct. Data corrections are reviewed
        first; calculation bugs are fixed in the source and covered by the public repository history.
      </p>

      <h2 className="pt-2 text-xl font-bold text-ink">Independence and limits</h2>
      <p>
        NBA Tools is not affiliated with, endorsed by or sponsored by the National Basketball Association, its teams or
        ESPN. Figures are estimates for analysis and fantasy use, not official transaction records. Nothing on this site
        is financial, legal or betting advice. See the{" "}
        <a href="/disclaimer" className="text-court hover:underline">disclaimer</a> and{" "}
        <a href="/privacy" className="text-court hover:underline">privacy policy</a> for the full terms.
      </p>

      <p className="text-xs text-gray-500">
        Canonical URL: {SITE_URL}/editorial · Last reviewed November 26, 2026.
      </p>
    </LegalPage>
  );
}
