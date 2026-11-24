import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PlayerAvatar from "@/components/teams/PlayerAvatar";
import TeamLogo from "@/components/teams/TeamLogo";
import {
  DATA_META,
  INITIAL_TEAMS,
  LEAGUE,
  STATUS_COLOR,
  STATUS_LABEL,
  type Team,
} from "@/lib/salary-data";
import { statusSentence, teamSummary } from "@/lib/team-view";
import { TEAM_ASSETS, teamColor, teamHeroColor } from "@/lib/team-assets";
import { profileFor } from "@/lib/player-profiles";
import { SITE_URL } from "@/lib/tools";

type Params = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return INITIAL_TEAMS.map((t) => ({ id: t.id }));
}

function findTeam(id: string): Team | undefined {
  return INITIAL_TEAMS.find((t) => t.id === id);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const team = findTeam(id);
  if (!team) return {};
  const s = teamSummary(team);
  const full = `${team.city} ${team.name}`;
  const title = `${full} Salary Cap 2026-27 — Payroll, Contracts & Roster`;
  const description = `${full} ${LEAGUE.season} payroll: $${s.official.toFixed(1)}M cap hit, $${Math.abs(s.capDelta).toFixed(1)}M ${s.capDelta > 0 ? "over" : "under"} the $${LEAGUE.salaryCap.toFixed(1)}M cap (${STATUS_LABEL[s.status]}). Full roster salaries, contract length and remaining value.`;
  return {
    title,
    description,
    alternates: { canonical: `/teams/${id}` },
    openGraph: { title, description, url: `/teams/${id}`, type: "article" },
  };
}

