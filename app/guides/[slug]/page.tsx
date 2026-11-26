import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GuideBody from "@/components/guides/GuideBody";
import { GUIDES, getGuide, guideSlugs } from "@/lib/guides";
import {SITE_NAME, SITE_URL, getTool, OG_IMAGE} from "@/lib/tools";

export const dynamicParams = false;

export function generateStaticParams() {
  return guideSlugs().map((slug) => ({ slug }));
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  // The layout template appends " | NBA Tools", so keep the visible title
  // short enough that search engines do not cut it mid-word. The full title
  // still appears as the page's h1 and in the article body.
  const title = guide.title.length > 45 ? `${guide.title.slice(0, 42).trimEnd()}…` : guide.title;
  const description = guide.description.slice(0, 155);

  return {
    title,
    description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/guides/${guide.slug}`,
      publishedTime: guide.published,
      modifiedTime: guide.updated ,
      images: OG_IMAGE,
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const url = `${SITE_URL}/guides/${guide.slug}`;
  const relatedTools = guide.tools.map(getTool).filter((t): t is NonNullable<typeof t> => Boolean(t));
  // The four guides that follow this one in reading order, wrapping at the end.
  const guideIndex = GUIDES.findIndex((g) => g.slug === guide.slug);
  const otherGuides = [1, 2, 3, 4].map((step) => GUIDES[(guideIndex + step) % GUIDES.length]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.title,
        description: guide.description,
        datePublished: guide.published,
        dateModified: guide.updated,
        inLanguage: "en",
        author: { "@type": "Organization", name: SITE_NAME, url: `${SITE_URL}/about` },
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        isAccessibleForFree: true,
        about: guide.takeaways[0],
      },
      {
        "@type": "FAQPage",
        mainEntity: guide.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
          { "@type": "ListItem", position: 3, name: guide.shortTitle, item: url },
        ],
      },
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-court">Home</Link>
        <span aria-hidden>/</span>
        <Link href="/guides" className="hover:text-court">Guides</Link>
        <span aria-hidden>/</span>
        <span className="text-gray-700">{guide.shortTitle}</span>
      </nav>

      <header className="max-w-3xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
          <span>{guide.icon}</span> Explainer · Updated {formatDate(guide.updated)}
        </div>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
          {guide.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">{guide.dek}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
          <span>{guide.readingMinutes} min read</span>
          <span aria-hidden>·</span>
          <Link href="/about" className="hover:text-court">By the {SITE_NAME} team</Link>
          <span aria-hidden>·</span>
          <span>2026-27 league rules</span>
        </div>
      </header>

      <div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
        <article className="max-w-3xl">
          {/* Direct answers first: these are the sentences a summary should lift. */}
          <section className="card border-orange-100 bg-orange-50/50 p-5 sm:p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-orange-700">The short version</h2>
            <ul className="mt-3 space-y-2.5 text-[15px] leading-7 text-gray-800">
              {guide.takeaways.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span aria-hidden className="mt-1 shrink-0 text-court">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {guide.sections.map((section) => (
            <section key={section.id} id={section.id} className="mt-12 scroll-mt-24">
              <h2 className="border-b border-gray-200 pb-2 text-2xl font-bold text-ink">{section.heading}</h2>
              <GuideBody blocks={section.blocks} />
            </section>
          ))}

          <section id="faq" className="mt-14 scroll-mt-24">
            <h2 className="text-2xl font-bold text-ink">Frequently asked questions</h2>
            <div className="mt-5 space-y-3">
              {guide.faqs.map((faq) => (
                <details key={faq.q} className="card group p-5 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-ink">
                    {faq.q}
                    <span className="text-gray-400 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-gray-700">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-12 rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="text-base font-bold text-ink">About this guide</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Written and maintained by the independent developer behind {SITE_NAME}. League thresholds are the
              official 2026-27 figures; payroll examples are modelled from the published CBA rules. The
              calculation source is public on{" "}
              <a
                href="https://github.com/xushoulin/nba-tools"
                target="_blank"
                rel="noopener noreferrer"
                className="text-court hover:underline"
              >
                GitHub
              </a>
              . Last updated {formatDate(guide.updated)}. See the{" "}
              <Link href="/disclaimer" className="text-court hover:underline">disclaimer</Link> — this is
              reference material, not an official league document.
            </p>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-bold text-ink">Put this into practice</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {relatedTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  className="card flex items-center gap-3 p-4 transition hover:border-court hover:shadow-md"
                >
                  <span className="text-2xl">{tool.icon}</span>
                  <div>
                    <div className="font-bold text-ink">{tool.title}</div>
                    <div className="text-xs text-gray-500">{tool.category} · free, no signup</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-bold text-ink">Keep reading</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {otherGuides.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guides/${g.slug}`}
                  className="card flex items-start gap-3 p-4 transition hover:border-court hover:shadow-md"
                >
                  <span className="text-xl">{g.icon}</span>
                  <div>
                    <div className="font-bold leading-snug text-ink">{g.shortTitle}</div>
                    <div className="mt-1 text-xs text-gray-500">{g.readingMinutes} min read</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">On this page</p>
            <nav className="mt-3 space-y-1.5 border-l border-gray-200 pl-3 text-sm">
              {guide.sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block py-0.5 text-gray-600 transition hover:text-court"
                >
                  {section.heading}
                </a>
              ))}
              <a href="#faq" className="block py-0.5 text-gray-600 transition hover:text-court">
                FAQ
              </a>
            </nav>
          </div>
        </aside>
      </div>
    </main>
  );
}
