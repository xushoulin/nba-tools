// Honours comparison model: classifies ESPN award names into categories,
// shapes players for the comparison table and computes the report data.

import raw from "./data/honours.json";

export type CategoryId =
  | "mvp"
  | "finals-mvp"
  | "conference-mvp"
  | "all-nba"
  | "all-defensive"
  | "all-rookie"
  | "all-star-mvp"
  | "annual"
  | "cup"
  | "college"
  | "other";

export type Category = {
  id: CategoryId;
  label: string;
  /** Competition the honour is awarded in. */
  competition: string;
  order: number;
};

export const CATEGORIES: Category[] = [
  { id: "mvp", label: "Regular-season MVP", competition: "NBA regular season", order: 1 },
  { id: "finals-mvp", label: "Finals MVP", competition: "NBA Finals", order: 2 },
  { id: "all-nba", label: "All-NBA Team", competition: "NBA regular season", order: 3 },
  { id: "all-defensive", label: "All-Defensive Team", competition: "NBA regular season", order: 4 },
  { id: "all-rookie", label: "All-Rookie Team", competition: "NBA regular season", order: 5 },
  { id: "all-star-mvp", label: "All-Star Game MVP", competition: "NBA All-Star Weekend", order: 6 },
  { id: "conference-mvp", label: "Conference Finals MVP", competition: "NBA playoffs", order: 7 },
  { id: "annual", label: "Annual awards", competition: "NBA", order: 8 },
  { id: "cup", label: "NBA Cup", competition: "NBA in-season tournament", order: 9 },
  { id: "college", label: "College national", competition: "NCAA", order: 10 },
  { id: "other", label: "Other honours", competition: "Various", order: 11 },
];

const CATEGORY_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));

export function category(id: CategoryId): Category {
  return CATEGORY_BY_ID.get(id) ?? CATEGORIES[CATEGORIES.length - 1];
}

/** Order matters: the most specific patterns are tested first. */
const RULES: { id: CategoryId; test: RegExp }[] = [
  { id: "cup", test: /nba cup|in-season tournament/i },
  { id: "conference-mvp", test: /conference finals mvp/i },
  { id: "all-star-mvp", test: /all-star mvp/i },
  { id: "finals-mvp", test: /finals mvp/i },
  { id: "mvp", test: /\bmvp\b/i },
  { id: "all-nba", test: /all-nba|all-aba/i },
  { id: "all-defensive", test: /all-defensive/i },
  { id: "all-rookie", test: /all-rookie/i },
  { id: "college", test: /all-american/i },
  { id: "college", test: /wooden|naismith|ap player of the year|nabc player of the year/i },
  { id: "college", test: /erving award|malone award|abdul-jabbar award|cousy award|west award|final four/i },
  {
    id: "annual",
    test: /rookie of the year|defensive player of the year|most improved|sixth man|clutch player|teammate of the year/i,
  },
];

export function categoryOf(awardName: string): CategoryId {
  for (const rule of RULES) if (rule.test.test(awardName)) return rule.id;
  return "other";
}

export type Award = {
  name: string;
  count: number;
  /** Seasons as four-digit years, ascending. */
  seasons: number[];
  category: Category;
  latest: number | null;
};

export type HonoursPlayer = {
  id: number;
  slug: string;
  name: string;
  /** Internal team id, e.g. "phi". */
  team: string;
  pos: string;
  jersey: string | null;
  awards: Award[];
  /** Total honours (sum of award counts). */
  total: number;
  /** Distinct award types. */
  types: number;
  first: number | null;
  last: number | null;
};

type RawPlayer = {
  i: number;
  s: string;
  n: string;
  t: string;
  p: string;
  j: string | null;
  a: [string, number, string[]][];
};

const DATA = raw as unknown as { meta: { source: string; retrieved: string }; players: RawPlayer[] };

export const HONOURS_META = DATA.meta;

/** "2026-11-19" -> "19 November 2026". */
export const HONOURS_RETRIEVED = (() => {
  const date = new Date(`${DATA.meta.retrieved}T00:00:00`);
  if (Number.isNaN(date.getTime())) return DATA.meta.retrieved;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
})();

export const HONOURS_PLAYERS: HonoursPlayer[] = DATA.players.map((p) => {
  const awards: Award[] = p.a.map(([name, count, seasons]) => {
    const years = seasons
      .map((s) => Number(String(s).slice(0, 4)))
      .filter((n) => Number.isFinite(n) && n > 1900)
      .sort((a, b) => a - b);
    return {
      name,
      count,
      seasons: years,
      category: category(categoryOf(name)),
      latest: years.length ? years[years.length - 1] : null,
    };
  });
  const allYears = awards.flatMap((a) => a.seasons);
  return {
    id: p.i,
    slug: p.s,
    name: p.n,
    team: p.t,
    pos: p.p,
    jersey: p.j,
    awards,
    total: awards.reduce((sum, a) => sum + a.count, 0),
    types: awards.length,
    first: allYears.length ? Math.min(...allYears) : null,
    last: allYears.length ? Math.max(...allYears) : null,
  };
});

export const HONOURS_BY_SLUG = new Map(HONOURS_PLAYERS.map((p) => [p.slug, p]));

/** Categories that actually appear in a selection of players. */
export function categoriesPresent(players: HonoursPlayer[]): Category[] {
  const present = new Set<CategoryId>();
  for (const p of players) for (const a of p.awards) present.add(a.category.id);
  return CATEGORIES.filter((c) => present.has(c.id));
}

export type SortMode = "category" | "count" | "name" | "recent";

