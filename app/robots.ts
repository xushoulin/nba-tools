import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/tools";

export const dynamic = "force-static";

const ALLOW_AI = [
  // Domestic search indexes that feed Doubao / Ernie / Yuanbao / Qwen / Kimi / DeepSeek
  "Bytespider",
  "Baiduspider",
  "Sogou web spider",
  "YisouSpider",
  "360Spider",
  "ToutiaoSpider",
  "Bingbot",
  "Googlebot",
  // Overseas AI search crawlers
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "PerplexityBot",
  "Google-Extended",
  "GoogleOther",
  "Applebot-Extended",
  "Amazonbot",
  "FacebookBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      ...ALLOW_AI.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
