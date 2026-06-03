import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const indexPath = new URL("../data/index.json", import.meta.url);
const data = JSON.parse(readFileSync(indexPath, "utf8"));
const token = process.env.GITHUB_TOKEN;
const failures = [];
const apiBaseUrl = "https://api.github.com";

function parseArgs(args) {
  const options = { outputDir: null, concurrency: 4 };
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
    } else if (arg === "--concurrency") {
      if (!args[index + 1] || args[index + 1].startsWith("--")) {
        fail("--concurrency requires a positive integer");
        continue;
      }
      options.concurrency = parseConcurrency(args[index + 1]);
      index += 1;
    } else if (arg.startsWith("--concurrency=")) {
      options.concurrency = parseConcurrency(arg.slice("--concurrency=".length));
    } else {
      fail(`unknown argument: ${arg}`);
    }
  }
  return options;
}

function parseConcurrency(value) {
  const concurrency = Number.parseInt(value, 10);
  if (!Number.isFinite(concurrency) || concurrency < 1 || concurrency > 16) {
    fail("--concurrency must be an integer from 1 to 16");
    return 4;
  }
  return concurrency;
}

function fail(message) {
  failures.push(message);
}

function apiHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "awesome-ros2-robot-drivers-curation",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function webHeaders() {
  return {
    Accept: "text/html,application/xhtml+xml",
    "User-Agent": "awesome-ros2-robot-drivers-curation",
  };
}

function csvEscape(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function renderCsv(rows) {
  const fields = [
    "name",
    "repo",
    "category",
    "evidence_type",
    "evidence_index",
    "url",
    "request_kind",
    "status",
    "ok",
    "error",
  ];
  return [
    fields.join(","),
    ...rows.map((row) => fields.map((field) => csvEscape(row[field])).join(",")),
  ].join("\n") + "\n";
}

function githubApiUrl(owner, repo, path) {
  return `${apiBaseUrl}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}${path}`;
}

function parseEvidenceUrl(entry, evidence, evidenceIndex) {
  let url;
  try {
    url = new URL(evidence.url);
  } catch {
    return {
      entry,
      evidence,
      evidenceIndex,
      requestKind: "invalid",
      requestUrl: evidence.url,
      fallbackUrl: "",
      error: "invalid URL",
    };
  }

  const parts = url.pathname.split("/").filter(Boolean);
  const [owner, repo, marker, ...rest] = parts;
  if (url.hostname !== "github.com" || owner === undefined || repo === undefined) {
    return {
      entry,
      evidence,
      evidenceIndex,
      requestKind: "unsupported",
      requestUrl: evidence.url,
      fallbackUrl: "",
      error: "evidence URL must be under github.com/<owner>/<repo>",
    };
  }

  if (marker === undefined) {
    return {
      entry,
      evidence,
      evidenceIndex,
      requestKind: "repo",
      requestUrl: githubApiUrl(owner, repo, ""),
      fallbackUrl: evidence.url,
      error: "",
    };
  }

  if (marker === "blob" && rest.length >= 2) {
    const [ref, ...pathParts] = rest;
    const path = pathParts.map(encodeURIComponent).join("/");
    return {
      entry,
      evidence,
      evidenceIndex,
      requestKind: "contents",
      requestUrl: `${githubApiUrl(owner, repo, `/contents/${path}`)}?ref=${encodeURIComponent(ref)}`,
      fallbackUrl: evidence.url,
      error: "",
    };
  }

  if (marker === "releases" && rest[0] === "tag" && rest[1]) {
    return {
      entry,
      evidence,
      evidenceIndex,
      requestKind: "release",
      requestUrl: githubApiUrl(owner, repo, `/releases/tags/${encodeURIComponent(rest.slice(1).join("/"))}`),
      fallbackUrl: evidence.url,
      error: "",
    };
  }

  return {
    entry,
    evidence,
    evidenceIndex,
    requestKind: "web",
    requestUrl: evidence.url,
    fallbackUrl: "",
    error: "",
  };
}

async function fetchWithRetry(url, headers) {
  let lastError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(20_000),
      });
      if (![429, 500, 502, 503, 504].includes(response.status) || attempt === 1) {
        return response;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      lastError = error;
      if (attempt === 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw lastError;
}

async function auditItem(item) {
  const baseResult = {
    name: item.entry.name,
    repo: item.entry.repo,
    category: item.entry.category,
    evidence_type: item.evidence.type,
    evidence_index: item.evidenceIndex,
    url: item.evidence.url,
    request_kind: item.requestKind,
    status: "unknown",
    ok: false,
    error: item.error,
  };

  if (item.error) return baseResult;

  try {
    const response = await fetchWithRetry(
      item.requestUrl,
      item.requestKind === "web" ? webHeaders() : apiHeaders(),
    );
    if (response.ok) {
      return {
        ...baseResult,
        status: response.status,
        ok: true,
        error: "",
      };
    }

    if (response.status === 404 && item.fallbackUrl) {
      const fallbackResponse = await fetchWithRetry(item.fallbackUrl, webHeaders());
      return {
        ...baseResult,
        request_kind: `${item.requestKind}+web-fallback`,
        status: fallbackResponse.status,
        ok: fallbackResponse.ok,
        error: fallbackResponse.ok ? "" : `HTTP ${fallbackResponse.status}`,
      };
    }

    const remaining = response.headers.get("x-ratelimit-remaining");
    const reset = response.headers.get("x-ratelimit-reset");
    const rateLimit = remaining === "0" ? `; rate limit resets at ${reset}` : "";
    return {
      ...baseResult,
      status: response.status,
      ok: false,
      error: `HTTP ${response.status}${rateLimit}`,
    };
  } catch (error) {
    return {
      ...baseResult,
      error: error.message,
    };
  }
}

async function runPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await worker(items[currentIndex]);
    }
  });
  await Promise.all(workers);
  return results;
}

