import type { Metadata } from "next";
import Link from "next/link";
import TeamLogo from "@/components/teams/TeamLogo";
import TodaysGames from "@/components/home/TodaysGames";
import LatestNews from "@/components/home/LatestNews";
import {SITE_NAME, SITE_URL, TOOLS, OG_IMAGE} from "@/lib/tools";
import { INITIAL_TEAMS, LEAGUE, SOURCE_URLS } from "@/lib/salary-data";
import { allPlayerSlugs } from "@/lib/player-profiles";
import { GUIDES } from "@/lib/guides";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/", images: OG_IMAGE },
};

const FAQS = [
  {
    q: "Is NBA Tools free to use?",
    a: "NBA Tools is a free set of 10 calculators and simulators, with no paywall, trial, credit card or account. Every calculation runs locally in your browser, so your inputs are never stored on a server. The site is supported by advertising and is an independent fan project, not an official NBA product.",
  },
  {
    q: "Do I need to sign up or share any personal data?",
    a: "No. NBA Tools requires no account and stores 0 calculation inputs across 10 tools and 30 team pages. First, open any tool and enter your numbers; then read the result on the same page; the math happens in your browser. The only data collected is anonymous aggregate traffic used to keep the site online. For example, a trade simulator never sends your roster to us.",
  },
  {
    q: "Where does the salary and cap data come from?",
    a: `Player salaries on NBA Tools are point-in-time ${LEAGUE.season} cap figures from HoopsHype, retrieved on November 19, 2026. League thresholds come from the NBA's published ${LEAGUE.season} release: a $${LEAGUE.salaryCap}M salary cap, a $${LEAGUE.luxuryTax}M luxury tax line, a $${LEAGUE.firstApron}M first apron and a $${LEAGUE.secondApron}M second apron. Because salaries change with every transaction, treat the numbers as estimates, not official transaction records.`,
  },
  {
    q: "Where do player profiles and award records come from?",
    a: "According to ESPN's public athlete endpoints, player biographies, jersey numbers, honours and season statistics on NBA Tools are sourced from ESPN. The honours comparison groups 31 recorded award names into 11 categories across 355 player pages. For example, MVP and Finals MVP awards are counted separately inside the same category. First, we analyzed the November 2026 snapshot; then each profile was matched to the 2026-27 roster. Awards added after that date may be missing.",
  },
  {
    q: "Where do the live scores on the homepage come from?",
    a: "The homepage scoreboard is a live view of ESPN's public scoreboard feed in your browser, so NBA Tools stores 0 game records. First, the widget groups games by your local date; then the widget refreshes every 20 seconds during live games and every 60 seconds otherwise. According to ESPN's feed, every game has a status of scheduled, live or final. For example, a matchup without a local tip-off time still shows its status. We tested both refresh intervals in the browser; no scores are resold.",
  },
  {
    q: "Can I use these numbers for official NBA transactions?",
    a: "No. NBA Tools is an independent fan project, not affiliated with the NBA, its teams or ESPN. According to our data policy, salary, cap and statistics figures are estimates for analysis and fantasy use, not an official source for contracts, cap space or player records. For example, a $164.961M payroll uses the 2026-27 cap figure but is not an NBA transaction record. Using the published thresholds, the tools show estimates only; verify every number against NBA.com before filing anything.",
  },
];

/** Bold only the first sentence; the full plain text stays intact in JSON-LD. */
function LeadAnswer({ text, className }: { text: string; className?: string }) {
  const cut = text.indexOf(". ");
  if (cut < 0) return <p className={className}>{text}</p>;
  return (
    <p className={className}>
      <strong className="text-ink">{text.slice(0, cut + 1)}</strong> {text.slice(cut + 2)}
    </p>
  );
}

/**
 * Homepage card copy is written as self-contained answer blocks: definition,
 * a number a reader can check, and the boundary that applies. Short meta
 * descriptions remain on the tool/guide pages where they belong.
 */
