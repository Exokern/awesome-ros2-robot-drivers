import { readFileSync } from "node:fs";

const indexPath = new URL("../data/index.json", import.meta.url);
const data = JSON.parse(readFileSync(indexPath, "utf8"));

function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9.+#-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function usage() {
  return `Usage: npm run find -- [terms] [options]

Options:
  --q <terms>          Search terms.
  --category <slug>    Filter by category id.
  --source <status>    Filter by source_status.
  --review <status>    Filter by review_status.
  --license <value>    Filter by license substring.
  --hardware <terms>   Filter by hardware substring.
  --limit <number>     Maximum results, default 20.
  --json               Print JSON instead of Markdown.
  --help               Show this help.
`;
}

function parseArgs(args) {
  const options = {
    q: [],
    category: null,
    source: null,
    review: null,
    license: null,
    hardware: null,
    limit: 20,
    json: false,
    help: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg === "--json") {
      options.json = true;
    } else if (["--q", "--category", "--source", "--review", "--license", "--hardware", "--limit"].includes(arg)) {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`${arg} requires a value`);
      if (arg === "--q") options.q.push(value);
      if (arg === "--category") options.category = value;
      if (arg === "--source") options.source = value;
      if (arg === "--review") options.review = value;
      if (arg === "--license") options.license = value;
      if (arg === "--hardware") options.hardware = value;
      if (arg === "--limit") {
        const limit = Number.parseInt(value, 10);
        if (!Number.isFinite(limit) || limit < 1) throw new Error("--limit must be a positive integer");
        options.limit = limit;
      }
      index += 1;
    } else if (arg.startsWith("--")) {
      throw new Error(`unknown option: ${arg}`);
    } else {
      options.q.push(arg);
    }
  }

  return options;
}

function searchText(entry) {
  return normalize([
    entry.name,
    entry.repo,
    entry.category,
    entry.description,
    entry.hardware.join(" "),
    entry.source_status,
    entry.review_status,
    entry.license,
    entry.notes,
  ].join(" "));
}

function scoreEntry(entry, terms) {
  const name = normalize(entry.name);
  const repo = normalize(entry.repo);
  const hardware = normalize(entry.hardware.join(" "));
  const text = searchText(entry);
  let score = 0;

  for (const term of terms) {
    if (!text.includes(term)) return -1;
    if (name.includes(term)) score += 5;
    if (hardware.includes(term)) score += 4;
    if (repo.includes(term)) score += 3;
    score += 1;
  }

  return score;
}

function matchesFilters(entry, options) {
  if (options.category && entry.category !== options.category) return false;
  if (options.source && entry.source_status !== options.source) return false;
  if (options.review && entry.review_status !== options.review) return false;
  if (options.license && !normalize(entry.license).includes(normalize(options.license))) return false;
  if (options.hardware && !normalize(entry.hardware.join(" ")).includes(normalize(options.hardware))) return false;
  return true;
}

function resultShape(entry) {
  return {
    name: entry.name,
    repo: entry.repo,
    url: entry.url,
    category: entry.category,
    hardware: entry.hardware,
    source_status: entry.source_status,
    review_status: entry.review_status,
    license: entry.license,
    last_checked: entry.last_checked,
    notes: entry.notes,
  };
}

function formatMarkdown(results, options) {
  const lines = [`Found ${options.total} matching entries`];
  if (options.total > results.length) lines[0] += ` (showing ${results.length})`;
  lines[0] += ".";
  lines.push("");

  for (const entry of results) {
    lines.push(`- [${entry.name}](${entry.url}) - ${entry.category}`);
    lines.push(`  - Hardware: ${entry.hardware.join(", ")}`);
    lines.push(`  - Source: ${entry.source_status}; review: ${entry.review_status}; license: ${entry.license}`);
    lines.push(`  - Caveat: ${entry.notes}`);
    lines.push(`  - URL: ${entry.url}`);
  }

  return lines.join("\n");
}

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    process.exit(0);
  }

  const terms = normalize(options.q.join(" ")).split(" ").filter(Boolean);
  const matches = data.entries
    .map((entry) => ({ entry, score: terms.length ? scoreEntry(entry, terms) : 0 }))
    .filter(({ entry, score }) => score >= 0 && matchesFilters(entry, options))
    .sort((a, b) => b.score - a.score || a.entry.category.localeCompare(b.entry.category) || a.entry.name.localeCompare(b.entry.name));

  const results = matches
    .slice(0, options.limit)
    .map(({ entry }) => resultShape(entry));
  options.total = matches.length;

  if (options.json) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log(formatMarkdown(results, options));
  }
} catch (error) {
  console.error(error.message);
  console.error("");
  console.error(usage());
  process.exit(1);
}
