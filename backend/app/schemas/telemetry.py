from pydantic import BaseModel, field_validator
from typing import Optional, Dict, Any, List
import uuid
from datetime import datetime
from app.schemas.geometry_utils import wkb_to_geojson

class TelemetryIngestRequest(BaseModel):
    drone_id: uuid.UUID
    mission_id: Optional[uuid.UUID] = None
    lat: float
    lng: float
    altitude_m: float
    velocity_m_s: float = 0.0
    heading_deg: float = 0.0
    pitch_deg: float = 0.0
    roll_deg: float = 0.0
    battery_percentage: float
    rtk_fix_status: str = "FIXED_4D"
    signal_rssi_dbm: float = -65.0
    jetson_temp_celsius: float = 45.2
    metadata: Optional[Dict[str, Any]] = None

class TelemetryResponse(BaseModel):
    id: uuid.UUID
    drone_id: uuid.UUID
    mission_id: Optional[uuid.UUID] = None
    location: Optional[Dict[str, Any]] = None
    altitude_m: float
    velocity_m_s: float
    heading_deg: float
    pitch_deg: float
    roll_deg: float
    battery_percentage: float
    rtk_fix_status: str
    signal_rssi_dbm: float
    jetson_temp_celsius: float
    timestamp: datetime

    @field_validator("location", mode="before")
    @classmethod
    def convert_wkb_to_geojson(cls, v):
        return wkb_to_geojson(v)

    class Config:
        from_attributes = True
