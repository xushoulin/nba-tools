import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { DATA_META } from "@/lib/salary-data";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "NBA Tools figures are estimates from public snapshots, not official NBA records or financial, legal and betting advice.",
  alternates: { canonical: "/disclaimer" },
};

export default function Disclaimer() {
  return (
    <LegalPage title="Disclaimer" updated="November 2026">
      <p>
        NBA Tools provides free calculators and informational tools for entertainment and general reference. Nothing on this site constitutes financial, legal or professional advice.
      </p>
      <h2 className="pt-2 text-xl font-bold text-ink">Estimates, not official figures</h2>
      <p>
        Salary, cap, tax and contract figures are point-in-time snapshots based on publicly available data. They change with trades, signings and league updates, and may lag the latest news. Results are estimates for exploration — do not rely on them for official transactions, fantasy league rulings or financial decisions. Always verify league thresholds against the <a href={DATA_META.leagueSourceUrl} target="_blank" rel="noopener noreferrer" className="text-court hover:underline">NBA&apos;s official salary cap release</a> and salaries against <a href={DATA_META.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-court hover:underline">HoopsHype&apos;s team payrolls</a>.
      </p>
      <h2 className="pt-2 text-xl font-bold text-ink">Not affiliated with the NBA</h2>
      <p>
        This site is independently operated and is not endorsed by, affiliated with, or sponsored by the National Basketball Association, its teams, ESPN or HoopsHype. All team names, logos and trademarks belong to their respective owners. We use statistics as factual data for calculation tools only.
      </p>
      <h2 className="pt-2 text-xl font-bold text-ink">Third-party links</h2>
      <p>
        Links to external sites are provided for convenience. We do not control and are not responsible for the content or privacy practices of third-party websites.
      </p>
    </LegalPage>
  );
}
