import { readFileSync } from "node:fs";

const indexPath = new URL("../data/index.json", import.meta.url);
const data = JSON.parse(readFileSync(indexPath, "utf8"));
const token = process.env.GITHUB_TOKEN;
const failures = [];

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

for (const entry of data.entries) {
  const response = await fetch(`https://api.github.com/repos/${entry.repo}`, {
    headers: requestHeaders(),
  });

  if (!response.ok) {
    fail(`${entry.repo}: GitHub API returned HTTP ${response.status}`);
    continue;
  }

  const repo = await response.json();
  const license = repo.license?.spdx_id || "NOASSERTION";
  const pushedAt = repo.pushed_at || "unknown";
  const defaultBranch = repo.default_branch || "unknown";

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

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Audited ${data.entries.length} GitHub repositories`);
