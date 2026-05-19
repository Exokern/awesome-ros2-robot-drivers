import { readFileSync } from "node:fs";

const indexPath = new URL("../data/index.json", import.meta.url);
const readmePath = new URL("../README.md", import.meta.url);
const data = JSON.parse(readFileSync(indexPath, "utf8"));
const readme = readFileSync(readmePath, "utf8");

const requiredCategories = new Set([
  "industrial-manipulators",
  "mobile-bases-and-robots",
  "cameras-and-rgb-d",
  "lidar",
  "grippers-and-end-effectors",
  "control-and-hardware-interfaces",
]);

const seenRepos = new Set();
const seenUrls = new Set();
const failures = [];

if (data.schema_version !== "0.1") failures.push("schema_version must be 0.1");
if (!Array.isArray(data.entries) || data.entries.length === 0) failures.push("entries must be a non-empty array");

for (const [index, entry] of (data.entries || []).entries()) {
  const label = entry.repo || `entry ${index + 1}`;
  for (const key of ["name", "repo", "url", "category", "source_status", "last_checked", "notes"]) {
    if (!entry[key] || typeof entry[key] !== "string") failures.push(`${label}: missing string ${key}`);
  }
  if (entry.url && !/^https:\/\/github\.com\/[^/]+\/[^/]+$/.test(entry.url)) {
    failures.push(`${label}: url must be a GitHub repository root URL`);
  }
  if (entry.repo && !/^[^/\s]+\/[^/\s]+$/.test(entry.repo)) failures.push(`${label}: repo must be owner/name`);
  if (entry.category && !requiredCategories.has(entry.category)) failures.push(`${label}: unknown category ${entry.category}`);
  if (entry.source_status && !["official", "community", "vendor-adjacent", "legacy"].includes(entry.source_status)) {
    failures.push(`${label}: unknown source_status ${entry.source_status}`);
  }
  if (entry.repo) {
    if (seenRepos.has(entry.repo.toLowerCase())) failures.push(`${label}: duplicate repo`);
    seenRepos.add(entry.repo.toLowerCase());
  }
  if (entry.url) {
    if (seenUrls.has(entry.url.toLowerCase())) failures.push(`${label}: duplicate url`);
    seenUrls.add(entry.url.toLowerCase());
    if (!readme.includes(entry.url)) failures.push(`${label}: README does not include URL`);
  }
  if (!Array.isArray(entry.hardware) || entry.hardware.length === 0) failures.push(`${label}: hardware must be non-empty`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Valid index: ${data.entries.length} entries`);

