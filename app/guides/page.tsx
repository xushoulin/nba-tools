import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { SITE_URL } from "@/lib/tools";

export const metadata: Metadata = {
  title: "NBA Salary Cap, Trade & Stats Guides",
  description:
    "Plain-English explainers on NBA salary cap rules, luxury tax brackets, the aprons, Bird rights, pick trades, advanced stats and fantasy scoring — written around the 2026-27 league figures.",
  alternates: { canonical: "/guides" },
  openGraph: { url: "/guides" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      name: "NBA Salary Cap, Trade & Stats Guides",
      url: `${SITE_URL}/guides`,
      description:
        "Plain-English explainers on NBA salary cap rules, luxury tax brackets, the aprons, Bird rights, pick trades, advanced stats and fantasy scoring.",
      isPartOf: { "@type": "WebSite", name: "NBA Tools", url: `${SITE_URL}/` },
    },
    {
      "@type": "ItemList",
      itemListElement: GUIDES.map((guide, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: guide.title,
        url: `${SITE_URL}/guides/${guide.slug}`,
      })),
    },
  ],
};

const GROUPS: { heading: string; note: string; slugs: string[] }[] = [
  {
    heading: "Money: the cap, the tax and the aprons",
    note: "Start here. These four explain what teams can spend and what they lose when they spend it.",
    slugs: [
      "how-nba-salary-cap-works",
      "nba-luxury-tax-explained",
      "nba-apron-rules-explained",
      "nba-free-agency-bird-rights",
    ],
  },
  {
    heading: "Building a roster: trades, picks and contracts",
    note: "The mechanisms that turn payroll into a team, and the rules that block the obvious move.",
    slugs: ["nba-trade-rules-explained", "nba-draft-pick-trade-rules", "nba-contract-types-explained"],
  },
  {
    heading: "Reading the numbers: stats and fantasy",
    note: "How to measure what happened, and how the same player is worth different amounts in different formats.",
    slugs: ["nba-advanced-stats-explained", "fantasy-basketball-scoring-systems"],
  },
];

export default function GuidesIndex() {
  const bySlug = new Map(GUIDES.map((g) => [g.slug, g]));

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-court">Home</Link>
        <span aria-hidden>/</span>
        <span className="text-gray-700">Guides</span>
      </nav>

      <header className="max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          NBA salary cap and contract guides
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">
          Nine plain-English explainers on how NBA money actually works: the soft cap and its exceptions, the
          luxury tax bracket maths, the first and second aprons, Bird rights and cap holds, the five checks every
          trade must pass, draft-pick rules, contract types, advanced stats and fantasy scoring. All figures are
          the official 2026-27 thresholds.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-gray-600">
          {["$164.961M cap", "$200.428M tax line", "$209.015M first apron", "$221.686M second apron"].map((chip) => (
            <li key={chip} className="rounded-full border border-gray-200 bg-white px-3 py-1">
              {chip}
            </li>
          ))}
        </ul>
      </header>

      {GROUPS.map((group) => (
        <section key={group.heading} className="mt-10">
          <h2 className="text-xl font-bold text-ink">{group.heading}</h2>
          <p className="mt-1.5 text-sm text-gray-600">{group.note}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {group.slugs.map((slug) => {
              const guide = bySlug.get(slug);
              if (!guide) return null;
              return (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="card group flex flex-col p-6 transition hover:-translate-y-0.5 hover:border-court hover:shadow-lg"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-3xl">{guide.icon}</span>
                    <span className="text-xs font-medium text-gray-400">{guide.readingMinutes} min read</span>
                  </div>
                  <h3 className="text-lg font-bold leading-snug text-ink group-hover:text-court">{guide.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{guide.description}</p>
                  <span className="mt-4 text-xs font-semibold uppercase tracking-wide text-orange-600">
                    Read the guide →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      <section className="mt-14 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-xl font-bold text-ink">How to use these guides</h2>
        <p className="mt-3 text-sm leading-7 text-gray-700">
          Each guide is written to be read once and then used as a reference. The three groups above are in
          reading order: start with the cap explainer for the vocabulary, then read the tax and apron pieces
          together — most arguments about roster building come down to confusing the tax line (money) with the
          aprons (rules). The trade, pick and contract guides are the mechanics; the stats and fantasy guides are
          how to measure the result. Every guide links to the calculator that applies the same numbers, so you
          can test a claim instead of trusting it.
        </p>
        <p className="mt-3 text-sm leading-7 text-gray-700">
          Figures come from the NBA&rsquo;s published 2026-27 thresholds and payroll snapshots retrieved from
          HoopsHype in November 2026. NBA Tools is an independent project and is not affiliated with the NBA or
          its teams; see the <Link href="/disclaimer" className="text-court hover:underline">disclaimer</Link>.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-ink">Try the calculators</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ["salary-cap-calculator", "💰", "Salary Cap Calculator"],
            ["luxury-tax-calculator", "🧾", "Luxury Tax Calculator"],
            ["team-salary-trade-simulator", "💼", "Salary & Trade Simulator"],
          ].map(([slug, icon, name]) => (
            <Link
              key={slug}
              href={`/${slug}`}
              className="card flex items-center gap-3 p-4 transition hover:border-court hover:shadow-md"
            >
              <span className="text-2xl">{icon}</span>
              <span className="font-bold text-ink">{name}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
