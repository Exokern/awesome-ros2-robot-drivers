import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

import { buildQualityMetrics, evaluateQualityGates } from "./quality-gates.mjs";

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
  const text = Array.isArray(value)
    ? value.map((item) => typeof item === "object" ? `${item.type}:${item.url}` : item).join("; ")
    : String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function renderJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function normalizeSearchText(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9.+#-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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

function buildSearchIndex(data) {
  return data.entries.map((entry) => {
    const searchParts = [
      entry.name,
      entry.repo,
      entry.category,
      entry.description,
      ...entry.hardware,
      entry.source_status,
      entry.review_status,
      entry.license,
      entry.notes,
    ];

    return {
      name: entry.name,
      repo: entry.repo,
      url: entry.url,
      category: entry.category,
      hardware: entry.hardware,
      ros2_native: entry.ros2_native,
      source_status: entry.source_status,
      review_status: entry.review_status,
      license: entry.license,
      last_checked: entry.last_checked,
      evidence_count: entry.evidence.length,
      search_text: normalizeSearchText(searchParts.join(" ")),
    };
  });
}

function buildHardwareMap(data) {
  const entriesByHardware = new Map();
  for (const entry of data.entries) {
    for (const hardware of entry.hardware) {
      if (!entriesByHardware.has(hardware)) entriesByHardware.set(hardware, []);
      entriesByHardware.get(hardware).push({
        name: entry.name,
        repo: entry.repo,
        url: entry.url,
        category: entry.category,
      });
    }
  }

  return [...entriesByHardware.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([hardware, entries]) => ({
      hardware,
      entry_count: entries.length,
      entries: entries.sort((a, b) => a.name.localeCompare(b.name)),
    }));
}

function buildSummary(data) {
  const quality = evaluateQualityGates(data);
  const qualityMetrics = buildQualityMetrics(data);

  return {
    schema_version: data.schema_version,
    reviewed_at: data.reviewed_at,
    entry_count: data.entries.length,
    category_count: data.categories.length,
    counts_by_category: qualityMetrics.counts_by_category,
    counts_by_source_status: countBy(data.entries, (entry) => entry.source_status),
    counts_by_review_status: countBy(data.entries, (entry) => entry.review_status),
    counts_by_license: countBy(data.entries, (entry) => entry.license),
    license_follow_up_repos: qualityMetrics.license_follow_up_repos,
    low_coverage_categories: qualityMetrics.low_coverage_categories,
    stale_entry_repos: qualityMetrics.stale_entry_repos,
    oldest_review_age_days_by_category: qualityMetrics.oldest_review_age_days_by_category,
    quality_gates: {
      passed: quality.passed,
      thresholds: quality.thresholds,
      gates: quality.gates,
    },
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
    "evidence",
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
    "dist/hardware-map.json": renderJson(buildHardwareMap(data)),
    "dist/index.json": renderJson(data),
    "dist/search-index.json": renderJson(buildSearchIndex(data)),
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
