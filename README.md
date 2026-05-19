# Awesome ROS 2 Robot Drivers

A curated list of ROS 2 robot, sensor, actuator, and hardware-interface drivers.

This list is for finding maintained driver repositories before choosing a hardware stack. It is not a compatibility guarantee, safety certification, installation guide, or endorsement by the original vendors unless the upstream repository says so.

## Contents

- [Industrial Manipulators](#industrial-manipulators)
- [Mobile Bases And Robots](#mobile-bases-and-robots)
- [Cameras And RGB-D](#cameras-and-rgb-d)
- [LiDAR](#lidar)
- [Grippers And End Effectors](#grippers-and-end-effectors)
- [Control And Hardware Interfaces](#control-and-hardware-interfaces)
- [How Entries Are Reviewed](#how-entries-are-reviewed)
- [Related EXOKERN Spec](#related-exokern-spec)

## Industrial Manipulators

- [Universal Robots ROS 2 Driver](https://github.com/UniversalRobots/Universal_Robots_ROS2_Driver) - Official ROS 2 driver for Universal Robots CB3 and e-Series arms.
- [Franka ROS 2](https://github.com/frankarobotics/franka_ros2) - ROS 2 integration for Franka research robots.
- [FANUC ROS 2 Driver](https://github.com/FANUC-CORPORATION/fanuc_driver) - FANUC-maintained ROS 2 driver project.
- [Kinova ROS 2 Kortex](https://github.com/Kinovarobotics/ros2_kortex) - ROS 2 driver for Kinova Gen3 arms.
- [xArm ROS 2](https://github.com/xArm-Developer/xarm_ros2) - ROS 2 packages for UFACTORY xArm robots.
- [Doosan Robot 2](https://github.com/DoosanRobotics/doosan-robot2) - ROS 2 packages for Doosan robots.
- [MotoROS2](https://github.com/Yaskawa-Global/motoros2) - ROS 2 node for Yaskawa Motoman controllers through MotoPlus-compatible controllers.
- [KUKA RSI Driver](https://github.com/fzi-forschungszentrum-informatik/kuka_rsi_driver) - `ros2_control` driver for KUKA industrial arms using RSI.
- [TM ROS 2](https://github.com/TechmanRobotInc/tmr_ros2) - Experimental ROS 2 driver packages for Techman robots.

## Mobile Bases And Robots

- [TurtleBot3](https://github.com/ROBOTIS-GIT/turtlebot3) - ROS packages for TurtleBot3 mobile robots, including ROS 2 branches.
- [Clearpath Common](https://github.com/clearpathrobotics/clearpath_common) - Shared ROS 2 packages used across Clearpath robot platforms.

## Cameras And RGB-D

- [RealSense ROS](https://github.com/realsenseai/realsense-ros) - ROS wrapper for Intel RealSense cameras.
- [USB Cam](https://github.com/ros-drivers/usb_cam) - ROS driver for V4L2 USB cameras.
- [Image Pipeline](https://github.com/ros-perception/image_pipeline) - ROS image processing pipeline used by many camera stacks.

## LiDAR

- [Velodyne](https://github.com/ros-drivers/velodyne) - ROS support for Velodyne 3D LiDARs.
- [ROS 2 Ouster Drivers](https://github.com/ros-drivers/ros2_ouster_drivers) - ROS 2 drivers for Ouster OS-series LiDARs.

## Grippers And End Effectors

- [ROS 2 Robotiq Gripper](https://github.com/PickNikRobotics/ros2_robotiq_gripper) - ROS 2 Robotiq gripper integration.
- [Robotiq Hand-E Driver](https://github.com/AGH-CEAI/robotiq_hande_driver) - ROS 2 driver for the Robotiq Hand-E gripper.

## Control And Hardware Interfaces

- [ros2_control](https://github.com/ros-controls/ros2_control) - Generic controls framework for ROS 2 hardware interfaces.
- [ros2_controllers](https://github.com/ros-controls/ros2_controllers) - Generic controllers that accompany `ros2_control`.

## How Entries Are Reviewed

Main-list entries should have:

- A public GitHub repository.
- A clear ROS 2 driver, wrapper, bridge, hardware-interface, or controller role.
- Recent activity or a reason to keep a stable but slow-moving driver.
- A visible license or clear upstream licensing note.
- A concise caveat when the repo is experimental, ROS 1 only, archived, or hardware-specific.

Entry metadata lives in [data/index.json](data/index.json). The README is intentionally readable first; the data file carries machine-checkable review details.

## Related EXOKERN Spec

For deeper compatibility metadata, use the [EXOKERN Robot Skill Spec](https://github.com/Exokern/robot-skill-spec). This awesome list should not duplicate that schema. If an upstream project ships a `robot_skill.yaml`, link it in the entry metadata; if not, use [templates/robot_skill.yaml](templates/robot_skill.yaml) as a starting point for a future overlay.

