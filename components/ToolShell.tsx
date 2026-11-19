import Link from "next/link";
import type { ReactNode } from "react";
import { relatedTools, SITE_URL } from "@/lib/tools";

type Faq = { q: string; a: string };
type Step = { title: string; body: string };

type Props = {
  title: string;
  description: string;
  icon: string;
  slug: string;
  children: ReactNode;
  steps: Step[];
  faqs: Faq[];
};

export default function ToolShell({ title, description, icon, slug, children, steps, faqs }: Props) {
  const related = relatedTools(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: title,
        description,
        url: `${SITE_URL}/${slug}`,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
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
      {/* Hero */}
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
          <span>{icon}</span> Free tool · No signup
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-gray-600">{description}</p>
      </div>

      {/* Tool */}
      <section className="card p-5 sm:p-7">{children}</section>

      {/* How it works */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-ink">How it works</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="card p-5">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-court text-sm font-bold text-white">
                {i + 1}
              </div>
              <h3 className="font-bold text-ink">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mt-12">
        <h2 className="text-2xl font-bold text-ink">Frequently asked questions</h2>
        <div className="mt-5 space-y-3">
          {faqs.map((faq) => (
            <details key={faq.q} className="card group p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-ink">
                {faq.q}
                <span className="text-gray-400 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Related tools */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-ink">More free tools</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {related.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="card flex items-center gap-3 p-4 transition hover:border-court hover:shadow-md"
            >
              <span className="text-2xl">{tool.icon}</span>
              <div>
                <div className="font-bold text-ink">{tool.title}</div>
                <div className="text-xs text-gray-500">{tool.category}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
