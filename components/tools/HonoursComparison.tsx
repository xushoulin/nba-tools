"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import PlayerAvatar from "@/components/teams/PlayerAvatar";
import { teamColor } from "@/lib/team-assets";
import {
  CATEGORIES,
  HONOURS_BY_SLUG,
  HONOURS_META,
  HONOURS_PLAYERS,
  HONOURS_RETRIEVED,
  buildReport,
  buildRows,
  categoriesPresent,
  type CategoryId,
  type HonoursPlayer,
  type SortMode,
  SORT_LABELS,
} from "@/lib/honours";

const MAX_PLAYERS = 4;
const MIN_PLAYERS = 2;

function teamAbbr(id: string): string {
  return id.toUpperCase();
}

function yearsLabel(seasons: number[]): string {
  if (seasons.length === 0) return "—";
  if (seasons.length <= 4) return seasons.join(", ");
  return `${seasons[0]}–${seasons[seasons.length - 1]}`;
}

function PlayerBadge({ player, size = 26 }: { player: HonoursPlayer; size?: number }) {
  return <PlayerAvatar name={player.name} teamAbbr={teamAbbr(player.team)} size={size} espnId={player.id} />;
}

export default function HonoursComparison() {
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | "all">("all");
  const [onlyDiff, setOnlyDiff] = useState(false);
  const [sort, setSort] = useState<SortMode>("category");

  const hydrated = useRef(false);

  // Shareable links: /honours-comparison?players=lebron-james,kevin-durant
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("players");
    if (raw) {
      const slugs = raw
        .split(",")
        .map((slug) => slug.trim())
        .filter((slug) => HONOURS_BY_SLUG.has(slug))
        .slice(0, MAX_PLAYERS);
      if (slugs.length > 0) setSelected([...new Set(slugs)]);
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    const url = new URL(window.location.href);
    if (selected.length > 0) url.searchParams.set("players", selected.join(","));
    else url.searchParams.delete("players");
    window.history.replaceState(null, "", url.toString());
  }, [selected]);

  const players = useMemo(
    () =>
      selected
        .map((slug) => HONOURS_PLAYERS.find((p) => p.slug === slug))
        .filter((p): p is HonoursPlayer => Boolean(p)),
    [selected]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q
      ? HONOURS_PLAYERS.filter((p) => p.name.toLowerCase().includes(q))
      : HONOURS_PLAYERS;
    return pool.filter((p) => !selected.includes(p.slug)).slice(0, q ? 40 : 12);
  }, [query, selected]);

  const availableCategories = useMemo(() => categoriesPresent(players), [players]);

  useEffect(() => {
    if (categoryFilter === "all") return;
    if (!availableCategories.some((c) => c.id === categoryFilter)) setCategoryFilter("all");
  }, [availableCategories, categoryFilter]);

  useEffect(() => {
    if (categoryFilter === "all") return;
    if (!availableCategories.some((c) => c.id === categoryFilter)) setCategoryFilter("all");
  }, [availableCategories, categoryFilter]);

  const rows = useMemo(
    () => buildRows(players, { category: categoryFilter, onlyDiff, sort }),
    [players, categoryFilter, onlyDiff, sort]
  );

  const report = useMemo(() => (players.length >= MIN_PLAYERS ? buildReport(players) : null), [players]);

  const toggle = (slug: string) => {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= MAX_PLAYERS) return prev;
      return [...prev, slug];
    });
  };

  const ready = players.length >= MIN_PLAYERS;
  const noHonoursAtAll = ready && players.every((p) => p.total === 0);

  if (HONOURS_PLAYERS.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
        <p className="text-sm font-semibold text-ink">Honours data is unavailable right now.</p>
        <p className="mt-1 text-sm text-gray-500">
          The player award dataset could not be loaded. Reload the page, or browse{" "}
          <Link href="/teams" className="font-semibold text-orange-600 hover:underline">
            team pages
          </Link>{" "}
          in the meantime.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ---------------- picker ---------------- */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-ink">1. Pick players to compare</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Add {MIN_PLAYERS}–{MAX_PLAYERS} players. Award records are loaded from ESPN.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
              {players.length}/{MAX_PLAYERS} selected
            </span>
            {selected.length > 0 && (
              <button
                type="button"
                onClick={() => setSelected([])}
                className="text-xs font-semibold text-gray-500 underline-offset-2 hover:text-ink hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="relative">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search any of the 355 players…"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-9 text-sm outline-none transition focus:border-court focus:ring-2 focus:ring-court/20"
              />
              <span aria-hidden className="pointer-events-none absolute right-3 top-2 text-gray-400">
                ⌕
              </span>
            </div>

            <div className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-gray-200">
              {results.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-gray-500">
                  No players match “{query}”. Try another spelling — or clear the search to see the
                  most decorated players.
                </p>
              ) : (
                <div className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-2 sm:divide-y-0">
                  {results.map((p) => {
                    const disabled = selected.length >= MAX_PLAYERS;
                    return (
                      <button
                        key={p.slug}
                        type="button"
                        onClick={() => toggle(p.slug)}
                        disabled={disabled}
                        className="flex items-center gap-2 px-3 py-2 text-left transition hover:bg-orange-50/70 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <PlayerBadge player={p} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-ink">
                            {p.name}
                          </span>
                          <span className="block text-[11px] text-gray-500">
                            {teamAbbr(p.team)} · {p.pos}
                            {p.jersey ? ` · #${p.jersey}` : ""}
                          </span>
                        </span>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                            p.total > 0 ? "bg-gray-100 text-gray-700" : "bg-gray-50 text-gray-400"
                          }`}
                        >
                          {p.total > 0 ? `${p.total}🏅` : "—"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            {!query && (
              <p className="mt-1.5 text-[11px] text-gray-400">
                Showing the 12 most decorated players. Search to find anyone else.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50/70 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              In the comparison
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {players.length === 0 && (
                <p className="text-sm text-gray-500">
                  Nobody yet — pick two players on the left to start.
                </p>
              )}
              {players.map((p) => (
                <span
                  key={p.slug}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white py-1 pl-1 pr-2 text-xs font-semibold text-ink shadow-sm ring-1 ring-gray-200"
                >
                  <PlayerBadge player={p} size={20} />
                  <span className="max-w-[120px] truncate">{p.name}</span>
                  <button
                    type="button"
                    onClick={() => toggle(p.slug)}
                    aria-label={`Remove ${p.name}`}
                    className="text-gray-400 transition hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-200 pt-3">
              <button
                type="button"
                onClick={() => setSelected(HONOURS_PLAYERS.slice(0, 3).map((p) => p.slug))}
                className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-ink ring-1 ring-gray-200 transition hover:ring-court"
              >
                Load example
              </button>
              <button
                type="button"
                onClick={() => setSelected(HONOURS_PLAYERS.slice(0, 2).map((p) => p.slug))}
                className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-ink ring-1 ring-gray-200 transition hover:ring-court"
              >
                Top 2 only
              </button>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-gray-400">
              {selected.length > 0
                ? "The address bar now holds this matchup — copy the link to share it."
                : "Pick players and the URL updates, so a comparison can be shared."}
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- empty / not-ready states ---------------- */}
      {!ready && (
        <section className="rounded-xl border border-dashed border-gray-300 bg-gray-50/70 px-6 py-12 text-center">
          <div className="text-3xl">🏅</div>
          <p className="mt-3 text-sm font-semibold text-ink">
            {players.length === 0
              ? "No players selected yet"
              : `One more player needed to compare with ${players[0].name.split(" ").slice(-1)[0]}`}
          </p>
          <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
            A comparison needs at least {MIN_PLAYERS} players. Search above, or load the example
            to see how the report reads.
          </p>
        </section>
      )}

      {ready && (
        <>
          {/* ---------------- controls ---------------- */}
          <section className="flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-gray-100 py-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Category
              </span>
              <button
                type="button"
                onClick={() => setCategoryFilter("all")}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  categoryFilter === "all"
                    ? "bg-court text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {availableCategories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategoryFilter(c.id)}
                  title={c.competition}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    categoryFilter === c.id
                      ? "bg-court text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="ml-auto flex flex-wrap items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-gray-600">
                <input
                  type="checkbox"
                  checked={onlyDiff}
                  onChange={(e) => setOnlyDiff(e.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-court"
                />
                Only differences
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                Sort
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortMode)}
                  className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-semibold text-ink outline-none focus:border-court"
                >
                  {SORT_LABELS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          {/* ---------------- matrix ---------------- */}
          {noHonoursAtAll ? (
            <section className="rounded-xl border border-dashed border-gray-300 bg-gray-50/70 px-6 py-10 text-center">
              <p className="text-sm font-semibold text-ink">No honours on record</p>
              <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
                None of the selected players has an award recorded in the dataset — usually true
                for rookies and two-way contracts. Try a different player.
              </p>
            </section>
          ) : rows.length === 0 ? (
            <section className="rounded-xl border border-dashed border-gray-300 bg-gray-50/70 px-6 py-10 text-center">
              <p className="text-sm font-semibold text-ink">No rows match these filters</p>
              <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
                {onlyDiff
                  ? "These players share every honour they hold, so nothing is a difference. Turn off “Only differences” to see the full table."
                  : "Try another category — or reset the filter to All."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setCategoryFilter("all");
                  setOnlyDiff(false);
                }}
                className="mt-4 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-ink ring-1 ring-gray-300 transition hover:ring-court"
              >
                Reset filters
              </button>
            </section>
          ) : (
            <section>
              <div className="mb-2 flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-ink">2. Side-by-side honours</h2>
                <span className="text-[11px] text-gray-400">
                  Amber rows = one player has no record of it · bold + LEAD = higher count
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full min-w-[720px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="sticky left-0 z-20 min-w-[190px] border-b border-gray-200 bg-gray-50 px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                        Honour
                      </th>
                      {players.map((p) => (
                        <th
                          key={p.slug}
                          className="min-w-[150px] border-b border-gray-200 px-3 py-2 text-left align-bottom"
                        >
                          <div className="flex items-center gap-2">
                            <PlayerBadge player={p} size={30} />
                            <div className="min-w-0">
                              <Link
                                href={`/players/${p.slug}`}
                                className="block truncate text-sm font-bold text-ink hover:underline"
                              >
                                {p.name}
                              </Link>
                              <div className="text-[11px] font-medium text-gray-500">
                                {teamAbbr(p.team)} · {p.total} honours
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggle(p.slug)}
                              aria-label={`Remove ${p.name}`}
                              className="ml-auto text-gray-300 transition hover:text-red-500"
                            >
                              ×
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => {
                      const showHeader =
                        sort === "category" &&
                        (index === 0 || rows[index - 1].category.id !== row.category.id);
                      return (
                        <Fragment key={row.name}>
                          {showHeader && (
                            <tr className="bg-white">
                              <td
                                colSpan={players.length + 1}
                                className="sticky left-0 border-b border-gray-100 px-3 pb-1 pt-4 text-[11px] font-bold uppercase tracking-wide text-court"
                              >
                                {row.category.label}
                                <span className="ml-2 font-medium normal-case tracking-normal text-gray-400">
                                  {row.category.competition}
                                </span>
                              </td>
                            </tr>
                          )}
                          <tr
                            className={`border-b border-gray-100 transition ${
                              row.severity === "presence"
                                ? "bg-amber-50/70 hover:bg-amber-100/60"
                                : row.severity === "count"
                                  ? "hover:bg-gray-50"
                                  : "hover:bg-gray-50"
                            }`}
                          >
                            <td
                              className={`sticky left-0 z-10 px-3 py-2.5 font-medium ${
                                row.severity === "presence"
                                  ? "bg-amber-50/90 text-ink"
                                  : "bg-white text-gray-700"
                              }`}
                            >
                              <span className="flex items-center gap-1.5">
                                {row.severity === "presence" && (
                                  <span
                                    aria-hidden
                                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"
                                  />
                                )}
                                {row.name}
                              </span>
                            </td>
                            {row.cells.map((cell, i) => {
                              const isLeader = row.differs && cell !== null && cell.count === row.max;
                              return (
                                <td
                                  key={`${row.name}-${players[i].slug}`}
                                  className="px-3 py-2.5 align-top"
                                  title={
                                    cell
                                      ? `${players[i].name}: ${cell.count}× — ${cell.seasons.join(", ")}`
                                      : `${players[i].name}: no record`
                                  }
                                >
                                  {cell ? (
                                    <div className={isLeader ? "font-extrabold text-ink" : "text-gray-700"}>
                                      <div className="flex items-baseline gap-1.5">
                                        <span className="tabular-nums">{cell.count}×</span>
                                        {isLeader && (
                                          <span className="rounded bg-amber-200/70 px-1 text-[10px] font-bold uppercase text-amber-900">
                                            lead
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[11px] font-normal tabular-nums text-gray-500">
                                        {yearsLabel(cell.seasons)}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-gray-300">—</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        </Fragment>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-bold text-ink">
                      <td className="sticky left-0 z-10 bg-gray-50 px-3 py-3">Total honours</td>
                      {players.map((p) => (
                        <td key={p.slug} className="px-3 py-3 tabular-nums">
                          {p.total}
                          <span className="ml-1 text-[11px] font-normal text-gray-500">
                            ({p.types} types)
                          </span>
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                </table>
              </div>
              <p className="mt-1.5 text-[11px] text-gray-400 lg:hidden">
                Swipe the table sideways to see every player.
              </p>
            </section>
          )}

          {/* ---------------- report ---------------- */}
          {report && !noHonoursAtAll && (
            <section className="rounded-xl border border-gray-200 bg-gray-50/60 p-5 sm:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-bold text-ink">3. Comparison report</h2>
                <span className="text-[11px] text-gray-500">
                  {players.length} players · {new Set(rows.map((r) => r.name)).size} honour types in
                  view
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-gray-700">
                {report.leaders.length === 1 ? (
                  <>
                    <strong className="text-ink">{report.leaders[0].name}</strong> leads the group on
                    total honours with{" "}
                    <strong className="text-ink">{report.leaders[0].total}</strong>.
                  </>
                ) : report.leaders.length > 1 ? (
                  <>
                    <strong className="text-ink">
                      {report.leaders.map((p) => p.name).join(" and ")}
                    </strong>{" "}
                    are level at the top with{" "}
                    <strong className="text-ink">{report.leaders[0].total}</strong> honours each.
                  </>
                ) : (
                  <>None of the selected players has an honour on record.</>
                )}{" "}
                They share <strong className="text-ink">{report.shared.length}</strong> honour
                {report.shared.length === 1 ? "" : "s"} outright
                {report.exclusive.length > 0 && (
                  <>
                    , while{" "}
                    <strong className="text-ink">
                      {report.exclusive.reduce((sum, e) => sum + e.awards.length, 0)}
                    </strong>{" "}
                    honour{report.exclusive.reduce((sum, e) => sum + e.awards.length, 0) === 1 ? "" : "s"}{" "}
                    belong{report.exclusive.reduce((sum, e) => sum + e.awards.length, 0) === 1 ? "s" : ""}{" "}
                    to a single player
                  </>
                )}
                . Award records were retrieved on {HONOURS_RETRIEVED} and cover league honours
                plus college national awards — team championships are not part of the dataset.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {/* shared */}
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <h3 className="text-sm font-bold text-ink">Honours they share</h3>
                  {report.shared.length === 0 ? (
                    <p className="mt-2 text-sm text-gray-500">
                      No common honours yet — these résumés are built from entirely different awards.
                    </p>
                  ) : (
                    <ul className="mt-2 space-y-1.5">
                      {report.shared.slice(0, 8).map((row) => (
                        <li
                          key={row.name}
                          className="flex items-start justify-between gap-3 border-b border-gray-100 pb-1.5 last:border-0 last:pb-0"
                        >
                          <span className="text-sm text-gray-700">{row.name}</span>
                          <span className="shrink-0 text-xs tabular-nums text-gray-500">
                            {row.cells.map((c, i) => `${players[i].name.split(" ").slice(-1)} ${c?.count ?? 0}×`).join(" · ")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* differences */}
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <h3 className="text-sm font-bold text-ink">Core differences</h3>
                  <ul className="mt-2 space-y-2 text-sm leading-relaxed text-gray-700">
                    {report.exclusive.length === 0 && (
                      <li className="text-gray-500">
                        The selected players hold exactly the same set of honours — only the counts
                        differ.
                      </li>
                    )}
                    {report.exclusive.map(({ player, awards }) => (
                      <li key={player.slug}>
                        <span className="font-semibold text-ink">{player.name.split(" ").slice(-1)[0]}</span>{" "}
                        is the only one with{" "}
                        {awards
                          .slice(0, 3)
                          .map((a) => `${a.name} (${a.count}×)`)
                          .join(", ")}
                        {awards.length > 3 && ` +${awards.length - 3} more`}.
                      </li>
                    ))}
                    {report.biggestGap && (
                      <li>
                        <span className="font-semibold text-ink">Biggest single gap:</span>{" "}
                        {report.biggestGap.name} — {report.biggestGap.high.player.name.split(" ").slice(-1)[0]}{" "}
                        {report.biggestGap.high.count}× vs{" "}
                        {report.biggestGap.low.player.name.split(" ").slice(-1)[0]}{" "}
                        {report.biggestGap.low.count}×.
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* year distribution */}
              <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
                <h3 className="text-sm font-bold text-ink">Year distribution</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Honours won per calendar year, {report.timeline[0]?.span.from || "—"} to{" "}
                  {report.timeline[0]?.span.to || "—"}.
                </p>
                <div className="mt-3 space-y-2">
                  {report.timeline.map((t) => {
                    const max = Math.max(1, ...t.series.map((s) => s.count));
                    const years: number[] = [];
                    for (let y = t.span.from; y <= t.span.to; y++) years.push(y);
                    const map = new Map(t.series.map((s) => [s.year, s.count]));
                    return (
                      <div key={t.player.slug} className="flex items-center gap-3">
                        <span className="w-24 shrink-0 truncate text-xs font-semibold text-gray-700">
                          {t.player.name.split(" ").slice(-1)[0]}
                        </span>
                        <span className="flex flex-1 items-end gap-[2px]">
                          {years.map((y) => {
                            const count = map.get(y) ?? 0;
                            return (
                              <span
                                key={y}
                                title={count ? `${y}: ${count} honour${count === 1 ? "" : "s"}` : `${y}: —`}
                                className="flex-1 rounded-sm"
                                style={{
                                  height: count ? 4 + (count / max) * 20 : 2,
                                  backgroundColor: count ? teamColor(teamAbbr(t.player.team)) : "#e5e7eb",
                                  opacity: count ? 0.9 : 1,
                                }}
                              />
                            );
                          })}
                        </span>
                        <span className="w-36 shrink-0 text-right text-[11px] tabular-nums leading-tight text-gray-500">
                          {t.first ?? "—"}–{t.last ?? "—"}
                          {t.peak ? ` · peak ${t.peak.year} (${t.peak.count})` : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 flex justify-between text-[10px] tabular-nums text-gray-400">
                  <span>{report.timeline[0]?.span.from}</span>
                  <span>{report.timeline[0]?.span.to}</span>
                </div>
              </div>

              {/* counts by category */}
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <h3 className="text-sm font-bold text-ink">Volume by category</h3>
                  <div className="mt-2 space-y-1.5">
                    {players.map((p) => {
                      const byCat = CATEGORIES.map((c) => ({
                        c,
                        count: p.awards
                          .filter((a) => a.category.id === c.id)
                          .reduce((sum, a) => sum + a.count, 0),
                      })).filter((x) => x.count > 0);
                      return (
                        <div key={p.slug} className="text-xs">
                          <span className="font-semibold text-ink">{p.name.split(" ").slice(-1)[0]}</span>
                          <span className="ml-2 text-gray-500">
                            {byCat.length === 0
                              ? "no honours"
                              : byCat.map((x) => `${x.c.label} ${x.count}`).join(" · ")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <h3 className="text-sm font-bold text-ink">How to read this</h3>
                  <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-gray-600">
                    <li>· Counts are selections, not seasons — three All-NBA 1st Teams = 3×.</li>
                    <li>· Amber rows mark an honour the players do not hold equally.</li>
                    <li>· “Lead” tags the player with the most wins of that award.</li>
                    <li>· Categories follow the competition: NBA, NBA Finals, NCAA, and so on.</li>
                  </ul>
                </div>
              </div>

              <p className="mt-5 border-t border-gray-200 pt-3 text-[11px] leading-relaxed text-gray-500">
                For reference only — 仅供参考. Based on {HONOURS_META.source} award records
                retrieved {HONOURS_RETRIEVED}; award naming and coverage are the source&apos;s,
                and team championships, All-Star selections and All-NBA votes are not included.
              </p>
            </section>
          )}
        </>
      )}

      {!ready && players.length === 0 && (
        <p className="text-center text-xs text-gray-400">
          {HONOURS_PLAYERS.filter((p) => p.total > 0).length} players in the dataset have honours on
          record · categories: {CATEGORIES.slice(0, 5).map((c) => c.label).join(", ")} and more.
        </p>
      )}
    </div>
  );
}
