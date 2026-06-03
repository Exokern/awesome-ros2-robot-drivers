# ROS 2 Driver Curation Report

Generated from [data/index.json](../data/index.json). This report is a maintenance dashboard, not an endorsement or compatibility claim.

- Last reviewed: 2026-06-02
- Entries: 48
- Categories: 8

## Snapshot

- Entries with visible SPDX-like license signal: 46
- Entries needing license follow-up: 2
- Entries older than 180 days since last check: 0
- Categories below 3 entries: 0

## Quality Gates

| Gate | Threshold | Current | Status |
| --- | --- | --- | --- |
| Minimum category coverage | >= 3 entries per category | 0 categories below threshold | pass |
| License follow-up budget | <= 5 NOASSERTION entries | 2 NOASSERTION entries | pass |
| Review freshness | <= 180 days since last check | 0 stale entries | pass |
| Evidence completeness | >= 2 evidence links per entry, including repository plus support | 0 entries missing required evidence | pass |

## Category Coverage

| Category | Entries | Official | Community | License Follow-Up |
| --- | --- | --- | --- | --- |
| Industrial Manipulators | 10 | 9 | 1 | 2 |
| Mobile Bases And Robots | 8 | 7 | 1 | 0 |
| Cameras And RGB-D | 7 | 5 | 2 | 0 |
| LiDAR | 9 | 6 | 3 | 0 |
| IMU And Positioning | 4 | 3 | 1 | 0 |
| Grippers And End Effectors | 3 | 0 | 3 | 0 |
| Actuators And Motor Controllers | 3 | 2 | 1 | 0 |
| Control And Hardware Interfaces | 4 | 0 | 4 | 0 |

## Source Mix

| Status | Entries |
| --- | --- |
| community | 16 (33%) |
| official | 32 (67%) |

## Review Mix

| Status | Entries |
| --- | --- |
| curated | 48 (100%) |

## License Mix

| License | Entries |
| --- | --- |
| Apache-2.0 | 20 (42%) |
| Apache-2.0 OR LGPL-3.0-only | 1 (2%) |
| BSD-2-Clause | 1 (2%) |
| BSD-3-Clause | 15 (31%) |
| BSD-3-Clause OR Apache-2.0 | 1 (2%) |
| BSD-3-Clause OR BSL-1.0 | 1 (2%) |
| MIT | 6 (13%) |
| MIT OR BSD-2-Clause | 1 (2%) |
| NOASSERTION | 2 (4%) |

## Review Age By Category

| Category | Oldest Last-Checked Age |
| --- | --- |
| Industrial Manipulators | 0 days |
| Mobile Bases And Robots | 0 days |
| Cameras And RGB-D | 0 days |
| LiDAR | 0 days |
| IMU And Positioning | 0 days |
| Grippers And End Effectors | 0 days |
| Actuators And Motor Controllers | 0 days |
| Control And Hardware Interfaces | 0 days |

## License Follow-Up Queue

- [MotoROS2](https://github.com/Yaskawa-Global/motoros2) - industrial-manipulators; GitHub API did not expose an SPDX license and no package.xml files were found in the default branch; confirm license, controller generation, and MotoPlus requirements upstream.
- [AUBO ROS 2 Driver](https://github.com/AuboRobot/aubo_ros2_driver) - industrial-manipulators; Most package manifests indicate BSD/BSD-3-Clause, but one manifest still reports TODO; confirm complete licensing, controller versions, models, and distro branches upstream.

## Low-Coverage Categories

No entries currently need this follow-up.

## Aging Review Queue

No entries currently need this follow-up.
