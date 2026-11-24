import type { Metadata } from "next";
import Link from "next/link";
import NewsDayList from "@/components/news/NewsDayList";
import { formatDateTimeET, formatTimeET, newsDays, NEWS_GENERATED_AT, NEWS_ITEMS, NEWS_SOURCE } from "@/lib/news";
import { SITE_URL } from "@/lib/tools";

export const metadata: Metadata = {
  title: "NBA News Today — Daily Headlines, Recaps and Sources",
  description:
    "The latest NBA headlines, reports and game recaps, grouped by the day they were published. Every story is credited to ESPN and links to the original report.",
  alternates: { canonical: "/news" },
  openGraph: {
    type: "website",
    url: "/news",
    title: "NBA News Today — Daily Headlines, Recaps and Sources",
    description:
      "NBA headlines, reports and game recaps by date. Every story credited to ESPN with a link to the original.",
  },
};

const INDEX_DAYS = 4;

export default function NewsIndex() {
  const days = newsDays();
  const shown = days.slice(0, INDEX_DAYS);
  const hasMore = days.length > shown.length;
  const newest = NEWS_ITEMS[0];
  const storyCount = NEWS_ITEMS.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "NBA News Today",
        url: `${SITE_URL}/news`,
        description:
          "Daily NBA headlines, reports and game recaps grouped by publication date, each credited to ESPN with a link to the original article.",
        isPartOf: { "@type": "WebSite", name: "NBA Tools", url: `${SITE_URL}/` },
        // The publisher of the underlying reporting, stated explicitly so the
        // page is not read as original reporting by this site.
        citation: NEWS_SOURCE.url,
      },
      {
        "@type": "ItemList",
        name: "Latest NBA stories",
        numberOfItems: shown.reduce((sum, day) => sum + day.items.length, 0),
        itemListElement: shown.flatMap((day) => day.items).slice(0, 20).map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.title,
          url: `${SITE_URL}/news/${item.slug}`,
        })),
      },
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-court">
          Home
        </Link>
        <span aria-hidden>/</span>
        <span className="text-gray-700">News</span>
      </nav>

      <header className="max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">NBA news, day by day</h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">
          Every headline, report and game recap in the snapshot, grouped by the day it was published in US
          Eastern time and listed newest first. Each entry names its source and links to the original report —
          if we cannot show where a story came from, it does not appear here at all.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-gray-500">
          <span className="rounded-full border border-gray-200 bg-white px-3 py-1">
            {storyCount} {storyCount === 1 ? "story" : "stories"} in the snapshot
          </span>
          {newest && (
            <span className="rounded-full border border-gray-200 bg-white px-3 py-1">
              Newest: {formatTimeET(newest.published)}
            </span>
          )}
          <span className="rounded-full border border-gray-200 bg-white px-3 py-1">
            Source: ESPN
          </span>
        </div>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <NewsDayList days={shown} />

          {days.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm">
              <span className="text-gray-600">
                {hasMore
                  ? `${days.length} days are archived, back to ${days[days.length - 1].heading.replace(/, \d{4}$/, "")}.`
                  : `The archive keeps about 30 days, back to ${days[days.length - 1].heading.replace(/, \d{4}$/, "")}.`}
              </span>
              <Link href="/news/archive" className="font-semibold text-court hover:underline">
                Browse the news archive →
              </Link>
            </div>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <section className="card p-5">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Where this comes from</h2>
            <ul className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">
              <li>
                <strong className="text-ink">Headlines and summaries</strong> are quoted from{" "}
                <a
                  href={NEWS_SOURCE.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-court hover:underline"
                >
                  ESPN&apos;s NBA news feed
                  <span aria-hidden> ↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                . We do not republish the full article; every entry links to it.
              </li>
              <li>
                <strong className="text-ink">Cap and payroll figures</strong> in the context boxes on story
                pages come from the HoopsHype salary snapshot and the NBA&apos;s published 2026-27 thresholds —
                the same numbers used by the{" "}
                <Link href="/salary-cap-calculator" className="font-semibold text-court hover:underline">
                  salary cap calculator
                </Link>
                .
              </li>
              <li>
                <strong className="text-ink">No source, no story.</strong> An item without a headline, a
                summary, a publish time and a working original URL is dropped before this page is built.
              </li>
            </ul>
            <p className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
              Snapshot built {formatDateTimeET(NEWS_GENERATED_AT)}. NBA Tools is independent and not
              affiliated with ESPN or the NBA.
            </p>
          </section>

          <section className="card p-5">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Put the news in context</h2>
            <div className="mt-3 space-y-2 text-sm">
              {[
                ["/teams", "Team payrolls and rosters"],
                ["/guides", "Cap, tax and trade explainers"],
                ["/", "Today's games and live scores"],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 font-medium text-gray-700 transition hover:border-court hover:text-court"
                >
                  {label}
                  <span aria-hidden className="text-gray-300">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
