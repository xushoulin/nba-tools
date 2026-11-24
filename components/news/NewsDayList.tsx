import Link from "next/link";
import NewsRow from "@/components/news/NewsRow";
import TodayBadge from "@/components/news/TodayBadge";
import { NEWS_SOURCE, type NewsDay } from "@/lib/news";

/** Day-by-day list. Every heading carries its own date and story count. */
export default function NewsDayList({ days }: { days: NewsDay[] }) {
  if (!days.length) {
    return (
      <div className="card p-6">
        <h2 className="font-bold text-ink">No stories in the current snapshot</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          The ESPN feed could not be read when this page was last built, and rather than show a headline we
          cannot attribute we show nothing. The source is always available directly:{" "}
          <a
            href={NEWS_SOURCE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-court hover:underline"
          >
            ESPN NBA news ↗
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {days.map((day) => (
        <section key={day.key} id={day.key} className="scroll-mt-24 py-8 first:pt-0">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-gray-200 pb-2">
            <h2 className="text-base font-bold text-ink sm:text-lg">
              <time dateTime={day.key}>{day.heading}</time>
            </h2>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
              <TodayBadge dayKey={day.key} />
              <span>
                {day.items.length} {day.items.length === 1 ? "story" : "stories"}
              </span>
            </div>
          </div>
          <ul className="divide-y divide-gray-100">
            {day.items.map((item) => (
              <NewsRow key={item.id} item={item} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** Small outbound link used wherever we credit ESPN in body copy. */
export function SourceLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={NEWS_SOURCE.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`font-semibold text-court hover:underline ${className}`}
    >
      ESPN NBA
      <span aria-hidden> ↗</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/** Archive-style jump list of every day in the snapshot. */
export function DayJumpList({ days }: { days: NewsDay[] }) {
  return (
    <nav aria-label="Jump to a day" className="flex flex-wrap gap-2 text-xs font-semibold">
      {days.map((day) => (
        <Link
          key={day.key}
          href={`#${day.key}`}
          className="rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-600 transition hover:border-court hover:text-court"
        >
          {day.heading.replace(/, \d{4}$/, "")}
          <span className="ml-1 font-normal text-gray-400">{day.items.length}</span>
        </Link>
      ))}
    </nav>
  );
}
