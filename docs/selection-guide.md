# ROS 2 Driver Selection Guide

Use this guide when you are choosing hardware, planning bringup, or checking whether an existing ROS 2 stack is a good starting point.

The index helps you find candidates. It does not replace upstream documentation, hardware testing, safety review, or vendor support.

## Quick Workflow

1. Search by hardware name, repository name, or category.
2. Open every plausible upstream repository before making a hardware decision.
3. Confirm the exact robot, sensor, actuator, controller, or interface is supported.
4. Check the ROS 2 distribution, branch, release, firmware, SDK, controller option, and transport requirements.
5. Review the license and package manifests.
6. Treat each caveat as a bringup checklist item.
7. Prefer clear upstream ownership, explicit ROS 2 support, recent enough activity, and visible license evidence.

Useful commands:

```bash
npm run find -- --hardware "Universal Robots"
npm run find -- --category lidar
npm run find -- --q ros2_control --json
```

## Build A Shortlist

For hardware selection, start with the category that matches the physical device:

- Robot arms: `industrial-manipulators`
- Mobile platforms: `mobile-bases-and-robots`
- Cameras and depth sensors: `cameras-and-rgb-d`
- 2D and 3D LiDAR: `lidar`
- IMU, GNSS, and positioning sensors: `imu-and-positioning`
- Grippers and end effectors: `grippers-and-end-effectors`
- Actuators and motor controllers: `actuators-and-motor-controllers`
- Generic control layers and interfaces: `control-and-hardware-interfaces`

Then compare entries on five signals:

| Signal | What To Look For |
| --- | --- |
| Ownership | Official vendor support is useful, but strong community integrations can be better maintained for ROS workflows. |
| ROS 2 clarity | Look for explicit distro, branch, release, and package manifest evidence. |
| Hardware match | Confirm the exact model, controller generation, sensor family, firmware, and transport. |
| License | Prefer visible SPDX or package-level license evidence. Treat `NOASSERTION` as follow-up work. |
| Caveat | The caveat is the first thing to verify before buying hardware or planning bringup. |

## Understand Status Fields

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

Resolve these before building a hardware decision around an entry:

- License is `NOASSERTION` or package-level license evidence is unclear.
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
- Safety limits, teach pendant/controller configuration, and vendor-specific runtime modes.
- Package manifests and license files.
- Build and installation instructions for your platform.

## Framework Entries

Some entries, such as `ros2_control`, `ros2_controllers`, `gz_ros2_control`, or CANopen stacks, are not device-specific drivers. Use them to evaluate architecture, controller plugins, simulation behavior, and hardware-interface patterns.

They still need a device-specific configuration or integration before they become a working hardware driver.

## When To Open An Issue

Open an issue when:

- A listed upstream repository is archived, disabled, deleted, or no longer ROS 2 relevant.
- A hardware target is wrong or too broad.
- A license or package manifest changed.
- A better maintained ROS 2 driver exists for the same hardware.
- An entry caveat is missing an important firmware, distro, transport, or controller constraint.
