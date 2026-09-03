from pydantic import BaseModel, field_validator
from typing import Optional, Dict, Any, List
import uuid
from app.schemas.geometry_utils import wkb_to_geojson
from app.models.terrain_metric import MetricType


class TerrainMetricResponse(BaseModel):
    id: uuid.UUID
    field_id: uuid.UUID
    metric_type: MetricType
    value: float
    description: Optional[str] = None
    geom: Optional[Dict[str, Any]] = None

    @field_validator("geom", mode="before")
    @classmethod
    def convert_wkb_to_geojson(cls, v):
        return wkb_to_geojson(v)

    class Config:
        from_attributes = True


class TerrainResponse(BaseModel):
    metrics: List[TerrainMetricResponse]
    potree_url: str

