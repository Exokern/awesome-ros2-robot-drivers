# Contributing

This repository curates ROS 2 driver repositories for real robot, sensor, actuator, controller, and hardware-interface bringup.

The best contribution is not just another link. It is a clearer hardware decision for the next robotics engineer.

## Good Contributions

Helpful contributions usually do one of these:

- Add a missing ROS 2 driver, wrapper, bridge, controller, hardware-interface, or platform stack.
- Correct a stale hardware target, license, branch, distro, firmware, SDK, or controller detail.
- Move an entry to `needs-review` or `legacy` when upstream state changed.
- Improve evidence links so a user can verify the entry faster.
- Improve tooling, exports, docs, or curation reports without weakening the review standard.

Out of scope:

- Broad robotics courses, papers, newsletters, generic AI demos, or marketing pages.
- Simulation libraries unless they are directly tied to driver bringup.
- Claims that EXOKERN or this list tested hardware unless there is explicit evidence.
- Bulk AI-generated submissions without manual review.

## Suggest A Driver

If you know a driver that is missing but do not want to edit the index, open a [driver suggestion issue](https://github.com/Exokern/awesome-ros2-robot-drivers/issues/new?template=suggest-driver.md).

Useful suggestions include:

- Upstream GitHub repository root URL.
- Target hardware.
- ROS 2 role: driver, wrapper, bridge, hardware interface, controller, or platform stack.
- License evidence.
- Supported distro, branch, release, firmware, SDK, or controller notes.
- One caveat a user should verify before bringup.

## Open A Pull Request

If you are ready to update the list, edit the canonical metadata:

- `data/index.json`

Then regenerate derived files:

```bash
npm run generate
npm run check
```

Do not edit generated README, curation-report, or `dist/` export output by hand. If generated output is wrong, fix the metadata or the renderer.

Before adding a driver, search for duplicates:

```bash
npm run find -- --q <hardware-or-repo>
npm run find -- --category lidar
npm run find -- --hardware "Universal Robots"
```

Prefer one focused change per pull request: one new driver, one stale-entry update, one license fix, or one documentation/tooling improvement.

## Entry Requirements

Entries should have:

- A public GitHub repository root URL with no trailing slash.
- A clear ROS 2 driver, wrapper, bridge, hardware-interface, controller, or platform-stack role.
- A visible hardware target, or a generic hardware-interface role such as `ros2_control`.
- Recent activity, or a specific reason to keep a stable but slow-moving driver.
- A visible license, `NOASSERTION`, or a direct caveat when licensing is unclear.
- A concise caveat covering branch, distro, firmware, controller, hardware, license, or maintenance uncertainty.
- Structured `evidence` links, including the repository and at least one supporting upstream source such as README, license, documentation, release, or `package.xml`.
- No compatibility, safety, endorsement, or hardware-test claim without upstream evidence.

Use [docs/curation-policy.md](docs/curation-policy.md) for category placement, status fields, stale-entry handling, and merge readiness.

## Status Fields

Use `review_status` carefully:

- `candidate` - plausible entry, but not yet fully reviewed.
- `curated` - manually reviewed against the entry requirements.
- `legacy` - retained for historical or still-useful reasons despite low activity.
- `needs-review` - known useful, but current metadata or upstream state needs attention.

Use `source_status` to describe upstream ownership:

- `official` - maintained by the vendor or original hardware owner.
- `community` - maintained by the ROS community, a lab, an integrator, or an independent contributor.
- `vendor-adjacent` - maintained by a partner, integrator, or organization closely tied to the hardware.
- `legacy` - retained for continuity even though upstream status is old or unclear.

## Evidence And Caveats

Use upstream README files, package manifests, releases, official documentation, license files, and repository metadata as evidence. The first evidence item should be the repository URL, followed by the most relevant upstream README, license, documentation, release, or `package.xml` links.

Run `GITHUB_TOKEN="$(gh auth token)" npm run audit:evidence` after adding or changing evidence links. The audit verifies every structured evidence URL through GitHub and fails on missing files, stale branches, or unreachable repositories.

For `license`, prefer the SPDX value exposed by GitHub when it exists. If GitHub reports `NOASSERTION`, inspect upstream `LICENSE`, `COPYING`, and `package.xml` files. Use a compound expression such as `BSD-3-Clause OR Apache-2.0` when package-level evidence is mixed.

Good notes are specific:

- "Confirm firmware and controller software requirements upstream."
- "GitHub API did not expose an SPDX license; inspect package-level license files."
- "Framework entry, not a device-specific driver."

Weak notes should be rewritten:

- "Works great."
- "Best driver."
- "Should support all robots."

## Checks

`npm run check` enforces the standard gates:

- Every category needs at least 3 curated entries.
- The index may have at most 5 `NOASSERTION` license follow-ups.
- Every entry must have been checked within 180 days of `reviewed_at`.
- Every entry needs repository evidence plus at least one supporting upstream link.
- Local search/package smoke tests must pass.
- The README must stay Awesome-list compliant.

Use [docs/curation-report.md](docs/curation-report.md) to find weak categories, license follow-ups, and aging entries before proposing broad additions.

## Relationship To Robot Skill Spec

For detailed compatibility metadata, use the EXOKERN Robot Skill Spec:

https://github.com/Exokern/robot-skill-spec

This list may link to upstream `robot_skill.yaml` files or curated overlays, but it does not redefine that schema.
