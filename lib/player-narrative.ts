// Generated narrative for player pages.
//
// The player page already renders the raw record (bio, awards, season table).
// What it lacked was prose: a page of tables alone reads as thin content to a
// search engine and gives a reader nothing to hold on to. Everything below is
// derived from the same dataset, so the numbers always agree with the tables and
// nothing has to be written by hand for 355 players.
//
// Wording is varied deterministically from the slug, so two pages with similar
// numbers still read differently without the build being non-deterministic.

import {
  PLAYER_PROFILES,
  ageAtSnapshot,
  type CareerLine,
  type PlayerProfile,
} from "./player-profiles";
import { LEAGUE, type Team } from "./salary-data";

export type Bucket = "Guard" | "Forward" | "Center";

export type NarrativeSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  table?: { head: string[]; rows: string[][] };
};

export type Comparable = {
  slug: string;
  name: string;
  pos: string;
  salary: number;
  years: number;
  ppg: number | null;
};

export type PlayerNarrative = {
  sections: NarrativeSection[];
  faqs: { q: string; a: string }[];
  comparables: Comparable[];
};

/* ------------------------------------------------------------------ */
/* league aggregates, computed once at module load                     */
/* ------------------------------------------------------------------ */

const ALL = Object.values(PLAYER_PROFILES);

