from fastapi import APIRouter, Depends
from app.auth.dependencies import get_current_user
from app.models.user import User
from datetime import date, timedelta
import math

router = APIRouter()

def _generate_ndvi_series(crop_type: str, days: int = 30):
    """
    Generates a realistic NDVI/NDRE timeseries for the given crop.
    Soybean peaks earlier; cotton has a broader plateau.
    """
    series = []
    today = date.today()
    for i in range(days):
        d = today - timedelta(days=days - 1 - i)
        t = i / days  # 0 to 1
        if crop_type == "soybean":
            # Peak at ~60% through season
            ndvi = 0.35 + 0.42 * math.sin(t * math.pi) + 0.03 * math.sin(t * 6 * math.pi)
            ndre = 0.15 + 0.32 * math.sin(t * math.pi) + 0.02 * math.sin(t * 5 * math.pi)
        elif crop_type == "cotton":
            # Slower ramp, broad plateau
            ndvi = 0.28 + 0.38 * (1 - math.exp(-t * 4)) + 0.02 * math.sin(t * 7 * math.pi)
            ndre = 0.12 + 0.28 * (1 - math.exp(-t * 3)) + 0.015 * math.sin(t * 6 * math.pi)
        else:
            ndvi = 0.30 + 0.35 * math.sin(t * math.pi)
            ndre = 0.12 + 0.25 * math.sin(t * math.pi)
        series.append({
            "date": d.isoformat(),
            "ndvi": round(max(0.1, min(0.9, ndvi)), 4),
            "ndre": round(max(0.05, min(0.7, ndre)), 4),
        })
    return series

@router.get("/fields/{field_id}/timeseries")
async def get_ndvi_timeseries(
    field_id: str,
    days: int = 30,
    current_user: User = Depends(get_current_user)
):
    """Returns 30-day NDVI/NDRE timeseries for a field."""
    # Map field_id hints to crop type (fallback: mixed)
    crop = "mixed"
    field_id_lower = field_id.lower()
    if "cotton" in field_id_lower:
        crop = "cotton"
    elif "soybean" in field_id_lower:
        crop = "soybean"
    return {
        "field_id": field_id,
        "crop_type": crop,
        "days": days,
        "series": _generate_ndvi_series(crop, min(days, 90))
    }

@router.get("/fields/all/comparison")
async def get_ndvi_comparison(
    current_user: User = Depends(get_current_user)
):
    """Returns NDVI comparison across all 3 fields for last 30 days."""
    return {
        "cotton_north": _generate_ndvi_series("cotton", 30),
        "soybean_east": _generate_ndvi_series("soybean", 30),
        "mixed_south": _generate_ndvi_series("mixed", 30),
    }
