// Live scoreboard layer.
//
// The site is a static export, so this runs in the visitor's browser. ESPN's
// public scoreboard endpoint is used because it answers with
// `Access-Control-Allow-Origin: *` and needs no key — the same source the
// player data build already reads from.
//
// Everything here is timezone-aware: the caller passes the visitor's `Date`,
// games are grouped by the visitor's *local* calendar day, and tip-off times
// are formatted with the visitor's own locale rules by the component.

import { TEAM_ASSETS } from "./team-assets";

export type GameState = "pre" | "in" | "post";

export type GameTeam = {
  /** Abbreviation as ESPN prints it, e.g. "GS", "NO", "UTAH". */
  espnAbbr: string;
  /** Key used by the local asset map, e.g. "gsw", "nop", "uta". */
  key: string;
  /** Team page slug, or null when the abbreviation is not in our 30-team map. */
  slug: string | null;
  /** Full name, e.g. "Golden State Warriors". */
  name: string;
  /** Short name, e.g. "Warriors". */
  shortName: string;
  score: number | null;
  winner: boolean;
};

export type Game = {
  id: string;
  /** ISO 8601 UTC tip-off timestamp. */
  tipoff: string;
  state: GameState;
  /** "Final", "Q4 2:31", "Halftime" or (for scheduled games) a local start time. */
  statusDetail: string;
  period: number | null;
  home: GameTeam;
  away: GameTeam;
  venue: string | null;
  broadcast: string | null;
};

export type ScoreboardSnapshot = {
  /** Games whose tip-off falls on the visitor's local day, already sorted. */
  games: Game[];
  /** Soonest upcoming games outside that day, used only by the empty state. */
  next: Game[];
  /** Visitor-local day key, "YYYY-MM-DD". */
  dayKey: string;
  fetchedAt: number;
};

const SCOREBOARD_URL = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard";

/* ---------------------------------------------------------------- teams --- */

/** ESPN prints a handful of clubs differently from the asset map keys. */
const ESPN_ALIASES: Record<string, string> = {
  GS: "gsw",
  GSW: "gsw",
  NY: "nyk",
  NYK: "nyk",
  NO: "nop",
  NOP: "nop",
  SA: "sas",
  SAS: "sas",
  UTAH: "uta",
  UTA: "uta",
  WSH: "was",
  WAS: "was",
  PHO: "phx",
  PHX: "phx",
};

const KEY_BY_ESPN: Record<string, string> = Object.entries(TEAM_ASSETS).reduce(
  (acc, [key, asset]) => {
    acc[asset.espn.toUpperCase()] = key;
    return acc;
  },
  {} as Record<string, string>,
);

export function resolveTeamKey(espnAbbr: string): string | null {
  const abbr = (espnAbbr || "").toUpperCase();
  return ESPN_ALIASES[abbr] ?? KEY_BY_ESPN[abbr] ?? null;
}

/* ---------------------------------------------------------------- dates --- */

