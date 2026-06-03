# ROS 2 Driver Selection Guide

This guide helps you use the index before choosing hardware or planning bringup. It is not a compatibility guarantee, hardware test, safety certification, or vendor endorsement.

## Quick Workflow

1. Find candidates by category, hardware name, or repository name.
2. Open the upstream repository before making a hardware decision.
3. Confirm the exact robot, sensor, actuator, controller, or interface is supported.
4. Confirm the ROS 2 distribution, branch, release, firmware, SDK, controller option, and transport requirements.
5. Check the license and package manifests.
6. Treat every caveat in the list as a verification item.
7. Prefer drivers with clear upstream ownership, explicit ROS 2 support, recent enough activity, and visible license evidence.

Useful commands:

```bash
npm run find -- --hardware "Universal Robots"
npm run find -- --category lidar
npm run find -- --q ros2_control --json
```

## What Status Means

`source_status` describes who maintains the upstream project:

- `official`: maintained by the vendor or original hardware owner.
- `vendor-adjacent`: maintained by a partner, integrator, or organization close to the hardware.
- `community`: maintained by the ROS community, a lab, an integrator, or an independent contributor.
- `legacy`: retained for continuity even though upstream ownership or activity is old or unclear.

`review_status` describes this index's review state:

- `curated`: manually reviewed against the current curation rules.
- `candidate`: plausible, but not fully reviewed.
- `needs-review`: useful, but metadata or upstream state needs attention.
- `legacy`: retained for historical or still-useful reasons despite low activity.

## Red Flags To Resolve

Do not build a hardware decision around an entry until you have resolved these:

- License is `NOASSERTION` or license evidence is unclear.
- The upstream branch mixes ROS 1 and ROS 2 instructions without a clear ROS 2 path.
- Supported ROS 2 distributions are not stated.
- Firmware, controller, SDK, fieldbus, networking, or transport requirements are missing.
- The repository is old, archived, disabled, or difficult to map to the target hardware revision.
- The entry is a framework, controller family, or simulation bridge rather than a device-specific driver.
- Issue history shows unresolved bringup failures for your exact hardware.

## Minimum Verification Before Bringup

For a real robot or sensor deployment, verify these upstream:

- Exact hardware model and revision.
- ROS 2 distribution and branch or release tag.
- Required firmware, controller software, SDK, and drivers outside ROS.
- Wiring, bus, network, serial, CAN, Ethernet, USB, or fieldbus assumptions.
- Safety limits, teach pendant/controller configuration, and any vendor-specific runtime mode.
- Package manifests and license files.
- Build and installation instructions for your platform.

## Interpreting Framework Entries

Some entries, such as `ros2_control`, `ros2_controllers`, `gz_ros2_control`, or CANopen stacks, are not device-specific drivers. Use them to evaluate architecture, controller plugins, simulation behavior, or hardware-interface patterns. They still need a device-specific configuration or integration before they become a working hardware driver.

## When To Open An Issue

Open an issue when:

- A listed upstream repository is archived, disabled, deleted, or no longer ROS 2 relevant.
- A hardware target is wrong or too broad.
- A license or package manifest changed.
- A better maintained ROS 2 driver exists for the same hardware.
- An entry caveat is missing an important firmware, distro, or controller constraint.
