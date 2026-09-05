from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.mission import Mission, MissionStatus
from app.auth.dependencies import get_current_user
from app.models.user import User
from typing import Optional
import math, time

router = APIRouter()

FLIGHT_PATH = [
    [79.0440, 21.1380], [79.0440, 21.1540],
    [79.0475, 21.1540], [79.0475, 21.1380],
    [79.0510, 21.1380], [79.0510, 21.1540],
    [79.0545, 21.1540], [79.0545, 21.1380],
    [79.0580, 21.1380], [79.0580, 21.1540],
    [79.0620, 21.1540], [79.0620, 21.1380],
]
CYCLE_SECONDS = 120  # full loop in 120 seconds

@router.get("/live")
async def get_live_position(
    current_user: User = Depends(get_current_user)
):
    """Returns simulated current drone position cycling along the flight path."""
    now = time.time()
    t = (now % CYCLE_SECONDS) / CYCLE_SECONDS  # 0.0 to 1.0
    total_points = len(FLIGHT_PATH) - 1
    idx_float = t * total_points
    idx = int(idx_float)
    frac = idx_float - idx
    if idx >= total_points:
        idx = total_points - 1
        frac = 1.0
    p1 = FLIGHT_PATH[idx]
    p2 = FLIGHT_PATH[min(idx + 1, total_points)]
    lng = p1[0] + (p2[0] - p1[0]) * frac
    lat = p1[1] + (p2[1] - p1[1]) * frac
    altitude = 80 + 10 * math.sin(t * 2 * math.pi)  # 80-90m AGL
    speed = 8.5 + 1.5 * math.sin(t * 4 * math.pi)   # 7-10 m/s
    return {
        "lat": round(lat, 6),
        "lng": round(lng, 6),
        "altitude_m": round(altitude, 1),
        "speed_ms": round(speed, 1),
        "heading_deg": round((t * 360) % 360, 1),
        "battery_pct": round(100 - t * 60, 1),  # drains from 100% to 40%
        "signal_strength": "strong" if t < 0.8 else "medium",
        "timestamp": round(now),
        "status": "flying",
    }

@router.get("/mission/{mission_id}/path")
async def get_mission_path(
    mission_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Returns the full flight path for a given mission as GeoJSON LineString."""
    return {
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": FLIGHT_PATH
        },
        "properties": {
            "mission_id": mission_id,
            "total_waypoints": len(FLIGHT_PATH),
        }
    }
