# LiDAR Mapping Setup — Resource Guide

Reference notes and links for standing up a real-time LiDAR SLAM pipeline for
search-and-rescue reconnaissance (mapping + localization while moving through
unknown, cluttered environments).

---

## 1. Choosing hardware — budget: ₹30,000 (SIH prototype)

A Livox/Velodyne-class 3D LiDAR (₹1.5L–4L+ imported) is well outside this
budget, so the realistic path for a ₹30,000 SIH prototype is a **2D
triangulation LiDAR** paired with a cheap IMU, leaving most of the budget
for compute (Raspberry Pi / Jetson Nano) and the rest of the platform.

| Sensor | Approx. price (India) | Range | Notes |
|---|---|---|---|
| **RPLiDAR A1M8** | ~₹6,000–8,000 | 12 m | The default choice — huge community support, ROS/ROS2 drivers, used in nearly every SIH/college SLAM project. Best documentation and easiest bring-up. |
| **YDLiDAR X4 / X2** | ~₹4,000–6,000 | 8–10 m | Cheaper than the A1M8, slightly less community documentation but well-supported in ROS. Good fallback if budget is tight or A1M8 stock is unavailable. |
| **LD19 (LDROBOT)** | ~₹3,000–5,000 | 12 m | Very cheap, DToF-based, decent accuracy, growing ROS2 support — good budget alternative. |
| **RPLiDAR A2M12** | ~₹15,000–20,000 (imported) | 12–18 m, higher scan rate | Worth it only if leftover budget allows — better sample rate (16 kHz) and accuracy than the A1M8, still comfortably under ₹30,000 alone. |
| RPLiDAR A3 / higher | $400+ (~₹35,000+) | 25 m | **Out of budget** on its own — skip unless budget is per-subsystem rather than total. |

**Recommendation for a ₹30,000 SIH prototype:** RPLiDAR A1M8 (~₹6,600) +
a cheap 6/9-axis IMU (MPU-6050/9250, a few hundred rupees) + a Raspberry Pi
5 or Jetson Nano for compute. This leaves the bulk of the ₹30,000 for the
compute board, power system, and chassis rather than the sensor itself.

Sources:
- RPLiDAR A1M8 India listing/pricing: https://www.indiamart.com/proddetail/rplidar-a1-m8-360-degree-laser-scanner-2857949984288.html
- Budget LiDAR comparison for student robotics (D500, X4, A1): https://industrialmonitordirect.com/blogs/knowledgebase/affordable-lidar-options-for-student-robotics-projects
- Open 2D LiDAR spec/comparison list (RPLiDAR, YDLiDAR, LD-series, etc.): https://github.com/kaiaai/awesome-2d-lidars
- MLX90640 (unrelated — thermal, not LiDAR) breakout reference if combining with thermal: https://learn.sparkfun.com/tutorials/qwiic-ir-array-mlx90640-hookup-guide/introduction

---

## 2. Choosing the SLAM algorithm (2D LiDAR stack)

A 2D LiDAR like the A1M8/X4/LD19 doesn't produce a 3D point cloud, so the
heavier 3D LiDAR-inertial pipelines (FAST-LIO2, LIO-SAM) aren't the right
fit — those assume a 3D scanning or solid-state LiDAR (Velodyne/Livox-class,
well outside this budget). For a 2D scanner, use a 2D SLAM stack instead:

- **slam_toolbox** — the current standard for ROS2, actively maintained,
  supports both online mapping and lifelong/relocalization workflows. This
  is the default recommendation for a ROS2-based SIH prototype.
  - Repo: https://github.com/SteveMacenski/slam_toolbox
- **Cartographer (cartographer_ros)** — Google's pose-graph SLAM with loop
  closure, well-proven, a bit heavier to configure than slam_toolbox but
  very robust for larger/looped environments.
  - Repo: https://github.com/cartographer-project/cartographer_ros
- **Hector SLAM** — simple, doesn't require odometry input at all (useful if
  wheel encoders are unreliable on rough SAR terrain), but has no loop
  closure — fine for smaller single-pass maps, less good for large or
  revisited areas.
  - Repo: https://github.com/tu-darmstadt-ros-pkg/hector_slam
