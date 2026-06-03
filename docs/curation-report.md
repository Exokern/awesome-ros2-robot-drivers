# ROS 2 Driver Curation Report

Generated from [data/index.json](../data/index.json). This report is a maintenance dashboard, not an endorsement or compatibility claim.

- Last reviewed: 2026-06-02
- Entries: 48
- Categories: 8

## Snapshot

- Entries with visible SPDX-like license signal: 33
- Entries needing license follow-up: 15
- Entries older than 180 days since last check: 0
- Categories below 3 entries: 0

## Category Coverage

| Category | Entries | Official | Community | License Follow-Up |
| --- | --- | --- | --- | --- |
| Industrial Manipulators | 10 | 9 | 1 | 5 |
| Mobile Bases And Robots | 8 | 7 | 1 | 0 |
| Cameras And RGB-D | 7 | 5 | 2 | 2 |
| LiDAR | 9 | 6 | 3 | 6 |
| IMU And Positioning | 4 | 3 | 1 | 1 |
| Grippers And End Effectors | 3 | 0 | 3 | 0 |
| Actuators And Motor Controllers | 3 | 2 | 1 | 0 |
| Control And Hardware Interfaces | 4 | 0 | 4 | 1 |

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
| Apache-2.0 | 19 (40%) |
| BSD-2-Clause | 1 (2%) |
| BSD-3-Clause | 9 (19%) |
| MIT | 4 (8%) |
| NOASSERTION | 15 (31%) |

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

- [FANUC ROS 2 Driver](https://github.com/FANUC-CORPORATION/fanuc_driver) - industrial-manipulators; GitHub API did not expose an SPDX license; confirm license, controller options, and supported robot models upstream.
- [Kinova ROS 2 Kortex](https://github.com/Kinovarobotics/ros2_kortex) - industrial-manipulators; GitHub API did not expose an SPDX license; confirm licensing, firmware, and supported distros upstream.
- [MotoROS2](https://github.com/Yaskawa-Global/motoros2) - industrial-manipulators; GitHub API did not expose an SPDX license; confirm controller generation, MotoPlus requirements, and license upstream.
- [TM ROS 2](https://github.com/TechmanRobotInc/tmr_ros2) - industrial-manipulators; GitHub API did not expose an SPDX license; verify current branch, distro support, and model coverage upstream.
- [AUBO ROS 2 Driver](https://github.com/AuboRobot/aubo_ros2_driver) - industrial-manipulators; GitHub API did not expose an SPDX license; confirm supported controller versions, models, and distro branches upstream.
- [USB Cam](https://github.com/ros-drivers/usb_cam) - cameras-and-rgb-d; GitHub API did not expose an SPDX license; inspect package license files and camera-specific V4L2 behavior upstream.
- [Image Pipeline](https://github.com/ros-perception/image_pipeline) - cameras-and-rgb-d; GitHub API did not expose an SPDX license; inspect package-level licenses and distro docs upstream.
- [Velodyne](https://github.com/ros-drivers/velodyne) - lidar; GitHub API did not expose an SPDX license; confirm ROS 2 branch status, model coverage, and license upstream.
- [Hokuyo URG Node](https://github.com/ros-drivers/urg_node) - lidar; GitHub API did not expose an SPDX license; confirm ROS 2 branch, urg_c dependency, model coverage, and license upstream.
- [YDLIDAR ROS 2 Driver](https://github.com/YDLIDAR/ydlidar_ros2_driver) - lidar; GitHub API did not expose an SPDX license; confirm exact sensor model, SDK version, serial/USB setup, and license upstream.
- [Livox ROS Driver 2](https://github.com/Livox-SDK/livox_ros_driver2) - lidar; GitHub API did not expose an SPDX license; confirm device model, Livox SDK version, and ROS 2 branch instructions upstream.
- [Ouster ROS](https://github.com/ouster-lidar/ouster-ros) - lidar; GitHub API did not expose an SPDX license; confirm firmware, sensor generation, and ROS 2 package support upstream.
- [RoboSense LiDAR SDK](https://github.com/RoboSense-LiDAR/rslidar_sdk) - lidar; GitHub API did not expose an SPDX license; confirm sensor family, SDK mode, packet source, and ROS 2 instructions upstream.
- [MicroStrain Inertial](https://github.com/LORD-MicroStrain/microstrain_inertial) - imu-and-positioning; GitHub API did not expose an SPDX license; confirm exact product family, transport, firmware, and ROS 2 branch support upstream.
- [ROS 2 CANopen](https://github.com/ros-industrial/ros2_canopen) - control-and-hardware-interfaces; GitHub API did not expose an SPDX license; confirm supported CiA profiles, bus configuration, device EDS/DCF files, and ROS distro branch upstream.

## Low-Coverage Categories

No entries currently need this follow-up.

## Aging Review Queue

No entries currently need this follow-up.
