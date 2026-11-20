import type { Metadata } from "next";
import Link from "next/link";
import TeamLogo from "@/components/teams/TeamLogo";
import { SITE_URL, TOOLS } from "@/lib/tools";
import { INITIAL_TEAMS, LEAGUE } from "@/lib/salary-data";
import { allPlayerSlugs } from "@/lib/player-profiles";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

const FAQS = [
  {
    q: "Is NBA Tools free to use?",
    a: "Yes. Every calculator and simulator on this site is free, with no paywall, trial or credit card. Everything runs in your browser, so there is no account to create.",
  },
  {
    q: "Do I need to sign up or share any personal data?",
    a: "No. NBA Tools does not require an account and does not collect your inputs on the server. Calculations happen locally in your browser, and only anonymous aggregate traffic statistics are used to keep the site running.",
  },
  {
    q: "Where does the salary and cap data come from?",
    a: `Contract figures are point-in-time ${LEAGUE.season} snapshots from HoopsHype, combined with the official NBA cap, tax and apron thresholds. They were retrieved in November 2026 and change constantly, so treat them as estimates rather than official transaction figures.`,
  },
  {
    q: "Where do player profiles and award records come from?",
    a: "Player biographies, jersey numbers, honours and season-by-season statistics come from ESPN public athlete endpoints. The honours comparison groups 31 recorded award names into 11 categories and shows counts plus seasons.",
  },
  {
    q: "Can I use these numbers for official NBA transactions?",
    a: "No. This is an independent, fan-run project. It is not affiliated with the NBA, its teams or ESPN, and the figures are not an official source for contracts, cap space or statistics.",
  },
];

const PLAYER_COUNT = allPlayerSlugs().length;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "NBA Tools",
      url: `${SITE_URL}/`,
      description:
        "Free browser-based NBA salary cap, luxury tax, trade, fantasy and player comparison tools. No signup and no data collected.",
      applicationCategory: "SportsApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      publisher: { "@type": "Organization", name: "NBA Tools", url: `${SITE_URL}/` },
      sameAs: "https://github.com/xushoulin/nba-tools",
    },
    {
      "@type": "Organization",
      name: "NBA Tools",
      url: `${SITE_URL}/`,
      sameAs: "https://github.com/xushoulin/nba-tools",
    },
    {
      "@type": "FAQPage",
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
              NBA Tools is a free, browser-only set of {TOOLS.length} basketball calculators and simulators
            </strong>{" "}
            for fans and fantasy managers. Cover salary cap, luxury tax, trade analysis, playoff brackets and
            honours — no signup, no data collected.
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

      <section id="tools" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-ink">All tools</h2>
        <p className="mt-2 text-gray-600">{TOOLS.length} free tools, more added every month.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="card group flex flex-col p-6 transition hover:-translate-y-0.5 hover:border-court hover:shadow-lg"
            >
              <div className="mb-4 text-3xl">{tool.icon}</div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-orange-600">{tool.category}</div>
              <h3 className="text-lg font-bold text-ink group-hover:text-court">{tool.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="teams" className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-ink">Team payrolls &amp; rosters</h2>
              <p className="mt-2 max-w-2xl text-gray-600">
                All 30 teams split by conference, with real {LEAGUE.season} cap hits,
                cap space and apron status. Open a team for every contract, salary and
                remaining year.
              </p>
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
                title={`${team.city} ${team.name}`}
                className="group flex aspect-square items-center justify-center rounded-xl border border-gray-100 bg-gray-50 p-2 transition hover:-translate-y-0.5 hover:border-court hover:bg-white hover:shadow"
              >
                <TeamLogo
                  abbr={team.abbr}
                  size={40}
                  className="transition duration-200 group-hover:scale-110"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="why" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold text-ink">Why use NBA Tools?</h2>
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
          <dl className="mt-6 divide-y divide-gray-200">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="py-5">
                <dt className="text-base font-bold text-ink">{q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-gray-600">{a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-sm leading-relaxed text-gray-600">
            Data sources: player bios, honours and statistics from{" "}
            <a href="https://www.espn.com/nba/" target="_blank" rel="noopener noreferrer" className="text-court hover:underline">
              ESPN
            </a>
            ; salary snapshots from{" "}
            <a href="https://www.hoopshype.com/salaries/" target="_blank" rel="noopener noreferrer" className="text-court hover:underline">
              HoopsHype
            </a>
            ; cap thresholds from the NBA&apos;s published {LEAGUE.season} figures. Last retrieved November 2026.
          </p>
        </div>
      </section>
    </main>
  );
}
