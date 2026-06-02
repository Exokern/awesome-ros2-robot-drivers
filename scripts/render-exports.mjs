import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const indexPath = new URL("../data/index.json", import.meta.url);
const distDir = new URL("../dist/", import.meta.url);

function countBy(items, getKey) {
  const counts = {};
  for (const item of items) {
    const value = getKey(item) || "unknown";
    counts[value] = (counts[value] || 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
}

function csvEscape(value) {
  const text = Array.isArray(value) ? value.join("; ") : String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function renderJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function categoryCounts(data) {
  return Object.fromEntries(
    data.categories.map((category) => [
      category.id,
      data.entries.filter((entry) => entry.category === category.id).length,
    ]),
  );
}

function buildCategories(data) {
  return data.categories.map((category) => {
    const entries = data.entries.filter((entry) => entry.category === category.id);
    return {
      ...category,
      entry_count: entries.length,
      source_status_counts: countBy(entries, (entry) => entry.source_status),
      review_status_counts: countBy(entries, (entry) => entry.review_status),
      license_follow_up_count: entries.filter((entry) => entry.license === "NOASSERTION").length,
      license_follow_up_repos: entries
        .filter((entry) => entry.license === "NOASSERTION")
        .map((entry) => entry.repo)
        .sort((a, b) => a.localeCompare(b)),
    };
  });
}

function buildSummary(data) {
  const lowCoverageThreshold = 3;
  const countsByCategory = categoryCounts(data);

  return {
    schema_version: data.schema_version,
    reviewed_at: data.reviewed_at,
    entry_count: data.entries.length,
    category_count: data.categories.length,
    counts_by_category: countsByCategory,
    counts_by_source_status: countBy(data.entries, (entry) => entry.source_status),
    counts_by_review_status: countBy(data.entries, (entry) => entry.review_status),
    counts_by_license: countBy(data.entries, (entry) => entry.license),
    license_follow_up_repos: data.entries
      .filter((entry) => entry.license === "NOASSERTION")
      .map((entry) => entry.repo)
      .sort((a, b) => a.localeCompare(b)),
    low_coverage_categories: data.categories
      .filter((category) => countsByCategory[category.id] < lowCoverageThreshold)
      .map((category) => category.id),
  };
}

function renderEntriesCsv(data) {
  const fields = [
    "name",
    "repo",
    "url",
    "category",
    "description",
    "hardware",
    "ros2_native",
    "source_status",
    "review_status",
    "license",
    "last_checked",
    "notes",
  ];
  const header = fields.join(",");
  const rows = data.entries.map((entry) => fields.map((field) => csvEscape(entry[field])).join(","));
  return `${[header, ...rows].join("\n")}\n`;
}

export function buildExports(data) {
  return {
    "dist/categories.json": renderJson(buildCategories(data)),
    "dist/entries.csv": renderEntriesCsv(data),
    "dist/index.json": renderJson(data),
    "dist/summary.json": renderJson(buildSummary(data)),
  };
}

export function writeExports(data) {
  mkdirSync(distDir, { recursive: true });
  for (const [relativePath, content] of Object.entries(buildExports(data))) {
    writeFileSync(new URL(`../${relativePath}`, import.meta.url), content);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const data = JSON.parse(readFileSync(indexPath, "utf8"));
  writeExports(data);
  console.log("Generated machine-readable exports in dist/");
}
