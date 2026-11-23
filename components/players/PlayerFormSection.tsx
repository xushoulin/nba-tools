"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import TeamLogo from "@/components/teams/TeamLogo";
import { gradeForRating } from "@/lib/game-detail";
import {
  clearPlayerFormCache,
  fetchPlayerForm,
  formatFormDate,
  formatFormDateLong,
  type FormAverages,
  type PlayerForm,
} from "@/lib/player-form";

type Phase = "idle" | "loading" | "ready" | "error";

type Props = {
  playerId: string;
  playerName: string;
  seasonLabel: string;
};

const CHART_HEIGHT = 96;

function signed(value: number, digits = 1): string {
  const rounded = Number(value.toFixed(digits));
  if (rounded === 0) return (0).toFixed(digits);
  return `${rounded > 0 ? "+" : ""}${rounded.toFixed(digits)}`;
}

function barTone(rating: number): string {
  if (rating >= 6) return "bg-orange-500";
  if (rating >= 4.5) return "bg-orange-300";
  return "bg-gray-300";
}

/* ------------------------------------------------------------------ bars --- */

function RatingBars({ form }: { form: PlayerForm }) {
  // The log is newest-first; read the run left to right so it ends on the most
  // recent game.
  const games = [...form.games].reverse();
  // One or two games would leave a 500px-wide axis carrying a single bar.
  const narrow = games.length <= 2;
  return (
    <div className={narrow ? "max-w-[240px]" : undefined}>
      <div className="flex items-end justify-between gap-2" style={{ height: CHART_HEIGHT }}>
        {games.map((game) => {
          const height = Math.max(6, Math.round((game.rating / 10) * CHART_HEIGHT));
          return (
            <div key={game.eventId} className="group flex h-full flex-1 flex-col justify-end">
              <span className="mb-1 text-center text-[11px] font-bold tabular-nums text-ink">
                {game.rating.toFixed(1)}
              </span>
              <div
                className={`mx-auto w-full max-w-[68px] rounded-t transition group-hover:opacity-80 ${barTone(game.rating)}`}
                style={{ height }}
                title={`${formatFormDateLong(game.dateISO)} ${game.home ? "vs" : "at"} ${
                  game.opponentAbbr
                } — ${game.rating.toFixed(1)}/10, ${gradeForRating(game.rating)}`}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex items-stretch justify-between gap-2 border-t border-gray-200 pt-2">
        {games.map((game) => (
          <div key={game.eventId} className="min-w-0 flex-1 text-center">
            <div className="truncate text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              {formatFormDate(game.dateISO)}
            </div>
            <div className="mt-0.5 flex items-center justify-center gap-1">
              <span
                className={`text-[11px] font-bold ${game.won ? "text-emerald-600" : "text-gray-400"}`}
              >
                {game.won ? "W" : "L"}
              </span>
              <span className="truncate text-[11px] font-semibold text-gray-600">
                {game.home ? "" : "@"}
                {game.opponentAbbr}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- tiles --- */

type Tile = {
  label: string;
  value: number | null;
  seasonValue: number | null;
  digits?: number;
  suffix?: string;
};

function DeltaTile({ tile, compare }: { tile: Tile; compare: boolean }) {
  const { label, value, seasonValue, digits = 1, suffix = "" } = tile;
  const diff = compare && value !== null && seasonValue !== null ? value - seasonValue : null;
  // A tenth of a point over five games is noise, not a trend.
  const meaningful = diff !== null && Math.abs(diff) >= 0.3;
  const up = meaningful && diff > 0;
  const down = meaningful && diff < 0;

  return (
    <div className="rounded-lg bg-gray-50 px-3 py-2.5">
      <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{label}</div>
      <div className="mt-0.5 flex items-baseline gap-1">
        <span className="text-xl font-extrabold tabular-nums text-ink">
          {value === null ? "—" : value.toFixed(digits)}
        </span>
        {suffix && <span className="text-[11px] font-semibold text-gray-400">{suffix}</span>}
      </div>
      {diff !== null ? (
        <div
          className={`mt-0.5 text-[11px] font-semibold tabular-nums ${
            up ? "text-emerald-600" : down ? "text-rose-600" : "text-gray-400"
          }`}
        >
          {up && <span aria-hidden>▲ </span>}
          {down && <span aria-hidden>▼ </span>}
          {signed(diff, digits)} vs season
        </div>
      ) : (
        <div className="mt-0.5 text-[11px] text-gray-400">season average</div>
      )}    </div>
  );
}

/* --------------------------------------------------------------- sentence --- */

function formSentence(recent: FormAverages, season: FormAverages | null): string {
  const line = `${recent.points.toFixed(1)} points, ${recent.rebounds.toFixed(1)} rebounds and ${recent.assists.toFixed(
    1,
  )} assists`;
  const shooting = recent.trueShooting !== null ? ` on ${recent.trueShooting.toFixed(1)}% true shooting` : "";

  if (recent.games === 1) {
    return `In this game he finished with ${line}${shooting}.`;
  }

  // Only compare against the season once there is a season wider than the run.
  const baseline =
    season && season.games > recent.games && season.trueShooting !== null
      ? `, against ${season.points.toFixed(1)} points on ${season.trueShooting.toFixed(1)}% for the season`
      : "";
  return `Over these ${recent.games} games he is averaging ${line}${shooting}${baseline}.`;
}

/* ------------------------------------------------------------------ body --- */

export default function PlayerFormSection({ playerId, playerName, seasonLabel }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [form, setForm] = useState<PlayerForm | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const started = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    setMounted(true);
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const load = useCallback(
    async (force = false) => {
      if (force) clearPlayerFormCache(playerId);
      setPhase((current) => (current === "ready" ? current : "loading"));
      try {
        const next = await fetchPlayerForm(playerId);
        if (!mountedRef.current) return;
        setForm(next);
        setErrorMessage(null);
        setPhase("ready");
      } catch (error) {
        if (!mountedRef.current) return;
        setErrorMessage(error instanceof Error ? error.message : "Unknown error");
        setPhase((current) => (current === "ready" ? current : "error"));
      } finally {
        if (mountedRef.current) setRefreshing(false);
      }
    },
    [playerId],
  );

  // Nothing is requested until the section is close to the viewport: the page
  // stays as cheap as it was before for visitors who never scroll this far.
  useEffect(() => {
    if (started.current) return;
    const node = sectionRef.current;
    if (!node) return;

    const begin = () => {
      if (started.current) return;
      started.current = true;
      void load();
    };

    if (typeof IntersectionObserver === "undefined") {
      begin();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          begin();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    void load(true);
  };

  const games = form?.games ?? [];
  const recent = form?.recent ?? null;
  const season = form?.season ?? null;
  const compare = recent !== null && season !== null && season.games > recent.games;
  const averageRating = recent?.rating ?? null;

  const tiles: Tile[] = [
    { label: "Points", value: recent?.points ?? null, seasonValue: season?.points ?? null },
    { label: "Rebounds", value: recent?.rebounds ?? null, seasonValue: season?.rebounds ?? null },
    { label: "Assists", value: recent?.assists ?? null, seasonValue: season?.assists ?? null },
    { label: "Minutes", value: recent?.minutes ?? null, seasonValue: season?.minutes ?? null },
  ];

  return (
    <section
      ref={sectionRef}
      id="form"
      aria-labelledby="recent-form-heading"
      className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-10"
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="recent-form-heading" className="text-2xl font-bold text-ink">
            Recent form
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {playerName}&apos;s latest {seasonLabel} games, read from the box scores in your
            browser. Ratings follow the same 0–10 scale as the game pages.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing || phase === "loading" || phase === "idle"}
          className="btn-ghost text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {refreshing ? "Updating…" : "Refresh"}
        </button>
      </div>

      <noscript>
        <div className="card p-6 text-sm leading-relaxed text-gray-600">
          The game log is fetched from ESPN in your browser, so it needs JavaScript. The
          season-by-season table above carries the same numbers in aggregate.
        </div>
      </noscript>

      {mounted && (phase === "idle" || phase === "loading") && (
        <div className="card animate-pulse p-6" aria-hidden>
          <div className="flex items-end gap-2" style={{ height: CHART_HEIGHT }}>
            {[62, 84, 40, 72, 55].map((height, i) => (
              <div key={i} className="flex-1 rounded-t bg-gray-200" style={{ height }} />
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-lg bg-gray-100" />
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-400">Loading the last five games…</p>
        </div>
      )}

      {phase === "error" && (
        <div className="card p-6">
          <p className="text-lg font-bold text-ink">Couldn&apos;t load recent games</p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
            The game log is fetched straight from ESPN in your browser. A network blocker, an
            offline connection or an ESPN outage will stop it — the rest of this page is
            unaffected.
          </p>
          <button type="button" onClick={onRefresh} className="btn-primary mt-4 text-sm">
            Try again
          </button>
          {errorMessage && !/reach ESPN/i.test(errorMessage) && (
            <p className="mt-3 text-[11px] text-gray-400">{errorMessage}</p>
          )}
        </div>
      )}

      {phase === "ready" && form && games.length === 0 && (
        <div className="card p-6">
          <p className="text-lg font-bold text-ink">No {seasonLabel} games on record yet.</p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
            ESPN&apos;s game log has nothing for {playerName} this season — either he has not
            appeared yet or the log has not been published. This section fills in on its own once
            he plays.
          </p>
        </div>
      )}

      {phase === "ready" && form && games.length > 0 && recent && (
        <div className="card overflow-hidden">
          <div className="grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Match rating
                </h3>
                {averageRating !== null && (
                  <span className="text-xs font-semibold text-gray-500">
                    {recent.games > 1 ? `${averageRating.toFixed(1)} average · ` : ""}
                    {gradeForRating(averageRating)}
                  </span>
                )}
              </div>
              <div className="mt-3">
                <RatingBars form={form} />
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Last {recent.games} {recent.games === 1 ? "game" : "games"} vs season
                </h3>
                <span className="text-xs font-semibold text-gray-500">
                  {season ? `${season.games} ${season.games === 1 ? "game" : "games"}` : "—"}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:grid-cols-2">
                {tiles.map((tile) => (
                  <DeltaTile key={tile.label} tile={tile} compare={compare} />
                ))}
              </div>
            </div>
          </div>

          <p className="px-6 pb-4 text-sm leading-7 text-gray-700">{formSentence(recent, season)}</p>

          <div className="overflow-x-auto border-t border-gray-100">
            <table className="w-full text-[13px] sm:min-w-[600px] sm:text-sm">
              <thead>
                <tr className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
                  <th className="px-2.5 py-2.5 text-left font-semibold sm:px-4">Date</th>
                  <th className="px-1.5 py-2.5 text-left font-semibold sm:px-2">Opponent</th>
                  <th className="px-1.5 py-2.5 text-left font-semibold sm:px-2">Result</th>
                  <th className="hidden px-2 py-2.5 text-right font-semibold sm:table-cell">MIN</th>
                  <th className="px-1 py-2.5 text-right font-semibold sm:px-2">PTS</th>
                  <th className="px-1 py-2.5 text-right font-semibold sm:px-2">REB</th>
                  <th className="px-1 py-2.5 text-right font-semibold sm:px-2">AST</th>
                  <th className="hidden px-2 py-2.5 text-right font-semibold sm:table-cell">+/−</th>
                  <th className="hidden px-2 py-2.5 text-right font-semibold md:table-cell">FG</th>
                  <th className="hidden px-2 py-2.5 text-right font-semibold md:table-cell">3P</th>
                  <th className="px-1.5 py-2.5 text-right font-semibold sm:px-4">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {games.map((game) => {
                  const href = `/game/player/?id=${game.eventId}&pid=${playerId}`;
                  return (
                    <tr key={game.eventId} className="transition hover:bg-orange-50/40">
                      <td className="whitespace-nowrap px-2.5 py-2.5 text-gray-500 sm:px-4">
                        <Link href={href} className="font-semibold text-gray-600 hover:underline">
                          {formatFormDate(game.dateISO)}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-1.5 py-2.5 sm:px-2">
                        <Link href={href} className="flex items-center gap-1 hover:underline sm:gap-1.5">
                          <TeamLogo
                            abbr={game.opponentKey ?? game.opponentAbbr.toLowerCase()}
                            size={18}
                          />
                          <span className="text-[11px] font-semibold text-gray-400">
                            {game.home ? "vs" : "@"}
                          </span>
                          <span className="font-semibold text-ink">{game.opponentAbbr}</span>
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-1.5 py-2.5 sm:px-2">
                        <span
                          className={`mr-1 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            game.won
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {game.won ? "W" : "L"}
                        </span>
                        <span className="hidden tabular-nums text-gray-600 sm:inline">
                          {game.teamScore}-{game.opponentScore}
                        </span>
                      </td>
                      <td className="hidden whitespace-nowrap px-2 py-2.5 text-right tabular-nums text-gray-600 sm:table-cell">
                        {Math.round(game.minutes)}
                      </td>
                      <td className="whitespace-nowrap px-1 py-2.5 text-right font-bold tabular-nums text-ink sm:px-2">
                        {game.points}
                      </td>
                      <td className="whitespace-nowrap px-1 py-2.5 text-right tabular-nums text-gray-600 sm:px-2">
                        {game.rebounds}
                      </td>
                      <td className="whitespace-nowrap px-1 py-2.5 text-right tabular-nums text-gray-600 sm:px-2">
                        {game.assists}
                      </td>
                      <td
                        className={`hidden whitespace-nowrap px-2 py-2.5 text-right tabular-nums sm:table-cell ${
                          game.plusMinus > 0
                            ? "text-emerald-600"
                            : game.plusMinus < 0
                              ? "text-rose-600"
                              : "text-gray-500"
                        }`}
                      >
                        {signed(game.plusMinus, 0)}
                      </td>
                      <td className="hidden whitespace-nowrap px-2 py-2.5 text-right tabular-nums text-gray-600 md:table-cell">
                        {game.fgMade}-{game.fgAttempted}
                      </td>
                      <td className="hidden whitespace-nowrap px-2 py-2.5 text-right tabular-nums text-gray-600 md:table-cell">
                        {game.threeMade}-{game.threeAttempted}
                      </td>
                      <td className="whitespace-nowrap px-1.5 py-2.5 text-right sm:px-4">
                        <Link
                          href={href}
                          className="inline-flex items-center gap-1.5 font-bold tabular-nums text-ink hover:underline"
                          aria-label={`Open the ${formatFormDateLong(game.dateISO)} game report for ${playerName}`}
                        >
                          {game.rating.toFixed(1)}
                          <span aria-hidden className="hidden text-[11px] text-gray-300 sm:inline">
                            →
                          </span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 px-6 py-3 text-[11px] text-gray-400">
            <span>
              Box scores from{" "}
              <a
                href="https://www.espn.com/nba/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-court hover:underline"
              >
                ESPN
              </a>
              , fetched in your browser
              {form ? ` at ${new Date(form.fetchedAt).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}` : ""}
              . Season averages are rebuilt from the same {form?.seasonGames ?? 0}-game log.
            </span>
            <span className="font-semibold text-gray-500">
              Open any game for the full report →
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
