import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PlayerAvatar from "@/components/teams/PlayerAvatar";
import TeamLogo from "@/components/teams/TeamLogo";
import PlayerFormSection from "@/components/players/PlayerFormSection";
import {
  INITIAL_TEAMS,
  LEAGUE,
  SOURCE_URLS,
  STATUS_COLOR,
  STATUS_LABEL,
  type Team,
} from "@/lib/salary-data";
import { statusSentence, teamSummary } from "@/lib/team-view";
import { TEAM_ASSETS, teamColor, teamHeroColor } from "@/lib/team-assets";
import {
  HISTORIC_TEAM_NAMES,
  PLAYER_META,
  ageAtSnapshot,
  allPlayerSlugs,
  careerTeams,
  fmt,
  formatBirthDate,
  profileBySlug,
  profileFor,
} from "@/lib/player-profiles";
import { SITE_URL } from "@/lib/tools";
import { playerNarrative } from "@/lib/player-narrative";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return allPlayerSlugs().map((slug) => ({ slug }));
}

function teamOf(profileTeam: string): Team | undefined {
  return INITIAL_TEAMS.find((t) => t.id === profileTeam);
}

function isoBirth(rawDate: string | null): string | undefined {
  const m = rawDate?.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return undefined;
  return `${m[3]}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = profileBySlug(slug);
  if (!p) return {};
  const team = teamOf(p.team);
  const teamName = team ? `${team.city} ${team.name}` : "NBA";
  const title = `${p.name} — Career, Contract & Stats (${LEAGUE.season})`;
  const description = `${p.name}, ${p.pos} for the ${teamName}: No. ${p.jersey ?? "—"}, $${p.salary.toFixed(2)}M in ${LEAGUE.season} with ${p.years} year${p.years === 1 ? "" : "s"} left. Full career history, awards, team-by-team timeline and season-by-season stats.`;
  return {
    title,
    description,
    alternates: { canonical: `/players/${slug}` },
    openGraph: {
      title,
      description,
      url: `/players/${slug}`,
      type: "profile",
      images: [`https://a.espncdn.com/i/headshots/nba/players/full/${p.id}.png`],
    },
  };
}

