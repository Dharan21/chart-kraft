export const SITE_NAME = "Chart Craft";

// Set NEXT_PUBLIC_SITE_URL to the deployed origin (e.g. https://chartcraft.app)
// so canonical URLs, the sitemap and social previews point at production.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
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
