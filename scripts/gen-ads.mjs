// Generates public/ads.txt from NEXT_PUBLIC_ADSENSE_CLIENT.
// Runs automatically before every build via the "prebuild" npm script.
// With no valid client id it writes a comment-only file instead of a fake
// publisher id, so a broken/placeholder ads.txt is never shipped.

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

// This runs as a plain Node script before `next build`, so Next's automatic
// .env loading does not apply here — parse the files ourselves. Later files
// win, matching Next's precedence (.env < .env.production < .env.local).
function loadEnvFiles() {
  const merged = {};
  for (const name of [".env", ".env.production", ".env.local"]) {
    const file = path.join(root, name);
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!match) continue;
      let value = match[2].trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      merged[match[1]] = value;
    }
  }
  return merged;
}

const fileEnv = loadEnvFiles();
const raw = (
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ||
  fileEnv.NEXT_PUBLIC_ADSENSE_CLIENT ||
  ""
).trim();
const match = raw.match(/^ca-pub-(\d{16})$/);
const destDir = path.join(root, "public");
const dest = path.join(destDir, "ads.txt");

fs.mkdirSync(destDir, { recursive: true });

if (match) {
  const pub = match[1];
  const body = `google.com, pub-${pub}, DIRECT, f08c47fec0942fa0\n`;
  fs.writeFileSync(dest, body, "utf8");
  console.log(`ads.txt: wrote publisher pub-${pub}`);
} else {
  const body = [
    "# ads.txt is not active yet.",
    "# Set NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX in .env.local,",
    "# then rebuild. Note: ads.txt must be served from the domain root,",
    "# so a custom domain (not the /nba-tools/ project path) is required.",
    "",
  ].join("\n");
  fs.writeFileSync(dest, body, "utf8");
  console.log("ads.txt: no client id configured, wrote placeholder comments only");
}