export default async function PlayerPage({ params }: Params) {
  const { slug } = await params;
  const p = profileBySlug(slug);
  if (!p) notFound();

  const team = teamOf(p.team);
  if (!team) notFound();

  const full = `${team.city} ${team.name}`;
  const s = teamSummary(team);
  const primary = teamColor(team.abbr);
  const hero = teamHeroColor(team.abbr);
  const secondary = TEAM_ASSETS[team.abbr.toLowerCase()]?.secondary ?? "#ffffff";
  const accent = hero === primary ? secondary : primary;
  const age = ageAtSnapshot(p.born);
  const born = formatBirthDate(p.born);
  const timeline = careerTeams(p);
  const capShare = (p.salary / LEAGUE.salaryCap) * 100;
  const teamShare = (p.salary / s.official) * 100;
  const teammates = team.players
    .filter((x) => x.name !== p.name)
    .sort((a, b) => b.salary - a.salary)
    .slice(0, 6);

  const narrative = playerNarrative(p, team, full);
  const proseSections = narrative.sections.filter((s) => s.id !== "comparable-contracts");

  const faces = [
    ["Height", p.height ?? "—"],
    ["Weight", p.weight ?? "—"],
    ["Born", born ? `${born}${age ? ` (${age})` : ""}` : "—"],
    ["College", p.college ?? "—"],
  ];

  const facts = [
    ["Position", p.pos],
    ["Jersey", p.jersey ? `No. ${p.jersey}` : "—"],
    ["NBA debut", p.debut ? String(p.debut) : "—"],
    ["Experience", p.exp ?? "—"],
    ["Draft", p.draft ?? "—"],
    ["Birthplace", p.birthplace ?? "—"],
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: p.name,
        url: `${SITE_URL}/players/${p.slug}`,
        jobTitle: `Professional basketball player (${p.pos})`,
        ...(isoBirth(p.born) ? { birthDate: isoBirth(p.born) } : {}),
        ...(p.birthplace ? { birthPlace: { "@type": "Place", name: p.birthplace } } : {}),
        ...(p.height ? { height: p.height } : {}),
        ...(p.college ? { alumniOf: { "@type": "CollegeOrUniversity", name: p.college } } : {}),
        affiliation: {
          "@type": "SportsTeam",
          name: full,
          url: `${SITE_URL}/teams/${team.id}`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Teams", item: `${SITE_URL}/teams` },
          { "@type": "ListItem", position: 3, name: full, item: `${SITE_URL}/teams/${team.id}` },
          { "@type": "ListItem", position: 4, name: p.name, item: `${SITE_URL}/players/${p.slug}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: narrative.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ---------- player hero ---------- */}
      <section
        className="relative overflow-hidden text-white"
        style={{ background: `linear-gradient(135deg, ${hero} 0%, ${hero}e6 55%, #0b1220 100%)` }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full opacity-15"
          style={{ backgroundColor: accent }}
        />
        {p.jersey && (
          <div
            aria-hidden
            className="pointer-events-none absolute right-6 top-6 select-none font-black leading-none text-white/10"
            style={{ fontSize: 128 }}
          >
            {p.jersey}
          </div>
        )}

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
            <Link href={`/teams/${team.id}`} className="hover:text-white">
              {full}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{p.name}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-6">
            <div className="relative">
              <div className="rounded-2xl bg-white/95 p-2 shadow-lg">
                <PlayerAvatar name={p.name} teamAbbr={team.abbr} size={116} espnId={p.id} />
              </div>
              {p.jersey && (
                <span
                  className="absolute -bottom-2 -right-2 rounded-xl px-2.5 py-1 text-sm font-black tabular-nums text-white shadow-lg"
                  style={{ backgroundColor: primary }}
                >
                  #{p.jersey}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                {p.pos} · {team.conference === "East" ? "Eastern" : "Western"} Conference
              </div>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">{p.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                <Link
                  href={`/teams/${team.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 font-semibold hover:bg-white/25"
                >
                  <TeamLogo abbr={team.abbr} size={16} />
                  {full}
                </Link>
                {p.exp && (
                  <span className="rounded-full bg-white/15 px-3 py-1 font-semibold">{p.exp}</span>
                )}
                {p.college && (
                  <span className="rounded-full bg-white/15 px-3 py-1 text-white/85">
                    {p.college}
                  </span>
                )}
              </div>
            </div>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {faces.map(([label, value]) => (
              <div key={label} className="rounded-xl bg-white/10 px-4 py-3">
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-white/60">
                  {label}
                </dt>
                <dd className="mt-0.5 truncate text-sm font-bold text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- contract snapshot ---------- */}
      <section className="relative z-10 mx-auto -mt-6 max-w-6xl px-4">
        <div className="card grid grid-cols-2 divide-gray-100 p-1 sm:grid-cols-4 sm:divide-x">
          {[
            [`${LEAGUE.season} salary`, `$${p.salary.toFixed(2)}M`, "text-ink"],
            ["Years remaining", `${p.years}`, "text-ink"],
            ["Remaining value", `$${(p.salary * p.years).toFixed(1)}M`, "text-ink"],
            ["Share of cap", `${capShare.toFixed(1)}%`, "text-ink"],
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

      {/* ---------- career + bio ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-ink">Career timeline</h2>
            <p className="mt-1 text-sm text-gray-500">
              {timeline.length > 1
                ? `${timeline.length} franchises, ${p.seasons.length} seasons logged`
                : `${full} is his only NBA franchise`}
            </p>
            <ol className="mt-4 space-y-3">
              {timeline.map((t, i) => {
                const franchise = INITIAL_TEAMS.find((x) => `${x.city} ${x.name}` === t.name);
                return (
                  <li key={t.name} className="flex items-center gap-3">
                    {franchise ? (
                      <TeamLogo abbr={franchise.abbr} size={26} />
                    ) : (
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: "#d1d5db" }}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-ink">{t.name}</div>
                      <div className="text-xs tabular-nums text-gray-500">{t.range}</div>
                    </div>
                    {i === 0 && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase text-white"
                        style={{ backgroundColor: primary }}
                      >
                        Current
                      </span>
                    )}
                  </li>
                );
              })}
              {timeline.length === 0 && (
                <li className="text-sm text-gray-500">
                  Team history is not available for this player.
                </li>
              )}
            </ol>
            {p.alsoOn && p.alsoOn.length > 0 && (
              <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
                Also carried on another payroll this season (
                {p.alsoOn
                  .map((o) => {
                    const other = INITIAL_TEAMS.find((t) => t.id === o.team);
                    return `${other ? other.abbr : o.team.toUpperCase()} $${o.salary.toFixed(2)}M`;
                  })
                  .join(", ")}
                ) — typically dead money or retained salary after a trade or waiver.
              </p>
            )}
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold text-ink">Honours &amp; awards</h2>
            {p.awards.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {p.awards.map(([name, count, seasons]) => (
                  <li
                    key={name}
                    className="flex items-start justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-ink">{name}</div>
                      <div className="text-[11px] tabular-nums text-gray-500">
                        {seasons.join(" · ")}
                      </div>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-xs font-bold text-white"
                      style={{ backgroundColor: primary }}
                    >
                      {count}×
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-gray-500">
                No league honours recorded yet. Award data is sourced from ESPN and updates as
                the league announces them.
              </p>
            )}
          </div>
        </div>

        <div className="card mt-4 p-6">
          <h2 className="text-lg font-bold text-ink">Profile</h2>
          <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {facts.map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-3 border-b border-gray-100 pb-2">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {label}
                </dt>
                <dd className="text-right text-sm font-semibold text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- season by season ---------- */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-ink">Season by season</h2>
          <p className="mt-1 text-sm text-gray-500">
            Regular-season averages, one row per team-season. {p.seasons.length} seasons logged.
          </p>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3 font-semibold">Season</th>
                  <th className="px-3 py-3 font-semibold">Team</th>
                  <th className="px-3 py-3 text-right font-semibold">GP</th>
                  <th className="px-3 py-3 text-right font-semibold">MPG</th>
                  <th className="px-3 py-3 text-right font-semibold">PPG</th>
                  <th className="px-3 py-3 text-right font-semibold">RPG</th>
                  <th className="px-3 py-3 text-right font-semibold">APG</th>
                  <th className="px-3 py-3 text-right font-semibold">FG%</th>
                  <th className="px-4 py-3 text-right font-semibold">3P%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {p.seasons.map(([season, abbr, gp, mpg, ppg, rpg, apg, fg, tp]) => (
                  <tr key={`${season}-${abbr}`} className="transition hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-semibold tabular-nums text-ink">{season}</td>
                    <td className="px-3 py-2.5">
                      <span
                        className="rounded bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600"
                        title={HISTORIC_TEAM_NAMES[abbr] ?? abbr}
                      >
                        {abbr}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-gray-600">{gp}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-gray-600">{fmt(mpg)}</td>
                    <td className="px-3 py-2.5 text-right font-bold tabular-nums text-ink">
                      {fmt(ppg)}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-gray-600">{fmt(rpg)}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-gray-600">{fmt(apg)}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-gray-600">{fmt(fg)}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-gray-600">{fmt(tp)}</td>
                  </tr>
                ))}
                {p.seasons.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-6 text-center text-sm text-gray-500">
                      No season data on record yet.
                    </td>
                  </tr>
                )}
              </tbody>
              {p.career && (
                <tfoot>
                  <tr className="border-t-2 border-gray-200 bg-gray-50 font-bold text-ink">
                    <td className="px-4 py-3" colSpan={2}>
                      Career
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {p.career[0] ?? "—"}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">{fmt(p.career[1])}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{fmt(p.career[2])}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{fmt(p.career[3])}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{fmt(p.career[4])}</td>
                    <td className="px-3 py-3" colSpan={2} />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-gray-400">
          Averages per game. Rows follow the franchises ESPN credits the player with, so
          mid-season trades appear as two rows in the same season.
        </p>
      </section>

      {/* ---------- recent form (live) ---------- */}
      <PlayerFormSection playerId={String(p.id)} playerName={p.name} seasonLabel={LEAGUE.season} />

      {/* ---------- derived analysis ---------- */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-ink">What the numbers say</h2>
          <p className="mt-1 text-sm text-gray-500">
            Written from the career log, honours and {LEAGUE.season} contract on this page, and
            compared against every other player in the dataset at the same position.
          </p>
        </div>

        <div className="space-y-4">
          {proseSections.map((section) => (
            <div key={section.id} id={section.id} className="card p-6">
              <h3 className="text-lg font-bold text-ink">{section.heading}</h3>
              <div className="mt-3 space-y-3 text-sm leading-7 text-gray-700">
                {section.paragraphs.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
              {section.bullets && section.bullets.length > 0 && (
                <ul className="mt-4 space-y-1.5 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
                  {section.bullets.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden className="text-orange-500">
                        ·
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.table && (
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
                        {section.table.head.map((h) => (
                          <th key={h} className="px-3 py-2 font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {section.table.rows.map((row) => (
                        <tr key={row[0]}>
                          {row.map((cell, j) => (
                            <td
                              key={j}
                              className={
                                j === 0
                                  ? "px-3 py-2 text-gray-600"
                                  : "px-3 py-2 font-semibold tabular-nums text-ink"
                              }
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}

          {narrative.comparables.length > 0 && (
            <div className="card p-6">
              <h3 className="text-lg font-bold text-ink">Comparable contracts</h3>
              <p className="mt-2 text-sm leading-7 text-gray-700">
                The players at the same position whose {LEAGUE.season} salary is closest to his.
                Salary proximity is not the same as similarity as a player, but it is the quickest
                read on what the market pays for this kind of role.
              </p>
              <ul className="mt-4 divide-y divide-gray-100">
                {narrative.comparables.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/players/${c.slug}`}
                      className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition hover:bg-gray-50"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <PlayerAvatar name={c.name} teamAbbr={team.abbr} size={24} />
                        <span className="truncate text-sm font-semibold text-ink">{c.name}</span>
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500">
                          {c.pos}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs tabular-nums text-gray-500">
                        ${c.salary.toFixed(2)}M · {c.years} yr
                        {c.ppg !== null ? ` · ${c.ppg.toFixed(1)} ppg` : ""}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="card p-6">
            <h3 className="text-lg font-bold text-ink">Quick answers</h3>
            <dl className="mt-4 space-y-4">
              {narrative.faqs.map((f) => (
                <div key={f.q}>
                  <dt className="text-sm font-bold text-ink">{f.q}</dt>
                  <dd className="mt-1 text-sm leading-7 text-gray-600">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ---------- contract context ---------- */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-ink">Contract &amp; team context</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600">
              <li>
                <span className="font-semibold text-ink">2026-27 salary:</span> $
                {p.salary.toFixed(2)}M, {capShare.toFixed(1)}% of the $
                {LEAGUE.salaryCap.toFixed(2)}M salary cap and {teamShare.toFixed(1)}% of the{" "}
                {team.name}&apos;s ${s.official.toFixed(1)}M cap hit.
              </li>
              <li>
                <span className="font-semibold text-ink">Term:</span> {p.years} season
                {p.years === 1 ? "" : "s"} remaining, about $
                {(p.salary * p.years).toFixed(1)}M left on the deal.
              </li>
              <li>
                <span className="font-semibold text-ink">Team status:</span>{" "}
                <span className={`rounded px-1.5 py-0.5 text-xs font-bold ${STATUS_COLOR[s.status]}`}>
                  {STATUS_LABEL[s.status]}
                </span>{" "}
                — {statusSentence(s)}
              </li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href={`/teams/${team.id}`} className="btn-primary text-sm">
                {team.name} payroll
              </Link>
              <Link href="/team-salary-trade-simulator" className="btn-ghost">
                Trade simulator
              </Link>
              <Link href="/salary-cap-calculator" className="btn-ghost">
                Cap calculator
              </Link>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold text-ink">Same roster</h2>
            <ul className="mt-4 space-y-1">
              {teammates.map((m) => {
                const mate = profileFor(team.abbr, m.name);
                const href = mate ? `/players/${mate.slug}` : `/teams/${team.id}`;
                return (
                  <li key={m.id}>
                    <Link
                      href={href}
                      className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 transition hover:bg-gray-50"
                    >
                      <span className="flex min-w-0 items-center gap-2 text-sm text-gray-700">
                        <PlayerAvatar name={m.name} teamAbbr={team.abbr} size={26} espnId={mate?.id} />
                        <span className="truncate">{m.name}</span>
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500">
                          {m.pos}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs tabular-nums text-gray-500">
                        ${m.salary.toFixed(2)}M
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link
              href={`/teams/${team.id}`}
              className="mt-4 inline-block text-sm font-semibold text-orange-600 hover:underline"
            >
              See the full {team.name} roster →
            </Link>
          </div>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-gray-400">
          Bio, awards, jersey number and season stats:{" "}
          <a href={SOURCE_URLS.espnNba} target="_blank" rel="noopener noreferrer" className="text-court hover:underline">
            {PLAYER_META.source}
          </a>
          , retrieved {PLAYER_META.retrieved}. Salary and contract terms:{" "}
          <a href={SOURCE_URLS.hoopshypeSalaries} target="_blank" rel="noopener noreferrer" className="text-court hover:underline">
            HoopsHype {LEAGUE.season}
          </a>
          , retrieved {PLAYER_META.retrieved}. Cap, tax and apron thresholds are from the{" "}
          <a href={SOURCE_URLS.nbaCapRelease} target="_blank" rel="noopener noreferrer" className="text-court hover:underline">
            NBA&apos;s official {LEAGUE.season} release
          </a>{" "}
          (July 1, 2026). This site is an independent fan project, not affiliated with the NBA or the {full}.
        </p>
      </section>
    </main>
  );
}
