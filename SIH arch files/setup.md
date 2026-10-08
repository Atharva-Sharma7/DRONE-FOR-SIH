# LiDAR Mapping Setup — Resource Guide

Reference notes and links for standing up a real-time LiDAR SLAM pipeline for
search-and-rescue reconnaissance (mapping + localization while moving through
unknown, cluttered environments).

---

## 1. Choosing hardware

| Sensor class | Example | Notes |
|---|---|---|
| Solid-state LiDAR | **Livox Mid-360 / Mid-360S** | 360° coverage, ~0.1 m near-field blind zone, compact, widely used with FAST-LIO2. Good default for a mobile SAR unit. |
| Solid-state, narrow FOV | Livox Avia / Horizon / MID-70 | Cheaper, smaller FOV — fine if mounted with a gimbal or on a drone with forward-facing coverage. |
| Mechanical spinning LiDAR | Velodyne VLP-16, Ouster OS0/OS1 | Well-supported, more expensive, heavier — common in published LIO-SAM demos. |
| Budget 2D | RPLidar A1/A3 | 2D only — fine for flat-ground indoor mapping, not for full 3D reconstruction of rubble/uneven terrain. |

For SAR specifically (uneven terrain, need for full 3D reconstruction, weight
constraints on a portable/robot platform), a solid-state 360° unit like the
**Livox Mid-360** paired with an IMU is the most common current choice —
compact form factor and a surrounding view helps scan matching during turns
and through repeated/ambiguous geometry (hallways, tunnels, collapsed structure).

Sources:
- Livox Mid-360S + FAST-LIO2 setup walkthrough: https://openelab.io/blogs/learn/livox-mid-360s-fast-lio2-slam-real-time-mapping-workflow-ros2
- MLX90640 (unrelated — thermal, not LiDAR) breakout reference if combining with thermal: https://learn.sparkfun.com/tutorials/qwiic-ir-array-mlx90640-hookup-guide/introduction

---

## 2. Choosing the SLAM algorithm

The two dominant tightly-coupled LiDAR-inertial options right now:

- **FAST-LIO2** — direct point-to-map registration via an incremental k-d tree,
  no manual feature extraction needed. Lower compute cost, works well on
  solid-state LiDARs (e.g. Livox), and has been run on ARM-class edge hardware
  including a Raspberry Pi 4B (8GB) and Jetson TX2 — relevant if you want a
  lightweight forward node.
  - Repo (ROS1 origin): https://github.com/hku-mars/FAST_LIO
  - ROS2 port (MIT-SPARK): https://github.com/MIT-SPARK/spark-fast-lio
  - ROS2 port + Scan Context loop closure: https://github.com/rohrschacht/FAST_LIO_SLAM_ros2

- **LIO-SAM** — factor-graph backend (GTSAM) with IMU pre-integration and
  optional GPS factors, better global consistency / loop closure out of the
  box. Slightly heavier computationally, more commonly paired with mechanical
  spinning LiDARs (Velodyne).
  - Repo: https://github.com/TixiaoShan/LIO-SAM
  - ROS2 walkthrough with worked example: https://medium.com/@rsasaki0109/lidar-inertial-slam-on-ros2-bffba631a480

**Practical recommendation:** start with FAST-LIO2 if you're on a Livox sensor
and want lower latency / lighter compute for a portable rig; move to LIO-SAM
(or FAST-LIO2 + a pose-graph backend like KISS-Matcher-SAM) once you need
robust loop closure across a large or revisited SAR site.

Other variants worth knowing about if FAST-LIO2/LIO-SAM don't fit:
- **Faster-LIO** — same lineage as FAST-LIO2, swaps the k-d tree for an
  incremental voxel (iVox) structure for extra speed at similar accuracy.
- **Point-LIO / Voxel-Map** — alternative point-cloud map representations,
  evaluated head-to-head with the above in a recent SLAM benchmarking survey:
  https://arxiv.org/pdf/2311.00276

---

## 3. ROS2 integration checklist

1. **Install ROS2** (Humble or Jazzy recommended — both officially supported
   by the Livox driver).
2. **Install the LiDAR driver** — for Livox sensors: `livox_ros_driver2`
   (must be built and sourced before FAST-LIO2, since FAST-LIO2 depends on its
   message types for Livox sensors).
3. **Install PCL (>=1.8) and Eigen (>=3.3.4)** — required by FAST-LIO2.
4. **Clone and build the SLAM package** into your colcon workspace:
   ```bash
   cd ~/ros2_ws/src
   git clone https://github.com/MIT-SPARK/spark-fast-lio.git
   cd ..
   colcon build --packages-select fast_lio
   ```
5. **Remap topics** in the launch file to match your LiDAR/IMU topic names —
   this is the single most common setup failure. Verify point-cloud and IMU
   timestamps are synchronized before trusting the map output.
6. **Verify mounting/calibration** — LiDAR-to-IMU extrinsics (translation +
   rotation) need to be set correctly in the config; a wrong extrinsic is the
   second most common source of drift/distorted maps.
7. **Visualize** in RViz2 to sanity-check the live map as you walk/drive the
   platform through a test space before trusting it in the field.
8. **(Optional) Add loop closure** — e.g. KISS-Matcher-SAM alongside
   spark-fast-lio for globally consistent maps over larger areas:
   https://github.com/MIT-SPARK/KISS-Matcher

---

## 4. Further reading

- LiDAR-based SLAM survey (state of the art + algorithm family tree —
  FAST-LIO2, Faster-LIO, LIO-SAM, Voxel-Map, etc.): https://arxiv.org/pdf/2311.00276
- FAST-LIO2 paper (IEEE T-RO): "FAST-LIO2: Fast Direct LiDAR-Inertial Odometry" — W. Xu, Y. Cai, D. He, J. Lin, F. Zhang, 2022.
- LIO-SAM paper (IROS 2020): "LIO-SAM: Tightly-coupled Lidar Inertial Odometry via Smoothing and Mapping" — T. Shan et al.
- Edge computing survey for robotics (offloading SLAM, multi-robot edge SLAM): https://arxiv.org/pdf/2507.00523

---

## 5. Notes specific to this SAR use case

- Uneven terrain (rubble, stairs, slopes) benefits from a rotation-optimized
  or terrain-aware variant rather than assuming a flat-ground prior — worth
  reviewing ROLO-SLAM if the deployment environment is consistently uneven:
  https://arxiv.org/pdf/2501.02166
- If pairing LiDAR with the thermal/audio pipelines already discussed, keep
  all sensor streams on a common clock (hardware-synced or NTP/PTP-disciplined)
  so you can fuse human-detection events (audio, thermal) with the LiDAR map
  coordinates for victim localization, not just raw detection.
