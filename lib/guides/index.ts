import type { Guide } from "./types";
import { guide as salaryCap } from "./how-nba-salary-cap-works";
import { guide as luxuryTax } from "./nba-luxury-tax-explained";
import { guide as tradeRules } from "./nba-trade-rules-explained";
import { guide as contracts } from "./nba-contract-types-explained";

export type { Guide, Section, Block } from "./types";

export const GUIDES: Guide[] = [salaryCap, luxuryTax, tradeRules, contracts];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function guideSlugs(): string[] {
  return GUIDES.map((g) => g.slug);
}

/** Guides that support a given tool, used for cross-linking from tool pages. */
export function guidesForTool(toolSlug: string): Guide[] {
  return GUIDES.filter((g) => g.tools.includes(toolSlug));
}

/** Last content update across all guides, used for sitemap lastmod. */
export const GUIDES_UPDATED = GUIDES.map((g) => g.updated).sort().reverse()[0] ?? "2026-11-23";
