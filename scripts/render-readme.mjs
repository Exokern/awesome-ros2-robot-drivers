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

function renderEntry(entry) {
  return [
    `- [${entry.name}](${entry.url}) - ${entry.description}`,
    `  - Hardware: ${formatList(entry.hardware)}.`,
    `  - Source: ${formatStatus(entry.source_status)}; review: ${formatStatus(entry.review_status)}; license: ${entry.license}; last checked: ${entry.last_checked}.`,
    `  - Caveat: ${entry.notes}`,
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

  return `# Awesome ROS 2 Robot Drivers

[![Validate](https://github.com/Exokern/awesome-ros2-robot-drivers/actions/workflows/validate.yml/badge.svg)](https://github.com/Exokern/awesome-ros2-robot-drivers/actions/workflows/validate.yml)

A curated index of ROS 2 robot, sensor, actuator, controller, and hardware-interface driver repositories.

Use this list to find maintained upstream driver projects before choosing a hardware stack. It is not a compatibility guarantee, safety certification, installation guide, or endorsement by the original vendors unless the upstream repository says so.

- Last reviewed: ${data.reviewed_at}
- Entries: ${data.entries.length}
- Schema: ${data.schema_version}

## How To Use This List

- Start with the hardware category that matches your robot, sensor, gripper, actuator, or controller.
- Open the upstream repository and confirm supported ROS 2 distro, hardware revision, firmware/controller requirements, and license before using it.
- Treat each caveat as a review prompt, not as a blocker or approval.
- Prefer entries with clear upstream ownership, active maintenance, visible licensing, and explicit ROS 2 support.

## Contents

${categoryLinks}
- [Selection Checklist](#selection-checklist)
- [Review Rules](#review-rules)
- [Data And Automation](#data-and-automation)
- [Curation Report](#curation-report)
- [Machine-Readable Exports](#machine-readable-exports)
- [Related EXOKERN Spec](#related-exokern-spec)
- [Contributing](#contributing)

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
- No claim that EXOKERN or this list has tested the driver on hardware.

Entries that are ROS 1 only, archived, experimental, or unclear should be labeled with a caveat instead of being presented as production-ready.

## Data And Automation

The canonical metadata lives in [data/index.json](data/index.json) and is documented by [data/schema.json](data/schema.json). The README, curation report, and export files are generated from that file so contributors only maintain one source of truth.

\`\`\`bash
npm run generate
npm run validate
npm run audit:github
\`\`\`

\`npm run validate\` checks schema version, category coverage, duplicate repositories, GitHub root URLs, clean metadata fields, README drift, curation-report drift, and export drift. \`npm run export\` refreshes only the machine-readable \`dist/\` outputs. \`npm run audit:github\` checks that upstream repositories are still reachable, unarchived, and aligned with indexed license metadata.

## Curation Report

The generated [curation report](docs/curation-report.md) summarizes category coverage, source mix, review status, license follow-up work, and aging review queues. Use it to decide where the next curated entries or metadata fixes should go.

## Machine-Readable Exports

Generated exports live in [dist/](dist/):

- [dist/index.json](dist/index.json) - generated copy of the canonical index for consumers that should not read source files directly.
- [dist/categories.json](dist/categories.json) - category metadata with entry counts and license follow-up counts.
- [dist/summary.json](dist/summary.json) - aggregate counts, license follow-up repositories, and low-coverage categories.
- [dist/entries.csv](dist/entries.csv) - spreadsheet-friendly entry table.

## Related EXOKERN Spec

For deeper compatibility metadata, use the [EXOKERN Robot Skill Spec](https://github.com/Exokern/robot-skill-spec). This awesome list should not duplicate that schema. If an upstream project ships a \`robot_skill.yaml\`, link it in the entry metadata or pull request evidence; if not, use [templates/robot_skill.yaml](templates/robot_skill.yaml) as a starting point for a future overlay.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Pull requests should update [data/index.json](data/index.json), run \`npm run generate\`, and pass \`npm run validate\`.
`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const data = JSON.parse(readFileSync(indexPath, "utf8"));
  writeFileSync(readmePath, renderReadme(data));
  console.log("Generated README.md from data/index.json");
}