function buildReport(results) {
  const statusCounts = {};
  for (const result of results) {
    statusCounts[result.status] = (statusCounts[result.status] || 0) + 1;
  }

  return {
    audited_at: new Date().toISOString(),
    schema_version: data.schema_version,
    reviewed_at: data.reviewed_at,
    entry_count: data.entries.length,
    evidence_count: results.length,
    failure_count: results.filter((result) => !result.ok).length,
    status_counts: Object.fromEntries(Object.entries(statusCounts).sort(([a], [b]) => String(a).localeCompare(String(b)))),
    failures: results
      .filter((result) => !result.ok)
      .map((result) => `${result.repo}: evidence[${result.evidence_index}] ${result.evidence_type} ${result.url} (${result.error})`),
    results,
  };
}

function writeReport(outputDir, results) {
  if (!outputDir) return;
  mkdirSync(outputDir, { recursive: true });
  const report = buildReport(results);
  writeFileSync(join(outputDir, "evidence-link-audit.json"), `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(join(outputDir, "evidence-link-audit.csv"), renderCsv(results));
  console.log(`Wrote evidence link audit artifacts to ${outputDir}`);
}

const options = parseArgs(process.argv.slice(2));
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
if (!token) {
  console.warn("GITHUB_TOKEN is not set; unauthenticated GitHub API rate limits may be too low for a full evidence audit.");
}

const auditItems = [];
for (const entry of data.entries) {
  for (const [evidenceIndex, evidence] of entry.evidence.entries()) {
    auditItems.push(parseEvidenceUrl(entry, evidence, evidenceIndex));
  }
}

const results = await runPool(auditItems, options.concurrency, auditItem);
for (const result of results) {
  console.log(`${result.repo}\t${result.evidence_type}\t${result.status}\t${result.ok ? "ok" : result.error}`);
}

writeReport(options.outputDir, results);

for (const result of results) {
  if (!result.ok) fail(`${result.repo}: evidence[${result.evidence_index}] ${result.evidence_type} ${result.url} (${result.error})`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Audited ${results.length} evidence links across ${data.entries.length} entries`);
