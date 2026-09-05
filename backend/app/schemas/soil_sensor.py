from pydantic import BaseModel, field_validator
from typing import Optional, Dict, Any, List
import uuid
from datetime import datetime
from app.schemas.geometry_utils import wkb_to_geojson

class SoilMetricReadingResponse(BaseModel):
    id: uuid.UUID
    station_id: uuid.UUID
    moisture_percentage: float
    temperature_celsius: float
    nitrogen_mg_kg: float
    phosphorus_mg_kg: float
    potassium_mg_kg: float
    ec_ds_m: float
    recorded_at: datetime

    class Config:
        from_attributes = True

class SoilSensorStationResponse(BaseModel):
    id: uuid.UUID
    field_id: uuid.UUID
    station_code: str
    location: Optional[Dict[str, Any]] = None
    soil_type: str
    created_at: datetime
    latest_reading: Optional[SoilMetricReadingResponse] = None

    @field_validator("location", mode="before")
    @classmethod
    def convert_wkb_to_geojson(cls, v):
        return wkb_to_geojson(v)

    class Config:
        from_attributes = True

class LoRaWANIngestRequest(BaseModel):
    station_code: str
    hex_payload: str