- **GMapping** — the classic particle-filter approach, ROS1-era but still
  ported/available; mostly superseded by slam_toolbox on ROS2 now.

**Practical recommendation:** use **slam_toolbox** with the RPLiDAR/YDLiDAR
driver and Nav2 for navigation — it's the best-documented path for a ROS2
SIH build and has the most current community support and tutorials.

**If budget later allows a 3D LiDAR upgrade** (e.g. after the hackathon,
moving to a funded prototype), FAST-LIO2/LIO-SAM become relevant — see the
original 3D LIO notes in section 5 for that upgrade path.

---

## 3. ROS2 integration checklist

1. **Install ROS2** (Humble or Jazzy recommended — both have current
   `rplidar_ros` and `slam_toolbox` packages).
2. **Install the LiDAR driver:**
   - RPLiDAR: `sudo apt install ros-<distro>-rplidar-ros` (or build
     `rplidar_ros` from source: https://github.com/Slamtec/rplidar_ros)
   - YDLiDAR: `ydlidar_ros2_driver` — https://github.com/YDLIDAR/ydlidar_ros2_driver
3. **Install slam_toolbox:**
   ```bash
   sudo apt install ros-<distro>-slam-toolbox
   ```
   or build from source: https://github.com/SteveMacenski/slam_toolbox
4. **Launch the LiDAR driver** and confirm you're getting a `LaserScan`
   message on `/scan` (check with `ros2 topic echo /scan`) before touching
   SLAM.
5. **Launch slam_toolbox** in online async mode, pointed at your `/scan`
   topic and (if available) odometry from wheel encoders or the IMU.
6. **Verify mounting** — make sure the LiDAR is mounted level and its frame
   (`base_laser`/`laser_link`) is correctly published in your URDF/TF tree;
   a tilted or misplaced LiDAR is the most common source of a warped map.
7. **Visualize** in RViz2 to sanity-check the live map as you move the
   platform through a test space before trusting it in the field.
8. **Add Nav2** on top once mapping looks solid, for autonomous path
   planning/navigation through the mapped space:
   https://github.com/ros-navigation/navigation2

---

## 4. Further reading

- slam_toolbox documentation and tuning guide: https://github.com/SteveMacenski/slam_toolbox
- Nav2 (navigation stack) docs: https://docs.nav2.org/
- Budget LiDAR comparison for student/hackathon robotics projects: https://industrialmonitordirect.com/blogs/knowledgebase/affordable-lidar-options-for-student-robotics-projects
- Open 2D LiDAR spec/comparison list (wiring, protocols, identification): https://github.com/kaiaai/awesome-2d-lidars
- Edge computing survey for robotics (offloading SLAM, multi-robot edge SLAM): https://arxiv.org/pdf/2507.00523

---

## 5. Notes specific to this SAR use case

- 2D LiDAR + slam_toolbox gives you a flat-plane map, which is enough for
  most single-floor SAR indoor/rubble navigation, but it won't capture
  vertical structure (e.g. a person under a collapsed staircase above the
  scan plane). If that matters for the mission, consider mounting the
  RPLiDAR on a tilting/nodding servo mount to sweep a rough 3D scan, which
  is a common budget workaround for full 3D LiDAR.
- If pairing LiDAR with the thermal/audio pipelines already discussed, keep
  all sensor streams on a common clock (hardware-synced or NTP/PTP-disciplined)
  so you can fuse human-detection events (audio, thermal) with the LiDAR map
  coordinates for victim localization, not just raw detection.
- **Future upgrade path (post-hackathon, bigger budget):** once funding
  allows a true 3D solid-state LiDAR (e.g. Livox Mid-360), the tightly-coupled
  LiDAR-inertial pipelines FAST-LIO2 and LIO-SAM become the relevant choice
  for full 3D reconstruction of uneven/rubble terrain:
  - FAST-LIO2 (ROS2 port): https://github.com/MIT-SPARK/spark-fast-lio
  - LIO-SAM: https://github.com/TixiaoShan/LIO-SAM
  - LiDAR SLAM survey covering both and their variants: https://arxiv.org/pdf/2311.00276
  - Terrain-aware variant for uneven ground (ROLO-SLAM): https://arxiv.org/pdf/2501.02166
