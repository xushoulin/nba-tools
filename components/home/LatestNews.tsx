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
          <h2 className="text-2xl font-bold text-ink">Latest NBA news</h2>
          <p className="mt-2 max-w-2xl text-gray-600">
            Headlines, reports and game recaps for {formatDayHeading(day).replace(/, \d{4}$/, "")} — each
            credited to ESPN with a link to the original report.
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
