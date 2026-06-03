import { readFileSync, writeFileSync } from "node:fs";

const indexPath = new URL("../data/index.json", import.meta.url);
const readmePath = new URL("../README.md", import.meta.url);

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function formatList(items) {
  return items.join(", ");
}

function formatStatus(value) {
  return value.replace(/-/g, " ");
}

function countBy(entries, key) {
  const counts = new Map();
  for (const entry of entries) {
    const value = entry[key] || "unknown";
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return counts;
}

function markdownTable(headers, rows) {
  const tableRows = [headers, ...rows];
  const widths = headers.map((_, columnIndex) => (
    Math.max(...tableRows.map((row) => String(row[columnIndex] ?? "").length))
  ));
  const formatRow = (row) => `| ${row.map((cell, columnIndex) => String(cell ?? "").padEnd(widths[columnIndex])).join(" | ")} |`;
  const divider = `| ${widths.map((width) => "-".repeat(Math.max(3, width))).join(" | ")} |`;

  return [
    formatRow(headers),
    divider,
    ...rows.map(formatRow),
  ].join("\n");
}

function renderEntry(entry) {
  return [
    `- [${entry.name}](${entry.url}) - ${entry.description}`,
    `  - Hardware: ${formatList(entry.hardware)}.`,
    `  - Source: ${formatStatus(entry.source_status)}; review: ${formatStatus(entry.review_status)}; license: ${entry.license}; last checked: ${entry.last_checked}.`,
    `  - Caveat: ${entry.notes}`,
  ].join("\n");
}

function renderAtAGlance(data, entriesByCategory) {
  const sourceCounts = countBy(data.entries, "source_status");
  const reviewCounts = countBy(data.entries, "review_status");
  const licenseFollowUps = data.entries.filter((entry) => entry.license === "NOASSERTION").length;

  const signalRows = [
    ["Curated entries", String(reviewCounts.get("curated") || 0)],
    ["Hardware categories", String(data.categories.length)],
    ["Official upstream sources", String(sourceCounts.get("official") || 0)],
    ["Community-maintained sources", String(sourceCounts.get("community") || 0)],
    ["License follow-ups", String(licenseFollowUps)],
    ["Review freshness gate", "180 days"],
  ];

  const coverageRows = data.categories.map((category) => {
    const entries = entriesByCategory.get(category.id) || [];
    const categorySourceCounts = countBy(entries, "source_status");
    const curatedCount = entries.filter((entry) => entry.review_status === "curated").length;
    const categoryLicenseFollowUps = entries.filter((entry) => entry.license === "NOASSERTION").length;
    return [
      category.name,
      String(entries.length),
      String(curatedCount),
      String(categorySourceCounts.get("official") || 0),
      String(categorySourceCounts.get("community") || 0),
      String(categoryLicenseFollowUps),
    ];
  });

  return [
    "## At A Glance",
    "",
    markdownTable(["Signal", "Current"], signalRows),
    "",
    "### Coverage",
    "",
    markdownTable(["Category", "Entries", "Curated", "Official", "Community", "License Follow-Up"], coverageRows),
  ].join("\n");
}

export function renderReadme(data) {
  const entriesByCategory = new Map(data.categories.map((category) => [category.id, []]));
  for (const entry of data.entries) entriesByCategory.get(entry.category)?.push(entry);

  const categoryLinks = data.categories.map((category) => `- [${category.name}](#${slugify(category.name)})`).join("\n");
  const sections = data.categories.map((category) => {
    const entries = entriesByCategory.get(category.id) || [];
    return [
      `## ${category.name}`,
      "",
      category.description,
      "",
      entries.map(renderEntry).join("\n\n"),
    ].join("\n");
  }).join("\n\n");

  return `# Awesome ROS 2 Robot Drivers [![Awesome](https://awesome.re/badge.svg)](https://github.com/sindresorhus/awesome)

[![Validate](https://github.com/Exokern/awesome-ros2-robot-drivers/actions/workflows/validate.yml/badge.svg)](https://github.com/Exokern/awesome-ros2-robot-drivers/actions/workflows/validate.yml)

A curated index of ROS 2 robot, sensor, actuator, controller, and hardware-interface driver repositories.

Use this list to find maintained upstream driver projects before choosing a hardware stack. It is not a compatibility guarantee, safety certification, installation guide, or endorsement by the original vendors unless the upstream repository says so.

- Last reviewed: ${data.reviewed_at}
- Entries: ${data.entries.length}
- Schema: ${data.schema_version}

## Contents

- [At A Glance](#at-a-glance)
- [How To Use This List](#how-to-use-this-list)
- [Fast Paths](#fast-paths)
- [Selection Guide](#selection-guide)
- [Suggest A Driver](#suggest-a-driver)
${categoryLinks}
- [Selection Checklist](#selection-checklist)
- [Review Rules](#review-rules)
- [Curation Policy](#curation-policy)
- [Data And Automation](#data-and-automation)
- [Quality Gates](#quality-gates)
- [Curation Report](#curation-report)
- [Machine-Readable Exports](#machine-readable-exports)
- [Local Search](#local-search)
- [Related EXOKERN Spec](#related-exokern-spec)

${renderAtAGlance(data, entriesByCategory)}

## How To Use This List

- Start with the hardware category that matches your robot, sensor, gripper, actuator, or controller.
- Open the upstream repository and confirm supported ROS 2 distro, hardware revision, firmware/controller requirements, and license before using it.
- Treat each caveat as a review prompt, not as a blocker or approval.
- Prefer entries with clear upstream ownership, active maintenance, visible licensing, and explicit ROS 2 support.

## Fast Paths

- Choosing hardware: start with the selection guide, then inspect the matching hardware category below.
- Checking a specific repository or hardware name: run \`npm run find -- --q <repo-or-hardware>\` before adding or selecting a driver.
- Suggesting a missing driver: use the suggestion path below and include upstream evidence.
- Updating an entry: change \`data/index.json\`, run \`npm run generate\`, then run \`npm run check\`.
- Consuming the index in tooling: use \`dist/search-index.json\`, \`dist/hardware-map.json\`, or \`dist/entries.csv\`.

## Selection Guide

Use [docs/selection-guide.md](docs/selection-guide.md) for a practical workflow before choosing hardware or planning bringup.

## Suggest A Driver

Good suggestions are narrow, evidence-backed, and tied to ROS 2 hardware bringup. A strong suggestion includes the upstream GitHub repository, target hardware, ROS 2 role, license evidence, supported distro or branch notes, and one caveat a user still needs to verify.

Use the [suggest-driver issue template](https://github.com/Exokern/awesome-ros2-robot-drivers/issues/new?template=suggest-driver.md) for quick proposals. Use a pull request when you can update \`data/index.json\` directly and regenerate the derived files.

${sections}

## Selection Checklist

Before building around any driver, verify:

- The upstream repository targets your exact robot, sensor, actuator, controller, or interface.
- The branch or release supports your ROS 2 distribution.
- Firmware, controller options, networking, fieldbus, SDK, and safety requirements are documented upstream.
- The license is visible and acceptable for your use case.
- The project is active enough for your risk profile, or stable enough that low activity is reasonable.

## Review Rules

Main-list entries must have:

- A public GitHub repository root URL.
- A clear ROS 2 driver, wrapper, bridge, hardware-interface, or controller role.
- A visible hardware target or generic hardware-interface role.
- Recent activity, or a specific reason to keep a stable but slow-moving driver.
- A visible license, \`NOASSERTION\`, or a clear upstream licensing caveat.
- Package-level license evidence when GitHub does not expose a repository SPDX value.
- Structured \`evidence\` links in \`data/index.json\`, including the repository and at least one supporting upstream source.
- No claim that EXOKERN or this list has tested the driver on hardware.

Entries that are ROS 1 only, archived, experimental, or unclear should be labeled with a caveat instead of being presented as production-ready.

## Curation Policy

Use [docs/curation-policy.md](docs/curation-policy.md) for acceptance rules, category selection, status semantics, license evidence, stale-entry handling, and merge expectations.

## Data And Automation

The canonical metadata lives in [data/index.json](data/index.json) and is documented by [data/schema.json](data/schema.json). The README, curation report, and export files are generated from that file so contributors only maintain one source of truth.

\`\`\`bash
npm run generate
npm run validate
npm run smoke
npm run lint:awesome
npm run find -- --q lidar
npm run audit:github
npm run audit:evidence
npm run audit:github:artifacts
npm run audit:evidence:artifacts
\`\`\`

\`npm run validate\` checks schema version, category coverage, duplicate repositories, GitHub root URLs, clean metadata fields, README drift, curation-report drift, and export drift. \`npm run smoke\` checks package exports, search output, JSON query output, and the hardware lookup map. \`npm run lint:awesome\` checks README conformance with Awesome-list rules. \`npm run export\` refreshes only the machine-readable \`dist/\` outputs. \`npm run find\` queries the canonical index locally by text, category, hardware, source status, review status, and license. \`npm run audit:github\` checks that upstream repositories are still reachable, unarchived, and aligned with indexed license metadata. \`npm run audit:evidence\` checks that every structured evidence link resolves through GitHub. The \`:artifacts\` audit variants also write JSON and CSV snapshots under \`audit-results/\`.

## Quality Gates

\`npm run validate\` fails if any standard gate falls out of range:

- Every category must have at least 3 curated entries.
- The index may have at most 5 \`NOASSERTION\` license follow-ups.
- Every entry must have been checked within 180 days of \`reviewed_at\`.
- Every entry must include repository evidence plus at least one supporting upstream link.

## Curation Report

The generated [curation report](docs/curation-report.md) summarizes category coverage, source mix, review status, license follow-up work, and aging review queues. Use it to decide where the next curated entries or metadata fixes should go.

## Machine-Readable Exports

Generated exports live in \`dist/\`:

\`dist/index.json\` is the generated copy of the canonical index for consumers that should not read source files directly.

\`dist/categories.json\` contains category metadata with entry counts and license follow-up counts.

\`dist/summary.json\` contains aggregate counts, quality gates, evidence metrics, license follow-up repositories, and low-coverage categories.

\`dist/entries.csv\` is the spreadsheet-friendly entry table with evidence links.

\`dist/search-index.json\` contains compact search records for client-side search, registry overlays, and downstream tooling.

\`dist/hardware-map.json\` is the hardware-target lookup map for finding all indexed entries tied to a robot, sensor, actuator, controller, or interface.

## Local Search

Use \`npm run find -- --q realsense\`, \`npm run find -- --category lidar\`, or \`npm run find -- --hardware "Universal Robots"\` to query the index before choosing hardware or adding duplicate entries. Add \`--json\` for scripts and downstream tools.

## Related EXOKERN Spec

For deeper compatibility metadata, use the [EXOKERN Robot Skill Spec](https://github.com/Exokern/robot-skill-spec). This awesome list should not duplicate that schema. If an upstream project ships a \`robot_skill.yaml\`, link it in the entry metadata or pull request evidence; if not, use [templates/robot_skill.yaml](templates/robot_skill.yaml) as a starting point for a future overlay.

## Contributing

See \`CONTRIBUTING.md\` and \`docs/curation-policy.md\`. Pull requests should update \`data/index.json\`, run \`npm run generate\`, and pass \`npm run validate\`.
`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const data = JSON.parse(readFileSync(indexPath, "utf8"));
  writeFileSync(readmePath, renderReadme(data));
  console.log("Generated README.md from data/index.json");
}