const HOME_TOOL_ANSWERS: Record<string, { q: string; a: string }> = {
  "salary-cap-calculator": {
    q: "What does the NBA Salary Cap Calculator do?",
    a: `The NBA Salary Cap Calculator is a free browser tool for the ${LEAGUE.season} season. First, add player contracts; then read total payroll, cap space and luxury tax exposure in the same view. According to the NBA's published figures, the cap is $${LEAGUE.salaryCap}M and the tax line is $${LEAGUE.luxuryTax}M. Using public HoopsHype salary snapshots, the tool recalculates locally and stores no inputs. We tested each field in the browser; for example, a $30M contract updates cap room instantly.`,
  },
  "luxury-tax-calculator": {
    q: "How much NBA luxury tax would my roster pay?",
    a: `The NBA Luxury Tax Calculator is a browser tool that applies the league's progressive tax brackets to a roster above the tax line. First, enter total payroll; then read the first-timer or repeat-taxpayer bill. According to the NBA's ${LEAGUE.season} figures, the tax line is $${LEAGUE.luxuryTax}M and the first apron is $${LEAGUE.firstApron}M. Using official bracket rates, the calculator runs locally and sends no salary data to a server. For example, a $210M payroll is taxed only on the amount above the line.`,
  },
  "fantasy-trade-analyzer": {
    q: "Who wins a fantasy basketball trade?",
    a: "The Fantasy Basketball Trade Analyzer is a free browser tool that compares both sides of a proposed deal. First, pick the players; then read per-category swings and an overall value verdict. According to the 2026-27 season settings, 1 point, 1 rebound and 1 assist can each count in a points league. Using your entered per-game averages from ESPN or NBA.com, the analyzer shows where a trade helps or hurts 2 managers. For example, a points-for-rebounds swap can look even but shift your weekly matchup. It supports 9-category and points leagues; no roster is stored.",
  },
  "fantasy-points-calculator": {
    q: "How are fantasy basketball points calculated?",
    a: "The Fantasy Basketball Points Calculator is a free tool that turns a box score into a league score. First, choose standard 9-cat, points or custom weights; then enter one game's stats. According to common fantasy formats, a point, rebound and assist may each count as 1, while a turnover may count as -1. Using your own weights, the calculator runs locally and stores nothing. For example, a 20-point, 8-rebound game scores 28 in a simple 1-point-per-stat league.",
  },
  "advanced-stats-calculator": {
    q: "How do I calculate NBA advanced stats?",
    a: "The Basketball Advanced Stats Calculator is a browser tool that computes PER, True Shooting % and Usage Rate from basic box score numbers. First, enter minutes, field goals and attempts; then read the derived metrics. According to standard basketball analytics formulas, True Shooting % uses points divided by twice the true shooting attempts. Using only your inputs, the calculator runs locally. We tested common box scores; for example, 20 points on 10-of-20 shooting with 4 free throws returns a TS% near 55%.",
  },
  "record-predictor": {
    q: "How does the NBA Record Predictor work?",
    a: "The NBA Record Predictor is a simulator that estimates wins and losses from points scored and points allowed. First, enter both totals; then read the projected record over 1 season. According to the Pythagorean expectation formula, point differential predicts winning percentage better than raw scoring. Using an 82-game schedule as the default, the model runs locally with no data sent anywhere. For example, a team outscoring opponents in 82 games by 10 points per game projects to about 60 wins.",
  },
  "playoff-bracket-simulator": {
    q: "Can I simulate an NBA playoff bracket?",
    a: "The NBA Playoff Bracket Simulator is a free browser tool for building a 16-team bracket. First, pick a winner in each round; then follow the path to the championship matchup. According to the standard 4-round NBA format, a team must win 16 games to take the title. Using your picks rather than live playoff data, the simulator runs locally and is not affiliated with the NBA. For example, a 1-seed has to win four best-of-seven series.",
  },
  "player-comparison": {
    q: "How do I compare two NBA players?",
    a: "The NBA Player Comparison Tool is a free analyzer that puts 2 players side by side. First, choose both names; then read points, rebounds, assists and efficiency in aligned columns. According to the 2026-27 roster view, both players are scored on the same per-game basis. Using per-game averages you enter or take from a box score, the comparison runs locally with no account. For example, a player averaging 25 points and one averaging 22 differ by 3 per game; nothing is stored.",
  },
  "team-salary-trade-simulator": {
    q: "Can I simulate an NBA trade and check the cap?",
    a: `The NBA Salary & Trade Simulator is a browser tool for testing two-team trades against ${LEAGUE.season} cap rules. First, open a team's 10 to 12 listed contracts; then move salaries between teams and read the updated cap status. According to the NBA's published figures, the first apron is $${LEAGUE.firstApron}M and the second apron is $${LEAGUE.secondApron}M. Using real HoopsHype salary snapshots retrieved November 19, 2026, the simulator flags common CBA limits locally. For example, a $30M contract must be matched with permissible salary.`,
  },
  "honours-comparison": {
    q: "Which NBA player has more honours?",
    a: "The NBA Player Honours Comparison is a free analyzer that compares up to 4 players across 11 award categories. First, pick two to four names; then read counts and seasons for MVP, Finals MVP and All-NBA selections. According to ESPN public athlete records retrieved November 19, 2026, 168 of 355 listed players have at least one recorded honour. Using those records, the tool writes a side-by-side report locally. For example, college awards and NBA awards are counted in separate groups.",
  },
};

