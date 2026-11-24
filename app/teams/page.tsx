import type { Metadata } from "next";
import Link from "next/link";
import TeamLogo from "@/components/teams/TeamLogo";
import {
  DATA_META,
  INITIAL_TEAMS,
  LEAGUE,
  SOURCE_URLS,
  STATUS_COLOR,
  STATUS_LABEL,
} from "@/lib/salary-data";
import { CONFERENCE_BLOCKS, byDivision, teamSummary } from "@/lib/team-view";
import { SITE_NAME, SITE_URL } from "@/lib/tools";

export const metadata: Metadata = {
  title: "NBA Team Payrolls & Rosters 2026-27 — All 30 Teams",
  description:
    "Every NBA team's 2026-27 payroll, salary cap space, luxury tax and apron status, plus full roster salaries by conference and division.",
  alternates: { canonical: "/teams" },
  openGraph: {
    title: "NBA Team Payrolls & Rosters 2026-27",
    description:
      "All 30 NBA teams by conference: cap hit, cap space, tax and apron status, with player-by-player contracts.",
    url: "/teams",
  },
};

export default function TeamsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "NBA teams 2026-27",
    numberOfItems: INITIAL_TEAMS.length,
    itemListElement: INITIAL_TEAMS.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${t.city} ${t.name}`,
      url: `${SITE_URL}/teams/${t.id}`,
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <nav className="mb-4 text-sm text-gray-500">
            <Link href="/" className="hover:text-court">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">Teams</span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            NBA team payrolls &amp; rosters — {LEAGUE.season}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">
            All 30 teams, split by conference and division, with their cap hit, room
            under the salary cap, tax and apron status. Tap any team to see every
            listed contract, salary and remaining years.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              ["Salary cap", `$${LEAGUE.salaryCap.toFixed(2)}M`, "bg-gray-50 text-gray-700"],
              ["Luxury tax", `$${LEAGUE.luxuryTax.toFixed(2)}M`, "bg-amber-50 text-amber-700"],
              ["1st apron", `$${LEAGUE.firstApron.toFixed(2)}M`, "bg-orange-50 text-orange-700"],
              ["2nd apron", `$${LEAGUE.secondApron.toFixed(2)}M`, "bg-red-50 text-red-700"],
              ["Teams", `${INITIAL_TEAMS.length}`, "bg-gray-50 text-gray-700"],
            ].map(([label, value, tone]) => (
              <div key={label} className={`rounded-xl px-3 py-2.5 ${tone}`}>
                <div className="text-[11px] font-semibold uppercase tracking-wide opacity-70">
                  {label}
                </div>
                <div className="text-lg font-extrabold">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        {CONFERENCE_BLOCKS.map(({ conference, divisions }) => {
          const teams = INITIAL_TEAMS.filter((t) => t.conference === conference);
          const total = teams.reduce((s, t) => s + t.officialCapHit, 0);
          return (
            <div key={conference} className="mb-16 last:mb-0">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-2 border-b border-gray-200 pb-3">
                <div>
                  <h2 className="text-2xl font-extrabold text-ink">
                    {`${conference === "East" ? "Eastern" : "Western"} Conference`}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {teams.length} teams · ${total.toFixed(1)}M combined cap hit · avg $
                    {(total / teams.length).toFixed(1)}M
                  </p>
                </div>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                  {conference}
                </span>
              </div>

              {divisions.map((division) => {
                const group = byDivision(teams, division);
                if (group.length === 0) return null;
                return (
                  <div key={division} className="mb-10 last:mb-0">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-court" />
                      {division} Division
                      <span className="font-normal normal-case tracking-normal text-gray-400">
                        · {group.length} teams
                      </span>
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {group.map((team) => {
                        const s = teamSummary(team);
                        const overCap = s.capDelta > 0;
                        return (
                          <Link
                            key={team.id}
                            href={`/teams/${team.id}`}
                            className="card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:border-court hover:shadow-lg"
                          >
                            <div className="flex items-center gap-3">
                              <TeamLogo
                                abbr={team.abbr}
                                size={52}
                                className="transition duration-200 group-hover:scale-105"
                              />
                              <div className="min-w-0">
                                <div className="truncate font-bold text-ink group-hover:text-court">
                                  {team.city} {team.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {team.abbr} · {team.players.length} contracts listed
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 flex items-baseline justify-between gap-2">
                              <div>
                                <div className="text-2xl font-extrabold leading-none text-ink">
                                  ${s.official.toFixed(1)}M
                                </div>
                                <div className="mt-1 text-[11px] uppercase tracking-wide text-gray-400">
                                  cap hit
                                </div>
                              </div>
                              <span
                                className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_COLOR[s.status]}`}
                              >
                                {STATUS_LABEL[s.status]}
                              </span>
                            </div>

                            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                              <span className={overCap ? "text-gray-500" : "text-green-600"}>
                                {overCap
                                  ? `$${s.capDelta.toFixed(1)}M over cap`
                                  : `$${Math.abs(s.capDelta).toFixed(1)}M under cap`}
                              </span>
                              <span className="font-semibold text-gray-500 group-hover:text-court">
                                View roster →
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        <div className="card p-6 text-sm leading-relaxed text-gray-600">
          <h2 className="mb-2 font-bold text-ink">About this data</h2>
          <p>
            Team cap hits and player salaries are real {DATA_META.season} figures sourced
            from <a href={DATA_META.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-court hover:underline">{DATA_META.source}</a> ({DATA_META.retrieved}). Cap, tax and apron
            thresholds come from the <a href={DATA_META.leagueSourceUrl} target="_blank" rel="noopener noreferrer" className="text-court hover:underline">NBA&apos;s official release</a> (July 1, 2026). Only the largest contracts
            on each roster are listed, so the sum of listed salaries runs slightly below
            the official team cap hit shown on each card — the gap is made up of
            minimum-salary players, incomplete roster charges and dead money. All figures
            can be edited inside the{" "}
            <Link href="/team-salary-trade-simulator" className="font-semibold text-court hover:underline">
              salary &amp; trade simulator
            </Link>
            .
          </p>
          <p className="mt-3 text-xs text-gray-400">
            {SITE_NAME} is an independent fan project and is not affiliated with the NBA
            or its teams. Team logos are the property of their respective owners and are
            shown for identification only.
          </p>
        </div>
      </section>
    </main>
  );
}
