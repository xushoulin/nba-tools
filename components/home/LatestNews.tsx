import Link from "next/link";
import NewsRow from "@/components/news/NewsRow";
import { formatDayHeading, dayKeyET, latestNews } from "@/lib/news";

/**
 * Three headlines on the homepage. Static, built from the same snapshot as
 * /news, so it costs no request and works with JavaScript disabled.
 */
export default function LatestNews() {
  const items = latestNews(3);
  if (!items.length) return null;

  const day = dayKeyET(items[0].published);

  return (
    <section id="news" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-ink">Where does the NBA news come from?</h2>
          <p className="mt-2 max-w-2xl text-gray-600">
            NBA Tools news is a dated snapshot of 3 stories for{" "}
            {formatDayHeading(day).replace(/, \d{4}$/, "")}, with headlines, summaries, publication times and
            the original ESPN link for every item. The archive keeps 180 reports from the previous 30 days.
            According to ESPN&apos;s public news feed, each item has a headline, summary and publication time;
            no story is presented as an NBA Tools original. For example, a game recap links back to the
            original ESPN report. Using the verified snapshot, the build keeps the last checked stories when
            the feed is unavailable.
          </p>
        </div>
        <Link
          href="/news"
          className="rounded-xl bg-ink px-5 py-2.5 font-semibold text-white transition hover:bg-gray-800"
        >
          All NBA news →
        </Link>
      </div>

      <ul className="mt-6 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white px-4">
        {items.map((item) => (
          <NewsRow key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}
