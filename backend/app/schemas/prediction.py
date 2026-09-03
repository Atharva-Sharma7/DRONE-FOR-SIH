from pydantic import BaseModel, field_validator
from typing import Optional, Dict, Any, List
import uuid
from datetime import datetime
from app.schemas.geometry_utils import wkb_to_geojson
from app.models.prediction import SeverityEnum


class PredictionResponse(BaseModel):
    id: uuid.UUID
    mission_id: uuid.UUID
    disease_class: str
    confidence: float
    severity: SeverityEnum
    affected_area_ha: float
    geom: Optional[Dict[str, Any]] = None
    recommended_action: str
    created_at: datetime

    @field_validator("geom", mode="before")
    @classmethod
    def convert_wkb_to_geojson(cls, v):
        return wkb_to_geojson(v)

    class Config:
        from_attributes = True


class PaginatedPredictionsResponse(BaseModel):
    items: List[PredictionResponse]
    total: int
    page: int
    page_size: int

