# Curation Policy

This repository is a curated engineering index, not a complete web directory. The list should stay useful for a robotics engineer choosing hardware or planning ROS 2 bringup.

## Acceptance Rules

Accept an entry only when the upstream repository has:

- A public GitHub repository root URL.
- A clear ROS 2 driver, wrapper, bridge, controller, hardware-interface, or platform-stack role.
- A visible hardware target, or a generic hardware-interface role such as `ros2_control`.
- Evidence from upstream README files, package manifests, releases, documentation, license files, or repository metadata.
- A concise caveat that names the main uncertainty a user still needs to check upstream.

Do not accept entries only because they are popular, vendor-branded, or useful in robotics generally. The repository must help bring up robot hardware, sensors, actuators, controllers, or hardware-interface stacks in ROS 2.

## Category Selection

Choose the narrowest category that describes the hardware bringup role:

- `industrial-manipulators` - robot-arm drivers, controller bridges, and ros2_control integrations.
- `mobile-bases-and-robots` - mobile robot platform stacks and base drivers.
- `cameras-and-rgb-d` - camera, RGB-D, and image pipeline packages.
- `lidar` - 2D and 3D LiDAR drivers and sensor wrappers.
- `imu-and-positioning` - IMU, GNSS, inertial, and positioning drivers.
- `grippers-and-end-effectors` - grippers, end effectors, and related actuator interfaces.
- `actuators-and-motor-controllers` - smart-servo, actuator, and motor-controller packages.
- `control-and-hardware-interfaces` - generic ROS 2 control frameworks and hardware-interface packages.

If a repository spans multiple categories, place it where users would look first during hardware selection. Do not duplicate the same repository across categories.

## Status Semantics

Use `source_status` to describe upstream ownership:

- `official` - maintained by the vendor or original hardware owner.
- `community` - maintained by the ROS community, a lab, an integrator, or an independent contributor.
- `vendor-adjacent` - maintained by a partner, integrator, or organization closely tied to the hardware.
- `legacy` - retained for continuity even though upstream status is old or unclear.

Use `review_status` to describe curation state:

- `curated` - manually reviewed against this policy.
- `candidate` - plausible entry, but evidence is incomplete.
- `needs-review` - useful entry whose metadata or upstream state needs attention.
- `legacy` - retained for historical or still-useful reasons despite weak activity.

## License Evidence

Prefer the SPDX value exposed by GitHub when it exists. If GitHub reports `NOASSERTION`, inspect upstream `LICENSE`, `COPYING`, and `package.xml` files.

Use compound expressions such as `BSD-3-Clause OR Apache-2.0` when package-level evidence is mixed. Keep `NOASSERTION` only when evidence is missing, contradictory, or incomplete, and make the remaining uncertainty explicit in `notes`.

## Evidence Links

Every entry stores structured `evidence` links in `data/index.json`. Evidence must include the repository URL and at least one supporting upstream source such as README, license, documentation, release, or `package.xml`.

Use the smallest useful set of links. A strong entry usually has repository, README, license, and one to three package manifests. Avoid unrelated marketing pages or generic vendor websites unless they directly document driver support.

## Stale Or Broken Entries

Move an entry toward `needs-review` or `legacy` when:

- The repository becomes archived, disabled, or unreachable.
- The default branch no longer contains clear ROS 2 support.
- The license evidence becomes contradictory or disappears.
- The package targets hardware no longer described by the entry.
- The entry has not been rechecked within the freshness gate.

Do not delete a useful but old entry without replacing it or explaining why it no longer belongs. Stable, slow-moving drivers can stay when the caveat is explicit.

## Merge Expectations

Every pull request that changes curation data should:

- Update `data/index.json`.
- Run `npm run generate`.
- Pass `npm run validate`.
- Include upstream evidence links in the PR body.
- Improve or preserve the generated quality gates.

The generated README, curation report, and `dist/` exports should not be edited by hand.
