# AERIS-SAR — AI & Geospatial Resources

This file collects the main open-source, Indian-native, research, and geospatial resources referenced for the AERIS-SAR rescue/drone system.

## 1. Indian-Native AI / Language Resources

### AI4Bharat — IIT Madras
- Official site: https://ai4bharat.iitm.ac.in/
- Models: https://ai4bharat.iitm.ac.in/models
- GitHub: https://github.com/AI4Bharat

### IndicConformer
Indian-language automatic speech recognition (ASR), recommended for replacing browser-only speech recognition in the production AI pipeline.
- AI4Bharat models: https://ai4bharat.iitm.ac.in/models
- Hugging Face: https://huggingface.co/ai4bharat
- IndiaAI model listing: https://indiaai.gov.in/

### IndicTrans2
Open-source multilingual translation covering all 22 scheduled Indian languages.
- GitHub: https://github.com/AI4Bharat/IndicTrans2
- Hugging Face: https://huggingface.co/ai4bharat
- IndicTrans2 200M model: https://huggingface.co/ai4bharat/indictrans2-indic-en-1B
- AI4Bharat models: https://ai4bharat.iitm.ac.in/models

### IndicBERT / IndicBART / IndicNER
Useful for Indian-language intent classification, NLP, and entity extraction.
- AI4Bharat models: https://ai4bharat.iitm.ac.in/models
- AI4Bharat GitHub: https://github.com/AI4Bharat

---

## 2. Vision AI Models

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

## 3. Audio / Acoustic Rescue AI

### CNN / CRNN
Use a CNN or CRNN classifier for screams, whistles, knocks, calls for help, and other rescue-relevant acoustic events.

Useful open-source audio ML ecosystem:
- PyTorch Audio: https://pytorch.org/audio/
- torchaudio GitHub: https://github.com/pytorch/audio

### AudioSet
Large-scale audio event dataset that can be useful for pretraining/general acoustic-event recognition.
- https://research.google.com/audioset/

---

## 4. Sensor / E-Nose AI

### XGBoost
Useful for classifying gas/VOC sensor patterns after feature extraction.
- Official documentation: https://xgboost.readthedocs.io/
- GitHub: https://github.com/dmlc/xgboost

### 1D-CNN
Useful for learning temporal patterns directly from multi-sensor gas/VOC streams.
- PyTorch: https://pytorch.org/

### Relevant sensor families in the AERIS-SAR prototype
- Bosch BME680: https://www.bosch-sensortec.com/products/environmental-sensors/gas-sensors/bme680/
- Sensirion SGP30: https://sensirion.com/products/catalog/SGP30/
- ams OSRAM CCS811: https://ams-osram.com/products/environmental-sensors/air-quality-sensors/ccs811
- MQ-series gas sensors: https://www.winsen-sensor.com/

---

## 5. Multimodal Sensor Fusion

### Bayesian Fusion
Use probabilistic fusion to combine independent evidence from:
- RGB person detection
- Thermal detection
- Acoustic detection
- Voice/ASR
- GPS/geospatial information
- Gas/environmental sensors

General reference:
- Bayesian inference overview: https://en.wikipedia.org/wiki/Bayesian_inference

### Weighted / Rule-Based Fusion
A practical competition prototype can use confidence-weighted fusion and 2-of-N confirmation before declaring a survivor confirmed.

---

## 6. Geospatial / Indian Mapping Resources

### Bhuvan — ISRO / NRSC
Primary Indian-native geospatial platform recommended for the AERIS-SAR interface.
- Bhuvan 2D viewer: https://bhuvan-app1.nrsc.gov.in/bhuvan2d/bhuvan/bhuvan2d.php
- Bhuvan Store: https://bhuvan-app1.nrsc.gov.in/data/download/index.php
- Bhuvan services / OGC resources: https://bhuvan-app1.nrsc.gov.in/2dresources/
- Bhuvan portal: https://bhuvan.nrsc.gov.in/

Bhuvan provides Indian geospatial layers and OGC services such as WMS/WMTS/WFS. For a production integration, prefer official Bhuvan service documentation/endpoints over embedding an unofficial map source.

### OpenStreetMap
Open, community-maintained base map for streets, buildings, roads, POIs, and routing-related visualization.
- https://www.openstreetmap.org/

### OpenStreetMap Wiki
- https://wiki.openstreetmap.org/

### Nominatim
OpenStreetMap geocoding/search service.
- https://nominatim.openstreetmap.org/

### Leaflet
Open-source JavaScript library used for the interactive OSM map frontend.
- https://leafletjs.com/
- GitHub: https://github.com/Leaflet/Leaflet

### OpenTopoMap
Optional open topographic basemap.
- https://opentopomap.org/

---

## 7. Frontend / Browser Technologies

### Web Speech API
Useful for rapid prototyping of browser-side voice commands, but production deployment should use an Indian-language ASR model such as IndicConformer.
- MDN: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

### Web Serial API
Useful for connecting supported sensor/e-nose hardware directly to a browser-based control console.
- MDN: https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API

### Web Audio API
Useful for real-time acoustic signal processing and FFT-based analysis.
- MDN: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

---

## 8. Recommended AERIS-SAR AI Stack

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

## 9. Suggested Priority for SIH / Prototype

1. **YOLO** — primary person detection.
2. **Thermal confirmation model** — reduce false positives in smoke/darkness.
3. **CNN/CRNN acoustic model** — detect screams, calls, whistles, knocks.
4. **IndicConformer** — Indian-language voice commands and victim/operator communication.
5. **IndicTrans2** — multilingual communication.
6. **SegFormer** — flood/terrain/obstacle segmentation.
7. **XGBoost / 1D-CNN** — gas/VOC anomaly classification.
8. **Bayesian/weighted fusion** — combine all evidence into one survivor confidence score.
9. **Bhuvan + OpenStreetMap** — Indian geospatial context, mapping, and route visualization.

## 10. Important Implementation Note

For an SIH demonstration, the frontend can simulate model outputs while the actual inference services are developed separately. The final architecture should clearly distinguish:

- **Edge inference:** camera/audio/sensor processing close to the drone.
- **AI inference services:** detection, segmentation, ASR, acoustic classification, sensor classification.
- **Fusion layer:** combines model outputs and sensor evidence.
- **Geospatial layer:** Bhuvan + OpenStreetMap.
- **Operator frontend:** visualization, alerts, voice controls, triage, SITREP, and rescue routing.

Prefer official project repositories and model cards when selecting checkpoints, licenses, datasets, and deployment requirements.
