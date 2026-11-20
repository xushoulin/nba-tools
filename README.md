# NBA Tools

A collection of free, browser-based basketball tools for fans and fantasy managers. No signup, no data collected — the calculators run entirely client-side.

## Tools

- NBA Salary Cap Calculator
- NBA Luxury Tax Calculator
- Team Salary & Trade Simulator (30 teams, live CBA salary-matching checks)
- Fantasy Basketball Trade Analyzer
- Fantasy Basketball Points Calculator
- Basketball Advanced Stats Calculator
- NBA Record Predictor (Pythagorean expectation)
- NBA Playoff Bracket Simulator
- NBA Player Comparison Tool

## Team & player pages

- `/teams` — all 30 clubs split by conference and division, with payroll and apron status
- `/teams/[id]` — roster, contracts, cap hit and division context
- `/players/[slug]` — 355 player profiles: jersey number, bio, awards, career timeline and season-by-season stats

## Tech stack

- Next.js 15 (App Router) + React 19
- TypeScript + Tailwind CSS
- Fully static — no backend, no database, no runtime API calls

## Data

Salary and contract figures are real 2026-27 cap numbers from HoopsHype, with the official
NBA 2026-27 thresholds (cap $164.961M, tax $200.428M, first apron $209.015M, second apron
$221.686M). Player bios, jersey numbers, awards and career stats come from ESPN's public
athlete endpoints.

Regenerate the player dataset (run from the project root):

```bash
node scripts/players/fetch.mjs     # pulls rosters + athlete payloads into scripts/players/.raw
node scripts/players/resolve.mjs   # resolves players not on their club's current roster
node scripts/players/build.mjs     # compresses everything into lib/data/players.json
```

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve production build
```

## Deployment

The site is a full static export served from the `gh-pages` branch:

- Live URL: https://xushoulin.github.io/nba-tools/
- `NEXT_PUBLIC_SITE_URL` controls canonical URLs, Open Graph tags, `robots.txt` and `sitemap.xml`.
  It defaults to the live URL above; override it with an env var if you move to a custom domain.

To publish an update:

```bash
npm run build                       # emits the static site into .next-export/
cp -r .next-export/. /tmp/nba-pages/
touch /tmp/nba-pages/.nojekyll
cd /tmp/nba-pages && git init -b gh-pages && git add -A
git commit -m "Deploy static export" && git push -f origin gh-pages
```

GitHub Pages is configured to serve the root of `gh-pages`. Adding a CNAME file there and
pointing a DNS CNAME record at `xushoulin.github.io` will move the same build to a custom domain;
remember to set `NEXT_PUBLIC_SITE_URL` to that domain before rebuilding.

## Disclaimer

NBA Tools is independently operated and not affiliated with the NBA, its teams or ESPN. Salary
figures, cap holds and contract terms are point-in-time snapshots and change constantly — use
them for estimation, not for official transactions. All team names and trademarks belong to
their respective owners.

## License

MIT
