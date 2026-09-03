from pydantic import BaseModel
from typing import Optional, List
import uuid
from datetime import datetime
from app.models.mission import MissionStatus

class MissionCreate(BaseModel):
    farm_id: uuid.UUID
    drone_id: uuid.UUID
    field_id: Optional[uuid.UUID] = None
    sensors_used: List[str]

class MissionResponse(BaseModel):
    id: uuid.UUID
    farm_id: uuid.UUID
    drone_id: uuid.UUID
    field_id: Optional[uuid.UUID]
    start_time: datetime
    end_time: Optional[datetime]
    status: MissionStatus
    coverage_area_ha: float
    sensors_used: List[str]
    created_at: datetime

    class Config:
        from_attributes = True

class MissionSyncRequest(BaseModel):
    chunk_index: int
    total_chunks: int
    checksum: str
    dataset_type: str
