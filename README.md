# 🌾 Intelligent Agricultural Drone Platform

> **Offline-first, multilingual drone analytics platform for cotton and soybean cultivation in Waranga, Maharashtra, India.**
>
> Detects Charcoal Rot, Target Spot, Root-knot Nematodes (RKN), and Yellow Mosaic Disease (YMD) from fused RGB, multispectral, and LiDAR telemetry.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  Level 4: Client (Next.js PWA)                                  │
│  MapLibre 2D · Three.js LiDAR · Recharts · Dexie.js Offline    │
├─────────────────────────────────────────────────────────────────┤
│  Level 3: Cloud Backend (FastAPI + PostgreSQL/PostGIS + MinIO)  │
│  REST API · JWT Auth · PostGIS Spatial Queries · MinIO S3       │
├─────────────────────────────────────────────────────────────────┤
│  Level 2: Edge Processing Pipeline (SIMULATION IN MVP)          │
│  Mock Sensor Ingestor · Mock Inference · Mock Terrain Processor │
├─────────────────────────────────────────────────────────────────┤
│  Level 1: UAV Hardware (NOT connected in Phase 1 MVP)           │
│  NVIDIA Jetson Orin Nano · LiDAR · Multispectral Camera · IMU  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Quick Start (Docker Compose)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) ≥ 4.x
- [Docker Compose](https://docs.docker.com/compose/) v2

### 1. Clone and configure
```bash
git clone <repo-url> drone-platform
cd drone-platform
cp .env.example .env
```

### 2. Launch all services
```bash
docker compose up --build
```

This command will:
1. Start **PostgreSQL 16 + PostGIS 3.4** on port `5432`
2. Start **MinIO** object storage on ports `9000` (API) and `9001` (console)
3. Run **Alembic migrations** to create all PostGIS tables
4. Run the **seeder** to populate Waranga-geolocated mock data
5. Start the **FastAPI backend** on port `8000`
6. Start the **Next.js frontend** on port `3000`

### 3. Access the application
| Service | URL | Notes |
|---|---|---|
| **Frontend (PWA)** | http://localhost:3000 | Main farmer interface |
| **Backend API** | http://localhost:8000 | REST API |
| **API Docs** | http://localhost:8000/docs | Swagger UI |
| **MinIO Console** | http://localhost:9001 | S3 storage browser |

### 4. Demo login credentials
```
Email:    demo@droneplatform.in
Password: demo1234
```

---

## Technology Stack

| Component | Technology | Version |
|---|---|---|
| Frontend | Next.js (App Router) + React | 14.x / 18.x |
| Styling | Tailwind CSS | 3.x |
| 2D Maps | MapLibre GL JS + react-map-gl | Latest |
| 3D LiDAR | Three.js (Potree-ready) | Latest |
| Charts | Recharts | Latest |
| State | Zustand | Latest |
| Offline Cache | Dexie.js (IndexedDB) | Latest |
| i18n | react-i18next | Latest |
| Backend | FastAPI (Python) | 0.111.x |
| Database | PostgreSQL 16 + PostGIS 3.4 | — |
| ORM | SQLAlchemy 2.0 (async) + GeoAlchemy2 | — |
| Auth | python-jose JWT + passlib | — |
| Object Storage | MinIO (S3-compatible) | Latest |
| Containerization | Docker Compose | v3.9 |

---

## Project Structure

```
drone-platform/
├── docker-compose.yml         # All services orchestration
├── .env.example               # Environment variable template
├── README.md
├── backend/                   # FastAPI Python backend
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── alembic/               # Database migrations
│   └── app/
│       ├── main.py            # App factory
│       ├── config.py          # Pydantic Settings
│       ├── database.py        # Async SQLAlchemy
│       ├── models/            # ORM models (PostGIS geometry)
│       ├── schemas/           # Pydantic schemas
│       ├── routers/           # API route handlers
│       ├── services/          # Business logic + interfaces
│       │   └── interfaces.py  # Hardware abstraction ABCs
│       ├── auth/              # JWT authentication
│       └── seed/              # Demo data seeder
└── frontend/                  # Next.js 14 PWA
    ├── Dockerfile
    ├── package.json
    ├── next.config.js         # PWA configuration
    ├── public/
    │   ├── manifest.json      # PWA manifest
    │   └── locales/           # i18n translation files
    │       ├── en/translation.json
    │       ├── hi/translation.json
    │       └── mr/translation.json
    └── src/
        ├── app/               # Next.js App Router pages
        ├── components/        # React components
        ├── hooks/             # Custom hooks
        ├── lib/               # API clients, DB, utils
        ├── store/             # Zustand state stores
        ├── styles/            # Tailwind + CSS variables
        └── types/             # TypeScript interfaces
```

---

## Application Pages

| Page | Route | Description |
|---|---|---|
| **Login** | `/login` | JWT authentication |
| **Dashboard** | `/` | Health score, alerts, water risk, recent missions |
| **Farm Map** | `/map` | MapLibre 2D map with layer toggles |
| **Disease Detections** | `/diseases` | AI predictions with confidence scores |
| **Plant Analytics** | `/analytics` | 14-day NDVI/NDRE trend charts |
| **LiDAR Viewer** | `/lidar` | 3D terrain point cloud + DEM insights |
| **Missions** | `/missions` | Flight log management |

---

## Features

### 🌐 Multilingual
Switch between **English**, **हिंदी (Hindi)**, and **मराठी (Marathi)** from the top bar. All UI text is managed via react-i18next — no hardcoded strings anywhere.

### 🌙 Light / Dark Theme
Full dark mode support via Tailwind CSS `class` strategy. Toggle from the top bar. System preference respected by default.

### 📴 Offline-First
- **Service Worker** caches all static assets (HTML, CSS, JS) via `next-pwa`
- **Dexie.js** (IndexedDB) caches API responses locally
- Application is fully usable in dead zones — shows last synchronized data
- **Sync Queue** tracks pending uploads and auto-resumes when connectivity is restored

### 🗺️ 2D Farm Map
MapLibre GL JS renders the farm boundary, NDVI heatmap, disease detection polygons, elevation contours, and drone flight paths. Click any disease polygon for agronomic details.

### 🔬 Disease Detection
AI predictions for:
- **Charcoal Rot** (*Macrophomina phaseolina*) — soybeans
- **Yellow Mosaic Disease** (YMD / Bean Yellow Mosaic Virus) — soybeans
- **Target Spot** (*Corynespora cassiicola*) — cotton
- **Root-knot Nematodes** (RKN, *Meloidogyne* spp.) — cotton

### 📊 Plant Health Analytics
14-day NDVI and NDRE trend charts per field. Reference lines at stress thresholds. Health zone breakdown (Healthy / Mild / Moderate / Severe Stress).

### 🏔️ LiDAR Terrain Viewer
Three.js-rendered point cloud simulating ground and canopy returns, color-coded by elevation. DEM-derived insights: water pooling risk zones, slope analysis, drainage direction.

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `POSTGRES_USER` | PostgreSQL username | `droneuser` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `dronepass` |
| `POSTGRES_DB` | Database name | `dronedb` |
| `SECRET_KEY` | JWT signing secret | **Change in production!** |
| `USE_MOCK_DRONE` | Enable demo/simulation mode | `true` |
| `MINIO_ROOT_USER` | MinIO access key | `minioadmin` |
| `MINIO_ROOT_PASSWORD` | MinIO secret key | `minioadmin` |
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | `http://localhost:8000` |
| `NEXT_PUBLIC_MAP_STYLE` | MapLibre style URL | MapLibre demo tiles |

---

## Hardware Abstraction (Future Production Integration)

All hardware-dependent services implement Python Abstract Base Classes defined in [`backend/app/services/interfaces.py`](./backend/app/services/interfaces.py):

```python
class SensorDataIngestor(ABC): ...
class InferenceService(ABC): ...
class TerrainProcessor(ABC): ...
class StorageService(ABC): ...
```

To connect a real **NVIDIA Jetson Orin Nano** with TensorRT inference:
1. Set `USE_MOCK_DRONE=false` in `.env`
2. Implement `JetsonSensorIngestor`, `TensorRTInferenceService`, `LiDARTerrainProcessor`
3. Register them in `backend/app/services/dependencies.py`

No changes to routers, schemas, or business logic are required.

---

## MVP Roadmap

| Phase | Status | Description |
|---|---|---|
| **Phase 1 — MVP** | ✅ Current | Simulation mode, full UI, PostGIS backend, mock data |
| **Phase 2 — Integration** | 🔜 Planned | Jetson Orin Nano, real TensorRT inference, live telemetry |
| **Phase 3 — Production** | 🔜 Planned | LoRaWAN soil sensors, RTK GNSS, FPGA acceleration |

---

## API Documentation

When the backend is running, visit http://localhost:8000/docs for full interactive Swagger UI documentation covering all endpoints.

Key endpoints:
- `POST /api/v1/auth/login` — authenticate and get JWT
- `GET /api/v1/farms` — list farms with PostGIS boundaries
- `GET /api/v1/fields/{id}/layers` — GeoJSON FeatureCollection for map layers
- `GET /api/v1/predictions` — paginated AI predictions (filterable by severity, bbox)
- `GET /api/v1/terrain/{field_id}` — DEM metrics + Potree URL
- `GET /api/v1/alerts` — alert feed

---

## License

MIT License — See [LICENSE](./LICENSE) for details.

---

> **Built for Waranga, Maharashtra, India 🇮🇳** — Empowering smallholder farmers with AI-driven drone analytics.
