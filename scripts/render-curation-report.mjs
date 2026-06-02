import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const indexPath = new URL("../data/index.json", import.meta.url);
const docsDir = new URL("../docs/", import.meta.url);
const reportPath = new URL("../docs/curation-report.md", import.meta.url);

function countBy(items, key) {
  const counts = new Map();
  for (const item of items) {
    const value = item[key] || "unknown";
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return counts;
}

function formatStatus(value) {
  return value.replace(/-/g, " ");
}

function formatCount(count, total) {
  const percent = total === 0 ? 0 : Math.round((count / total) * 100);
  return `${count} (${percent}%)`;
}

function markdownTable(headers, rows) {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
}

function daysBetween(startDate, endDate) {
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(end)) return Number.NaN;
  return Math.floor((end - start) / 86_400_000);
}

function renderStatusTable(title, counts, total) {
  const rows = [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([status, count]) => [formatStatus(status), formatCount(count, total)]);

  return [`## ${title}`, "", markdownTable(["Status", "Entries"], rows)].join("\n");
}

function renderFollowUpList(entries) {
  if (entries.length === 0) return "No entries currently need this follow-up.";

  return entries
    .map((entry) => `- [${entry.name}](${entry.url}) - ${entry.category}; ${entry.notes}`)
    .join("\n");
}

export function renderCurationReport(data) {
  const entriesByCategory = new Map(data.categories.map((category) => [category.id, []]));
  for (const entry of data.entries) entriesByCategory.get(entry.category)?.push(entry);

  const sourceCounts = countBy(data.entries, "source_status");
  const reviewCounts = countBy(data.entries, "review_status");
  const licenseCounts = countBy(data.entries, "license");
  const licenseFollowUps = data.entries.filter((entry) => entry.license === "NOASSERTION");
  const staleEntries = data.entries.filter((entry) => daysBetween(entry.last_checked, data.reviewed_at) > 180);
  const lowCoverageCategories = data.categories.filter((category) => (entriesByCategory.get(category.id) || []).length < 3);

  const categoryRows = data.categories.map((category) => {
    const entries = entriesByCategory.get(category.id) || [];
    const categorySourceCounts = countBy(entries, "source_status");
    const noAssertionCount = entries.filter((entry) => entry.license === "NOASSERTION").length;
    return [
      category.name,
      String(entries.length),
      String(categorySourceCounts.get("official") || 0),
      String(categorySourceCounts.get("community") || 0),
      String(noAssertionCount),
    ];
  });

  const licenseRows = [...licenseCounts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([license, count]) => [license, formatCount(count, data.entries.length)]);

  const reviewAgeRows = data.categories.map((category) => {
    const entries = entriesByCategory.get(category.id) || [];
    const maxAge = Math.max(...entries.map((entry) => daysBetween(entry.last_checked, data.reviewed_at)));
    return [category.name, Number.isFinite(maxAge) ? `${maxAge} days` : "unknown"];
  });

  return `# ROS 2 Driver Curation Report

Generated from [data/index.json](../data/index.json). This report is a maintenance dashboard, not an endorsement or compatibility claim.

Last reviewed: ${data.reviewed_at}  
Entries: ${data.entries.length}  
Categories: ${data.categories.length}

## Snapshot

- Entries with visible SPDX-like license signal: ${data.entries.length - licenseFollowUps.length}
- Entries needing license follow-up: ${licenseFollowUps.length}
- Entries older than 180 days since last check: ${staleEntries.length}
- Categories below 3 entries: ${lowCoverageCategories.length}

## Category Coverage

${markdownTable(["Category", "Entries", "Official", "Community", "License Follow-Up"], categoryRows)}

${renderStatusTable("Source Mix", sourceCounts, data.entries.length)}

${renderStatusTable("Review Mix", reviewCounts, data.entries.length)}

## License Mix

${markdownTable(["License", "Entries"], licenseRows)}

## Review Age By Category

${markdownTable(["Category", "Oldest Last-Checked Age"], reviewAgeRows)}

## License Follow-Up Queue

${renderFollowUpList(licenseFollowUps)}

## Low-Coverage Categories

${renderFollowUpList(lowCoverageCategories.map((category) => ({
  name: category.name,
  url: `../README.md#${category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
  category: category.id,
  notes: `${(entriesByCategory.get(category.id) || []).length} entries; add more curated repositories if strong upstream evidence exists.`,
})))}

## Aging Review Queue

${renderFollowUpList(staleEntries)}
`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const data = JSON.parse(readFileSync(indexPath, "utf8"));
  mkdirSync(docsDir, { recursive: true });
  writeFileSync(reportPath, renderCurationReport(data));
  console.log("Generated docs/curation-report.md from data/index.json");
}
