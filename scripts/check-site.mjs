import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

await import("./build-site.mjs");

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, "_site");
const requiredFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "exokern-wordmark.png",
  "favicon.png",
  "social-preview.png",
  "fonts/inter-latin-var.woff2",
  "fonts/jetbrains-mono-latin-var.woff2",
  ".nojekyll",
  "data/index.json",
];
const failures = [];

for (const relativePath of requiredFiles) {
  if (!existsSync(join(output, relativePath))) failures.push(`Missing site artifact: ${relativePath}`);
}

const html = readFileSync(join(output, "index.html"), "utf8");
const app = readFileSync(join(output, "app.js"), "utf8");
const data = JSON.parse(readFileSync(join(output, "data", "index.json"), "utf8"));

for (const marker of ["id=\"search\"", "id=\"results\"", "id=\"category-filter\"", "social-preview.png", "data/index.json"]) {
  if (!html.includes(marker) && !app.includes(marker)) failures.push(`Site is missing required marker: ${marker}`);
}

if (!Array.isArray(data.entries) || data.entries.length === 0) failures.push("Site data contains no entries");
if (!Array.isArray(data.categories) || data.categories.length === 0) failures.push("Site data contains no categories");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Valid Pages artifact: ${data.entries.length} entries across ${data.categories.length} categories`);
