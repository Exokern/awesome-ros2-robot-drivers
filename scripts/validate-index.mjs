import { readFileSync } from "node:fs";

import { renderCurationReport } from "./render-curation-report.mjs";
import { buildExports } from "./render-exports.mjs";
import { renderReadme } from "./render-readme.mjs";

const indexPath = new URL("../data/index.json", import.meta.url);
const readmePath = new URL("../README.md", import.meta.url);
const curationReportPath = new URL("../docs/curation-report.md", import.meta.url);

const data = JSON.parse(readFileSync(indexPath, "utf8"));
const readme = readFileSync(readmePath, "utf8");
const curationReport = readFileSync(curationReportPath, "utf8");
const failures = [];

const sourceStatuses = new Set(["official", "community", "vendor-adjacent", "legacy"]);
const reviewStatuses = new Set(["candidate", "curated", "legacy", "needs-review"]);

function fail(message) {
  failures.push(message);
}

function readGeneratedFile(relativePath) {
  try {
    return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") {
      fail(`${relativePath} is missing. Run \`npm run generate\`.`);
      return null;
    }
    throw error;
  }
}

function isPlainString(value) {
  return typeof value === "string" && value.trim() === value && value.length > 0 && !/[\r\n\t]/.test(value);
}

function isDate(value) {
  return isPlainString(value) && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function isSpdxish(value) {
  return value === "NOASSERTION" || value === "unknown" || /^[A-Za-z0-9.-]+(\s(AND|OR)\s[A-Za-z0-9.-]+)*$/.test(value);
}

if (data.schema_version !== "0.2") fail("schema_version must be 0.2");
if (!isDate(data.reviewed_at)) fail("reviewed_at must be YYYY-MM-DD");
if (!Array.isArray(data.categories) || data.categories.length === 0) fail("categories must be a non-empty array");
if (!Array.isArray(data.entries) || data.entries.length === 0) fail("entries must be a non-empty array");

const categories = new Map();
for (const [index, category] of (data.categories || []).entries()) {
  const label = category?.id || `category ${index + 1}`;
  if (!isPlainString(category?.id) || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(category.id)) {
    fail(`${label}: category id must be a lowercase slug`);
  }
  if (!isPlainString(category?.name)) fail(`${label}: missing string name`);
  if (!isPlainString(category?.description)) fail(`${label}: missing string description`);
  if (categories.has(category?.id)) fail(`${label}: duplicate category id`);
  categories.set(category?.id, category);
}

const seenRepos = new Set();
const seenUrls = new Set();
const entriesByCategory = new Map([...categories.keys()].map((category) => [category, []]));

for (const [index, entry] of (data.entries || []).entries()) {
  const label = entry?.repo || `entry ${index + 1}`;
  for (const key of ["name", "repo", "url", "category", "description", "source_status", "review_status", "license", "last_checked", "notes"]) {
    if (!isPlainString(entry?.[key])) fail(`${label}: missing clean string ${key}`);
  }
  if (entry?.url && !/^https:\/\/github\.com\/[^/\s]+\/[^/\s]+$/.test(entry.url)) {
    fail(`${label}: url must be a GitHub repository root URL without a trailing slash`);
  }
  if (entry?.repo && !/^[^/\s]+\/[^/\s]+$/.test(entry.repo)) fail(`${label}: repo must be owner/name`);
  if (entry?.repo && entry?.url && entry.url !== `https://github.com/${entry.repo}`) {
    fail(`${label}: url must match repo exactly`);
  }
  if (entry?.category && !categories.has(entry.category)) fail(`${label}: unknown category ${entry.category}`);
  if (entry?.source_status && !sourceStatuses.has(entry.source_status)) fail(`${label}: unknown source_status ${entry.source_status}`);
  if (entry?.review_status && !reviewStatuses.has(entry.review_status)) fail(`${label}: unknown review_status ${entry.review_status}`);
  if (typeof entry?.ros2_native !== "boolean") fail(`${label}: ros2_native must be boolean`);
  if (entry?.license && !isSpdxish(entry.license)) fail(`${label}: license must be SPDX-like, NOASSERTION, or unknown`);
  if (entry?.last_checked && !isDate(entry.last_checked)) fail(`${label}: last_checked must be YYYY-MM-DD`);
  if (data.reviewed_at && entry?.last_checked && entry.last_checked > data.reviewed_at) {
    fail(`${label}: last_checked cannot be later than reviewed_at`);
  }
  if (!Array.isArray(entry?.hardware) || entry.hardware.length === 0) {
    fail(`${label}: hardware must be a non-empty array`);
  } else {
    for (const [hardwareIndex, hardware] of entry.hardware.entries()) {
      if (!isPlainString(hardware)) fail(`${label}: hardware[${hardwareIndex}] must be a clean string`);
    }
  }
  if (entry?.repo) {
    const repo = entry.repo.toLowerCase();
    if (seenRepos.has(repo)) fail(`${label}: duplicate repo`);
    seenRepos.add(repo);
  }
  if (entry?.url) {
    const url = entry.url.toLowerCase();
    if (seenUrls.has(url)) fail(`${label}: duplicate url`);
    seenUrls.add(url);
    if (!readme.includes(entry.url)) fail(`${label}: README does not include URL`);
  }
  if (entriesByCategory.has(entry?.category)) entriesByCategory.get(entry.category).push(entry);
}

for (const category of categories.keys()) {
  if ((entriesByCategory.get(category) || []).length === 0) fail(`${category}: category has no entries`);
}

const renderedReadme = renderReadme(data);
if (readme !== renderedReadme) {
  fail("README.md is out of date. Run `npm run generate`.");
}

const renderedCurationReport = renderCurationReport(data);
if (curationReport !== renderedCurationReport) {
  fail("docs/curation-report.md is out of date. Run `npm run generate`.");
}

for (const [relativePath, expectedContent] of Object.entries(buildExports(data))) {
  const actualContent = readGeneratedFile(relativePath);
  if (actualContent !== null && actualContent !== expectedContent) {
    fail(`${relativePath} is out of date. Run \`npm run generate\`.`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Valid index: ${data.entries.length} entries across ${data.categories.length} categories`);
