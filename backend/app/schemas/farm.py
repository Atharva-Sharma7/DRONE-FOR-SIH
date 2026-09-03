from pydantic import BaseModel, field_validator
from typing import Optional, Dict, Any, List
import uuid
from datetime import datetime
from app.schemas.geometry_utils import wkb_to_geojson


class FarmCreate(BaseModel):
    name: str
    location_name: Optional[str] = None
    boundary: Dict[str, Any]


class FarmResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    name: str
    location_name: Optional[str] = None
    boundary: Optional[Dict[str, Any]] = None
    created_at: datetime

    @field_validator("boundary", mode="before")
    @classmethod
    def convert_wkb_to_geojson(cls, v):
        return wkb_to_geojson(v)

    class Config:
        from_attributes = True


class FarmListResponse(BaseModel):
    farms: List[FarmResponse]
    total: int
