"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import TeamLogo from "@/components/teams/TeamLogo";
import {
  fetchGame,
  type BoxPlayer,
  type BoxTeam,
  type GameBox,
} from "@/lib/game-detail";

type Phase = "loading" | "ready" | "error";

function signed(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
}

function formatGameDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function ScoreHeader({ game }: { game: GameBox }) {
  const statusLabel =
    game.state === "post" ? game.statusDetail : game.state === "in" ? "In progress" : "Scheduled";
  const teamBlock = (team: BoxTeam) => (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
      <TeamLogo abbr={team.key} size={52} eager />
      <div className="text-center">
        <div className="text-sm font-bold text-ink">{team.abbr}</div>
        <div className="hidden max-w-[140px] truncate text-xs text-gray-500 sm:block">{team.name}</div>
      </div>
    </div>
  );

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-center gap-2">
        {teamBlock(game.away)}
        <div className="flex shrink-0 flex-col items-center gap-1 px-1">
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-600 sm:text-[11px]">
            {statusLabel}
          </span>
          <div className="flex items-baseline gap-1.5 text-2xl font-extrabold tabular-nums text-ink sm:text-4xl">
            <span className={game.state !== "pre" && !game.away.winner ? "text-gray-400" : ""}>
              {game.away.score}
            </span>
            <span className="text-base text-gray-300 sm:text-lg">–</span>
            <span className={game.state !== "pre" && !game.home.winner ? "text-gray-400" : ""}>
              {game.home.score}
            </span>
          </div>
          <span className="text-center text-[10px] text-gray-400 sm:text-[11px]">{formatGameDate(game.dateISO)}</span>
        </div>
        {teamBlock(game.home)}
      </div>
      {(game.venue || game.attendance) && (
        <p className="mt-4 border-t border-gray-100 pt-3 text-center text-[11px] text-gray-400">
          {[game.venue, game.attendance ? `${game.attendance.toLocaleString("en-US")} attendance` : null]
            .filter(Boolean)
            .join(" · ")}
        </p>
      )}
    </div>
  );
}

