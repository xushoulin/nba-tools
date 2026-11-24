import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import NewsRow from "@/components/news/NewsRow";
import TeamLogo from "@/components/teams/TeamLogo";
import {
  dayKeyET,
  formatDateTimeET,
  formatDayHeading,
  formatTimeET,
  getNewsItem,
  kindMeta,
  newsSlugs,
  relatedNews,
  teamsForItem,
} from "@/lib/news";
import { LEAGUE, STATUS_COLOR, STATUS_LABEL } from "@/lib/salary-data";
import { teamSummary } from "@/lib/team-view";
import { SITE_NAME, SITE_URL } from "@/lib/tools";

export const dynamicParams = false;

export function generateStaticParams() {
  return newsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getNewsItem(slug);
  if (!item) return {};

  // The description has to say what this page is, not just repeat the headline,
  // so the snippet does not read like ESPN's own article.
  const description = `${item.summary.split(/(?<=\.)\s/)[0]} — headline and summary from ESPN, with a link to the original report.`;

  return {
    title: item.title,
    description: description.slice(0, 300),
    alternates: { canonical: `/news/${item.slug}` },
    openGraph: {
      type: "article",
      title: item.title,
      description: description.slice(0, 300),
      url: `/news/${item.slug}`,
      publishedTime: item.published,
      modifiedTime: item.updated,
      images: item.image ? [item.image.url] : undefined,
    },
    other: {
      // Makes the provenance explicit for anything that reads the head.
      "article:source": "ESPN",
      "article:source-url": item.url,
    },
  };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getNewsItem(slug);
  if (!item) notFound();

  const pageUrl = `${SITE_URL}/news/${item.slug}`;
  const meta = kindMeta(item.kind);
  const dayKey = dayKeyET(item.published);
  const teams = teamsForItem(item);
  const related = relatedNews(item, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsArticle",
        headline: item.title,
        description: item.summary,
        datePublished: item.published,
        dateModified: item.updated,
        articleSection: meta.label,
        inLanguage: "en",
        url: pageUrl,
        mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
        // The reporting is ESPN's. Saying so in the markup is the same claim the
        // page makes in words, and it keeps the citation machine-readable.
        author: item.author
          ? { "@type": "Person", name: item.author }
          : { "@type": "Organization", name: "ESPN", url: "https://www.espn.com/nba/" },
        creditText: "ESPN",
        isBasedOn: item.url,
        citation: item.url,
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        isAccessibleForFree: true,
        ...(item.image ? { image: [item.image.url] } : {}),
        ...(teams.length
          ? { about: teams.map((team) => ({ "@type": "SportsTeam", name: `${team.city} ${team.name}` })) }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "News", item: `${SITE_URL}/news` },
          { "@type": "ListItem", position: 3, name: item.title, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-court">
          Home
        </Link>
        <span aria-hidden>/</span>
        <Link href="/news" className="hover:text-court">
          News
        </Link>
        <span aria-hidden>/</span>
        <Link href={`/news#${dayKey}`} className="hover:text-court">
          {formatDayHeading(dayKey)}
        </Link>
      </nav>

      <article>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset ${meta.className}`}
          >
            {meta.label}
          </span>
          <time dateTime={item.published} className="font-medium text-gray-500">
            {formatTimeET(item.published)}
          </time>
          {item.matchup && <span className="text-gray-400">· {item.matchup}</span>}
        </div>

        <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
          {item.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-gray-200 pb-4 text-sm text-gray-500">
          {item.author && (
            <>
              <span className="font-medium text-gray-700">{item.author}</span>
              <span aria-hidden>·</span>
            </>
          )}
          <time dateTime={item.published}>{formatDateTimeET(item.published)}</time>
          <span aria-hidden>·</span>
          <span>Source: ESPN</span>
        </div>

        {/* The attribution block. Deliberately above the story, not in a footer. */}
        <aside className="mt-5 rounded-2xl border border-orange-200 bg-orange-50/60 p-5">
          <h2 className="text-xs font-bold uppercase tracking-wide text-orange-700">Source and citation</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            This story was reported and published by{" "}
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-court hover:underline"
            >
              ESPN
              <span aria-hidden> ↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            . NBA Tools quotes the headline and ESPN&apos;s own summary, then adds payroll context from its own
            data. We do not republish the full article.
          </p>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-court px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Read the full story on ESPN
            <span aria-hidden>↗</span>
          </a>
        </aside>

        {item.image && (
          <figure className="mt-6">
            <div className="overflow-hidden rounded-2xl bg-gray-100">
              <img
                src={item.image.url}
                alt={item.image.alt || item.title}
                width={1296}
                height={729}
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                className="h-auto w-full object-cover"
              />
            </div>
            <figcaption className="mt-2 text-xs text-gray-500">
              {item.image.credit ? `${item.image.credit} · ` : ""}
              Image via ESPN
            </figcaption>
          </figure>
        )}

        <section className="mt-8">
          <h2 className="text-xl font-bold text-ink">What the report says</h2>
          <figure className="mt-3 rounded-2xl border-l-4 border-court bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <p className="text-xs font-bold uppercase tracking-wide text-orange-700">Summary from ESPN</p>
            <blockquote className="mt-2 text-base leading-relaxed text-gray-800">{item.summary}</blockquote>
            <figcaption className="mt-3 text-xs text-gray-500">
              — {item.author ? `${item.author}, ` : ""}ESPN, {formatDateTimeET(item.published)}
            </figcaption>
          </figure>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-ink">The record for this story</h2>
          <dl className="mt-3 grid gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 text-sm sm:grid-cols-2">
            <div className="bg-white px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">Published (ET)</dt>
              <dd className="mt-1 font-medium text-ink">{formatDateTimeET(item.published)}</dd>
            </div>
            <div className="bg-white px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">Wire type</dt>
              <dd className="mt-1 font-medium text-ink">{meta.note}</dd>
            </div>
            <div className="bg-white px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">Reporter</dt>
              <dd className="mt-1 font-medium text-ink">{item.author ?? "Not credited — ESPN wire"}</dd>
            </div>
            <div className="bg-white px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">Tags</dt>
              <dd className="mt-1 flex flex-wrap gap-1.5">
                {teams.length
                  ? teams.map((team) => (
                      <Link
                        key={team.id}
                        href={`/teams/${team.id}`}
                        className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700 hover:bg-orange-50 hover:text-court"
                      >
                        {team.city} {team.name}
                      </Link>
                    ))
                  : <span className="text-gray-500">League-wide</span>}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-gray-500">
            Original article:{" "}
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-court hover:underline"
            >
              {item.url.replace(/^https:\/\//, "")}
            </a>
          </p>
        </section>

        {teams.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-ink">Payroll context</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
              What the teams in this story are working with in {LEAGUE.season}. Figures are the published cap
              hit from the{" "}
              <a
                href="https://www.hoopshype.com/salaries/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-court hover:underline"
              >
                HoopsHype salary snapshot
                <span aria-hidden> ↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              , measured against the NBA&apos;s announced thresholds — the same numbers behind the{" "}
              <Link href="/salary-cap-calculator" className="font-semibold text-court hover:underline">
                salary cap calculator
              </Link>
              .
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {teams.map((team) => {
                const summary = teamSummary(team);
                const top = [...team.players].sort((a, b) => b.salary - a.salary).slice(0, 2);
                return (
                  <article key={team.id} className="card p-5">
                    <div className="flex items-start gap-3">
                      <TeamLogo abbr={team.abbr} size={40} />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold leading-tight text-ink">
                          <Link href={`/teams/${team.id}`} className="hover:text-court">
                            {team.city} {team.name}
                          </Link>
                        </h3>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {team.conference}ern Conference · {team.division}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUS_COLOR[summary.status]}`}
                      >
                        {STATUS_LABEL[summary.status]}
                      </span>
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Cap hit
                        </dt>
                        <dd className="mt-0.5 font-bold tabular-nums text-ink">
                          ${summary.official.toFixed(1)}M
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          vs tax line
                        </dt>
                        <dd
                          className={`mt-0.5 font-bold tabular-nums ${
                            summary.taxDelta >= 0 ? "text-rose-600" : "text-emerald-600"
                          }`}
                        >
                          {summary.taxDelta >= 0 ? "+" : "−"}${Math.abs(summary.taxDelta).toFixed(1)}M
                        </dd>
                      </div>
                    </dl>
                    {top.length > 0 && (
                      <p className="mt-3 border-t border-gray-100 pt-3 text-xs leading-relaxed text-gray-500">
                        Largest listed contracts:{" "}
                        {top
                          .map((player) => `${player.name} $${player.salary.toFixed(1)}M`)
                          .join(", ")}
                      </p>
                    )}
                    <Link
                      href={`/teams/${team.id}`}
                      className="mt-3 inline-block text-xs font-semibold text-court hover:underline"
                    >
                      Full payroll and roster →
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-ink">More NBA news</h2>
            <ul className="mt-2 divide-y divide-gray-100">
              {related.map((other) => (
                <NewsRow key={other.id} item={other} />
              ))}
            </ul>
            <Link href="/news" className="mt-2 inline-block text-sm font-semibold text-court hover:underline">
              All of today&apos;s NBA news →
            </Link>
          </section>
        )}

        <footer className="mt-10 rounded-xl border border-gray-200 bg-white p-4 text-xs leading-relaxed text-gray-500">
          Headline and summary © ESPN, quoted here for commentary and reference with a link to the original.
          Payroll figures from the HoopsHype {LEAGUE.season} snapshot and the NBA&apos;s published cap
          thresholds. NBA Tools is an independent project and is not affiliated with ESPN, the NBA or its teams.
          See the{" "}
          <Link href="/disclaimer" className="text-court hover:underline">
            disclaimer
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-court hover:underline">
            privacy policy
          </Link>
          .
        </footer>
      </article>
    </main>
  );
}
