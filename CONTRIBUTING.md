# Contributing

This repository curates ROS 2 driver repositories. It is not a place for marketing submissions, broad robotics resources, course lists, generic AI demos, or unverified compatibility claims.

The goal is a high-signal index that a robotics engineer can use before choosing hardware or planning bringup.

## Add Or Update An Entry

Open a pull request that updates the canonical metadata:

- `data/index.json`

Then regenerate the readable list:

```bash
npm run generate
npm run validate
```

Do not edit generated README, curation-report, or `dist/` export output by hand. If generated output is wrong, fix the metadata or the renderer.

## Entry Requirements

Entries should have:

- A public GitHub repository root URL with no trailing slash.
- A clear ROS 2 driver, wrapper, bridge, hardware-interface, controller, or platform-stack role.
- A visible hardware target, or a generic hardware-interface role such as `ros2_control`.
- Recent activity, or a specific reason to keep a stable but slow-moving driver.
- A visible license, `NOASSERTION`, or a direct caveat when licensing is unclear.
- A concise caveat covering branch, distro, firmware, controller, hardware, license, or maintenance uncertainty.
- No claim that EXOKERN or this list has tested the driver on hardware.

## Review Status

Use `review_status` carefully:

- `candidate` - plausible entry, but not yet fully reviewed.
- `curated` - manually reviewed against the entry requirements.
- `legacy` - retained for historical or still-useful reasons despite low activity.
- `needs-review` - known useful, but current metadata or upstream state needs attention.

## Source Status

Use `source_status` to describe upstream ownership:

- `official` - maintained by the vendor or original hardware owner.
- `community` - maintained by the ROS community, a lab, an integrator, or an independent contributor.
- `vendor-adjacent` - maintained by a partner, integrator, or organization closely tied to the hardware.
- `legacy` - retained for continuity even though upstream status is old or unclear.

## Evidence

Use upstream README files, package manifests, releases, official documentation, license files, and repository metadata as evidence. If a repository has a `robot_skill.yaml`, mention it in the pull request. If it does not, do not invent compatibility claims.

Use [docs/curation-report.md](docs/curation-report.md) to find weak categories, license follow-ups, and aging entries before proposing broad additions. Strong entries should improve the report, not just increase the count.

Good notes are specific:

- "Confirm firmware and controller software requirements upstream."
- "GitHub API did not expose an SPDX license; inspect package-level license files."
- "Framework entry, not a device-specific driver."

Weak notes should be rewritten:

- "Works great."
- "Best driver."
- "Should support all robots."

## Out Of Scope

- Broad robotics courses, papers, and newsletters.
- General-purpose simulation libraries unless they are directly tied to driver bringup.
- Hosted app features, accounts, OAuth, uploads, or dashboards.
- Robot code execution, Docker builds, hardware tests, or installation automation.
- AI-generated bulk submissions without manual review.

## Relationship To Robot Skill Spec

For detailed compatibility metadata, use the EXOKERN Robot Skill Spec:

https://github.com/Exokern/robot-skill-spec

This list may link to upstream `robot_skill.yaml` files or curated overlays, but it does not redefine that schema.
