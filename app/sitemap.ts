import type { MetadataRoute } from "next";
import { TOOLS, SITE_URL } from "@/lib/tools";

export const dynamic = "force-static";
import { INITIAL_TEAMS } from "@/lib/salary-data";
import { allPlayerSlugs } from "@/lib/player-profiles";
import { GUIDES, GUIDES_UPDATED } from "@/lib/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/about", "/privacy", "/terms", "/contact", "/disclaimer"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.5,
  }));
  const tools = TOOLS.map((tool) => ({
    url: `${SITE_URL}/${tool.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  const teamsIndex = {
    url: `${SITE_URL}/teams`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  };
  const teamPages = INITIAL_TEAMS.map((t) => ({
    url: `${SITE_URL}/teams/${t.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  const playerPages = allPlayerSlugs().map((slug) => ({
    url: `${SITE_URL}/players/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const guidesUpdated = new Date(`${GUIDES_UPDATED}T00:00:00Z`);
  const guidesIndex = {
    url: `${SITE_URL}/guides`,
    lastModified: guidesUpdated,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  };
  const guidePages = GUIDES.map((g) => ({
    url: `${SITE_URL}/guides/${g.slug}`,
    lastModified: new Date(`${g.updated}T00:00:00Z`),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  return [...pages, teamsIndex, guidesIndex, ...tools, ...guidePages, ...teamPages, ...playerPages];
}
