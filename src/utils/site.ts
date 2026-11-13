export const SITE_NAME = "Chart Craft";

// Canonical origin used for canonical URLs, the sitemap and social previews.
// Override with NEXT_PUBLIC_SITE_URL (e.g. a custom domain or local dev).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://chart-kraft.vercel.app"
).replace(/\/$/, "");

export const SITE_TITLE = "Chart Craft: Turn CSV files into charts in your browser";

export const SITE_DESCRIPTION =
  "Free online CSV chart maker. Upload a CSV, filter, sort and group your data, then build bar, line and pie charts. Everything runs in your browser, so your data never leaves your device.";

export const SITE_KEYWORDS = [
  "CSV to chart",
  "CSV chart maker",
  "CSV visualizer",
  "online data visualization",
  "bar chart from CSV",
  "line chart from CSV",
  "pie chart from CSV",
  "filter sort group CSV",
  "private data analysis",
];
