import Link from "next/link";
import { formatTimeET, kindMeta, type NewsItem } from "@/lib/news";

/**
 * One story in a day group.
 *
 * Two links per row on purpose: the headline opens our own page, and the small
 * "ESPN" attribution goes straight to the original. Keeping them separate means
 * the source is visible and clickable without swallowing the headline, and it
 * avoids nesting one anchor inside another.
 */
export default function NewsRow({ item }: { item: NewsItem }) {
  const meta = kindMeta(item.kind);
  // No named reporter: the source link right beside it already says ESPN, so a
  // bare "ESPN" byline would just repeat the label.
  const byline = item.author ? `${item.author} / ESPN` : null;

  return (
    <li className="-mx-3 rounded-xl px-3 transition hover:bg-gray-50">
      <article className="flex gap-4 py-5">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset ${meta.className}`}
            >
              {meta.label}
            </span>
            <time dateTime={item.published} className="font-medium text-gray-500">
              {formatTimeET(item.published)}
            </time>
            {item.matchup && (
              <span className="hidden truncate text-gray-400 sm:inline">· {item.matchup}</span>
            )}
          </div>

          <h3 className="mt-2 text-base font-bold leading-snug text-ink sm:text-lg">
            <Link href={`/news/${item.slug}/`} className="hover:text-court">
              {item.title}
            </Link>
          </h3>

          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-gray-600">{item.summary}</p>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
            {byline && <span>{byline}</span>}
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-gray-600 hover:text-court hover:underline"
            >
              Original on ESPN
              <span aria-hidden>↗</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>

        {item.image && (
          <div className="hidden w-36 shrink-0 sm:block lg:w-44">
            <div className="aspect-[3/2] overflow-hidden rounded-xl bg-gray-100">
              {/* Hot-linked from the ESPN CDN with credit on the detail page. */}
              <img
                src={item.image.url}
                alt={item.image.alt || ""}
                width={176}
                height={117}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
      </article>
    </li>
  );
}
