import type { Metadata } from "next";
import Link from "next/link";
import { INITIAL_TEAMS, LEAGUE, SOURCE_URLS } from "@/lib/salary-data";
import { PLAYER_COUNT, PLAYER_META, PLAYER_PROFILES, type PlayerProfile } from "@/lib/player-profiles";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/tools";

export const metadata: Metadata = {
  title: "NBA Player Profiles — Stats, Contracts & Honours",
  description: `Browse ${PLAYER_COUNT} NBA player profiles: career stats, jersey numbers, honours and ${LEAGUE.season} salary snapshots across all 30 teams, sourced from ESPN.`,
  alternates: { canonical: "/players" },
  openGraph: { url: "/players", images: OG_IMAGE },
};

// Group once at build time so the static page renders 355 descriptive links
// without any client-side filtering or hidden content.
const PLAYERS_BY_TEAM = (() => {
  const groups = new Map<string, PlayerProfile[]>();
  for (const player of Object.values(PLAYER_PROFILES)) {
    const list = groups.get(player.team) ?? [];
    list.push(player);
    groups.set(player.team, list);
  }
  for (const list of groups.values()) {
    list.sort((a, b) => b.salary - a.salary || a.name.localeCompare(b.name));
  }
  return groups;
})();

export default function PlayersIndex() {
  const url = `${SITE_URL}/players`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "NBA player profiles",
        description: `Career stats, jersey numbers, honours and ${LEAGUE.season} salary snapshots for ${PLAYER_COUNT} NBA players.`,
        url,
        numberOfItems: PLAYER_COUNT,
        inLanguage: "en",
        isAccessibleForFree: true,
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Players", item: url },
        ],
      },
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-court">Home</Link>
        <span aria-hidden>/</span>
        <span className="text-gray-700">Players</span>
      </nav>

      <header className="max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">NBA player profiles</h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">
          <strong className="text-ink">
            {PLAYER_COUNT} player profiles, one page per player, grouped here by their {LEAGUE.season} team.
          </strong>{" "}
          First, pick a team to see its listed players; then open a profile for the jersey number, career timeline,
          awards and season-by-season averages. Every profile links back to the source data.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          According to {PLAYER_META.source}, retrieved{" "}
          <time dateTime={PLAYER_META.retrieved}>{PLAYER_META.retrieved}</time>, the biographies, honours and
          statistics below are point-in-time snapshots. Salary figures come from HoopsHype and are estimates, not
          official contracts.
        </p>
      </header>

      <nav aria-label="Jump to team" className="mt-6 flex flex-wrap gap-2 border-y border-gray-200 py-4">
        {INITIAL_TEAMS.map((team) => (
          <a
            key={team.id}
            href={`#${team.id}`}
            className="rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-orange-50 hover:text-court"
          >
            {team.abbr}
            <span className="sr-only"> {team.city} {team.name}</span>
          </a>
        ))}
      </nav>

      {INITIAL_TEAMS.map((team) => {
        const players = PLAYERS_BY_TEAM.get(team.id) ?? [];
        if (players.length === 0) return null;
        return (
          <section key={team.id} id={team.id} className="mt-10 scroll-mt-24">
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-xl font-bold text-ink">
                <Link href={`/teams/${team.id}`} className="hover:text-court">
                  {team.city} {team.name}
                </Link>
              </h2>
              <span className="text-xs text-gray-500">
                {players.length} {players.length === 1 ? "player" : "players"}
              </span>
            </div>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {players.map((player) => (
                <li key={player.slug}>
                  <Link
                    href={`/players/${player.slug}`}
                    className="card flex items-center justify-between gap-3 p-3 text-sm transition hover:border-court hover:shadow"
                  >
                    <span className="min-w-0">
                      <strong className="block truncate text-ink">{player.name}</strong>
                      <span className="text-xs text-gray-500">{player.pos}</span>
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-gray-600">
                      ${player.salary.toFixed(2)}M
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <p className="mt-12 text-xs leading-relaxed text-gray-500">
        Sources: biographies, awards and season stats from{" "}
        <a href={SOURCE_URLS.espnNba} target="_blank" rel="noopener noreferrer" className="text-court hover:underline">
          {PLAYER_META.source}
        </a>{" "}
        (retrieved <time dateTime={PLAYER_META.retrieved}>{PLAYER_META.retrieved}</time>); salaries from{" "}
        <a href={SOURCE_URLS.hoopshypeSalaries} target="_blank" rel="noopener noreferrer" className="text-court hover:underline">
          HoopsHype {LEAGUE.season}
        </a>
        ; cap, tax and apron thresholds from the{" "}
        <a href={SOURCE_URLS.nbaCapRelease} target="_blank" rel="noopener noreferrer" className="text-court hover:underline">
          NBA&apos;s official {LEAGUE.season} release
        </a>
        . This is an independent fan project, not affiliated with the NBA or any team.
      </p>
    </main>
  );
}
