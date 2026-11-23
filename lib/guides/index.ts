import type { Guide } from "./types";
import { guide as salaryCap } from "./how-nba-salary-cap-works";
import { guide as luxuryTax } from "./nba-luxury-tax-explained";
import { guide as apron } from "./nba-apron-rules-explained";
import { guide as freeAgency } from "./nba-free-agency-bird-rights";
import { guide as tradeRules } from "./nba-trade-rules-explained";
import { guide as draftPicks } from "./nba-draft-pick-trade-rules";
import { guide as contracts } from "./nba-contract-types-explained";
import { guide as advancedStats } from "./nba-advanced-stats-explained";
import { guide as fantasy } from "./fantasy-basketball-scoring-systems";

export type { Guide, Section, Block } from "./types";

/**
 * Display order follows the order a reader should learn the system:
 * the cap, then the tax, then the aprons, then the mechanisms that spend
 * that money, then the analytical layer.
 */
export const GUIDES: Guide[] = [
  salaryCap,
  luxuryTax,
  apron,
  freeAgency,
  tradeRules,
  draftPicks,
  contracts,
  advancedStats,
  fantasy,
];

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
