# Workstation Hardware & Services Analysis

Target hardware: **edge AI workstation, RTX 4050-class GPU.**

Note up front: the RTX 4050 exists only as a **laptop** part — **6 GB
GDDR6 VRAM**, no desktop SKU. Every budget below assumes that 6 GB ceiling.
If your actual box is a desktop with a different 40-series card (more VRAM),
the headroom estimates get more comfortable but the service breakdown itself
doesn't change.

This document catalogs every AI service assigned to the workstation tier
across the audio, thermal, and visual reconnaissance pipelines discussed
earlier, with resource footprint and concurrency notes. LiDAR SLAM
(slam_toolbox) is **not** included — it runs on the Raspberry Pi 5 tier and
is CPU-only.

---

## 1. Service catalog

### 1.1 Audio — human-vocal vs. ambient detection

| Service | Model | Task | Params | Approx. VRAM (FP16, inference) | Notes |
|---|---|---|---|---|---|
| **Noise suppression front-end** | DroneAudioNet (AudioSep-based) | Suppress rotor/wind/environmental noise before classification | Source-separation scale, transformer-based | ~1.5–2 GB | Run this first in the pipeline; classification accuracy depends heavily on SNR improvement here. |
| **Human-presence classifier** | SSLAM (Self-Supervised Learning from Audio Mixtures) | Classify noise-suppressed audio into human-vocal / human-non-vocal / non-human / silence | Transformer-scale self-supervised audio model | ~2–3 GB | This is the SOTA baseline used in the DroneAudioSet benchmark; heaviest audio service on the workstation. |
| *(lighter fallback)* | AST (Audio Spectrogram Transformer) | Same task, lower accuracy ceiling | ~86 M | ~1 GB | Swap in if VRAM is tight or if SSLAM's latency doesn't fit your duty cycle. |

**Audio pipeline VRAM (SSLAM path): ~3.5–5 GB**
**Audio pipeline VRAM (AST fallback path): ~2.5–4 GB**

### 1.2 Thermal imagery — human detection

| Service | Model | Task | Approx. VRAM (FP16) | Notes |
|---|---|---|---|---|
| **Thermal person detector** | YOLOv8/v10-X or RT-DETR, fine-tuned on thermal SAR data (AIResQ / UNIRI-TID / Roboflow thermal) | Bounding-box human detection in IR frames | ~1–2 GB | Reference benchmark: 85% accuracy (YOLOv8-X) on Jetson AGX Orin-class hardware; a 4050 gives more headroom. |
| *(optional)* | U-Net-variant segmentation | Pixel-level person segmentation instead of boxes | ~1–1.5 GB | Reference benchmark: ~90% accuracy, but heavier than detection-only; use only if you need silhouette-level output. |

**Thermal pipeline VRAM: ~1–2 GB** (detection-only; add ~1–1.5 GB if running segmentation alongside)

### 1.3 Visual reconnaissance

| Service | Model | Task | Approx. VRAM (FP16) | Notes |
|---|---|---|---|---|
| **Object detector** | YOLOv10 (or YOLO26) | General obstacle/object detection in visible-light frames | ~0.5–1 GB | Nano/small variant recommended to leave room for the rest of the stack. |
| **Monocular depth** | Depth Anything V3 — Small or Base | Per-frame depth map for obstacle distance without a stereo rig | Small: <1 GB · Base: ~1–1.5 GB (at ~500px input) | Small variant (~94 MB weights) is the practical choice under a 6 GB budget; Base only if VRAM allows. Avoid Large/Giant on this card. |
| **SLAM / mapping** | ORB-SLAM3 | Visual SLAM — pose estimation + sparse map | Minimal (~0–0.5 GB) | Primarily CPU-bound (feature extraction, bundle adjustment); doesn't meaningfully compete for VRAM. |

**Visual reconnaissance VRAM: ~1.5–2.5 GB**

### 1.4 Fusion / coordination layer (optional, recommended)

| Service | Task | Approx. VRAM | Notes |
|---|---|---|---|
| **Detection fusion node** | Combine audio (SSLAM), thermal (YOLO/RT-DETR), and visual (YOLOv10) detection events into a single victim-localization estimate, tagged with LiDAR map coordinates from the Pi tier | Negligible — this is coordination logic, not a model | Not yet built in this project; flagged here as the natural next service if you want unified alerts rather than three separate detection streams. |

---

## 2. VRAM budget summary (RTX 4050, 6 GB)

| Scenario | Services running concurrently | Estimated total VRAM |
|---|---|---|
| **Full stack, SSLAM path** | Noise suppression + SSLAM + thermal detector + YOLOv10 + Depth Anything V3-Small + ORB-SLAM3 (CPU) | ~6–8.5 GB — **over budget on a 6 GB card** |
| **Full stack, AST fallback** | Noise suppression + AST + thermal detector + YOLOv10 + Depth Anything V3-Small + ORB-SLAM3 (CPU) | ~5–7 GB — **tight, likely still over** |
| **Sequential/on-demand (recommended)** | Only load audio *or* thermal *or* visual models actively needed for the current duty cycle; keep the rest unloaded until triggered | ~2–3.5 GB at any one time — comfortable |

**Bottom line: don't run everything simultaneously at full precision on a 6 GB
card.** Three practical ways to close the gap:

1. **Time-multiplex, not co-run.** Audio human-presence detection is cheap
   and can run continuously; only spin up the (heavier) thermal/visual
   detectors when audio flags a candidate, or on a duty cycle (e.g. thermal
   scan every N seconds rather than every frame).
2. **Quantize.** INT8 quantization on the classifiers/detectors (SSLAM, YOLO
   variants) typically halves VRAM with a small accuracy cost — worth
   benchmarking against your own SAR-audio/thermal validation sets before
   committing.
3. **Drop to the AST + Depth Anything V3-Small combination** as the default
   "always-on" profile, and treat SSLAM / Depth Anything V3-Base as
   higher-accuracy modes triggered only when a detection is already
   suspected — trading a bit of continuous-monitoring accuracy for headroom.

---

## 3. Compute (non-VRAM) notes

- **ORB-SLAM3** and the **fusion/coordination layer** are CPU-bound — budget
  CPU cores separately from the GPU services above; don't assume GPU headroom
  covers them.
- **DroneAudioNet-style noise suppression** running continuously alongside a
  GPU-bound detector is the most likely source of thermal throttling on a
  laptop chassis during sustained field use — worth stress-testing duty
  cycle and cooling before deployment, not just VRAM fit.

---

## 4. Open items

- No benchmarked VRAM numbers are available yet for SSLAM specifically on
  consumer hardware — the ranges above are estimated from comparable
  transformer-scale audio model sizes and should be validated by running the
  actual checkpoint on your card before finalizing the concurrency plan.
- Decide whether the fusion/coordination layer (Section 1.4) is in scope —
  if so it becomes the natural place to also ingest the Pi-side LiDAR map
  coordinates for full multi-sensor victim localization.
