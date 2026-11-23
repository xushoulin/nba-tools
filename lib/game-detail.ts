// Single-game box score layer.
//
// ESPN's `summary` endpoint carries everything a game detail page needs:
// quarter-by-quarter line scores, both rosters with full stat lines, team totals
// and the venue. Like the scoreboard it is public, key-free and CORS-enabled, so
// this runs in the browser.
//
// The rating on a player card is a Hollinger-style Game Score rescaled to 0-10.
// It is derived, not official — the page says so.

import PLAYER_SLUGS from "./data/player-slugs.json";
import { resolveTeamKey } from "./nba-scoreboard";

export type GameState = "pre" | "in" | "post";

export type BoxPlayer = {
  id: string;
  name: string;
  shortName: string;
  jersey: string | null;
  position: string | null;
  starter: boolean;
  didNotPlay: boolean;
  note: string | null;
  minutes: number | null;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
  offensiveRebounds: number;
  defensiveRebounds: number;
  plusMinus: number;
  fgMade: number;
  fgAttempted: number;
  threeMade: number;
  threeAttempted: number;
  ftMade: number;
  ftAttempted: number;
  trueShooting: number | null;
  gameScore: number;
  rating: number;
  headshot: string | null;
  profileSlug: string | null;
};

export type TeamTotals = {
  points: number;
  rebounds: number;
  assists: number;
  turnovers: number;
  steals: number;
  blocks: number;
  fgMade: number;
  fgAttempted: number;
  threeMade: number;
  threeAttempted: number;
  ftMade: number;
  ftAttempted: number;
};

export type BoxTeam = {
  side: "away" | "home";
  abbr: string;
  key: string;
  name: string;
  shortName: string;
  slug: string | null;
  score: number;
  winner: boolean;
  linescores: Array<number | null>;
  players: BoxPlayer[];
  totals: TeamTotals | null;
};

export type GameBox = {
  id: string;
  dateISO: string;
  state: GameState;
  statusDetail: string;
  venue: string | null;
  attendance: number | null;
  away: BoxTeam;
  home: BoxTeam;
  /** Average true shooting of players who logged 12+ minutes, used as context. */
  baselineTrueShooting: number | null;
};

/* ------------------------------------------------------------- primitives --- */

