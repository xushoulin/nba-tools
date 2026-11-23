// Builds a compact ESPN athlete-id -> site slug map.
//
// The game detail pages only need to turn a box-score athlete id into a link to
// /players/<slug>. Importing lib/data/players.json (321 KB) into a client bundle
// for that would be wasteful, so this emits a ~15 KB lookup instead.
//
// Usage: node scripts/players/build-slug-map.mjs

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const source = path.join(root, "lib/data/players.json");
const target = path.join(root, "lib/data/player-slugs.json");

const data = JSON.parse(fs.readFileSync(source, "utf8"));
const map = {};

for (const player of Object.values(data.players ?? {})) {
  if (player?.id && player?.slug) map[String(player.id)] = player.slug;
}

fs.writeFileSync(target, `${JSON.stringify(map, null, 0)}\n`);
console.log(`wrote ${Object.keys(map).length} entries to ${path.relative(root, target)}`);
