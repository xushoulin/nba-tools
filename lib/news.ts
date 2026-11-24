import raw from "./data/nba-news.json";
import { INITIAL_TEAMS, type Team } from "./salary-data";

/**
 * The daily news section reads a snapshot written by scripts/news/build-news.mjs.
 *
 * Every item in that file already passed the attribution rules: a headline, a
 * summary, a publish time and an https://www.espn.com/ URL for the original
 * article. Nothing here re-publishes ESPN's text beyond the headline and the
 * standfirst, and every surface that shows an item also shows where it came from.
 */

export type NewsKind = "Story" | "HeadlineNews" | "Recap";

export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  published: string;
  updated: string;
  kind: NewsKind;
  /** Canonical URL of the original article on ESPN. */
  url: string;
  author: string | null;
  image: { url: string; alt: string; credit: string } | null;
  teams: string[];
  matchup: string | null;
};

type NewsFile = {
  source: { name: string; url: string; feed: string };
  generatedAt: string;
  count: number;
  items: NewsItem[];
};

const FILE = raw as unknown as NewsFile;

/** Publisher every item is credited to. Kept in one place so the UI cannot drift. */
export const NEWS_SOURCE = { name: FILE.source.name, url: FILE.source.url };

export const NEWS_GENERATED_AT = FILE.generatedAt;

export const NEWS_ITEMS: NewsItem[] = [...(FILE.items || [])].sort(
  (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime(),
);

export function newsSlugs(): string[] {
  return NEWS_ITEMS.map((item) => item.slug);
}

export function getNewsItem(slug: string): NewsItem | undefined {
  return NEWS_ITEMS.find((item) => item.slug === slug);
}

export function latestNews(limit: number): NewsItem[] {
  return NEWS_ITEMS.slice(0, limit);
}

/* ------------------------------------------------------------------ dates --- */

const ET = "America/New_York";

/**
 * Publishing day in US Eastern. An 11pm ET tip-off files after midnight UTC, so
 * grouping by the UTC date would put Sunday's game under Monday — the same trap
 * the game pages avoid.
 */
export function dayKeyET(iso: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: ET,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/** "Sunday, November 22, 2026" for a YYYY-MM-DD key, with no timezone drift. */
export function formatDayHeading(key: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${key}T12:00:00Z`));
}

/** "9:34 PM ET" */
export function formatTimeET(iso: string): string {
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: ET,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
  return `${time} ET`;
}

/** "Nov 22, 2026, 11:03 PM ET" */
export function formatDateTimeET(iso: string): string {
  const date = new Intl.DateTimeFormat("en-US", {
    timeZone: ET,
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
  return `${date}, ${formatTimeET(iso)}`;
}

/** Today's date in ET, for the client-side "Today" marker. */
export function todayKeyET(now: Date = new Date()): string {
  return dayKeyET(now.toISOString());
}

export type NewsDay = { key: string; heading: string; items: NewsItem[] };

/** Groups a sorted list into ET days, newest first, keeping item order. */
export function groupByDay(items: NewsItem[]): NewsDay[] {
  const days: NewsDay[] = [];
  for (const item of items) {
    const key = dayKeyET(item.published);
    const last = days[days.length - 1];
    if (last && last.key === key) last.items.push(item);
    else days.push({ key, heading: formatDayHeading(key), items: [item] });
  }
  return days;
}

/* ------------------------------------------------------------------ kinds --- */

export const KIND_META: Record<NewsKind, { label: string; className: string; note: string }> = {
  Story: {
    label: "Feature",
    className: "bg-violet-50 text-violet-700 ring-violet-200",
    note: "Reporting and analysis",
  },
  HeadlineNews: {
    label: "Report",
    className: "bg-sky-50 text-sky-700 ring-sky-200",
    note: "News report",
  },
  Recap: {
    label: "Game recap",
    className: "bg-orange-50 text-orange-700 ring-orange-200",
    note: "Wire recap",
  },
};

export function kindMeta(kind: string) {
  return KIND_META[kind as NewsKind] ?? KIND_META.HeadlineNews;
}

/* ------------------------------------------------------------------ teams --- */

const TEAM_BY_NAME = new Map(INITIAL_TEAMS.map((team) => [`${team.city} ${team.name}`, team]));

/** ESPN tags teams by full name, so no abbreviation mapping is needed. */
export function teamsForItem(item: NewsItem): Team[] {
  return item.teams.map((name) => TEAM_BY_NAME.get(name)).filter((t): t is Team => Boolean(t));
}

/**
 * Three more stories to read next: same team first, then anything published
 * around the same time, so the chain never dead-ends.
 */
export function relatedNews(item: NewsItem, limit = 3): NewsItem[] {
  const scored = NEWS_ITEMS.filter((other) => other.id !== item.id).map((other) => {
    const sharedTeams = other.teams.filter((t) => item.teams.includes(t)).length;
    const gapHours = Math.abs(new Date(other.published).getTime() - new Date(item.published).getTime()) / 36e5;
    return { other, score: sharedTeams * 100 - Math.min(gapHours, 72) };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.other);
}

/** Distinct teams that appear in the current snapshot, for the topic strip. */
export function teamsInNews(limit = 8): { team: Team; count: number }[] {
  const counts = new Map<string, number>();
  for (const item of NEWS_ITEMS) {
    for (const team of teamsForItem(item)) counts.set(team.id, (counts.get(team.id) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([id, count]) => ({ team: INITIAL_TEAMS.find((t) => t.id === id)!, count }))
    .filter((entry) => Boolean(entry.team))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/** Days covered by the snapshot, newest first — used by the archive jump list. */
export function newsDays(): NewsDay[] {
  return groupByDay(NEWS_ITEMS);
}
