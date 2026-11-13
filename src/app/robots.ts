import type { MetadataRoute } from "next";
import { SITE_URL } from "@/utils/site";

// Crawlers for Google and the main AI assistants / AI search engines.
// The marketing page is open to all of them; the app screens under /craft
// only make sense with an in-memory dataset, so they are not indexable.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/craft/"] },
      { userAgent: AI_CRAWLERS, allow: ["/", "/llms.txt"], disallow: ["/craft/"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