export const SORT_LABELS: { id: SortMode; label: string }[] = [
  { id: "category", label: "Category" },
  { id: "count", label: "Most wins" },
  { id: "name", label: "A → Z" },
  { id: "recent", label: "Most recent" },
];

export type Row = {
  name: string;
  category: Category;
  /** One entry per compared player (null when they never won it). */
  cells: (Award | null)[];
  /** Highest count in the row. */
  max: number;
  /** Sum across players. */
  total: number;
  /** True when the players do not all hold the same number of wins. */
  differs: boolean;
  /**
   * How the row differs: one or more players have no record at all ("presence"),
   * or everyone holds it but the counts differ ("count").
   */
  severity: "presence" | "count" | null;
  latest: number | null;
};

export function buildRows(
  players: HonoursPlayer[],
  opts: { category: CategoryId | "all"; onlyDiff: boolean; sort: SortMode }
): Row[] {
  const names = new Map<string, (Award | null)[]>();
  players.forEach((p, index) => {
    for (const award of p.awards) {
      const cells = names.get(award.name) ?? new Array(players.length).fill(null);
      cells[index] = award;
      names.set(award.name, cells);
    }
  });

  const rows: Row[] = [...names.entries()].map(([name, cells]) => {
    const counts = cells.map((c) => c?.count ?? 0);
    const max = Math.max(...counts);
    const min = Math.min(...counts);
    const missing = cells.some((c) => c === null);
    return {
      name,
      category: (cells.find(Boolean) as Award).category,
      cells,
      max,
      total: counts.reduce((a, b) => a + b, 0),
      differs: max !== min,
      severity: max === min ? null : missing ? "presence" : "count",
      latest: Math.max(...cells.map((c) => c?.latest ?? 0)) || null,
    };
  });

  const filtered = rows.filter(
    (r) => (opts.category === "all" || r.category.id === opts.category) && (!opts.onlyDiff || r.differs)
  );

  const sorted = [...filtered];
  switch (opts.sort) {
    case "count":
      sorted.sort((a, b) => b.max - a.max || b.total - a.total || a.name.localeCompare(b.name));
      break;
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "recent":
      sorted.sort((a, b) => (b.latest ?? 0) - (a.latest ?? 0) || a.name.localeCompare(b.name));
      break;
    default:
      sorted.sort(
        (a, b) =>
          a.category.order - b.category.order ||
          b.max - a.max ||
          a.name.localeCompare(b.name)
      );
  }
  return sorted;
}

export type YearPoint = { year: number; count: number };

/** Honours per calendar year, for the report's distribution chart. */
export function yearSeries(player: HonoursPlayer): YearPoint[] {
  const byYear = new Map<number, number>();
  for (const award of player.awards) {
    for (const year of award.seasons) byYear.set(year, (byYear.get(year) ?? 0) + 1);
  }
  return [...byYear.entries()]
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year - b.year);
}

export type Report = {
  totals: { player: HonoursPlayer; total: number; types: number }[];
  leaders: HonoursPlayer[];
  shared: Row[];
  exclusive: { player: HonoursPlayer; awards: Award[] }[];
  biggestGap: { name: string; high: { player: HonoursPlayer; count: number }; low: { player: HonoursPlayer; count: number } } | null;
  timeline: {
    player: HonoursPlayer;
    first: number | null;
    last: number | null;
    peak: YearPoint | null;
    series: YearPoint[];
    span: { from: number; to: number };
  }[];
  withHonours: number;
};

export function buildReport(players: HonoursPlayer[]): Report {
  const rows = buildRows(players, { category: "all", onlyDiff: false, sort: "category" });
  const totals = players.map((p) => ({ player: p, total: p.total, types: p.types }));
  const topTotal = Math.max(...totals.map((t) => t.total));
  const leaders = totals.filter((t) => t.total === topTotal && t.total > 0).map((t) => t.player);

  const shared = rows.filter((r) => r.cells.every((c) => c !== null)).sort((a, b) => b.total - a.total);

  const exclusive = players
    .map((player, index) => ({
      player,
      awards: players.length
        ? rows
            .filter((r) => r.cells[index] !== null && r.cells.every((c, i) => i === index || c === null))
            .map((r) => r.cells[index] as Award)
            .sort((a, b) => b.count - a.count)
        : [],
    }))
    .filter((e) => e.awards.length > 0);

  let biggestGap: Report["biggestGap"] = null;
  for (const row of rows) {
    if (!row.differs) continue;
    const counts = row.cells.map((c) => c?.count ?? 0);
    const hi = counts.indexOf(Math.max(...counts));
    const lo = counts.indexOf(Math.min(...counts));
    const gap = counts[hi] - counts[lo];
    if (!biggestGap || gap > biggestGap.high.count - biggestGap.low.count) {
      biggestGap = {
        name: row.name,
        high: { player: players[hi], count: counts[hi] },
        low: { player: players[lo], count: counts[lo] },
      };
    }
  }

  const years = players.flatMap((p) => [p.first, p.last]).filter((y): y is number => y !== null);
  const from = years.length ? Math.min(...years) : 0;
  const to = years.length ? Math.max(...years) : 0;

  const timeline = players.map((p) => {
    const series = yearSeries(p);
    const peak = series.reduce<YearPoint | null>(
      (best, point) => (!best || point.count > best.count ? point : best),
      null
    );
    return { player: p, first: p.first, last: p.last, peak, series, span: { from, to } };
  });

  return {
    totals,
    leaders,
    shared,
    exclusive,
    biggestGap,
    timeline,
    withHonours: players.filter((p) => p.total > 0).length,
  };
}