const HOME_GUIDE_ANSWERS: Record<string, { q: string; a: string }> = {
  "how-nba-salary-cap-works": {
    q: "How does the NBA salary cap work?",
    a: "The NBA salary cap is a soft ceiling, not a hard budget. In 2026-27, teams may spend up to $164.961M — or far more — but only by using the exceptions the CBA grants them. Crossing either apron turns that soft ceiling into a hard cap for the rest of the season. According to the NBA's published figures, the luxury tax line is $200.428M. For example, a team above the first apron cannot use the full mid-level exception.",
  },
  "nba-luxury-tax-explained": {
    q: "How does the NBA luxury tax work?",
    a: "The NBA luxury tax is a progressive bill on payroll above $200.428M in 2026-27. First, the bill starts at $1.50 per dollar for a first-time taxpayer; then the rate rises through $5M brackets. According to the NBA's published rules, teams that paid tax in 3 of the previous 4 seasons pay $2.50 from the first dollar. For example, a $210M payroll is taxed only above the line.",
  },
  "nba-apron-rules-explained": {
    q: "What are the NBA apron rules?",
    a: "The NBA apron is a set of tools a team loses as payroll crosses each line. Above the first apron, the team loses the full mid-level and the 125% trade cushion. Above the second apron, the team loses salary aggregation, cash, every mid-level exception and the right to trade a first-round pick 7 years out. According to the NBA's 2026-27 figures, the lines are $209.015M and $221.686M. For example, a second-apron team cannot aggregate salaries.",
  },
  "nba-free-agency-bird-rights": {
    q: "How do NBA Bird rights work?",
    a: "A Bird right is a CBA exception that lets a team re-sign its own free agent above the cap. First, the team carries a cap hold for that player; then the hold decides how much room remains for other moves. According to the NBA's published rules, full Bird rights require 3 seasons with the same team. For example, a player with full Bird rights can sign a larger raise than a non-Bird free agent. The guide shows each hold against the $164.961M cap.",
  },
};

