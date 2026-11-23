// Recent form: a player's last five games, rebuilt in the visitor's browser.
//
// Two public ESPN endpoints are enough. The game log says *which* games a player
// appeared in, with a stat line for every one of them; the per-game summary adds
// the opponent, the score and the exact rebound split the rating needs, so only
// the five games on screen are pulled from it.

import { LEAGUE } from "./salary-data";
import { fetchGame, findPlayer } from "./game-detail";

/** ESPN labels a season by the year it ends in: 2026-27 is "2027". */
export const ESPN_SEASON = Number(LEAGUE.season.slice(0, 4)) + 1;

const GAMELOG_URL =
  "https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes";

const FORM_LENGTH = 5;

/** The counting stats both endpoints report the same way. */
type StatLine = {
  minutes: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fgMade: number;
  fgAttempted: number;
  threeMade: number;
  threeAttempted: number;
  ftMade: number;
  ftAttempted: number;
};

/** One row of the game log, before the opponent is known. */
export type LogLine = StatLine & { eventId: string };

export type FormGame = StatLine & {
  eventId: string;
  dateISO: string;
  opponentAbbr: string;
  /** Key into the site's team asset map, when the opponent is one of the 30. */
  opponentKey: string | null;
  home: boolean;
  teamScore: number;
  opponentScore: number;
  won: boolean;
  statusDetail: string;
  plusMinus: number;
  gameScore: number;
  rating: number;
};

export type FormAverages = {
  games: number;
  minutes: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  /** Percentage, 0-100. Null when no shot was attempted. */
  fgPct: number | null;
  threePct: number | null;
  trueShooting: number | null;
  /** Only present when the rows carry a rating. */
  rating: number | null;
};

export type PlayerForm = {
  /** The five most recent games, newest first. */
  games: FormGame[];
  /** Averages across those five. */
  recent: FormAverages | null;
  /**
   * Averages across every game in the log. Built from the log itself rather
   * than the page's season table, which is a snapshot from an earlier date.
   */
  season: FormAverages | null;
  /** Games in the log — more than five for most players. */
  seasonGames: number;
  fetchedAt: number;
};

/* ------------------------------------------------------------------ log --- */

type RawLog = {
  names?: string[];
  seasonTypes?: Array<{
    displayName?: string;
    categories?: Array<{ events?: Array<{ eventId?: unknown; stats?: string[] }> }>;
  }>;
};

