#!/usr/bin/env node
/**
 * Builds lib/data/nba-news.json from ESPN's public NBA news feed.
 *
 * Run with `npm run news`. Also runs before every production build, so a deploy
 * picks up whatever ESPN had published at build time.
 *
 * The rule this script exists to enforce: nothing is published without a source
 * it can point at. An article is dropped unless it carries a headline, a summary,
 * a parseable publish time and an https://www.espn.com/ URL for the original.
 * Anything that cannot be attributed is not written to the file at all, so the
 * UI never has to decide what to do with an unsourced item.
 *
 * The feed only ever returns the newest 50 stories (about three days), so the
 * previous file is merged in and kept for 30 days. That keeps old URLs alive
 * after a rebuild instead of turning every archived article into a 404.
 *
 * Exit code is 0 even when the network fails: a stale news snapshot must never
 * break a deploy.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = join(ROOT, "lib", "data", "nba-news.json");

const FEED = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news?limit=50";
const SOURCE_NAME = "ESPN";
const SOURCE_URL = "https://www.espn.com/nba/";

const NBA_LEAGUE_ID = 46;
/** Keep roughly a month of stories, which is about the width of the archive page. */
const MAX_AGE_DAYS = 30;
const MAX_ITEMS = 180;
/** Below this the response is treated as broken and the existing file is kept. */
const MIN_VALID_ITEMS = 5;

const KEEP_TYPES = new Set(["Story", "HeadlineNews", "Recap"]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function slugify(title) {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72)
    .replace(/-+$/g, "");
}

function pickImage(article) {
  const images = Array.isArray(article.images) ? article.images : [];
  // Only the ESPN CDN is hot-linkable; the akamaized media hosts 403 outside
  // their own players, which would leave a broken frame.
  const usable = images.filter((img) => img && typeof img.url === "string" && /^https:\/\/a\.espncdn\.com\//.test(img.url));
  const header = usable.find((img) => img.type === "header") || usable[0];
  if (!header) return null;
  return {
    url: header.url,
    alt: (header.alt || header.name || "").trim().slice(0, 300),
    credit: (header.credit || "").trim().slice(0, 160),
  };
}

/**
 * Returns a normalised item, or null when the article cannot be attributed to a
 * verifiable ESPN URL or is not primarily about the NBA.
 */
function normalise(article) {
  if (!article || !KEEP_TYPES.has(article.type)) return null;

  const categories = Array.isArray(article.categories) ? article.categories : [];
  const leagues = categories.filter((c) => c && c.type === "league");
  // Must be about the NBA...
  if (!leagues.some((c) => c.leagueId === NBA_LEAGUE_ID)) return null;
  // ...and only about the NBA. This drops cross-sport schedule promos that tag
  // every league they mention, which would otherwise read as NBA news.
  if (leagues.some((c) => c.leagueId !== NBA_LEAGUE_ID)) return null;

  // Wire recaps come back as http://www.espn.com/nba/recap?gameId=… while
  // stories use https. Both resolve to the same page over TLS, so normalise the
  // scheme instead of dropping half the feed.
  const url = String((article.links && article.links.web && article.links.web.href) || "").replace(
    /^http:\/\//,
    "https://",
  );
  if (!/^https:\/\/www\.espn\.com\/\S+$/.test(url)) return null;

  const title = String(article.headline || "").trim();
  // AP wire copy that ESPN republishes opens with an em dash; strip the marker
  // only, the sentence itself stays verbatim.
  const summary = String(article.description || "")
    .trim()
    .replace(/^[—–-]\s*/, "")
    .trim();
  if (title.length < 15 || summary.length < 40) return null;

  const publishedRaw = article.published || article.lastModified;
  const published = new Date(publishedRaw);
  if (Number.isNaN(published.getTime())) return null;
  // A publish date in the future by more than a couple of hours is a feed bug,
  // not news.
  if (published.getTime() > Date.now() + 2 * 60 * 60 * 1000) return null;

  const updatedRaw = article.lastModified ? new Date(article.lastModified) : published;

  const teams = [
    ...new Set(
      categories
        .filter((c) => c && c.type === "team" && typeof c.description === "string")
        .map((c) => c.description.trim()),
    ),
  ];
  const matchupCat = categories.find((c) => c && c.type === "event");

  const byline = typeof article.byline === "string" ? article.byline.trim() : "";
  // ESPN's own wire copy is often credited to no one, and "ESPN" as a byline adds
  // nothing next to the source label, so treat both as "no named reporter".
  const author = byline && byline !== "ESPN" ? byline : null;

  return {
    id: String(article.id),
    slug: `${slugify(title)}-${article.id}`,
    title,
    summary,
    published: published.toISOString(),
    updated: (Number.isNaN(updatedRaw.getTime()) ? published : updatedRaw).toISOString(),
    kind: article.type,
    url,
    author,
    image: pickImage(article),
    teams,
    matchup: matchupCat && typeof matchupCat.description === "string" ? matchupCat.description.trim() : null,
  };
}

async function fetchFeed() {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      // No custom User-Agent on purpose: ESPN's edge answers 403 to unknown
      // agents, including anything self-identifying as a bot or a script.
      const res = await fetch(FEED, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      lastError = err;
      if (attempt < 3) await sleep(1500 * attempt);
    }
  }
  throw lastError;
}

