// Player profile layer: turns the generated ESPN dataset into typed lookups.
//
// The JSON is generated from ESPN's public athlete endpoints (jersey numbers,
// bios, awards, team history, season-by-season stats) and joined to the
// HoopsHype 2026-27 salary data already used across the site.

import raw from "./data/players.json";

export type CareerLine = [
  season: string,
  team: string,
  gp: number,
  mpg: number | null,
  ppg: number | null,
  rpg: number | null,
  apg: number | null,
  fgPct: number | null,
  tpPct: number | null,
];

export type Award = [name: string, count: number, seasons: string[]];

export type PlayerProfile = {
  id: number;
  name: string;
  slug: string;
  jersey: string | null;
  pos: string;
  /** Our internal team id, e.g. "bos". */
  team: string;
  salary: number;
  years: number;
  height: string | null;
  weight: string | null;
  born: string | null;
  birthplace: string | null;
  college: string | null;
  draft: string | null;
  debut: number | null;
  exp: string | null;
  awards: Award[];
  /** [team display name, season range] — e.g. ["Boston Celtics", "2017-CURRENT"]. */
  teams: [string, string][];
  seasons: CareerLine[];
  /** [GP, MPG, PPG, RPG, APG] career averages. */
  career: number[] | null;
  /** Same player listed on another payroll (dead money / retained salary). */
  alsoOn?: { team: string; salary: number }[];
};

type Dataset = {
  meta: { source: string; retrieved: string; note: string };
  teamNames: Record<string, string>;
  players: Record<string, PlayerProfile>;
  playerIndex: Record<string, string>;
};

const DATA = raw as unknown as Dataset;

export const PLAYER_META = DATA.meta;
export const HISTORIC_TEAM_NAMES = DATA.teamNames;
export const PLAYER_PROFILES = DATA.players;
export const PLAYER_COUNT = Object.keys(DATA.players).length;

/** Normalised key used to join a salary-data name to the profile index. */
export function playerKey(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['\u2019.]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function profileFor(teamAbbr: string, name: string): PlayerProfile | null {
  const slug = DATA.playerIndex[`${teamAbbr.toLowerCase()}|${playerKey(name)}`];
  return slug ? DATA.players[slug] ?? null : null;
}

export function profileBySlug(slug: string): PlayerProfile | null {
  return DATA.players[slug] ?? null;
}

export function allPlayerSlugs(): string[] {
  return Object.keys(DATA.players);
}

/** "7/15/1990" -> "July 15, 1990". Falls back to the raw string. */
export function formatBirthDate(rawDate: string | null): string | null {
  if (!rawDate) return null;
  const m = rawDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return rawDate;
  const month = new Date(Number(m[3]), Number(m[1]) - 1, 1).toLocaleString("en-US", {
    month: "long",
  });
  return `${month} ${Number(m[2])}, ${m[3]}`;
}

/** Age in years at the data snapshot date (static builds go stale gracefully). */
export function ageAtSnapshot(rawDate: string | null): number | null {
  if (!rawDate) return null;
  const m = rawDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  const born = new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2]));
  const ref = new Date(`${DATA.meta.retrieved}T00:00:00`);
  let age = ref.getFullYear() - born.getFullYear();
  const beforeBirthday =
    ref.getMonth() < born.getMonth() ||
    (ref.getMonth() === born.getMonth() && ref.getDate() < born.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

/** "2012-2023, 2026-CURRENT" -> "2012–2023, 2026–present". */
export function seasonRange(label: string): string {
  return label
    .replace(/\s*-\s*(?=\d{4})/g, "–")
    .replace(/\s*-\s*CURRENT/i, "–present")
    .replace(/CURRENT/i, "present");
}

/** Every team the player has appeared for, most recent first, de-duplicated. */
export function careerTeams(profile: PlayerProfile): { name: string; range: string }[] {
  return profile.teams
    .map(([name, range]) => ({ name, range: seasonRange(range) }))
    .sort((a, b) => {
      const year = (r: string) => Number(r.match(/(\d{4})/g)?.slice(-1)[0] ?? 0);
      return year(b.range) - year(a.range);
    });
}

/** Formats a nullable stat for table output. */
export function fmt(value: number | null | undefined, digits = 1): string {
  if (value === null || value === undefined) return "—";
  return value.toFixed(digits);
}