export function bucketOf(pos: string): Bucket {
  if (pos.startsWith("C")) return "Center";
  if (pos.includes("G")) return "Guard";
  return "Forward";
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

const SALARY_BY_BUCKET: Record<Bucket, number[]> = { Guard: [], Forward: [], Center: [] };
const PPG_BY_BUCKET: Record<Bucket, number[]> = { Guard: [], Forward: [], Center: [] };

for (const p of ALL) {
  const b = bucketOf(p.pos);
  SALARY_BY_BUCKET[b].push(p.salary);
  if (p.career && p.career[2] > 0) PPG_BY_BUCKET[b].push(p.career[2]);
}

const MEDIAN_SALARY: Record<Bucket, number> = {
  Guard: median(SALARY_BY_BUCKET.Guard),
  Forward: median(SALARY_BY_BUCKET.Forward),
  Center: median(SALARY_BY_BUCKET.Center),
};

const MEDIAN_PPG: Record<Bucket, number> = {
  Guard: median(PPG_BY_BUCKET.Guard),
  Forward: median(PPG_BY_BUCKET.Forward),
  Center: median(PPG_BY_BUCKET.Center),
};

const SALARY_RANK_BY_BUCKET: Record<Bucket, number[]> = {
  Guard: [...SALARY_BY_BUCKET.Guard].sort((a, b) => b - a),
  Forward: [...SALARY_BY_BUCKET.Forward].sort((a, b) => b - a),
  Center: [...SALARY_BY_BUCKET.Center].sort((a, b) => b - a),
};

/** League norm for games played per logged season, used as the durability baseline. */
const GAMES_PER_SEASON_NORM = median(
  ALL.map((p) => {
    const rows = p.seasons.filter((s) => typeof s[2] === "number");
    if (rows.length === 0) return 0;
    return rows.reduce((sum, s) => sum + s[2], 0) / rows.length;
  }).filter((v) => v > 0),
);

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const POS_LABEL: Record<string, string> = {
  PG: "point guard",
  SG: "shooting guard",
  SF: "small forward",
  PF: "power forward",
  C: "center",
};

function money(v: number): string {
  return `$${v.toFixed(2)}M`;
}

function pct(v: number): string {
  return `${v.toFixed(1)}%`;
}

function signed(v: number): string {
  return `${v >= 0 ? "+" : ""}${v.toFixed(1)}`;
}

/** Deterministic RNG so wording varies by player but never between builds. */
function picker(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let state = h >>> 0;
  return function pick<T>(options: T[]): T {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return options[state % options.length];
  };
}

function seasonYear(season: string): number {
  return Number(season.slice(0, 4));
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
}

/** "2017: Rd 1, Pk 3 (BOS)" -> { year, round, pick } */
function parseDraft(draft: string | null): { year: number; round: number; pick: number } | null {
  if (!draft) return null;
  const year = Number(draft.slice(0, 4));
  const round = draft.match(/Rd\s*(\d+)/i)?.[1];
  const pick = draft.match(/Pk\s*(\d+)/i)?.[1];
  if (!round || !pick) return null;
  return { year, round: Number(round), pick: Number(pick) };
}

const PRESTIGE = [
  "MVP",
  "Finals MVP",
  "Defensive Player of the Year",
  "All-NBA 1st Team",
  "All-NBA 2nd Team",
  "All-NBA 3rd Team",
  "All-Defensive 1st Team",
  "All-Defensive 2nd Team",
  "Rookie of the Year",
  "Sixth Man of the Year",
  "Most Improved Player",
  "All-Rookie 1st Team",
  "All-Rookie 2nd Team",
];

function prestigeRank(name: string): number {
  const i = PRESTIGE.indexOf(name);
  return i === -1 ? PRESTIGE.length : i;
}

/* ------------------------------------------------------------------ */
/* narrative                                                           */
/* ------------------------------------------------------------------ */

export function playerNarrative(p: PlayerProfile, team: Team, fullName: string): PlayerNarrative {
  const pick = picker(p.slug);
  const bucket = bucketOf(p.pos);
  const posLabel = POS_LABEL[p.pos] ?? p.pos;
  const age = ageAtSnapshot(p.born);
  const seasons = p.seasons.filter((s) => typeof s[2] === "number");
  const logged = seasons.length;
  const firstSeason = seasons[0]?.[0] ?? null;
  const lastSeason = seasons[seasons.length - 1]?.[0] ?? null;
  const totalGames = seasons.reduce((sum, s) => sum + s[2], 0);
  const franchises = p.teams.length;
  const careerPpg = p.career?.[2] ?? null;
  const careerRpg = p.career?.[3] ?? null;
  const careerApg = p.career?.[4] ?? null;
  const last = seasons[seasons.length - 1] ?? null;
  const lastFg = last?.[7] ?? null;
  const lastTp = last?.[8] ?? null;

  const scoringSeasons = seasons.filter((s) => typeof s[4] === "number" && s[2] >= 20);
  const peak = scoringSeasons.reduce<CareerLine | null>(
    (best, s) => (best === null || (s[4] ?? 0) > (best[4] ?? 0) ? s : best),
    null,
  );

  const salaryRank = SALARY_RANK_BY_BUCKET[bucket].filter((v) => v > p.salary).length + 1;
  const bucketSize = SALARY_BY_BUCKET[bucket].length;
  const medianSalary = MEDIAN_SALARY[bucket];
  const medianPpg = MEDIAN_PPG[bucket];
  const capShare = (p.salary / LEAGUE.salaryCap) * 100;
  const teamRank =
    [...team.players].sort((a, b) => b.salary - a.salary).findIndex((x) => x.salary <= p.salary) + 1;
  const gamesPerSeason = logged > 0 ? totalGames / logged : 0;
  const remaining = p.salary * p.years;
  const draft = parseDraft(p.draft);
  const honours = p.awards.reduce((n, a) => n + a[1], 0);
  const topAward = [...p.awards].sort((a, b) => prestigeRank(a[0]) - prestigeRank(b[0]))[0] ?? null;
  const lastAwardYear = p.awards
    .flatMap((a) => a[2])
    .map((y) => Number(y))
    .filter((y) => Number.isFinite(y))
    .sort((a, b) => b - a)[0];

  /* ---------- career ---------- */
  const careerParagraphs: string[] = [];

  const span =
    firstSeason && lastSeason
      ? firstSeason === lastSeason
        ? `the ${firstSeason} season`
        : `${firstSeason} to ${lastSeason}`
      : null;
  const opener = [
    `${p.name} is a ${age ? `${age}-year-old ` : ""}${posLabel} for the ${fullName}.`,
    `${p.name} plays ${posLabel} for the ${fullName}${age ? ` and is ${age}` : ""}.`,
    `The ${fullName} roster lists ${p.name} at ${posLabel}${age ? `, aged ${age}` : ""}.`,
  ];
  const arc = [
    logged > 0
      ? ` His NBA record covers ${logged} ${logged === 1 ? "season" : "seasons"}${span ? `, ${span},` : ""} and ${totalGames} regular-season games across ${franchises} ${franchises === 1 ? "franchise" : "franchises"}.`
      : ` Season-by-season data is not available for him in this dataset, so the figures on this page come from his current contract only.`,
    logged > 0
      ? ` He has appeared in ${totalGames} regular-season games over ${logged} ${logged === 1 ? "season" : "seasons"}${span ? ` (${span})` : ""}, for ${franchises} ${franchises === 1 ? "franchise" : "franchises"}, at ${(totalGames / logged).toFixed(0)} games per season.`
      : ` His contract is the reliable part of the record here; season logs are not.`,
  ];
  careerParagraphs.push(`${pick(opener)}${pick(arc)}`);

  if (draft) {
    const draftLine =
      draft.round === 1
        ? ` He was the ${ordinal(draft.pick)} overall pick in ${draft.year}.`
        : ` He was taken in round ${draft.round} of the ${draft.year} draft, at pick ${draft.pick}.`;
    careerParagraphs.push(`${draftLine}${p.debut ? ` His first NBA season was ${p.debut}-${String((p.debut + 1) % 100).padStart(2, "0")}.` : ""}`);
  } else if (p.debut) {
    careerParagraphs.push(
      ` He entered the league in ${p.debut} without being drafted, which is why his first contract is not tied to the rookie scale.`,
    );
  }

  if (peak && careerPpg) {
    const gap = (peak[4] ?? 0) - careerPpg;
    const gapNote =
      Math.abs(gap) < 0.05
        ? `That matches his career average of ${careerPpg.toFixed(1)} points exactly, which happens when a single season is the whole sample.`
        : `That is ${gap > 0 ? `${gap.toFixed(1)} points above` : `${Math.abs(gap).toFixed(1)} points below`} his career average of ${careerPpg.toFixed(1)} points, which is the shape most careers take: one peak season, then a long plateau around a sustainable role.`;
    careerParagraphs.push(
      ` His best scoring season was ${peak[0]}, when he averaged ${peak[4]?.toFixed(1)} points, ${peak[5]?.toFixed(1)} rebounds and ${peak[6]?.toFixed(1)} assists in ${peak[2]} games for ${peak[1]}. ${gapNote}`,
    );
  }

  if (logged >= 2 && careerPpg) {
    const prev = seasons[seasons.length - 2];
    const prevPpg = prev?.[4] ?? null;
    if (prevPpg !== null && last?.[4] && prev[0] !== last[0]) {
      const delta = last[4] - prevPpg;
      const direction =
        Math.abs(delta) < 1
          ? "essentially flat"
          : delta > 0
            ? `up ${delta.toFixed(1)} points`
            : `down ${Math.abs(delta).toFixed(1)} points`;
      careerParagraphs.push(
        ` Year over year he is ${direction} from ${prev[0]} to ${last[0]}, at ${last[4].toFixed(1)} points per game. ${
          Math.abs(delta) < 1
            ? "A flat year at this stage is usually about role and minutes rather than a change in ability."
            : delta > 0
              ? "A jump that size normally reflects either more minutes or a real change in shot profile; the splits in the next block show which."
              : "A drop that size usually follows a reduction in minutes or usage, and the per-game table above shows whether the minutes moved with it."
        }`,
      );
    }
  }

  /* ---------- honours ---------- */
  const honourParagraphs: string[] = [];
  const honourBullets: string[] = [];

  if (honours > 0) {
    honourParagraphs.push(
      pick([
        `His record carries ${honours} league ${honours === 1 ? "honour" : "honours"} across ${p.awards.length} ${p.awards.length === 1 ? "category" : "categories"}.`,
        `${p.name} has ${honours} league ${honours === 1 ? "honour" : "honours"} on record, spread over ${p.awards.length} ${p.awards.length === 1 ? "award type" : "award types"}.`,
      ]),
    );
    if (topAward) {
      honourParagraphs.push(
        `The most significant is ${topAward[0]}${topAward[1] > 1 ? ` (${topAward[1]} times)` : ""}, first awarded in ${topAward[2][0]}${lastAwardYear && lastAwardYear !== Number(topAward[2][0]) ? `, with his most recent league recognition in ${lastAwardYear}` : ""}.`,
      );
    }
    honourBullets.push(
      `${honours} total honours, led by ${topAward?.[0] ?? "individual awards"}`,
      `Most recent recognition: ${lastAwardYear ?? "not recorded"}`,
      `${p.awards.length} distinct award categories on record`,
    );
  } else {
    honourParagraphs.push(
      `No league honours are recorded for ${p.name} in this dataset. That is not the same as having won nothing — the feed covers end-of-season awards and All-NBA, All-Defensive and All-Rookie teams, but not selections such as conference player of the week, and it does not include honours from outside the NBA.`,
    );
    honourParagraphs.push(
      `For a player in this position the case is made by role and durability rather than by a trophy list: ${logged > 0 ? `${totalGames} games across ${logged} ${logged === 1 ? "season" : "seasons"}` : "his current contract"} is the part of the record that a team is actually paying for.`,
    );
    honourBullets.push(
      `No end-of-season awards or All-NBA / All-Defensive selections in the source feed`,
      `${logged > 0 ? `${totalGames} career games` : "Career games not recorded"} as the measurable body of work`,
    );
  }

  /* ---------- contract ---------- */
  const diff = p.salary - medianSalary;
  const contractParagraphs: string[] = [];
  const salaryVerdict =
    Math.abs(diff) < 0.01
      ? `That is exactly the ${money(medianSalary)} median for ${bucket.toLowerCase()}s in this dataset — a market-rate deal by definition, with nothing to explain beyond the role.`
      : Math.abs(diff) < 1.5
      ? `That is within ${money(Math.abs(diff))} of the ${money(medianSalary)} median for ${bucket.toLowerCase()}s in this dataset, so the deal sits at the market rate for his position rather than at a premium or a discount.`
      : diff > 0
        ? `That is ${money(diff)} above the ${money(medianSalary)} median for ${bucket.toLowerCase()}s in this dataset, placing him ${ordinal(salaryRank)} of ${bucketSize} at the position by 2026-27 salary.`
        : `That is ${money(Math.abs(diff))} below the ${money(medianSalary)} median for ${bucket.toLowerCase()}s in this dataset, which usually means either a below-market extension, a rookie-scale deal, a minimum contract, or a deal signed after a down year.`;

  contractParagraphs.push(
    `His ${LEAGUE.season} salary is ${money(p.salary)}, or ${pct(capShare)} of the ${money(LEAGUE.salaryCap)} salary cap. ${salaryVerdict}`,
  );

  contractParagraphs.push(
    pick([
      `The contract runs ${p.years} more ${p.years === 1 ? "season" : "seasons"}, for roughly ${money(remaining)} in remaining salary. ${teamRank === 1 ? "He is the largest single line on the team's cap sheet." : `He is the ${ordinal(teamRank)} largest contract on the ${team.name} payroll.`}`,
      `With ${p.years} ${p.years === 1 ? "season" : "seasons"} left and about ${money(remaining)} still owed, he ranks ${ordinal(teamRank)} on the ${team.name} payroll. ${teamRank <= 3 ? "That makes him one of the contracts any trade construction has to account for first." : "That is a mid-roster number, which is the easiest kind of contract to move."}`,
    ]),
  );

  if (capShare > 25) {
    contractParagraphs.push(
      `At ${pct(capShare)} of the cap he is paid at or near the maximum tier, where the standard is not "good player" but "player who justifies a max slot". Contracts in this range are also the hardest to trade without taking back salary, because matching them requires either a second max player or several mid-sized deals.`,
    );
  } else if (capShare < 4) {
    contractParagraphs.push(
      `At ${pct(capShare)} of the cap the deal sits in the small-contract band: rookie-scale money, a minimum, or a room-exception signing. Contracts this size rarely block a trade on their own — they are usually the salary a team adds to make the matching rule work — and they are the easiest lines on a cap sheet to move.`,
    );
  }

  /* ---------- statistical profile ---------- */
  const profileParagraphs: string[] = [];
  const profileBullets: string[] = [];

  if (careerPpg !== null) {
    const vol = careerPpg - medianPpg;
    const volumeLabel =
      vol >= 6 ? "well above" : vol >= 2 ? "above" : vol > -2 ? "in line with" : "below";
    profileParagraphs.push(
      `Across his career he averages ${careerPpg.toFixed(1)} points, ${careerRpg?.toFixed(1) ?? "—"} rebounds and ${careerApg?.toFixed(1) ?? "—"} assists per game. That scoring rate is ${volumeLabel} the ${medianPpg.toFixed(1)} median for ${bucket.toLowerCase()}s here${vol >= 6 ? ", which is the profile of a primary option rather than a supporting one" : vol <= -4 ? ", which points to a low-usage role" : ""}.`,
    );
    profileBullets.push(
      `Scoring: ${careerPpg.toFixed(1)} ppg vs ${medianPpg.toFixed(1)} position median (${signed(vol)})`,
      `Rebounding: ${careerRpg?.toFixed(1) ?? "—"} rpg`,
      `Playmaking: ${careerApg?.toFixed(1) ?? "—"} apg`,
    );
  } else {
    profileParagraphs.push(
      logged > 0
        ? `Career averages are not published for ${p.name} in this dataset, so the statistical read here is limited to his most recent recorded season.`
        : `No career averages or season log are published for ${p.name} in this dataset — he is at the start of his career, so the contract table above is the reliable part of the record.`,
    );
  }

  if (last && lastFg !== null && totalGames >= 40) {
    const fgLabel = lastFg >= 50 ? "efficient" : lastFg >= 45 ? "around league average" : "below average";
    const tpText =
      lastTp !== null && lastTp !== undefined
        ? ` and ${lastTp.toFixed(1)}% from three on the same log`
        : "";
    profileParagraphs.push(
      `In ${last[0]} he shot ${lastFg.toFixed(1)}% from the field${tpText}. A field-goal mark in that range is ${fgLabel} for a ${posLabel}, and it matters more than raw points when judging whether the scoring is repeatable: a high-volume scorer at ${lastFg.toFixed(1)}% is generating shots his team has to live with, while the same volume at 55% is a different contract entirely.`,
    );
    profileBullets.push(`Last recorded season: ${last[0]}, ${last[4]?.toFixed(1)} ppg on ${lastFg.toFixed(1)}% FG`);
  }

  if (logged >= 2 && totalGames >= 40) {
    const gapToNorm = gamesPerSeason - GAMES_PER_SEASON_NORM;
    const durability =
      Math.abs(gapToNorm) < 4
        ? `in line with the league norm of ${GAMES_PER_SEASON_NORM.toFixed(0)} games per season for players in this dataset`
        : gapToNorm > 0
          ? `above the league norm of ${GAMES_PER_SEASON_NORM.toFixed(0)} games per season`
          : `below the league norm of ${GAMES_PER_SEASON_NORM.toFixed(0)} games per season`;
    profileParagraphs.push(
      `Availability is ${gamesPerSeason.toFixed(0)} games per season across his record, ${durability}. Any projection of his value should be multiplied by that rate rather than by a full 82-game season, because the difference between 60 and 75 games is roughly a fifth of a season's production.`,
    );
  }

  if (profileParagraphs.length === 0) {
    profileParagraphs.push(
      `There is not enough of a sample to profile him: ${totalGames} career ${totalGames === 1 ? "game" : "games"} is below the point where per-game rates stabilise, so any efficiency read would say more about the sample than about the player.`,
    );
  }

  /* ---------- comparables ---------- */
  const comparables: Comparable[] = ALL.filter(
    (x) => x.slug !== p.slug && bucketOf(x.pos) === bucket,
  )
    .sort((a, b) => Math.abs(a.salary - p.salary) - Math.abs(b.salary - p.salary))
    .slice(0, 4)
    .map((x) => ({
      slug: x.slug,
      name: x.name,
      pos: x.pos,
      salary: x.salary,
      years: x.years,
      ppg: x.career?.[2] ?? null,
    }));

  const comparisonRows = comparables.map((c) => [
    c.name,
    c.pos,
    money(c.salary),
    `${c.years} yr`,
    c.ppg !== null ? c.ppg.toFixed(1) : "—",
    `${c.salary > p.salary ? "+" : "−"}${money(Math.abs(c.salary - p.salary)).replace("$", "")}`,
  ]);

  const sections: NarrativeSection[] = [
    {
      id: "career-read",
      heading: "Career read",
      paragraphs: careerParagraphs,
    },
    {
      id: "honours-read",
      heading: "Honours in context",
      paragraphs: honourParagraphs,
      bullets: honourBullets,
    },
    {
      id: "salary-read",
      heading: `Where the ${LEAGUE.season} salary sits`,
      paragraphs: contractParagraphs,
      table: {
        head: ["Measure", "Value"],
        rows: [
          [`${LEAGUE.season} salary`, money(p.salary)],
          [`${bucket} median salary`, money(medianSalary)],
          [`Rank among ${bucket.toLowerCase()}s`, `${ordinal(salaryRank)} of ${bucketSize}`],
          ["Share of salary cap", pct(capShare)],
          [`${team.name} payroll rank`, `${ordinal(teamRank)}`],
          ["Seasons remaining", `${p.years}`],
          ["Remaining salary", money(remaining)],
        ],
      },
    },
    {
      id: "stat-read",
      heading: "Statistical profile",
      paragraphs: profileParagraphs,
      bullets: profileBullets,
    },
  ];

  if (comparables.length > 0) {
    sections.push({
      id: "comparable-contracts",
      heading: "Comparable contracts",
      paragraphs: [
        `The ${bucket.toLowerCase()}s closest to him on 2026-27 salary, with their career scoring average for scale. Salary proximity is not the same as similarity as a player, but it is the quickest way to see what the market pays for this role.`,
      ],
      table: {
        head: ["Player", "Pos", `${LEAGUE.season} salary`, "Years left", "Career PPG", "Salary gap"],
        rows: comparisonRows,
      },
    });
  }

  /* ---------- faqs ---------- */
  const faqs = [
    {
      q: `How much does ${p.name} make in ${LEAGUE.season}?`,
      a: `${money(p.salary)}, which is ${pct(capShare)} of the ${money(LEAGUE.salaryCap)} salary cap, with ${p.years} ${p.years === 1 ? "season" : "seasons"} remaining on the contract and about ${money(remaining)} still owed.`,
    },
    {
      q: `How many seasons has ${p.name} played in the NBA?`,
      a:
        logged > 0
          ? `${logged} ${logged === 1 ? "season" : "seasons"}${firstSeason ? `, from ${firstSeason} to ${lastSeason}` : ""}, covering ${totalGames} regular-season games for ${franchises} ${franchises === 1 ? "franchise" : "franchises"}.`
          : `Season records are not available for him in this dataset${p.debut ? `; he entered the league in ${p.debut}` : ""}.`,
    },
    {
      q: `What awards has ${p.name} won?`,
      a:
        honours > 0
          ? `${honours} league ${honours === 1 ? "honour" : "honours"} on record, led by ${topAward?.[0] ?? "individual awards"}${topAward && topAward[1] > 1 ? ` (${topAward[1]} times)` : ""}.`
          : `No end-of-season awards, All-NBA or All-Defensive selections are recorded for him in the ESPN-based dataset behind this page.`,
    },
    {
      q: `What is ${p.name}'s career scoring average?`,
      a:
        careerPpg !== null
          ? `${careerPpg.toFixed(1)} points per game, with ${careerRpg?.toFixed(1) ?? "—"} rebounds and ${careerApg?.toFixed(1) ?? "—"} assists, over ${totalGames} games.`
          : `Career averages are not recorded for him in this dataset.`,
    },
  ];

  return { sections, faqs, comparables };
}
