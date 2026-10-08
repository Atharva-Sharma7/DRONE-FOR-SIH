# References for the sih'26 

## Research Papers

### Use of drones for autonomus search and rescue
- [Unmanned Aerial Vehicles for Search and rescue: A survey](https://www.mdpi.com/2072-4292/15/13/3266)
- [Applications of UAVs in Search and Rescue](https://link.springer.com/chapter/10.1007/978-3-031-32037-8_5)
- [Unmanned aerial systems in search and rescue applications with their path planning: a review](https://iopscience.iop.org/article/10.1088/1742-6596/2115/1/012020)

### Use of lidar mapping for UAV search and rescue
- [Drone-Assisted Disaster Management: Finding Victims via Infrared Camera and Lidar Sensor Fusion](https://ieeexplore.ieee.org/abstract/document/7941945)
- [Drones for cooperative search and rescue in post-disaster situation](https://ieeexplore.ieee.org/abstract/document/7274615)
- [An Autonomous Drone for Avalanche Search and Rescue: Integrating ArduPilot and Tracking-Beacon Detection](https://ieeexplore.ieee.org/abstract/document/11062844)

### Use of ai neural networks along with drones in search and rescue in disaster events
- [AI-Based Drone Assisted Human Rescue in Disaster Environments: Challenges and Opportunities](https://link.springer.com/article/10.1134/S1054661824010152)

## AI model and Hardware References

### YOLO
Recommended primary real-time RGB person/object detector.
- Ultralytics: https://www.ultralytics.com/
- GitHub: https://github.com/ultralytics/ultralytics

### RT-DETR
Transformer-based real-time object detection baseline.
- Ultralytics documentation: https://docs.ultralytics.com/models/rtdetr/
- GitHub: https://github.com/lyuwenyu/RT-DETR

### SegFormer
Recommended for semantic segmentation tasks such as flood/water/terrain/obstacle segmentation.
- Paper: https://arxiv.org/abs/2105.15203
- GitHub: https://github.com/NVlabs/SegFormer
- Hugging Face: https://huggingface.co/docs/transformers/model_doc/segformer

### U-Net
Strong baseline for image segmentation, including thermal/flood segmentation.
- Paper: https://arxiv.org/abs/1505.04597

---


### Audio processing pipeline
AI models for on device compute
- [SileroVAD](https://pytorch.org/hub/snakers4_silero-vad_vad/)
- [yamNET](https://www.tensorflow.org/hub/tutorials/yamnet)

## Hardware
 Sensor | Approx. price (India) | Range | Notes |
|---|---|---|---|
| **RPLiDAR A1M8** | ~₹6,000–8,000 | 12 m | The default choice — huge community support, ROS/ROS2 drivers, used in nearly every SIH/college SLAM project. Best documentation and easiest bring-up. |
| **YDLiDAR X4 / X2** | ~₹4,000–6,000 | 8–10 m | Cheaper than the A1M8, slightly less community documentation but well-supported in ROS. Good fallback if budget is tight or A1M8 stock is unavailable. |
| **LD19 (LDROBOT)** | ~₹3,000–5,000 | 12 m | Very cheap, DToF-based, decent accuracy, growing ROS2 support — good budget alternative. |
| **RPLiDAR A2M12** | ~₹15,000–20,000 (imported) | 12–18 m, higher scan rate | Worth it only if leftover budget allows — better sample rate (16 kHz) and accuracy than the A1M8, still comfortably under ₹30,000 alone. |
| RPLiDAR A3 / higher | $400+ (~₹35,000+) | 25 m | **Out of budget** on its own — skip unless budget is per-subsystem rather than total. |

Sources:
- RPLiDAR A1M8 India listing/pricing: https://www.indiamart.com/proddetail/rplidar-a1-m8-360-degree-laser-scanner-2857949984288.html
- Budget LiDAR comparison for student robotics (D500, X4, A1): https://industrialmonitordirect.com/blogs/knowledgebase/affordable-lidar-options-for-student-robotics-projects
- Open 2D LiDAR spec/comparison list (RPLiDAR, YDLiDAR, LD-series, etc.): https://github.com/kaiaai/awesome-2d-lidars
- MLX90640 (unrelated — thermal, not LiDAR) breakout reference if combining with thermal: https://learn.sparkfun.com/tutorials/qwiic-ir-array-mlx90640-hookup-guide/introduction

---

## 2d lidar stack for the drone

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

## Architecture
```text
RGB Camera
    |
    v
YOLO / RT-DETR
    |
    +----> Person / Object Candidates
    |
Thermal Camera --------+
                       |
Microphone ------------+----> Multimodal Fusion ----> Survivor Confidence
                       |
IndicConformer --------+
                       |
Gas / VOC Sensors -----+
                       |
GPS + OSM + Bhuvan ----+----> Location / Risk / Rescue Route

```

### Edge ai workstation details

| Service | Model | Task | Params | Approx. VRAM (FP16, inference) | Notes |
|---|---|---|---|---|---|
| **Noise suppression front-end** | DroneAudioNet (AudioSep-based) | Suppress rotor/wind/environmental noise before classification | Source-separation scale, transformer-based | ~1.5–2 GB | Run this first in the pipeline; classification accuracy depends heavily on SNR improvement here. |
| **Human-presence classifier** | SSLAM (Self-Supervised Learning from Audio Mixtures) | Classify noise-suppressed audio into human-vocal / human-non-vocal / non-human / silence | Transformer-scale self-supervised audio model | ~2–3 GB | This is the SOTA baseline used in the DroneAudioSet benchmark; heaviest audio service on the workstation. |
| *(lighter fallback)* | AST (Audio Spectrogram Transformer) | Same task, lower accuracy ceiling | ~86 M | ~1 GB | Swap in if VRAM is tight or if SSLAM's latency doesn't fit your duty cycle. |

**Audio pipeline VRAM (SSLAM path): ~3.5–5 GB**
**Audio pipeline VRAM (AST fallback path): ~2.5–4 GB**

### Thermal inferrence

| Service | Model | Task | Approx. VRAM (FP16) | Notes |
|---|---|---|---|---|
| **Thermal person detector** | YOLOv8/v10-X or RT-DETR, fine-tuned on thermal SAR data (AIResQ / UNIRI-TID / Roboflow thermal) | Bounding-box human detection in IR frames | ~1–2 GB | Reference benchmark: 85% accuracy (YOLOv8-X) on Jetson AGX Orin-class hardware; a 4050 gives more headroom. |
| *(optional)* | U-Net-variant segmentation | Pixel-level person segmentation instead of boxes | ~1–1.5 GB | Reference benchmark: ~90% accuracy, but heavier than detection-only; use only if you need silhouette-level output. |

**Thermal pipeline VRAM: ~1–2 GB** (detection-only; add ~1–1.5 GB if running segmentation alongside)

### Thermal Data Processing

| Service | Model | Task | Approx. VRAM (FP16) | Notes |
|---|---|---|---|---|
| **Object detector** | YOLOv10 (or YOLO26) | General obstacle/object detection in visible-light frames | ~0.5–1 GB | Nano/small variant recommended to leave room for the rest of the stack. |
| **Monocular depth** | Depth Anything V3 — Small or Base | Per-frame depth map for obstacle distance without a stereo rig | Small: <1 GB · Base: ~1–1.5 GB (at ~500px input) | Small variant (~94 MB weights) is the practical choice under a 6 GB budget; Base only if VRAM allows. Avoid Large/Giant on this card. |
| **SLAM / mapping** | ORB-SLAM3 | Visual SLAM — pose estimation + sparse map | Minimal (~0–0.5 GB) | Primarily CPU-bound (feature extraction, bundle adjustment); doesn't meaningfully compete for VRAM. |