function num(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseMadeAttempted(value: unknown): [number, number] {
  if (typeof value !== "string") return [0, 0];
  const [made, attempted] = value.split("-");
  return [num(made), num(attempted)];
}

function parseMinutes(value: unknown): number | null {
  if (typeof value !== "string" || value.trim() === "" || value.trim() === "--") return null;
  if (value.includes(":")) {
    const [minutes, seconds] = value.split(":");
    return num(minutes) + num(seconds) / 60;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/* --------------------------------------------------------------- rating --- */

/** Hollinger Game Score. Positive contributions minus misses and turnovers. */
export function computeGameScore(input: {
  points: number;
  fgMade: number;
  fgAttempted: number;
  ftMade: number;
  ftAttempted: number;
  offensiveRebounds: number;
  defensiveRebounds: number;
  steals: number;
  assists: number;
  blocks: number;
  fouls: number;
  turnovers: number;
}): number {
  return (
    input.points +
    0.4 * input.fgMade -
    0.7 * input.fgAttempted -
    0.4 * (input.ftAttempted - input.ftMade) +
    0.7 * input.offensiveRebounds +
    0.3 * input.defensiveRebounds +
    input.steals +
    0.7 * input.assists +
    0.7 * input.blocks -
    0.4 * input.fouls -
    input.turnovers
  );
}

/**
 * Game Score runs roughly -5 (invisible) to 35+ (a monster night). Map it onto a
 * 0-10 scale so it reads like a match rating: 15 is an average starter, 30 is a
 * takeover.
 */
export function ratingFromGameScore(gameScore: number): number {
  const scaled = ((gameScore + 3) / 36) * 10;
  return Math.round(Math.min(10, Math.max(0, scaled)) * 10) / 10;
}

export function gradeForRating(rating: number): string {
  if (rating >= 9) return "Dominant";
  if (rating >= 7.5) return "Excellent";
  if (rating >= 6) return "Strong";
  if (rating >= 4.5) return "Solid";
  if (rating >= 3) return "Quiet";
  if (rating >= 1.5) return "Struggled";
  return "Barely featured";
}

function trueShooting(points: number, fga: number, fta: number): number | null {
  const denominator = 2 * (fga + 0.44 * fta);
  if (denominator <= 0) return null;
  return (points / denominator) * 100;
}

/* -------------------------------------------------------------- parsing --- */

type RawStats = {
  names?: string[];
  athletes?: Array<{
    starter?: boolean;
    didNotPlay?: boolean;
    reason?: string;
    stats?: string[];
    athlete?: {
      id?: string;
      displayName?: string;
      shortName?: string;
      jersey?: string;
      position?: { abbreviation?: string; displayName?: string };
      headshot?: { href?: string };
    };
  }>;
  totals?: string[];
};

function indexOf(names: string[], label: string, fallback: number): number {
  const found = names.findIndex((name) => name === label);
  return found >= 0 ? found : fallback;
}

function parsePlayer(
  raw: NonNullable<RawStats["athletes"]>[number],
  names: string[],
): BoxPlayer | null {
  const athlete = raw.athlete;
  if (!athlete?.id) return null;

  const idx = {
    minutes: indexOf(names, "MIN", 0),
    points: indexOf(names, "PTS", 1),
    fg: indexOf(names, "FG", 2),
    three: indexOf(names, "3PT", 3),
    ft: indexOf(names, "FT", 4),
    rebounds: indexOf(names, "REB", 5),
    assists: indexOf(names, "AST", 6),
    turnovers: indexOf(names, "TO", 7),
    steals: indexOf(names, "STL", 8),
    blocks: indexOf(names, "BLK", 9),
    oreb: indexOf(names, "OREB", 10),
    dreb: indexOf(names, "DREB", 11),
    fouls: indexOf(names, "PF", 12),
    plusMinus: indexOf(names, "+/-", 13),
  };

  const stats = raw.stats ?? [];
  const minutes = parseMinutes(stats[idx.minutes]);
  const [fgMade, fgAttempted] = parseMadeAttempted(stats[idx.fg]);
  const [threeMade, threeAttempted] = parseMadeAttempted(stats[idx.three]);
  const [ftMade, ftAttempted] = parseMadeAttempted(stats[idx.ft]);

  const points = num(stats[idx.points]);
  const rebounds = num(stats[idx.rebounds]);
  const offensiveRebounds = num(stats[idx.oreb]);
  const defensiveRebounds = num(stats[idx.dreb] ?? String(Math.max(0, rebounds - offensiveRebounds)));

  const didNotPlay =
    raw.didNotPlay === true ||
    minutes === null ||
    (minutes === 0 && points === 0 && fgAttempted === 0 && rebounds === 0 && num(stats[idx.assists]) === 0);

  const gameScore = computeGameScore({
    points,
    fgMade,
    fgAttempted,
    ftMade,
    ftAttempted,
    offensiveRebounds,
    defensiveRebounds,
    steals: num(stats[idx.steals]),
    assists: num(stats[idx.assists]),
    blocks: num(stats[idx.blocks]),
    fouls: num(stats[idx.fouls]),
    turnovers: num(stats[idx.turnovers]),
  });

  return {
    id: String(athlete.id),
    name: athlete.displayName || athlete.shortName || "Unknown player",
    shortName: athlete.shortName || athlete.displayName || "",
    jersey: athlete.jersey ?? null,
    position: athlete.position?.abbreviation ?? athlete.position?.displayName ?? null,
    starter: raw.starter === true,
    didNotPlay,
    note: raw.reason ?? null,
    minutes,
    points,
    rebounds,
    assists: num(stats[idx.assists]),
    steals: num(stats[idx.steals]),
    blocks: num(stats[idx.blocks]),
    turnovers: num(stats[idx.turnovers]),
    fouls: num(stats[idx.fouls]),
    offensiveRebounds,
    defensiveRebounds,
    plusMinus: num(stats[idx.plusMinus]),
    fgMade,
    fgAttempted,
    threeMade,
    threeAttempted,
    ftMade,
    ftAttempted,
    trueShooting: trueShooting(points, fgAttempted, ftAttempted),
    gameScore: Math.round(gameScore * 10) / 10,
    rating: didNotPlay ? 0 : ratingFromGameScore(gameScore),
    headshot: athlete.headshot?.href ?? null,
    profileSlug: (PLAYER_SLUGS as Record<string, string>)[String(athlete.id)] ?? null,
  };
}

function parseTotals(raw: RawStats): TeamTotals | null {
  if (!Array.isArray(raw.totals) || raw.totals.length === 0) return null;
  const stats = raw.totals;
  const names = raw.names ?? [];
  const [fgMade, fgAttempted] = parseMadeAttempted(stats[indexOf(names, "FG", 2)]);
  const [threeMade, threeAttempted] = parseMadeAttempted(stats[indexOf(names, "3PT", 3)]);
  const [ftMade, ftAttempted] = parseMadeAttempted(stats[indexOf(names, "FT", 4)]);

  return {
    points: num(stats[indexOf(names, "PTS", 1)]),
    rebounds: num(stats[indexOf(names, "REB", 5)]),
    assists: num(stats[indexOf(names, "AST", 6)]),
    turnovers: num(stats[indexOf(names, "TO", 7)]),
    steals: num(stats[indexOf(names, "STL", 8)]),
    blocks: num(stats[indexOf(names, "BLK", 9)]),
    fgMade,
    fgAttempted,
    threeMade,
    threeAttempted,
    ftMade,
    ftAttempted,
  };
}

/* ------------------------------------------------------------------ fetch --- */

const SUMMARY_URL = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary";

export async function fetchGame(id: string): Promise<GameBox> {
  if (!/^\d+$/.test(id)) throw new Error("That game id is not valid");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  let payload: Record<string, unknown>;
  try {
    const response = await fetch(`${SUMMARY_URL}?event=${id}&_=${Date.now()}`, {
      cache: "no-store",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (response.status === 404) throw new Error("That game could not be found");
    if (!response.ok) throw new Error(`ESPN summary responded ${response.status}`);
    payload = (await response.json()) as Record<string, unknown>;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("The box score request timed out");
    }
    if (error instanceof TypeError) {
      throw new Error("Could not reach ESPN — check your connection and try again");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }

  return normaliseGame(id, payload);
}

function normaliseGame(id: string, payload: Record<string, unknown>): GameBox {
  const header = (payload.header ?? {}) as {
    competitions?: Array<{
      date?: string;
      status?: { period?: number; displayClock?: string; type?: { state?: string; shortDetail?: string; detail?: string } };
      competitors?: Array<{
        homeAway?: string;
        score?: string | number;
        winner?: boolean;
        linescores?: Array<{ displayValue?: string }>;
        team?: { abbreviation?: string; displayName?: string; shortDisplayName?: string; name?: string };
      }>;
    }>;
  };

  const competition = header.competitions?.[0];
  if (!competition) throw new Error("This game has no scoreboard data yet");

  const headerState = competition.status?.type?.state;
  const state: GameState = headerState === "in" || headerState === "post" ? headerState : "pre";

  const buildTeam = (side: "away" | "home"): BoxTeam => {
    const raw = competition.competitors?.find((team) => team.homeAway === side);
    if (!raw) throw new Error("This game is missing one of the two teams");
    const abbr = (raw.team?.abbreviation || "").toUpperCase();
    const key = resolveTeamKey(abbr);
    return {
      side,
      abbr,
      key: key ?? abbr.toLowerCase(),
      name: raw.team?.displayName || abbr,
      shortName: raw.team?.shortDisplayName || raw.team?.name || abbr,
      slug: key,
      score: num(raw.score),
      winner: raw.winner === true,
      linescores: (raw.linescores ?? []).map((line) => {
        const value = Number(line?.displayValue);
        return Number.isFinite(value) ? value : null;
      }),
      players: [],
      totals: null,
    };
  };

  const away = buildTeam("away");
  const home = buildTeam("home");

  const boxscore = (payload.boxscore ?? {}) as {
    players?: Array<{ team?: { abbreviation?: string }; statistics?: RawStats[] }>;
  };

  for (const teamBlock of boxscore.players ?? []) {
    const abbr = (teamBlock.team?.abbreviation || "").toUpperCase();
    const target = abbr === away.abbr ? away : abbr === home.abbr ? home : null;
    if (!target) continue;
    const stats = teamBlock.statistics?.[0];
    if (!stats) continue;
    const names = stats.names ?? [];
    const players = (stats.athletes ?? [])
      .map((athlete) => parsePlayer(athlete, names))
      .filter((player): player is BoxPlayer => player !== null);

    target.players = players.sort((a, b) => {
      if (a.starter !== b.starter) return a.starter ? -1 : 1;
      if (a.didNotPlay !== b.didNotPlay) return a.didNotPlay ? 1 : -1;
      return (b.minutes ?? 0) - (a.minutes ?? 0);
    });
    target.totals = parseTotals(stats);
  }

  const gameInfo = (payload.gameInfo ?? {}) as {
    venue?: { fullName?: string };
    attendance?: number;
  };

  const played = [...away.players, ...home.players].filter(
    (player) => !player.didNotPlay && (player.minutes ?? 0) >= 12 && player.trueShooting !== null,
  );
  const baselineTrueShooting = played.length
    ? played.reduce((total, player) => total + (player.trueShooting ?? 0), 0) / played.length
    : null;

  return {
    id: String(id),
    dateISO: competition.date ?? new Date().toISOString(),
    state,
    statusDetail: competition.status?.type?.shortDetail || (state === "post" ? "Final" : "Scheduled"),
    venue: gameInfo.venue?.fullName ?? null,
    attendance: typeof gameInfo.attendance === "number" ? gameInfo.attendance : null,
    away,
    home,
    baselineTrueShooting,
  };
}

/* ------------------------------------------------------------ evaluation --- */

export type PlayerEvaluation = {
  grade: string;
  headline: string;
  paragraphs: string[];
  positives: string[];
  negatives: string[];
};

export type EvaluationContext = {
  teamName: string;
  opponentAbbr: string;
  teamWon: boolean;
  teamScore: number;
  opponentScore: number;
  rank: number;
  rosterSize: number;
  baselineTrueShooting: number | null;
};

function signed(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
}

function plural(value: number, singular: string, pluralForm = `${singular}s`): string {
  return `${value} ${value === 1 ? singular : pluralForm}`;
}

/** "a, b and c" — drops zero-count entries the caller already filtered out. */
function joinList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function ordinal(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  switch (value % 10) {
    case 1:
      return `${value}st`;
    case 2:
      return `${value}nd`;
    case 3:
      return `${value}rd`;
    default:
      return `${value}th`;
  }
}

/** Deterministic, stat-driven write-up. No templates pretending to be scouting. */
export function buildEvaluation(player: BoxPlayer, context: EvaluationContext): PlayerEvaluation {
  if (player.didNotPlay) {
    return {
      grade: "Did not play",
      headline: `${player.name} did not appear in this game.`,
      paragraphs: [
        player.note
          ? `The box score lists him as inactive: ${player.note.toLowerCase()}.`
          : "He was on the roster but did not log any minutes.",
        "No rating is produced for a game without minutes, because every input to the model would be zero.",
      ],
      positives: [],
      negatives: [],
    };
  }

  const minutes = Math.round(player.minutes ?? 0);
  const fg = `${player.fgMade}-${player.fgAttempted}`;
  const three = `${player.threeMade}-${player.threeAttempted}`;
  const ft = `${player.ftMade}-${player.ftAttempted}`;
  const ts = player.trueShooting;
  const grade = gradeForRating(player.rating);
  const resultWord = context.teamWon ? "win" : "loss";

  const headlineParts: string[] = [];
  if (player.rebounds > 0) headlineParts.push(plural(player.rebounds, "rebound"));
  if (player.assists > 0) headlineParts.push(plural(player.assists, "assist"));
  const headline = `${player.name} scored ${plural(player.points, "point")} on ${fg} shooting${
    headlineParts.length ? ` with ${joinList(headlineParts)}` : ""
  } in ${minutes} minutes.`;

  const paragraphs: string[] = [];

  // Shooting shape
  if (player.fgAttempted === 0 && player.ftAttempted === 0) {
    paragraphs.push(
      `He did not attempt a shot in ${minutes} minutes, so there is no efficiency read to make — the value in this game, if any, came from the other columns.`,
    );
  } else if (player.fgAttempted === 0) {
    paragraphs.push(
      `He did not attempt a field goal in ${minutes} minutes; his ${plural(player.points, "point")} came at the free-throw line (${ft}).`,
    );
  } else if (ts !== null && context.baselineTrueShooting !== null) {
    const baseline = context.baselineTrueShooting;
    const delta = ts - baseline;
    const wording =
      delta >= 6 ? "well above" : delta >= 1 ? "above" : delta > -1 ? "in line with" : "below";
    paragraphs.push(
      `His ${ts.toFixed(1)}% true shooting was ${wording} the ${baseline.toFixed(1)}% average for rotation players in this game. He went ${three} from three and ${ft} at the line, so ${
        player.threeAttempted >= 5
          ? "the shot profile was heavily perimeter-based"
          : player.ftAttempted >= 6
            ? "most of the damage came at the rim and the line"
            : "the shot diet was mixed"
      }.`,
    );
  } else {
    paragraphs.push(`He finished ${three} from three and ${ft} from the free-throw line.`);
  }

  // All-round contribution
  const stocks = player.steals + player.blocks;
  const contributions: string[] = [];
  if (player.rebounds > 0) {
    contributions.push(
      `${plural(player.rebounds, "rebound")}${
        player.offensiveRebounds > 0 ? ` (${player.offensiveRebounds} on the offensive glass)` : ""
      }`,
    );
  }
  if (player.assists > 0) contributions.push(plural(player.assists, "assist"));
  if (stocks > 0) {
    const stockParts = [
      player.steals > 0 ? plural(player.steals, "steal") : null,
      player.blocks > 0 ? plural(player.blocks, "block") : null,
    ].filter((part): part is string => part !== null);
    contributions.push(joinList(stockParts));
  }
  if (player.turnovers > 0) contributions.push(plural(player.turnovers, "turnover"));

  paragraphs.push(
    `${
      contributions.length
        ? `Beyond the scoring he had ${joinList(contributions)}.`
        : "He did not record a rebound, assist, steal or block."
    } The ${context.teamName} were ${signed(player.plusMinus)} with him on the floor in a ${
      context.teamScore
    }-${context.opponentScore} ${resultWord}.`,
  );

  // Standing within the team
  paragraphs.push(
    `That adds up to a game score of ${player.gameScore.toFixed(1)}, the ${ordinal(
      context.rank,
    )} highest on a ${context.rosterSize}-man rotation, which maps to a ${player.rating.toFixed(
      1,
    )}/10 rating — ${grade.toLowerCase()} by this site's scale.`,
  );

  const positives: string[] = [];
  const negatives: string[] = [];

  if (ts !== null && ts >= 60) positives.push(`Efficient scoring (${ts.toFixed(1)}% true shooting)`);
  if (player.points >= 20) positives.push(`Carried the scoring load (${player.points} points)`);
  if (player.assists >= 6) positives.push(`Created for others (${player.assists} assists)`);
  if (player.rebounds >= 10) positives.push(`Controlled the glass (${player.rebounds} rebounds)`);
  if (stocks >= 4) positives.push(`Disrupted plays (${stocks} steals and blocks)`);
  if (player.turnovers <= 1 && minutes >= 20) positives.push(`Careful with the ball (${plural(player.turnovers, "turnover")})`);
  if (player.plusMinus >= 10) positives.push(`On the floor for a ${signed(player.plusMinus)} run`);

  if (ts !== null && ts < 45 && player.fgAttempted >= 8) negatives.push(`Cold shooting (${fg}, ${ts.toFixed(1)}% true shooting)`);
  if (player.turnovers >= 4) negatives.push(`Turnover trouble (${player.turnovers})`);
  if (player.plusMinus <= -10) negatives.push(`Part of a ${player.plusMinus} stretch`);
  if (player.fouls >= 5) negatives.push(`Foul trouble (${player.fouls} personals)`);
  if (minutes <= 8 && player.points <= 2) negatives.push(`Minimal role (${minutes} minutes)`);

  return { grade, headline, paragraphs, positives, negatives };
}

export function teamRank(team: BoxTeam, playerId: string): { rank: number; size: number } {
  const active = team.players.filter((player) => !player.didNotPlay);
  const sorted = [...active].sort((a, b) => b.gameScore - a.gameScore);
  const index = sorted.findIndex((player) => player.id === playerId);
  return { rank: index >= 0 ? index + 1 : active.length, size: active.length };
}

export function findPlayer(game: GameBox, playerId: string): { team: BoxTeam; opponent: BoxTeam; player: BoxPlayer } | null {
  for (const [team, opponent] of [
    [game.away, game.home],
    [game.home, game.away],
  ] as const) {
    const player = team.players.find((entry) => entry.id === playerId);
    if (player) return { team, opponent, player };
  }
  return null;
}