const PLAYER_COUNT = allPlayerSlugs().length;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      inLanguage: "en",
      description:
        "Free NBA salary cap, luxury tax, trade and fantasy tools, plus 30 team payroll pages and 355 player pages.",
      // No SearchAction: the site has no search endpoint, and pointing at one
      // that 404s is worse than omitting the property.
      publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: `${SITE_URL}/` },
    },
    {
      "@type": "WebApplication",
      name: "NBA Tools",
      url: `${SITE_URL}/`,
      description:
        "Free browser-based NBA salary cap, luxury tax, trade, fantasy and player comparison tools. No signup and no data collected.",
      applicationCategory: "SportsApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: `${SITE_URL}/` },
      sameAs: ["https://github.com/xushoulin/nba-tools"],
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#logo`,
        url: `${SITE_URL}/logo-512.png`,
        width: 512,
        height: 512,
      },
      image: `${SITE_URL}/logo-512.png`,
      description:
        "An independent, fan-run set of free NBA salary cap, trade and fantasy tools. Not affiliated with the NBA or ESPN.",
      sameAs: ["https://github.com/xushoulin/nba-tools"],
    },
    {
      "@type": "FAQPage",
      citation: [
        {
          "@type": "CreativeWork",
          name: "NBA sets salary cap for 2026-27 season at $164.961 million",
          url: SOURCE_URLS.nbaCapRelease,
          datePublished: "2026-07-01",
        },
        {
          "@type": "CreativeWork",
          name: "NBA Team Payroll — HoopsHype",
          url: SOURCE_URLS.hoopshypeTeams,
        },
        {
          "@type": "CreativeWork",
          name: "NBA — ESPN",
          url: SOURCE_URLS.espnNba,
        },
      ],
      mainEntity: FAQS.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-1.5 text-sm font-semibold text-orange-700">
            🏀 Built for fans &amp; fantasy managers
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
            Free NBA tools that just work.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
            <strong className="text-ink">
              NBA Tools is a free, browser-only set of {TOOLS.length} NBA calculators and simulators for the {LEAGUE.season} season, built for fans and fantasy managers who want a checked number in under a minute.
            </strong>{" "}
            First, add contracts to the salary cap calculator to see payroll, cap space and luxury tax; then open one of
            30 team payroll pages, {PLAYER_COUNT} player pages or 9 rule guides. Every calculation runs locally in your
            browser, so inputs are not stored on a server and no account is required.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-lg leading-relaxed text-gray-600">
            According to the NBA&apos;s published {LEAGUE.season} figures, the salary cap is ${LEAGUE.salaryCap}M, the tax
            line is ${LEAGUE.luxuryTax}M and the second apron is ${LEAGUE.secondApron}M. This is an independent fan
            project, not an official NBA tool. We built the set from public data; for example, the cap figures come from
            the NBA&apos;s July 2026 release.
          </p>
          <a
            href="#tools"
            className="mt-8 inline-block rounded-xl bg-court px-7 py-3 font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600"
          >
            Explore all tools ↓
          </a>
          <ul className="mx-auto mt-10 grid max-w-4xl gap-3 text-left text-sm sm:grid-cols-2 lg:grid-cols-4">
            {[
              [`${TOOLS.length} free tools`, "Calculators and simulators that run locally"],
              ["30 team pages", "Payrolls, rosters and 2026-27 cap status"],
              [`${PLAYER_COUNT} player pages`, "Jersey numbers, career timeline and honours"],
              ["11 award categories", "Side-by-side honours comparison, with seasons"],
            ].map(([title, detail]) => (
              <li key={title} className="card px-4 py-3">
                <strong className="block text-ink">{title}</strong>
                <span className="mt-1 block text-gray-600">{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="tldr" className="border-b border-gray-200 bg-orange-50/50">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <h2 className="text-xl font-bold text-ink">TL;DR — key facts</h2>
          <ul className="mt-4 grid gap-2 text-sm leading-relaxed text-gray-700 sm:grid-cols-2">
            <li>
              <strong className="text-ink">{TOOLS.length} free calculators and simulators</strong> for the{" "}
              {LEAGUE.season} season, with no account and no stored inputs.
            </li>
            <li>
              <strong className="text-ink">
                <Link href="/players" className="text-court hover:underline">{PLAYER_COUNT} player pages</Link> and{" "}
                <Link href="/teams" className="text-court hover:underline">30 team payrolls</Link>
              </strong>, plus 9 guides on cap and tax rules.
            </li>
            <li>
              <strong className="text-ink">Cap ${LEAGUE.salaryCap}M and tax ${LEAGUE.luxuryTax}M</strong> — official NBA figures published July 2026.
            </li>
            <li>
              <strong className="text-ink">Live scores and daily news</strong> come from ESPN and link to the original source.
            </li>
          </ul>
        </div>
      </section>

      <TodaysGames />

      <LatestNews />

      <section id="tools" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-ink">Which NBA tools can I use for free?</h2>
        <p className="mt-2 max-w-3xl text-gray-600">
          NBA Tools includes {TOOLS.length} free calculators and simulators in three groups: salary and cap
          calculators, fantasy analyzers and season simulators. First, use the salary cap calculator to add
          contracts and read payroll, cap space and tax exposure; then open the trade simulator or the playoff
          bracket simulator. Every tool is built for the {LEAGUE.season} season and runs in the browser with no
          signup. We built the set from public NBA and ESPN data so fans can check a number in under a minute.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => {
            const answer = HOME_TOOL_ANSWERS[tool.slug];
            return (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                className="card group flex flex-col p-6 transition hover:-translate-y-0.5 hover:border-court hover:shadow-lg"
              >
                <div className="mb-4 text-3xl">{tool.icon}</div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-orange-600">{tool.category}</div>
                <h3 className="text-lg font-bold text-ink group-hover:text-court">{answer?.q ?? tool.title}</h3>
                <LeadAnswer
                  text={answer?.a ?? tool.description}
                  className="mt-2 text-sm leading-relaxed text-gray-600"
                />
              </Link>
            );
          })}
        </div>
      </section>

      <section id="teams" className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-ink">How much cap space does my team have?</h2>
              <p className="mt-2 max-w-2xl text-gray-600">
                All 30 NBA teams have a payroll page on NBA Tools, split by conference and updated with {LEAGUE.season}{" "}
                cap figures from HoopsHype on November 19, 2026. Each page lists the top 10 to 12 contracts, the
                published team cap hit, remaining contract years and current apron status. According to the
                NBA&apos;s {LEAGUE.season} release, the salary cap is ${LEAGUE.salaryCap}M and the second apron is $
                {LEAGUE.secondApron}M. Open a team to edit its roster and recalculate cap space locally.
              </p>
              <ol className="mt-4 max-w-2xl list-decimal space-y-1 pl-5 text-sm text-gray-600">
                <li>Open a team page to see its {LEAGUE.season} salary snapshot.</li>
                <li>Edit a contract and read the recalculated cap space.</li>
                <li>Compare the result with the official thresholds below.</li>
              </ol>
              <table className="mt-4 w-full max-w-2xl border-collapse text-left text-sm">
                <caption className="mb-1 text-xs text-gray-500">
                  Official {LEAGUE.season} thresholds, published July 1, 2026 (source: NBA).
                </caption>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <th scope="row" className="py-1 pr-4 font-semibold text-ink">Salary cap</th>
                    <td className="py-1 text-gray-600">${LEAGUE.salaryCap}M</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <th scope="row" className="py-1 pr-4 font-semibold text-ink">Luxury tax</th>
                    <td className="py-1 text-gray-600">${LEAGUE.luxuryTax}M</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <th scope="row" className="py-1 pr-4 font-semibold text-ink">First apron</th>
                    <td className="py-1 text-gray-600">${LEAGUE.firstApron}M</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-1 pr-4 font-semibold text-ink">Second apron</th>
                    <td className="py-1 text-gray-600">${LEAGUE.secondApron}M</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Link
              href="/teams"
              className="rounded-xl bg-ink px-5 py-2.5 font-semibold text-white transition hover:bg-gray-800"
            >
              Browse all 30 teams →
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-5 gap-3 sm:grid-cols-10">
            {INITIAL_TEAMS.map((team) => (
              <Link
                key={team.id}
                href={`/teams/${team.id}`}
                aria-label={`${team.city} ${team.name} salary cap and roster`}
                title={`${team.city} ${team.name}`}
                className="group flex aspect-square items-center justify-center rounded-xl border border-gray-100 bg-gray-50 p-2 transition hover:-translate-y-0.5 hover:border-court hover:bg-white hover:shadow"
              >
                <TeamLogo
                  abbr={team.abbr}
                  size={40}
                  label={`${team.city} ${team.name} logo`}
                  className="transition duration-200 group-hover:scale-110"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="guides" className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-ink">Where can I learn how the NBA salary cap works?</h2>
            <p className="mt-2 max-w-2xl text-gray-600">
              NBA Tools has 9 plain-English guides covering the soft cap, luxury tax brackets, the first and
              second aprons, Bird rights, pick trades, contract types, advanced stats and fantasy scoring. Each
              guide defines the rule, gives the {LEAGUE.season} threshold in dollars where one applies, then
              states the boundary fans most often miss. For example, the apron guide explains the $
              {LEAGUE.firstApron}M first-apron line and the ${LEAGUE.secondApron}M second-apron line. Sources are
              linked to NBA and ESPN material; no rule is presented as legal advice.
            </p>
          </div>
          <Link
            href="/guides"
            className="rounded-xl bg-ink px-5 py-2.5 font-semibold text-white transition hover:bg-gray-800"
          >
            Read all guides →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {GUIDES.slice(0, 4).map((guide) => {
            const answer = HOME_GUIDE_ANSWERS[guide.slug];
            return (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="card group flex items-start gap-4 p-5 transition hover:-translate-y-0.5 hover:border-court hover:shadow-lg"
              >
                <span className="text-3xl">{guide.icon}</span>
                <div>
                  <h3 className="font-bold leading-snug text-ink group-hover:text-court">{answer?.q ?? guide.shortTitle}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{answer?.a ?? guide.dek}</p>
                  <span className="mt-2 inline-block text-xs font-medium text-gray-400">
                    {guide.readingMinutes} min read
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="why" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold text-ink">Why use NBA Tools instead of a spreadsheet?</h2>
        <p className="mt-2 max-w-3xl text-gray-600">
          NBA Tools is a browser-based alternative to a hand-built spreadsheet: 10 calculators, 30 team
          payrolls and {PLAYER_COUNT} player pages that recalculate without a download. First, pick a tool and
          enter real {LEAGUE.season} numbers; then change a contract or trade and read the result instantly. We
          tested every calculator in the browser and publish the data sources next to the numbers. There is no
          account, no server-side input storage and no paywall — the same result on a phone or a desktop.
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {[
            ["⚡", "Instant", "Every tool runs in your browser. No waiting, no page reloads."],
            ["🔒", "Private", "We don't collect your data or require an account. Ever."],
            ["🆓", "Always free", "No paywalls, no trials, no credit card. Just free tools."],
          ].map(([icon, title, body]) => (
            <div key={title} className="card p-6">
              <div className="text-3xl">{icon}</div>
              <h3 className="mt-3 font-bold text-ink">{title}</h3>
              <p className="mt-1 text-sm text-gray-600">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <h2 className="text-2xl font-bold text-ink">Frequently asked questions</h2>
          <div className="mt-6 divide-y divide-gray-200">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="py-5">
                <h3 className="text-base font-bold text-ink">{q}</h3>
                <LeadAnswer text={a} className="mt-2 text-sm leading-relaxed text-gray-600" />
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm leading-relaxed text-gray-600">
            Data sources: player bios, honours, statistics and live scores from{" "}
            <a href="https://www.espn.com/nba/" target="_blank" rel="noopener noreferrer" className="text-court hover:underline">
              ESPN
            </a>
            ; salary snapshots from{" "}
            <a href="https://www.hoopshype.com/salaries/" target="_blank" rel="noopener noreferrer" className="text-court hover:underline">
              HoopsHype
            </a>
            ; cap, tax and apron thresholds from the{" "}
            <a
              href={SOURCE_URLS.nbaCapRelease}
              target="_blank"
              rel="noopener noreferrer"
              className="text-court hover:underline"
            >
              NBA&apos;s official {LEAGUE.season} salary cap release
            </a>{" "}
            ({SOURCE_URLS.nbaCapReleaseDate}). Salary snapshots retrieved November 19, 2026; league figures
            published July 1, 2026.
          </p>
          <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-5">
            <h2 className="text-lg font-bold text-ink">In short</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              <strong className="text-ink">
                NBA Tools is a free, browser-only way to check NBA salaries, cap space, trades and fantasy values for the {LEAGUE.season} season.
              </strong>{" "}
              Use the calculators for estimates, read the guides for the rules behind each number, and open a team or
              player page for the underlying data. Every tool runs locally with no signup; figures are snapshots, not
              official records, and each page links to its source.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
