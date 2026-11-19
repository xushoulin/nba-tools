// Compress the raw ESPN payloads into lib/data/players.json (with duplicate
// listings collapsed to one canonical player page).
import fs from "node:fs";
import path from "node:path";

const PROJ = process.cwd();
const raw = JSON.parse(
  fs.readFileSync(path.join(PROJ, "scripts", "players", ".raw", "players.raw.json"), "utf8")
);

const key = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['\u2019.]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const slugify = (s) => key(s).replace(/\s+/g, "-");

const teamNames = {};
const teamAbbrById = {};

function parseStats(stats) {
  if (!stats) return { seasons: [], career: null };
  for (const t of Object.values(stats.teams || {})) {
    teamAbbrById[t.id] = t.abbreviation;
    teamNames[t.abbreviation] = t.displayName;
  }
  const cat = (stats.categories || []).find((c) => c.name === "averages");
  if (!cat) return { seasons: [], career: null };

  const num = (v) => {
    if (v === undefined || v === null || v === "") return null;
    const n = Number(String(v).split("-")[0]);
    return Number.isFinite(n) ? n : null;
  };

  const seasons = [];
  for (const row of cat.statistics || []) {
    const s = row.stats || [];
    const gp = Number(s[0]) || 0;
    if (!gp) continue;
    seasons.push([
      row.season?.displayName || String(row.season?.year || ""),
      teamAbbrById[row.teamId] || "—",
      gp,
      num(s[2]),
      num(s[17]),
      num(s[11]),
      num(s[12]),
      num(s[4]),
      num(s[6]),
    ]);
  }
  seasons.sort((a, b) => (a[0] < b[0] ? -1 : 1));

  let career = null;
  const tot = cat.totals || [];
  if (tot.length) {
    const n = (i) => (tot[i] === undefined ? null : Number(tot[i]) || null);
    career = [n(0), n(2), n(17), n(11), n(12)];
  }
  return { seasons, career };
}

function buildProfile(m) {
  const d = raw.details[m.espnId] || {};
  const a = d.athlete?.athlete || {};
  const bio = d.bio || {};
  const { seasons, career } = parseStats(d.stats);

  const awards = (bio.awards || [])
    .filter((aw) => aw.seasons?.length)
    .map((aw) => [aw.name, aw.seasons.length, aw.seasons.slice().sort()])
    .sort((x, y) => y[1] - x[1]);

  return {
    id: Number(m.espnId),
    name: m.name,
    jersey: m.jersey || a.jersey || null,
    pos: m.pos,
    team: m.abbr.toLowerCase(),
    salary: m.salary,
    years: m.years,
    height: a.displayHeight || null,
    weight: a.displayWeight || null,
    born: a.displayDOB || null,
    birthplace: a.displayBirthPlace || null,
    college: a.college?.name || null,
    draft: a.displayDraft || null,
    debut: a.debutYear || null,
    exp: a.displayExperience || null,
    awards,
    teams: (bio.teamHistory || []).map((t) => [t.displayName, t.seasons]),
    seasons,
    career,
  };
}

// group by normalised name so a player listed on two payrolls gets one page
const groups = new Map();
for (const m of raw.matched) {
  const k = key(m.name);
  if (!groups.has(k)) groups.set(k, []);
  groups.get(k).push(m);
}

const players = {};
const playerIndex = {};
let dupGroups = 0;

for (const [k, entries] of groups) {
  if (entries.length > 1) dupGroups++;
  entries.sort((a, b) => b.salary - a.salary);
  const canonical = entries[0];
  const profile = buildProfile(canonical);
  profile.slug = slugify(canonical.name);
  if (entries.length > 1) {
    profile.alsoOn = entries.slice(1).map((e) => ({ team: e.abbr.toLowerCase(), salary: e.salary }));
  }
  players[profile.slug] = profile;
  for (const e of entries) playerIndex[`${e.abbr.toLowerCase()}|${k}`] = profile.slug;
}

const out = {
  meta: {
    source: "ESPN",
    retrieved: new Date().toISOString().slice(0, 10),
    note:
      "Jersey numbers, bios, awards and season-by-season stats come from ESPN's public athlete endpoints; salaries and contract terms are the 2026-27 HoopsHype figures used across this site.",
  },
  teamNames,
  players,
  playerIndex,
};

const dest = path.join(PROJ, "lib", "data", "players.json");
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, JSON.stringify(out));

const list = Object.values(players);
console.log(
  `players ${list.length} | stats ${list.filter((p) => p.seasons.length).length} | awards ${list.filter((p) => p.awards.length).length} | jersey ${list.filter((p) => p.jersey).length} | dup groups ${dupGroups}`
);
console.log(`file ${(fs.statSync(dest).size / 1024).toFixed(0)} KB`);
console.log("sample:", JSON.stringify(players["damian-lillard"]).slice(0, 700));
