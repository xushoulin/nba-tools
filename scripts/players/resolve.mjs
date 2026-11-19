// Resolve the players that were not on their team's current ESPN roster
// (traded, waived, injured) through the ESPN player search endpoint.
import fs from "node:fs";
import path from "node:path";

const FILE = path.join(process.cwd(), "scripts", "players", ".raw", "players.raw.json");
const raw = JSON.parse(fs.readFileSync(FILE, "utf8"));

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
async function get(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
      if (r.status === 200) return await r.json();
      if (r.status === 404) return null;
    } catch {}
    await new Promise((r) => setTimeout(r, 500 * (i + 1)));
  }
  return null;
}
const norm = (s) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[.'\u2019`-]/g, " ")
    .replace(/\b(jr|sr|ii|iii|iv|v)\b/gi, " ").replace(/\s+/g, " ").trim().toLowerCase();

const ALIAS = {
  "dennis schroeder": "dennis schroder",
  "hansen yang": "yang hansen",
};

const resolved = [];
for (const miss of raw.unmatched) {
  const q = encodeURIComponent(miss.name);
  const res = await get(`https://site.web.api.espn.com/apis/search/v2?query=${q}&type=player&limit=8`);
  const list = (res?.results?.[0]?.contents || []).filter((c) => c.defaultLeagueSlug === "nba");
  const want = ALIAS[norm(miss.name)] || norm(miss.name);
  let hit = list.find((c) => norm(c.displayName) === want);
  if (!hit) {
    const [wf, ...rest] = want.split(" ");
    const wl = rest.join(" ");
    hit = list.find((c) => {
      const n = norm(c.displayName).split(" ");
      return n[0] === wf && n.slice(1).join(" ").slice(0, 6) === wl.slice(0, 6);
    });
  }
  if (!hit) {
    console.log(`MISS ${miss.abbr} ${miss.name}`);
    continue;
  }
  const id = hit.uid.split(":").pop();
  const [athlete, stats, bio] = await Promise.all([
    get(`https://site.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${id}?region=us&lang=en`),
    get(`https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${id}/stats?region=us&lang=en`),
    get(`https://site.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${id}/bio?region=us&lang=en`),
  ]);
  raw.details[id] = { athlete, stats, bio };
  raw.matched.push({
    abbr: miss.abbr,
    name: miss.name,
    pos: raw.ourTeams.find((t) => t.abbr === miss.abbr).players.find((p) => p.name === miss.name).pos,
    salary: raw.ourTeams.find((t) => t.abbr === miss.abbr).players.find((p) => p.name === miss.name).salary,
    years: raw.ourTeams.find((t) => t.abbr === miss.abbr).players.find((p) => p.name === miss.name).years,
    espnId: id,
    jersey: athlete?.athlete?.jersey ?? null,
    viaSearch: true,
  });
  resolved.push(`${miss.abbr} ${miss.name} -> ${hit.displayName} (${id}) jersey=${athlete?.athlete?.jersey}`);
}
raw.unmatched = raw.unmatched.filter((m) => !resolved.some((r) => r.startsWith(`${m.abbr} ${m.name} `)));
console.log(resolved.join("\n"));
console.log(`resolved ${resolved.length}, still unmatched ${raw.unmatched.length}, matched ${raw.matched.length}`);
fs.writeFileSync(FILE, JSON.stringify(raw));
