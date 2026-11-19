// Fetch jersey numbers, bios, awards, team history and season-by-season stats
// for every player listed in lib/salary-data.ts.
import fs from "node:fs";
import path from "node:path";
import { mkdirSync } from "node:fs";

const PROJ = process.cwd();
const OUT = path.join(PROJ, "scripts", "players", ".raw", "players.raw.json");

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";

async function get(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
      if (r.status === 200) return await r.json();
      if (r.status === 404) return null;
      if (i === tries - 1) return null;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 400 * (i + 1)));
  }
  return null;
}

const norm = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.'\u2019`-]/g, " ")
    .replace(/\b(jr|sr|ii|iii|iv|v)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

// ---- 1. our roster data ----
const src = fs.readFileSync(path.join(PROJ, "lib/salary-data.ts"), "utf8");
const ourTeams = [];
for (const block of src.split(/id: "/).slice(1)) {
  const id = block.slice(0, block.indexOf('"'));
  const m = block.match(/city: "([^"]+)", name: "([^"]+)", abbr: "([^"]+)", conference: "([^"]+)"/);
  if (!m) continue;
  const players = [...block.matchAll(/\["([^"]+)", "([A-Z]+)", ([\d.]+), (\d+)\]/g)].map((x) => ({
    name: x[1],
    pos: x[2],
    salary: Number(x[3]),
    years: Number(x[4]),
  }));
  ourTeams.push({ id, city: m[1], name: m[2], abbr: m[3], conference: m[4], players });
}
console.log("teams:", ourTeams.length, "players:", ourTeams.reduce((a, t) => a + t.players.length, 0));

// ---- 2. ESPN team list + rosters ----
const teamsJson = await get("https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams?limit=40");
const espnTeams = teamsJson.sports[0].leagues[0].teams.map((t) => t.team);
const espnByAbbr = new Map(espnTeams.map((t) => [t.abbreviation, t]));
const espnByFull = new Map(espnTeams.map((t) => [norm(t.displayName), t]));
// ESPN abbreviations differ from NBA ones for these six clubs.
const ABBR_FIX = { GSW: "GS", NYK: "NY", NOP: "NO", SAS: "SA", UTA: "UTAH", WAS: "WSH" };
function espnTeamFor(t) {
  return (
    espnByFull.get(norm(`${t.city} ${t.name}`)) ||
    espnByAbbr.get(ABBR_FIX[t.abbr] || t.abbr) ||
    null
  );
}

const rosterByTeam = new Map(); // our abbr -> [{espnId, name, jersey, pos}]
for (const t of ourTeams) {
  const et = espnTeamFor(t);
  if (!et) {
    console.warn("no espn team for", t.abbr);
    continue;
  }
  const roster = await get(
    `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${et.id}/roster`
  );
  const list = (roster?.athletes || []).map((a) => ({
    espnId: a.id,
    name: a.fullName || a.displayName,
    jersey: a.jersey || null,
    pos: a.position?.abbreviation || null,
  }));
  rosterByTeam.set(t.abbr, list);
  process.stdout.write(`roster ${t.abbr}=${list.length} `);
}
console.log();

// ---- 3. match our players to ESPN ids ----
const matched = [];
const unmatched = [];
for (const t of ourTeams) {
  const roster = rosterByTeam.get(t.abbr) || [];
  const byName = new Map(roster.map((a) => [norm(a.name), a]));
  for (const p of t.players) {
    const key = norm(p.name);
    let hit = byName.get(key);
    if (!hit) {
      // fallback: unique last-name match on the same roster
      const last = key.split(" ").pop();
      const cands = roster.filter((a) => norm(a.name).split(" ").pop() === last);
      if (cands.length === 1) hit = cands[0];
    }
    if (hit) matched.push({ team: t, abbr: t.abbr, player: p, espn: hit });
    else unmatched.push({ abbr: t.abbr, name: p.name });
  }
}
console.log(`matched ${matched.length} / ${matched.length + unmatched.length}`);
if (unmatched.length) console.log("unmatched:", unmatched.map((u) => `${u.abbr}:${u.name}`).join(", "));

// ---- 4. per-player detail ----
const uniq = new Map();
for (const m of matched) if (!uniq.has(m.espn.espnId)) uniq.set(m.espn.espnId, m);
console.log("unique espn ids:", uniq.size);

const details = new Map();
let done = 0;
const jobs = [...uniq.values()];
const CONC = 5;

async function worker(slice) {
  for (const m of slice) {
    const id = m.espn.espnId;
    const [athlete, stats, bio] = await Promise.all([
      get(`https://site.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${id}?region=us&lang=en`),
      get(`https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${id}/stats?region=us&lang=en`),
      get(`https://site.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${id}/bio?region=us&lang=en`),
    ]);
    details.set(id, { athlete, stats, bio });
    done++;
    if (done % 25 === 0) process.stdout.write(`${done} `);
  }
}
await Promise.all(
  Array.from({ length: CONC }, (_, i) => worker(jobs.filter((_, j) => j % CONC === i)))
);
console.log(`\nfetched ${details.size}`);

mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(
  OUT,
  JSON.stringify(
    {
      fetchedAt: new Date().toISOString(),
      ourTeams,
      rosters: Object.fromEntries([...rosterByTeam.entries()]),
      matched: matched.map((m) => ({
        abbr: m.abbr,
        name: m.player.name,
        pos: m.player.pos,
        salary: m.player.salary,
        years: m.player.years,
        espnId: m.espn.espnId,
        jersey: m.espn.jersey,
      })),
      unmatched,
      details: Object.fromEntries([...details.entries()]),
    },
    null,
    0
  )
);
console.log("wrote", OUT, (fs.statSync(OUT).size / 1024 / 1024).toFixed(1), "MB");
