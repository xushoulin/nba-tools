import type { Metadata } from "next";
import Link from "next/link";
import NewsDayList, { DayJumpList } from "@/components/news/NewsDayList";
import { NEWS_ITEMS, NEWS_SOURCE, newsDays } from "@/lib/news";
import {SITE_URL, OG_IMAGE} from "@/lib/tools";

export const metadata: Metadata = {
  title: "NBA News Archive — Every Story, With Its Source",
  description:
    "Every NBA headline, report and game recap kept by NBA Tools, grouped by publication date. Each entry is credited to ESPN and links to the original article.",
  alternates: { canonical: "/news/archive" },
  openGraph: { url: "/news/archive", images: OG_IMAGE },
  // A convenience view of stories already listed on /news. Keep it linkable
  // for readers, but let Google index a single copy of that content.
  robots: { index: false, follow: true },
};

export default function NewsArchive() {
  const days = newsDays();
  const oldest = days[days.length - 1];

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-court">
          Home
        </Link>
        <span aria-hidden>/</span>
        <Link href="/news" className="hover:text-court">
          News
        </Link>
        <span aria-hidden>/</span>
        <span className="text-gray-700">Archive</span>
      </nav>

      <header className="max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">NBA news archive</h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">
          {days.length} {days.length === 1 ? "day" : "days"} of NBA coverage, newest first
          {oldest ? `, back to ${oldest.heading}` : ""}. Each entry keeps its original source and link, so a
          story can always be traced back to the report it came from.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          This archive holds roughly the last 30 days. Older items are dropped when the snapshot is rebuilt —
          they remain available at{" "}
          <a
            href={NEWS_SOURCE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-court hover:underline"
          >
            ESPN NBA
            <span aria-hidden> ↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          .
        </p>
      </header>

      {days.length > 1 && (
        <div className="mt-6 border-y border-gray-200 py-4">
          <DayJumpList days={days} />
        </div>
      )}

      <div className="mt-2">
        <NewsDayList days={days} />
      </div>

      <p className="mt-10 text-sm text-gray-600">
        {NEWS_ITEMS.length} archived {NEWS_ITEMS.length === 1 ? "story" : "stories"}. Back to{" "}
        <Link href="/news" className="font-semibold text-court hover:underline">
          today&apos;s NBA news
        </Link>
        .
      </p>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "NBA News Archive",
            url: `${SITE_URL}/news/archive`,
            numberOfItems: NEWS_ITEMS.length,
            isPartOf: { "@type": "WebSite", name: "NBA Tools", url: `${SITE_URL}/` },
            citation: NEWS_SOURCE.url,
          }).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
