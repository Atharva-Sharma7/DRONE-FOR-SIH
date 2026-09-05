from fastapi import APIRouter, Depends
from app.auth.dependencies import get_current_user
from app.models.user import User
import time, math

router = APIRouter()

# Realistic sensor profiles per field (Waranga black soil)
FIELD_SENSOR_PROFILES = {
    "default": {
        "vwc_pct": 32.0,       # volumetric water content
        "ph": 7.8,              # black cotton soil pH
        "ec_ds_m": 0.42,        # electrical conductivity
        "temp_c": 28.5,         # soil temp at 10cm
        "nitrogen_ppm": 18.0,
        "phosphorus_ppm": 12.5,
        "potassium_ppm": 210.0,
    }
}

def _add_noise(base: float, pct: float = 0.03) -> float:
    """Add small realistic fluctuation based on current time."""
    t = time.time()
    noise = math.sin(t / 60) * base * pct
    return round(base + noise, 2)

@router.get("/{field_id}")
async def get_soil_readings(
    field_id: str,
    current_user: User = Depends(get_current_user)
):
    """Returns mock real-time soil sensor readings for a field."""
    profile = FIELD_SENSOR_PROFILES.get(field_id, FIELD_SENSOR_PROFILES["default"])
    now = time.time()
    # Simulate diurnal temperature variation
    hour_frac = (now % 86400) / 86400
    temp_variation = 4 * math.sin((hour_frac - 0.25) * 2 * math.pi)
    return {
        "field_id": field_id,
        "timestamp": round(now),
        "readings": {
            "vwc_pct": _add_noise(profile["vwc_pct"]),
            "ph": _add_noise(profile["ph"], 0.01),
            "ec_ds_m": _add_noise(profile["ec_ds_m"]),
            "temp_c": round(profile["temp_c"] + temp_variation + _add_noise(0, 0.5), 1),
            "nitrogen_ppm": _add_noise(profile["nitrogen_ppm"]),
            "phosphorus_ppm": _add_noise(profile["phosphorus_ppm"]),
            "potassium_ppm": _add_noise(profile["potassium_ppm"]),
        },
        "sensor_status": "active",
        "battery_pct": 87.0,
        "location": {"lat": 21.1458, "lng": 79.0530},
    }

@router.get("/")
async def list_active_sensors(
    current_user: User = Depends(get_current_user)
):
    """Returns list of active sensor nodes."""
    return {
        "sensors": [
            {"id": "node-01", "field": "Cotton North", "status": "active", "battery_pct": 87},
            {"id": "node-02", "field": "Soybean East", "status": "active", "battery_pct": 62},
            {"id": "node-03", "field": "Mixed South", "status": "active", "battery_pct": 91},
        ],
        "total": 3
    }