function readExisting() {
  if (!existsSync(OUT)) return [];
  try {
    const parsed = JSON.parse(readFileSync(OUT, "utf8"));
    return Array.isArray(parsed.items) ? parsed.items : [];
  } catch {
    return [];
  }
}

/** Drops items that no longer satisfy the attribution rules. */
function stillPublishable(item) {
  return Boolean(
    item &&
      item.id &&
      item.slug &&
      item.title &&
      item.summary &&
      item.published &&
      /^https:\/\/www\.espn\.com\//.test(item.url || ""),
  );
}

function prune(items) {
  const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  const seen = new Set();
  return items
    .filter((item) => {
      if (!stillPublishable(item)) return false;
      if (new Date(item.published).getTime() < cutoff) return false;
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
    .slice(0, MAX_ITEMS);
}

async function main() {
  const existing = readExisting();

  let incoming = [];
  try {
    const feed = await fetchFeed();
    const articles = Array.isArray(feed.articles) ? feed.articles : [];
    const seen = new Set();
    for (const article of articles) {
      const item = normalise(article);
      if (!item || seen.has(item.id)) continue;
      seen.add(item.id);
      incoming.push(item);
    }
    console.log(`feed: ${articles.length} articles -> ${incoming.length} publishable NBA items`);
  } catch (err) {
    console.warn(`feed unreachable (${err && err.message}); keeping the existing snapshot`);
    if (!existing.length) {
      console.warn("no existing snapshot either — writing an empty list");
    }
    write({ items: prune(existing), generatedAt: new Date().toISOString(), changed: false });
    return;
  }

  if (incoming.length < MIN_VALID_ITEMS && existing.length) {
    console.warn(`only ${incoming.length} valid items in the feed; keeping the existing snapshot`);
    write({ items: prune(existing), generatedAt: new Date().toISOString(), changed: false });
    return;
  }

  const items = prune([...incoming, ...existing]);
  const fresh = items.filter((item) => incoming.some((i) => i.id === item.id)).length;
  console.log(`merged: ${items.length} items kept (${fresh} from this run, ${items.length - fresh} archived)`);
  write({ items, generatedAt: new Date().toISOString(), changed: true });
}

function write({ items, generatedAt }) {
  mkdirSync(dirname(OUT), { recursive: true });
  const payload = {
    source: { name: SOURCE_NAME, url: SOURCE_URL, feed: FEED },
    generatedAt,
    count: items.length,
    items,
  };
  writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  const newest = items[0];
  console.log(
    `wrote ${OUT.replace(ROOT, ".")} — ${items.length} items${newest ? `, newest ${newest.published}` : ""}`,
  );
}

main().catch((err) => {
  // Never fail the build over news.
  console.warn(`news build skipped: ${err && err.message}`);
});