function toNumber(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function madeAttempted(value: unknown): [number, number] {
  if (typeof value !== "string") return [0, 0];
  const [made, attempted] = value.split("-");
  return [toNumber(made), toNumber(attempted)];
}

function parseMinutes(value: unknown): number {
  if (typeof value !== "string") return toNumber(value);
  const trimmed = value.trim();
  if (trimmed === "" || trimmed === "--") return 0;
  if (trimmed.includes(":")) {
    const [minutes, seconds] = trimmed.split(":");
    return toNumber(minutes) + toNumber(seconds) / 60;
  }
  return toNumber(trimmed);
}

/** Column order differs between players, so every lookup goes through `names`. */
function parseLogLine(eventId: string, stats: string[], names: string[]): LogLine {
  const at = (label: string, fallback: number) => {
    const index = names.indexOf(label);
    return stats[index >= 0 ? index : fallback];
  };
  const [fgMade, fgAttempted] = madeAttempted(at("fieldGoalsMade-fieldGoalsAttempted", 1));
  const [threeMade, threeAttempted] = madeAttempted(
    at("threePointFieldGoalsMade-threePointFieldGoalsAttempted", 3),
  );
  const [ftMade, ftAttempted] = madeAttempted(at("freeThrowsMade-freeThrowsAttempted", 5));

  return {
    eventId,
    minutes: parseMinutes(at("minutes", 0)),
    points: toNumber(at("points", 13)),
    rebounds: toNumber(at("totalRebounds", 7)),
    assists: toNumber(at("assists", 8)),
    steals: toNumber(at("steals", 10)),
    blocks: toNumber(at("blocks", 9)),
    turnovers: toNumber(at("turnovers", 12)),
    fgMade,
    fgAttempted,
    threeMade,
    threeAttempted,
    ftMade,
    ftAttempted,
  };
}

async function fetchLog(playerId: string): Promise<LogLine[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  let payload: RawLog;
  try {
    const response = await fetch(
      `${GAMELOG_URL}/${encodeURIComponent(playerId)}/gamelog?season=${ESPN_SEASON}&_=${Date.now()}`,
      { cache: "no-store", signal: controller.signal, headers: { Accept: "application/json" } },
    );
    if (!response.ok) throw new Error(`ESPN game log responded ${response.status}`);
    payload = (await response.json()) as RawLog;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("The game log request timed out");
    }
    if (error instanceof TypeError) {
      throw new Error("Could not reach ESPN — check your connection and try again");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }

  // Preseason and playoff blocks sit alongside the regular season; only the
  // regular season counts toward "his last five games".
  const regular = (payload.seasonTypes ?? []).find((block) =>
    /regular season/i.test(block.displayName ?? ""),
  );
  if (!regular) return [];

  const names = payload.names ?? [];
  const seen = new Set<string>();
  const lines: LogLine[] = [];
  // Categories are month buckets, newest first — the same order ESPN prints.
  for (const category of regular.categories ?? []) {
    for (const event of category.events ?? []) {
      const id = String(event?.eventId ?? "");
      if (!id || seen.has(id) || !Array.isArray(event?.stats)) continue;
      seen.add(id);
      const line = parseLogLine(id, event.stats, names);
      // Box scores occasionally carry a row for a player who never checked in.
      if (line.minutes <= 0 && line.points === 0 && line.fgAttempted === 0) continue;
      lines.push(line);
    }
  }
  return lines;
}

/* ------------------------------------------------------------- averages --- */

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function ratio(made: number, attempted: number): number | null {
  if (attempted <= 0) return null;
  return (made / attempted) * 100;
}

function averagesOf(rows: StatLine[], ratings: number[] | null = null): FormAverages | null {
  if (rows.length === 0) return null;
  const sum = (pick: (row: StatLine) => number) => rows.reduce((total, row) => total + pick(row), 0);

  const fgMade = sum((row) => row.fgMade);
  const fgAttempted = sum((row) => row.fgAttempted);
  const threeMade = sum((row) => row.threeMade);
  const threeAttempted = sum((row) => row.threeAttempted);
  const ftAttempted = sum((row) => row.ftAttempted);
  const points = sum((row) => row.points);
  const tsDenominator = 2 * (fgAttempted + 0.44 * ftAttempted);

  return {
    games: rows.length,
    minutes: mean(rows.map((row) => row.minutes)),
    points: mean(rows.map((row) => row.points)),
    rebounds: mean(rows.map((row) => row.rebounds)),
    assists: mean(rows.map((row) => row.assists)),
    steals: mean(rows.map((row) => row.steals)),
    blocks: mean(rows.map((row) => row.blocks)),
    turnovers: mean(rows.map((row) => row.turnovers)),
    fgPct: ratio(fgMade, fgAttempted),
    threePct: ratio(threeMade, threeAttempted),
    trueShooting: tsDenominator > 0 ? (points / tsDenominator) * 100 : null,
    rating: ratings && ratings.length > 0 ? mean(ratings) : null,
  };
}

/* ---------------------------------------------------------------- build --- */

function toFormGame(
  game: Awaited<ReturnType<typeof fetchGame>>,
  playerId: string,
): FormGame | null {
  const found = findPlayer(game, playerId);
  if (!found) return null;
  const { team, opponent, player } = found;
  if (player.didNotPlay) return null;
  return {
    eventId: game.id,
    dateISO: game.dateISO,
    opponentAbbr: opponent.abbr,
    opponentKey: opponent.slug,
    home: team.side === "home",
    teamScore: team.score,
    opponentScore: opponent.score,
    won: team.winner,
    statusDetail: game.statusDetail,
    minutes: player.minutes ?? 0,
    points: player.points,
    rebounds: player.rebounds,
    assists: player.assists,
    steals: player.steals,
    blocks: player.blocks,
    turnovers: player.turnovers,
    fgMade: player.fgMade,
    fgAttempted: player.fgAttempted,
    threeMade: player.threeMade,
    threeAttempted: player.threeAttempted,
    ftMade: player.ftMade,
    ftAttempted: player.ftAttempted,
    plusMinus: player.plusMinus,
    gameScore: player.gameScore,
    rating: player.rating,
  };
}

/** One in-flight request per player, so a re-render never doubles the traffic. */
const cache = new Map<string, Promise<PlayerForm>>();

export function fetchPlayerForm(playerId: string): Promise<PlayerForm> {
  const existing = cache.get(playerId);
  if (existing) return existing;
  const request = build(playerId).catch((error: unknown) => {
    // A failed lookup has to be retryable.
    cache.delete(playerId);
    throw error;
  });
  cache.set(playerId, request);
  return request;
}

export function clearPlayerFormCache(playerId?: string): void {
  if (playerId) cache.delete(playerId);
  else cache.clear();
}

async function build(playerId: string): Promise<PlayerForm> {
  const log = await fetchLog(playerId);
  if (log.length === 0) {
    return { games: [], recent: null, season: null, seasonGames: 0, fetchedAt: Date.now() };
  }

  const recentIds = log.slice(0, FORM_LENGTH).map((line) => line.eventId);
  const settled = await Promise.allSettled(recentIds.map((id) => fetchGame(id)));

  const games: FormGame[] = [];
  for (const result of settled) {
    if (result.status !== "fulfilled" || result.value.state !== "post") continue;
    const row = toFormGame(result.value, playerId);
    if (row) games.push(row);
  }

  if (games.length === 0) {
    const failed = settled.find((result) => result.status === "rejected");
    if (failed && failed.status === "rejected") {
      throw failed.reason instanceof Error
        ? failed.reason
        : new Error("Could not load the recent games");
    }
  }

  games.sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime());

  return {
    games,
    recent: averagesOf(games, games.map((game) => game.rating)),
    season: averagesOf(log),
    seasonGames: log.length,
    fetchedAt: Date.now(),
  };
}

/* ------------------------------------------------------------ formatting --- */

/**
 * A game belongs to the calendar date it tipped off on in the United States,
 * not to the visitor's date — a 7:30pm Eastern tip is already tomorrow in Asia,
 * and labelling it "Nov 16" would not match any box score the reader can find.
 */
const GAME_TIME_ZONE = "America/New_York";

export function formatFormDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: GAME_TIME_ZONE,
  });
}

export function formatFormDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: GAME_TIME_ZONE,
  });
}
