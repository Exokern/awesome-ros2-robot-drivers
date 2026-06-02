# Awesome ROS 2 Robot Drivers

[![Validate](https://github.com/Exokern/awesome-ros2-robot-drivers/actions/workflows/validate.yml/badge.svg)](https://github.com/Exokern/awesome-ros2-robot-drivers/actions/workflows/validate.yml)

A curated index of ROS 2 robot, sensor, actuator, controller, and hardware-interface driver repositories.

Use this list to find maintained upstream driver projects before choosing a hardware stack. It is not a compatibility guarantee, safety certification, installation guide, or endorsement by the original vendors unless the upstream repository says so.

Last reviewed: 2026-06-02  
Entries: 31  
Schema: 0.2

## How To Use This List

- Start with the hardware category that matches your robot, sensor, gripper, actuator, or controller.
- Open the upstream repository and confirm supported ROS 2 distro, hardware revision, firmware/controller requirements, and license before using it.
- Treat each caveat as a review prompt, not as a blocker or approval.
- Prefer entries with clear upstream ownership, active maintenance, visible licensing, and explicit ROS 2 support.

## Contents

- [Industrial Manipulators](#industrial-manipulators)
- [Mobile Bases And Robots](#mobile-bases-and-robots)
- [Cameras And RGB-D](#cameras-and-rgb-d)
- [LiDAR](#lidar)
- [IMU And Positioning](#imu-and-positioning)
- [Grippers And End Effectors](#grippers-and-end-effectors)
- [Control And Hardware Interfaces](#control-and-hardware-interfaces)
- [Selection Checklist](#selection-checklist)
- [Review Rules](#review-rules)
- [Data And Automation](#data-and-automation)
- [Related EXOKERN Spec](#related-exokern-spec)
- [Contributing](#contributing)

## Industrial Manipulators

Robot-arm drivers, controller bridges, and ros2_control integrations for industrial and collaborative manipulators.

- [Universal Robots ROS 2 Driver](https://github.com/UniversalRobots/Universal_Robots_ROS2_Driver) - Official ROS 2 driver for Universal Robots CB3 and e-Series arms, including controller communication and bringup packages.
  - Hardware: Universal Robots CB3, Universal Robots e-Series.
  - Source: official; review: curated; license: BSD-3-Clause; last checked: 2026-06-02.
  - Caveat: Verify exact PolyScope, external-control, and ROS distro support upstream before deployment.

- [Franka ROS 2](https://github.com/frankarobotics/franka_ros2) - ROS 2 integration packages for Franka research robots.
  - Hardware: Franka research robots.
  - Source: official; review: curated; license: Apache-2.0; last checked: 2026-06-02.
  - Caveat: Confirm exact arm generation, libfranka version, and supported ROS distro upstream.

- [FANUC ROS 2 Driver](https://github.com/FANUC-CORPORATION/fanuc_driver) - FANUC-maintained ROS 2 driver project for FANUC robot controllers.
  - Hardware: FANUC robots.
  - Source: official; review: curated; license: NOASSERTION; last checked: 2026-06-02.
  - Caveat: GitHub API did not expose an SPDX license; confirm license, controller options, and supported robot models upstream.

- [Kinova ROS 2 Kortex](https://github.com/Kinovarobotics/ros2_kortex) - ROS 2 driver packages for Kinova Gen3 arms using the Kortex API.
  - Hardware: Kinova Gen3.
  - Source: official; review: curated; license: NOASSERTION; last checked: 2026-06-02.
  - Caveat: GitHub API did not expose an SPDX license; confirm licensing, firmware, and supported distros upstream.

- [xArm ROS 2](https://github.com/xArm-Developer/xarm_ros2) - ROS 2 packages for UFACTORY xArm robot arms.
  - Hardware: UFACTORY xArm.
  - Source: official; review: curated; license: BSD-3-Clause; last checked: 2026-06-02.
  - Caveat: Confirm model coverage, controller firmware, and branch/distro mapping upstream.

- [Doosan Robot 2](https://github.com/DoosanRobotics/doosan-robot2) - ROS 2 packages for Doosan robot arms.
  - Hardware: Doosan robots.
  - Source: official; review: curated; license: BSD-3-Clause; last checked: 2026-06-02.
  - Caveat: Confirm controller software requirements and model coverage upstream.

- [MotoROS2](https://github.com/Yaskawa-Global/motoros2) - ROS 2 node for MotoPlus-compatible Yaskawa Motoman robot controllers.
  - Hardware: Yaskawa Motoman controllers.
  - Source: official; review: curated; license: NOASSERTION; last checked: 2026-06-02.
  - Caveat: GitHub API did not expose an SPDX license; confirm controller generation, MotoPlus requirements, and license upstream.

- [KUKA RSI Driver](https://github.com/fzi-forschungszentrum-informatik/kuka_rsi_driver) - ros2_control driver for KUKA arms using the Robot Sensor Interface.
  - Hardware: KUKA industrial arms.
  - Source: community; review: curated; license: BSD-3-Clause; last checked: 2026-06-02.
  - Caveat: Hardware use depends on KUKA RSI availability and controller configuration.

- [TM ROS 2](https://github.com/TechmanRobotInc/tmr_ros2) - Experimental ROS 2 driver packages for Techman robots.
  - Hardware: Techman robots.
  - Source: official; review: curated; license: NOASSERTION; last checked: 2026-06-02.
  - Caveat: GitHub API did not expose an SPDX license; verify current branch, distro support, and model coverage upstream.

- [AUBO ROS 2 Driver](https://github.com/AuboRobot/aubo_ros2_driver) - ROS 2 driver repository for AUBO robot arms.
  - Hardware: AUBO robot arms.
  - Source: official; review: curated; license: NOASSERTION; last checked: 2026-06-02.
  - Caveat: GitHub API did not expose an SPDX license; confirm supported controller versions, models, and distro branches upstream.

## Mobile Bases And Robots

Drivers and platform package stacks for mobile robots and base platforms.

- [TurtleBot3](https://github.com/ROBOTIS-GIT/turtlebot3) - ROS packages for TurtleBot3 mobile robots, including ROS 2 branches and platform bringup.
  - Hardware: TurtleBot3.
  - Source: official; review: curated; license: Apache-2.0; last checked: 2026-06-02.
  - Caveat: Check branch and distro documentation before use because ROS 1 and ROS 2 material coexist upstream.

- [Clearpath Common](https://github.com/clearpathrobotics/clearpath_common) - Shared ROS 2 packages used across Clearpath robot platforms.
  - Hardware: Clearpath robot platforms.
  - Source: official; review: curated; license: BSD-3-Clause; last checked: 2026-06-02.
  - Caveat: Use upstream platform docs to map this common package stack to a specific Clearpath robot.

## Cameras And RGB-D

Camera, RGB-D, and image pipeline packages used for perception bringup.

- [RealSense ROS](https://github.com/realsenseai/realsense-ros) - ROS wrapper for Intel RealSense cameras.
  - Hardware: Intel RealSense cameras.
  - Source: official; review: curated; license: Apache-2.0; last checked: 2026-06-02.
  - Caveat: Confirm supported camera models, librealsense version, and ROS distro branch upstream.

- [ZED ROS 2 Wrapper](https://github.com/stereolabs/zed-ros2-wrapper) - ROS 2 wrapper for Stereolabs ZED cameras and the ZED SDK.
  - Hardware: Stereolabs ZED cameras.
  - Source: official; review: curated; license: Apache-2.0; last checked: 2026-06-02.
  - Caveat: Confirm ZED SDK version, CUDA/platform requirements, camera model coverage, and ROS distro support upstream.

- [DepthAI ROS](https://github.com/luxonis/depthai-ros) - Official ROS driver packages for Luxonis DepthAI and OAK sensors.
  - Hardware: Luxonis DepthAI sensors, Luxonis OAK cameras.
  - Source: official; review: curated; license: MIT; last checked: 2026-06-02.
  - Caveat: Confirm device model, firmware, DepthAI library version, and branch/distro mapping upstream.

- [Zivid ROS](https://github.com/zivid/zivid-ros) - Official ROS driver for Zivid 3D cameras.
  - Hardware: Zivid 3D cameras.
  - Source: official; review: curated; license: BSD-3-Clause; last checked: 2026-06-02.
  - Caveat: Confirm supported Zivid SDK version, camera model, and ROS distro support upstream.

- [Orbbec SDK ROS 2](https://github.com/orbbec/OrbbecSDK_ROS2) - ROS 2 wrapper for Orbbec depth cameras using the Orbbec SDK.
  - Hardware: Orbbec depth cameras.
  - Source: official; review: curated; license: Apache-2.0; last checked: 2026-06-02.
  - Caveat: Confirm supported camera models, SDK version, USB requirements, and distro branches upstream.

- [USB Cam](https://github.com/ros-drivers/usb_cam) - ROS driver for Video4Linux USB cameras.
  - Hardware: V4L2 USB cameras.
  - Source: community; review: curated; license: NOASSERTION; last checked: 2026-06-02.
  - Caveat: GitHub API did not expose an SPDX license; inspect package license files and camera-specific V4L2 behavior upstream.

- [Image Pipeline](https://github.com/ros-perception/image_pipeline) - ROS image processing pipeline packages used by many camera stacks.
  - Hardware: camera pipelines.
  - Source: community; review: curated; license: NOASSERTION; last checked: 2026-06-02.
  - Caveat: GitHub API did not expose an SPDX license; inspect package-level licenses and distro docs upstream.

## LiDAR

2D and 3D LiDAR drivers and sensor wrappers.

- [Velodyne](https://github.com/ros-drivers/velodyne) - ROS support for Velodyne 3D LiDARs.
  - Hardware: Velodyne 3D LiDAR.
  - Source: community; review: curated; license: NOASSERTION; last checked: 2026-06-02.
  - Caveat: GitHub API did not expose an SPDX license; confirm ROS 2 branch status, model coverage, and license upstream.

- [SICK Scan XD](https://github.com/SICKAG/sick_scan_xd) - Driver for a broad range of SICK LiDAR and radar devices with ROS support.
  - Hardware: SICK LiDAR sensors, SICK radar devices.
  - Source: official; review: curated; license: Apache-2.0; last checked: 2026-06-02.
  - Caveat: Confirm exact sensor family, launch configuration, fieldbus/network setup, and ROS 2 support notes upstream.

- [SLLIDAR ROS 2](https://github.com/Slamtec/sllidar_ros2) - ROS 2 driver repository for Slamtec SLLIDAR/RPLIDAR sensors.
  - Hardware: Slamtec SLLIDAR, Slamtec RPLIDAR.
  - Source: official; review: curated; license: BSD-2-Clause; last checked: 2026-06-02.
  - Caveat: Check upstream model coverage, serial/USB setup, and maintenance status before deployment.

- [Livox ROS Driver 2](https://github.com/Livox-SDK/livox_ros_driver2) - ROS and ROS 2 driver repository for Livox LiDAR devices.
  - Hardware: Livox LiDAR sensors.
  - Source: official; review: curated; license: NOASSERTION; last checked: 2026-06-02.
  - Caveat: GitHub API did not expose an SPDX license; confirm device model, Livox SDK version, and ROS 2 branch instructions upstream.

- [Ouster ROS](https://github.com/ouster-lidar/ouster-ros) - Official ROS drivers for Ouster OS and OSDome sensors.
  - Hardware: Ouster OS0, Ouster OS1, Ouster OS2, Ouster OSDome.
  - Source: official; review: curated; license: NOASSERTION; last checked: 2026-06-02.
  - Caveat: GitHub API did not expose an SPDX license; confirm firmware, sensor generation, and ROS 2 package support upstream.

- [RoboSense LiDAR SDK](https://github.com/RoboSense-LiDAR/rslidar_sdk) - RoboSense LiDAR SDK repository with ROS and ROS 2 support.
  - Hardware: RoboSense LiDAR sensors.
  - Source: official; review: curated; license: NOASSERTION; last checked: 2026-06-02.
  - Caveat: GitHub API did not expose an SPDX license; confirm sensor family, SDK mode, packet source, and ROS 2 instructions upstream.

- [ROS 2 Ouster Drivers](https://github.com/ros-drivers/ros2_ouster_drivers) - ROS 2 drivers for Ouster OS-series LiDAR sensors.
  - Hardware: Ouster OS-series LiDAR.
  - Source: community; review: curated; license: Apache-2.0; last checked: 2026-06-02.
  - Caveat: Check upstream activity and model/firmware support before use.

## IMU And Positioning

IMU, GNSS, inertial, and positioning sensor drivers used in robot state estimation.

- [MicroStrain Inertial](https://github.com/LORD-MicroStrain/microstrain_inertial) - ROS driver for MicroStrain inertial and positioning products.
  - Hardware: MicroStrain G-series sensors, MicroStrain C-series sensors.
  - Source: official; review: curated; license: NOASSERTION; last checked: 2026-06-02.
  - Caveat: GitHub API did not expose an SPDX license; confirm exact product family, transport, firmware, and ROS 2 branch support upstream.

## Grippers And End Effectors

Drivers for grippers, end effectors, and related actuator interfaces.

- [ROS 2 Robotiq Gripper](https://github.com/PickNikRobotics/ros2_robotiq_gripper) - ROS 2 integration for Robotiq grippers.
  - Hardware: Robotiq grippers.
  - Source: community; review: curated; license: BSD-3-Clause; last checked: 2026-06-02.
  - Caveat: Confirm exact gripper model, transport, and controller integration upstream.

- [Robotiq Hand-E Driver](https://github.com/AGH-CEAI/robotiq_hande_driver) - ROS 2 driver for the Robotiq Hand-E gripper.
  - Hardware: Robotiq Hand-E.
  - Source: community; review: curated; license: Apache-2.0; last checked: 2026-06-02.
  - Caveat: Confirm hardware transport, firmware assumptions, and ROS distro support upstream.

## Control And Hardware Interfaces

Core ROS 2 control frameworks, controllers, and generic hardware-interface packages.

- [ros2_control](https://github.com/ros-controls/ros2_control) - Generic framework for ROS 2 controllers and hardware interfaces.
  - Hardware: generic hardware interfaces.
  - Source: community; review: curated; license: Apache-2.0; last checked: 2026-06-02.
  - Caveat: Framework entry, not a device-specific driver; use it to evaluate hardware-interface architecture.

- [ros2_controllers](https://github.com/ros-controls/ros2_controllers) - Generic controller packages that accompany ros2_control.
  - Hardware: generic ROS 2 controllers.
  - Source: community; review: curated; license: Apache-2.0; last checked: 2026-06-02.
  - Caveat: Framework entry, not a device-specific driver; verify controller availability for the target ROS distro.

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
- A visible license, `NOASSERTION`, or a clear upstream licensing caveat.
- No claim that EXOKERN or this list has tested the driver on hardware.

Entries that are ROS 1 only, archived, experimental, or unclear should be labeled with a caveat instead of being presented as production-ready.

## Data And Automation

The canonical metadata lives in [data/index.json](data/index.json) and is documented by [data/schema.json](data/schema.json). The README is generated from that file so contributors only maintain one source of truth.

```bash
npm run generate
npm run validate
npm run audit:github
```

`npm run validate` checks schema version, category coverage, duplicate repositories, GitHub root URLs, clean metadata fields, and README drift. `npm run audit:github` checks that upstream repositories are still reachable, unarchived, and aligned with indexed license metadata.

## Related EXOKERN Spec

For deeper compatibility metadata, use the [EXOKERN Robot Skill Spec](https://github.com/Exokern/robot-skill-spec). This awesome list should not duplicate that schema. If an upstream project ships a `robot_skill.yaml`, link it in the entry metadata or pull request evidence; if not, use [templates/robot_skill.yaml](templates/robot_skill.yaml) as a starting point for a future overlay.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Pull requests should update [data/index.json](data/index.json), run `npm run generate`, and pass `npm run validate`.