export function localDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** Format for ESPN's `dates` parameter, which is YYYYMMDD. */
function compactDay(date: Date): string {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

/* ----------------------------------------------------------- normalising --- */

type RawTeam = {
  homeAway?: string;
  score?: string | number;
  winner?: boolean;
  team?: {
    abbreviation?: string;
    displayName?: string;
    shortDisplayName?: string;
    name?: string;
  };
};

type RawEvent = {
  id?: string;
  date?: string;
  competitions?: Array<{
    venue?: { fullName?: string };
    broadcasts?: Array<{ names?: string[] }>;
    status?: RawStatus;
    competitors?: RawTeam[];
  }>;
  status?: RawStatus;
};

type RawStatus = {
  displayClock?: string;
  period?: number;
  type?: {
    state?: string;
    description?: string;
    detail?: string;
    shortDetail?: string;
    completed?: boolean;
  };
};

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function normaliseTeam(raw: RawTeam): GameTeam | null {
  const team = raw.team;
  const espnAbbr = (team?.abbreviation || "").toUpperCase();
  if (!espnAbbr) return null;
  const key = resolveTeamKey(espnAbbr);
  return {
    espnAbbr,
    key: key ?? espnAbbr.toLowerCase(),
    slug: key,
    name: team?.displayName || espnAbbr,
    shortName: team?.shortDisplayName || team?.name || espnAbbr,
    score: toNumber(raw.score),
    winner: raw.winner === true,
  };
}

function statusLabel(state: GameState, status: RawStatus): string {
  const type = status.type ?? {};
  const clock = status.displayClock || "";
  const period = status.period ?? 0;

  if (state === "post") {
    const short = (type.shortDetail || type.detail || "").trim();
    return short.toLowerCase().startsWith("final") ? short : "Final";
  }

  if (state === "in") {
    const description = (type.description || "").trim();
    if (/half/i.test(description)) return "Halftime";
    if (period > 0 && clock && clock !== "0:00") return `Q${period} ${clock}`;
    if (/end/i.test(description)) return `End Q${period || 1}`;
    return description || "Live";
  }

  return "Scheduled";
}

function normaliseEvent(event: RawEvent): Game | null {
  const competition = event.competitions?.[0];
  if (!competition || !event.date) return null;

  const competitors = competition.competitors ?? [];
  const homeRaw = competitors.find((team) => team.homeAway === "home");
  const awayRaw = competitors.find((team) => team.homeAway === "away");
  if (!homeRaw || !awayRaw) return null;

  const home = normaliseTeam(homeRaw);
  const away = normaliseTeam(awayRaw);
  if (!home || !away) return null;

  const status = competition.status ?? event.status ?? {};
  const rawState = status.type?.state;
  const state: GameState = rawState === "in" || rawState === "post" ? rawState : "pre";

  return {
    id: String(event.id ?? `${away.espnAbbr}-${home.espnAbbr}-${event.date}`),
    tipoff: event.date,
    state,
    statusDetail: statusLabel(state, status),
    period: status.period ?? null,
    home,
    away,
    venue: competition.venue?.fullName ?? null,
    broadcast: competition.broadcasts?.[0]?.names?.[0] ?? null,
  };
}

const STATE_ORDER: Record<GameState, number> = { in: 0, pre: 1, post: 2 };

function sortGames(games: Game[]): Game[] {
  return [...games].sort((a, b) => {
    if (STATE_ORDER[a.state] !== STATE_ORDER[b.state]) {
      return STATE_ORDER[a.state] - STATE_ORDER[b.state];
    }
    return new Date(a.tipoff).getTime() - new Date(b.tipoff).getTime();
  });
}

/* ----------------------------------------------------------------- fetch --- */

async function fetchDay(dateParam: string): Promise<RawEvent[]> {
  // The cache-buster keeps intermediate caches from serving a stale board while
  // a game is in progress.
  const url = `${SCOREBOARD_URL}?dates=${dateParam}&limit=100&_=${Date.now()}`;
  // Without our own timeout a blocked or hanging request would leave the widget
  // on its skeleton forever.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`ESPN scoreboard responded ${response.status}`);
    const payload = (await response.json()) as { events?: RawEvent[] };
    return Array.isArray(payload?.events) ? payload.events : [];
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("The scoreboard request timed out");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch the board and keep only games that tip off on the visitor's local day.
 *
 * Three consecutive ESPN days are requested because ESPN buckets games by an
 * Eastern-time calendar day, while the visitor may be up to 14 hours away from
 * it. Pulling yesterday/today/tomorrow and then filtering on the local date is
 * what makes "today" actually mean today in the visitor's timezone.
 */
export async function fetchScoreboard(now: Date = new Date()): Promise<ScoreboardSnapshot> {
  const dayKey = localDayKey(now);
  const requests = [-1, 0, 1].map((offset) => fetchDay(compactDay(addDays(now, offset))));

  const settled = await Promise.allSettled(requests);
  const fulfilled = settled.filter(
    (result): result is PromiseFulfilledResult<RawEvent[]> => result.status === "fulfilled",
  );

  if (fulfilled.length === 0) {
    const firstError = settled.find(
      (result): result is PromiseRejectedResult => result.status === "rejected",
    );
    throw firstError?.reason instanceof Error
      ? firstError.reason
      : new Error("Could not reach the scoreboard");
  }

  const unique = new Map<string, RawEvent>();
  for (const result of fulfilled) {
    for (const event of result.value) {
      if (event?.id) unique.set(String(event.id), event);
    }
  }

  const normalised = [...unique.values()]
    .map(normaliseEvent)
    .filter((game): game is Game => game !== null);

  const todaysGames = sortGames(
    normalised.filter((game) => localDayKey(new Date(game.tipoff)) === dayKey),
  );

  const nowMs = now.getTime();
  const upcoming = normalised
    .filter(
      (game) =>
        new Date(game.tipoff).getTime() > nowMs &&
        localDayKey(new Date(game.tipoff)) !== dayKey,
    )
    .sort((a, b) => new Date(a.tipoff).getTime() - new Date(b.tipoff).getTime());

  return {
    games: todaysGames,
    next: upcoming.slice(0, 3),
    dayKey,
    fetchedAt: Date.now(),
  };
}

/* -------------------------------------------------------------- formatting --- */

export function formatTipoff(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDayLabel(dayKey: string): string {
  const [year, month, day] = dayKey.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function localTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "local time";
  } catch {
    return "local time";
  }
}
