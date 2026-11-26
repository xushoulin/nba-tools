import { GUIDES } from "@/lib/guides";
import { SITE_NAME, SITE_URL, TOOLS } from "@/lib/tools";
import { INITIAL_TEAMS, SOURCE_URLS } from "@/lib/salary-data";
import { allPlayerSlugs } from "@/lib/player-profiles";

export const dynamic = "force-static";

const body = `# ${SITE_NAME}

> Free, browser-based NBA calculators and basketball tools. No signup, no data
> collected, no runtime API calls. All calculations run in the visitor's browser.

This site publishes ${TOOLS.length} tool pages, ${GUIDES.length} long-form explainer
guides, ${INITIAL_TEAMS.length} team pages and ${allPlayerSlugs().length} player career
pages. It is an independent project and is not affiliated with the NBA, its teams
or ESPN.

## What you can do here

- Calculate NBA salary cap space, luxury tax and apron positions for the 2026-27 season.
- Simulate trades with 30 real team payrolls and CBA salary-matching checks.
- Compare players head to head, including a 2-4 player honours comparison with awards, counts and seasons.
- Look up a player's jersey number, bio, career timeline, honours and season-by-season statistics.
- Read plain-English explainers on the cap, the luxury tax, trade matching and contract types.
- Follow daily NBA headlines, reports and game recaps, grouped by publication date.

## 2026-27 league figures used across the site

- Salary cap: $164.961M
- Luxury tax line: $200.428M
- First apron: $209.015M
- Second apron: $221.686M
- Minimum payroll: $148.465M

## Guides

${GUIDES.map((g) => `- ${g.title}: ${SITE_URL}/guides/${g.slug}`).join("\n")}

## Key pages

- Home: ${SITE_URL}/
- All guides: ${SITE_URL}/guides
- NBA news (by date, each story credited to ESPN): ${SITE_URL}/news
- NBA news archive: ${SITE_URL}/news/archive
- Salary cap calculator: ${SITE_URL}/salary-cap-calculator
- Luxury tax calculator: ${SITE_URL}/luxury-tax-calculator
- Salary & trade simulator: ${SITE_URL}/team-salary-trade-simulator
- Player honours comparison: ${SITE_URL}/honours-comparison
- Team index: ${SITE_URL}/teams
- Player index example: ${SITE_URL}/players/lebron-james
- About: ${SITE_URL}/about
- Editorial standards and data policy: ${SITE_URL}/editorial
- Privacy: ${SITE_URL}/privacy
- Contact: ${SITE_URL}/contact
- Sitemap: ${SITE_URL}/sitemap.xml

## Data sources

League salary cap, tax, minimum salary and apron thresholds for 2026-27 are from
the NBA official release published July 1, 2026:
${SOURCE_URLS.nbaCapRelease}
Player salaries are point-in-time 2026-27 snapshots retrieved November 19, 2026
from HoopsHype team payrolls:
${SOURCE_URLS.hoopshypeTeams}
Player bios, jersey numbers, awards and career stats come from ESPN public athlete
endpoints: ${SOURCE_URLS.espnNba}
Figures change with transactions and are estimates, not official transactions.
Verify thresholds and salaries against the three sources above before reuse.

## Contact

Bug reports, data corrections and feature requests:
https://github.com/xushoulin/nba-tools/issues
`;

export function GET() {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
