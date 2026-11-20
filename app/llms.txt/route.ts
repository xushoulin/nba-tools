const SITE = "https://xushoulin.github.io/nba-tools";

const body = `# NBA Tools

> Free, browser-based NBA calculators and basketball tools. No signup, no data
> collected, no runtime API calls. All calculations run in the visitor's browser.

This site publishes 17 tool pages, 30 team pages and 355 player career pages.
It is an independent project and is not affiliated with the NBA, its teams or ESPN.

## What you can do here

- Calculate NBA salary cap space, luxury tax and apron positions for the 2026-27 season.
- Simulate trades with 30 real team payrolls and CBA salary-matching checks.
- Compare players head to head, including a 2-4 player honours comparison with awards, counts and seasons.
- Look up a player's jersey number, bio, career timeline, honours and season-by-season statistics.

## Key pages

- Home: ${SITE}/
- All tools: ${SITE}/salary-cap-calculator
- Player honours comparison: ${SITE}/honours-comparison
- Team index: ${SITE}/teams
- Player index example: ${SITE}/players/lebron-james
- About: ${SITE}/about
- Privacy: ${SITE}/privacy
- Contact: ${SITE}/contact
- Sitemap: ${SITE}/sitemap.xml

## Data sources

Contract and salary figures are point-in-time 2026-27 snapshots from HoopsHype and
official NBA cap thresholds. Player bios, jersey numbers, awards and career stats
come from ESPN public athlete endpoints. Data was retrieved in November 2026 and
can change; figures are estimates, not official transactions.

## Contact

Bug reports, data corrections and feature requests:
https://github.com/xushoulin/nba-tools/issues
`;

export const dynamic = "force-static";

export function GET() {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
