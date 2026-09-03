from pydantic import BaseModel, field_validator
from typing import Optional, Dict, Any, List
import uuid
from datetime import datetime
from app.schemas.geometry_utils import wkb_to_geojson
from app.models.field import CropType


class FieldCreate(BaseModel):
    name: str
    crop_type: CropType
    boundary: Dict[str, Any]


class FieldResponse(BaseModel):
    id: uuid.UUID
    farm_id: uuid.UUID
    name: str
    crop_type: CropType
    boundary: Optional[Dict[str, Any]] = None
    created_at: datetime

    @field_validator("boundary", mode="before")
    @classmethod
    def convert_wkb_to_geojson(cls, v):
        return wkb_to_geojson(v)

    class Config:
        from_attributes = True


class FieldLayersResponse(BaseModel):
    type: str = "FeatureCollection"
    features: List[Dict[str, Any]]

