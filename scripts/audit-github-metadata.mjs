import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const indexPath = new URL("../data/index.json", import.meta.url);
const data = JSON.parse(readFileSync(indexPath, "utf8"));
const token = process.env.GITHUB_TOKEN;
const failures = [];
const results = [];

function parseArgs(args) {
  const options = { outputDir: null };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--output-dir") {
      if (!args[index + 1] || args[index + 1].startsWith("--")) {
        fail("--output-dir requires a directory path");
        continue;
      }
      options.outputDir = args[index + 1];
      index += 1;
    } else if (arg.startsWith("--output-dir=")) {
      const outputDir = arg.slice("--output-dir=".length);
      if (!outputDir) {
        fail("--output-dir requires a directory path");
        continue;
      }
      options.outputDir = outputDir;
    } else {
      fail(`unknown argument: ${arg}`);
    }
  }
  return options;
}

const options = parseArgs(process.argv.slice(2));

function requestHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "awesome-ros2-robot-drivers-curation",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function fail(message) {
  failures.push(message);
}

function csvEscape(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function renderCsv(rows) {
  const fields = [
    "name",
    "repo",
    "category",
    "indexed_license",
    "github_license",
    "archived",
    "disabled",
    "default_branch",
    "pushed_at",
    "error",
  ];
  return [
    fields.join(","),
    ...rows.map((row) => fields.map((field) => csvEscape(row[field])).join(",")),
  ].join("\n") + "\n";
}

function buildReport() {
  const licenseMismatches = results.filter((result) => (
    result.indexed_license !== "NOASSERTION"
      && result.github_license !== "NOASSERTION"
      && result.indexed_license !== result.github_license
  ));
  const newlyAvailableLicenses = results.filter((result) => (
    result.indexed_license === "NOASSERTION" && result.github_license !== "NOASSERTION"
  ));

  return {
    audited_at: new Date().toISOString(),
    schema_version: data.schema_version,
    reviewed_at: data.reviewed_at,
    entry_count: data.entries.length,
    result_count: results.length,
    failure_count: failures.length,
    archived_count: results.filter((result) => result.archived === true).length,
    disabled_count: results.filter((result) => result.disabled === true).length,
    github_noassertion_count: results.filter((result) => result.github_license === "NOASSERTION").length,
    indexed_noassertion_count: results.filter((result) => result.indexed_license === "NOASSERTION").length,
    license_mismatch_count: licenseMismatches.length,
    newly_available_license_count: newlyAvailableLicenses.length,
    failures,
    results,
  };
}

function writeReport(outputDir) {
  if (!outputDir) return;
  mkdirSync(outputDir, { recursive: true });
  const report = buildReport();
  writeFileSync(join(outputDir, "github-metadata-audit.json"), `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(join(outputDir, "github-metadata-audit.csv"), renderCsv(results));
  console.log(`Wrote GitHub metadata audit artifacts to ${outputDir}`);
}

for (const entry of data.entries) {
  const response = await fetch(`https://api.github.com/repos/${entry.repo}`, {
    headers: requestHeaders(),
  });

  if (!response.ok) {
    results.push({
      name: entry.name,
      repo: entry.repo,
      category: entry.category,
      indexed_license: entry.license,
      github_license: "unknown",
      archived: "unknown",
      disabled: "unknown",
      default_branch: "unknown",
      pushed_at: "unknown",
      error: `HTTP ${response.status}`,
    });
    fail(`${entry.repo}: GitHub API returned HTTP ${response.status}`);
    continue;
  }

  const repo = await response.json();
  const license = repo.license?.spdx_id || "NOASSERTION";
  const pushedAt = repo.pushed_at || "unknown";
  const defaultBranch = repo.default_branch || "unknown";
  const result = {
    name: entry.name,
    repo: entry.repo,
    category: entry.category,
    indexed_license: entry.license,
    github_license: license,
    archived: repo.archived,
    disabled: repo.disabled,
    default_branch: defaultBranch,
    pushed_at: pushedAt,
    error: "",
  };
  results.push(result);

  console.log(`${entry.repo}\tlicense=${license}\tarchived=${repo.archived}\tdisabled=${repo.disabled}\tdefault=${defaultBranch}\tpushed=${pushedAt}`);

  if (repo.archived) fail(`${entry.repo}: repository is archived`);
  if (repo.disabled) fail(`${entry.repo}: repository is disabled`);
  if (entry.license !== "NOASSERTION" && license !== "NOASSERTION" && entry.license !== license) {
    fail(`${entry.repo}: indexed license ${entry.license} differs from GitHub API license ${license}`);
  }
  if (entry.license === "NOASSERTION" && license !== "NOASSERTION") {
    fail(`${entry.repo}: GitHub API now exposes license ${license}; update data/index.json`);
  }
}

writeReport(options.outputDir);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Audited ${data.entries.length} GitHub repositories`);
