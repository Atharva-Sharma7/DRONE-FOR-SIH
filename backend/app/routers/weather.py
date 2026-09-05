from fastapi import APIRouter, Depends, HTTPException
from app.auth.dependencies import get_current_user
from app.models.user import User
import httpx

router = APIRouter()

WARANGA_LAT = 21.1458
WARANGA_LNG = 79.0530

@router.get("/current")
async def get_current_weather(
    lat: float = WARANGA_LAT,
    lon: float = WARANGA_LNG,
    current_user: User = Depends(get_current_user)
):
    """
    Fetches current weather from Open-Meteo (free, no API key).
    Defaults to Waranga, Maharashtra coordinates.
    """
    url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        f"&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,"
        f"weather_code,apparent_temperature,cloud_cover"
        f"&daily=precipitation_probability_max,temperature_2m_max,temperature_2m_min"
        f"&timezone=Asia/Kolkata"
        f"&forecast_days=3"
    )
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            data = resp.json()
        current = data.get("current", {})
        daily = data.get("daily", {})
        return {
            "location": {"lat": lat, "lon": lon, "name": "Waranga, Maharashtra"},
            "current": {
                "temperature_c": current.get("temperature_2m"),
                "feels_like_c": current.get("apparent_temperature"),
                "humidity_pct": current.get("relative_humidity_2m"),
                "precipitation_mm": current.get("precipitation"),
                "wind_speed_kmh": current.get("wind_speed_10m"),
                "cloud_cover_pct": current.get("cloud_cover"),
                "weather_code": current.get("weather_code"),
            },
            "forecast_3day": [
                {
                    "date": daily["time"][i] if daily.get("time") else None,
                    "max_temp_c": daily["temperature_2m_max"][i] if daily.get("temperature_2m_max") else None,
                    "min_temp_c": daily["temperature_2m_min"][i] if daily.get("temperature_2m_min") else None,
                    "rain_probability_pct": daily["precipitation_probability_max"][i] if daily.get("precipitation_probability_max") else None,
                }
                for i in range(min(3, len(daily.get("time", []))))
            ]
        }
    except httpx.TimeoutException:
        raise HTTPException(status_code=503, detail="Weather service timeout")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Weather service error: {str(e)}")