export default async function TeamPage({ params }: Params) {
  const { id } = await params;
  const team = findTeam(id);
  if (!team) notFound();

  const s = teamSummary(team);
  const full = `${team.city} ${team.name}`;
  const primary = teamColor(team.abbr);
  const hero = teamHeroColor(team.abbr);
  const secondary = TEAM_ASSETS[team.abbr.toLowerCase()]?.secondary ?? "#ffffff";
  // Keep the decorative glow visible when the hero had to fall back to the accent.
  const accent = hero === primary ? secondary : primary;
  const maxSalary = Math.max(...team.players.map((p) => p.salary));
  const divisionMates = INITIAL_TEAMS.filter(
    (t) => t.division === team.division && t.id !== team.id
  ).sort((a, b) => b.officialCapHit - a.officialCapHit);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SportsTeam",
        name: full,
        sport: "Basketball",
        url: `${SITE_URL}/teams/${team.id}`,
        memberOf: { "@type": "SportsOrganization", name: "NBA" },
        athlete: team.players.map((p) => {
          const profile = profileFor(team.abbr, p.name);
          return {
            "@type": "Person",
            name: p.name,
            jobTitle: p.pos,
            ...(profile
              ? { url: `${SITE_URL}/players/${profile.slug}`, identifier: profile.id }
              : {}),
          };
        }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Teams", item: `${SITE_URL}/teams` },
          { "@type": "ListItem", position: 3, name: full, item: `${SITE_URL}/teams/${team.id}` },
        ],
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ---------- team hero ---------- */}
      <section
        className="relative overflow-hidden text-white"
        style={{
          background: `linear-gradient(135deg, ${hero} 0%, ${hero}e6 55%, #0b1220 100%)`,
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full opacity-15"
          style={{ backgroundColor: accent }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-10">
          <nav className="mb-6 text-sm text-white/70">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/teams" className="hover:text-white">
              Teams
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{full}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-5">
            <div className="rounded-2xl bg-white/95 p-3 shadow-lg">
              <TeamLogo abbr={team.abbr} size={72} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                {`${team.conference === "East" ? "Eastern" : "Western"} Conference · ${team.division} Division`}
              </div>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
                {full}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full bg-white/15 px-3 py-1 font-semibold">
                  {LEAGUE.season} payroll
                </span>
                <span className={`rounded-full px-3 py-1 font-bold ${STATUS_COLOR[s.status]}`}>
                  {STATUS_LABEL[s.status]}
                </span>
                <span className="text-white/75">{statusSentence(s)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- money snapshot ---------- */}
      <section className="relative z-10 mx-auto -mt-6 max-w-6xl px-4">
        <div className="card grid grid-cols-2 divide-gray-100 p-1 sm:grid-cols-4 sm:divide-x">
          {[
            ["Official cap hit", `$${s.official.toFixed(1)}M`, "text-ink"],
            [
              s.capDelta > 0 ? "Over the cap" : "Cap space",
              `$${Math.abs(s.capDelta).toFixed(1)}M`,
              s.capDelta > 0 ? "text-red-600" : "text-green-600",
            ],
            [
              s.taxDelta > 0 ? "Over tax line" : "Tax room",
              `$${Math.abs(s.taxDelta).toFixed(1)}M`,
              s.taxDelta > 0 ? "text-amber-600" : "text-green-600",
            ],
            ["Listed contracts", `$${s.listed.toFixed(1)}M`, "text-ink"],
          ].map(([label, value, tone]) => (
            <div key={label} className="px-4 py-4">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                {label}
              </div>
              <div className={`mt-1 text-xl font-extrabold ${tone}`}>{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- roster ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-ink">{LEAGUE.season} roster &amp; contracts</h2>
            <p className="mt-1 text-sm text-gray-500">
              {team.players.length} contracts listed, sorted by salary · cap $
              {LEAGUE.salaryCap.toFixed(2)}M · tax ${LEAGUE.luxuryTax.toFixed(2)}M
            </p>
          </div>
          <Link
            href="/team-salary-trade-simulator"
            className="btn-ghost whitespace-nowrap"
          >
            Simulate a trade →
          </Link>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3 font-semibold">Player</th>
                  <th className="px-2 py-3 text-center font-semibold">No.</th>
                  <th className="px-3 py-3 font-semibold">Pos</th>
                  <th className="px-3 py-3 text-right font-semibold">2026-27</th>
                  <th className="px-3 py-3 text-right font-semibold">Years</th>
                  <th className="px-3 py-3 text-right font-semibold">Remaining</th>
                  <th className="px-4 py-3 font-semibold">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[...team.players]
                  .sort((a, b) => b.salary - a.salary)
                  .map((p) => {
                    const share = (p.salary / maxSalary) * 100;
                    const profile = profileFor(team.abbr, p.name);
                    const href = profile ? `/players/${profile.slug}` : null;
                    return (
                      <tr
                        key={p.id}
                        className="group relative cursor-pointer transition hover:bg-orange-50/60"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={href ?? "/teams"}
                            className="flex items-center gap-3 before:absolute before:inset-0 before:content-['']"
                            aria-label={
                              href ? `Open ${p.name} career profile` : `${p.name} profile unavailable`
                            }
                          >
                            <PlayerAvatar name={p.name} teamAbbr={team.abbr} size={40} espnId={profile?.id} />
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5 font-semibold text-ink group-hover:text-orange-700">
                                <span className="truncate group-hover:underline">{p.name}</span>
                                {p.noTradeClause && (
                                  <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-red-700">
                                    NTC
                                  </span>
                                )}
                                {p.rookieScale && (
                                  <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-blue-700">
                                    Rookie
                                  </span>
                                )}
                              </div>
                              <div className="mt-0.5 text-[11px] font-medium text-gray-400">
                                {profile?.exp ?? "Career profile"}
                                {profile && profile.seasons.length > 0
                                  ? ` · ${profile.seasons.length} seasons logged`
                                  : ""}
                              </div>
                            </div>
                          </Link>
                        </td>
                        <td className="px-2 py-3 text-center">
                          <span className="inline-flex min-w-[2rem] justify-center rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-bold tabular-nums text-gray-700">
                            {profile?.jersey ? `#${profile.jersey}` : "—"}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                            {p.pos}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right font-bold text-ink">
                          ${p.salary.toFixed(2)}M
                        </td>
                        <td className="px-3 py-3 text-right text-gray-600">{p.years}</td>
                        <td className="px-3 py-3 text-right text-gray-600">
                          ${p.totalValue.toFixed(1)}M
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${share}%`, backgroundColor: primary }}
                              />
                            </div>
                            <span aria-hidden className="text-gray-300">
                              ›
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-200 bg-gray-50 font-bold text-ink">
                  <td className="px-4 py-3" colSpan={3}>
                    Total listed
                  </td>
                  <td className="px-3 py-3 text-right">${s.listed.toFixed(2)}M</td>
                  <td className="px-3 py-3" />
                  <td className="px-3 py-3 text-right">
                    ${team.players.reduce((a, p) => a + p.totalValue, 0).toFixed(1)}M
                  </td>
                  <td className="px-4 py-3" />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-gray-400">
          Tap any player to open his career profile — bio, awards, team history and
          season-by-season stats. Listed contracts sum to ${s.listed.toFixed(1)}M, below the
          official team cap hit of ${s.official.toFixed(1)}M. The difference covers
          minimum-salary players, incomplete roster charges and dead money not shown in this
          trimmed roster.
        </p>
      </section>

      {/* ---------- context ---------- */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-ink">
              Where the {team.name} sit in the {team.division} Division
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center justify-between rounded-lg bg-orange-50 px-3 py-2 font-semibold text-orange-800">
                <span>{full}</span>
                <span>${s.official.toFixed(1)}M</span>
              </li>
              {divisionMates.map((m) => {
                const ms = teamSummary(m);
                return (
                  <li key={m.id}>
                    <Link
                      href={`/teams/${m.id}`}
                      className="flex items-center justify-between rounded-lg px-3 py-2 transition hover:bg-gray-50"
                    >
                      <span className="flex items-center gap-2 text-gray-700">
                        <TeamLogo abbr={m.abbr} size={20} />
                        {m.city} {m.name}
                      </span>
                      <span className="text-gray-500">${ms.official.toFixed(1)}M</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold text-ink">What this means for trades</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600">
              <li>
                <span className="font-semibold text-ink">Status:</span>{" "}
                {STATUS_LABEL[s.status]} — {statusSentence(s)}.
              </li>
              <li>
                <span className="font-semibold text-ink">Salary matching:</span>{" "}
                {s.status === "first_apron" || s.status === "second_apron"
                  ? `${team.name} are above the first apron, so they can take back no more than 100% of outgoing salary in a trade.`
                  : `${team.name} can match in three bands: 200% of outgoing plus $250K below $7.5M, outgoing plus $7.5M between $7.5M and $29M, and 125% plus $250K above $29M.`}
              </li>
              <li>
                <span className="font-semibold text-ink">Hard cap:</span>{" "}
                {s.status === "second_apron"
                  ? "Being over the second apron blocks salary aggregation and cash in trades, and freezes the future first-round pick."
                  : s.status === "first_apron"
                    ? "Being over the first apron hard-caps the team at that line for the rest of the league year and blocks aggregation above it."
                    : s.status === "taxpayer"
                      ? "No hard cap applies, but as a taxpayer the team is limited to the smaller taxpayer mid-level exception."
                      : "No hard cap applies at this payroll level, so the full non-taxpayer mid-level exception is available."}
              </li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/team-salary-trade-simulator" className="btn-primary text-sm">
                Open trade simulator
              </Link>
              <Link href="/luxury-tax-calculator" className="btn-ghost">
                Tax calculator
              </Link>
              <Link href="/teams" className="btn-ghost">
                All teams
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-gray-400">
          Source:{" "}
          <a href={DATA_META.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-court hover:underline">
            {DATA_META.source}
          </a>
          , retrieved {DATA_META.retrieved}. Cap, tax and apron thresholds are from the{" "}
          <a href={DATA_META.leagueSourceUrl} target="_blank" rel="noopener noreferrer" className="text-court hover:underline">
            NBA&apos;s official {LEAGUE.season} release
          </a>{" "}
          (July 1, 2026). This site is an independent fan project, not affiliated with the NBA or the {full}.
        </p>
      </section>
    </main>
  );
}
