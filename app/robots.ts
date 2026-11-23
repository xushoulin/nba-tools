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

// AdSense crawlers. The generic "*" rule already allows "/", but spelling these
// out makes it explicit that ad matching and ad-quality checks are welcome.
const ALLOW_ADS = [
  "Mediapartners-Google", // matches page content to ads
  "AdsBot-Google", // landing-page quality review
  "AdsBot-Google-Mobile",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      ...ALLOW_AI.map((userAgent) => ({ userAgent, allow: "/" })),
      ...ALLOW_ADS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
