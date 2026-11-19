import type { MetadataRoute } from "next";
import { TOOLS, SITE_URL } from "@/lib/tools";
import { INITIAL_TEAMS } from "@/lib/salary-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/about", "/privacy", "/terms", "/contact"].map((path) => ({
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
  return [...pages, teamsIndex, ...tools, ...teamPages];
}
