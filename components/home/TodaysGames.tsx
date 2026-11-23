"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import TeamLogo from "@/components/teams/TeamLogo";
import {
  fetchScoreboard,
  formatDayLabel,
  formatShortDay,
  formatTipoff,
  localDayKey,
  localTimeZone,
  type Game,
  type GameTeam,
  type ScoreboardSnapshot,
} from "@/lib/nba-scoreboard";

type Phase = "loading" | "ready" | "error";

/** Live games refresh faster than the idle board. */
const LIVE_INTERVAL_MS = 20_000;
const IDLE_INTERVAL_MS = 60_000;

function statusStyles(state: Game["state"]): string {
  if (state === "in") return "bg-orange-50 text-orange-700 ring-1 ring-orange-200";
  if (state === "post") return "bg-gray-100 text-gray-600";
  return "bg-white text-gray-500 ring-1 ring-gray-200";
}

function TeamRow({ team, state }: { team: GameTeam; state: Game["state"] }) {
  const scored = state !== "pre" && team.score !== null;
  const name = (
    <span
      className={`truncate text-sm font-semibold ${
        state === "post" && !team.winner ? "text-gray-500" : "text-ink"
      }`}
    >
      {team.shortName}
    </span>
  );

  return (
    <div className="flex items-center gap-3 py-1">
      <TeamLogo abbr={team.key} size={26} eager />
      <span className="text-[11px] font-bold uppercase tracking-wide text-gray-400">{team.espnAbbr}</span>
      <div className="min-w-0 flex-1">
        {team.slug ? (
          <Link href={`/teams/${team.slug}`} className="block hover:text-court">
            {name}
          </Link>
        ) : (
          name
        )}
      </div>
      <span
        className={`w-9 text-right text-base font-bold tabular-nums ${
          state === "post" && !team.winner ? "text-gray-500" : "text-ink"
        } ${state === "in" ? "" : "opacity-100"}`}
      >
        {scored ? team.score : "–"}
      </span>
    </div>
  );
}

