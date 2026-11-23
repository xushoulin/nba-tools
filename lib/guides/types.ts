/**
 * Content model for the long-form guides under /guides.
 *
 * Each guide is structured data rather than JSX so the sitemap, the guide
 * index, llms.txt and the article JSON-LD can all be generated from one source.
 * Blocks render through components/guides/GuideBody.tsx.
 */

export type Block =
  | { kind: "p"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "table"; head: string[]; rows: string[][]; caption?: string }
  | { kind: "note"; title?: string; text: string };

export type Section = {
  id: string;
  heading: string;
  blocks: Block[];
};

export type Guide = {
  slug: string;
  title: string;
  /** Short label for cards and navigation. */
  shortTitle: string;
  /** Meta description, 150-160 chars. */
  description: string;
  /** Standfirst: the direct answer, shown under the title. */
  dek: string;
  icon: string;
  published: string;
  updated: string;
  readingMinutes: number;
  /** Tool slugs this guide supports. Rendered as related links. */
  tools: string[];
  /** Direct answers at the top. These are the sentences an AI summary should lift. */
  takeaways: string[];
  sections: Section[];
  faqs: { q: string; a: string }[];
};