function LineScore({ game }: { game: GameBox }) {
  const quarters = Math.max(game.away.linescores.length, game.home.linescores.length);
  if (quarters === 0) return null;
  const labels = Array.from({ length: quarters }, (_, index) => (index < 4 ? `Q${index + 1}` : `OT${index - 3}`));

  return (
    <div className="card mt-4 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
              <th scope="col" className="px-3 py-2 text-left font-semibold">Team</th>
              {labels.map((label) => (
                <th key={label} scope="col" className="px-2 py-2 text-center font-semibold tabular-nums">{label}</th>
              ))}
              <th scope="col" className="px-3 py-2 text-right font-semibold">T</th>
            </tr>
          </thead>
          <tbody>
            {[game.away, game.home].map((team) => (
              <tr key={team.side} className="border-b border-gray-50 last:border-0">
                <th scope="row" className="px-3 py-2 text-left font-semibold text-ink">
                  <span className="inline-flex items-center gap-2">
                    <TeamLogo abbr={team.key} size={18} />
                    {team.abbr}
                  </span>
                </th>
                {labels.map((_, index) => (
                  <td key={index} className="px-2 py-2 text-center text-gray-600 tabular-nums">
                    {team.linescores[index] ?? "–"}
                  </td>
                ))}
                <td className="px-3 py-2 text-right font-bold text-ink tabular-nums">{team.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TeamTabs({
  game,
  active,
  onChange,
}: {
  game: GameBox;
  active: "away" | "home";
  onChange: (side: "away" | "home") => void;
}) {
  const teams: BoxTeam[] = [game.away, game.home];
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    onChange(active === "away" ? "home" : "away");
  };

  return (
    <div
      role="tablist"
      aria-label="Team box scores"
      onKeyDown={onKeyDown}
      className="mt-6 flex gap-1 rounded-xl border border-gray-200 bg-white p-1"
    >
      {teams.map((team) => {
        const selected = team.side === active;
        return (
          <button
            key={team.side}
            role="tab"
            id={`tab-${team.side}`}
            aria-selected={selected}
            aria-controls={`panel-${team.side}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(team.side)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
              selected ? "bg-ink text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <TeamLogo abbr={team.key} size={20} />
            <span>{team.abbr}</span>
            <span className={`tabular-nums ${selected ? "text-white/70" : "text-gray-400"}`}>{team.score}</span>
          </button>
        );
      })}
    </div>
  );
}

type Column = {
  key: string;
  label: string;
  /** Responsive visibility, applied identically to header and body cells. */
  visibility?: string;
  highlight?: boolean;
  value: (player: BoxPlayer) => string;
};

const COLUMNS: Column[] = [
  { key: "min", label: "MIN", value: (p) => (p.minutes === null ? "–" : String(Math.round(p.minutes))) },
  { key: "pts", label: "PTS", highlight: true, value: (p) => String(p.points) },
  { key: "reb", label: "REB", value: (p) => String(p.rebounds) },
  { key: "ast", label: "AST", value: (p) => String(p.assists) },
  { key: "stl", label: "STL", visibility: "hidden md:table-cell", value: (p) => String(p.steals) },
  { key: "blk", label: "BLK", visibility: "hidden md:table-cell", value: (p) => String(p.blocks) },
  { key: "to", label: "TO", visibility: "hidden md:table-cell", value: (p) => String(p.turnovers) },
  { key: "fg", label: "FG", visibility: "hidden lg:table-cell", value: (p) => `${p.fgMade}-${p.fgAttempted}` },
  { key: "tp", label: "3PT", visibility: "hidden lg:table-cell", value: (p) => `${p.threeMade}-${p.threeAttempted}` },
  { key: "plus", label: "+/-", value: (p) => signed(p.plusMinus) },
  {
    key: "rtg",
    label: "RTG",
    value: (p) => (p.didNotPlay ? "–" : p.rating.toFixed(1)),
  },
];

function PlayerTable({ game, team }: { game: GameBox; team: BoxTeam }) {
  if (team.players.length === 0) {
    return (
      <div className="card mt-3 p-8 text-center">
        <p className="font-semibold text-ink">No box score yet</p>
        <p className="mt-1 text-sm text-gray-600">
          Player stats appear once this game tips off.
        </p>
      </div>
    );
  }

  const totals = team.totals;

  return (
    <div className="mt-3">
      {/* Desktop: aligned numeric table */}
      <div className="card hidden overflow-hidden sm:block">
        <table className="w-full text-sm">
          <caption className="sr-only">{team.name} player stats</caption>
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
              <th scope="col" className="px-4 py-2.5 text-left font-semibold">Player</th>
              {COLUMNS.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`w-12 whitespace-nowrap px-1.5 py-2.5 text-right font-semibold tabular-nums ${column.visibility ?? ""}`}
                >
                  {column.label}
                </th>
              ))}
              <th scope="col" className="w-7 px-1 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {team.players.map((player) => (
              <tr key={player.id} className="border-b border-gray-50 transition last:border-0 hover:bg-orange-50/40">
                <th scope="row" className="px-4 py-2 text-left font-normal">
                  <Link
                    href={`/game/player/?id=${game.id}&pid=${player.id}`}
                    className="flex items-center gap-2"
                  >
                    {player.starter && (
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-court"
                        title="Starter"
                        aria-label="Starter"
                      />
                    )}
                    <span className="font-semibold text-ink">{player.name}</span>
                    {player.position && (
                      <span className="text-[10px] uppercase text-gray-400">{player.position}</span>
                    )}
                  </Link>
                </th>
                {COLUMNS.map((column) => (
                  <td
                    key={column.key}
                    className={`whitespace-nowrap px-1.5 py-2 text-right tabular-nums ${column.visibility ?? ""} ${
                      column.highlight ? "font-bold text-ink" : "text-gray-600"
                    } ${player.didNotPlay ? "text-gray-300" : ""}`}
                  >
                    {player.didNotPlay ? (column.key === "min" ? "DNP" : "–") : column.value(player)}
                  </td>
                ))}
                <td className="px-1 py-2 text-right text-gray-300">
                  <Link href={`/game/player/?id=${game.id}&pid=${player.id}`} aria-label={`Open ${player.name}`}>
                    ›
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
          {totals && (
            <tfoot>
              <tr className="border-t border-gray-200 bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
                <th scope="row" className="px-4 py-2 text-left font-bold">Team</th>
                {COLUMNS.map((column) => {
                  const content: Record<string, string> = {
                    min: "–",
                    pts: String(totals.points),
                    reb: String(totals.rebounds),
                    ast: String(totals.assists),
                    stl: String(totals.steals),
                    blk: String(totals.blocks),
                    to: String(totals.turnovers),
                    fg: `${totals.fgMade}-${totals.fgAttempted}`,
                    tp: `${totals.threeMade}-${totals.threeAttempted}`,
                    plus: "–",
                    rtg: "–",
                  };
                  return (
                    <td
                      key={column.key}
                      className={`px-1.5 py-2 text-right tabular-nums ${column.visibility ?? ""} ${
                        column.highlight ? "font-bold text-ink" : ""
                      }`}
                    >
                      {content[column.key]}
                    </td>
                  );
                })}
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Mobile: same numbers, without horizontal scrolling */}
      <div className="space-y-2 sm:hidden">
        <div className="grid grid-cols-[1fr_repeat(4,2.5rem)] gap-1 px-3 text-[10px] uppercase tracking-wide text-gray-400">
          <span>Player</span>
          <span className="text-right">Pts</span>
          <span className="text-right">Reb</span>
          <span className="text-right">Ast</span>
          <span className="text-right">+/-</span>
        </div>
        {team.players.map((player) => (
          <Link
            key={player.id}
            href={`/game/player/?id=${game.id}&pid=${player.id}`}
            className="card grid grid-cols-[1fr_repeat(4,2.5rem)] items-center gap-1 px-3 py-2.5"
          >
            <span className="min-w-0">
              <span className="flex items-center gap-1.5">
                {player.starter && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-court" aria-hidden />}
                <span className="truncate text-sm font-semibold text-ink">{player.name}</span>
              </span>
              <span className="block text-[11px] text-gray-400">
                {player.didNotPlay
                  ? "DNP"
                  : `${player.minutes === null ? "–" : Math.round(player.minutes)} min · ${player.fgMade}-${player.fgAttempted} FG`}
              </span>
            </span>
            <span className="text-right text-sm font-bold tabular-nums text-ink">{player.didNotPlay ? "–" : player.points}</span>
            <span className="text-right text-sm tabular-nums text-gray-600">{player.didNotPlay ? "–" : player.rebounds}</span>
            <span className="text-right text-sm tabular-nums text-gray-600">{player.didNotPlay ? "–" : player.assists}</span>
            <span className="text-right text-sm tabular-nums text-gray-600">
              {player.didNotPlay ? "–" : signed(player.plusMinus)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function GameDetailView() {
  const params = useSearchParams();
  const gameId = params.get("id") ?? "";

  const [phase, setPhase] = useState<Phase>("loading");
  const [game, setGame] = useState<GameBox | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeSide, setActiveSide] = useState<"away" | "home">("away");

  useEffect(() => {
    if (!gameId) {
      setPhase("error");
      setErrorMessage("No game was selected. Open a card from the scoreboard.");
      return;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    // A game in progress keeps the page live; finished games are fetched once.
    const load = async (first: boolean) => {
      try {
        const result = await fetchGame(gameId);
        if (cancelled) return;
        setGame(result);
        if (first) {
          setActiveSide("away");
          document.title = `${result.away.abbr} ${result.away.score} - ${result.home.abbr} ${result.home.score} box score | NBA Tools`;
        }
        setPhase("ready");
        if (result.state === "in") timer = setTimeout(() => void load(false), 30_000);
      } catch (error) {
        if (cancelled || !first) return;
        setErrorMessage(error instanceof Error ? error.message : "Unknown error");
        setPhase("error");
      }
    };

    setPhase("loading");
    void load(true);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [gameId]);

  const activeTeam = useMemo<BoxTeam | null>(() => {
    if (!game) return null;
    return activeSide === "away" ? game.away : game.home;
  }, [game, activeSide]);

  if (phase === "loading") {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="h-8 w-40 animate-pulse rounded bg-gray-100" />
        <div className="mt-6 h-40 animate-pulse rounded-2xl bg-gray-100" />
        <div className="mt-4 h-24 animate-pulse rounded-2xl bg-gray-100" />
        <div className="mt-6 h-72 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  }

  if (phase === "error" || !game) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-ink">Box score unavailable</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-600">
          {errorMessage ?? "Something went wrong loading this game."}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try again
          </button>
          <Link href="/#scores" className="btn-ghost">
            Back to today&apos;s games
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="text-xs text-gray-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-court">Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/#scores" className="hover:text-court">Today&apos;s games</Link></li>
          <li aria-hidden>/</li>
          <li className="font-medium text-gray-700">{game.away.abbr} @ {game.home.abbr}</li>
        </ol>
      </nav>

      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        {game.away.name} at {game.home.name}
      </h1>

      <div className="mt-6">
        <ScoreHeader game={game} />
        <LineScore game={game} />
      </div>

      <TeamTabs game={game} active={activeSide} onChange={setActiveSide} />

      {activeTeam && (
        <div
          role="tabpanel"
          id={`panel-${activeSide}`}
          aria-labelledby={`tab-${activeSide}`}
          tabIndex={0}
          className="mt-4 outline-none focus-visible:ring-2 focus-visible:ring-orange-200"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-bold text-ink">
              {activeTeam.name} <span className="text-sm font-normal text-gray-500">box score</span>
            </h2>
            {activeTeam.totals && (
              <p className="text-xs text-gray-500">
                {activeTeam.totals.fgMade}-{activeTeam.totals.fgAttempted} FG (
                {Math.round((activeTeam.totals.fgMade / Math.max(1, activeTeam.totals.fgAttempted)) * 100)}%) ·{" "}
                {activeTeam.totals.threeMade}-{activeTeam.totals.threeAttempted} 3PT · {activeTeam.totals.turnovers} TO
              </p>
            )}
          </div>
          <PlayerTable game={game} team={activeTeam} />
        </div>
      )}

      <p className="mt-6 text-[11px] leading-relaxed text-gray-400">
        Tap any player for a rating, a written evaluation and the full stat line. Ratings are derived from a
        Hollinger-style game score rescaled to 0–10 — they are not official NBA ratings. Box scores come from{" "}
        <a
          href={`https://www.espn.com/nba/boxscore/_/gameId/${game.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-court hover:underline"
        >
          ESPN
        </a>
        .
      </p>
    </div>
  );
}