function GameCard({ game }: { game: Game }) {
  const live = game.state === "in";
  // The pill already says "Final", so only repeat the status when it carries
  // extra information such as "Final/OT".
  const detail =
    game.state === "pre"
      ? formatTipoff(game.tipoff)
      : game.statusDetail === "Final"
        ? null
        : game.statusDetail;
  const label =
    game.state === "post"
      ? `${game.away.name} ${game.away.score ?? 0}, ${game.home.name} ${game.home.score ?? 0}, ${game.statusDetail}`
      : game.state === "in"
        ? `${game.away.name} ${game.away.score ?? 0}, ${game.home.name} ${game.home.score ?? 0}, in progress, ${game.statusDetail}`
        : `${game.away.name} at ${game.home.name}, tips off ${formatTipoff(game.tipoff)}`;

  return (
    <article className={`card p-4 ${live ? "ring-1 ring-orange-200" : ""}`} aria-label={label}>
      <div className="flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${statusStyles(
            game.state,
          )}`}
        >
          {live && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" aria-hidden />}
          {game.state === "in" ? "Live" : game.state === "post" ? "Final" : "Scheduled"}
        </span>
        {detail && <span className="text-xs font-medium text-gray-500 tabular-nums">{detail}</span>}
      </div>

      <div className="mt-3 divide-y divide-gray-100">
        <TeamRow team={game.away} state={game.state} />
        <TeamRow team={game.home} state={game.state} />
      </div>

      <p className="mt-3 truncate text-[11px] text-gray-400">
        {game.state === "pre" ? "Tip-off " : ""}
        {formatTipoff(game.tipoff)}
        {game.venue ? ` · ${game.venue}` : ""}
        {game.broadcast ? ` · ${game.broadcast}` : ""}
      </p>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="card animate-pulse p-4" aria-hidden>
      <div className="flex items-center justify-between">
        <div className="h-4 w-20 rounded bg-gray-200" />
        <div className="h-3 w-12 rounded bg-gray-100" />
      </div>
      <div className="mt-4 space-y-3">
        {[0, 1].map((row) => (
          <div key={row} className="flex items-center gap-3">
            <div className="h-6 w-6 rounded bg-gray-100" />
            <div className="h-3 flex-1 rounded bg-gray-200" />
            <div className="h-4 w-6 rounded bg-gray-100" />
          </div>
        ))}
      </div>
      <div className="mt-4 h-3 w-32 rounded bg-gray-100" />
    </div>
  );
}

export default function TodaysGames() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [snapshot, setSnapshot] = useState<ScoreboardSnapshot | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [timeZone, setTimeZone] = useState<string>("");

  const snapshotRef = useRef<ScoreboardSnapshot | null>(null);
  const inFlight = useRef(false);
  const mounted = useRef(true);
  const requestId = useRef(0);

  useEffect(() => {
    snapshotRef.current = snapshot;
  }, [snapshot]);

  useEffect(() => {
    mounted.current = true;
    setDayKey(localDayKey(new Date()));
    setTimeZone(localTimeZone());
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    const id = (requestId.current += 1);
    try {
      const next = await fetchScoreboard(new Date());
      if (!mounted.current || id !== requestId.current) return;
      setSnapshot(next);
      setErrorMessage(null);
      setPhase("ready");
    } catch (error) {
      if (!mounted.current || id !== requestId.current) return;
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
      // Keep showing the last good board if a refresh fails; only fall back to
      // the error panel when there is nothing to show.
      setPhase(snapshotRef.current ? "ready" : "error");
    } finally {
      inFlight.current = false;
      if (mounted.current) setRefreshing(false);
    }
  }, []);

  // Poll on a self-rescheduling timer, pause while the tab is hidden, and
  // refresh immediately when the visitor comes back.
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    // A background tab must still do the first fetch — otherwise the section
    // sits on its skeleton until the visitor happens to focus the tab.
    let attempted = false;

    const schedule = () => {
      if (cancelled) return;
      const live = snapshotRef.current?.games.some((game) => game.state === "in") ?? false;
      timer = setTimeout(run, live ? LIVE_INTERVAL_MS : IDLE_INTERVAL_MS);
    };

    const run = async () => {
      if (cancelled) return;
      if (document.visibilityState === "hidden" && attempted) {
        schedule();
        return;
      }
      attempted = true;
      await load();
      schedule();
    };

    const onVisibility = () => {
      if (document.visibilityState !== "visible") return;
      if (timer) clearTimeout(timer);
      void run();
    };

    void run();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    void load();
  };

  const games = snapshot?.games ?? [];
  const liveCount = games.filter((game) => game.state === "in").length;
  const dayLabel = dayKey ? formatDayLabel(dayKey) : null;

  return (
    <section
      id="scores"
      aria-labelledby="today-games-heading"
      className="border-b border-gray-200 bg-gray-50"
    >
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 id="today-games-heading" className="text-2xl font-bold text-ink">
                Today&apos;s NBA games
              </h2>
              {liveCount > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-orange-700">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" aria-hidden />
                  {liveCount} live
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {dayLabel ?? "Your local date"}
              {timeZone ? ` · tip-off times in ${timeZone}` : ""}
              {phase === "ready" && snapshot ? " · auto-updates" : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing || phase === "loading"}
            className="btn-ghost disabled:cursor-not-allowed disabled:opacity-50"
          >
            {refreshing ? "Updating…" : "Refresh scores"}
          </button>
        </div>

        {phase === "loading" && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {phase === "error" && (
          <div className="card mt-6 p-8 text-center">
            <p className="text-lg font-bold text-ink">Couldn&apos;t load today&apos;s scores</p>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-gray-600">
              The live scoreboard is fetched straight from ESPN in your browser, so a network
              blocker, offline connection or a lookup outage will stop it. Nothing else on this
              page depends on it.
            </p>
            <button type="button" onClick={onRefresh} className="btn-primary mt-5" disabled={refreshing}>
              {refreshing ? "Retrying…" : "Try again"}
            </button>
            {errorMessage && (
              <p className="mt-4 text-[11px] text-gray-400" title={errorMessage}>
                {errorMessage}
              </p>
            )}
          </div>
        )}

        {phase === "ready" && games.length === 0 && (
          <div className="card mt-6 p-8">
            <p className="text-lg font-bold text-ink">
              No games scheduled{dayLabel ? ` for ${dayLabel}` : ""}.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              The NBA calendar has quiet days — the Finals, the All-Star break and the week around
              Christmas Eve are the usual ones. The board refreshes on its own, so this section will
              fill in as soon as the next slate tips off.
            </p>
            {snapshot && snapshot.next.length > 0 && (
              <div className="mt-5 border-t border-gray-100 pt-4">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Next up</p>
                <ul className="mt-2 space-y-1.5">
                  {snapshot.next.map((game) => (
                    <li key={game.id} className="text-sm text-gray-700">
                      <span className="font-semibold text-ink">
                        {game.away.espnAbbr} @ {game.home.espnAbbr}
                      </span>
                      <span className="text-gray-500">
                        {" "}
                        · {formatShortDay(game.tipoff)}, {formatTipoff(game.tipoff)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {phase === "ready" && games.length > 0 && (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
            <p className="mt-5 text-[11px] text-gray-400">
              Scores from{" "}
              <a
                href="https://www.espn.com/nba/scoreboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-court hover:underline"
              >
                ESPN
              </a>{" "}
              · refreshed in your browser
              {snapshot ? ` at ${new Date(snapshot.fetchedAt).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}` : ""}{" "}
              · live games poll every 20 seconds, otherwise every minute.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
