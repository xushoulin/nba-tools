import type { Metadata } from "next";
import Link from "next/link";
import TeamLogo from "@/components/teams/TeamLogo";
import { TOOLS } from "@/lib/tools";
import { INITIAL_TEAMS, LEAGUE } from "@/lib/salary-data";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function Home() {
  return (
    <main>
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-1.5 text-sm font-semibold text-orange-700">
            🏀 Built for fans & fantasy managers
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
            Free NBA tools that just work.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
            Salary cap math, fantasy trade analysis, advanced stats, playoff simulations — all in your browser. No signup, no data collected, no nonsense.
          </p>
          <a
            href="#tools"
            className="mt-8 inline-block rounded-xl bg-court px-7 py-3 font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600"
          >
            Explore all tools ↓
          </a>
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

      <section id="faq" className="mx-auto max-w-6xl px-4 py-8">
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
    </main>
  );
}
